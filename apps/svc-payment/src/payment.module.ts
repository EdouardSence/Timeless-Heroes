/**
 * Payment Module
 * Main module for payment service
 */

import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QueueName } from '@repo/shared-types';

import { HealthController } from './health.controller';
import { IdempotencyService } from './idempotency/idempotency.service';
import { PaymentTransportController } from './payment-transport.controller';
import { ProvisionOrderProcessor } from './provision/provision-order.processor';
import { ProvisionService } from './provision/provision.service';
import { StripeWebhookController } from './stripe/stripe-webhook.controller';
import { StripeService } from './stripe/stripe.service';

@Module({
  controllers: [
    HealthController,
    PaymentTransportController,
    StripeWebhookController,
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),

    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST ?? 'localhost',
        password: process.env.REDIS_PASSWORD ?? undefined,
        port: Number.parseInt(process.env.REDIS_PORT ?? '6379', 10),
      },
    }),

    BullModule.registerQueue({
      name: QueueName.PROVISION_ORDER,
    }),
  ],
  providers: [
    StripeService,
    ProvisionOrderProcessor,
    ProvisionService,
    IdempotencyService,
  ],
})
export class PaymentModule {}
