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
  Controller,
  Get,
  Inject,
  Logger,
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
  NATS_SERVICE,
  NatsPattern,
  IProgressionData,
} from '@repo/shared-types';

interface IAuthenticatedRequest {
  user: {
    userId: string;
    email: string;
    username: string;
  };
}

@ApiTags('Progression')
@Controller('progression')
export class ProgressionController {
  private readonly logger = new Logger(ProgressionController.name);

  constructor(
    @Inject(NATS_SERVICE.PROGRESSION)
    private readonly natsClient: ClientProxy,
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

    const progression = await firstValueFrom(
      this.natsClient.send<IProgressionData>(NatsPattern.PROGRESSION_GET, {
        userId,
      }),
    );

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

    this.logger.debug(`Fetching leaderboard: ${leaderboardType}`);

    const result = await firstValueFrom(
      this.natsClient.send(NatsPattern.PROGRESSION_GET_LEADERBOARD, {
        type: leaderboardType,
      }),
    );

    return result;
  }
}
