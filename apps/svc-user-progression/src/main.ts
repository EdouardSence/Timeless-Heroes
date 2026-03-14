/**
 * User Progression Service - Main Entry Point
 * Hybrid NestJS application: Redis microservice transport + HTTP health check
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { validateEnv } from './env.validation';
import { ProgressionModule } from './progression.module';

async function bootstrap() {
  // Validate environment variables — crash early if DATABASE_URL is missing
  validateEnv();

  const logger = new Logger('SvcUserProgression');

  // Create HTTP app (health endpoint only)
  const app = await NestFactory.create(ProgressionModule);

  // Connect Redis microservice transport (for @MessagePattern handlers)
  app.connectMicroservice<MicroserviceOptions>({
    options: {
      host: process.env.REDIS_HOST ?? 'localhost',
      password: process.env.REDIS_PASSWORD ?? undefined,
      port: Number.parseInt(process.env.REDIS_PORT ?? '6379', 10),
    },
    transport: Transport.REDIS,
  });

  // Start all microservice transports
  await app.startAllMicroservices();
  logger.log('Redis microservice transport connected');

  // Start HTTP listener (for /health only)
  const port = process.env.PROGRESSION_PORT ?? 3001;
  await app.listen(port);

  logger.log(`User Progression Service running on port ${port} (hybrid)`);
}

void bootstrap();
