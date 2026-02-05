/**
 * Program Processor Module
 * Handles delayed jobs for programs (expeditions)
 */

import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { QueueName } from '@repo/shared-types';
import { LootCalculatorService } from './loot-calculator.service';
import { ProgramProcessorService } from './program-processor.service';
import { ProgramWorker } from './program.worker';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueName.PROGRAM_COMPLETION,
    }),
  ],
  providers: [
    ProgramProcessorService,
    ProgramWorker,
    LootCalculatorService,
  ],
  exports: [ProgramProcessorService],
})
export class ProgramProcessorModule {}
