/**
 * Game Gateway Module
 * WebSocket gateway for real-time game communication
 */

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ServiceToken } from '@repo/shared-types';

import { AuthModule } from '../auth/auth.module';
import { ClickProcessorModule } from '../click-processor/click-processor.module';

import { GameGateway } from './game.gateway';

@Module({
  exports: [GameGateway],
  imports: [
    ClickProcessorModule,
    AuthModule,

    // Microservice clients for delegating business logic
    ClientsModule.register([
      {
        name: ServiceToken.PROGRESSION,
        options: {
          host: process.env.REDIS_HOST ?? 'localhost',
          password: process.env.REDIS_PASSWORD ?? undefined,
          port: Number.parseInt(process.env.REDIS_PORT ?? '6379', 10),
        },
        transport: Transport.REDIS,
      },
      {
        name: ServiceToken.PAYMENT,
        options: {
          host: process.env.REDIS_HOST ?? 'localhost',
          password: process.env.REDIS_PASSWORD ?? undefined,
          port: Number.parseInt(process.env.REDIS_PORT ?? '6379', 10),
        },
        transport: Transport.REDIS,
      },
    ]),
  ],
  providers: [GameGateway],
})
export class GameGatewayModule {}
