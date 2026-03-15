/**
 * Progression Service
 * Core business logic for user progression
 * Uses Prisma for persistent storage
 */

import { Injectable, Logger } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import {
  EffectType,
  ItemCategory,
  prisma,
  Progression,
} from '@repo/prisma-client';
import { ClickBufferService } from '@repo/redis-client';
import {
  IItemPurchaseRequest,
  IItemPurchaseResult,
  IProgressionData,
  ItemPurchaseError,
  SHOP_ITEMS,
} from '@repo/shared-types';

import { ItemCostCalculatorService } from './item-cost-calculator.service';
import { LeaderboardSyncService } from './leaderboard-sync.service';

interface IItem {
  baseCost: string;
  baseEffect: number;
  category: string;
  costMultiplier: number;
  effectType: string;
  maxQuantity?: number;
  name: string;
  slug: string;
  unlockLevel: number;
}

function mapShopItemToItem(item: (typeof SHOP_ITEMS)[number]): IItem {
  return {
    baseCost: item.baseCost.toString(),
    baseEffect: item.effect.value,
    category: item.category,
    costMultiplier: item.costMultiplier,
    effectType: item.effect.type,
    maxQuantity: item.maxQuantity,
    name: item.name,
    slug: item.id,
    unlockLevel: item.unlockLevel,
  };
}

// Derive items from shared catalog (single source of truth)
const DERIVED_ITEMS: IItem[] = SHOP_ITEMS.map((item) =>
  mapShopItemToItem(item),
);

@Injectable()
export class ProgressionService {
  private readonly logger = new Logger(ProgressionService.name);

  private readonly ITEMS: IItem[] = DERIVED_ITEMS;

  constructor(
    private readonly costCalculator: ItemCostCalculatorService,
    private readonly leaderboardSync: LeaderboardSyncService,
    private readonly clickBufferService: ClickBufferService,
  ) {}

  /**
   * Get or create user progression from database
   */
  async getProgression(userId: string): Promise<IProgressionData> {
    let progression: any = await prisma.progression.findUnique({
      where: { userId },
    });

    progression ??= await prisma.progression.create({
      data: {
        clickMultiplier: 1,
        criticalChance: 0.05,
        criticalMultiplier: 2,
        experience: new Decimal(0),
        experienceToNext: new Decimal(100),
        level: 1,
        linesOfCode: new Decimal(0),
        passiveMultiplier: 0,
        totalClicks: 0n,
        totalLinesWritten: new Decimal(0),
        userId,
      },
    });

    // FETCH PENDING BUFFER (Real-time correction)
    const buffer = await this.clickBufferService.getBuffer(userId);
    let extraLoC = new Decimal(0);
    if (buffer) {
      extraLoC = new Decimal(buffer.locToAdd);
    }

    return this.toProgressionData(progression, extraLoC);
  }

  /**
   * Update user's balance (LoC)
   */
  async updateBalance(
    userId: string,
    delta: string,
  ): Promise<IProgressionData> {
    const deltaDecimal = new Decimal(delta);

    // Use atomic increment/update
    const progression = await prisma.progression.upsert({
      create: {
        clickMultiplier: 1,
        criticalChance: 0.05,
        criticalMultiplier: 2,
        experience: new Decimal(0),
        experienceToNext: new Decimal(100),
        level: 1,
        linesOfCode: deltaDecimal.gt(0) ? deltaDecimal : new Decimal(0),
        passiveMultiplier: 0,
        totalClicks: 0n,
        totalLinesWritten: deltaDecimal.gt(0) ? deltaDecimal : new Decimal(0),
        userId,
      },
      update: {
        linesOfCode: { increment: deltaDecimal },
        totalLinesWritten: deltaDecimal.gt(0)
          ? { increment: deltaDecimal }
          : undefined,
      },
      where: { userId },
    });

    // Sync to leaderboard if positive delta
    if (deltaDecimal.gt(0)) {
      await this.leaderboardSync.syncUserScore(
        userId,
        progression.totalLinesWritten.toString(),
      );
    }

    return this.toProgressionData(progression);
  }

