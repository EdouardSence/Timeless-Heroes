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
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { QueueName } from '@repo/shared-types';
import { ClickBufferModule } from './click-buffer/click-buffer.module';
import { OfflineCalculatorModule } from './offline-calculator/offline-calculator.module';
import { ProgramProcessorModule } from './program-processor/program-processor.module';
import { WorkerHealthController } from './worker-health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    ScheduleModule.forRoot(),

    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
      },
    }),

    BullModule.registerQueue(
      { name: QueueName.CLICK_BUFFER },
      { name: QueueName.PROGRAM_COMPLETION },
      { name: QueueName.OFFLINE_CALCULATION },
      { name: QueueName.ACHIEVEMENT_CHECK },
    ),

    // Feature Modules
    ClickBufferModule,      // Handles Redis -> PostgreSQL flush
    ProgramProcessorModule,
    OfflineCalculatorModule,
  ],
  controllers: [WorkerHealthController],
})
export class WorkerModule { }
