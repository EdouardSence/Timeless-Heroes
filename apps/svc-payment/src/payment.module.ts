/**
 * Payment Module
 * Main module for payment service
 */

import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { QueueName } from '@repo/shared-types';
import { IdempotencyService } from './idempotency/idempotency.service';
import { ProvisionOrderProcessor } from './provision/provision-order.processor';
import { ProvisionService } from './provision/provision.service';
import { StripeWebhookController } from './stripe/stripe-webhook.controller';
import { StripeService } from './stripe/stripe.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
      },
    }),
    
    BullModule.registerQueue({
      name: QueueName.PROVISION_ORDER,
    }),
  ],
  controllers: [StripeWebhookController],
  providers: [
    StripeService,
    ProvisionOrderProcessor,
    ProvisionService,
    IdempotencyService,
  ],
})
export class PaymentModule {}
