/**
 * Worker Health Controller
 * NATS handler for health checks (no HTTP)
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
