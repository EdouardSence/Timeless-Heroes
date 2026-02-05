/**
 * API Gateway - Main Entry Point
 * Timeless-Heroes Idle Game Backend
 * 
 * This service runs as a HYBRID application:
 * - HTTP server for REST API (port 3000)
 * - WebSocket server for real-time game updates (same port)
 * - TCP microservice for keylogger ingestion (port 9999)
 */

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

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

  // Connect TCP microservice for keylogger ingestion
  const tcpPort = configService.get<number>('TCP_INGEST_PORT', 9999);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: tcpPort,
    },
  });

  // Start all microservices
  await app.startAllMicroservices();
  console.log(`📡 TCP Ingest microservice listening on port ${tcpPort}`);

  // Start HTTP server
  const httpPort = configService.get<number>('PORT', 3000);
  await app.listen(httpPort);

  console.log(`🎮 Timeless-Heroes API Gateway running on port ${httpPort}`);
  console.log(`🔌 WebSocket available at ws://localhost:${httpPort}/game`);
  console.log(`🔐 TCP Keylogger ingestion at tcp://localhost:${tcpPort}`);
}

void bootstrap();
