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
 * The buffer is flushed to PostgreSQL by the ClickBufferProcessor
 */

import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

import { ClickBufferService, RedisKeys } from '@repo/redis-client';
import {
    IClickResult,
    IKeyPressPayload,
    IMultiplierBreakdown,
    IProgressionData,
    KeyType,
} from '@repo/shared-types';

@Injectable()
export class ClickProcessorService {
  private readonly logger = new Logger(ClickProcessorService.name);
  
  // TTL for Redis progression cache (seconds)
  private readonly CACHE_TTL_SECONDS = 60;
  
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
    const { userId, keyType } = payload;
    
    // 1. Calculate base value
    const baseValue = this.calculateBaseValue(keyType);
    
    // 2. Calculate multipliers
    const multipliers = this.calculateMultipliers(progression);
    
    // 3. Check for critical hit
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
    const bufferedAmount = BigInt(Math.floor(parseFloat(bufferResult.locToAdd)));
    const estimatedBalance = (cachedBalance + bufferedAmount).toString();
    
    return {
      baseValue,
      finalValue: finalValue.toFixed(0),
      isCritical,
      newBalance: estimatedBalance,
      multipliers,
    };
  }
  
  /**
   * Calculate base click value based on key type
   */
  private calculateBaseValue(keyType?: KeyType): number {
    switch (keyType) {
      case KeyType.SPECIAL:
        return 2; // Shift, Ctrl, etc. give bonus
      case KeyType.FUNCTION:
        return 3; // F1-F12 give more
      case KeyType.NORMAL:
      default:
        return 1;
    }
  }
  
  /**
   * Calculate all multipliers for a click
   */
  private calculateMultipliers(progression: IProgressionData): IMultiplierBreakdown {
    const clickMultiplier = progression.clickMultiplier;
    const criticalMultiplier = progression.criticalMultiplier;
    
    // Bonus multiplier could come from active boosts, events, etc.
    const bonusMultiplier = 1.0; // TODO: Implement boost system
    
    const totalMultiplier = clickMultiplier * bonusMultiplier;
    
    return {
      clickMultiplier,
      criticalMultiplier,
      bonusMultiplier,
      totalMultiplier,
    };
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
    await this.redis.setex(redisKey, this.CACHE_TTL_SECONDS, JSON.stringify(progression));
  }
  
  /**
   * Invalidate cache for user
   */
  async invalidateCache(userId: string): Promise<void> {
    await this.redis.del(RedisKeys.CACHE_USER_PROGRESSION(userId));
  }
}
