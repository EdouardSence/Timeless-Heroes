/**
 * Click Processor Module
 * Handles click events, throttling, and Redis buffering
 */

import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { QueueName } from '@repo/shared-types';
import { ClickBufferProcessor } from './click-buffer.processor';
import { ClickProcessorService } from './click-processor.service';
import { ClickValidatorService } from './click-validator.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueName.CLICK_BUFFER,
    }),
  ],
  providers: [
    ClickProcessorService,
    ClickValidatorService,
    ClickBufferProcessor,
  ],
  exports: [ClickProcessorService, ClickValidatorService],
})
export class ClickProcessorModule {}
