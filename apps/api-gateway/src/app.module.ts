/**
 * API Gateway - Main Application Module
 * 
 * This is the main entry point for the API Gateway.
 * It handles:
 * - HTTP REST API endpoints (including keylogger ingestion)
 * - WebSocket connections for real-time game updates
 * - BullMQ job processing
 */

import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { ClickProcessorModule } from './click-processor/click-processor.module';
import { GameGatewayModule } from './gateway/game-gateway.module';
import { RedisModule } from './redis/redis.module';
import { TcpIngestModule } from './tcp-ingest/tcp-ingest.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // BullMQ Queue Configuration
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
      },
    }),

    // Feature Modules
    RedisModule,
    AuthModule,
    ClickProcessorModule,
    GameGatewayModule,
    TcpIngestModule, // HTTP REST ingestion from keylogger
  ],
})
export class AppModule { }
