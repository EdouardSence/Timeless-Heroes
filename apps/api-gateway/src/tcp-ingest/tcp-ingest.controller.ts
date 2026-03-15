/**
 * Ingest Controller (HTTP REST)
 * Handles incoming HTTP requests from the keylogger agent
 *
 * Endpoints:
 * - POST /ingest/auth    - Authenticate session (JWT)
 * - POST /ingest/key     - Key press event (anonymized)
 * - POST /ingest/passive - Passive income batch (desktop idle earnings)
 * - GET  /ingest/ping    - Keep-alive / health check
 */

import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';

import { IngestAuthGuard } from './tcp-auth.guard';
import { TcpIngestService } from './tcp-ingest.service';
import {
  ITcpAuthRequest,
  ITcpAuthResponse,
  ITcpKeyPressEvent,
  KeyCategory,
} from './tcp-ingest.types';

class IngestAuthDto {
  @ApiProperty({
    description: 'JWT token from desktop login',
    example: 'eyJhbG...',
  })
  token!: string;
}

class IngestKeyDto {
  @ApiProperty({ description: 'Authenticated user ID' })
  userId!: string;

  @ApiProperty({
    description: 'Anonymised key category',
    enum: [
      'CHAR',
      'MODIFIER',
      'FUNCTION',
      'NAVIGATION',
      'ENTER',
      'SPACE',
      'BACKSPACE',
      'TAB',
      'UNKNOWN',
    ],
  })
  keyCategory!: string;

  @ApiProperty({ description: 'Unix timestamp (ms)' })
  timestamp!: number;
}

@ApiTags('Ingest')
@Controller('ingest')
export class TcpIngestController {
  private readonly logger = new Logger(TcpIngestController.name);

  constructor(private readonly tcpIngestService: TcpIngestService) {}

  /**
   * Handle authentication request from keylogger
   * POST /api/v1/ingest/auth
   */
  @Post('auth')
  @ApiOperation({ summary: 'Authenticate a desktop keylogger session' })
  @ApiOkResponse({
    description: 'Session authenticated, returns sessionId and userId',
  })
  async handleAuth(@Body() data: ITcpAuthRequest): Promise<ITcpAuthResponse> {
    this.logger.debug('Received auth request');

    const result = await this.tcpIngestService.authenticateClient(data.token);

    if (result.success) {
      this.logger.log(`Client authenticated: ${result.userId}`);
    } else {
      this.logger.warn('Authentication failed');
    }

    return result;
  }

  /**
   * Handle key press event (ANONYMIZED - no actual key value)
   * Only receives category (CHAR, MODIFIER, FUNCTION, ENTER, etc.)
   * POST /api/v1/ingest/key
   */
  @Post('key')
  @UseGuards(IngestAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Ingest an anonymised key press event' })
  @ApiOkResponse({ description: 'Key press buffered for processing' })
  async handleKeyPress(
    @Body() data: ITcpKeyPressEvent,
  ): Promise<{ success: boolean; buffered: boolean }> {
    // Validate the event is properly anonymized
    if (!this.isProperlyAnonymized(data)) {
      this.logger.warn(`Rejected non-anonymized key event from ${data.userId}`);
      return { buffered: false, success: false };
    }

    // Process the anonymized key press
    const result = await this.tcpIngestService.processKeyPress(data);

    return {
      buffered: result.buffered,
      success: true,
    };
  }

  /**
   * Handle passive income from desktop client
   * The desktop client accumulates passive LoC locally and periodically sends
   * the accrued amount so it can be persisted server-side.
   * POST /api/v1/ingest/passive
   */
  @Post('passive')
  @UseGuards(IngestAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Ingest passive income earned by desktop client' })
  @ApiOkResponse({ description: 'Passive income buffered for processing' })
  async handlePassiveIncome(
    @Body() data: { userId: string; sessionId: string; locAmount: number; seconds: number },
  ): Promise<{ success: boolean; buffered: boolean }> {
    if (!data.userId || !data.locAmount || data.locAmount <= 0) {
      return { buffered: false, success: false };
    }

    // Cap a single passive batch to prevent abuse (max 300s = 5 min worth)
    const maxSeconds = 300;
    if (data.seconds > maxSeconds) {
      this.logger.warn(`Passive income batch too large from ${data.userId}: ${data.seconds}s, capping to ${maxSeconds}s`);
      data.locAmount = Math.floor(data.locAmount * (maxSeconds / data.seconds));
      data.seconds = maxSeconds;
    }

    const result = await this.tcpIngestService.processPassiveIncome(
      data.userId,
      data.locAmount,
    );

    return {
      buffered: result,
      success: true,
    };
  }

  /**
   * Health check / keep-alive endpoint
   * GET /api/v1/ingest/ping
   */
  @Get('ping')
  @ApiOperation({ summary: 'Keep-alive ping from desktop agent' })
  @ApiOkResponse({ description: 'Pong with timestamp' })
  handlePing(): { pong: true; timestamp: number } {
    return {
      pong: true,
      timestamp: Date.now(),
    };
  }

  /**
   * Verify that key press event is properly anonymized
   * CRITICAL: We must never receive actual key codes or characters
   */
  private isProperlyAnonymized(data: ITcpKeyPressEvent): boolean {
    // Must have a valid key category, not an actual key code
    const validCategories: KeyCategory[] = [
      'CHAR',
      'MODIFIER',
      'FUNCTION',
      'NAVIGATION',
      'ENTER',
      'SPACE',
      'BACKSPACE',
      'TAB',
      'UNKNOWN',
    ];

    if (!validCategories.includes(data.keyCategory)) {
      return false;
    }

    // Must NOT contain vkCode or any actual key value
    if ('vkCode' in data || 'keyCode' in data || 'char' in data) {
      return false;
    }

    return true;
  }
}
