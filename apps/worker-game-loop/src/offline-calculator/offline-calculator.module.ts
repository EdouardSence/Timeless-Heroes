/* istanbul ignore file */
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
  exports: [OfflineCalculatorService],
  imports: [
    ConfigModule,
    BullModule.registerQueue({
      name: QueueName.OFFLINE_CALCULATION,
    }),
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        name: NATS_SERVICE.PROGRESSION,
        useFactory: (configService: ConfigService) => ({
          options: {
            servers: [
              configService.get<string>('NATS_URL', 'nats://localhost:4222'),
            ],
          },
          transport: Transport.NATS,
        }),
      },
    ]),
  ],
  providers: [OfflineCalculatorService, OfflineWorker],
})
export class OfflineCalculatorModule {}
