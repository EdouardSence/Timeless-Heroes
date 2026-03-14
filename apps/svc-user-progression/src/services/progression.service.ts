/**
 * Progression Service
 * Core business logic for user progression
 */

import { Injectable, Logger } from '@nestjs/common';
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
  clickMultiplier: number;
  criticalChance: number;
  criticalMultiplier: number;
  experience: bigint;
  experienceToNext: bigint;
  level: number;
  linesOfCode: bigint;
  passiveMultiplier: number;
  totalClicks: bigint;
  totalLinesWritten: bigint;
  userId: string;
}

interface IOwnedItem {
  itemSlug: string;
  level: number;
  quantity: number;
  userId: string;
}

interface IItem {
  baseCost: string;
  baseEffect: number;
  costMultiplier: number;
  effectType: string;
  maxQuantity?: number;
  name: string;
  slug: string;
  unlockLevel: number;
}

@Injectable()
export class ProgressionService {
  private readonly logger = new Logger(ProgressionService.name);

  // In-memory storage for development (use Prisma in production)
  private progressions = new Map<string, IUserProgression>();
  private ownedItems = new Map<string, Map<string, IOwnedItem>>();

  // Hardcoded items for now (in production, from DB)
  private readonly ITEMS: IItem[] = [
    {
      baseCost: '100',
      baseEffect: 1,
      costMultiplier: 1.15,
      effectType: 'CLICK_BONUS',
      name: 'Mechanical Keyboard',
      slug: 'mechanical-keyboard',
      unlockLevel: 1,
    },
    {
      baseCost: '500',
      baseEffect: 2,
      costMultiplier: 1.15,
      effectType: 'CLICK_BONUS',
      name: '4K Monitor',
      slug: 'monitor-4k',
      unlockLevel: 3,
    },
    {
      baseCost: '1000',
      baseEffect: 0.5,
      costMultiplier: 1.15,
      effectType: 'PASSIVE_BONUS',
      name: 'Junior Developer',
      slug: 'junior-dev',
      unlockLevel: 5,
    },
    {
      baseCost: '10000',
      baseEffect: 5,
      costMultiplier: 1.15,
      effectType: 'PASSIVE_BONUS',
      name: 'Senior Developer',
      slug: 'senior-dev',
      unlockLevel: 10,
    },
    {
      baseCost: '2500',
      baseEffect: 0.1,
      costMultiplier: 1.2,
      effectType: 'CLICK_MULTIPLIER',
      name: 'Coffee Machine',
      slug: 'coffee-machine',
      unlockLevel: 7,
    },
    {
      baseCost: '50000',
      baseEffect: 50,
      costMultiplier: 1.15,
      effectType: 'PASSIVE_BONUS',
      name: 'Cloud Server',
      slug: 'cloud-server',
      unlockLevel: 15,
    },
  ];

  constructor(
    private readonly costCalculator: ItemCostCalculatorService,
    private readonly leaderboardSync: LeaderboardSyncService,
  ) {}

  /**
   * Get or create user progression
   */
  getProgression(userId: string): IProgressionData {
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
  async updateBalance(
    userId: string,
    delta: string,
  ): Promise<IProgressionData> {
    let progression = this.progressions.get(userId);

    progression ??= this.createDefaultProgression(userId);

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

    return this.toProgressionData(progression);
  }

  /**
   * Add experience and handle level ups
   */
  addExperience(
    userId: string,
    expToAdd: string,
  ): { newLevel: number; leveledUp: boolean } {
    let progression = this.progressions.get(userId);

    progression ??= this.createDefaultProgression(userId);

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
      leveledUp: progression.level > oldLevel,
      newLevel: progression.level,
    };
  }

