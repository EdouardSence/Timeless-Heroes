/**
 * Provision Order Processor
 * BullMQ worker that fulfills payment orders
 */

import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { getRedisConfig } from '@repo/redis-client';
import {
  IProvisionOrderJob,
  IProvisionResult,
  ProvisionError,
  QueueName,
} from '@repo/shared-types';
import { Job, Worker } from 'bullmq';

import {
  IdempotencyService,
  IdempotencyStatus,
} from '../idempotency/idempotency.service';

import { ProvisionService } from './provision.service';

@Injectable()
export class ProvisionOrderProcessor implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ProvisionOrderProcessor.name);
  private worker!: Worker<IProvisionOrderJob, IProvisionResult>;

  constructor(
    private readonly provisionService: ProvisionService,
    private readonly idempotencyService: IdempotencyService,
  ) {}

  onModuleInit() {
    this.logger.log('Initializing Provision Order Processor...');

    this.worker = new Worker<IProvisionOrderJob, IProvisionResult>(
      QueueName.PROVISION_ORDER,
      async (job: Job<IProvisionOrderJob>) => this.processProvision(job),
      {
        concurrency: 5, // Process 5 orders in parallel (careful with DB load)
        connection: getRedisConfig(),
        limiter: {
          duration: 1000, // Max 20 provisions per second
          max: 20,
        },
      },
    );

    this.worker.on('completed', (job, result) => {
      if (result.success) {
        this.logger.log(`Order provisioned: ${job.data.transactionId}`);
      } else {
        this.logger.warn(`Order provision returned: ${result.error}`);
      }
    });

    this.worker.on('failed', (job, err) => {
      this.logger.error(
        `Order provision failed: ${job?.data.transactionId}: ${err.message}`,
      );
    });

    this.logger.log('Provision Order Processor initialized');
  }

  async onModuleDestroy() {
    await this.worker.close();
  }

  /**
   * Process a provision order job
   */
  private async processProvision(
    job: Job<IProvisionOrderJob>,
  ): Promise<IProvisionResult> {
    const {
      attemptNumber,
      idempotencyKey,
      productData,
      productType,
      transactionId,
      userId,
    } = job.data;

    this.logger.log(
      `Processing provision: ${transactionId} (attempt ${attemptNumber})`,
    );

    // 1. Idempotency check - CRITICAL
    const idempotencyCheck = await this.idempotencyService.checkAndLock(
      idempotencyKey,
      transactionId,
    );

    if (!idempotencyCheck.canProcess) {
      this.logger.warn(
        `Skipping provision for ${transactionId}: ${idempotencyCheck.reason}`,
      );

      // If already completed, return success without re-processing
      if (
        idempotencyCheck.existingRecord?.status === IdempotencyStatus.COMPLETED
      ) {
        return {
          provisioned: false, // Not provisioned this time
          success: true,
          transactionId,
        };
      }

      return {
        error: ProvisionError.ALREADY_PROVISIONED,
        provisioned: false,
        success: false,
        transactionId,
      };
    }

    try {
      // 2. Provision the order
      const result = this.provisionService.provisionOrder(
        userId,
        productType,
        productData,
      );

      if (result.success) {
        // 3. Mark as completed in idempotency store
        await this.idempotencyService.markCompleted(
          idempotencyKey,
          transactionId,
        );

        this.logger.log(`Successfully provisioned order: ${transactionId}`);

        return {
          provisioned: true,
          success: true,
          transactionId,
        };
      } else {
        // Provisioning returned an error
        await this.idempotencyService.markFailed(
          idempotencyKey,
          transactionId,
          result.error ?? 'Unknown error',
        );

        return {
          error: result.error as ProvisionError,
          provisioned: false,
          success: false,
          transactionId,
        };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      // Mark as failed for retry
      await this.idempotencyService.markFailed(
        idempotencyKey,
        transactionId,
        errorMessage,
      );

      // Release the lock for retry
      await this.idempotencyService.releaseLock(idempotencyKey);

      this.logger.error(
        `Provision failed for ${transactionId}: ${errorMessage}`,
      );

      // Throw to trigger BullMQ retry
      throw error;
    }
  }
}
