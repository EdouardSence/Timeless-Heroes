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
import { Queue } from 'bullmq';

import {
    IProgramRewards,
    IStartProgramRequest,
    IStartProgramResult,
    ProgramError,
    QueueName
} from '@repo/shared-types';

interface IProgramType {
  slug: string;
  name: string;
  description: string;
  baseDurationSecs: number;
  baseReward: string;
  experienceReward: string;
  rewardMultiplier: number;
  unlockLevel: number;
  lootTable: Array<{
    itemSlug: string;
    dropRate: number;
    minQuantity: number;
    maxQuantity: number;
  }>;
  category: string;
}

// Hardcoded program types for now (in production, from DB)
const PROGRAM_TYPES: IProgramType[] = [
  {
    slug: 'fix_typo',
    name: 'Fix a Typo',
    description: 'Quick fix for a minor bug in the code.',
    baseDurationSecs: 60, // 1 minute
    baseReward: '100',
    experienceReward: '10',
    rewardMultiplier: 1.0,
    unlockLevel: 1,
    lootTable: [],
    category: 'BUG_FIX',
  },
  {
    slug: 'compile_kernel',
    name: 'Compile the Kernel',
    description: 'A lengthy compilation process that yields great rewards.',
    baseDurationSecs: 600, // 10 minutes
    baseReward: '5000',
    experienceReward: '500',
    rewardMultiplier: 1.5,
    unlockLevel: 5,
    lootTable: [
      { itemSlug: 'coffee-cup', dropRate: 0.3, minQuantity: 1, maxQuantity: 3 },
      { itemSlug: 'energy-drink', dropRate: 0.1, minQuantity: 1, maxQuantity: 1 },
    ],
    category: 'ARCHITECTURE',
  },
  {
    slug: 'deploy_microservices',
    name: 'Deploy Microservices',
    description: 'Deploy a fleet of microservices to production.',
    baseDurationSecs: 1800, // 30 minutes
    baseReward: '25000',
    experienceReward: '2000',
    rewardMultiplier: 2.0,
    unlockLevel: 10,
    lootTable: [
      { itemSlug: 'golden-keyboard', dropRate: 0.05, minQuantity: 1, maxQuantity: 1 },
      { itemSlug: 'mechanical-keyboard', dropRate: 0.2, minQuantity: 1, maxQuantity: 1 },
      { itemSlug: 'monitor-upgrade', dropRate: 0.15, minQuantity: 1, maxQuantity: 1 },
    ],
    category: 'DEPLOYMENT',
  },
  {
    slug: 'refactor_legacy',
    name: 'Refactor Legacy Code',
    description: 'Brave the depths of legacy code to bring it to modern standards.',
    baseDurationSecs: 3600, // 1 hour
    baseReward: '100000',
    experienceReward: '5000',
    rewardMultiplier: 2.5,
    unlockLevel: 20,
    lootTable: [
      { itemSlug: 'ancient-floppy', dropRate: 0.1, minQuantity: 1, maxQuantity: 1 },
      { itemSlug: 'senior-dev-badge', dropRate: 0.02, minQuantity: 1, maxQuantity: 1 },
    ],
    category: 'REFACTORING',
  },
  {
    slug: 'research_ai',
    name: 'Research AI Integration',
    description: 'Explore cutting-edge AI technologies for integration.',
    baseDurationSecs: 7200, // 2 hours
    baseReward: '500000',
    experienceReward: '20000',
    rewardMultiplier: 3.0,
    unlockLevel: 30,
    lootTable: [
      { itemSlug: 'neural-network-chip', dropRate: 0.1, minQuantity: 1, maxQuantity: 1 },
      { itemSlug: 'quantum-processor', dropRate: 0.01, minQuantity: 1, maxQuantity: 1 },
    ],
    category: 'RESEARCH',
  },
];

interface IProgramJobData {
  programId: string;
  userId: string;
  programSlug: string;
  startedAt: string;
}

@Injectable()
export class ProgramProcessorService {
  private readonly logger = new Logger(ProgramProcessorService.name);
  
  // Track active programs per user (in production, use Redis)
  private activePrograms: Map<string, Set<string>> = new Map();
  private readonly MAX_CONCURRENT_PROGRAMS = 3;
  
  constructor(
    @InjectQueue(QueueName.PROGRAM_COMPLETION)
    private readonly programQueue: Queue<IProgramJobData>,
  ) {}
  
