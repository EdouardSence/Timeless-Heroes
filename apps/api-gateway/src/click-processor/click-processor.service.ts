/**
 * Click Processor Service
 * Core click processing logic with Redis buffering
 *
 * Flow:
 * 1. Receive validated click from WebSocket
 * 2. Calculate click value (with multipliers)
 * 3. Atomically buffer click in Redis
 * 4. Return immediate feedback to client
 *
 * The buffer is flushed to PostgreSQL by the worker-game-loop service
 */

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClickBufferService, RedisKeys } from '@repo/redis-client';
import {
  IClickResult,
  IKeyPressPayload,
  IMultiplierBreakdown,
  IProgressionData,
  KeyType,
} from '@repo/shared-types';
import Redis from 'ioredis';

@Injectable()
export class ClickProcessorService {
  private readonly logger = new Logger(ClickProcessorService.name);

  // TTL for Redis progression cache (seconds)
  // Reduced to 5s to match flush cycle and prevent serving stale data
  private readonly CACHE_TTL_SECONDS = 5;

  constructor(
    private readonly clickBufferService: ClickBufferService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  /**
   * Process a single click event
   * Returns the calculated result for immediate client feedback
   */
  async processClick(
    payload: IKeyPressPayload,
    progression: IProgressionData,
  ): Promise<IClickResult> {
    const { keyType, userId } = payload;

    // 1. Calculate base value
    const baseValue = this.calculateBaseValue(keyType);

    // 2. Calculate multipliers (includes active boosts from Redis)
    const multipliers = await this.calculateMultipliers(userId, progression);

    // 3. Check for critical hit
    // eslint-disable-next-line sonarjs/pseudo-random
    const isCritical = Math.random() < progression.criticalChance;

    // 4. Calculate final value
    let finalValue = baseValue * multipliers.totalMultiplier;
    if (isCritical) {
      finalValue *= progression.criticalMultiplier;
    }

    // 5. Buffer the click in Redis (atomic operation)
    const bufferResult = await this.clickBufferService.incrementBuffer(
      userId,
      finalValue.toString(),
    );

    this.logger.debug(
      `Click processed for ${userId}: base=${baseValue}, final=${finalValue}, total buffer=${bufferResult.locToAdd}`,
    );

    // 6. Get estimated new balance (from cache + buffer)
    const cachedBalance = BigInt(progression.linesOfCode);
    const bufferedAmount = BigInt(
      Math.floor(Number.parseFloat(bufferResult.locToAdd)),
    );
    const estimatedBalance = (cachedBalance + bufferedAmount).toString();

    return {
      baseValue,
      finalValue: finalValue.toFixed(0),
      isCritical,
      multipliers,
      newBalance: estimatedBalance,
    };
  }

  /**
   * Calculate base click value based on key type
   */
  private calculateBaseValue(keyType?: KeyType): number {
    switch (keyType) {
      case KeyType.SPECIAL: {
        return 2;
      } // Shift, Ctrl, etc. give bonus
      case KeyType.FUNCTION: {
        return 3;
      } // F1-F12 give more
      default: {
        return 1;
      }
    }
  }

  /**
   * Calculate all multipliers for a click
   * BUG-08 FIX: Reads active boosts and subscription from Redis
   * instead of returning a hardcoded bonusMultiplier of 1.0
   */
  private async calculateMultipliers(
    userId: string,
    progression: IProgressionData,
  ): Promise<IMultiplierBreakdown> {
    const clickMultiplier = progression.clickMultiplier;
    const criticalMultiplier = progression.criticalMultiplier;

    // Fetch bonus multiplier from active boosts + subscription in Redis
    const bonusMultiplier = await this.getActiveBoostMultiplier(userId);

    const totalMultiplier = clickMultiplier * bonusMultiplier;

    return {
      bonusMultiplier,
      clickMultiplier,
      criticalMultiplier,
      totalMultiplier,
    };
  }

  /**
   * Get the combined boost multiplier from all active boosts and subscription
   * Boosts are stored at `boost:{userId}:{boostType}` with TTL (auto-expire)
   * Subscriptions are stored at `subscription:{userId}` with TTL
   */
  private async getActiveBoostMultiplier(userId: string): Promise<number> {
    let multiplier = 1.0;

    try {
      // 1. Check active temporary boosts (boost:{userId}:*)
      const boostKeys = await this.redis.keys(`boost:${userId}:*`);

      if (boostKeys.length > 0) {
        const boostValues = await this.redis.mget(...boostKeys);

        for (const raw of boostValues) {
          if (!raw) continue;
          try {
            const boost = JSON.parse(raw) as { multiplier: number };
            if (boost.multiplier && boost.multiplier > 0) {
              // Stack boost multipliers multiplicatively
              multiplier *= boost.multiplier;
            }
          } catch {
            // Skip malformed boost data
          }
        }
      }

      // 2. Check active subscription (subscription:{userId})
      const subscriptionRaw = await this.redis.get(`subscription:${userId}`);

      if (subscriptionRaw) {
        try {
          const subscription = JSON.parse(subscriptionRaw) as { type: string };
          // Apply subscription tier multiplier
          const subMultiplier = this.getSubscriptionMultiplier(subscription.type);
          multiplier *= subMultiplier;
        } catch {
          // Skip malformed subscription data
        }
      }
    } catch (error) {
      this.logger.warn(
        `Failed to fetch boost data for ${userId}, using default multiplier: ${error instanceof Error ? error.message : error}`,
      );
      // On Redis error, default to 1.0 (no bonus) rather than crashing
    }

    return multiplier;
  }

  /**
   * Get the click multiplier bonus for a subscription tier
   */
  private getSubscriptionMultiplier(subscriptionType: string): number {
    switch (subscriptionType.toUpperCase()) {
      case 'PREMIUM':
        return 1.5;
      case 'VIP':
        return 2.0;
      case 'ELITE':
        return 3.0;
      default:
        return 1.0;
    }
  }

  /**
   * Get user progression from Redis cache
   * In production, this would fetch from the progression service via gRPC
   */
  async getProgressionCached(userId: string): Promise<IProgressionData | null> {
    const redisKey = RedisKeys.CACHE_USER_PROGRESSION(userId);
    const redisData = await this.redis.get(redisKey);

    if (redisData) {
      return JSON.parse(redisData) as IProgressionData;
    }

    return null;
  }

  /**
   * Cache user progression data in Redis
   */
  async cacheProgression(progression: IProgressionData): Promise<void> {
    const redisKey = RedisKeys.CACHE_USER_PROGRESSION(progression.userId);
    await this.redis.setex(
      redisKey,
      this.CACHE_TTL_SECONDS,
      JSON.stringify(progression),
    );
  }

  /**
   * Invalidate cache for user
   */
  async invalidateCache(userId: string): Promise<void> {
    await this.redis.del(RedisKeys.CACHE_USER_PROGRESSION(userId));
  }
}
