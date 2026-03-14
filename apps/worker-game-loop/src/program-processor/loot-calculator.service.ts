/**
 * Loot Calculator Service
 * Handles loot table rolling and reward calculations
 */

import { Injectable, Logger } from '@nestjs/common';
import { ILootDrop } from '@repo/shared-types';

interface ILootTableEntry {
  dropRate: number; // 0.0 to 1.0
  itemSlug: string;
  maxQuantity: number;
  minQuantity: number;
}

@Injectable()
export class LootCalculatorService {
  private readonly logger = new Logger(LootCalculatorService.name);

  /**
   * Roll for loot from a loot table
   * Each entry is rolled independently
   */
  rollLoot(lootTable: ILootTableEntry[]): ILootDrop[] {
    const drops: ILootDrop[] = [];

    for (const entry of lootTable) {
      // Roll for drop
      // eslint-disable-next-line sonarjs/pseudo-random
      const roll = Math.random();

      if (roll <= entry.dropRate) {
        // Calculate quantity
        const quantity = this.rollQuantity(
          entry.minQuantity,
          entry.maxQuantity,
        );

        drops.push({
          itemSlug: entry.itemSlug,
          quantity,
        });

        this.logger.debug(
          `Loot drop: ${entry.itemSlug} x${quantity} (roll: ${roll.toFixed(3)}, rate: ${entry.dropRate})`,
        );
      }
    }

    return drops;
  }

  /**
   * Roll a random quantity between min and max (inclusive)
   */
  private rollQuantity(min: number, max: number): number {
    if (min === max) return min;
    // eslint-disable-next-line sonarjs/pseudo-random
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Calculate effective drop rate with luck modifier
   */
  calculateEffectiveDropRate(baseRate: number, luckBonus = 0): number {
    // Luck bonus is additive, capped at 100% total
    return Math.min(1, baseRate + luckBonus);
  }

  /**
   * Roll for a critical loot (extra drops)
   */
  rollCriticalLoot(baseLoot: ILootDrop[], critChance = 0.05): ILootDrop[] {
    // eslint-disable-next-line sonarjs/pseudo-random
    const roll = Math.random();

    if (roll <= critChance) {
      // Double all loot quantities
      this.logger.debug('Critical loot roll! Doubling quantities.');
      return baseLoot.map((drop) => ({
        ...drop,
        quantity: drop.quantity * 2,
      }));
    }

    return baseLoot;
  }

  /**
   * Combine multiple loot drops of the same item
   */
  consolidateLoot(drops: ILootDrop[]): ILootDrop[] {
    const consolidated = new Map<string, number>();

    for (const drop of drops) {
      const current = consolidated.get(drop.itemSlug) ?? 0;
      consolidated.set(drop.itemSlug, current + drop.quantity);
    }

    return [...consolidated.entries()].map(([itemSlug, quantity]) => ({
      itemSlug,
      quantity,
    }));
  }
}
