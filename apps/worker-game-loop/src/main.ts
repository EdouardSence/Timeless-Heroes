/**
 * Worker Game Loop - Main Entry Point
 * Pure NATS microservice + BullMQ workers
 *
 * The worker is NOT exposed via HTTP. It:
 *   - Listens to NATS message patterns (health.check)
 *   - Processes BullMQ jobs (click-buffer, offline-calc, program-completion)
 * All health checking is done through the NATS health.check pattern, queryable
 * from the api-gateway HealthModule.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { WorkerModule } from './worker.module';

async function bootstrap() {
  const logger = new Logger('WorkerGameLoop');
  const natsUrl = process.env.NATS_URL || 'nats://localhost:4222';

  // Pure NATS microservice — no HTTP port exposed
  // BullMQ @Processor workers auto-start via NestJS module initialization
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

  logger.log(`Worker Game Loop started (NATS: ${natsUrl})`);
  logger.log('BullMQ processors active: click-buffer, programs, offline');
  logger.log('No HTTP port — health check via NATS health.check pattern');
}

void bootstrap();
