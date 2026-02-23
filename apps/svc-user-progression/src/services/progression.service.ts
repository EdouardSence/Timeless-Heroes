/**
 * Progression Service
 * Core business logic for user progression
 */

import { Injectable, Logger } from '@nestjs/common';
import * as net from 'net';

import {
  IItemPurchaseRequest,
  IItemPurchaseResult,
  IProgressionData,
  ItemPurchaseError,
} from '@repo/shared-types';
import { ItemCostCalculatorService } from './item-cost-calculator.service';
import { LeaderboardSyncService } from './leaderboard-sync.service';

// Mock data structures (in production, use Prisma)
interface IUserProgression {
  userId: string;
  linesOfCode: bigint;
  totalLinesWritten: bigint;
  level: number;
  experience: bigint;
  experienceToNext: bigint;
  clickMultiplier: number;
  passiveMultiplier: number;
  criticalChance: number;
  criticalMultiplier: number;
  totalClicks: bigint;
}

interface IOwnedItem {
  userId: string;
  itemSlug: string;
  quantity: number;
  level: number;
}

interface IItem {
  slug: string;
  name: string;
  baseCost: string;
  costMultiplier: number;
  baseEffect: number;
  effectType: string;
  unlockLevel: number;
  maxQuantity?: number;
}

@Injectable()
export class ProgressionService {
  private readonly logger = new Logger(ProgressionService.name);

  // In-memory storage for development (use Prisma in production)
  private progressions: Map<string, IUserProgression> = new Map();
  private ownedItems: Map<string, Map<string, IOwnedItem>> = new Map();

  // Hardcoded items for now (in production, from DB)
  private readonly ITEMS: IItem[] = [
    {
      slug: 'mechanical-keyboard',
      name: 'Mechanical Keyboard',
      baseCost: '100',
      costMultiplier: 1.15,
      baseEffect: 1,
      effectType: 'CLICK_BONUS',
      unlockLevel: 1,
    },
    {
      slug: 'monitor-4k',
      name: '4K Monitor',
      baseCost: '500',
      costMultiplier: 1.15,
      baseEffect: 2,
      effectType: 'CLICK_BONUS',
      unlockLevel: 3,
    },
    {
      slug: 'junior-dev',
      name: 'Junior Developer',
      baseCost: '1000',
      costMultiplier: 1.15,
      baseEffect: 0.5,
      effectType: 'PASSIVE_BONUS',
      unlockLevel: 5,
    },
    {
      slug: 'senior-dev',
      name: 'Senior Developer',
      baseCost: '10000',
      costMultiplier: 1.15,
      baseEffect: 5,
      effectType: 'PASSIVE_BONUS',
      unlockLevel: 10,
    },
    {
      slug: 'coffee-machine',
      name: 'Coffee Machine',
      baseCost: '2500',
      costMultiplier: 1.2,
      baseEffect: 0.1,
      effectType: 'CLICK_MULTIPLIER',
      unlockLevel: 7,
    },
    {
      slug: 'cloud-server',
      name: 'Cloud Server',
      baseCost: '50000',
      costMultiplier: 1.15,
      baseEffect: 50,
      effectType: 'PASSIVE_BONUS',
      unlockLevel: 15,
    },
  ];

  constructor(
    private readonly costCalculator: ItemCostCalculatorService,
    private readonly leaderboardSync: LeaderboardSyncService,
  ) { }

  /**
   * Get or create user progression
   */
  async getProgression(userId: string): Promise<IProgressionData> {
    let progression = this.progressions.get(userId);

    if (!progression) {
      progression = this.createDefaultProgression(userId);
      this.progressions.set(userId, progression);
    }

    return this.toProgressionData(progression);
  }

  /**
   * Update user's balance (LoC)
   */
  async updateBalance(userId: string, delta: string): Promise<IProgressionData> {
    let progression = this.progressions.get(userId);

    if (!progression) {
      progression = this.createDefaultProgression(userId);
    }

    const deltaBigInt = BigInt(delta);
    progression.linesOfCode += deltaBigInt;

    // Also update total lines written (for leaderboard)
    if (deltaBigInt > 0n) {
      progression.totalLinesWritten += deltaBigInt;

      // Sync to leaderboard
      await this.leaderboardSync.syncUserScore(
        userId,
        progression.totalLinesWritten.toString(),
      );
    }

    this.progressions.set(userId, progression);

    // Attempt to notify the local keylogger via TCP (since the keylogger is the source of truth for the local game loop)
    try {
      const client = new net.Socket();
      client.connect(9999, '127.0.0.1', () => {
        client.write(`ADD_LOC:${delta}\n`);
        client.destroy();
      });
      client.on('error', () => {
        // Keylogger might not be running, ignore
      });
    } catch (e) {
      // ignore
    }

    return this.toProgressionData(progression);
  }

