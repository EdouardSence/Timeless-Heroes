/* istanbul ignore file */
/**
 * Progression Module
 * HTTP REST endpoints for user progression data
 */

import { Module } from '@nestjs/common';

import { ClickProcessorModule } from '../click-processor/click-processor.module';
import { ProgressionController } from './progression.controller';

@Module({
  imports: [ClickProcessorModule],
  controllers: [ProgressionController],
})
export class ProgressionModule {}
