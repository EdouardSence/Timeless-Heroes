/* istanbul ignore file */
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

import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_SERVICE } from '@repo/shared-types';
import { NextFunction, Request, Response } from 'express';

import { AuthModule } from './auth/auth.module';
import { ClickProcessorModule } from './click-processor/click-processor.module';
import { validate } from './config/env.validation';
import { GameGatewayModule } from './gateway/game-gateway.module';
import { HealthModule } from './health/health.module';
import { ProgressionModule } from './progression/progression.module';
import { RedisModule } from './redis/redis.module';
import { TcpIngestModule } from './tcp-ingest/tcp-ingest.module';

/**
 * Global NATS Clients Module - provides NATS client proxies to all modules
 */
@Global()
@Module({
  exports: [ClientsModule],
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        name: NATS_SERVICE.PROGRESSION,
        useFactory: (config: ConfigService) => ({
          options: {
            servers: [config.get<string>('NATS_URL', 'nats://localhost:4222')],
          },
          transport: Transport.NATS,
        }),
      },
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        name: NATS_SERVICE.PAYMENT,
        useFactory: (config: ConfigService) => ({
          options: {
            servers: [config.get<string>('NATS_URL', 'nats://localhost:4222')],
          },
          transport: Transport.NATS,
        }),
      },
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        name: NATS_SERVICE.WORKER,
        useFactory: (config: ConfigService) => ({
          options: {
            servers: [config.get<string>('NATS_URL', 'nats://localhost:4222')],
          },
          transport: Transport.NATS,
        }),
      },
    ]),
  ],
})
export class NatsClientsModule {}

@Module({
  imports: [
    // Configuration with validation - fails fast if required env vars missing
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
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

    // HTTP REST progression data proxy
    ProgressionModule,

    // Aggregated health checks via NATS
    HealthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req: Request, res: Response, next: NextFunction) => {
        const { method, originalUrl } = req;
        const start = Date.now();
        res.on('finish', () => {
          const duration = Date.now() - start;
          const { statusCode } = res;
          console.log(
            `[HTTP] ${method} ${originalUrl} ${String(statusCode)} - ${String(duration)}ms`,
          );
        });
        next();
      })
      .forRoutes('*');
  }
}
