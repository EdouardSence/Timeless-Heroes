/**
 * Click Buffer Flush Service
 * Schedules periodic buffer flush jobs
 *
 * This service runs on a schedule (every 5 seconds) and:
 * 1. Acquires a distributed Redis lock (prevents multi-replica conflicts)
 * 2. Scans Redis for all users with pending click buffers
 * 3. Atomically reads and clears each buffer
 * 4. Creates BullMQ jobs to persist to PostgreSQL
 *
 * SCALABILITY NOTE:
 * The @Cron decorator fires on every replica, but only one replica acquires
 * the distributed lock (SET NX with 10s TTL). Other replicas skip gracefully.
 * This allows safe horizontal scaling of worker-game-loop instances.
 */

import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ClickBufferService, DistributedLock } from '@repo/redis-client';
import { QueueName } from '@repo/shared-types';
import { Queue } from 'bullmq';

import type Redis from 'ioredis';

/** Lock key for the flush cron — only one replica can flush at a time */
const FLUSH_LOCK_KEY = 'lock:click-buffer-flush';
/** Lock TTL in seconds — must be longer than the worst-case flush duration */
const FLUSH_LOCK_TTL_SECONDS = 10;

interface IBufferFlushJob {
  clicks: number;
  locToAdd: string;
  timestamp: number;
  userId: string;
}

@Injectable()
export class ClickBufferFlushService implements OnModuleInit {
  private readonly logger = new Logger(ClickBufferFlushService.name);
  private readonly distributedLock: DistributedLock;

  constructor(
    @InjectQueue(QueueName.CLICK_BUFFER)
    private readonly bufferQueue: Queue<IBufferFlushJob>,
    private readonly clickBufferService: ClickBufferService,
    @Inject('REDIS_CLIENT') redis: Redis,
  ) {
    this.distributedLock = new DistributedLock(redis);
  }

  onModuleInit() {
    this.logger.log('Click Buffer Flush Service initialized');
    this.logger.log('Flush schedule: every 5 seconds (distributed lock)');
  }

  /**
   * Scheduled task: Flush all pending buffers
   * Runs every 5 seconds on every replica, but only one acquires the lock.
   *
   * Multi-replica safe: uses DistributedLock (Redis SET NX) so that only
   * a single replica performs the flush per cycle. Other replicas skip.
   */
  @Cron('*/5 * * * * *')
  async flushAllBuffers(): Promise<void> {
    // Distributed lock: only one replica runs the flush per cycle
    const result = await this.distributedLock.withLock(
      FLUSH_LOCK_KEY,
      () => this.executeFlush(),
      FLUSH_LOCK_TTL_SECONDS,
    );

    if (result === null) {
      this.logger.debug('Another replica holds the flush lock, skipping');
    }
  }

  /**
   * Core flush logic — only executed by the replica that acquires the lock.
   */
  private async executeFlush(): Promise<number> {
    const startTime = Date.now();

    try {
      // 1. Get all users with pending buffers
      const userIds = await this.clickBufferService.getAllBufferedUsers();

      if (userIds.length === 0) {
        return 0;
      }

      this.logger.debug(`Flushing buffers for ${userIds.length} users`);

      // 2. Atomically flush each user's buffer and create jobs
      const jobs: { name: string; data: IBufferFlushJob }[] = [];

      for (const userId of userIds) {
        // Atomic get-and-clear operation (Lua script — no data loss)
        const buffer = await this.clickBufferService.flushBuffer(userId);

        if (!buffer || buffer.clicks === 0) {
          continue;
        }

        // Set in-flight marker BEFORE enqueueing the job.
        // This ensures getCurrentProgression() includes this LOC even though
        // the buffer is now cleared and the DB hasn't been updated yet.
        await this.clickBufferService.setInflight(userId, buffer.locToAdd, buffer.clicks);

        jobs.push({
          data: {
            clicks: buffer.clicks,
            locToAdd: buffer.locToAdd,
            timestamp: Date.now(),
            userId,
          },
          name: `flush-${userId}-${Date.now()}`,
        });
      }

      // 3. Bulk add jobs to queue
      if (jobs.length > 0) {
        await this.bufferQueue.addBulk(jobs);

        const totalClicks = jobs.reduce((sum, j) => sum + j.data.clicks, 0);
        const elapsed = Date.now() - startTime;

        this.logger.log(
          `Queued ${jobs.length} flush jobs (${totalClicks} clicks) in ${elapsed}ms`,
        );
      }

      return jobs.length;
    } catch (error) {
      this.logger.error(
        `Buffer flush failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return 0;
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

    // Set in-flight marker before enqueueing
    await this.clickBufferService.setInflight(userId, buffer.locToAdd, buffer.clicks);

    await this.bufferQueue.add(
      `flush-${userId}-immediate`,
      {
        clicks: buffer.clicks,
        locToAdd: buffer.locToAdd,
        timestamp: Date.now(),
        userId,
      },
      {
        priority: 1, // High priority for immediate flush
      },
    );

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

    return { active, completed, failed, waiting };
  }
}
