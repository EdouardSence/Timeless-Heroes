/**
 * Payment Service - Main Entry Point
 * Handles Stripe webhooks and payment processing
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { PaymentModule } from './payment.module';

async function bootstrap() {
  const logger = new Logger('SvcPayment');
  
  const app = await NestFactory.create(PaymentModule, {
    // Raw body needed for Stripe webhook signature verification
    rawBody: true,
  });
  
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PAYMENT_PORT', 3003);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  await app.listen(port);
  
  logger.log(`💳 Payment Service running on port ${port}`);
  logger.log(`📥 Stripe webhook endpoint: POST /webhooks/stripe`);
}

void bootstrap();
