/**
 * Worker Module
 * Main module for the game loop worker microservice
 * 
 * This worker handles all background BullMQ jobs:
 * - Click buffer flushing (Redis -> PostgreSQL)
 * - Program completion processing
 * - Offline rewards calculation
 * - Achievement checking
 */

import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { QueueName } from '@repo/shared-types';
import { ClickBufferModule } from './click-buffer/click-buffer.module';
import { OfflineCalculatorModule } from './offline-calculator/offline-calculator.module';
import { ProgramProcessorModule } from './program-processor/program-processor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env.local', '../../.env', '.env.local', '.env'],
    }),

    ScheduleModule.forRoot(),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),

    BullModule.registerQueue(
      { name: QueueName.CLICK_BUFFER },
      { name: QueueName.PROGRAM_COMPLETION },
      { name: QueueName.OFFLINE_CALCULATION },
      { name: QueueName.ACHIEVEMENT_CHECK },
    ),

    // Feature Modules
    ClickBufferModule,      // NEW: Handles Redis -> PostgreSQL flush
    ProgramProcessorModule,
    OfflineCalculatorModule,
  ],
})
export class WorkerModule { }
