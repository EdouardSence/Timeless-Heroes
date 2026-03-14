/**
 * Click Buffer Worker
 * BullMQ Worker that processes buffer flush jobs
 * 
 * Architecture:
 * 1. ClickBufferFlushService schedules periodic flush (every 5s)
 * 2. Flush collects all pending clicks from Redis
 * 3. This worker processes each user's buffer and persists via NATS to svc-user-progression
 */

import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Job } from 'bullmq';
import { firstValueFrom } from 'rxjs';

import { RedisKeys } from '@repo/redis-client';
import { IProgressionData, NATS_SERVICE, NatsPattern, QueueName, IBufferFlushResult } from '@repo/shared-types';

interface IBufferFlushJob {
  userId: string;
  clicks: number;
  locToAdd: string;
  timestamp: number;
}

@Processor(QueueName.CLICK_BUFFER, {
  concurrency: 10, // Process 10 users in parallel
  limiter: {
    max: 100,
    duration: 1000, // Max 100 jobs per second
  },
})
export class ClickBufferWorker extends WorkerHost {
  private readonly logger = new Logger(ClickBufferWorker.name);

  constructor(
    @Inject(NATS_SERVICE.PROGRESSION) private readonly progressionClient: ClientProxy,
    @Inject('REDIS_CLIENT') private readonly redis: import('ioredis').default,
  ) {
    super();
  }

  /**
   * Process a single buffer flush job
   * Persists accumulated clicks to PostgreSQL via NATS -> svc-user-progression
   */
  async process(job: Job<IBufferFlushJob>): Promise<IBufferFlushResult> {
    const { userId, clicks, locToAdd } = job.data;
    const startTime = Date.now();

    this.logger.debug(
      `Processing buffer flush for ${userId}: ${clicks} clicks, ${locToAdd} LoC`,
    );

    try {
      // 1. Update balance via NATS -> svc-user-progression (persists to PostgreSQL)
      const updatedProgression = await firstValueFrom(
        this.progressionClient.send<IProgressionData>(NatsPattern.PROGRESSION_UPDATE_BALANCE, {
          userId,
          delta: locToAdd,
        }),
      );

      // 2. Add experience (1 XP per click) via NATS
      await firstValueFrom(
        this.progressionClient.send<IProgressionData>(NatsPattern.PROGRESSION_ADD_EXPERIENCE, {
          userId,
          experience: clicks,
        }),
      );

      // 3. Leaderboard sync is handled inside svc-user-progression::updateBalance()
      //    (via LeaderboardSyncService.syncUserScore — updates global, weekly, daily).
      //    No need to call leaderboardService.updateScore() here — doing so was redundant
      //    and a source of the double-update path (Bug B).

      // 4. Publish level-up event if applicable
      if (updatedProgression.level > 1) {
        await this.publishLevelUp(userId, updatedProgression.level);
      }

      const processingTime = Date.now() - startTime;
      this.logger.debug(
        `Buffer flush completed for ${userId} in ${processingTime}ms`,
      );

      return {
        success: true,
        userId,
        clicksProcessed: clicks,
        locAdded: locToAdd,
        newBalance: updatedProgression.linesOfCode,
        newLevel: updatedProgression.level,
        processingTimeMs: processingTime,
      };
    } catch (error) {
      this.logger.error(
        `Failed to flush buffer for ${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      // Re-add to buffer on failure (so data isn't lost)
      await this.reAddToBuffer(userId, locToAdd, clicks);

      return {
        success: false,
        userId,
        clicksProcessed: 0,
        locAdded: '0',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Publish level up event for real-time notification
   */
  private async publishLevelUp(userId: string, newLevel: number): Promise<void> {
    await this.redis.publish(
      RedisKeys.CHANNEL_ACHIEVEMENT,
      JSON.stringify({
        type: 'LEVEL_UP',
        userId,
        level: newLevel,
        timestamp: Date.now(),
      }),
    );
  }

  /**
   * Re-add to buffer if flush fails (data recovery).
   * Uses HINCRBY/HINCRBYFLOAT to match the hash type written by ClickBufferService.
   * A Lua SET was previously used here, causing a WRONGTYPE conflict.
   */
  private async reAddToBuffer(userId: string, locToAdd: string, clicks: number): Promise<void> {
    const key = RedisKeys.CLICK_BUFFER(userId);

    try {
      // Atomically increment both hash fields — same type as ClickBufferService.incrementBuffer
      await this.redis.hincrby(key, 'clicks', clicks);
      await this.redis.hincrbyfloat(key, 'locToAdd', Number(locToAdd));
      this.logger.warn(`Re-added ${clicks} clicks to buffer for ${userId} after flush failure`);
    } catch (error) {
      this.logger.error(`Failed to re-add to buffer for ${userId}: ${error}`);
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<IBufferFlushJob>) {
    this.logger.debug(`Job ${job.id} completed for user ${job.data.userId}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<IBufferFlushJob>, error: Error) {
    this.logger.error(`Job ${job.id} failed for user ${job.data.userId}: ${error.message}`);
  }
}
