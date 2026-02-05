/**
 * Worker Game Loop - Main Entry Point
 * Handles BullMQ workers for programs, offline calculation, etc.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { WorkerModule } from './worker.module';

async function bootstrap() {
  const logger = new Logger('WorkerGameLoop');
  
  const app = await NestFactory.create(WorkerModule);
  
  // This is a worker service, not an HTTP server by default
  // But we can expose a health check endpoint
  const port = process.env.WORKER_PORT || 3002;
  await app.listen(port);
  
  logger.log(`⚙️ Worker Game Loop started on port ${port}`);
  logger.log('📦 Program Processor active');
  logger.log('🌙 Offline Calculator active');
}

void bootstrap();
