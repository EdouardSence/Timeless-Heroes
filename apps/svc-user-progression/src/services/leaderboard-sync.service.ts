/**
 * Leaderboard Sync Service
 * Syncs user scores to Redis leaderboards
 */

import { Injectable, Logger } from '@nestjs/common';
import { prisma } from '@repo/prisma-client';
import {
  ILeaderboardEntry,
  LeaderboardService,
  RedisKeys,
  getRedisClient,
} from '@repo/redis-client';
import { LeaderboardType } from '@repo/shared-types';

@Injectable()
export class LeaderboardSyncService {
  private readonly logger = new Logger(LeaderboardSyncService.name);
  private leaderboardService: LeaderboardService;

  constructor() {
    this.leaderboardService = new LeaderboardService(getRedisClient());
  }

  /**
   * Sync user's score to all relevant leaderboards
   */
  async syncUserScore(userId: string, score: string): Promise<void> {
    const scoreNum = Number.parseFloat(score);

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

    return { daily, global, weekly };
  }

  /**
   * Get leaderboard data, enriched with usernames from PostgreSQL
   */
  async getLeaderboard(
    type: LeaderboardType,
    count = 100,
  ): Promise<ILeaderboardEntry[]> {
    let rawEntries: ILeaderboardEntry[];
    switch (type) {
      case LeaderboardType.WEEKLY: {
        rawEntries = await this.leaderboardService.getTopPlayers(
          count,
          RedisKeys.LEADERBOARD_WEEKLY,
        );
        break;
      }
      case LeaderboardType.DAILY: {
        rawEntries = await this.leaderboardService.getTopPlayers(
          count,
          RedisKeys.LEADERBOARD_DAILY,
        );
        break;
      }
      default: {
        rawEntries = await this.leaderboardService.getTopPlayers(
          count,
          RedisKeys.LEADERBOARD_GLOBAL,
        );
      }
    }

    this.logger.log(`Found ${rawEntries.length} raw leaderboard entries`);

    if (rawEntries.length === 0) {
      this.logger.warn(`Leaderboard ${type} is empty in Redis`);
      return rawEntries;
    }

    // Batch-fetch usernames from PostgreSQL
    try {
      const userIds = rawEntries.map((e: ILeaderboardEntry) => e.userId);
      this.logger.log(`Fetching usernames for ${userIds.length} users`);

      const users = await prisma.user.findMany({
        select: { id: true, username: true },
        where: { id: { in: userIds } },
      });

      this.logger.log(`Found ${users.length} users in PostgreSQL`);

      const usernameMap = new Map(
        users.map((u: { id: string; username: string }) => [u.id, u.username]),
      );

      const result = rawEntries.map((entry: ILeaderboardEntry) => ({
        ...entry,
        username: usernameMap.get(entry.userId) ?? entry.userId,
      }));

      return result;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to enrich leaderboard with usernames: ${msg}`,
        stack,
      );
      return rawEntries.map((e) => ({ ...e, username: e.userId }));
    }
  }

  /**
   * Reset weekly/daily leaderboards (called by cron job)
   */
  async resetPeriodicLeaderboards(type: 'weekly' | 'daily'): Promise<void> {
    const redis = getRedisClient();
    const key =
      type === 'weekly'
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
