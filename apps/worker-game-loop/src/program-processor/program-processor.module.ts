/* istanbul ignore file */
/**
 * Program Processor Module
 * Handles delayed jobs for programs (expeditions)
 */

import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { NATS_SERVICE, QueueName } from '@repo/shared-types';
import { LootCalculatorService } from './loot-calculator.service';
import { ProgramProcessorService } from './program-processor.service';
import { ProgramWorker } from './program.worker';

@Module({
  exports: [ProgramProcessorService],
  imports: [
    ConfigModule,
    BullModule.registerQueue({
      name: QueueName.PROGRAM_COMPLETION,
    }),
    ClientsModule.registerAsync([
      {
        name: NATS_SERVICE.PROGRESSION,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [
              configService.get<string>('NATS_URL', 'nats://localhost:4222'),
            ],
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [ProgramProcessorService, ProgramWorker, LootCalculatorService],
})
export class ProgramProcessorModule {}
