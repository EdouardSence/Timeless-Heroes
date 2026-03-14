/**
 * Game Gateway Module
 * WebSocket gateway for real-time game communication
 */

import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { ClickProcessorModule } from '../click-processor/click-processor.module';

import { GameGateway } from './game.gateway';

@Module({
  exports: [GameGateway],
  imports: [
    ClickProcessorModule,
    AuthModule,
  ],
  providers: [GameGateway],
})
export class GameGatewayModule {}
