/**
 * Loot Calculator Service
 * Handles loot table rolling and reward calculations
 */

import { Injectable, Logger } from '@nestjs/common';

import { ILootDrop } from '@repo/shared-types';

interface ILootTableEntry {
  itemSlug: string;
  dropRate: number; // 0.0 to 1.0
  minQuantity: number;
  maxQuantity: number;
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
      const roll = Math.random();
      
      if (roll <= entry.dropRate) {
        // Calculate quantity
        const quantity = this.rollQuantity(entry.minQuantity, entry.maxQuantity);
        
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
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  /**
   * Calculate effective drop rate with luck modifier
   */
  calculateEffectiveDropRate(baseRate: number, luckBonus: number = 0): number {
    // Luck bonus is additive, capped at 100% total
    return Math.min(1.0, baseRate + luckBonus);
  }
  
  /**
   * Roll for a critical loot (extra drops)
   */
  rollCriticalLoot(baseLoot: ILootDrop[], critChance: number = 0.05): ILootDrop[] {
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
      const current = consolidated.get(drop.itemSlug) || 0;
      consolidated.set(drop.itemSlug, current + drop.quantity);
    }
    
    return Array.from(consolidated.entries()).map(([itemSlug, quantity]) => ({
      itemSlug,
      quantity,
    }));
  }
}