  /**
   * Add experience and handle level ups
   */
  async addExperience(
    userId: string,
    expToAdd: string,
  ): Promise<{ newLevel: number; leveledUp: boolean }> {
    // Get or create progression
    let progression = await prisma.progression.findUnique({
      where: { userId },
    });

    progression ??= await prisma.progression.create({
      data: {
        clickMultiplier: 1,
        criticalChance: 0.05,
        criticalMultiplier: 2,
        experience: new Decimal(0),
        experienceToNext: new Decimal(100),
        level: 1,
        linesOfCode: new Decimal(0),
        passiveMultiplier: 0,
        totalClicks: 0n,
        totalLinesWritten: new Decimal(0),
        userId,
      },
    });

    const oldLevel = progression.level;
    let experience = progression.experience.add(expToAdd);
    let experienceToNext = progression.experienceToNext;
    let level = progression.level;

    // Check for level ups
    while (experience.gte(experienceToNext)) {
      experience = experience.sub(experienceToNext);
      level++;
      // Experience requirement increases by 50% each level
      experienceToNext = new Decimal(
        Math.floor(experienceToNext.toNumber() * 1.5),
      );
    }

    // Save updated progression
    await prisma.progression.update({
      data: {
        experience,
        experienceToNext,
        level,
      },
      where: { userId },
    });

    return {
      leveledUp: level > oldLevel,
      newLevel: level,
    };
  }

