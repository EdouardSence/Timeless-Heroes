/**
 * API Gateway - Main Application Module
 * 
 * This is the main entry point for the API Gateway microservice.
 * It handles:
 * - HTTP REST API endpoints
 * - WebSocket connections for real-time game updates
 * - TCP ingestion from the keylogger agent
 * - BullMQ job processing
 */

import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { ClickProcessorModule } from './click-processor/click-processor.module';
import { GameGatewayModule } from './gateway/game-gateway.module';
import { PaymentModule } from './payment/payment.module';
import { RedisModule } from './redis/redis.module';
import { TcpIngestModule } from './tcp-ingest/tcp-ingest.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env.local', '../../.env', '.env.local', '.env'],
    }),

    // BullMQ Queue Configuration
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

    // Feature Modules
    RedisModule,
    AuthModule,
    ClickProcessorModule,
    GameGatewayModule,
    TcpIngestModule, // TCP ingestion from keylogger
    PaymentModule,
  ],
})
export class AppModule { }
