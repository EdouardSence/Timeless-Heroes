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
  controllers: [ProgressionController],
  exports: [ProgressionService, ItemCostCalculatorService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),

    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST ?? 'localhost',
        password: process.env.REDIS_PASSWORD ?? undefined,
        port: Number.parseInt(process.env.REDIS_PORT ?? '6379', 10),
      },
    }),

    BullModule.registerQueue({
      name: QueueName.LEADERBOARD_UPDATE,
    }),
  ],
  providers: [
    ProgressionService,
    ItemCostCalculatorService,
    LeaderboardSyncService,
  ],
})
export class ProgressionModule {}
