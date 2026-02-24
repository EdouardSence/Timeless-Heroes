/**
 * Click Processor Module
 * Handles click events, throttling, and Redis buffering
 * 
 * Note: Buffer flushing (Redis → PostgreSQL) is handled by worker-game-loop.
 * This module only handles receiving, validating, and buffering clicks.
 */

import { Module } from '@nestjs/common';

import { ClickProcessorService } from './click-processor.service';
import { ClickValidatorService } from './click-validator.service';

@Module({
  providers: [
    ClickProcessorService,
    ClickValidatorService,
  ],
  exports: [ClickProcessorService, ClickValidatorService],
})
export class ClickProcessorModule {}
