/**
 * Leaderboard Sync Service
 * Syncs user scores to Redis leaderboards
 */

import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

import { LeaderboardService, RedisKeys, getRedisClient } from '@repo/redis-client';
import { LeaderboardType, QueueName } from '@repo/shared-types';

@Injectable()
export class LeaderboardSyncService {
  private readonly logger = new Logger(LeaderboardSyncService.name);
  private leaderboardService: LeaderboardService;
  
  constructor(
    @InjectQueue(QueueName.LEADERBOARD_UPDATE)
    private readonly leaderboardQueue: Queue,
  ) {
    this.leaderboardService = new LeaderboardService(getRedisClient());
  }
  
  /**
   * Sync user's score to all relevant leaderboards
   */
  async syncUserScore(userId: string, score: string): Promise<void> {
    const scoreNum = parseFloat(score);
    
    // Update global leaderboard
    await this.leaderboardService.updateScore(
      userId,
      scoreNum,
      RedisKeys.LEADERBOARD_GLOBAL,
    );
    
    // Update weekly leaderboard
    await this.leaderboardService.updateScore(
      userId,
      scoreNum,
      RedisKeys.LEADERBOARD_WEEKLY,
    );
    
    // Update daily leaderboard
    await this.leaderboardService.updateScore(
      userId,
      scoreNum,
      RedisKeys.LEADERBOARD_DAILY,
    );
    
    this.logger.debug(`Synced score for ${userId}: ${score}`);
  }
  
  /**
   * Get user's rank across leaderboards
   */
  async getUserRanks(userId: string): Promise<{
    global: number | null;
    weekly: number | null;
    daily: number | null;
  }> {
    const [global, weekly, daily] = await Promise.all([
      this.leaderboardService.getUserRank(userId, RedisKeys.LEADERBOARD_GLOBAL),
      this.leaderboardService.getUserRank(userId, RedisKeys.LEADERBOARD_WEEKLY),
      this.leaderboardService.getUserRank(userId, RedisKeys.LEADERBOARD_DAILY),
    ]);
    
    return { global, weekly, daily };
  }
  
  /**
   * Get leaderboard data
   */
  async getLeaderboard(type: LeaderboardType, count: number = 100) {
    switch (type) {
      case LeaderboardType.WEEKLY:
        return this.leaderboardService.getTopPlayers(count, RedisKeys.LEADERBOARD_WEEKLY);
      case LeaderboardType.DAILY:
        return this.leaderboardService.getTopPlayers(count, RedisKeys.LEADERBOARD_DAILY);
      default:
        return this.leaderboardService.getTopPlayers(count, RedisKeys.LEADERBOARD_GLOBAL);
    }
  }
  
  /**
   * Reset weekly/daily leaderboards (called by cron job)
   */
  async resetPeriodicLeaderboards(type: 'weekly' | 'daily'): Promise<void> {
    const redis = getRedisClient();
    const key = type === 'weekly'
      ? RedisKeys.LEADERBOARD_WEEKLY
      : RedisKeys.LEADERBOARD_DAILY;
    
    // Archive before reset (optional)
    const archiveKey = `${key}:archive:${Date.now()}`;
    await redis.rename(key, archiveKey);
    
    // Set TTL on archive (keep for 30 days)
    await redis.expire(archiveKey, 30 * 24 * 60 * 60);
    
    this.logger.log(`Reset ${type} leaderboard`);
  }
}
