/**
 * Offline Calculator Module
 * Handles AFK/offline progression calculation
 */

import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { NATS_SERVICE, QueueName } from '@repo/shared-types';
import { OfflineCalculatorService } from './offline-calculator.service';
import { OfflineWorker } from './offline.worker';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueName.OFFLINE_CALCULATION,
    }),
    ClientsModule.registerAsync([
      {
        name: NATS_SERVICE.PROGRESSION,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [configService.get<string>('NATS_URL', 'nats://localhost:4222')],
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [OfflineCalculatorService, OfflineWorker],
  exports: [OfflineCalculatorService],
})
export class OfflineCalculatorModule {}
