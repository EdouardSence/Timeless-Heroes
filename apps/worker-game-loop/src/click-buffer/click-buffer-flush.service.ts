/**
 * Click Buffer Flush Service
 * Schedules periodic buffer flush jobs
 * 
 * This service runs on a schedule (every 5 seconds) and:
 * 1. Scans Redis for all users with pending click buffers
 * 2. Atomically reads and clears each buffer
 * 3. Creates BullMQ jobs to persist to PostgreSQL
 */

import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bullmq';

import { ClickBufferService, getRedisClient } from '@repo/redis-client';
import { QueueName } from '@repo/shared-types';

interface IBufferFlushJob {
  userId: string;
  clicks: number;
  locToAdd: string;
  timestamp: number;
}

@Injectable()
export class ClickBufferFlushService implements OnModuleInit {
  private readonly logger = new Logger(ClickBufferFlushService.name);
  private isProcessing = false;

  constructor(
    @InjectQueue(QueueName.CLICK_BUFFER)
    private readonly bufferQueue: Queue<IBufferFlushJob>,
    private readonly clickBufferService: ClickBufferService,
  ) { }

  onModuleInit() {
    this.logger.log('📦 Click Buffer Flush Service initialized');
    this.logger.log('⏰ Flush schedule: every 5 seconds');
  }

  /**
   * Scheduled task: Flush all pending buffers
   * Runs every 5 seconds
   */
  @Cron('*/5 * * * * *') // Every 5 seconds
  async flushAllBuffers(): Promise<void> {
    // Prevent concurrent runs
    if (this.isProcessing) {
      this.logger.debug('Flush already in progress, skipping');
      return;
    }

    this.isProcessing = true;
    const startTime = Date.now();

    try {
      // 1. Get all users with pending buffers
      const userIds = await this.clickBufferService.getAllBufferedUsers();

      if (userIds.length === 0) {
        this.isProcessing = false;
        return;
      }

      this.logger.debug(`Flushing buffers for ${userIds.length} users`);

      // 2. Atomically flush each user's buffer and create jobs
      const jobs: { name: string; data: IBufferFlushJob }[] = [];

      for (const userId of userIds) {
        // Atomic get-and-clear operation
        const buffer = await this.clickBufferService.flushBuffer(userId);

        if (!buffer || buffer.clicks === 0) {
          continue;
        }

        jobs.push({
          name: `flush-${userId}-${Date.now()}`,
          data: {
            userId,
            clicks: buffer.clicks,
            locToAdd: buffer.locToAdd,
            timestamp: Date.now(),
          },
        });
      }

      // 3. Bulk add jobs to queue
      if (jobs.length > 0) {
        await this.bufferQueue.addBulk(jobs);

        const totalClicks = jobs.reduce((sum, j) => sum + j.data.clicks, 0);
        const elapsed = Date.now() - startTime;

        this.logger.log(
          `📤 Queued ${jobs.length} flush jobs (${totalClicks} clicks) in ${elapsed}ms`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Buffer flush failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Manual flush for a specific user (e.g., on disconnect)
   */
  async flushUser(userId: string): Promise<void> {
    const buffer = await this.clickBufferService.flushBuffer(userId);

    if (!buffer || buffer.clicks === 0) {
      return;
    }

    await this.bufferQueue.add(`flush-${userId}-immediate`, {
      userId,
      clicks: buffer.clicks,
      locToAdd: buffer.locToAdd,
      timestamp: Date.now(),
    }, {
      priority: 1, // High priority for immediate flush
    });

    this.logger.debug(`Immediate flush queued for ${userId}`);
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
  }> {
    const [waiting, active, completed, failed] = await Promise.all([
      this.bufferQueue.getWaitingCount(),
      this.bufferQueue.getActiveCount(),
      this.bufferQueue.getCompletedCount(),
      this.bufferQueue.getFailedCount(),
    ]);

    return { waiting, active, completed, failed };
  }
}
