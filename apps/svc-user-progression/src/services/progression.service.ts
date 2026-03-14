/**
 * Progression Service
 * Core business logic for user progression — backed by PostgreSQL (Prisma).
 */

import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@repo/prisma-client';
import {
  IClickResult,
  IItemPurchaseRequest,
  IItemPurchaseResult,
  IKeyPressPayload,
  IMultiplierBreakdown,
  IProgressionData,
  ItemPurchaseError,
  KeyType,
} from '@repo/shared-types';

import { ItemCostCalculatorService } from './item-cost-calculator.service';
import { LeaderboardSyncService } from './leaderboard-sync.service';
import { PrismaService } from './prisma.service';

// Hardcoded items — in Mission 4 these move to the DB Item table
export interface IItem {
  baseCost: string;
  baseEffect: number;
  costMultiplier: number;
  effectType: string;
  maxQuantity?: number;
  name: string;
  slug: string;
  unlockLevel: number;
}

const ITEMS: IItem[] = [
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

@Injectable()
export class ProgressionService {
  private readonly logger = new Logger(ProgressionService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly costCalculator: ItemCostCalculatorService,
    private readonly leaderboardSync: LeaderboardSyncService,
  ) {}

  private get db() {
    return this.prismaService.client;
  }

  // ========================================================================
  // Helpers
  // ========================================================================

  /**
   * Ensure an Item row exists for every hardcoded item (upsert on startup).
   * Called lazily on the first request that needs items.
   */
  private itemsSynced = false;

  private async ensureItemsSeeded(): Promise<void> {
    if (this.itemsSynced) return;

    await Promise.all(
      ITEMS.map((item) =>
        this.db.item.upsert({
          create: {
            baseCost: new (this.decimalCtor())(item.baseCost),
            baseEffect: item.baseEffect,
            category: this.mapEffectToCategory(item.effectType),
            costMultiplier: item.costMultiplier,
            description: `${item.name} — boosts your coding power`,
            effectType: this.mapEffectType(item.effectType),
            maxQuantity: item.maxQuantity ?? null,
            name: item.name,
            rarity: 'COMMON',
            slug: item.slug,
            unlockLevel: item.unlockLevel,
          },
          update: {},
          where: { slug: item.slug },
        }),
      ),
    );

    this.itemsSynced = true;
    this.logger.log('Items seeded / verified in DB');
  }

  /** Map string effectType to Prisma EffectType enum */
  private mapEffectType(
    effect: string,
  ):
    | 'CLICK_BONUS'
    | 'PASSIVE_BONUS'
    | 'CLICK_MULTIPLIER'
    | 'PASSIVE_MULTIPLIER'
    | 'CRIT_CHANCE'
    | 'CRIT_MULTIPLIER'
    | 'EXPERIENCE_BONUS' {
    const mapping: Record<string, string> = {
      CLICK_BONUS: 'CLICK_BONUS',
      CLICK_MULTIPLIER: 'CLICK_MULTIPLIER',
      CRIT_CHANCE: 'CRIT_CHANCE',
      CRIT_MULTIPLIER: 'CRIT_MULTIPLIER',
      EXPERIENCE_BONUS: 'EXPERIENCE_BONUS',
      PASSIVE_BONUS: 'PASSIVE_BONUS',
      PASSIVE_MULTIPLIER: 'PASSIVE_MULTIPLIER',
    };
    return (mapping[effect] ?? 'CLICK_BONUS') as ReturnType<
      typeof this.mapEffectType
    >;
  }

  /** Map effectType to ItemCategory */
  private mapEffectToCategory(
    effect: string,
  ): 'HARDWARE' | 'SOFTWARE' | 'COFFEE' | 'TEAM_MEMBER' | 'INFRASTRUCTURE' {
    if (effect.startsWith('PASSIVE')) return 'TEAM_MEMBER';
    if (effect.startsWith('CLICK_MULTIPLIER')) return 'COFFEE';
    return 'HARDWARE';
  }

  /** Prisma Decimal constructor (avoids importing the Decimal type directly) */
  private decimalCtor(): typeof Prisma.Decimal {
    return Prisma.Decimal;
  }

  // ========================================================================
  // Progression CRUD
  // ========================================================================

  /**
   * Get or create user progression
   */
  async getProgression(userId: string): Promise<IProgressionData> {
    const row =
      (await this.db.progression.findUnique({ where: { userId } })) ??
      (await this.db.progression.create({ data: { userId } }));

    return this.toProgressionData(row);
  }

  /**
   * Update user's balance (LoC)
   */
  async updateBalance(
    userId: string,
    delta: string,
  ): Promise<IProgressionData> {
    const deltaBigInt = BigInt(delta);

    // Use a transaction to safely read-then-write
    const row = await this.db.$transaction(async (tx) => {
      const progression =
        (await tx.progression.findUnique({ where: { userId } })) ??
        (await tx.progression.create({ data: { userId } }));

      const newLoC = BigInt(progression.linesOfCode.toFixed(0)) + deltaBigInt;
      const updateData: Prisma.ProgressionUpdateInput = {
        linesOfCode: (newLoC < 0n ? 0n : newLoC).toString(),
      };

      if (deltaBigInt > 0n) {
        updateData.totalLinesWritten = (
          BigInt(progression.totalLinesWritten.toFixed(0)) + deltaBigInt
        ).toString();
      }

      return tx.progression.update({
        data: updateData,
        where: { userId },
      });
    });

    // Sync to leaderboard (fire-and-forget)
    if (deltaBigInt > 0n) {
      void this.leaderboardSync.syncUserScore(
        userId,
        row.totalLinesWritten.toFixed(0),
      );
    }

    return this.toProgressionData(row);
  }

  /**
   * Add experience and handle level ups
   */
  async addExperience(
    userId: string,
    expToAdd: string,
  ): Promise<{ newLevel: number; leveledUp: boolean }> {
    const row = await this.db.$transaction(async (tx) => {
      const progression =
        (await tx.progression.findUnique({ where: { userId } })) ??
        (await tx.progression.create({ data: { userId } }));

      const oldLevel = progression.level;
      let experience =
        BigInt(progression.experience.toFixed(0)) + BigInt(expToAdd);
      let experienceToNext = BigInt(progression.experienceToNext.toFixed(0));
      let level = progression.level;

      while (experience >= experienceToNext) {
        experience -= experienceToNext;
        level++;
        experienceToNext = BigInt(Math.floor(Number(experienceToNext) * 1.5));
      }

      const updated = await tx.progression.update({
        data: {
          experience: experience.toString(),
          experienceToNext: experienceToNext.toString(),
          level,
        },
        where: { userId },
      });

      return { ...updated, oldLevel };
    });

    return {
      leveledUp: row.level > row.oldLevel,
      newLevel: row.level,
    };
  }

  // ========================================================================
  // Click processing (pure logic — no DB writes, gateway buffers result)
  // ========================================================================

  /**
   * Process a single click event.
   * Pure calculation — the gateway buffers the result into Redis.
   */
  processClick(
    payload: IKeyPressPayload,
    progression: IProgressionData,
  ): IClickResult {
    const { keyType } = payload;

    let baseValue: number;
    switch (keyType) {
      case KeyType.SPECIAL: {
        baseValue = 2;
        break;
      }
      case KeyType.FUNCTION: {
        baseValue = 3;
        break;
      }
      default: {
        baseValue = 1;
      }
    }

    const clickMultiplier = progression.clickMultiplier;
    const criticalMultiplier = progression.criticalMultiplier;
    const bonusMultiplier = 1;
    const totalMultiplier = clickMultiplier * bonusMultiplier;

    const multipliers: IMultiplierBreakdown = {
      bonusMultiplier,
      clickMultiplier,
      criticalMultiplier,
      totalMultiplier,
    };

    // eslint-disable-next-line sonarjs/pseudo-random
    const isCritical = Math.random() < progression.criticalChance;

    let finalValue = baseValue * totalMultiplier;
    if (isCritical) {
      finalValue *= criticalMultiplier;
    }

    return {
      baseValue,
      finalValue: finalValue.toFixed(0),
      isCritical,
      multipliers,
      newBalance: progression.linesOfCode,
    };
  }

  // ========================================================================
  // Offline rewards (pure calculation)
  // ========================================================================

  calculateOfflineRewards(data: {
    userId: string;
    disconnectedAt: number;
    reconnectedAt: number;
    passiveMultiplier: number;
  }): {
    earnedLoc: string;
    earnedExp: string;
    offlineDuration: number;
    effectiveDuration: number;
    maxOfflineTime: number;
    offlineRate: number;
  } {
    const offlineDuration = Math.floor(
      (data.reconnectedAt - data.disconnectedAt) / 1000,
    );

    if (offlineDuration < 60) {
      return {
        earnedExp: '0',
        earnedLoc: '0',
        effectiveDuration: 0,
        maxOfflineTime: 28_800,
        offlineDuration,
        offlineRate: 0,
      };
    }

    const maxOfflineTime = 8 * 60 * 60;
    const effectiveDuration = Math.min(offlineDuration, maxOfflineTime);
    const offlineRate = data.passiveMultiplier * 0.5;
    const earnedLoc = Math.floor(offlineRate * effectiveDuration);

    return {
      earnedExp: '0',
      earnedLoc: earnedLoc.toString(),
      effectiveDuration,
      maxOfflineTime,
      offlineDuration,
      offlineRate,
    };
  }

  // ========================================================================
  // Item purchase
  // ========================================================================

  async purchaseItem(
    request: IItemPurchaseRequest,
  ): Promise<IItemPurchaseResult> {
    await this.ensureItemsSeeded();

    const { itemSlug, quantity = 1, userId } = request;

    // 1. Find item (from hardcoded list for now)
    const item = ITEMS.find((i) => i.slug === itemSlug);
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

    // Run purchase in a transaction to prevent race conditions
    return this.db.$transaction(async (tx) => {
      // 2. Get or create progression
      const progression =
        (await tx.progression.findUnique({ where: { userId } })) ??
        (await tx.progression.create({ data: { userId } }));

      // 3. Check level requirement
      if (progression.level < item.unlockLevel) {
        return {
          error: ItemPurchaseError.LEVEL_TOO_LOW,
          itemSlug,
          newBalance: progression.linesOfCode.toFixed(0),
          newQuantityOwned: 0,
          nextItemCost: '0',
          quantityPurchased: 0,
          success: false,
          totalCost: '0',
        };
      }

      // 4. Get current owned quantity
      const dbItem = await tx.item.findUnique({ where: { slug: itemSlug } });
      const ownedRow = dbItem
        ? await tx.ownedItem.findUnique({
            where: {
              userId_itemId: { itemId: dbItem.id, userId },
            },
          })
        : null;

      const currentOwned = ownedRow?.quantity ?? 0;

      // 5. Check max quantity
      if (item.maxQuantity && currentOwned + quantity > item.maxQuantity) {
        return {
          error: ItemPurchaseError.MAX_QUANTITY_REACHED,
          itemSlug,
          newBalance: progression.linesOfCode.toFixed(0),
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
      const balance = BigInt(progression.linesOfCode.toFixed(0));
      if (balance < BigInt(totalCost)) {
        return {
          error: ItemPurchaseError.INSUFFICIENT_FUNDS,
          itemSlug,
          newBalance: progression.linesOfCode.toFixed(0),
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
      const newBalance = balance - BigInt(totalCost);
      await tx.progression.update({
        data: { linesOfCode: newBalance.toString() },
        where: { userId },
      });

      // 9. Upsert owned item
      const newQuantity = currentOwned + quantity;

      if (dbItem) {
        await (ownedRow
          ? tx.ownedItem.update({
              data: { quantity: newQuantity },
              where: { id: ownedRow.id },
            })
          : tx.ownedItem.create({
              data: {
                itemId: dbItem.id,
                quantity: newQuantity,
                userId,
              },
            }));
      }

      // 10. Recalculate multipliers
      await this.recalculateMultipliers(userId, tx);

      this.logger.log(
        `User ${userId} purchased ${quantity}x ${itemSlug} for ${totalCost} LoC`,
      );

      return {
        itemSlug,
        newBalance: newBalance.toString(),
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
    });
  }

  // ========================================================================
  // Add item (loot, achievements, etc.)
  // ========================================================================

  async addItem(
    userId: string,
    itemSlug: string,
    quantity: number,
  ): Promise<boolean> {
    await this.ensureItemsSeeded();

    const dbItem = await this.db.item.findUnique({
      where: { slug: itemSlug },
    });
    if (!dbItem) return false;

    // Ensure progression exists
    const progression = await this.db.progression.findUnique({
      where: { userId },
    });
    if (!progression) {
      await this.db.progression.create({ data: { userId } });
    }

    const existing = await this.db.ownedItem.findUnique({
      where: { userId_itemId: { itemId: dbItem.id, userId } },
    });

    await (existing
      ? this.db.ownedItem.update({
          data: { quantity: existing.quantity + quantity },
          where: { id: existing.id },
        })
      : this.db.ownedItem.create({
          data: { itemId: dbItem.id, quantity, userId },
        }));

    await this.recalculateMultipliers(userId);

    this.logger.log(`Added ${quantity}x ${itemSlug} to user ${userId}`);
    return true;
  }

  // ========================================================================
  // Multiplier recalculation
  // ========================================================================

  private async recalculateMultipliers(
    userId: string,
    tx?: Parameters<Parameters<typeof this.db.$transaction>[0]>[0],
  ): Promise<void> {
    const client = tx ?? this.db;

    const ownedRows = await client.ownedItem.findMany({
      include: { item: true },
      where: { userId },
    });

    let clickBonus = 0;
    let passiveBonus = 0;
    let clickMultiplier = 1;
    let passiveMultiplier = 1;

    for (const row of ownedRows) {
      const totalEffect = row.item.baseEffect * row.quantity * row.level;

      switch (row.item.effectType) {
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

    await client.progression.update({
      data: {
        clickMultiplier: (1 + clickBonus) * clickMultiplier,
        passiveMultiplier: passiveBonus * passiveMultiplier,
      },
      where: { userId },
    });
  }

  // ========================================================================
  // Available items
  // ========================================================================

  async getAvailableItems(userId: string): Promise<
    {
      item: IItem;
      owned: number;
      nextCost: string;
      canAfford: boolean;
    }[]
  > {
    await this.ensureItemsSeeded();

    const progression =
      (await this.db.progression.findUnique({ where: { userId } })) ??
      (await this.db.progression.create({ data: { userId } }));

    const balance = BigInt(progression.linesOfCode.toFixed(0));
    const level = progression.level;

    const ownedRows = await this.db.ownedItem.findMany({
      include: { item: true },
      where: { userId },
    });

    const ownedBySlug = new Map(
      ownedRows.map((r) => [r.item.slug, r.quantity]),
    );

    return ITEMS.filter((item) => item.unlockLevel <= level).map((item) => {
      const owned = ownedBySlug.get(item.slug) ?? 0;
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
    });
  }

  // ========================================================================
  // DTO conversion
  // ========================================================================

  private toProgressionData(row: {
    userId: string;
    linesOfCode: { toFixed: (d: number) => string } | bigint;
    clickMultiplier: number;
    passiveMultiplier: number;
    criticalChance: number;
    criticalMultiplier: number;
    level: number;
    experience: { toFixed: (d: number) => string } | bigint;
  }): IProgressionData {
    return {
      clickMultiplier: row.clickMultiplier,
      criticalChance: row.criticalChance,
      criticalMultiplier: row.criticalMultiplier,
      experience:
        typeof row.experience === 'bigint'
          ? row.experience.toString()
          : row.experience.toFixed(0),
      level: row.level,
      linesOfCode:
        typeof row.linesOfCode === 'bigint'
          ? row.linesOfCode.toString()
          : row.linesOfCode.toFixed(0),
      passiveMultiplier: row.passiveMultiplier,
      userId: row.userId,
    };
  }
}
