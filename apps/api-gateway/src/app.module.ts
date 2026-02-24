/**
 * API Gateway - Main Application Module
 * 
 * This gateway handles ONLY routing and real-time communication:
 * - HTTP REST API endpoints (including keylogger ingestion)
 * - WebSocket connections for real-time game updates
 * - JWT authentication and validation
 * - Click validation and Redis buffering
 * 
 * Business logic (buffer flushing, persistence) is in worker-game-loop.
 */

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

    // Shared infrastructure
    RedisModule,

    // Auth (JWT validation)
    AuthModule,

    // Click receive → validate → buffer in Redis
    ClickProcessorModule,

    // WebSocket real-time gateway
    GameGatewayModule,

    // HTTP REST ingestion from keylogger
    TcpIngestModule,
  ],
})
export class AppModule { }