  /**
   * Start a new program for a user
   */
  async startProgram(request: IStartProgramRequest): Promise<IStartProgramResult> {
    const { userId, programSlug } = request;
    
    // 1. Find the program type
    const programType = PROGRAM_TYPES.find((p) => p.slug === programSlug);
    
    if (!programType) {
      return {
        success: false,
        programSlug,
        startedAt: new Date(),
        estimatedEndAt: new Date(),
        durationSeconds: 0,
        expectedRewards: { locReward: '0', expReward: '0', possibleLoot: [] },
        error: ProgramError.PROGRAM_NOT_FOUND,
      };
    }
    
    // 2. Check user level (mock for now)
    const userLevel = 1; // TODO: Get from progression service
    if (userLevel < programType.unlockLevel) {
      return {
        success: false,
        programSlug,
        startedAt: new Date(),
        estimatedEndAt: new Date(),
        durationSeconds: 0,
        expectedRewards: { locReward: '0', expReward: '0', possibleLoot: [] },
        error: ProgramError.PROGRAM_LOCKED,
      };
    }
    
    // 3. Check concurrent program limit
    const userActivePrograms = this.activePrograms.get(userId) || new Set();
    if (userActivePrograms.size >= this.MAX_CONCURRENT_PROGRAMS) {
      return {
        success: false,
        programSlug,
        startedAt: new Date(),
        estimatedEndAt: new Date(),
        durationSeconds: 0,
        expectedRewards: { locReward: '0', expReward: '0', possibleLoot: [] },
        error: ProgramError.NO_AVAILABLE_SLOTS,
      };
    }
    
    // 4. Check if already running this program
    if (userActivePrograms.has(programSlug)) {
      return {
        success: false,
        programSlug,
        startedAt: new Date(),
        estimatedEndAt: new Date(),
        durationSeconds: 0,
        expectedRewards: { locReward: '0', expReward: '0', possibleLoot: [] },
        error: ProgramError.ALREADY_RUNNING,
      };
    }
    
    // 5. Calculate timing
    const startedAt = new Date();
    const durationMs = programType.baseDurationSecs * 1000;
    const estimatedEndAt = new Date(startedAt.getTime() + durationMs);
    
    // 6. Generate program ID
    const programId = `prog-${userId}-${programSlug}-${Date.now()}`;
    
    // 7. Create delayed BullMQ job
    const jobData: IProgramJobData = {
      programId,
      userId,
      programSlug,
      startedAt: startedAt.toISOString(),
    };
    
    const job = await this.programQueue.add(
      `program-${programId}`,
      jobData,
      {
        delay: durationMs,
        jobId: programId, // For cancellation
        removeOnComplete: true,
        removeOnFail: false, // Keep for debugging
      },
    );
    
    // 8. Track active program
    userActivePrograms.add(programSlug);
    this.activePrograms.set(userId, userActivePrograms);
    
    this.logger.log(
      `Program started: ${programSlug} for user ${userId}, completes in ${programType.baseDurationSecs}s`,
    );
    
    // 9. Calculate expected rewards
    const expectedRewards: IProgramRewards = {
      locReward: (BigInt(programType.baseReward) * BigInt(Math.floor(programType.rewardMultiplier * 100)) / 100n).toString(),
      expReward: programType.experienceReward,
      possibleLoot: programType.lootTable.map((item) => ({
        itemSlug: item.itemSlug,
        itemName: item.itemSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        dropChance: item.dropRate,
        quantity: { min: item.minQuantity, max: item.maxQuantity },
      })),
    };
    
    return {
      success: true,
      programId,
      programSlug,
      startedAt,
      estimatedEndAt,
      durationSeconds: programType.baseDurationSecs,
      expectedRewards,
    };
  }
  
  /**
   * Cancel a running program
   */
  async cancelProgram(userId: string, programSlug: string): Promise<boolean> {
    const userActivePrograms = this.activePrograms.get(userId);
    
    if (!userActivePrograms || !userActivePrograms.has(programSlug)) {
      return false;
    }
    
    // Find and remove the job
    const jobs = await this.programQueue.getJobs(['delayed']);
    for (const job of jobs) {
      if (job.data.userId === userId && job.data.programSlug === programSlug) {
        await job.remove();
        break;
      }
    }
    
    // Remove from tracking
    userActivePrograms.delete(programSlug);
    
    this.logger.log(`Program cancelled: ${programSlug} for user ${userId}`);
    
    return true;
  }
  
  /**
   * Get active programs for a user
   */
  async getActivePrograms(userId: string): Promise<string[]> {
    const userActivePrograms = this.activePrograms.get(userId);
    return userActivePrograms ? Array.from(userActivePrograms) : [];
  }
  
  /**
   * Remove program from tracking (called after completion)
   */
  markProgramCompleted(userId: string, programSlug: string): void {
    const userActivePrograms = this.activePrograms.get(userId);
    if (userActivePrograms) {
      userActivePrograms.delete(programSlug);
    }
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
