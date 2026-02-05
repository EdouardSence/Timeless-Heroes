/**
 * Offline Calculator Module
 * Handles AFK/offline progression calculation
 */

import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { QueueName } from '@repo/shared-types';
import { OfflineCalculatorService } from './offline-calculator.service';
import { OfflineWorker } from './offline.worker';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueName.OFFLINE_CALCULATION,
    }),
  ],
  providers: [OfflineCalculatorService, OfflineWorker],
  exports: [OfflineCalculatorService],
})
export class OfflineCalculatorModule {}
