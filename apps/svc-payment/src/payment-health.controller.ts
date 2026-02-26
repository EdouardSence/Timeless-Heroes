/**
 * Payment Health Controller
 * NATS health check + HTTP health endpoint
 */

import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { NatsPattern } from '@repo/shared-types';

@Controller()
export class PaymentHealthController {
  @Get('health')
  healthHttp() {
    return { status: 'ok', service: 'svc-payment', timestamp: new Date().toISOString() };
  }

  @MessagePattern(NatsPattern.HEALTH_CHECK)
  handleHealthCheck() {
    return { status: 'ok', service: 'svc-payment' };
  }
}
