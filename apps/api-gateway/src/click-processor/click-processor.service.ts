/**
 * Click Processor Service
 * Redis buffering and progression caching (cross-cutting gateway concerns)
 *
 * Click value calculation is now delegated to svc-user-progression via ClientProxy.
 * This service handles:
 * - Atomically buffering click values in Redis
 * - Caching progression data (read-through cache)
 *
 * The buffer is flushed to PostgreSQL by the worker-game-loop service.
 */

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClickBufferService, RedisKeys } from '@repo/redis-client';
import { IProgressionData } from '@repo/shared-types';
import Redis from 'ioredis';

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
   * Buffer a click value in Redis (atomic operation)
   * Called after the microservice returns the calculated click value.
   */
  async bufferClickValue(userId: string, finalValue: string) {
    const bufferResult = await this.clickBufferService.incrementBuffer(
      userId,
      finalValue,
    );

    this.logger.debug(
      `Click buffered for ${userId}: value=${finalValue}, total buffer=${bufferResult.locToAdd}`,
    );

    return bufferResult;
  }

  /**
   * Get user progression from Redis cache
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
