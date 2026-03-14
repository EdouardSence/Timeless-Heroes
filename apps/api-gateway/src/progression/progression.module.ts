/* istanbul ignore file */
/**
 * Progression Module
 * HTTP REST endpoints for user progression data
 */

import { Module } from '@nestjs/common';

import { ProgressionController } from './progression.controller';

@Module({
  controllers: [ProgressionController],
})
export class ProgressionModule {}
