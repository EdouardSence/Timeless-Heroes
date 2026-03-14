/**
 * Program Worker
 * BullMQ worker that processes program completion jobs
 */

import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { getRedisConfig } from '@repo/redis-client';
import { IProgramCompletionPayload, QueueName } from '@repo/shared-types';
import { Job, Worker } from 'bullmq';

import { LootCalculatorService } from './loot-calculator.service';
import { ProgramProcessorService } from './program-processor.service';

interface IProgramJobData {
  programId: string;
  programSlug: string;
  startedAt: string;
  userId: string;
}

@Injectable()
export class ProgramWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ProgramWorker.name);
  private worker!: Worker<IProgramJobData, IProgramCompletionPayload>;

  constructor(
    private readonly programProcessor: ProgramProcessorService,
    private readonly lootCalculator: LootCalculatorService,
  ) {}

  onModuleInit() {
    this.logger.log('Initializing Program Worker...');

    this.worker = new Worker<IProgramJobData, IProgramCompletionPayload>(
      QueueName.PROGRAM_COMPLETION,
      // eslint-disable-next-line @typescript-eslint/require-await
      async (job: Job<IProgramJobData>) => this.processProgram(job),
      {
        concurrency: 20, // Process 20 programs in parallel
        connection: getRedisConfig(),
        limiter: {
          duration: 1000, // Max 50 completions per second
          max: 50,
        },
      },
    );

    this.worker.on('completed', (job, result) => {
      this.logger.log(
        `Program completed: ${job.data.programSlug} for user ${job.data.userId}, ` +
          `earned ${result.earnedLoc} LoC, ${result.lootDropped.length} items`,
      );
    });

    this.worker.on('failed', (job, err) => {
      this.logger.error(
        `Program failed: ${job?.data.programSlug} for user ${job?.data.userId}: ${err.message}`,
      );
    });

    this.logger.log('Program Worker initialized');
  }

  async onModuleDestroy() {
    await this.worker.close();
    this.logger.log('Program Worker destroyed');
  }

  /**
   * Process a completed program
   */
  private processProgram(job: Job<IProgramJobData>): IProgramCompletionPayload {
    const { programId, programSlug, userId } = job.data;

    this.logger.debug(
      `Processing program completion: ${programSlug} for ${userId}`,
    );

    // 1. Get program type
    const programType = this.programProcessor.getProgramType(programSlug);

    if (!programType) {
      throw new Error(`Program type not found: ${programSlug}`);
    }

    // 2. Calculate rewards
    const baseReward = BigInt(programType.baseReward);
    const multiplier = BigInt(Math.floor(programType.rewardMultiplier * 100));
    const earnedLoc = ((baseReward * multiplier) / 100n).toString();
    const earnedExp = programType.experienceReward;

    // 3. Roll for loot
    const lootDropped = this.lootCalculator.rollLoot(programType.lootTable);

    // 4. Update user progression (via gRPC or direct DB in production)
    // FUTURE: Implement gRPC call to svc-user-progression
    // When ready: progressionClient.updateBalance(userId, earnedLoc)

    // 5. Mark program as completed
    this.programProcessor.markProgramCompleted(userId, programSlug);

    // 6. Create completion payload
    const completedAt = new Date();
    const completion: IProgramCompletionPayload = {
      completedAt,
      earnedExp,
      earnedLoc,
      lootDropped,
      programId,
      programSlug,
      userId,
    };

    // 7. Notify user (via Redis Pub/Sub in production)
    // This would be picked up by the API Gateway and sent to the user via WebSocket
    // await redis.publish('channel:program-complete', JSON.stringify(completion));

    this.logger.log(
      `Program ${programSlug} completed for ${userId}: +${earnedLoc} LoC, +${earnedExp} XP, ${lootDropped.length} items`,
    );

    return completion;
  }
}
