/**
 * Program Processor Service
 * Manages program (expedition) lifecycle with BullMQ delayed jobs
 *
 * Flow:
 * 1. Player starts a program (e.g., "compile_kernel")
 * 2. A delayed BullMQ job is created with duration N minutes
 * 3. When job executes, calculate rewards (LoC, EXP, loot)
 * 4. Update user inventory via gRPC/direct DB call
 * 5. Notify player via WebSocket
 */

import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import {
  IProgramRewards,
  IStartProgramRequest,
  IStartProgramResult,
  ProgramError,
  QueueName,
} from '@repo/shared-types';
import { prisma } from '@repo/prisma-client';
import { Queue } from 'bullmq';

interface IProgramType {
  baseDurationSecs: number;
  baseReward: string;
  category: string;
  description: string;
  experienceReward: string;
  lootTable: {
    itemSlug: string;
    dropRate: number;
    minQuantity: number;
    maxQuantity: number;
  }[];
  name: string;
  rewardMultiplier: number;
  slug: string;
  unlockLevel: number;
}

// Hardcoded program types for now (in production, from DB)
const PROGRAM_TYPES: IProgramType[] = [
  {
    baseDurationSecs: 60, // 1 minute
    baseReward: '100',
    category: 'BUG_FIX',
    description: 'Quick fix for a minor bug in the code.',
    experienceReward: '10',
    lootTable: [],
    name: 'Fix a Typo',
    rewardMultiplier: 1,
    slug: 'fix_typo',
    unlockLevel: 1,
  },
  {
    baseDurationSecs: 600, // 10 minutes
    baseReward: '5000',
    category: 'ARCHITECTURE',
    description: 'A lengthy compilation process that yields great rewards.',
    experienceReward: '500',
    lootTable: [
      { dropRate: 0.3, itemSlug: 'coffee-cup', maxQuantity: 3, minQuantity: 1 },
      {
        dropRate: 0.1,
        itemSlug: 'energy-drink',
        maxQuantity: 1,
        minQuantity: 1,
      },
    ],
    name: 'Compile the Kernel',
    rewardMultiplier: 1.5,
    slug: 'compile_kernel',
    unlockLevel: 5,
  },
  {
    baseDurationSecs: 1800, // 30 minutes
    baseReward: '25000',
    category: 'DEPLOYMENT',
    description: 'Deploy a fleet of microservices to production.',
    experienceReward: '2000',
    lootTable: [
      {
        dropRate: 0.05,
        itemSlug: 'golden-keyboard',
        maxQuantity: 1,
        minQuantity: 1,
      },
      {
        dropRate: 0.2,
        itemSlug: 'mechanical-keyboard',
        maxQuantity: 1,
        minQuantity: 1,
      },
      {
        dropRate: 0.15,
        itemSlug: 'monitor-upgrade',
        maxQuantity: 1,
        minQuantity: 1,
      },
    ],
    name: 'Deploy Microservices',
    rewardMultiplier: 2,
    slug: 'deploy_microservices',
    unlockLevel: 10,
  },
  {
    baseDurationSecs: 3600, // 1 hour
    baseReward: '100000',
    category: 'REFACTORING',
    description:
      'Brave the depths of legacy code to bring it to modern standards.',
    experienceReward: '5000',
    lootTable: [
      {
        dropRate: 0.1,
        itemSlug: 'ancient-floppy',
        maxQuantity: 1,
        minQuantity: 1,
      },
      {
        dropRate: 0.02,
        itemSlug: 'senior-dev-badge',
        maxQuantity: 1,
        minQuantity: 1,
      },
    ],
    name: 'Refactor Legacy Code',
    rewardMultiplier: 2.5,
    slug: 'refactor_legacy',
    unlockLevel: 20,
  },
  {
    baseDurationSecs: 7200, // 2 hours
    baseReward: '500000',
    category: 'RESEARCH',
    description: 'Explore cutting-edge AI technologies for integration.',
    experienceReward: '20000',
    lootTable: [
      {
        dropRate: 0.1,
        itemSlug: 'neural-network-chip',
        maxQuantity: 1,
        minQuantity: 1,
      },
      {
        dropRate: 0.01,
        itemSlug: 'quantum-processor',
        maxQuantity: 1,
        minQuantity: 1,
      },
    ],
    name: 'Research AI Integration',
    rewardMultiplier: 3,
    slug: 'research_ai',
    unlockLevel: 30,
  },
];

