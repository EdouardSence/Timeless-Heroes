/**
 * Heuristic Anti-Cheat Service
 * Detects bot-like behavior through typing pattern analysis
 * 
 * A human has variable timing between keystrokes.
 * A bot has suspiciously consistent timing (e.g., exactly 10ms between each key).
 * 
 * This service analyzes:
 * 1. Rate of key presses (CPS)
 * 2. Timing variance (standard deviation)
 * 3. Pattern regularity
 * 
 * All timing data is stored in Redis (no in-memory Maps).
 */

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { RedisKeys } from '@repo/redis-client';
import { IAntiCheatResult, AntiCheatReason, ITypingMetrics } from './tcp-ingest.types';

@Injectable()
export class HeuristicAntiCheatService {
  private readonly logger = new Logger(HeuristicAntiCheatService.name);

  // Configuration
  private readonly MAX_CPS: number;
  private readonly WINDOW_SIZE = 20; // Keep last 20 key presses for analysis
  private readonly MIN_DELTA_MS = 30; // Minimum realistic time between keypresses
  private readonly MAX_REGULARITY_SCORE = 0.9; // Above this = too regular = bot
  private readonly MIN_STD_DEV = 15; // Human typing has at least 15ms variance
  private readonly TIMING_TTL = 300; // 5 minutes TTL for timing data

  constructor(
    private readonly configService: ConfigService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {
    this.MAX_CPS = this.configService.get<number>('MAX_CPS', 20);
    this.logger.log(`Anti-cheat initialized: MAX_CPS=${this.MAX_CPS}`);
  }

  /**
   * Analyze a key press and determine if it's human or bot behavior
   * All timing data is stored in Redis for distributed access.
   */
  async analyzeKeyPress(userId: string, timestamp: number): Promise<IAntiCheatResult> {
    // 1. Check if user is banned
    const violations = await this.redis.get(RedisKeys.USER_VIOLATIONS(userId));
    if (violations && parseInt(violations, 10) >= 10) {
      return {
        allowed: false,
        reason: 'USER_BANNED',
        humanScore: 0,
      };
    }

    const timestampsKey = RedisKeys.ANTICHEAT_TIMESTAMPS(userId);
    const deltasKey = RedisKeys.ANTICHEAT_DELTAS(userId);

    // 2. Get last timestamp from Redis list
    const lastTimestampStr = await this.redis.lindex(timestampsKey, -1);
    const lastTimestamp = lastTimestampStr ? parseInt(lastTimestampStr, 10) : null;
    const deltaMs = lastTimestamp ? timestamp - lastTimestamp : 100;

    // 3. Push new timestamp and trim to window size (atomic pipeline)
    const pipeline = this.redis.pipeline();
    pipeline.rpush(timestampsKey, timestamp.toString());
    pipeline.ltrim(timestampsKey, -this.WINDOW_SIZE, -1);
    pipeline.expire(timestampsKey, this.TIMING_TTL);

    // Only store delta if it's meaningful (> 0 and < 10 seconds)
    if (deltaMs > 0 && deltaMs < 10000) {
      pipeline.rpush(deltasKey, deltaMs.toString());
      pipeline.ltrim(deltasKey, -(this.WINDOW_SIZE - 1), -1);
      pipeline.expire(deltasKey, this.TIMING_TTL);
    }
    await pipeline.exec();

    // 4. Get current deltas from Redis
    const deltaStrs = await this.redis.lrange(deltasKey, 0, -1);
    const deltas = deltaStrs.map((d) => parseInt(d, 10));

    // 5. Need at least 5 samples for meaningful analysis
    if (deltas.length < 5) {
      return { allowed: true, humanScore: 0.5 };
    }

    // 6. Calculate metrics
    const metrics = this.calculateMetrics(deltas);

    // 7. Run heuristic checks
    return this.evaluateMetrics(metrics, deltaMs);
  }

  /**
   * Calculate typing metrics from delta array
   */
  private calculateMetrics(deltas: number[]): ITypingMetrics {
    // Average delta
    const sum = deltas.reduce((a, b) => a + b, 0);
    const averageDeltaMs = sum / deltas.length;

    // Standard deviation
    const squareDiffs = deltas.map((d) => Math.pow(d - averageDeltaMs, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / deltas.length;
    const deltaStdDev = Math.sqrt(avgSquareDiff);

    // Current CPS (based on recent average)
    const currentCPS = averageDeltaMs > 0 ? 1000 / averageDeltaMs : 0;

    // Count regular intervals (same ±5ms)
    let regularIntervalCount = 0;
    for (let i = 1; i < deltas.length; i++) {
      if (Math.abs(deltas[i] - deltas[i - 1]) < 5) {
        regularIntervalCount++;
      }
    }

    return {
      averageDeltaMs,
      deltaStdDev,
      currentCPS,
      regularIntervalCount,
    };
  }

  /**
   * Evaluate metrics and return anti-cheat result
   */
  private evaluateMetrics(metrics: ITypingMetrics, currentDeltaMs: number): IAntiCheatResult {
    const { averageDeltaMs, deltaStdDev, currentCPS, regularIntervalCount } = metrics;

    // Check 1: Rate too fast (CPS limit)
    if (currentCPS > this.MAX_CPS) {
      return {
        allowed: false,
        reason: 'RATE_TOO_FAST',
        humanScore: 0.1,
      };
    }

    // Check 2: Current delta physically impossible
    if (currentDeltaMs > 0 && currentDeltaMs < this.MIN_DELTA_MS) {
      return {
        allowed: false,
        reason: 'RATE_TOO_FAST',
        humanScore: 0.1,
      };
    }

    // Check 3: Timing too regular (bot behavior)
    // A human has natural variance in typing speed
    if (deltaStdDev < this.MIN_STD_DEV && averageDeltaMs < 100) {
      // Very fast AND very regular = suspicious
      const regularityScore = regularIntervalCount / (this.WINDOW_SIZE - 2);

      if (regularityScore > this.MAX_REGULARITY_SCORE) {
        return {
          allowed: false,
          reason: 'TIMING_TOO_REGULAR',
          humanScore: 0.2,
        };
      }

      // Suspicious but not blocked - issue warning
      return {
        allowed: true,
        humanScore: 0.4,
        warning: true,
      };
    }

    // Calculate human score based on variance
    // More variance = more human-like
    const varianceScore = Math.min(1, deltaStdDev / 50);
    const speedScore = Math.min(1, averageDeltaMs / 100);
    const humanScore = (varianceScore * 0.6 + speedScore * 0.4);

    return {
      allowed: true,
      humanScore,
    };
  }

  /**
   * Get current metrics for a user (for debugging/admin)
   */
  async getUserMetrics(userId: string): Promise<ITypingMetrics | null> {
    const deltasKey = RedisKeys.ANTICHEAT_DELTAS(userId);
    const deltaStrs = await this.redis.lrange(deltasKey, 0, -1);
    const deltas = deltaStrs.map((d) => parseInt(d, 10));

    if (deltas.length < 5) {
      return null;
    }
    return this.calculateMetrics(deltas);
  }

  /**
   * Clear user timing data (on disconnect or reset)
   */
  async clearUserData(userId: string): Promise<void> {
    const pipeline = this.redis.pipeline();
    pipeline.del(RedisKeys.ANTICHEAT_TIMESTAMPS(userId));
    pipeline.del(RedisKeys.ANTICHEAT_DELTAS(userId));
    await pipeline.exec();
  }
}
