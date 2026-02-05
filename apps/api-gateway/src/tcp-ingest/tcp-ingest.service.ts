/**
 * TCP Ingest Service
 * Handles authentication and key press processing from keylogger
 */

import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';

import { ClickBufferService, RedisKeys } from '@repo/redis-client';
import { KeyType } from '@repo/shared-types';
import {
  ITcpKeyPressEvent,
  ITcpAuthResponse,
  KeyCategory,
  IAntiCheatResult,
} from './tcp-ingest.types';
import { HeuristicAntiCheatService } from './heuristic-anti-cheat.service';

@Injectable()
export class TcpIngestService {
  private readonly logger = new Logger(TcpIngestService.name);

  // In-memory session store for authenticated clients
  private authenticatedSessions: Map<string, { userId: string; expiresAt: number }> = new Map();

  constructor(
    private readonly jwtService: JwtService,
    private readonly clickBufferService: ClickBufferService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly antiCheatService: HeuristicAntiCheatService,
  ) { }

  /**
   * Authenticate a client using JWT token
   */
  async authenticateClient(token: string): Promise<ITcpAuthResponse> {
    try {
      // Verify JWT
      const payload = await this.jwtService.verifyAsync<{ sub: string; email: string }>(token);

      const userId = payload.sub;
      const sessionId = this.generateSessionId();

      // Store session
      this.authenticatedSessions.set(sessionId, {
        userId,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Store session in Redis for distributed access
      await this.redis.setex(
        RedisKeys.USER_SESSION(userId),
        7 * 24 * 60 * 60, // 7 days TTL
        JSON.stringify({ sessionId, authenticatedAt: Date.now() }),
      );

      return {
        success: true,
        sessionId,
        userId,
        message: 'Authentication successful',
      };
    } catch (error) {
      this.logger.warn(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        success: false,
        message: 'Invalid or expired token',
      };
    }
  }

  /**
   * Process an anonymized key press event
   * This is the core ingestion logic
   */
  async processKeyPress(event: ITcpKeyPressEvent): Promise<{ buffered: boolean; antiCheat: IAntiCheatResult }> {
    const { userId, keyCategory, timestamp } = event;

    // 1. Run anti-cheat heuristics
    const antiCheatResult = await this.antiCheatService.analyzeKeyPress(userId, timestamp);

    if (!antiCheatResult.allowed) {
      this.logger.warn(
        `Anti-cheat blocked key press from ${userId}: ${antiCheatResult.reason}`,
      );

      // Track violations in Redis
      await this.redis.incr(RedisKeys.USER_VIOLATIONS(userId));

      return { buffered: false, antiCheat: antiCheatResult };
    }

    // 2. Convert key category to KeyType for multiplier calculation
    const keyType = this.categoryToKeyType(keyCategory);

    // 3. Calculate base value (different key types = different bonuses)
    const baseValue = this.calculateBaseValue(keyCategory);

    // 4. Buffer the click in Redis
    await this.clickBufferService.incrementBuffer(userId, baseValue.toString());

    this.logger.debug(
      `Buffered key press for ${userId}: category=${keyCategory}, value=${baseValue}`,
    );

    return {
      buffered: true,
      antiCheat: antiCheatResult,
    };
  }

  /**
   * Calculate base value based on key category
   * Different key types give different bonuses (game design)
   */
  private calculateBaseValue(category: KeyCategory): number {
    switch (category) {
      case 'ENTER':
        return 3; // Finishing a line of code!
      case 'FUNCTION':
        return 2; // Using advanced features
      case 'MODIFIER':
        return 1; // Shift, Ctrl, Alt
      case 'TAB':
        return 2; // Proper indentation
      case 'CHAR':
      default:
        return 1;
    }
  }

  /**
   * Convert anonymous category to KeyType enum
   */
  private categoryToKeyType(category: KeyCategory): KeyType {
    switch (category) {
      case 'FUNCTION':
        return KeyType.FUNCTION;
      case 'MODIFIER':
        return KeyType.SPECIAL;
      default:
        return KeyType.NORMAL;
    }
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Validate if a session is still valid
   */
  isSessionValid(sessionId: string): boolean {
    const session = this.authenticatedSessions.get(sessionId);
    if (!session) return false;
    if (Date.now() > session.expiresAt) {
      this.authenticatedSessions.delete(sessionId);
      return false;
    }
    return true;
  }

  /**
   * Get user ID from session
   */
  getUserIdFromSession(sessionId: string): string | null {
    const session = this.authenticatedSessions.get(sessionId);
    return session?.userId || null;
  }
}
