/* istanbul ignore file */
/**
 * Redis Module - Provides Redis services for the svc-user-progression
 */

import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClickBufferService,
  LeaderboardService,
} from '@repo/redis-client';
import Redis from 'ioredis';

// Redis client provider
const RedisClientProvider = {
  inject: [ConfigService],
  provide: 'REDIS_CLIENT',
  useFactory: (configService: ConfigService) => {
    return new Redis({
      db: configService.get<number>('REDIS_DB', 0),
      host: configService.get<string>('REDIS_HOST', 'localhost'),
      maxRetriesPerRequest: null,
      password: configService.get<string>('REDIS_PASSWORD'),
      port: configService.get<number>('REDIS_PORT', 6379),
    });
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

@Global()
@Module({
  exports: [
    'REDIS_CLIENT',
    ClickBufferService,
    LeaderboardService,
  ],
  providers: [
    RedisClientProvider,
    ClickBufferServiceProvider,
    LeaderboardServiceProvider,
  ],
})
export class RedisModule {}
