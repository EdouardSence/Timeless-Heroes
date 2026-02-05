/**
 * @repo/redis-client
 * Centralized Redis configuration and utilities for Timeless-Heroes
 */

import { Job, Queue, QueueEvents, Worker } from 'bullmq';
import Redis from 'ioredis';
import type { RedisOptions } from 'ioredis';

// ============================================================================
// CONFIGURATION
// ============================================================================

export interface IRedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  maxRetriesPerRequest?: number;
  enableReadyCheck?: boolean;
  lazyConnect?: boolean;
}

export const getRedisConfig = (): IRedisConfig => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  maxRetriesPerRequest: null as unknown as number, // Required for BullMQ
  enableReadyCheck: true,
  lazyConnect: false,
});

// ============================================================================
// REDIS CLIENT SINGLETON
// ============================================================================

let redisClient: Redis | null = null;
let redisSubscriber: Redis | null = null;

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    redisClient = new Redis(getRedisConfig() as RedisOptions);

    redisClient.on('error', (err) => {
      console.error('[Redis] Connection error:', err);
    });

    redisClient.on('connect', () => {
      console.log('[Redis] Connected successfully');
    });
  }
  return redisClient;
};

export const getRedisSubscriber = (): Redis => {
  if (!redisSubscriber) {
    redisSubscriber = new Redis(getRedisConfig() as RedisOptions);

    redisSubscriber.on('error', (err) => {
      console.error('[Redis Subscriber] Connection error:', err);
    });
  }
  return redisSubscriber;
};

export const closeRedisConnections = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
  if (redisSubscriber) {
    await redisSubscriber.quit();
    redisSubscriber = null;
  }
};

// ============================================================================
// REDIS KEY PREFIXES
// ============================================================================

export const RedisKeys = {
  // Click buffer: stores accumulated clicks per user
  CLICK_BUFFER: (userId: string) => `buffer:clicks:${userId}`,
  CLICK_BUFFER_PATTERN: 'buffer:clicks:*',

  // User session tracking
  USER_SESSION: (userId: string) => `session:${userId}`,
  USER_LAST_CLICK: (userId: string) => `throttle:lastclick:${userId}`,
  USER_CLICK_COUNT: (userId: string) => `throttle:count:${userId}`,
  USER_VIOLATIONS: (userId: string) => `throttle:violations:${userId}`,

  // Leaderboards (Sorted Sets)
  LEADERBOARD_GLOBAL: 'leaderboard:global',
  LEADERBOARD_WEEKLY: 'leaderboard:weekly',
  LEADERBOARD_DAILY: 'leaderboard:daily',

  // Pub/Sub channels
  CHANNEL_BALANCE_UPDATE: 'channel:balance',
  CHANNEL_ACHIEVEMENT: 'channel:achievement',
  CHANNEL_LEADERBOARD: 'channel:leaderboard',

  // Rate limiting
  RATE_LIMIT: (userId: string, action: string) => `ratelimit:${action}:${userId}`,

  // Cached data
  CACHE_USER_PROGRESSION: (userId: string) => `cache:progression:${userId}`,
  CACHE_ITEM_COSTS: (userId: string) => `cache:items:${userId}`,

  // Locks (for distributed operations)
  LOCK_USER: (userId: string) => `lock:user:${userId}`,
  LOCK_PAYMENT: (paymentId: string) => `lock:payment:${paymentId}`,
} as const;

// ============================================================================
// CLICK BUFFER OPERATIONS
// ============================================================================

export interface IClickBufferData {
  clicks: number;
  locToAdd: string;
  lastUpdate: number;
}

export class ClickBufferService {
  private redis: Redis;

  constructor(redis?: Redis) {
    this.redis = redis || getRedisClient();
  }

  /**
   * Atomically increment click buffer for a user
   * Uses HINCRBY for atomic operations
   */
  async incrementBuffer(
    userId: string,
    clickValue: string,
  ): Promise<IClickBufferData> {
    const key = RedisKeys.CLICK_BUFFER(userId);
    const now = Date.now();

    // Using pipeline for atomic multi-operation
    const pipeline = this.redis.pipeline();
    pipeline.hincrby(key, 'clicks', 1);
    pipeline.hincrbyfloat(key, 'locToAdd', parseFloat(clickValue));
    pipeline.hset(key, 'lastUpdate', now.toString());
    pipeline.expire(key, 60); // TTL 60 seconds, will be flushed before

    const results = await pipeline.exec();

    if (!results) {
      throw new Error('Redis pipeline failed');
    }

    return {
      clicks: results[0]?.[1] as number,
      locToAdd: (results[1]?.[1] as number).toString(),
      lastUpdate: now,
    };
  }

