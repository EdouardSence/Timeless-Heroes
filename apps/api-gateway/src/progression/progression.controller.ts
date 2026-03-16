/**
 * Progression Controller
 * HTTP REST proxy for user progression data
 *
 * GET  /api/v1/progression/me          - Get current user's progression (requires JWT)
 * GET  /api/v1/progression/shop        - Get shop item catalog (requires JWT)
 * GET  /api/v1/progression/leaderboard - Get leaderboard data (requires JWT)
 * POST /api/v1/progression/purchase    - Purchase an item (requires JWT)
 *
 * Delegates to svc-user-progression via NATS.
 */

import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PrismaClient } from '@repo/prisma-client';
import { LeaderboardService, RedisKeys } from '@repo/redis-client';
import {
  IApiResponse,
  NATS_SERVICE,
  NatsPattern,
  IProgressionData,
  SHOP_ITEMS,
} from '@repo/shared-types';
import { firstValueFrom } from 'rxjs';

import { ClickProcessorService } from '../click-processor/click-processor.service';

const prisma = new PrismaClient();

interface IAuthenticatedRequest {
  user: {
    userId: string;
    email: string;
    username: string;
  };
}

// Helper function to unwrap NATS responses
function unwrapNats<T>(response: IApiResponse<T>): T {
  if (response.success) {
    return response.data as T;
  }
  throw new Error(response.error?.message ?? 'NATS request failed');
}

@ApiTags('Progression')
@Controller('progression')
export class ProgressionController {
  private readonly logger = new Logger(ProgressionController.name);

  constructor(
    @Inject(NATS_SERVICE.PROGRESSION) private readonly natsClient: ClientProxy,
    private readonly leaderboardService: LeaderboardService,
    private readonly clickProcessor: ClickProcessorService,
  ) {}

  /**
   * GET /api/v1/progression/me
   * Returns the authenticated user's full progression data
   */
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get current player progression' })
  @ApiOkResponse({
    description: 'Player progression data (level, LoC, multipliers, etc.)',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT' })
  async getMyProgression(
    @Request() req: IAuthenticatedRequest,
  ): Promise<IProgressionData> {
    const { userId } = req.user;

    this.logger.debug(`Fetching progression for user ${userId}`);

    const response = await firstValueFrom(
      this.natsClient.send<IApiResponse<IProgressionData>>(
        NatsPattern.PROGRESSION_GET,
        {
          userId,
        },
      ),
    );

    // Unwrap IApiResponse envelope if present
    const progression = unwrapNats<IProgressionData>(response);
    return progression;
  }

  /**
   * GET /api/v1/progression/shop
   * Returns the shop catalog (all items with their cost, effect, and unlock requirements)
   */
  @Get('shop')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get shop catalog' })
  @ApiOkResponse({ description: 'List of all purchasable items' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT' })
  getShopCatalog() {
    return {
      data: SHOP_ITEMS,
      success: true,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * GET /api/v1/progression/leaderboard?type=GLOBAL
   * Returns the leaderboard data (TD-03: used by desktop app)
   */
  @Get('leaderboard')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get leaderboard rankings' })
  @ApiQuery({
    description: 'Leaderboard type (defaults to GLOBAL)',
    enum: ['GLOBAL', 'WEEKLY', 'DAILY'],
    name: 'type',
    required: false,
  })
  @ApiOkResponse({
    description: 'Leaderboard entries with ranks, scores and usernames',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT' })
  async getLeaderboard(@Query('type') leaderboardType = 'GLOBAL') {
    this.logger.debug(
      `Fetching leaderboard directly from Redis: ${leaderboardType}`,
    );

    try {
      // Get data directly from Redis (bypass NATS for speed and reliability)
      const count = 100;
      let key: string = RedisKeys.LEADERBOARD_GLOBAL;
      if (leaderboardType === 'WEEKLY') {
        key = RedisKeys.LEADERBOARD_WEEKLY;
      } else if (leaderboardType === 'DAILY') {
        key = RedisKeys.LEADERBOARD_DAILY;
      }

      const topPlayers = await this.leaderboardService.getTopPlayers(
        count,
        key,
      );
      const totalPlayers = await this.leaderboardService.getTotalPlayers(key);

      // Batch-fetch usernames and prestige levels from DB
      const userIds = topPlayers.map((p) => p.userId);
      const users = await prisma.user.findMany({
        select: { id: true, username: true },
        where: { id: { in: userIds } },
      });
      const usernameMap = new Map(
        users.map((u: { id: string; username: string }) => [u.id, u.username]),
      );

      // Batch-fetch prestige levels
      const progressions = await prisma.progression.findMany({
        select: { prestigeLevel: true, userId: true },
        where: { userId: { in: userIds } },
      });
      const prestigeMap = new Map(
        progressions.map((p: { userId: string; prestigeLevel: number }) => [p.userId, p.prestigeLevel]),
      );

      const entries = topPlayers.map((p) => ({
        ...p,
        level: 1, // simplified for now
        prestigeLevel: prestigeMap.get(p.userId) ?? 0,
        username: usernameMap.get(p.userId) ?? `Player_${p.userId.slice(0, 8)}`,
      }));

      return {
        data: {
          entries,
          totalPlayers,
          type: leaderboardType,
        },
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error: unknown) {
      this.logger.error(
        `Failed to fetch leaderboard from NATS: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      return {
        error: {
          code: 'LEADERBOARD_FETCH_FAILED',
          message: 'Could not retrieve leaderboard data',
        },
        success: false,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * POST /api/v1/progression/purchase
   * Purchase an item for the authenticated user
   */
  @Post('purchase')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Purchase an item' })
  async handlePurchaseItem(
    @Request() req: IAuthenticatedRequest,
    @Body() data: { itemSlug: string },
  ) {
    const { userId } = req.user;

    this.logger.log(`User ${userId} purchasing item: ${data.itemSlug}`);

    const result: unknown = await firstValueFrom(
      this.natsClient.send(NatsPattern.PROGRESSION_PURCHASE_ITEM, {
        itemSlug: data.itemSlug,
        userId,
      }),
    );

    // Invalidate the progression cache so next request gets fresh multipliers
    // This is critical: without this, the old clickMultiplier stays cached for up to 5s
    // and keys processed in that window would use the pre-purchase multiplier.
    try {
      await this.clickProcessor.invalidateCache(userId);
      this.logger.debug(
        `Invalidated progression cache for ${userId} after purchase`,
      );
    } catch (error) {
      this.logger.warn(
        `Failed to invalidate cache for ${userId}: ${String(error)}`,
      );
    }

    return result as Record<string, unknown>;
  }

  /**
   * POST /api/v1/progression/prestige
   * Prestige the authenticated user — resets progress, gains permanent multiplier
   */
  @Post('prestige')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Prestige — reset progress for permanent multiplier' })
  async handlePrestige(@Request() req: IAuthenticatedRequest) {
    const { userId } = req.user;

    this.logger.log(`User ${userId} requesting prestige`);

    const result: Record<string, unknown> = await firstValueFrom(
      this.natsClient.send(NatsPattern.PROGRESSION_PRESTIGE, { userId }),
    );

    // Invalidate cache so multipliers are refreshed
    try {
      await this.clickProcessor.invalidateCache(userId);
    } catch (error) {
      this.logger.warn(
        `Failed to invalidate cache for ${userId}: ${String(error)}`,
      );
    }

    return result;
  }
}