  /**
   * Purchase an item
   */
  purchaseItem(request: IItemPurchaseRequest): IItemPurchaseResult {
    const { itemSlug, quantity = 1, userId } = request;

    // 1. Find item
    const item = this.ITEMS.find((i) => i.slug === itemSlug);
    if (!item) {
      return {
        error: ItemPurchaseError.ITEM_NOT_FOUND,
        itemSlug,
        newBalance: '0',
        newQuantityOwned: 0,
        nextItemCost: '0',
        quantityPurchased: 0,
        success: false,
        totalCost: '0',
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
        error: ItemPurchaseError.LEVEL_TOO_LOW,
        itemSlug,
        newBalance: progression.linesOfCode.toString(),
        newQuantityOwned: 0,
        nextItemCost: '0',
        quantityPurchased: 0,
        success: false,
        totalCost: '0',
      };
    }

    // 4. Get current owned quantity
    const userItems =
      this.ownedItems.get(userId) ?? new Map<string, IOwnedItem>();
    const ownedItem = userItems.get(itemSlug);
    const currentOwned = ownedItem?.quantity ?? 0;

    // 5. Check max quantity
    if (item.maxQuantity && currentOwned + quantity > item.maxQuantity) {
      return {
        error: ItemPurchaseError.MAX_QUANTITY_REACHED,
        itemSlug,
        newBalance: progression.linesOfCode.toString(),
        newQuantityOwned: currentOwned,
        nextItemCost: this.costCalculator.calculateNextCost(
          item.baseCost,
          currentOwned,
          item.costMultiplier,
        ),
        quantityPurchased: 0,
        success: false,
        totalCost: '0',
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
        error: ItemPurchaseError.INSUFFICIENT_FUNDS,
        itemSlug,
        newBalance: progression.linesOfCode.toString(),
        newQuantityOwned: currentOwned,
        nextItemCost: this.costCalculator.calculateNextCost(
          item.baseCost,
          currentOwned,
          item.costMultiplier,
        ),
        quantityPurchased: 0,
        success: false,
        totalCost,
      };
    }

    // 8. Deduct cost
    progression.linesOfCode -= BigInt(totalCost);
    this.progressions.set(userId, progression);

    // 9. Add item to inventory
    const newQuantity = currentOwned + quantity;
    userItems.set(itemSlug, {
      itemSlug,
      level: ownedItem?.level ?? 1,
      quantity: newQuantity,
      userId,
    });
    this.ownedItems.set(userId, userItems);

    // 10. Update multipliers
    this.recalculateMultipliers(userId);

    this.logger.log(
      `User ${userId} purchased ${quantity}x ${itemSlug} for ${totalCost} LoC`,
    );

    return {
      itemSlug,
      newBalance: progression.linesOfCode.toString(),
      newQuantityOwned: newQuantity,
      nextItemCost: this.costCalculator.calculateNextCost(
        item.baseCost,
        newQuantity,
        item.costMultiplier,
      ),
      quantityPurchased: quantity,
      success: true,
      totalCost,
    };
  }

  /**
   * Add an item to user's inventory (from loot, achievements, etc.)
   */
  addItem(userId: string, itemSlug: string, quantity: number): boolean {
    const userItems =
      this.ownedItems.get(userId) ?? new Map<string, IOwnedItem>();
    const ownedItem = userItems.get(itemSlug);

    const newQuantity = (ownedItem?.quantity ?? 0) + quantity;

    userItems.set(itemSlug, {
      itemSlug,
      level: ownedItem?.level ?? 1,
      quantity: newQuantity,
      userId,
    });

    this.ownedItems.set(userId, userItems);

    // Recalculate multipliers
    this.recalculateMultipliers(userId);

    this.logger.log(`Added ${quantity}x ${itemSlug} to user ${userId}`);

    return true;
  }

  /**
   * Recalculate user's multipliers based on owned items
   */
  private recalculateMultipliers(userId: string): void {
    const progression = this.progressions.get(userId);
    if (!progression) return;

    const userItems =
      this.ownedItems.get(userId) ?? new Map<string, IOwnedItem>();

    // Reset to base values
    let clickBonus = 0;
    let passiveBonus = 0;
    let clickMultiplier = 1;
    let passiveMultiplier = 1;

    // Calculate bonuses from items
    for (const [itemSlug, ownedItem] of userItems) {
      const item = this.ITEMS.find((i) => i.slug === itemSlug);
      if (!item) continue;

      const totalEffect =
        item.baseEffect * ownedItem.quantity * ownedItem.level;

      switch (item.effectType) {
        case 'CLICK_BONUS': {
          clickBonus += totalEffect;
          break;
        }
        case 'PASSIVE_BONUS': {
          passiveBonus += totalEffect;
          break;
        }
        case 'CLICK_MULTIPLIER': {
          clickMultiplier += totalEffect;
          break;
        }
        case 'PASSIVE_MULTIPLIER': {
          passiveMultiplier += totalEffect;
          break;
        }
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
      clickMultiplier: 1,
      criticalChance: 0.05,
      criticalMultiplier: 2,
      experience: 0n,
      experienceToNext: 100n,
      level: 1,
      linesOfCode: 0n,
      passiveMultiplier: 0,
      totalClicks: 0n,
      totalLinesWritten: 0n,
      userId,
    };
  }

  /**
   * Convert internal progression to DTO
   */
  private toProgressionData(progression: IUserProgression): IProgressionData {
    return {
      clickMultiplier: progression.clickMultiplier,
      criticalChance: progression.criticalChance,
      criticalMultiplier: progression.criticalMultiplier,
      experience: progression.experience.toString(),
      level: progression.level,
      linesOfCode: progression.linesOfCode.toString(),
      passiveMultiplier: progression.passiveMultiplier,
      userId: progression.userId,
    };
  }

  /**
   * Get available items for a user
   */
  getAvailableItems(userId: string): {
    item: IItem;
    owned: number;
    nextCost: string;
    canAfford: boolean;
  }[] {
    const progression = this.progressions.get(userId);
    const balance = progression?.linesOfCode ?? 0n;
    const level = progression?.level ?? 1;

    const userItems =
      this.ownedItems.get(userId) ?? new Map<string, IOwnedItem>();

    return this.ITEMS.filter((item) => item.unlockLevel <= level).map(
      (item) => {
        const owned = userItems.get(item.slug)?.quantity ?? 0;
        const nextCost = this.costCalculator.calculateNextCost(
          item.baseCost,
          owned,
          item.costMultiplier,
        );

        return {
          canAfford: balance >= BigInt(nextCost),
          item,
          nextCost,
          owned,
        };
      },
    );
  }
}
