/**
 * API Gateway - Main Entry Point
 * Timeless-Heroes Idle Game Backend
 * 
 * This service runs as:
 * - HTTP server for REST API (port 3000)
 * - WebSocket server for real-time game updates (same port)
 * - REST endpoints for keylogger ingestion (same port)
 */

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  // Create the main HTTP application
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS configuration
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN', '*'),
    credentials: true,
  });

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Start HTTP server
  const httpPort = configService.get<number>('PORT', 3000);
  await app.listen(httpPort);

  console.log(`🎮 Timeless-Heroes API Gateway running on port ${httpPort}`);
  console.log(`🔌 WebSocket available at ws://localhost:${httpPort}/game`);
  console.log(`📡 Keylogger ingest at http://localhost:${httpPort}/api/v1/ingest`);
}

void bootstrap();
