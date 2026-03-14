/**
 * Worker Health Controller
 * NATS handler for health checks — queryable by the api-gateway HealthModule.
 * No HTTP endpoint: the worker is a pure microservice (no HTTP server).
 */

import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { NatsPattern } from '@repo/shared-types';

@Controller()
export class WorkerHealthController {
  @MessagePattern(NatsPattern.HEALTH_CHECK)
  handleHealthCheck() {
    return { status: 'ok', service: 'worker-game-loop' };
  }
}
