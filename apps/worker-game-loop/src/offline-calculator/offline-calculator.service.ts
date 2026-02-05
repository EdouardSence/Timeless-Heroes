/**
 * Offline Calculator Service
 * Calculates and processes offline/AFK progression
 * 
 * When a player reconnects:
 * 1. Calculate time delta since last activity
 * 2. Apply offline production rate (usually reduced from active rate)
 * 3. Check for completed programs during offline period
 * 4. Credit offline earnings
 */

import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

import { IOfflineCalculation, QueueName } from '@repo/shared-types';

interface IOfflineJobData {
  userId: string;
  disconnectedAt: string; // ISO string
  reconnectedAt: string;
  passiveMultiplier: number;
  pendingPrograms: Array<{
    programId: string;
    programSlug: string;
    estimatedEndAt: string;
  }>;
}

interface IUserOfflineStats {
  passiveMultiplier: number;
  offlineEfficiency: number; // 0.0 to 1.0
  maxOfflineHours: number;
}

@Injectable()
export class OfflineCalculatorService {
  private readonly logger = new Logger(OfflineCalculatorService.name);
  
  // Default offline configuration
  private readonly DEFAULT_OFFLINE_EFFICIENCY = 0.5; // 50% of passive rate
  private readonly DEFAULT_MAX_OFFLINE_HOURS = 8; // 8 hours max
  private readonly BASE_MAX_OFFLINE_HOURS = 8;
  private readonly PREMIUM_MAX_OFFLINE_HOURS = 24;
  
  constructor(
    @InjectQueue(QueueName.OFFLINE_CALCULATION)
    private readonly offlineQueue: Queue<IOfflineJobData>,
  ) {}
  
  /**
   * Queue offline calculation for processing
   */
  async queueOfflineCalculation(
    userId: string,
    disconnectedAt: Date,
    passiveMultiplier: number,
    pendingPrograms: Array<{
      programId: string;
      programSlug: string;
      estimatedEndAt: Date;
    }>,
  ): Promise<void> {
    const jobData: IOfflineJobData = {
      userId,
      disconnectedAt: disconnectedAt.toISOString(),
      reconnectedAt: new Date().toISOString(),
      passiveMultiplier,
      pendingPrograms: pendingPrograms.map((p) => ({
        programId: p.programId,
        programSlug: p.programSlug,
        estimatedEndAt: p.estimatedEndAt.toISOString(),
      })),
    };
    
    await this.offlineQueue.add(`offline-${userId}`, jobData, {
      priority: 1, // High priority for player experience
    });
    
    this.logger.debug(`Queued offline calculation for user ${userId}`);
  }
  
  /**
   * Calculate offline progression
   */
  calculateOfflineProgression(
    disconnectedAt: Date,
    reconnectedAt: Date,
    stats: IUserOfflineStats,
  ): IOfflineCalculation {
    const userId = ''; // Will be filled by caller
    
    // Calculate raw duration
    const offlineDurationMs = reconnectedAt.getTime() - disconnectedAt.getTime();
    const offlineDuration = Math.floor(offlineDurationMs / 1000); // seconds
    
    // Apply max offline cap
    const maxOfflineSeconds = stats.maxOfflineHours * 60 * 60;
    const effectiveDuration = Math.min(offlineDuration, maxOfflineSeconds);
    
    // Calculate offline production rate
    const offlineRate = stats.passiveMultiplier * stats.offlineEfficiency;
    
    // Calculate earnings
    const earnedLoc = Math.floor(offlineRate * effectiveDuration);
    
    // Calculate experience (10% of LoC)
    const earnedExp = Math.floor(earnedLoc * 0.1);
    
    return {
      userId,
      disconnectedAt,
      reconnectedAt,
      offlineDuration,
      maxOfflineTime: maxOfflineSeconds,
      effectiveDuration,
      offlineRate,
      earnedLoc: earnedLoc.toString(),
      earnedExp: earnedExp.toString(),
      completedPrograms: [], // Will be calculated separately
    };
  }
  
  /**
   * Check which programs completed during offline period
   */
  checkCompletedPrograms(
    disconnectedAt: Date,
    reconnectedAt: Date,
    pendingPrograms: Array<{
      programId: string;
      programSlug: string;
      estimatedEndAt: Date;
    }>,
  ): string[] {
    const completedIds: string[] = [];
    
    for (const program of pendingPrograms) {
      // If estimated end is between disconnect and reconnect, it completed offline
      if (
        program.estimatedEndAt >= disconnectedAt &&
        program.estimatedEndAt <= reconnectedAt
      ) {
        completedIds.push(program.programId);
      }
    }
    
    return completedIds;
  }
  
  /**
   * Get user's offline stats (would come from DB/cache in production)
   */
  async getUserOfflineStats(userId: string): Promise<IUserOfflineStats> {
    // TODO: Fetch from user's upgrades/subscription
    return {
      passiveMultiplier: 1.0, // Default, would be calculated from items
      offlineEfficiency: this.DEFAULT_OFFLINE_EFFICIENCY,
      maxOfflineHours: this.DEFAULT_MAX_OFFLINE_HOURS,
    };
  }
  
  /**
   * Calculate offline bonus from upgrades
   */
  calculateOfflineBonus(ownedUpgrades: string[]): {
    efficiencyBonus: number;
    maxTimeBonus: number;
  } {
    let efficiencyBonus = 0;
    let maxTimeBonus = 0;
    
    // Check for offline-related upgrades
    if (ownedUpgrades.includes('offline-efficiency-1')) efficiencyBonus += 0.1;
    if (ownedUpgrades.includes('offline-efficiency-2')) efficiencyBonus += 0.15;
    if (ownedUpgrades.includes('offline-efficiency-3')) efficiencyBonus += 0.25;
    
    if (ownedUpgrades.includes('offline-time-1')) maxTimeBonus += 4; // +4 hours
    if (ownedUpgrades.includes('offline-time-2')) maxTimeBonus += 8; // +8 hours
    
    return { efficiencyBonus, maxTimeBonus };
  }
  
  /**
   * Format offline duration for display
   */
  formatDuration(seconds: number): string {
    if (seconds < 60) {
      return `${seconds} seconds`;
    }
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours < 24) {
      if (remainingMinutes > 0) {
        return `${hours}h ${remainingMinutes}m`;
      }
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  }
}
