/**
 * Redis Module - Provides Redis services for the api-gateway
 */

import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import {
    ClickBufferService,
    DistributedLock,
    LeaderboardService,
    ThrottleService,
} from '@repo/redis-client';

// Redis client provider
const RedisClientProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: (configService: ConfigService) => {
    const redis = new Redis({
      host: configService.get<string>('REDIS_HOST', 'localhost'),
      port: configService.get<number>('REDIS_PORT', 6379),
      password: configService.get<string>('REDIS_PASSWORD'),
      db: configService.get<number>('REDIS_DB', 0),
      maxRetriesPerRequest: null, // Required for BullMQ compatibility
    });
    
    redis.on('connect', () => {
      console.log('✅ Redis connected');
    });
    
    redis.on('error', (err) => {
      console.error('❌ Redis error:', err);
    });
    
    return redis;
  },
  inject: [ConfigService],
};

// Click Buffer Service provider
const ClickBufferServiceProvider = {
  provide: ClickBufferService,
  useFactory: (redis: Redis) => new ClickBufferService(redis),
  inject: ['REDIS_CLIENT'],
};

// Leaderboard Service provider
const LeaderboardServiceProvider = {
  provide: LeaderboardService,
  useFactory: (redis: Redis) => new LeaderboardService(redis),
  inject: ['REDIS_CLIENT'],
};

// Throttle Service provider
const ThrottleServiceProvider = {
  provide: ThrottleService,
  useFactory: (redis: Redis) => new ThrottleService(redis),
  inject: ['REDIS_CLIENT'],
};

// Distributed Lock provider
const DistributedLockProvider = {
  provide: DistributedLock,
  useFactory: (redis: Redis) => new DistributedLock(redis),
  inject: ['REDIS_CLIENT'],
};

@Global()
@Module({
  providers: [
    RedisClientProvider,
    ClickBufferServiceProvider,
    LeaderboardServiceProvider,
    ThrottleServiceProvider,
    DistributedLockProvider,
  ],
  exports: [
    'REDIS_CLIENT',
    ClickBufferService,
    LeaderboardService,
    ThrottleService,
    DistributedLock,
  ],
})
export class RedisModule {}
