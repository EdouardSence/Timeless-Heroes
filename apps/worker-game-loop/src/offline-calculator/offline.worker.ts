/**
 * Offline Worker
 * BullMQ worker that processes offline calculation jobs
 */

import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Job, Worker } from 'bullmq';

import { getRedisConfig } from '@repo/redis-client';
import { IOfflineCalculation, QueueName } from '@repo/shared-types';
import { OfflineCalculatorService } from './offline-calculator.service';

interface IOfflineJobData {
  userId: string;
  disconnectedAt: string;
  reconnectedAt: string;
  passiveMultiplier: number;
  pendingPrograms: Array<{
    programId: string;
    programSlug: string;
    estimatedEndAt: string;
  }>;
}

@Injectable()
export class OfflineWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OfflineWorker.name);
  private worker!: Worker<IOfflineJobData, IOfflineCalculation>;
  
  constructor(
    private readonly offlineCalculator: OfflineCalculatorService,
  ) {}
  
  async onModuleInit() {
    this.logger.log('Initializing Offline Worker...');
    
    this.worker = new Worker<IOfflineJobData, IOfflineCalculation>(
      QueueName.OFFLINE_CALCULATION,
      async (job: Job<IOfflineJobData>) => this.processOffline(job),
      {
        connection: getRedisConfig(),
        concurrency: 10,
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
      this.logger.error(`Offline calculation failed for ${job?.data.userId}: ${err.message}`);
    });
    
    this.logger.log('Offline Worker initialized');
  }
  
  async onModuleDestroy() {
    await this.worker.close();
  }
  
  /**
   * Process offline calculation job
   */
  private async processOffline(job: Job<IOfflineJobData>): Promise<IOfflineCalculation> {
    const { userId, disconnectedAt, reconnectedAt, passiveMultiplier, pendingPrograms } = job.data;
    
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
    
    // 4. Process completed programs (would trigger program completion in production)
    // For each completed program, we'd call the program processor
    
    // 5. Update user progression (via gRPC/DB in production)
    /*
    if (BigInt(calculation.earnedLoc) > 0n) {
      await progressionClient.updateBalance(userId, calculation.earnedLoc);
      await progressionClient.addExperience(userId, calculation.earnedExp);
    }
    */
    
    // 6. Log and return
    this.logger.log(
      `Offline rewards for ${userId}: +${calculation.earnedLoc} LoC, ` +
      `${completedProgramIds.length} programs completed`,
    );
    
    return calculation;
  }
}
