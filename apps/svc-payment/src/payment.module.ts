/**
 * Payment Module
 * Main module for payment service
 */

import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import Redis from 'ioredis';

import { NATS_SERVICE, QueueName } from '@repo/shared-types';
import { IdempotencyService } from './idempotency/idempotency.service';
import { PaymentHealthController } from './payment-health.controller';
import { ProvisionOrderProcessor } from './provision/provision-order.processor';
import { ProvisionService } from './provision/provision.service';
import { StripeWebhookController } from './stripe/stripe-webhook.controller';
import { StripeService } from './stripe/stripe.service';

// Redis client provider (for boost storage)
const RedisClientProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: (configService: ConfigService) => {
    return new Redis({
      host: configService.get<string>('REDIS_HOST', 'localhost'),
      port: configService.get<number>('REDIS_PORT', 6379),
      password: configService.get<string>('REDIS_PASSWORD'),
      maxRetriesPerRequest: null,
    });
  },
  inject: [ConfigService],
};

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

    // NATS ClientProxy for inter-service communication (progression service)
    ClientsModule.registerAsync([
      {
        name: NATS_SERVICE.PROGRESSION,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [configService.get<string>('NATS_URL', 'nats://localhost:4222')],
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [StripeWebhookController, PaymentHealthController],
  providers: [
    RedisClientProvider,
    StripeService,
    ProvisionOrderProcessor,
    ProvisionService,
    IdempotencyService,
  ],
})
export class PaymentModule {}
