/**
 * Payment Module
 * Main module for payment service
 */

import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_SERVICE, QueueName } from '@repo/shared-types';
import Redis from 'ioredis';

import { IdempotencyService } from './idempotency/idempotency.service';
import { PaymentHealthController } from './payment-health.controller';
import { ProvisionOrderProcessor } from './provision/provision-order.processor';
import { ProvisionService } from './provision/provision.service';
import { StripeWebhookController } from './stripe/stripe-webhook.controller';
import { StripeService } from './stripe/stripe.service';

// Redis client provider (for boost storage)
const RedisClientProvider = {
  inject: [ConfigService],
  provide: 'REDIS_CLIENT',
  useFactory: (configService: ConfigService) => {
    return new Redis({
      host: configService.get<string>('REDIS_HOST', 'localhost'),
      maxRetriesPerRequest: null,
      password: configService.get<string>('REDIS_PASSWORD'),
      port: configService.get<number>('REDIS_PORT', 6379),
    });
  },
};

@Module({
  controllers: [StripeWebhookController, PaymentHealthController],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          maxRetriesPerRequest: null,
          password: configService.get<string>('REDIS_PASSWORD'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
      }),
    }),

    BullModule.registerQueue({
      name: QueueName.PROVISION_ORDER,
    }),

    // NATS ClientProxy for inter-service communication (progression service)
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        name: NATS_SERVICE.PROGRESSION,
        useFactory: (configService: ConfigService) => ({
          options: {
            servers: [
              configService.get<string>('NATS_URL', 'nats://localhost:4222'),
            ],
          },
          transport: Transport.NATS,
        }),
      },
    ]),
  ],
  providers: [
    RedisClientProvider,
    StripeService,
    ProvisionOrderProcessor,
    ProvisionService,
    IdempotencyService,
  ],
})
export class PaymentModule {}
