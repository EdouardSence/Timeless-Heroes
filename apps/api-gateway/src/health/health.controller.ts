/**
 * Gateway Health Controller
 * Aggregated health check — pings all downstream services via NATS
 */

import { Controller, Get, Inject, Logger, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { NATS_SERVICE, NatsPattern, Role } from '@repo/shared-types';
import { catchError, firstValueFrom, of, timeout } from 'rxjs';

import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

interface IServiceHealth {
  service: string;
  status: 'ok' | 'down';
}

@ApiTags('Health')
@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    @Inject(NATS_SERVICE.PROGRESSION)
    private readonly progressionClient: ClientProxy,
    @Inject(NATS_SERVICE.PAYMENT) private readonly paymentClient: ClientProxy,
    @Inject(NATS_SERVICE.WORKER) private readonly workerClient: ClientProxy,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Aggregated health check for all microservices (Admin only)',
  })
  @ApiOkResponse({
    description:
      'Status of gateway + downstream services (progression, payment, worker)',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT' })
  @ApiForbiddenResponse({ description: 'Requires ADMIN role' })
  async check() {
    const [payment, progression, worker] = await Promise.all([
      this.ping(this.paymentClient, 'svc-payment'),
      this.ping(this.progressionClient, 'svc-user-progression'),
      this.ping(this.workerClient, 'worker-game-loop'),
    ]);

    const allHealthy =
      progression.status === 'ok' &&
      payment.status === 'ok' &&
      worker.status === 'ok';

    return {
      gateway: 'ok',
      services: { payment, progression, worker },
      status: allHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
    };
  }

  private async ping(
    client: ClientProxy,
    name: string,
  ): Promise<IServiceHealth> {
    try {
      const result = await firstValueFrom(
        client.send<IServiceHealth>(NatsPattern.HEALTH_CHECK, {}).pipe(
          timeout(3000),
          catchError(() => of({ service: name, status: 'down' as const })),
        ),
      );
      return result;
    } catch {
      this.logger.warn(`Health check failed for ${name}`);
      return { service: name, status: 'down' };
    }
  }
}
