
import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@repo/prisma-client';
// If ClickProcessor is in another module, we might need to use a public API or shared lib. 
// For now, I'll assume it's available or I'll recalculate locally.

@Injectable()
export class ShopService {
  private readonly logger = new Logger(ShopService.name);

  constructor(
    @Inject('PRISMA_CLIENT') private readonly prisma: PrismaClient,
    // safe to assume we might need to invalidate cache
  ) {}

  /**
   * Get all items with their current cost for a specific user
   */
  async getShopItems(userId: string) {
    // 1. Fetch available items
    const items = await this.prisma.item.findMany({
      orderBy: { baseCost: 'asc' },
    });

    // 2. Fetch user's owned items
    const ownedItems = await this.prisma.ownedItem.findMany({
      where: { userId },
    });

    // 3. Map to DTO with calculated cost
    const ownedMap = new Map<string, number>(
      ownedItems.map((oi) => [oi.itemId, oi.quantity]),
    );

    return items.map((item) => {
      const ownedCount = ownedMap.get(item.id) || 0;
      const currentCost = this.calculateCost(item.baseCost as unknown as number, ownedCount, item.costMultiplier);

      return {
        ...item,
        baseCost: Number(item.baseCost), // Convert Decimal to number for JSON
        currentCost,
        ownedCount,
        canAfford: false, // This would be calculated in frontend or if we fetch user balance
      };
    });
  }

  /**
   * Purchase an item
   */
  async purchaseItem(userId: string, itemSlug: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Get Item
      const item = await tx.item.findUnique({
        where: { slug: itemSlug },
      });

      if (!item) {
        throw new NotFoundException(`Item '${itemSlug}' not found`);
      }

      // 2. Get User Progression (Balance)
      const progression = await tx.progression.findUnique({
        where: { userId },
      });

      if (!progression) {
        throw new BadRequestException('User progression not found');
      }

      // 3. Get Owned Count
      const ownedItem = await tx.ownedItem.findUnique({
        where: {
          userId_itemId: {
            userId,
            itemId: item.id,
          },
        },
      });

      const ownedCount = ownedItem ? ownedItem.quantity : 0;

      // 4. Calculate Cost
      const cost = this.calculateCost(Number(item.baseCost), ownedCount, item.costMultiplier);
      const balance = Number(progression.linesOfCode);

      if (balance < cost) {
        throw new BadRequestException(`Insufficient funds. Cost: ${cost}, Balance: ${balance}`);
      }

      // 5. Deduct Balance
      await tx.progression.update({
        where: { userId },
        data: {
          linesOfCode: {
            decrement: cost,
          },
        },
      });

      // 6. Update/Create OwnedItem
      const updatedOwnedItem = await tx.ownedItem.upsert({
        where: {
          userId_itemId: {
            userId,
            itemId: item.id,
          },
        },
        create: {
          userId,
          itemId: item.id,
          quantity: 1,
        },
        update: {
          quantity: {
            increment: 1,
          },
        },
      });

      // 7. Apply Item Effects (Recalculate Multipliers)
      // This is critical: Update the user's permanent multipliers based on new inventory
      await this.recalculateUserStats(tx, userId);

      this.logger.log(`User ${userId} purchased ${item.name} for ${cost} LoC`);

      return {
        success: true,
        item: item,
        newBalance: balance - cost,
        ownedCount: updatedOwnedItem.quantity,
      };
    });
  }

  /**
   * Recalculate user stats based on all owned items
   * This ensures consistency
   */
  private async recalculateUserStats(tx: any, userId: string) {
    // Fetch all owned items with their definition
    const inventory = await tx.ownedItem.findMany({
      where: { userId },
      include: { item: true },
    });

    let clickMultiplier = 1.0;
    let passiveMultiplier = 0.0;
    let criticalChance = 0.05;
    let criticalMultiplier = 2.0;

    // Sum up effects
    for (const entry of inventory) {
      const qty = entry.quantity;
      const effect = entry.item.baseEffect;
      
      switch (entry.item.effectType) {
        case 'CLICK_BONUS':
          // Additive bonus per item? Or Multiplier?
          // Assuming baseEffect is flat value added to base click, OR a multiplier addition
          // Based on schema 'clickMultiplier', we likely want to increase the multiplier
          clickMultiplier += effect * qty; 
          break;
        case 'CLICK_MULTIPLIER':
          // Multiplicative stacking?
           clickMultiplier *= Math.pow(effect, qty);
          break;
        case 'PASSIVE_BONUS':
          passiveMultiplier += effect * qty;
          break;
        case 'PASSIVE_MULTIPLIER':
          passiveMultiplier *= Math.pow(effect, qty);
          break;
        case 'CRIT_CHANCE':
          criticalChance += effect * qty;
          break;
        case 'CRIT_MULTIPLIER':
          criticalMultiplier += effect * qty;
          break;
      }
    }

    // Update Progression
    await tx.progression.update({
      where: { userId },
      data: {
        clickMultiplier,
        passiveMultiplier,
        criticalChance,
        criticalMultiplier,
      },
    });
  }

  private calculateCost(baseCost: number, owned: number, multiplier: number): number {
    return Math.floor(baseCost * Math.pow(multiplier, owned));
  }
}
