/**
 * Offline Worker
 * BullMQ worker that processes offline calculation jobs.
 *
 * Uses the NestJS-native @Processor / WorkerHost pattern — consistent with
 * ClickBufferWorker — so that NestJS fully manages the worker lifecycle,
 * dependency injection, and event hooks instead of a manual `new Worker(...)`.
 */

import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  IOfflineCalculation,
  NATS_SERVICE,
  NatsPattern,
  QueueName,
} from '@repo/shared-types';
import { Job } from 'bullmq';
import { firstValueFrom } from 'rxjs';

import { OfflineCalculatorService } from './offline-calculator.service';

interface IOfflineJobData {
  disconnectedAt: string;
  passiveMultiplier: number;
  pendingPrograms: {
    programId: string;
    programSlug: string;
    estimatedEndAt: string;
  }[];
  reconnectedAt: string;
  userId: string;
}

@Processor(QueueName.OFFLINE_CALCULATION, {
  concurrency: 10,
})
export class OfflineWorker extends WorkerHost {
  private readonly logger = new Logger(OfflineWorker.name);

  constructor(
    private readonly offlineCalculator: OfflineCalculatorService,
    @Inject(NATS_SERVICE.PROGRESSION)
    private readonly progressionClient: ClientProxy,
  ) {
    super();
  }

  /**
   * Process a single offline calculation job
   */
  async process(job: Job<IOfflineJobData>): Promise<IOfflineCalculation> {
    const {
      disconnectedAt,
      passiveMultiplier,
      pendingPrograms,
      reconnectedAt,
      userId,
    } = job.data;

    this.logger.debug(`Processing offline calculation for ${userId}`);

    // 1. Get user's offline stats
    const stats = await this.offlineCalculator.getUserOfflineStats(userId);
    stats.passiveMultiplier = passiveMultiplier || stats.passiveMultiplier;

    // 2. Calculate offline progression
    const calculation = this.offlineCalculator.calculateOfflineProgression(
      new Date(disconnectedAt),
      new Date(reconnectedAt),
      stats,
    );
    calculation.userId = userId;

    // 3. Check for completed programs
    const completedProgramIds = this.offlineCalculator.checkCompletedPrograms(
      new Date(disconnectedAt),
      new Date(reconnectedAt),
      pendingPrograms.map((p) => ({
        ...p,
        estimatedEndAt: new Date(p.estimatedEndAt),
      })),
    );

    // 4. Credit offline rewards via NATS -> svc-user-progression
    if (BigInt(calculation.earnedLoc) > 0n) {
      await firstValueFrom(
        this.progressionClient.send(NatsPattern.PROGRESSION_UPDATE_BALANCE, {
          delta: calculation.earnedLoc,
          userId,
        }),
      );

      await firstValueFrom(
        this.progressionClient.send(NatsPattern.PROGRESSION_ADD_EXPERIENCE, {
          experience: Number.parseInt(calculation.earnedExp, 10),
          userId,
        }),
      );
    }

    this.logger.log(
      `Offline rewards for ${userId}: +${calculation.earnedLoc} LoC, ` +
        `${completedProgramIds.length} programs completed`,
    );

    return calculation;
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<IOfflineJobData>, result: IOfflineCalculation) {
    const earnedLoc = BigInt(result.earnedLoc);
    this.logger.log(
      `Offline processed for ${job.data.userId}: +${earnedLoc} LoC ` +
        `(${this.offlineCalculator.formatDuration(result.effectiveDuration)} offline)`,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<IOfflineJobData>, error: Error) {
    this.logger.error(
      `Offline calculation failed for ${job.data.userId}: ${error.message}`,
    );
  }
}
