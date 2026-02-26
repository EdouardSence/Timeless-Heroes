/**
 * Worker Game Loop - Main Entry Point
 * Pure NATS microservice + BullMQ workers
 * NO HTTP exposure — communicates only via NATS and Redis queues
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { WorkerModule } from './worker.module';

async function bootstrap() {
  const logger = new Logger('WorkerGameLoop');
  const natsUrl = process.env.NATS_URL || 'nats://localhost:4222';

  // Create as a pure NATS microservice (no HTTP port)
  // BullMQ @Processor workers auto-start via module initialization
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    WorkerModule,
    {
      transport: Transport.NATS,
      options: {
        servers: [natsUrl],
        queue: 'worker-game-loop', // Load-balanced queue group
      },
    },
  );

  await app.listen();

  logger.log(`⚙️ Worker Game Loop started (NATS: ${natsUrl})`);
  logger.log('📦 BullMQ processors active: click-buffer, programs, offline');
  logger.log('🚫 No HTTP port exposed — pure microservice');
}

void bootstrap();