  /**
   * Add experience and handle level ups
   */
  async addExperience(userId: string, expToAdd: string): Promise<{ newLevel: number; leveledUp: boolean }> {
    let progression = this.progressions.get(userId);

    if (!progression) {
      progression = this.createDefaultProgression(userId);
    }

    const oldLevel = progression.level;
    progression.experience += BigInt(expToAdd);

    // Check for level ups
    while (progression.experience >= progression.experienceToNext) {
      progression.experience -= progression.experienceToNext;
      progression.level++;
      // Experience requirement increases by 50% each level
      progression.experienceToNext = BigInt(
        Math.floor(Number(progression.experienceToNext) * 1.5),
      );
    }

    this.progressions.set(userId, progression);

    return {
      newLevel: progression.level,
      leveledUp: progression.level > oldLevel,
    };
  }

  /**
   * Purchase an item
   */
  async purchaseItem(request: IItemPurchaseRequest): Promise<IItemPurchaseResult> {
    const { userId, itemSlug, quantity = 1 } = request;

    // 1. Find item
    const item = this.ITEMS.find((i) => i.slug === itemSlug);
    if (!item) {
      return {
        success: false,
        itemSlug,
        quantityPurchased: 0,
        totalCost: '0',
        newBalance: '0',
        newQuantityOwned: 0,
        nextItemCost: '0',
        error: ItemPurchaseError.ITEM_NOT_FOUND,
      };
    }

    // 2. Get user progression
    let progression = this.progressions.get(userId);
    if (!progression) {
      progression = this.createDefaultProgression(userId);
      this.progressions.set(userId, progression);
    }

    // 3. Check level requirement
    if (progression.level < item.unlockLevel) {
      return {
        success: false,
        itemSlug,
        quantityPurchased: 0,
        totalCost: '0',
        newBalance: progression.linesOfCode.toString(),
        newQuantityOwned: 0,
        nextItemCost: '0',
        error: ItemPurchaseError.LEVEL_TOO_LOW,
      };
    }

    // 4. Get current owned quantity
    const userItems = this.ownedItems.get(userId) || new Map();
    const ownedItem = userItems.get(itemSlug);
    const currentOwned = ownedItem?.quantity || 0;

    // 5. Check max quantity
    if (item.maxQuantity && currentOwned + quantity > item.maxQuantity) {
      return {
        success: false,
        itemSlug,
        quantityPurchased: 0,
        totalCost: '0',
        newBalance: progression.linesOfCode.toString(),
        newQuantityOwned: currentOwned,
        nextItemCost: this.costCalculator.calculateNextCost(
          item.baseCost,
          currentOwned,
          item.costMultiplier,
        ),
        error: ItemPurchaseError.MAX_QUANTITY_REACHED,
      };
    }

    // 6. Calculate cost
    const totalCost = this.costCalculator.calculateBulkCost(
      item.baseCost,
      currentOwned,
      quantity,
      item.costMultiplier,
    );

    // 7. Check if user can afford
    if (progression.linesOfCode < BigInt(totalCost)) {
      return {
        success: false,
        itemSlug,
        quantityPurchased: 0,
        totalCost,
        newBalance: progression.linesOfCode.toString(),
        newQuantityOwned: currentOwned,
        nextItemCost: this.costCalculator.calculateNextCost(
          item.baseCost,
          currentOwned,
          item.costMultiplier,
        ),
        error: ItemPurchaseError.INSUFFICIENT_FUNDS,
      };
    }

    // 8. Deduct cost
    progression.linesOfCode -= BigInt(totalCost);
    this.progressions.set(userId, progression);

    // 9. Add item to inventory
    const newQuantity = currentOwned + quantity;
    userItems.set(itemSlug, {
      userId,
      itemSlug,
      quantity: newQuantity,
      level: ownedItem?.level || 1,
    });
    this.ownedItems.set(userId, userItems);

    // 10. Update multipliers
    await this.recalculateMultipliers(userId);

    this.logger.log(
      `User ${userId} purchased ${quantity}x ${itemSlug} for ${totalCost} LoC`,
    );

    return {
      success: true,
      itemSlug,
      quantityPurchased: quantity,
      totalCost,
      newBalance: progression.linesOfCode.toString(),
      newQuantityOwned: newQuantity,
      nextItemCost: this.costCalculator.calculateNextCost(
        item.baseCost,
        newQuantity,
        item.costMultiplier,
      ),
    };
  }

