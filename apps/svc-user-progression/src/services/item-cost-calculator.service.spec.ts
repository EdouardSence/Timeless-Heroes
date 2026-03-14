import { ItemCostCalculatorService } from './item-cost-calculator.service';

describe('ItemCostCalculatorService', () => {
  let service: ItemCostCalculatorService;

  beforeEach(() => {
    service = new ItemCostCalculatorService();
  });

  describe('calculateNextCost', () => {
    it('should return the base cost when amountOwned is 0', () => {
      const result = service.calculateNextCost('100', 0);
      expect(result).toBe('100');
    });

    it('should apply the default 1.15 multiplier for each owned item', () => {
      // baseCost=100, amountOwned=1 => 100 * 1.15^1 = 115
      const result = service.calculateNextCost('100', 1);
      expect(result).toBe('115');
    });

    it('should compound the multiplier for higher quantities', () => {
      // baseCost=100, amountOwned=5 => 100 * 1.15^5 = 100 * 2.0113... = 201
      const result = service.calculateNextCost('100', 5);
      expect(Number(result)).toBeGreaterThanOrEqual(201);
      expect(Number(result)).toBeLessThanOrEqual(202);
    });

    it('should use a custom multiplier when provided', () => {
      // baseCost=100, amountOwned=2, multiplier=2.0 => 100 * 2^2 = 400
      const result = service.calculateNextCost('100', 2, 2.0);
      expect(result).toBe('400');
    });

    it('should handle large base costs with BigInt precision', () => {
      // Test with a number larger than Number.MAX_SAFE_INTEGER
      const result = service.calculateNextCost('10000000000000000', 0);
      expect(result).toBe('10000000000000000');
    });

    it('should scale exponentially for many items owned', () => {
      // baseCost=10, amountOwned=50 => 10 * 1.15^50 which is ~10838
      const result = service.calculateNextCost('10', 50);
      const value = Number(result);
      expect(value).toBeGreaterThan(10000);
      expect(value).toBeLessThan(11000);
    });

    it('should return base cost with multiplier of 1.0', () => {
      const result = service.calculateNextCost('500', 10, 1.0);
      expect(result).toBe('500');
    });
  });

  describe('calculateBulkCost', () => {
    it('should return "0" when quantityToBuy is 0', () => {
      const result = service.calculateBulkCost('100', 0, 0);
      expect(result).toBe('0');
    });

    it('should return "0" when quantityToBuy is negative', () => {
      const result = service.calculateBulkCost('100', 0, -5);
      expect(result).toBe('0');
    });

    it('should equal calculateNextCost when buying 1 item', () => {
      const singleCost = service.calculateNextCost('100', 3);
      const bulkCost = service.calculateBulkCost('100', 3, 1);
      expect(bulkCost).toBe(singleCost);
    });

    it('should calculate the sum of costs for multiple items', () => {
      // Buying 2 items starting from 0 owned:
      // Uses geometric series: baseCost * (1 - r^n) / (1 - r) * r^currentOwned
      // = 100 * (1 - 1.15^2) / (1 - 1.15) = 100 * (1 - 1.3225) / (-0.15)
      // = 100 * (-0.3225) / (-0.15) = 215.0 -> floor = 214 or 215
      const result = service.calculateBulkCost('100', 0, 2);
      const value = Number(result);
      expect(value).toBeGreaterThanOrEqual(214);
      expect(value).toBeLessThanOrEqual(215);
    });

    it('should account for current ownership in bulk cost', () => {
      // Buying 2 items when already owning 5:
      // Item at position 5: 100 * 1.15^5 = ~201
      // Item at position 6: 100 * 1.15^6 = ~231
      // Total = ~432
      const result = service.calculateBulkCost('100', 5, 2);
      const value = Number(result);
      expect(value).toBeGreaterThanOrEqual(430);
      expect(value).toBeLessThanOrEqual(435);
    });

    it('should handle buying many items at once', () => {
      const result = service.calculateBulkCost('10', 0, 10);
      const value = Number(result);
      // Sum of geometric series: 10 * (1 - 1.15^10) / (1 - 1.15) = ~203
      expect(value).toBeGreaterThan(200);
      expect(value).toBeLessThan(210);
    });
  });

  describe('calculateMaxPurchasable', () => {
    it('should return 0 items when budget is less than next item cost', () => {
      const result = service.calculateMaxPurchasable('100', 0, '50');
      expect(result.quantity).toBe(0);
      expect(result.remaining).toBe('50');
      expect(result.totalCost).toBe('0');
    });

    it('should calculate how many items a budget can buy', () => {
      // With budget 300 and base cost 100:
      // Item 1: 100 * 1.15^0 = 100, running=100
      // Item 2: 100 * 1.15^1 = 115, running=215
      // Item 3: 100 * 1.15^2 = ~132, running=~347 > 300
      // So we can buy 2 items
      const result = service.calculateMaxPurchasable('100', 0, '300');
      expect(result.quantity).toBe(2);
    });

    it('should compute remaining budget after purchase', () => {
      const result = service.calculateMaxPurchasable('100', 0, '300');
      // Bought 2 items, remaining should be 300 minus bulk cost
      const remaining = Number(result.remaining);
      expect(remaining).toBeGreaterThanOrEqual(85);
      expect(remaining).toBeLessThanOrEqual(86);
    });
  });

  describe('getItemCostCalculation', () => {
    it('should return the full cost breakdown for an item', () => {
      const result = service.getItemCostCalculation('test-item', '100', 0);
      expect(result.itemSlug).toBe('test-item');
      expect(result.baseCost).toBe('100');
      expect(result.currentOwned).toBe(0);
      expect(result.costMultiplier).toBe(1.15);
      expect(result.nextCost).toBe('100');
    });

    it('should include a working bulkCost function', () => {
      const result = service.getItemCostCalculation('test-item', '100', 0);
      const bulk2 = result.bulkCost(2);
      // Should match the direct calculateBulkCost result
      const expected = service.calculateBulkCost('100', 0, 2);
      expect(bulk2).toBe(expected);
    });

    it('should use custom multiplier in calculations', () => {
      const result = service.getItemCostCalculation('test-item', '100', 0, 2.0);
      expect(result.costMultiplier).toBe(2.0);
      expect(result.nextCost).toBe('100'); // 100 * 2^0 = 100
      expect(result.bulkCost(2)).toBe('300'); // 100 + 200 = 300
    });

    it('should reflect current ownership in nextCost', () => {
      const result = service.getItemCostCalculation('test-item', '100', 5);
      const expectedNext = service.calculateNextCost('100', 5);
      expect(result.nextCost).toBe(expectedNext);
    });
  });

  describe('calculateSellValue', () => {
    it('should return 50% of purchase cost by default', () => {
      // If you own 2 and sell 2, sell value = 50% of bulk cost for first 2
      // Bulk cost for 2 from 0: 100 + 115 = 215
      // Sell value: floor(215 * 0.5) = 107
      const result = service.calculateSellValue('100', 2, 2);
      expect(result).toBe('107');
    });

    it('should apply custom sell ratio', () => {
      // Sell 1 item when owning 1: purchase cost was 100
      // Sell value at 75%: floor(100 * 0.75) = 75
      const result = service.calculateSellValue('100', 1, 1, 1.15, 0.75);
      expect(result).toBe('75');
    });

    it('should return "0" when selling 0 items', () => {
      const result = service.calculateSellValue('100', 5, 0);
      expect(result).toBe('0');
    });
  });

  describe('calculateItemLevelUpCost', () => {
    it('should return baseCost at level 0', () => {
      const result = service.calculateItemLevelUpCost('100', 0);
      expect(result).toBe('100');
    });

    it('should double each level with default multiplier', () => {
      expect(service.calculateItemLevelUpCost('100', 1)).toBe('200');
      expect(service.calculateItemLevelUpCost('100', 2)).toBe('400');
      expect(service.calculateItemLevelUpCost('100', 3)).toBe('800');
    });

    it('should apply custom level multiplier', () => {
      // baseCost=100, level=2, multiplier=3 => 100 * 3^2 = 900
      const result = service.calculateItemLevelUpCost('100', 2, 3);
      expect(result).toBe('900');
    });
  });
});
