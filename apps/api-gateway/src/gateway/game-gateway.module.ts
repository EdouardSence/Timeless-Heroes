/**
 * Game Gateway Module
 * WebSocket gateway for real-time game communication
 */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_SERVICE } from '@repo/shared-types';

import { AuthModule } from '../auth/auth.module';
import { ClickProcessorModule } from '../click-processor/click-processor.module';

import { GameGateway } from './game.gateway';

@Module({
  exports: [GameGateway],
  imports: [
    ClickProcessorModule,
    AuthModule,
    // NATS ClientProxy for progression microservice
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
    ]),
  ],
  providers: [GameGateway],
})
export class GameGatewayModule {}
