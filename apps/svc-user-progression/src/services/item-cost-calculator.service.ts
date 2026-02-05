/**
 * Item Cost Calculator Service
 * Pure function implementation for exponential item pricing
 * 
 * Formula: Price = BaseCost × 1.15^AmountOwned
 * 
 * This is a PURE function service - no side effects, no state
 * Makes testing and reasoning about the code much easier
 */

import { Injectable } from '@nestjs/common';

import { IItemCostCalculation } from '@repo/shared-types';

@Injectable()
export class ItemCostCalculatorService {
  // Default cost multiplier per ownership
  private readonly DEFAULT_MULTIPLIER = 1.15;
  
  /**
   * Calculate the cost of the next item
   * 
   * Formula: Price = BaseCost × multiplier^amountOwned
   * 
   * @param baseCost - The base cost of the item (as string for BigInt support)
   * @param amountOwned - Current quantity owned
   * @param multiplier - Cost multiplier per item (default 1.15)
   * @returns The cost for the next item as string
   */
  calculateNextCost(
    baseCost: string,
    amountOwned: number,
    multiplier: number = this.DEFAULT_MULTIPLIER,
  ): string {
    // For precision with large numbers, we use a combination of
    // floating point for the multiplier and BigInt for the base
    
    const base = BigInt(baseCost);
    
    // Calculate multiplier^amountOwned
    // We use high precision (10 decimal places internally)
    const PRECISION = 1_000_000_000_000n; // 10^12
    const multiplierPow = Math.pow(multiplier, amountOwned);
    const multiplierBigInt = BigInt(Math.floor(multiplierPow * Number(PRECISION)));
    
    // Calculate final cost
    const cost = (base * multiplierBigInt) / PRECISION;
    
    return cost.toString();
  }
  
  /**
   * Calculate total cost for buying multiple items at once
   * 
   * This is the sum of geometric series:
   * Total = BaseCost × (1 - r^n) / (1 - r) × r^currentOwned
   * 
   * Where r = multiplier, n = quantity to buy
   */
  calculateBulkCost(
    baseCost: string,
    amountOwned: number,
    quantityToBuy: number,
    multiplier: number = this.DEFAULT_MULTIPLIER,
  ): string {
    if (quantityToBuy <= 0) return '0';
    if (quantityToBuy === 1) {
      return this.calculateNextCost(baseCost, amountOwned, multiplier);
    }
    
    const base = parseFloat(baseCost);
    
    // Sum of geometric series: a × (1 - r^n) / (1 - r)
    // Where a = base × r^currentOwned
    const r = multiplier;
    const a = base * Math.pow(r, amountOwned);
    const geometricSum = a * (1 - Math.pow(r, quantityToBuy)) / (1 - r);
    
    // Round to whole number
    return Math.floor(geometricSum).toString();
  }
  
  /**
   * Calculate how many items can be bought with a given budget
   * 
   * Uses inverse of geometric series formula
   */
  calculateMaxPurchasable(
    baseCost: string,
    amountOwned: number,
    budget: string,
    multiplier: number = this.DEFAULT_MULTIPLIER,
  ): { quantity: number; totalCost: string; remaining: string } {
    const budgetNum = parseFloat(budget);
    const base = parseFloat(baseCost);
    const r = multiplier;
    const a = base * Math.pow(r, amountOwned);
    
    if (budgetNum < a) {
      return { quantity: 0, totalCost: '0', remaining: budget };
    }
    
    // Solve for n in: budget = a × (1 - r^n) / (1 - r)
    // budget × (1 - r) = a × (1 - r^n)
    // budget × (1 - r) / a = 1 - r^n
    // r^n = 1 - budget × (1 - r) / a
    // n = log(1 - budget × (1 - r) / a) / log(r)
    
    const inner = 1 - (budgetNum * (1 - r)) / a;
    
    if (inner <= 0) {
      // Can buy "infinite" items with this budget
      // In practice, cap at some reasonable maximum
      const maxQuantity = 1000;
      const totalCost = this.calculateBulkCost(baseCost, amountOwned, maxQuantity, multiplier);
      return {
        quantity: maxQuantity,
        totalCost,
        remaining: (BigInt(budget) - BigInt(totalCost)).toString(),
      };
    }
    
    const n = Math.floor(Math.log(inner) / Math.log(r));
    const quantity = Math.max(0, n);
    const totalCost = this.calculateBulkCost(baseCost, amountOwned, quantity, multiplier);
    const totalCostBigInt = BigInt(totalCost);
    const budgetBigInt = BigInt(budget.split('.')[0]); // Remove decimals
    const remaining = (budgetBigInt - totalCostBigInt).toString();
    
    return { quantity, totalCost, remaining };
  }
  
  /**
   * Get complete cost calculation for an item
   */
  getItemCostCalculation(
    itemSlug: string,
    baseCost: string,
    currentOwned: number,
    costMultiplier: number = this.DEFAULT_MULTIPLIER,
  ): IItemCostCalculation {
    const nextCost = this.calculateNextCost(baseCost, currentOwned, costMultiplier);
    
    return {
      itemSlug,
      baseCost,
      currentOwned,
      costMultiplier,
      nextCost,
      bulkCost: (quantity: number) =>
        this.calculateBulkCost(baseCost, currentOwned, quantity, costMultiplier),
    };
  }
  
  /**
   * Calculate the value (sell price) of items
   * Typically 50% of purchase cost
   */
  calculateSellValue(
    baseCost: string,
    amountOwned: number,
    quantityToSell: number,
    multiplier: number = this.DEFAULT_MULTIPLIER,
    sellRatio: number = 0.5,
  ): string {
    // Calculate what they would have paid for these items
    const startOwned = amountOwned - quantityToSell;
    const purchaseCost = this.calculateBulkCost(
      baseCost,
      startOwned,
      quantityToSell,
      multiplier,
    );
    
    // Apply sell ratio
    const sellValue = Math.floor(parseFloat(purchaseCost) * sellRatio);
    return sellValue.toString();
  }
  
  /**
   * Calculate level-up cost for an item
   * Each level makes the item more effective but costs LoC
   */
  calculateItemLevelUpCost(
    baseCost: string,
    currentLevel: number,
    levelMultiplier: number = 2.0, // Each level costs 2x the previous
  ): string {
    const base = parseFloat(baseCost);
    const cost = base * Math.pow(levelMultiplier, currentLevel);
    return Math.floor(cost).toString();
  }
}
