/**
 * Payment Service - Main Entry Point
 * Hybrid app: HTTP for Stripe webhooks + NATS transport for inter-service calls
 */

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { PaymentModule } from './payment.module';

async function bootstrap() {
  const logger = new Logger('SvcPayment');
  
  // 1. Create HTTP app (Stripe webhooks need raw body + HTTP POST)
  const app = await NestFactory.create(PaymentModule, {
    rawBody: true,
  });
  
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PAYMENT_PORT', 3003);
  const natsUrl = configService.get<string>('NATS_URL', 'nats://localhost:4222');

  // 2. Connect NATS transport for inter-service communication
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [natsUrl],
      queue: 'svc-payment', // Load-balanced queue group
    },
  });

  // 3. Start both transports
  await app.startAllMicroservices();
  await app.listen(port);
  
  logger.log(`💳 Payment Service running on port ${port} (Stripe webhooks)`);
  logger.log(`📡 NATS transport connected to ${natsUrl}`);
}

void bootstrap();