  /**
   * Purchase an item
   */
  async purchaseItem(
    request: IItemPurchaseRequest,
  ): Promise<IItemPurchaseResult> {
    const { itemSlug, quantity = 1, userId } = request;

    // 1. Find item definition
    const itemDef = this.ITEMS.find((i) => i.slug === itemSlug);
    if (!itemDef) {
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

    // 2. Get user progression from DB
    let progression = await prisma.progression.findUnique({
      where: { userId },
    });

    progression ??= await prisma.progression.create({
      data: {
        clickMultiplier: 1,
        criticalChance: 0.05,
        criticalMultiplier: 2,
        experience: new Decimal(0),
        experienceToNext: new Decimal(100),
        level: 1,
        linesOfCode: new Decimal(0),
        passiveMultiplier: 0,
        totalClicks: 0n,
        totalLinesWritten: new Decimal(0),
        userId,
      },
    });

    // 3. Check level requirement
    if (progression.level < itemDef.unlockLevel) {
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

    // 4. Get or create item in DB — update values if they've changed
    const item = await prisma.item.upsert({
      create: {
        baseCost: new Decimal(itemDef.baseCost),
        baseEffect: itemDef.baseEffect,
        category: itemDef.category as ItemCategory,
        costMultiplier: itemDef.costMultiplier,
        description: `${itemDef.name} - ${itemDef.effectType}`,
        effectType: itemDef.effectType as EffectType,
        maxQuantity: itemDef.maxQuantity ?? null,
        name: itemDef.name,
        slug: itemSlug,
        unlockLevel: itemDef.unlockLevel,
      },
      update: {
        baseCost: new Decimal(itemDef.baseCost),
        baseEffect: itemDef.baseEffect,
        category: itemDef.category as ItemCategory,
        costMultiplier: itemDef.costMultiplier,
        description: `${itemDef.name} - ${itemDef.effectType}`,
        effectType: itemDef.effectType as EffectType,
        maxQuantity: itemDef.maxQuantity ?? null,
        name: itemDef.name,
        unlockLevel: itemDef.unlockLevel,
      },
      where: { slug: itemSlug },
    });

    // 5. Get current owned quantity from DB
    const ownedItem = await prisma.ownedItem.findUnique({
      where: {
        userId_itemId: { itemId: item.id, userId },
      },
    });
    const currentOwned = ownedItem?.quantity ?? 0;

    // 6. Check max quantity
    if (itemDef.maxQuantity && currentOwned + quantity > itemDef.maxQuantity) {
      return {
        error: ItemPurchaseError.MAX_QUANTITY_REACHED,
        itemSlug,
        newBalance: progression.linesOfCode.toString(),
        newQuantityOwned: currentOwned,
        nextItemCost: this.costCalculator.calculateNextCost(
          itemDef.baseCost,
          currentOwned,
          itemDef.costMultiplier,
        ),
        quantityPurchased: 0,
        success: false,
        totalCost: '0',
      };
    }

    // 7. Calculate cost
    const totalCost = this.costCalculator.calculateBulkCost(
      itemDef.baseCost,
      currentOwned,
      quantity,
      itemDef.costMultiplier,
    );

    // 8. Check if user can afford
    if (progression.linesOfCode.lt(totalCost)) {
      return {
        error: ItemPurchaseError.INSUFFICIENT_FUNDS,
        itemSlug,
        newBalance: progression.linesOfCode.toString(),
        newQuantityOwned: currentOwned,
        nextItemCost: this.costCalculator.calculateNextCost(
          itemDef.baseCost,
          currentOwned,
          itemDef.costMultiplier,
        ),
        quantityPurchased: 0,
        success: false,
        totalCost,
      };
    }

    // 9. Execute purchase in transaction
    const newQuantity = currentOwned + quantity;

    await prisma.$transaction([
      // Deduct cost
      prisma.progression.update({
        data: {
          linesOfCode: { decrement: new Decimal(totalCost) },
        },
        where: { userId },
      }),
      // Add/update item in inventory
      prisma.ownedItem.upsert({
        create: {
          itemId: item.id,
          level: 1,
          quantity: newQuantity,
          userId,
        },
        update: {
          quantity: newQuantity,
        },
        where: {
          userId_itemId: { itemId: item.id, userId },
        },
      }),
    ]);

    // 10. Update multipliers
    await this.recalculateMultipliers(userId);

    // Fetch updated balance
    const updatedProgression = await prisma.progression.findUnique({
      where: { userId },
    });

    this.logger.log(
      `User ${userId} purchased ${quantity}x ${itemSlug} for ${totalCost} LoC`,
    );

    return {
      itemSlug,
      newBalance: updatedProgression?.linesOfCode.toString() ?? '0',
      newQuantityOwned: newQuantity,
      nextItemCost: this.costCalculator.calculateNextCost(
        itemDef.baseCost,
        newQuantity,
        itemDef.costMultiplier,
      ),
      quantityPurchased: quantity,
      success: true,
      totalCost,
    };
  }

  /**
   * Add an item to user's inventory (from loot, achievements, etc.)
   */
  async addItem(
    userId: string,
    itemSlug: string,
    quantity: number,
  ): Promise<boolean> {
    // Find item definition
    const itemDef = this.ITEMS.find((i) => i.slug === itemSlug);
    if (!itemDef) {
      this.logger.warn(`Item not found: ${itemSlug}`);
      return false;
    }

    // Ensure item exists in DB — update values if they've changed
    const item = await prisma.item.upsert({
      create: {
        baseCost: new Decimal(itemDef.baseCost),
        baseEffect: itemDef.baseEffect,
        category: itemDef.category as ItemCategory,
        costMultiplier: itemDef.costMultiplier,
        description: `${itemDef.name} - ${itemDef.effectType}`,
        effectType: itemDef.effectType as EffectType,
        maxQuantity: itemDef.maxQuantity ?? null,
        name: itemDef.name,
        slug: itemSlug,
        unlockLevel: itemDef.unlockLevel,
      },
      update: {
        baseCost: new Decimal(itemDef.baseCost),
        baseEffect: itemDef.baseEffect,
        category: itemDef.category as ItemCategory,
        costMultiplier: itemDef.costMultiplier,
        description: `${itemDef.name} - ${itemDef.effectType}`,
        effectType: itemDef.effectType as EffectType,
        maxQuantity: itemDef.maxQuantity ?? null,
        name: itemDef.name,
        unlockLevel: itemDef.unlockLevel,
      },
      where: { slug: itemSlug },
    });

    // Get current owned quantity
    const existingOwnedItem = await prisma.ownedItem.findUnique({
      where: {
        userId_itemId: { itemId: item.id, userId },
      },
    });

    const newQuantity = (existingOwnedItem?.quantity ?? 0) + quantity;

    // Upsert owned item
    await prisma.ownedItem.upsert({
      create: {
        itemId: item.id,
        level: 1,
        quantity: newQuantity,
        userId,
      },
      update: {
        quantity: newQuantity,
      },
      where: {
        userId_itemId: { itemId: item.id, userId },
      },
    });

    // Recalculate multipliers
    await this.recalculateMultipliers(userId);

    this.logger.log(`Added ${quantity}x ${itemSlug} to user ${userId}`);

    return true;
  }

  /**
   * Recalculate user's multipliers based on owned items
   */
  private async recalculateMultipliers(userId: string): Promise<void> {
    // Get all owned items with their item definitions
    const ownedItems = await prisma.ownedItem.findMany({
      include: { item: true },
      where: { userId },
    });

    // Reset to base values
    let clickBonus = 0;
    let passiveBonus = 0;
    let clickMultiplier = 1;
    let passiveMultiplier = 1;
    let critChance = 0.05; // base 5%
    let critMultiplier = 2; // base x2

    // Calculate bonuses from items
    for (const ownedItem of ownedItems) {
      const totalEffect =
        ownedItem.item.baseEffect * ownedItem.quantity * ownedItem.level;

      switch (ownedItem.item.effectType) {
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
        case 'CRIT_CHANCE': {
          critChance += totalEffect;
          break;
        }
        case 'CRIT_MULTIPLIER': {
          critMultiplier += totalEffect;
          break;
        }
        // EXPERIENCE_BONUS: not stored in Progression table, handled separately
      }
    }

    // Cap crit chance at 95%
    critChance = Math.min(critChance, 0.95);

    // Apply bonuses and update in DB
    await prisma.progression.update({
      data: {
        clickMultiplier: (1 + clickBonus) * clickMultiplier,
        criticalChance: critChance,
        criticalMultiplier: critMultiplier,
        passiveMultiplier: passiveBonus * passiveMultiplier,
      },
      where: { userId },
    });
  }

  /**
   * Convert Prisma progression to DTO
   */
  private toProgressionData(
    progression: Progression,
    extraLoC = new Decimal(0),
  ): IProgressionData {
    return {
      clickMultiplier: progression.clickMultiplier,
      criticalChance: progression.criticalChance,
      criticalMultiplier: progression.criticalMultiplier,
      experience: progression.experience.toString(),
      level: progression.level,
      linesOfCode: progression.linesOfCode.add(extraLoC).toString(),
      passiveMultiplier: progression.passiveMultiplier,
      totalLinesWritten: progression.totalLinesWritten.add(extraLoC).toString(),
      userId: progression.userId,
    };
  }

  /**
   * Get available items for a user
   */
  async getAvailableItems(userId: string): Promise<
    {
      item: IItem;
      owned: number;
      nextCost: string;
      canAfford: boolean;
    }[]
  > {
    // Get progression from DB
    const progression = await prisma.progression.findUnique({
      where: { userId },
    });

    const balance = progression?.linesOfCode ?? new Decimal(0);
    const level = progression?.level ?? 1;

    // Get all owned items for this user
    const ownedItems = await prisma.ownedItem.findMany({
      include: { item: true },
      where: { userId },
    });

    // Create a map of slug -> quantity
    const ownedMap = new Map<string, number>();
    for (const oi of ownedItems) {
      ownedMap.set(oi.item.slug, oi.quantity);
    }

    return this.ITEMS.filter((itemDef) => itemDef.unlockLevel <= level).map(
      (itemDef) => {
        const owned = ownedMap.get(itemDef.slug) ?? 0;
        const nextCost = this.costCalculator.calculateNextCost(
          itemDef.baseCost,
          owned,
          itemDef.costMultiplier,
        );

        return {
          canAfford: balance.gte(nextCost),
          item: itemDef,
          nextCost,
          owned,
        };
      },
    );
  }

  /**
   * Get shop catalog (all items, regardless of user)
   * Returns item definitions that can be displayed in the shop UI
   */
  getShopCatalog(): IItem[] {
    return this.ITEMS;
  }
}
