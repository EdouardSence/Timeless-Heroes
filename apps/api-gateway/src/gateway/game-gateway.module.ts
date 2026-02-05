/**
 * Game Gateway Module
 * WebSocket gateway for real-time game communication
 */

import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from '../auth/auth.module';
import { ClickProcessorModule } from '../click-processor/click-processor.module';
import { GameGateway } from './game.gateway';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ClickProcessorModule,
    AuthModule,
  ],
  providers: [GameGateway],
  exports: [GameGateway],
})
export class GameGatewayModule {}
