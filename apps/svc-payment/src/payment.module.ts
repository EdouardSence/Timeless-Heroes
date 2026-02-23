/**
 * Payment Module
 * Main module for payment service
 */

import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { QueueName } from '@repo/shared-types';
import { IdempotencyService } from './idempotency/idempotency.service';
import { ProvisionOrderProcessor } from './provision/provision-order.processor';
import { ProvisionService } from './provision/provision.service';
import { PaymentController } from './payment/payment.controller';
import { StripeWebhookController } from './stripe/stripe-webhook.controller';
import { StripeService } from './stripe/stripe.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env.local', '../../.env', '.env.local', '.env'],
    }),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),

    BullModule.registerQueue({
      name: QueueName.PROVISION_ORDER,
    }),
  ],
  controllers: [StripeWebhookController, PaymentController],
  providers: [
    StripeService,
    ProvisionOrderProcessor,
    ProvisionService,
    IdempotencyService,
  ],
})
export class PaymentModule { }
