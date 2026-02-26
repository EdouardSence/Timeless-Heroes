/**
 * User Progression Service - Main Entry Point
 * Hybrid app: HTTP for /health + NATS transport for business logic
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { ProgressionModule } from './progression.module';

async function bootstrap() {
  const logger = new Logger('SvcUserProgression');

  // 1. Create HTTP app (health endpoint only)
  const app = await NestFactory.create(ProgressionModule);
  const port = process.env.PROGRESSION_PORT || 3001;

  // 2. Connect NATS transport for inter-service communication
  const natsUrl = process.env.NATS_URL || 'nats://localhost:4222';
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [natsUrl],
      queue: 'svc-user-progression', // Load-balanced queue group
    },
  });

  // 3. Start both transports
  await app.startAllMicroservices();
  await app.listen(port);

  logger.log(`📊 User Progression Service running on port ${port} (health)`);
  logger.log(`📡 NATS transport connected to ${natsUrl}`);
}

void bootstrap();
