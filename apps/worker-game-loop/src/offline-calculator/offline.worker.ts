/**
 * Offline Worker
 * BullMQ worker that processes offline calculation jobs
 */

import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { getRedisConfig } from '@repo/redis-client';
import { IOfflineCalculation, QueueName } from '@repo/shared-types';
import { Job, Worker } from 'bullmq';

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

@Injectable()
export class OfflineWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OfflineWorker.name);
  private worker!: Worker<IOfflineJobData, IOfflineCalculation>;

  constructor(private readonly offlineCalculator: OfflineCalculatorService) {}

  onModuleInit() {
    this.logger.log('Initializing Offline Worker...');

    this.worker = new Worker<IOfflineJobData, IOfflineCalculation>(
      QueueName.OFFLINE_CALCULATION,
      // eslint-disable-next-line @typescript-eslint/require-await
      async (job: Job<IOfflineJobData>) => this.processOffline(job),
      {
        concurrency: 10,
        connection: getRedisConfig(),
      },
    );

    this.worker.on('completed', (job, result) => {
      const earnedLoc = BigInt(result.earnedLoc);
      this.logger.log(
        `Offline processed for ${job.data.userId}: +${earnedLoc} LoC ` +
          `(${this.offlineCalculator.formatDuration(result.effectiveDuration)} offline)`,
      );
    });

    this.worker.on('failed', (job, err) => {
      this.logger.error(
        `Offline calculation failed for ${job?.data.userId}: ${err.message}`,
      );
    });

    this.logger.log('Offline Worker initialized');
  }

  async onModuleDestroy() {
    await this.worker.close();
  }

  /**
   * Process offline calculation job
   */
  private processOffline(job: Job<IOfflineJobData>): IOfflineCalculation {
    const {
      disconnectedAt,
      passiveMultiplier,
      pendingPrograms,
      reconnectedAt,
      userId,
    } = job.data;

    this.logger.debug(`Processing offline calculation for ${userId}`);

    // 1. Get user's offline stats
    const stats = this.offlineCalculator.getUserOfflineStats(userId);
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

    // 4. Process completed programs (would trigger program completion in production)
    // For each completed program, we'd call the program processor

    // 5. Update user progression (via gRPC/DB in production)
    // When ready: progressionClient.updateBalance(userId, calculation.earnedLoc)

    // 6. Log and return
    this.logger.log(
      `Offline rewards for ${userId}: +${calculation.earnedLoc} LoC, ` +
        `${completedProgramIds.length} programs completed`,
    );

    return calculation;
  }
}