  /**
   * Get and delete buffer (atomic operation for batch processing)
   */
  async flushBuffer(userId: string): Promise<IClickBufferData | null> {
    const key = RedisKeys.CLICK_BUFFER(userId);

    // Get all fields
    const data = await this.redis.hgetall(key);

    if (!data || !data.clicks) {
      return null;
    }

    // Delete the key
    await this.redis.del(key);

    return {
      clicks: parseInt(data.clicks, 10),
      locToAdd: data.locToAdd || '0',
      lastUpdate: parseInt(data.lastUpdate, 10) || Date.now(),
    };
  }

  /**
   * Get all user IDs with pending buffers
   */
  async getAllBufferedUsers(): Promise<string[]> {
    const keys = await this.redis.keys(RedisKeys.CLICK_BUFFER_PATTERN);
    return keys.map((key) => key.replace('buffer:clicks:', ''));
  }
}

// ============================================================================
// LEADERBOARD OPERATIONS
// ============================================================================

export interface ILeaderboardEntry {
  userId: string;
  score: number;
  rank: number;
}

export class LeaderboardService {
  private redis: Redis;

  constructor(redis?: Redis) {
    this.redis = redis || getRedisClient();
  }

  /**
   * Update user's score in leaderboard
   * Uses ZADD with GT option to only update if higher
   */
  async updateScore(
    userId: string,
    score: number | string,
    leaderboardKey: string = RedisKeys.LEADERBOARD_GLOBAL,
  ): Promise<number> {
    const numericScore = typeof score === 'string' ? parseFloat(score) : score;
    // ZADD returns 1 if new member, 0 if existed
    return this.redis.zadd(leaderboardKey, numericScore, userId);
  }

  /**
   * Get user's rank (0-indexed, so add 1 for display)
   */
  async getUserRank(
    userId: string,
    leaderboardKey: string = RedisKeys.LEADERBOARD_GLOBAL,
  ): Promise<number | null> {
    const rank = await this.redis.zrevrank(leaderboardKey, userId);
    return rank !== null ? rank + 1 : null;
  }

  /**
   * Get top N players
   */
  async getTopPlayers(
    count: number = 100,
    leaderboardKey: string = RedisKeys.LEADERBOARD_GLOBAL,
  ): Promise<ILeaderboardEntry[]> {
    // ZREVRANGE with WITHSCORES returns [member, score, member, score, ...]
    const results = await this.redis.zrevrange(
      leaderboardKey,
      0,
      count - 1,
      'WITHSCORES',
    );

    const entries: ILeaderboardEntry[] = [];
    for (let i = 0; i < results.length; i += 2) {
      entries.push({
        userId: results[i],
        score: parseFloat(results[i + 1]),
        rank: Math.floor(i / 2) + 1,
      });
    }

    return entries;
  }

  /**
   * Get players around a user's rank
   */
  async getPlayersAroundUser(
    userId: string,
    range: number = 5,
    leaderboardKey: string = RedisKeys.LEADERBOARD_GLOBAL,
  ): Promise<{ entries: ILeaderboardEntry[]; userRank: number | null }> {
    const userRank = await this.getUserRank(userId, leaderboardKey);

    if (userRank === null) {
      return { entries: [], userRank: null };
    }

    const start = Math.max(0, userRank - 1 - range);
    const end = userRank - 1 + range;

    const results = await this.redis.zrevrange(
      leaderboardKey,
      start,
      end,
      'WITHSCORES',
    );

    const entries: ILeaderboardEntry[] = [];
    for (let i = 0; i < results.length; i += 2) {
      entries.push({
        userId: results[i],
        score: parseFloat(results[i + 1]),
        rank: start + Math.floor(i / 2) + 1,
      });
    }

    return { entries, userRank };
  }

  /**
   * Get total number of players
   */
  async getTotalPlayers(
    leaderboardKey: string = RedisKeys.LEADERBOARD_GLOBAL,
  ): Promise<number> {
    return this.redis.zcard(leaderboardKey);
  }
}

// ============================================================================
// RATE LIMITING / THROTTLING
// ============================================================================

export interface IThrottleResult {
  allowed: boolean;
  remaining: number;
  resetIn: number; // seconds
}

export class ThrottleService {
  private redis: Redis;

  constructor(redis?: Redis) {
    this.redis = redis || getRedisClient();
  }

