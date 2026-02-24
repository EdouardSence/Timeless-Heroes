/**
 * Progression Controller
 * REST API endpoints for user progression
 */

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
} from '@nestjs/common';

import {
  IApiResponse,
  IItemPurchaseRequest,
  IItemPurchaseResult,
  IProgressionData,
  LeaderboardType,
} from '@repo/shared-types';
import { ItemCostCalculatorService } from '../services/item-cost-calculator.service';
import { LeaderboardSyncService } from '../services/leaderboard-sync.service';
import { ProgressionService } from '../services/progression.service';

@Controller('progression')
export class ProgressionController {
  private readonly logger = new Logger(ProgressionController.name);

  constructor(
    private readonly progressionService: ProgressionService,
    private readonly costCalculator: ItemCostCalculatorService,
    private readonly leaderboardSync: LeaderboardSyncService,
  ) { }

  /**
   * Get user progression
   * GET /progression/:userId
   */
  @Get(':userId')
  async getProgression(
    @Param('userId') userId: string,
  ): Promise<IApiResponse<IProgressionData>> {
    const data = await this.progressionService.getProgression(userId);

    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Add currency to a user
   * POST /progression/:userId/add-currency
   */
  @Post(':userId/add-currency')
  @HttpCode(HttpStatus.OK)
  async addCurrency(
    @Param('userId') userId: string,
    @Body() body: { amount: string },
  ): Promise<IApiResponse<IProgressionData>> {
    const delta = body.amount;
    const parsed = BigInt(delta);
    if (parsed <= 0n) {
      return {
        success: false,
        error: { code: 'INVALID_AMOUNT', message: 'Amount must be greater than 0' },
        timestamp: new Date().toISOString(),
      };
    }
    const data = await this.progressionService.updateBalance(userId, delta);

    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Purchase an item
   * POST /progression/purchase
   */
  @Post('purchase')
  @HttpCode(HttpStatus.OK)
  async purchaseItem(
    @Body() request: IItemPurchaseRequest,
  ): Promise<IApiResponse<IItemPurchaseResult>> {
    const result = await this.progressionService.purchaseItem(request);

    return {
      success: result.success,
      data: result,
      error: result.error ? {
        code: result.error,
        message: `Purchase failed: ${result.error}`,
      } : undefined,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get available items for a user
   * GET /progression/:userId/items
   */
  @Get(':userId/items')
  async getAvailableItems(@Param('userId') userId: string): Promise<{
    success: boolean;
    data: Array<{
      item: { slug: string; name: string; baseCost: string; costMultiplier: number; baseEffect: number; effectType: string; unlockLevel: number };
      owned: number;
      nextCost: string;
      canAfford: boolean;
    }>;
    timestamp: string;
  }> {
    const items = this.progressionService.getAvailableItems(userId);

    return {
      success: true,
      data: items.map(i => ({
        item: {
          slug: i.item.slug,
          name: i.item.name,
          baseCost: i.item.baseCost,
          costMultiplier: i.item.costMultiplier,
          baseEffect: i.item.baseEffect,
          effectType: i.item.effectType,
          unlockLevel: i.item.unlockLevel,
        },
        owned: i.owned,
        nextCost: i.nextCost,
        canAfford: i.canAfford,
      })),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Calculate item cost
   * POST /progression/calculate-cost
   */
  @Post('calculate-cost')
  @HttpCode(HttpStatus.OK)
  calculateCost(
    @Body() body: {
      baseCost: string;
      amountOwned: number;
      quantity?: number;
      multiplier?: number;
    },
  ) {
    const { baseCost, amountOwned, quantity = 1, multiplier } = body;

    if (quantity === 1) {
      const cost = this.costCalculator.calculateNextCost(
        baseCost,
        amountOwned,
        multiplier,
      );
      return { cost, quantity: 1 };
    }

    const cost = this.costCalculator.calculateBulkCost(
      baseCost,
      amountOwned,
      quantity,
      multiplier,
    );

    return { cost, quantity };
  }

  /**
   * Get leaderboard
   * GET /progression/leaderboard/:type
   */
  @Get('leaderboard/:type')
  async getLeaderboard(
    @Param('type') type: string,
  ) {
    const leaderboardType = (type.toUpperCase() as LeaderboardType) || LeaderboardType.GLOBAL;
    const entries = await this.leaderboardSync.getLeaderboard(leaderboardType);

    return {
      success: true,
      data: {
        type: leaderboardType,
        entries,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get user's ranks across leaderboards
   * GET /progression/:userId/ranks
   */
  @Get(':userId/ranks')
  async getUserRanks(@Param('userId') userId: string) {
    const ranks = await this.leaderboardSync.getUserRanks(userId);

    return {
      success: true,
      data: ranks,
      timestamp: new Date().toISOString(),
    };
  }
}