interface IProgramJobData {
  programId: string;
  programSlug: string;
  startedAt: string;
  userId: string;
}

@Injectable()
export class ProgramProcessorService {
  private readonly logger = new Logger(ProgramProcessorService.name);

  // Using Prisma ActiveProgram model instead of in-memory Map
  private readonly MAX_CONCURRENT_PROGRAMS = 3;

  constructor(
    @InjectQueue(QueueName.PROGRAM_COMPLETION)
    private readonly programQueue: Queue<IProgramJobData>,
  ) {}

  /**
   * Start a new program for a user
   */
  async startProgram(
    request: IStartProgramRequest,
  ): Promise<IStartProgramResult> {
    const { programSlug, userId } = request;

    // 1. Find the program type definition
    const programTypeDef = PROGRAM_TYPES.find((p) => p.slug === programSlug);

    if (!programTypeDef) {
      return {
        durationSeconds: 0,
        error: ProgramError.PROGRAM_NOT_FOUND,
        estimatedEndAt: new Date(),
        expectedRewards: { expReward: '0', locReward: '0', possibleLoot: [] },
        programSlug,
        startedAt: new Date(),
        success: false,
      };
    }

    // 2. Check user level from progression DB
    const progression = await prisma.progression.findUnique({
      where: { userId },
    });
    const userLevel = progression?.level ?? 1;
    
    if (userLevel < programTypeDef.unlockLevel) {
      return {
        durationSeconds: 0,
        error: ProgramError.PROGRAM_LOCKED,
        estimatedEndAt: new Date(),
        expectedRewards: { expReward: '0', locReward: '0', possibleLoot: [] },
        programSlug,
        startedAt: new Date(),
        success: false,
      };
    }

    // 3. Get active programs count from DB
    const activeCount = await prisma.activeProgram.count({
      where: { 
        userId, 
        status: 'RUNNING',
      },
    });
    
    if (activeCount >= this.MAX_CONCURRENT_PROGRAMS) {
      return {
        durationSeconds: 0,
        error: ProgramError.NO_AVAILABLE_SLOTS,
        estimatedEndAt: new Date(),
        expectedRewards: { expReward: '0', locReward: '0', possibleLoot: [] },
        programSlug,
        startedAt: new Date(),
        success: false,
      };
    }

    // 4. Check if already running this program (via programType slug)
    // First ensure programType exists in DB
    const programType = await prisma.programType.upsert({
      where: { slug: programSlug },
      create: {
        slug: programSlug,
        name: programTypeDef.name,
        description: programTypeDef.description,
        category: 'CODING',
        baseDurationSeconds: programTypeDef.baseDurationSecs,
        baseReward: programTypeDef.baseReward,
        experienceReward: programTypeDef.experienceReward,
        rewardMultiplier: programTypeDef.rewardMultiplier,
        unlockLevel: programTypeDef.unlockLevel,
        lootTable: programTypeDef.lootTable,
      },
      update: {},
    });
    
    const alreadyRunning = await prisma.activeProgram.findFirst({
      where: {
        userId,
        programTypeId: programType.id,
        status: 'RUNNING',
      },
    });
    
    if (alreadyRunning) {
      return {
        durationSeconds: 0,
        error: ProgramError.ALREADY_RUNNING,
        estimatedEndAt: new Date(),
        expectedRewards: { expReward: '0', locReward: '0', possibleLoot: [] },
        programSlug,
        startedAt: new Date(),
        success: false,
      };
    }

    // 5. Calculate timing
    const startedAt = new Date();
    const durationMs = programTypeDef.baseDurationSecs * 1000;
    const estimatedEndAt = new Date(startedAt.getTime() + durationMs);

    // 6. Generate program ID
    const programId = `prog-${userId}-${programSlug}-${Date.now()}`;

    // 7. Create delayed BullMQ job
    const jobData: IProgramJobData = {
      programId,
      programSlug,
      startedAt: startedAt.toISOString(),
      userId,
    };

    await this.programQueue.add(`program-${programId}`, jobData, {
      delay: durationMs,
      jobId: programId, // For cancellation
      removeOnComplete: true,
      removeOnFail: false, // Keep for debugging
    });

    // 8. Track active program in DB
    await prisma.activeProgram.create({
      data: {
        userId,
        programTypeId: programType.id,
        startedAt,
        estimatedEndAt,
        status: 'RUNNING',
        bullJobId: programId,
      },
    });

    this.logger.log(
      `Program started: ${programSlug} for user ${userId}, completes in ${programTypeDef.baseDurationSecs}s`,
    );

    // 9. Calculate expected rewards
    const expectedRewards: IProgramRewards = {
      expReward: programTypeDef.experienceReward,
      locReward: (
        (BigInt(programTypeDef.baseReward) *
          BigInt(Math.floor(programTypeDef.rewardMultiplier * 100))) /
        100n
      ).toString(),
      possibleLoot: programTypeDef.lootTable.map((item) => ({
        dropChance: item.dropRate,
        itemName: item.itemSlug
          .replaceAll('-', ' ')
          .replaceAll(/\b\w/g, (c) => c.toUpperCase()),
        itemSlug: item.itemSlug,
        quantity: { max: item.maxQuantity, min: item.minQuantity },
      })),
    };

    return {
      durationSeconds: programTypeDef.baseDurationSecs,
      estimatedEndAt,
      expectedRewards,
      programId,
      programSlug,
      startedAt,
      success: true,
    };
  }