  /**
   * Check if action is allowed (sliding window rate limit)
   */
  async checkRateLimit(
    userId: string,
    action: string,
    maxRequests: number,
    windowSeconds: number,
  ): Promise<IThrottleResult> {
    const key = RedisKeys.RATE_LIMIT(userId, action);
    const now = Date.now();
    const windowStart = now - windowSeconds * 1000;

    const pipeline = this.redis.pipeline();
    // Remove old entries
    pipeline.zremrangebyscore(key, 0, windowStart);
    // Count current entries
    pipeline.zcard(key);
    // Add current request
    pipeline.zadd(key, now, `${now}-${Math.random()}`);
    // Set TTL
    pipeline.expire(key, windowSeconds);

    const results = await pipeline.exec();

    if (!results) {
      throw new Error('Redis pipeline failed');
    }

    const currentCount = results[1]?.[1] as number;
    const allowed = currentCount < maxRequests;

    return {
      allowed,
      remaining: Math.max(0, maxRequests - currentCount - 1),
      resetIn: windowSeconds,
    };
  }

  /**
   * Simple click throttle check (fixed window)
   */
  async checkClickThrottle(
    userId: string,
    maxCPS: number = 20,
  ): Promise<{ allowed: boolean; currentCPS: number }> {
    const countKey = RedisKeys.USER_CLICK_COUNT(userId);
    const now = Date.now();

    // Get current count
    const currentCount = await this.redis.get(countKey);

    if (!currentCount) {
      // First click in window
      await this.redis.setex(countKey, 1, '1');
      return { allowed: true, currentCPS: 1 };
    }

    const count = parseInt(currentCount, 10);

    if (count >= maxCPS) {
      return { allowed: false, currentCPS: count };
    }

    await this.redis.incr(countKey);
    return { allowed: true, currentCPS: count + 1 };
  }

  /**
   * Record throttle violation
   */
  async recordViolation(userId: string): Promise<number> {
    const key = RedisKeys.USER_VIOLATIONS(userId);
    const violations = await this.redis.incr(key);
    // Violations expire after 1 hour
    await this.redis.expire(key, 3600);
    return violations;
  }

  /**
   * Check if user is temporarily banned
   */
  async isUserBanned(userId: string, maxViolations: number = 10): Promise<boolean> {
    const key = RedisKeys.USER_VIOLATIONS(userId);
    const violations = await this.redis.get(key);
    return violations !== null && parseInt(violations, 10) >= maxViolations;
  }
}

// ============================================================================
// BULLMQ QUEUE FACTORY
// ============================================================================

export const createQueue = <T>(
  name: string,
  defaultJobOptions?: Record<string, any>,
): Queue<T> => {
  return new Queue<T>(name, {
    connection: getRedisConfig() as RedisOptions,
    defaultJobOptions: {
      removeOnComplete: 100, // Keep last 100 completed
      removeOnFail: 1000, // Keep last 1000 failed for debugging
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      ...defaultJobOptions,
    },
  });
};

export const createWorker = <T, R>(
  name: string,
  processor: (job: Job<T>) => Promise<R>,
  concurrency: number = 10,
): Worker<T, R> => {
  return new Worker<T, R>(name, processor, {
    connection: getRedisConfig() as RedisOptions,
    concurrency,
    limiter: {
      max: 100,
      duration: 1000,
    },
  });
};

export const createQueueEvents = (name: string): QueueEvents => {
  return new QueueEvents(name, {
    connection: getRedisConfig() as RedisOptions,
  });
};

// ============================================================================
// DISTRIBUTED LOCKING
// ============================================================================

export class DistributedLock {
  private redis: Redis;

  constructor(redis?: Redis) {
    this.redis = redis || getRedisClient();
  }

  /**
   * Acquire a lock with TTL
   */
  async acquire(
    lockKey: string,
    ttlSeconds: number = 30,
  ): Promise<string | null> {
    const lockValue = `${Date.now()}-${Math.random()}`;
    const result = await this.redis.set(
      lockKey,
      lockValue,
      'EX',
      ttlSeconds,
      'NX',
    );

    return result === 'OK' ? lockValue : null;
  }

  /**
   * Release a lock (only if we own it)
   */
  async release(lockKey: string, lockValue: string): Promise<boolean> {
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;

    const result = await this.redis.eval(script, 1, lockKey, lockValue);
    return result === 1;
  }

  /**
   * Execute function with lock
   */
  async withLock<T>(
    lockKey: string,
    fn: () => Promise<T>,
    ttlSeconds: number = 30,
  ): Promise<T | null> {
    const lockValue = await this.acquire(lockKey, ttlSeconds);

    if (!lockValue) {
      return null;
    }

    try {
      return await fn();
    } finally {
      await this.release(lockKey, lockValue);
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export { Job, Queue, QueueEvents, Redis, Worker };
