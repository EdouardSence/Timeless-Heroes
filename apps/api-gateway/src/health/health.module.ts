/* istanbul ignore file */
/**
 * Health Module
 * Aggregated health checks via NATS for all downstream services
 */

import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';

import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
  imports: [AuthModule],
})
export class HealthModule {}
