/* istanbul ignore file */
/**
 * Worker Game Loop - Main Entry Point
 * Pure NATS microservice + BullMQ workers
 *
 * The worker is NOT exposed via HTTP. It:
 *   - Listens to NATS message patterns (health.check)
 *   - Processes BullMQ jobs (click-buffer, offline-calc, program-completion)
 * All health checking is done through the NATS health.check pattern, queryable
 * from the api-gateway HealthModule.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * SCALABILITY: Multi-Replica Configuration
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * This service is designed for horizontal scaling. Multiple replicas can run
 * safely in parallel thanks to:
 *
 * 1. NATS Queue Groups: The `queue: 'worker-game-loop'` option ensures that
 *    NATS messages are load-balanced across replicas (only one receives each).
 *
 * 2. BullMQ Distributed Locking: Each BullMQ job is processed by exactly one
 *    worker replica. Redis-based locks guarantee no duplicate processing.
 *
 * 3. Distributed Cron Lock: The periodic click-buffer flush (@Cron every 5s)
 *    uses a Redis SET NX lock so only one replica flushes per cycle.
 *
 * Environment variable WORKER_ROLE controls which features each replica runs:
 *   - 'all'     (default) — runs cron scheduler + all BullMQ workers
 *   - 'cron'    — runs only the cron scheduler (flush service)
 *   - 'workers' — runs only BullMQ workers (no cron)
 *
 * Example multi-replica deployment:
 *   Replica 1: WORKER_ROLE=all     (cron + workers, general purpose)
 *   Replica 2: WORKER_ROLE=workers (workers only, extra processing capacity)
 *   Replica 3: WORKER_ROLE=workers (workers only, extra processing capacity)
 *
 * Even with WORKER_ROLE=all on every replica, the distributed lock ensures
 * the cron only executes on one replica per cycle.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { WorkerModule } from './worker.module';

/** Supported worker roles for multi-replica deployments */
type WorkerRole = 'all' | 'cron' | 'workers';

async function bootstrap() {
  const logger = new Logger('WorkerGameLoop');
  const natsUrl = process.env.NATS_URL || 'nats://localhost:4222';
  const workerRole = (process.env.WORKER_ROLE || 'all') as WorkerRole;

  // Pure NATS microservice — no HTTP port exposed
  // BullMQ @Processor workers auto-start via NestJS module initialization
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    WorkerModule,
    {
      transport: Transport.NATS,
      options: {
        servers: [natsUrl],
        queue: 'worker-game-loop', // Load-balanced NATS queue group
      },
    },
  );

  await app.listen();

  logger.log(`Worker Game Loop started (NATS: ${natsUrl})`);
  logger.log(`Worker role: ${workerRole}`);
  logger.log('BullMQ processors active: click-buffer, programs, offline');
  logger.log('Cron flush uses distributed Redis lock (multi-replica safe)');
  logger.log('No HTTP port — health check via NATS health.check pattern');
}

void bootstrap();
