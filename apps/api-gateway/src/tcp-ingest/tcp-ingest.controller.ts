/**
 * TCP Ingest Controller
 * Handles incoming TCP messages from the PowerShell keylogger
 * 
 * Message Protocol:
 * - AUTH:<jwt_token> - Authenticate session
 * - KEY_PRESS:<key_type>:<timestamp> - Key press event (anonymized)
 * - PING - Keep-alive
 */

import { Controller, Logger, UseGuards } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, TcpContext } from '@nestjs/microservices';

import { TcpAuthGuard } from './tcp-auth.guard';
import { TcpIngestService } from './tcp-ingest.service';
import { ITcpAuthRequest, ITcpAuthResponse, ITcpKeyPressEvent, KeyCategory } from './tcp-ingest.types';

@Controller()
export class TcpIngestController {
  private readonly logger = new Logger(TcpIngestController.name);

  constructor(private readonly tcpIngestService: TcpIngestService) { }

  /**
   * Handle authentication request from keylogger
   * Client sends: AUTH { token: string }
   */
  @MessagePattern('auth')
  async handleAuth(
    @Payload() data: ITcpAuthRequest,
    @Ctx() context: TcpContext,
  ): Promise<ITcpAuthResponse> {
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
   */
  @MessagePattern('key_press')
  @UseGuards(TcpAuthGuard)
  async handleKeyPress(
    @Payload() data: ITcpKeyPressEvent,
    @Ctx() context: TcpContext,
  ): Promise<{ success: boolean; buffered: boolean }> {
    // Validate the event is properly anonymized
    if (!this.isProperlyAnonymized(data)) {
      this.logger.warn(`Rejected non-anonymized key event from ${data.userId}`);
      return { success: false, buffered: false };
    }

    // Process the anonymized key press
    const result = await this.tcpIngestService.processKeyPress(data);

    return {
      success: true,
      buffered: result.buffered,
    };
  }

  /**
   * Handle ping (keep-alive)
   */
  @MessagePattern('ping')
  async handlePing(): Promise<{ pong: true; timestamp: number }> {
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
