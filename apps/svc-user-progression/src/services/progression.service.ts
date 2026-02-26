/**
 * Progression Service
 * Core business logic for user progression
 * Uses Prisma for persistent storage
 */

import { Injectable, Logger } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

import {
    IItemPurchaseRequest,
    IItemPurchaseResult,
    IProgressionData,
    ItemPurchaseError,
} from '@repo/shared-types';
import { prisma, Progression, OwnedItem } from '@repo/prisma-client';
import { ItemCostCalculatorService } from './item-cost-calculator.service';
import { LeaderboardSyncService } from './leaderboard-sync.service';

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
  ) {}
  
  /**
   * Get or create user progression from database
   */
  async getProgression(userId: string): Promise<IProgressionData> {
    let progression = await prisma.progression.findUnique({
      where: { userId },
    });
    
    if (!progression) {
      progression = await prisma.progression.create({
        data: {
          userId,
          linesOfCode: new Decimal(0),
          totalLinesWritten: new Decimal(0),
          level: 1,
          experience: new Decimal(0),
          experienceToNext: new Decimal(100),
          clickMultiplier: 1.0,
          passiveMultiplier: 0.0,
          criticalChance: 0.05,
          criticalMultiplier: 2.0,
          totalClicks: 0n,
        },
      });
    }
    
    return this.toProgressionData(progression);
  }
  
  /**
   * Update user's balance (LoC)
   */
  async updateBalance(userId: string, delta: string): Promise<IProgressionData> {
    const deltaDecimal = new Decimal(delta);
    
    // Use atomic increment/update
    const progression = await prisma.progression.upsert({
      where: { userId },
      create: {
        userId,
        linesOfCode: deltaDecimal.gt(0) ? deltaDecimal : new Decimal(0),
        totalLinesWritten: deltaDecimal.gt(0) ? deltaDecimal : new Decimal(0),
        level: 1,
        experience: new Decimal(0),
        experienceToNext: new Decimal(100),
        clickMultiplier: 1.0,
        passiveMultiplier: 0.0,
        criticalChance: 0.05,
        criticalMultiplier: 2.0,
        totalClicks: 0n,
      },
      update: {
        linesOfCode: { increment: deltaDecimal },
        totalLinesWritten: deltaDecimal.gt(0) 
          ? { increment: deltaDecimal }
          : undefined,
      },
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
  async addExperience(userId: string, expToAdd: string): Promise<{ newLevel: number; leveledUp: boolean }> {
    // Get or create progression
    let progression = await prisma.progression.findUnique({
      where: { userId },
    });
    
    if (!progression) {
      progression = await prisma.progression.create({
        data: {
          userId,
          linesOfCode: new Decimal(0),
          totalLinesWritten: new Decimal(0),
          level: 1,
          experience: new Decimal(0),
          experienceToNext: new Decimal(100),
          clickMultiplier: 1.0,
          passiveMultiplier: 0.0,
          criticalChance: 0.05,
          criticalMultiplier: 2.0,
          totalClicks: 0n,
        },
      });
    }
    
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
      where: { userId },
      data: {
        level,
        experience,
        experienceToNext,
      },
    });
    
    return {
      newLevel: level,
      leveledUp: level > oldLevel,
    };
  }
  
  /**
   * Purchase an item
   */
  async purchaseItem(request: IItemPurchaseRequest): Promise<IItemPurchaseResult> {
    const { userId, itemSlug, quantity = 1 } = request;
    
    // 1. Find item definition
    const itemDef = this.ITEMS.find((i) => i.slug === itemSlug);
    if (!itemDef) {
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
    
    // 2. Get user progression from DB
    let progression = await prisma.progression.findUnique({
      where: { userId },
    });
    
    if (!progression) {
      progression = await prisma.progression.create({
        data: {
          userId,
          linesOfCode: new Decimal(0),
          totalLinesWritten: new Decimal(0),
          level: 1,
          experience: new Decimal(0),
          experienceToNext: new Decimal(100),
          clickMultiplier: 1.0,
          passiveMultiplier: 0.0,
          criticalChance: 0.05,
          criticalMultiplier: 2.0,
          totalClicks: 0n,
        },
      });
    }
    
    // 3. Check level requirement
    if (progression.level < itemDef.unlockLevel) {
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
    
    // 4. Get or create item in DB
    const item = await prisma.item.upsert({
      where: { slug: itemSlug },
      create: {
        slug: itemSlug,
        name: itemDef.name,
        description: `${itemDef.name} - ${itemDef.effectType}`,
        category: 'HARDWARE',
        baseCost: new Decimal(itemDef.baseCost),
        baseEffect: itemDef.baseEffect,
        effectType: itemDef.effectType as 'CLICK_BONUS' | 'PASSIVE_BONUS' | 'CLICK_MULTIPLIER' | 'PASSIVE_MULTIPLIER' | 'CRIT_CHANCE' | 'CRIT_MULTIPLIER',
        costMultiplier: itemDef.costMultiplier,
        maxQuantity: itemDef.maxQuantity ?? null,
        unlockLevel: itemDef.unlockLevel,
      },
      update: {},
    });
    
    // 5. Get current owned quantity from DB
    const ownedItem = await prisma.ownedItem.findUnique({
      where: {
        userId_itemId: { userId, itemId: item.id },
      },
    });
    const currentOwned = ownedItem?.quantity || 0;
    
    // 6. Check max quantity
    if (itemDef.maxQuantity && currentOwned + quantity > itemDef.maxQuantity) {
      return {
        success: false,
        itemSlug,
        quantityPurchased: 0,
        totalCost: '0',
        newBalance: progression.linesOfCode.toString(),
        newQuantityOwned: currentOwned,
        nextItemCost: this.costCalculator.calculateNextCost(
          itemDef.baseCost,
          currentOwned,
          itemDef.costMultiplier,
        ),
        error: ItemPurchaseError.MAX_QUANTITY_REACHED,
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
        success: false,
        itemSlug,
        quantityPurchased: 0,
        totalCost,
        newBalance: progression.linesOfCode.toString(),
        newQuantityOwned: currentOwned,
        nextItemCost: this.costCalculator.calculateNextCost(
          itemDef.baseCost,
          currentOwned,
          itemDef.costMultiplier,
        ),
        error: ItemPurchaseError.INSUFFICIENT_FUNDS,
      };
    }
    
    // 9. Execute purchase in transaction
    const newQuantity = currentOwned + quantity;
    
    await prisma.$transaction([
      // Deduct cost
      prisma.progression.update({
        where: { userId },
        data: {
          linesOfCode: { decrement: new Decimal(totalCost) },
        },
      }),
      // Add/update item in inventory
      prisma.ownedItem.upsert({
        where: {
          userId_itemId: { userId, itemId: item.id },
        },
        create: {
          userId,
          itemId: item.id,
          quantity: newQuantity,
          level: 1,
        },
        update: {
          quantity: newQuantity,
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
      success: true,
      itemSlug,
      quantityPurchased: quantity,
      totalCost,
      newBalance: updatedProgression?.linesOfCode.toString() || '0',
      newQuantityOwned: newQuantity,
      nextItemCost: this.costCalculator.calculateNextCost(
        itemDef.baseCost,
        newQuantity,
        itemDef.costMultiplier,
      ),
    };
  }
  
  /**
   * Add an item to user's inventory (from loot, achievements, etc.)
   */
  async addItem(userId: string, itemSlug: string, quantity: number): Promise<boolean> {
    // Find item definition
    const itemDef = this.ITEMS.find((i) => i.slug === itemSlug);
    if (!itemDef) {
      this.logger.warn(`Item not found: ${itemSlug}`);
      return false;
    }
    
    // Ensure item exists in DB
    const item = await prisma.item.upsert({
      where: { slug: itemSlug },
      create: {
        slug: itemSlug,
        name: itemDef.name,
        description: `${itemDef.name} - ${itemDef.effectType}`,
        category: 'HARDWARE',
        baseCost: new Decimal(itemDef.baseCost),
        baseEffect: itemDef.baseEffect,
        effectType: itemDef.effectType as 'CLICK_BONUS' | 'PASSIVE_BONUS' | 'CLICK_MULTIPLIER' | 'PASSIVE_MULTIPLIER' | 'CRIT_CHANCE' | 'CRIT_MULTIPLIER',
        costMultiplier: itemDef.costMultiplier,
        maxQuantity: itemDef.maxQuantity ?? null,
        unlockLevel: itemDef.unlockLevel,
      },
      update: {},
    });
    
    // Get current owned quantity
    const existingOwnedItem = await prisma.ownedItem.findUnique({
      where: {
        userId_itemId: { userId, itemId: item.id },
      },
    });
    
    const newQuantity = (existingOwnedItem?.quantity || 0) + quantity;
    
    // Upsert owned item
    await prisma.ownedItem.upsert({
      where: {
        userId_itemId: { userId, itemId: item.id },
      },
      create: {
        userId,
        itemId: item.id,
        quantity: newQuantity,
        level: 1,
      },
      update: {
        quantity: newQuantity,
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
      where: { userId },
      include: { item: true },
    });
    
    // Reset to base values
    let clickBonus = 0;
    let passiveBonus = 0;
    let clickMultiplier = 1;
    let passiveMultiplier = 1;
    
    // Calculate bonuses from items
    for (const ownedItem of ownedItems) {
      const totalEffect = ownedItem.item.baseEffect * ownedItem.quantity * ownedItem.level;
      
      switch (ownedItem.item.effectType) {
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
    
    // Apply bonuses and update in DB
    await prisma.progression.update({
      where: { userId },
      data: {
        clickMultiplier: (1 + clickBonus) * clickMultiplier,
        passiveMultiplier: passiveBonus * passiveMultiplier,
      },
    });
  }
  
  /**
   * Convert Prisma progression to DTO
   */
  private toProgressionData(progression: Progression): IProgressionData {
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
  async getAvailableItems(userId: string): Promise<Array<{
    item: IItem;
    owned: number;
    nextCost: string;
    canAfford: boolean;
  }>> {
    // Get progression from DB
    const progression = await prisma.progression.findUnique({
      where: { userId },
    });
    
    const balance = progression?.linesOfCode || new Decimal(0);
    const level = progression?.level || 1;
    
    // Get all owned items for this user
    const ownedItems = await prisma.ownedItem.findMany({
      where: { userId },
      include: { item: true },
    });
    
    // Create a map of slug -> quantity
    const ownedMap = new Map<string, number>();
    for (const oi of ownedItems) {
      ownedMap.set(oi.item.slug, oi.quantity);
    }
    
    return this.ITEMS
      .filter((itemDef) => itemDef.unlockLevel <= level)
      .map((itemDef) => {
        const owned = ownedMap.get(itemDef.slug) || 0;
        const nextCost = this.costCalculator.calculateNextCost(
          itemDef.baseCost,
          owned,
          itemDef.costMultiplier,
        );
        
        return {
          item: itemDef,
          owned,
          nextCost,
          canAfford: balance.gte(nextCost),
        };
      });
  }
}
