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
  ) {}

  /**
   * Get user progression
   * GET /progression/:userId
   */
  @Get(':userId')
  getProgression(
    @Param('userId') userId: string,
  ): IApiResponse<IProgressionData> {
    const data = this.progressionService.getProgression(userId);

    return {
      data,
      success: true,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Purchase an item
   * POST /progression/purchase
   */
  @Post('purchase')
  @HttpCode(HttpStatus.OK)
  purchaseItem(
    @Body() request: IItemPurchaseRequest,
  ): IApiResponse<IItemPurchaseResult> {
    const result = this.progressionService.purchaseItem(request);

    return {
      data: result,
      error: result.error
        ? {
            code: result.error,
            message: `Purchase failed: ${result.error}`,
          }
        : undefined,
      success: result.success,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get available items for a user
   * GET /progression/:userId/items
   */
  @Get(':userId/items')
  getAvailableItems(@Param('userId') userId: string): {
    success: boolean;
    data: {
      item: {
        slug: string;
        name: string;
        baseCost: string;
        costMultiplier: number;
        baseEffect: number;
        effectType: string;
        unlockLevel: number;
      };
      owned: number;
      nextCost: string;
      canAfford: boolean;
    }[];
    timestamp: string;
  } {
    const items = this.progressionService.getAvailableItems(userId);

    return {
      data: items.map((i) => ({
        canAfford: i.canAfford,
        item: {
          baseCost: i.item.baseCost,
          baseEffect: i.item.baseEffect,
          costMultiplier: i.item.costMultiplier,
          effectType: i.item.effectType,
          name: i.item.name,
          slug: i.item.slug,
          unlockLevel: i.item.unlockLevel,
        },
        nextCost: i.nextCost,
        owned: i.owned,
      })),
      success: true,
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
    @Body()
    body: {
      baseCost: string;
      amountOwned: number;
      quantity?: number;
      multiplier?: number;
    },
  ) {
    const { amountOwned, baseCost, multiplier, quantity = 1 } = body;

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
  async getLeaderboard(@Param('type') type: string) {
    const leaderboardType = type.toUpperCase() as LeaderboardType;
    const entries = await this.leaderboardSync.getLeaderboard(leaderboardType);

    return {
      data: {
        entries,
        type: leaderboardType,
      },
      success: true,
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
      data: ranks,
      success: true,
      timestamp: new Date().toISOString(),
    };
  }
}
