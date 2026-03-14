/**
 * Health Controller
 * HTTP-only endpoint for container health checks (Docker, k8s)
 */

import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      service: 'svc-payment',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
