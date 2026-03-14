/**
 * Click Buffer Worker Module
 * Handles flushing the Redis click buffer to PostgreSQL
 * 
 * This implements the Write-Behind pattern:
 * - Clicks are accumulated in Redis (fast)
 * - Every 5 seconds, this worker batch-updates PostgreSQL
 * - Reduces database IOPS significantly
 */

import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import Redis from 'ioredis';

import { ClickBufferService, LeaderboardService } from '@repo/redis-client';
import { NATS_SERVICE, QueueName } from '@repo/shared-types';
import { ClickBufferFlushService } from './click-buffer-flush.service';
import { ClickBufferWorker } from './click-buffer.worker';

// Redis client provider
const RedisClientProvider = {
  inject: [ConfigService],
  provide: 'REDIS_CLIENT',
  useFactory: (configService: ConfigService) => {
    return new Redis({
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

@Module({
  exports: [ClickBufferFlushService],
  imports: [
    ConfigModule,
    ScheduleModule.forRoot(),
    BullModule.registerQueue({
      name: QueueName.CLICK_BUFFER,
    }),
    ClientsModule.registerAsync([
      {
        name: NATS_SERVICE.PROGRESSION,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [configService.get<string>('NATS_URL', 'nats://localhost:4222')],
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    RedisClientProvider,
    ClickBufferServiceProvider,
    LeaderboardServiceProvider,
    ClickBufferWorker,
    ClickBufferFlushService,
  ],
})
export class ClickBufferModule {}
