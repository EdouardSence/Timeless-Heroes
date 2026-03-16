/* istanbul ignore file */
/**
 * Worker Module
 * Main module for the game loop worker microservice
 *
 * This worker handles all background BullMQ jobs:
 * - Click buffer flushing (Redis -> PostgreSQL)
 * - Program completion processing
 * - Offline rewards calculation
 *
 * SCALABILITY: Supports WORKER_ROLE env var for multi-replica deployments.
 * - 'all'     (default) — loads ScheduleModule (cron) + all worker modules
 * - 'cron'    — loads only ScheduleModule + ClickBufferModule (flush scheduler)
 * - 'workers' — loads only worker modules (no cron scheduler)
 *
 * Even when multiple replicas run with role='all', the cron flush is safe
 * because ClickBufferFlushService uses a distributed Redis lock (SET NX).
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

/** Supported worker roles for multi-replica deployments */
type WorkerRole = 'all' | 'cron' | 'workers';

/** Determine which feature modules to load based on WORKER_ROLE */
const workerRole: WorkerRole = (process.env.WORKER_ROLE || 'all') as WorkerRole;

const enableCron = workerRole === 'all' || workerRole === 'cron';
const enableWorkers = workerRole === 'all' || workerRole === 'workers';

/** Feature modules loaded based on the replica's role */
const featureModules = [
  // ClickBufferModule is always loaded: it provides both the cron flush
  // (guarded by distributed lock) and the BullMQ click-buffer worker.
  ClickBufferModule,
  ...(enableWorkers ? [ProgramProcessorModule, OfflineCalculatorModule] : []),
];

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),

    // ScheduleModule enables @Cron decorators; skip if role='workers'
    ...(enableCron ? [ScheduleModule.forRoot()] : []),

    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST ?? 'localhost',
        password: process.env.REDIS_PASSWORD ?? undefined,
        port: Number.parseInt(process.env.REDIS_PORT ?? '6379', 10),
      },
    }),

    BullModule.registerQueue(
      { name: QueueName.CLICK_BUFFER },
      { name: QueueName.PROGRAM_COMPLETION },
      { name: QueueName.OFFLINE_CALCULATION },
    ),

    // Feature Modules (conditionally loaded based on WORKER_ROLE)
    ...featureModules,
  ],
  controllers: [WorkerHealthController],
})
export class WorkerModule {}
