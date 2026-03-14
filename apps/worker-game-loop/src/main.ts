/**
 * Worker Game Loop - Main Entry Point
 * Pure BullMQ consumer — no HTTP server.
 * Processes background jobs: click buffer flush, programs, offline calculation.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { WorkerModule } from './worker.module';

async function bootstrap() {
  const logger = new Logger('WorkerGameLoop');

  // Create application context only (no HTTP listener)
  // BullMQ processors and @nestjs/schedule crons start automatically via DI
  const app = await NestFactory.createApplicationContext(WorkerModule);

  // Enable graceful shutdown
  app.enableShutdownHooks();

  logger.log('Worker Game Loop started (pure BullMQ consumer, no HTTP)');
  logger.log(
    'Click buffer flush, program processor, offline calculator active',
  );
}

void bootstrap();