  /**
   * Add an item to user's inventory (from loot, achievements, etc.)
   */
  async addItem(userId: string, itemSlug: string, quantity: number): Promise<boolean> {
    const userItems = this.ownedItems.get(userId) || new Map();
    const ownedItem = userItems.get(itemSlug);

    const newQuantity = (ownedItem?.quantity || 0) + quantity;

    userItems.set(itemSlug, {
      userId,
      itemSlug,
      quantity: newQuantity,
      level: ownedItem?.level || 1,
    });

    this.ownedItems.set(userId, userItems);

    // Recalculate multipliers
    await this.recalculateMultipliers(userId);

    this.logger.log(`Added ${quantity}x ${itemSlug} to user ${userId}`);

    return true;
  }

  /**
   * Recalculate user's multipliers based on owned items
   */
  private async recalculateMultipliers(userId: string): Promise<void> {
    let progression = this.progressions.get(userId);
    if (!progression) return;

    const userItems = this.ownedItems.get(userId) || new Map();

    // Reset to base values
    let clickBonus = 0;
    let passiveBonus = 0;
    let clickMultiplier = 1;
    let passiveMultiplier = 1;

    // Calculate bonuses from items
    for (const [itemSlug, ownedItem] of userItems) {
      const item = this.ITEMS.find((i) => i.slug === itemSlug);
      if (!item) continue;

      const totalEffect = item.baseEffect * ownedItem.quantity * ownedItem.level;

      switch (item.effectType) {
        case 'CLICK_BONUS':
          clickBonus += totalEffect;
          break;
        case 'PASSIVE_BONUS':
          passiveBonus += totalEffect;
          break;
        case 'CLICK_MULTIPLIER':
          clickMultiplier += totalEffect;
          break;
        case 'PASSIVE_MULTIPLIER':
          passiveMultiplier += totalEffect;
          break;
      }
    }

    // Apply bonuses
    progression.clickMultiplier = (1 + clickBonus) * clickMultiplier;
    progression.passiveMultiplier = passiveBonus * passiveMultiplier;

    this.progressions.set(userId, progression);
  }

  /**
   * Create default progression for a new user
   */
  private createDefaultProgression(userId: string): IUserProgression {
    return {
      userId,
      linesOfCode: 0n,
      totalLinesWritten: 0n,
      level: 1,
      experience: 0n,
      experienceToNext: 100n,
      clickMultiplier: 1.0,
      passiveMultiplier: 0.0,
      criticalChance: 0.05,
      criticalMultiplier: 2.0,
      totalClicks: 0n,
    };
  }

  /**
   * Convert internal progression to DTO
   */
  private toProgressionData(progression: IUserProgression): IProgressionData {
    return {
      userId: progression.userId,
      linesOfCode: progression.linesOfCode.toString(),
      level: progression.level,
      experience: progression.experience.toString(),
      clickMultiplier: progression.clickMultiplier,
      passiveMultiplier: progression.passiveMultiplier,
      criticalChance: progression.criticalChance,
      criticalMultiplier: progression.criticalMultiplier,
    };
  }

  /**
   * Get available items for a user
   */
  getAvailableItems(userId: string): Array<{
    item: IItem;
    owned: number;
    nextCost: string;
    canAfford: boolean;
  }> {
    const progression = this.progressions.get(userId);
    const balance = progression?.linesOfCode || 0n;
    const level = progression?.level || 1;

    const userItems = this.ownedItems.get(userId) || new Map();

    return this.ITEMS.filter((item) => item.unlockLevel <= level).map((item) => {
      const owned = userItems.get(item.slug)?.quantity || 0;
      const nextCost = this.costCalculator.calculateNextCost(
        item.baseCost,
        owned,
        item.costMultiplier,
      );

      return {
        item,
        owned,
        nextCost,
        canAfford: balance >= BigInt(nextCost),
      };
    });
  }
}
