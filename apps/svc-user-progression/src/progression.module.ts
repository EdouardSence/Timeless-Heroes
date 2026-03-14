/* istanbul ignore file */
/**
 * Progression Module
 * Main module for user progression service
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ProgressionController } from './controllers/progression.controller';
import { ItemCostCalculatorService } from './services/item-cost-calculator.service';
import { LeaderboardSyncService } from './services/leaderboard-sync.service';
import { ProgressionService } from './services/progression.service';

@Module({
  controllers: [ProgressionController],
  exports: [ProgressionService, ItemCostCalculatorService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),
  ],
  providers: [
    ProgressionService,
    ItemCostCalculatorService,
    LeaderboardSyncService,
  ],
})
export class ProgressionModule {}
