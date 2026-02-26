/**
 * Health Module
 * Aggregated health checks via NATS for all downstream services
 */

import { Module } from '@nestjs/common';

import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
