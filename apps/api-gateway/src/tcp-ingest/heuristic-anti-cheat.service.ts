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
 */

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { RedisKeys } from '@repo/redis-client';
import { IAntiCheatResult, AntiCheatReason, ITypingMetrics } from './tcp-ingest.types';

interface ITimingWindow {
  timestamps: number[];
  deltas: number[];
}

@Injectable()
export class HeuristicAntiCheatService {
  private readonly logger = new Logger(HeuristicAntiCheatService.name);

  // In-memory sliding window of recent key press timings per user
  private userTimings: Map<string, ITimingWindow> = new Map();

  // Configuration
  private readonly MAX_CPS: number;
  private readonly WINDOW_SIZE = 20; // Keep last 20 key presses for analysis
  private readonly MIN_DELTA_MS = 30; // Minimum realistic time between keypresses
  private readonly MAX_REGULARITY_SCORE = 0.9; // Above this = too regular = bot
  private readonly MIN_STD_DEV = 15; // Human typing has at least 15ms variance

  constructor(
    private readonly configService: ConfigService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {
    this.MAX_CPS = this.configService.get<number>('MAX_CPS', 20);
    this.logger.log(`Anti-cheat initialized: MAX_CPS=${this.MAX_CPS}`);
  }

  /**
   * Analyze a key press and determine if it's human or bot behavior
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

    // 2. Get or create timing window for user
    let window = this.userTimings.get(userId);
    if (!window) {
      window = { timestamps: [], deltas: [] };
      this.userTimings.set(userId, window);
    }

    // 3. Calculate delta from last keypress
    const lastTimestamp = window.timestamps[window.timestamps.length - 1];
    const deltaMs = lastTimestamp ? timestamp - lastTimestamp : 100;

    // 4. Update sliding window
    window.timestamps.push(timestamp);
    if (deltaMs > 0 && deltaMs < 10000) { // Ignore gaps > 10 seconds
      window.deltas.push(deltaMs);
    }

    // Keep only last N entries
    if (window.timestamps.length > this.WINDOW_SIZE) {
      window.timestamps.shift();
    }
    if (window.deltas.length > this.WINDOW_SIZE - 1) {
      window.deltas.shift();
    }

    // 5. Need at least 5 samples for meaningful analysis
    if (window.deltas.length < 5) {
      return { allowed: true, humanScore: 0.5 };
    }

    // 6. Calculate metrics
    const metrics = this.calculateMetrics(window.deltas);

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
  getUserMetrics(userId: string): ITypingMetrics | null {
    const window = this.userTimings.get(userId);
    if (!window || window.deltas.length < 5) {
      return null;
    }
    return this.calculateMetrics(window.deltas);
  }

  /**
   * Clear user timing data (on disconnect or reset)
   */
  clearUserData(userId: string): void {
    this.userTimings.delete(userId);
  }
}
