/**
 * Payment Service - Main Entry Point
 * Hybrid NestJS application: Redis microservice transport + HTTP (Stripe webhooks + health)
 */

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { validateEnv } from './env.validation';
import { PaymentModule } from './payment.module';

async function bootstrap() {
  // Validate environment variables — crash early if Stripe keys are missing
  validateEnv();

  const logger = new Logger('SvcPayment');

  const app = await NestFactory.create(PaymentModule, {
    // Raw body needed for Stripe webhook signature verification
    rawBody: true,
  });

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

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PAYMENT_PORT', 3003);

  await app.listen(port);

  logger.log(`Payment Service running on port ${port} (hybrid)`);
  logger.log('Stripe webhook endpoint: POST /webhooks/stripe');
}

void bootstrap();
