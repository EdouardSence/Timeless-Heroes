/**
 * User Progression Service - Main Entry Point
 * Core business logic for user progression
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { ProgressionModule } from './progression.module';

async function bootstrap() {
  const logger = new Logger('SvcUserProgression');
  
  // Create HTTP app for REST endpoints
  const app = await NestFactory.create(ProgressionModule);
  const port = process.env.PROGRESSION_PORT || 3001;
  await app.listen(port);
  
  logger.log(`📊 User Progression Service running on port ${port}`);
  
  // TODO: Add gRPC microservice
  /*
  const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    ProgressionModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'progression',
        protoPath: join(__dirname, '../proto/progression.proto'),
        url: 'localhost:5001',
      },
    },
  );
  
  await grpcApp.listen();
  logger.log('📡 gRPC server available on port 5001');
  */
}

void bootstrap();
