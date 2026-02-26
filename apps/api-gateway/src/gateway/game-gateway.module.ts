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
  imports: [
    ClickProcessorModule,
    AuthModule,
    // NATS ClientProxy for progression microservice
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
    ]),
  ],
  providers: [GameGateway],
  exports: [GameGateway],
})
export class GameGatewayModule {}
