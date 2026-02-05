/**
 * Click Validator Service
 * Anti-cheat and throttling logic for click events
 * 
 * Implements:
 * - Rate limiting (max CPS - clicks per second)
 * - Timestamp validation
 * - Suspicious pattern detection
 * - Violation tracking
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ThrottleService } from '@repo/redis-client';
import {
    ClickRejectionReason,
    IClickValidation,
    IKeyPressPayload,
    IThrottleConfig,
} from '@repo/shared-types';

@Injectable()
export class ClickValidatorService {
  private readonly logger = new Logger(ClickValidatorService.name);
  private readonly config: IThrottleConfig;
  
  constructor(
    private readonly throttleService: ThrottleService,
    private readonly configService: ConfigService,
  ) {
    this.config = {
      maxCPS: this.configService.get<number>('MAX_CPS', 20),
      windowMs: this.configService.get<number>('THROTTLE_WINDOW_MS', 1000),
      maxViolations: this.configService.get<number>('MAX_VIOLATIONS', 10),
      banDurationMs: this.configService.get<number>('BAN_DURATION_MS', 300000), // 5 min
    };
    
    this.logger.log(`Throttle config: maxCPS=${this.config.maxCPS}, maxViolations=${this.config.maxViolations}`);
  }
  
  /**
   * Validate a click event
   * Returns validation result with reason if rejected
   */
  async validateClick(payload: IKeyPressPayload): Promise<IClickValidation> {
    const { userId, timestamp } = payload;
    
    // 1. Check if user is banned
    const isBanned = await this.throttleService.isUserBanned(
      userId,
      this.config.maxViolations,
    );
    
    if (isBanned) {
      this.logger.warn(`User ${userId} is temporarily banned`);
      return {
        isValid: false,
        reason: ClickRejectionReason.USER_BANNED,
        detectedCPS: 0,
        maxAllowedCPS: this.config.maxCPS,
      };
    }
    
    // 2. Validate timestamp
    const timestampValidation = this.validateTimestamp(timestamp);
    if (!timestampValidation.isValid) {
      await this.recordViolation(userId);
      return {
        isValid: false,
        reason: timestampValidation.reason,
        detectedCPS: 0,
        maxAllowedCPS: this.config.maxCPS,
      };
    }
    
    // 3. Check click rate
    const throttleResult = await this.throttleService.checkClickThrottle(
      userId,
      this.config.maxCPS,
    );
    
    if (!throttleResult.allowed) {
      await this.recordViolation(userId);
      this.logger.warn(
        `Rate limit exceeded for user ${userId}: ${throttleResult.currentCPS} CPS`,
      );
      
      return {
        isValid: false,
        reason: ClickRejectionReason.RATE_LIMIT_EXCEEDED,
        detectedCPS: throttleResult.currentCPS,
        maxAllowedCPS: this.config.maxCPS,
      };
    }
    
    return {
      isValid: true,
      detectedCPS: throttleResult.currentCPS,
      maxAllowedCPS: this.config.maxCPS,
    };
  }
  
  /**
   * Validate timestamp is reasonable
   */
  private validateTimestamp(timestamp: number): { isValid: boolean; reason?: ClickRejectionReason } {
    const now = Date.now();
    const maxDrift = 5000; // 5 second tolerance
    
    // Check if timestamp is in the future
    if (timestamp > now + maxDrift) {
      return {
        isValid: false,
        reason: ClickRejectionReason.TIMESTAMP_IN_FUTURE,
      };
    }
    
    // Check if timestamp is too old (more than 10 seconds)
    if (timestamp < now - 10000) {
      return {
        isValid: false,
        reason: ClickRejectionReason.TIMESTAMP_INVALID,
      };
    }
    
    return { isValid: true };
  }
  
  /**
   * Record a violation for the user
   */
  private async recordViolation(userId: string): Promise<void> {
    const violations = await this.throttleService.recordViolation(userId);
    
    if (violations >= this.config.maxViolations) {
      this.logger.warn(
        `User ${userId} reached max violations (${violations}), temporarily banned`,
      );
    }
  }
  
  /**
   * Get current throttle configuration
   */
  getConfig(): IThrottleConfig {
    return { ...this.config };
  }
}
