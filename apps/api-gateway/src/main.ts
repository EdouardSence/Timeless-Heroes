/* istanbul ignore file */
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
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  // Create the main HTTP application
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    }),
  );

  // CORS configuration
  app.enableCors({
    credentials: true,
    origin: configService.get<string>('CORS_ORIGIN', '*'),
  });

  // API prefix
  app.setGlobalPrefix('api/v1');

  // ── Swagger / OpenAPI documentation ──
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Timeless Heroes API')
    .setDescription(
      'REST API for the Timeless-Heroes developer idle/clicker game. ' +
        'Handles authentication, user progression, leaderboard, ' +
        'keylogger ingestion and health checks. ' +
        'Real-time gameplay uses the WebSocket gateway at ws://localhost:3000/game.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .addTag('Auth', 'User registration & login (JWT)')
    .addTag('Progression', 'Player progression & leaderboard (requires JWT)')
    .addTag('Ingest', 'Anonymised keylogger ingestion from desktop agent')
    .addTag('Health', 'Aggregated service health checks via NATS')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  // Start HTTP server
  const httpPort = configService.get<number>('PORT', 3000);
  await app.listen(httpPort);

  console.log(`🎮 Timeless-Heroes API Gateway running on port ${httpPort}`);
  console.log(`🔌 WebSocket available at ws://localhost:${httpPort}/game`);
  console.log(
    `📡 Keylogger ingest at http://localhost:${httpPort}/api/v1/ingest`,
  );
  console.log(`📖 Swagger docs at http://localhost:${httpPort}/docs`);
}

void bootstrap();