  /**
   * Cancel a running program
   */
  async cancelProgram(userId: string, programSlug: string): Promise<boolean> {
    // Find the active program in DB
    const activeProgram = await prisma.activeProgram.findFirst({
      where: {
        userId,
        programType: { slug: programSlug },
        status: 'RUNNING',
      },
    });

    if (!activeProgram) {
      return false;
    }

    // Remove the BullMQ job if it exists
    if (activeProgram.bullJobId) {
      try {
        const job = await this.programQueue.getJob(activeProgram.bullJobId);
        if (job) {
          await job.remove();
        }
      } catch (err) {
        this.logger.warn(`Failed to remove job ${activeProgram.bullJobId}: ${err}`);
      }
    }

    // Update status in DB
    await prisma.activeProgram.update({
      where: { id: activeProgram.id },
      data: { 
        status: 'CANCELLED',
        completedAt: new Date(),
      },
    });

    this.logger.log(`Program cancelled: ${programSlug} for user ${userId}`);

    return true;
  }

  /**
   * Get active programs for a user
   */
  async getActivePrograms(userId: string): Promise<string[]> {
    const activePrograms = await prisma.activeProgram.findMany({
      where: {
        userId,
        status: 'RUNNING',
      },
      include: { programType: true },
    });
    
    return activePrograms.map((ap) => ap.programType.slug);
  }

  /**
   * Remove program from tracking (called after completion)
   */
  async markProgramCompleted(userId: string, programSlug: string): Promise<void> {
    await prisma.activeProgram.updateMany({
      where: {
        userId,
        programType: { slug: programSlug },
        status: 'RUNNING',
      },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });
  }

  /**
   * Get all available program types
   */
  getProgramTypes(): IProgramType[] {
    return PROGRAM_TYPES;
  }

  /**
   * Get program type by slug
   */
  getProgramType(slug: string): IProgramType | undefined {
    return PROGRAM_TYPES.find((p) => p.slug === slug);
  }
}
