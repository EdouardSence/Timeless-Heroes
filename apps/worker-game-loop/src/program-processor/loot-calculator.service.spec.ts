import { LootCalculatorService } from './loot-calculator.service';

describe('LootCalculatorService', () => {
  let service: LootCalculatorService;
  let randomSpy: jest.SpyInstance;

  beforeEach(() => {
    service = new LootCalculatorService();
    randomSpy = jest.spyOn(Math, 'random');
  });

  afterEach(() => {
    randomSpy.mockRestore();
  });

  describe('rollLoot', () => {
    it('should drop items when roll is below drop rate', () => {
      randomSpy.mockReturnValue(0.1); // Will pass any dropRate > 0.1

      const lootTable = [
        {
          dropRate: 0.5,
          itemSlug: 'gold-coin',
          maxQuantity: 1,
          minQuantity: 1,
        },
      ];

      const drops = service.rollLoot(lootTable);
      expect(drops).toHaveLength(1);
      expect(drops[0]!.itemSlug).toBe('gold-coin');
    });

    it('should not drop items when roll exceeds drop rate', () => {
      randomSpy.mockReturnValue(0.8); // Will fail any dropRate < 0.8

      const lootTable = [
        { dropRate: 0.1, itemSlug: 'rare-gem', maxQuantity: 1, minQuantity: 1 },
      ];

      const drops = service.rollLoot(lootTable);
      expect(drops).toHaveLength(0);
    });

    it('should drop items when roll exactly equals drop rate', () => {
      randomSpy.mockReturnValue(0.5);

      const lootTable = [
        { dropRate: 0.5, itemSlug: 'sword', maxQuantity: 1, minQuantity: 1 },
      ];

      const drops = service.rollLoot(lootTable);
      expect(drops).toHaveLength(1);
    });

    it('should roll each entry independently', () => {
      let callCount = 0;
      randomSpy.mockImplementation(() => {
        callCount++;
        // First roll (drop check for item-a): 0.1 (passes 0.5 rate)
        // Second roll (drop check for item-b): 0.9 (fails 0.5 rate)
        // Note: rollQuantity is skipped when min === max
        return callCount === 1 ? 0.1 : 0.9;
      });

      const lootTable = [
        { dropRate: 0.5, itemSlug: 'item-a', maxQuantity: 1, minQuantity: 1 },
        { dropRate: 0.5, itemSlug: 'item-b', maxQuantity: 1, minQuantity: 1 },
      ];

      const drops = service.rollLoot(lootTable);
      expect(drops).toHaveLength(1);
      expect(drops[0]!.itemSlug).toBe('item-a');
    });

    it('should calculate quantity within min/max range', () => {
      let callCount = 0;
      randomSpy.mockImplementation(() => {
        callCount++;
        // First call: drop check (0.1 passes 1.0 rate)
        // Second call: quantity roll (0.5 for range [1, 10] => floor(0.5 * 10) + 1 = 6)
        return callCount === 1 ? 0.1 : 0.5;
      });

      const lootTable = [
        { dropRate: 1, itemSlug: 'gold', maxQuantity: 10, minQuantity: 1 },
      ];

      const drops = service.rollLoot(lootTable);
      expect(drops).toHaveLength(1);
      expect(drops[0]!.quantity).toBeGreaterThanOrEqual(1);
      expect(drops[0]!.quantity).toBeLessThanOrEqual(10);
    });

    it('should return exact quantity when min equals max', () => {
      randomSpy.mockReturnValue(0); // Guarantees drop

      const lootTable = [
        {
          dropRate: 1,
          itemSlug: 'fixed-item',
          maxQuantity: 5,
          minQuantity: 5,
        },
      ];

      const drops = service.rollLoot(lootTable);
      expect(drops).toHaveLength(1);
      expect(drops[0]!.quantity).toBe(5);
    });

    it('should return empty array for empty loot table', () => {
      const drops = service.rollLoot([]);
      expect(drops).toEqual([]);
    });

    it('should always drop items with 1.0 drop rate when random is 0.0', () => {
      randomSpy.mockReturnValue(0);

      const lootTable = [
        {
          dropRate: 1,
          itemSlug: 'guaranteed',
          maxQuantity: 1,
          minQuantity: 1,
        },
      ];

      const drops = service.rollLoot(lootTable);
      expect(drops).toHaveLength(1);
    });

    it('should not drop items with very low rate when random is 0.999', () => {
      randomSpy.mockReturnValue(0.999);

      const lootTable = [
        {
          dropRate: 0.01,
          itemSlug: 'legendary',
          maxQuantity: 1,
          minQuantity: 1,
        },
      ];

      const drops = service.rollLoot(lootTable);
      expect(drops).toHaveLength(0);
    });
  });

  describe('calculateEffectiveDropRate', () => {
    it('should add luck bonus to base rate', () => {
      const result = service.calculateEffectiveDropRate(0.3, 0.2);
      expect(result).toBeCloseTo(0.5);
    });

    it('should cap at 1.0 (100%)', () => {
      const result = service.calculateEffectiveDropRate(0.8, 0.5);
      expect(result).toBe(1);
    });

    it('should return base rate when no luck bonus', () => {
      const result = service.calculateEffectiveDropRate(0.3);
      expect(result).toBeCloseTo(0.3);
    });

    it('should return 1.0 when luck bonus fully covers remainder', () => {
      const result = service.calculateEffectiveDropRate(0.5, 0.5);
      expect(result).toBe(1);
    });

    it('should handle zero base rate with luck bonus', () => {
      const result = service.calculateEffectiveDropRate(0, 0.25);
      expect(result).toBeCloseTo(0.25);
    });
  });

  describe('rollCriticalLoot', () => {
    it('should double all quantities on critical roll', () => {
      randomSpy.mockReturnValue(0.01); // Below 0.05 crit chance

      const baseLoot = [
        { itemSlug: 'gold', quantity: 10 },
        { itemSlug: 'gem', quantity: 3 },
      ];

      const result = service.rollCriticalLoot(baseLoot);
      expect(result[0]!.quantity).toBe(20);
      expect(result[1]!.quantity).toBe(6);
    });

    it('should return original loot when crit does not proc', () => {
      randomSpy.mockReturnValue(0.5); // Above 0.05 crit chance

      const baseLoot = [{ itemSlug: 'gold', quantity: 10 }];

      const result = service.rollCriticalLoot(baseLoot);
      expect(result[0]!.quantity).toBe(10);
    });

    it('should use custom crit chance', () => {
      randomSpy.mockReturnValue(0.4); // Above 0.05 but below 0.5

      const baseLoot = [{ itemSlug: 'gold', quantity: 5 }];

      const result = service.rollCriticalLoot(baseLoot, 0.5);
      expect(result[0]!.quantity).toBe(10); // Doubled
    });

    it('should not modify the original array', () => {
      randomSpy.mockReturnValue(0.01); // Crit proc

      const baseLoot = [{ itemSlug: 'gold', quantity: 5 }];
      const result = service.rollCriticalLoot(baseLoot);

      expect(baseLoot[0]!.quantity).toBe(5); // Original unchanged
      expect(result[0]!.quantity).toBe(10); // New array has doubled
    });
  });

  describe('consolidateLoot', () => {
    it('should combine drops of the same item', () => {
      const drops = [
        { itemSlug: 'gold', quantity: 10 },
        { itemSlug: 'gold', quantity: 5 },
      ];

      const result = service.consolidateLoot(drops);
      expect(result).toHaveLength(1);
      expect(result[0]!.itemSlug).toBe('gold');
      expect(result[0]!.quantity).toBe(15);
    });

    it('should keep different items separate', () => {
      const drops = [
        { itemSlug: 'gold', quantity: 10 },
        { itemSlug: 'gem', quantity: 3 },
      ];

      const result = service.consolidateLoot(drops);
      expect(result).toHaveLength(2);
    });

    it('should handle empty drops array', () => {
      const result = service.consolidateLoot([]);
      expect(result).toEqual([]);
    });

    it('should consolidate multiple duplicates', () => {
      const drops = [
        { itemSlug: 'gold', quantity: 1 },
        { itemSlug: 'gem', quantity: 2 },
        { itemSlug: 'gold', quantity: 3 },
        { itemSlug: 'gem', quantity: 4 },
        { itemSlug: 'gold', quantity: 5 },
      ];

      const result = service.consolidateLoot(drops);
      expect(result).toHaveLength(2);

      const gold = result.find((d) => d.itemSlug === 'gold');
      const gem = result.find((d) => d.itemSlug === 'gem');
      expect(gold!.quantity).toBe(9);
      expect(gem!.quantity).toBe(6);
    });

    it('should handle single drop without changes', () => {
      const drops = [{ itemSlug: 'sword', quantity: 1 }];
      const result = service.consolidateLoot(drops);
      expect(result).toHaveLength(1);
      expect(result[0]!.quantity).toBe(1);
    });
  });
});
