/**
 * Progression Module
 * Main module for user progression service
 */

import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { QueueName } from '@repo/shared-types';
import { ProgressionController } from './controllers/progression.controller';
import { ItemCostCalculatorService } from './services/item-cost-calculator.service';
import { LeaderboardSyncService } from './services/leaderboard-sync.service';
import { ProgressionService } from './services/progression.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
      },
    }),
    
    BullModule.registerQueue({
      name: QueueName.LEADERBOARD_UPDATE,
    }),
  ],
  controllers: [ProgressionController],
  providers: [
    ProgressionService,
    ItemCostCalculatorService,
    LeaderboardSyncService,
  ],
  exports: [ProgressionService, ItemCostCalculatorService],
})
export class ProgressionModule {}
