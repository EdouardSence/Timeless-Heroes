/* istanbul ignore file */
/**
 * Redis Module - Provides Redis services for the api-gateway
 */

import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClickBufferService,
  DistributedLock,
  LeaderboardService,
  ThrottleService,
} from '@repo/redis-client';
import Redis from 'ioredis';

// Redis client provider
const RedisClientProvider = {
  inject: [ConfigService],
  provide: 'REDIS_CLIENT',
  useFactory: (configService: ConfigService) => {
    const redis = new Redis({
      db: configService.get<number>('REDIS_DB', 0),
      host: configService.get<string>('REDIS_HOST', 'localhost'),
      maxRetriesPerRequest: null, // Required for BullMQ compatibility
      password: configService.get<string>('REDIS_PASSWORD'),
      port: configService.get<number>('REDIS_PORT', 6379),
    });

    redis.on('connect', () => {
      console.log('✅ Redis connected');
    });

    redis.on('error', (err) => {
      console.error('❌ Redis error:', err);
    });

    return redis;
  },
};

// Click Buffer Service provider
const ClickBufferServiceProvider = {
  inject: ['REDIS_CLIENT'],
  provide: ClickBufferService,
  useFactory: (redis: Redis) => new ClickBufferService(redis),
};

// Leaderboard Service provider
const LeaderboardServiceProvider = {
  inject: ['REDIS_CLIENT'],
  provide: LeaderboardService,
  useFactory: (redis: Redis) => new LeaderboardService(redis),
};

// Throttle Service provider
const ThrottleServiceProvider = {
  inject: ['REDIS_CLIENT'],
  provide: ThrottleService,
  useFactory: (redis: Redis) => new ThrottleService(redis),
};

// Distributed Lock provider
const DistributedLockProvider = {
  inject: ['REDIS_CLIENT'],
  provide: DistributedLock,
  useFactory: (redis: Redis) => new DistributedLock(redis),
};

@Global()
@Module({
  exports: [
    'REDIS_CLIENT',
    ClickBufferService,
    LeaderboardService,
    ThrottleService,
    DistributedLock,
  ],
  providers: [
    RedisClientProvider,
    ClickBufferServiceProvider,
    LeaderboardServiceProvider,
    ThrottleServiceProvider,
    DistributedLockProvider,
  ],
})
export class RedisModule {}
