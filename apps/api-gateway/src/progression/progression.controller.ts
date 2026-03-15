/**
 * Progression Controller
 * HTTP REST proxy for user progression data
 *
 * GET /api/v1/progression/me          - Get current user's progression (requires JWT)
 * GET /api/v1/progression/leaderboard - Get leaderboard data (requires JWT)
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
import { AuthGuard } from '@nestjs/passport';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';

import {
  IApiResponse,
  NATS_SERVICE,
  NatsPattern,
  IProgressionData,
} from '@repo/shared-types';
import { LeaderboardService, RedisKeys } from '@repo/redis-client';
import { PrismaClient } from '@repo/prisma-client';

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
  throw new Error(response.error?.message || 'NATS request failed');
}

@ApiTags('Progression')
@Controller('progression')
export class ProgressionController {
  private readonly logger = new Logger(ProgressionController.name);

  constructor(
    @Inject(NATS_SERVICE.PROGRESSION) private readonly natsClient: ClientProxy,
    private readonly leaderboardService: LeaderboardService,
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
      this.natsClient.send<IApiResponse<IProgressionData>>(NatsPattern.PROGRESSION_GET, {
        userId,
      }),
    );

    // Unwrap IApiResponse envelope if present
    const progression = unwrapNats<IProgressionData>(response);
    return progression;
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
    name: 'type',
    required: false,
    enum: ['GLOBAL', 'WEEKLY', 'DAILY'],
    description: 'Leaderboard type (defaults to GLOBAL)',
  })
  @ApiOkResponse({
    description: 'Leaderboard entries with ranks, scores and usernames',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT' })
  async getLeaderboard(@Query('type') type?: string) {
    const leaderboardType = type || 'GLOBAL';

    this.logger.debug(`Fetching leaderboard directly from Redis: ${leaderboardType}`);

    try {
      // Get data directly from Redis (bypass NATS for speed and reliability)
      const count = 100;
      const key = leaderboardType === 'WEEKLY' ? RedisKeys.LEADERBOARD_WEEKLY 
                : leaderboardType === 'DAILY' ? RedisKeys.LEADERBOARD_DAILY 
                : RedisKeys.LEADERBOARD_GLOBAL;

      const topPlayers = await this.leaderboardService.getTopPlayers(count, key);
      const totalPlayers = await this.leaderboardService.getTotalPlayers(key);

      // Batch-fetch usernames from DB
      const userIds = topPlayers.map(p => p.userId);
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, username: true }
      });
      const usernameMap = new Map(users.map((u: { id: string; username: string }) => [u.id, u.username]));

      const entries = topPlayers.map(p => ({
        ...p,
        username: usernameMap.get(p.userId) ?? `Player_${p.userId.slice(0, 8)}`,
        level: 1, // simplified for now
        prestigeLevel: 0
      }));

      return {
        success: true,
        data: {
          type: leaderboardType,
          entries,
          totalPlayers
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      this.logger.error(`Failed to fetch leaderboard from NATS: ${error.message}`, error.stack);
      return {
        success: false,
        error: {
          code: 'LEADERBOARD_FETCH_FAILED',
          message: 'Could not retrieve leaderboard data',
        },
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

    const result = await firstValueFrom(
      this.natsClient.send(NatsPattern.PROGRESSION_PURCHASE_ITEM, {
        userId,
        itemSlug: data.itemSlug,
      }),
    );

    return result;
  }
}
