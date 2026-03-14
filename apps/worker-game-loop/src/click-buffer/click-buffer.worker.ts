/**
 * Click Buffer Worker
 * BullMQ Worker that processes buffer flush jobs
 *
 * Architecture:
 * 1. ClickBufferFlushService schedules periodic flush (every 5s)
 * 2. Flush collects all pending clicks from Redis
 * 3. This worker processes each user's buffer and persists to PostgreSQL
 */

import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { LeaderboardService, RedisKeys } from '@repo/redis-client';
import { QueueName, IBufferFlushResult } from '@repo/shared-types';
import { Job } from 'bullmq';
import Redis from 'ioredis';

// FUTURE: Import PrismaService when available
// import { PrismaService } from '@repo/prisma-client';

interface IBufferFlushJob {
  clicks: number;
  locToAdd: string;
  timestamp: number;
  userId: string;
}

interface IRedisProgression {
  experience: string;
  experienceToNext: string;
  level: number;
  linesOfCode: string;
  totalClicks: number;
  totalLinesWritten: string;
}

@Processor(QueueName.CLICK_BUFFER, {
  concurrency: 10, // Process 10 users in parallel
  limiter: {
    duration: 1000, // Max 100 jobs per second
    max: 100,
  },
})
export class ClickBufferWorker extends WorkerHost {
  private readonly logger = new Logger(ClickBufferWorker.name);

  constructor(
    // FUTURE: Inject PrismaService when available
    // private readonly prisma: PrismaService,
    private readonly leaderboardService: LeaderboardService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {
    super();
  }

  /**
   * Process a single buffer flush job
   * Updates PostgreSQL with accumulated clicks for a user
   */
  // FUTURE: This is a simplified version. In production, inject PrismaService.
  async process(job: Job<IBufferFlushJob>): Promise<IBufferFlushResult> {
    const { clicks, locToAdd, userId } = job.data;
    const startTime = Date.now();

    this.logger.debug(
      `Processing buffer flush for ${userId}: ${clicks} clicks, ${locToAdd} LoC`,
    );

    try {
      // FUTURE: Replace with actual Prisma calls when PrismaService is available
      // For now, we'll use Redis to store progression (demo purposes)

      const progressionKey = `progression:${userId}`;
      const progressionData = await this.redis.get(progressionKey);

      const defaultProgression: IRedisProgression = {
        experience: '0',
        experienceToNext: '100',
        level: 1,
        linesOfCode: '0',
        totalClicks: 0,
        totalLinesWritten: '0',
      };
      const progression: IRedisProgression = progressionData
        ? (JSON.parse(progressionData) as IRedisProgression)
        : defaultProgression;

      // 2. Calculate new values
      const locAmount = BigInt(Math.floor(Number.parseFloat(locToAdd)));
      const newLinesOfCode = BigInt(progression.linesOfCode) + locAmount;
      const newTotalLines = BigInt(progression.totalLinesWritten) + locAmount;
      const newTotalClicks = BigInt(progression.totalClicks) + BigInt(clicks);

      // 3. Calculate experience and level ups
      let experience = BigInt(progression.experience);
      let experienceToNext = BigInt(progression.experienceToNext);
      let level = progression.level;

      experience += BigInt(clicks); // 1 XP per click

      // Check for level ups
      while (experience >= experienceToNext) {
        experience -= experienceToNext;
        level++;
        experienceToNext = BigInt(Math.floor(Number(experienceToNext) * 1.5));

        this.logger.log(`🎉 User ${userId} reached level ${level}!`);

        // Publish level up event
        await this.publishLevelUp(userId, level);
      }

      // 4. Update progression (Redis for demo, Prisma in production)
      const updatedProgression = {
        experience: experience.toString(),
        experienceToNext: experienceToNext.toString(),
        level,
        linesOfCode: newLinesOfCode.toString(),
        totalClicks: newTotalClicks.toString(),
        totalLinesWritten: newTotalLines.toString(),
        updatedAt: new Date().toISOString(),
      };

      await this.redis.set(progressionKey, JSON.stringify(updatedProgression));

      // 5. Update leaderboard in Redis
      await this.leaderboardService.updateScore(userId, Number(newTotalLines));

      const processingTime = Date.now() - startTime;
      this.logger.debug(
        `Buffer flush completed for ${userId} in ${processingTime}ms`,
      );

      return {
        clicksProcessed: clicks,
        locAdded: locAmount.toString(),
        newBalance: newLinesOfCode.toString(),
        newLevel: level,
        processingTimeMs: processingTime,
        success: true,
        userId,
      };
    } catch (error) {
      this.logger.error(
        `Failed to flush buffer for ${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      // Re-add to buffer on failure (so data isn't lost)
      await this.reAddToBuffer(userId, locToAdd, clicks);

      return {
        clicksProcessed: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        locAdded: '0',
        success: false,
        userId,
      };
    }
  }

  /**
   * Publish level up event for real-time notification
   */
  private async publishLevelUp(
    userId: string,
    newLevel: number,
  ): Promise<void> {
    await this.redis.publish(
      RedisKeys.CHANNEL_ACHIEVEMENT,
      JSON.stringify({
        level: newLevel,
        timestamp: Date.now(),
        type: 'LEVEL_UP',
        userId,
      }),
    );
  }

  /**
   * Re-add to buffer if flush fails (data recovery)
   */
  private async reAddToBuffer(
    userId: string,
    locToAdd: string,
    clicks: number,
  ): Promise<void> {
    const key = RedisKeys.CLICK_BUFFER(userId);

    // Use Lua script for atomic re-addition
    const script = `
      local current = redis.call('GET', KEYS[1])
      local locAmount = tonumber(current and cjson.decode(current).locToAdd or "0")
      local clickCount = tonumber(current and cjson.decode(current).clicks or 0)
      
      local newData = cjson.encode({
        locToAdd = tostring(locAmount + tonumber(ARGV[1])),
        clicks = clickCount + tonumber(ARGV[2])
      })
      
      redis.call('SET', KEYS[1], newData)
      return 1
    `;

    try {
      await this.redis.eval(script, 1, key, locToAdd, clicks.toString());
      this.logger.warn(
        `Re-added ${clicks} clicks to buffer for ${userId} after flush failure`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to re-add to buffer for ${userId}: ${String(error)}`,
      );
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<IBufferFlushJob>) {
    this.logger.debug(`Job ${job.id} completed for user ${job.data.userId}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<IBufferFlushJob>, error: Error) {
    this.logger.error(
      `Job ${job.id} failed for user ${job.data.userId}: ${error.message}`,
    );
  }
}
