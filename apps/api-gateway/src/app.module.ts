/**
 * API Gateway - Main Application Module
 * 
 * This gateway handles ONLY routing and real-time communication:
 * - HTTP REST API endpoints (including keylogger ingestion)
 * - WebSocket connections for real-time game updates
 * - JWT authentication and validation
 * - Click validation and Redis buffering
 * 
 * Delegates business logic to downstream services via NATS (ClientProxy).
 */

import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { NATS_SERVICE } from '@repo/shared-types';
import { validate } from './config/env.validation';
import { AuthModule } from './auth/auth.module';
import { ClickProcessorModule } from './click-processor/click-processor.module';
import { GameGatewayModule } from './gateway/game-gateway.module';
import { HealthModule } from './health/health.module';
import { RedisModule } from './redis/redis.module';
import { TcpIngestModule } from './tcp-ingest/tcp-ingest.module';

/**
 * Global NATS Clients Module - provides NATS client proxies to all modules
 */
@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: NATS_SERVICE.PROGRESSION,
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [config.get<string>('NATS_URL', 'nats://localhost:4222')],
          },
        }),
        inject: [ConfigService],
      },
      {
        name: NATS_SERVICE.PAYMENT,
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [config.get<string>('NATS_URL', 'nats://localhost:4222')],
          },
        }),
        inject: [ConfigService],
      },
      {
        name: NATS_SERVICE.WORKER,
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [config.get<string>('NATS_URL', 'nats://localhost:4222')],
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class NatsClientsModule {}

@Module({
  imports: [
    // Configuration with validation - fails fast if required env vars missing
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validate,
    }),

    // ── NATS ClientProxy — transport-agnostic microservice communication ──
    NatsClientsModule,

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

    // Aggregated health checks via NATS
    HealthModule,
  ],
})
export class AppModule { }
