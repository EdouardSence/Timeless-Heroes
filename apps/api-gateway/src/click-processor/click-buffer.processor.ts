/**
 * Click Buffer Processor
 * BullMQ Worker that flushes Redis click buffer to PostgreSQL
 * 
 * Implements Write-Behind Pattern:
 * - Clicks are accumulated in Redis for fast writes
 * - Every 5 seconds, this processor batch-updates PostgreSQL
 * - Optimizes IOPS by reducing individual DB writes
 */

import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Job, Queue, Worker } from 'bullmq';

import { ClickBufferService, getRedisConfig, LeaderboardService } from '@repo/redis-client';
import { IBufferFlushResult, QueueName } from '@repo/shared-types';
// Note: prisma import would be from @repo/prisma-client in production

interface IBufferFlushJob {
  userId: string;
  clicks: number;
  locToAdd: string;
}

@Injectable()
export class ClickBufferProcessor implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ClickBufferProcessor.name);
  private worker: Worker<IBufferFlushJob, IBufferFlushResult> | null = null;
  private flushInterval: NodeJS.Timeout | null = null;
  
  constructor(
    @InjectQueue(QueueName.CLICK_BUFFER)
    private readonly bufferQueue: Queue<IBufferFlushJob>,
    private readonly clickBufferService: ClickBufferService,
    private readonly leaderboardService: LeaderboardService,
  ) {}
  
  async onModuleInit() {
    this.logger.log('Initializing Click Buffer Processor...');
    
    // Create BullMQ worker to process buffer flush jobs
    this.worker = new Worker<IBufferFlushJob, IBufferFlushResult>(
      QueueName.CLICK_BUFFER,
      async (job: Job<IBufferFlushJob>) => this.processFlush(job),
      {
        connection: getRedisConfig(),
        concurrency: 10, // Process 10 users in parallel
        limiter: {
          max: 100,
          duration: 1000, // Max 100 jobs per second
        },
      },
    );
    
    this.worker.on('completed', (job) => {
      this.logger.debug(`Buffer flush completed for user ${job.data.userId}`);
    });
    
    this.worker.on('failed', (job, err) => {
      this.logger.error(`Buffer flush failed for user ${job?.data.userId}: ${err.message}`);
    });
    
    // Start the periodic flush scheduler
    this.startFlushScheduler();
    
    this.logger.log('Click Buffer Processor initialized');
  }
  
  async onModuleDestroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    
    if (this.worker) {
      await this.worker.close();
    }
    
    this.logger.log('Click Buffer Processor destroyed');
  }
  
  /**
   * Start the periodic buffer flush scheduler
   * Runs every 5 seconds
   */
  private startFlushScheduler() {
    const FLUSH_INTERVAL_MS = 5000; // 5 seconds
    
    this.flushInterval = setInterval(async () => {
      await this.scheduleBufferFlush();
    }, FLUSH_INTERVAL_MS);
    
    this.logger.log(`Buffer flush scheduler started (every ${FLUSH_INTERVAL_MS}ms)`);
  }
  
  /**
   * Schedule buffer flush for all users with pending clicks
   */
  private async scheduleBufferFlush(): Promise<void> {
    try {
      // Get all users with pending buffers
      const userIds = await this.clickBufferService.getAllBufferedUsers();
      
      if (userIds.length === 0) {
        return;
      }
      
      this.logger.debug(`Scheduling buffer flush for ${userIds.length} users`);
      
      // Create a batch of jobs
      const jobs = await Promise.all(
        userIds.map(async (userId) => {
          // Atomically get and clear the buffer
          const buffer = await this.clickBufferService.flushBuffer(userId);
          
          if (!buffer || buffer.clicks === 0) {
            return null;
          }
          
          return {
            name: `flush-${userId}-${Date.now()}`,
            data: {
              userId,
              clicks: buffer.clicks,
              locToAdd: buffer.locToAdd,
            },
          };
        }),
      );
      
      // Filter out null jobs and add to queue
      const validJobs = jobs.filter((j): j is NonNullable<typeof j> => j !== null);
      
      if (validJobs.length > 0) {
        await this.bufferQueue.addBulk(validJobs);
        this.logger.log(`Queued ${validJobs.length} buffer flush jobs`);
      }
    } catch (error) {
      this.logger.error('Failed to schedule buffer flush:', error);
    }
  }
  
  /**
   * Process a single buffer flush job
   * Updates PostgreSQL with accumulated clicks
   */
  private async processFlush(job: Job<IBufferFlushJob>): Promise<IBufferFlushResult> {
    const { userId, clicks, locToAdd } = job.data;
    
    this.logger.debug(
      `Processing buffer flush for ${userId}: ${clicks} clicks, ${locToAdd} LoC`,
    );
    
    try {
      // In production, this would use Prisma to update the database
      // For now, we'll simulate the update
      
      /*
      const result = await prisma.progression.update({
        where: { userId },
        data: {
          linesOfCode: {
            increment: BigInt(locToAdd),
          },
          totalLinesWritten: {
            increment: BigInt(locToAdd),
          },
          totalClicks: {
            increment: BigInt(clicks),
          },
          updatedAt: new Date(),
        },
      });
      
      // Update leaderboard
      await this.leaderboardService.updateScore(
        userId,
        result.totalLinesWritten.toString(),
      );
      */
      
      // Simulate DB update
      const locNumber = parseFloat(locToAdd);
      
      // Update leaderboard
      await this.leaderboardService.updateScore(userId, locNumber);
      
      return {
        userId,
        clicksProcessed: clicks,
        locAdded: locToAdd,
        success: true,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to flush buffer for ${userId}: ${errorMessage}`);
      
      return {
        userId,
        clicksProcessed: 0,
        locAdded: '0',
        success: false,
        error: errorMessage,
      };
    }
  }
  
  /**
   * Force flush all buffers (for graceful shutdown)
   */
  async forceFlushAll(): Promise<void> {
    this.logger.log('Force flushing all buffers...');
    await this.scheduleBufferFlush();
  }
}
