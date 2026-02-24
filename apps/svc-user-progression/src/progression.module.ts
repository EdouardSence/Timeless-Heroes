/**
 * Progression Module
 * Main module for user progression service
 */

import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { QueueName } from '@repo/shared-types';
import { ProgressionController } from './controllers/progression.controller';
import { ItemCostCalculatorService } from './services/item-cost-calculator.service';
import { LeaderboardSyncService } from './services/leaderboard-sync.service';
import { ProgressionService } from './services/progression.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env.local', '../../.env', '.env.local', '.env'],
    }),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
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
export class ProgressionModule { }
