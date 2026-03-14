import { ConfigService } from '@nestjs/config';
import { ClickValidatorService } from './click-validator.service';
import { ClickRejectionReason } from '@repo/shared-types';

describe('ClickValidatorService', () => {
  let service: ClickValidatorService;
  let mockThrottleService: {
    isUserBanned: jest.Mock;
    checkClickThrottle: jest.Mock;
    recordViolation: jest.Mock;
  };
  let mockConfigService: Partial<ConfigService>;

  beforeEach(() => {
    mockThrottleService = {
      isUserBanned: jest.fn().mockResolvedValue(false),
      checkClickThrottle: jest
        .fn()
        .mockResolvedValue({ allowed: true, currentCPS: 5 }),
      recordViolation: jest.fn().mockResolvedValue(1),
    };

    mockConfigService = {
      get: jest.fn((key: string, defaultValue?: any) => {
        const config: Record<string, any> = {
          BAN_DURATION_MS: 300_000,
          MAX_CPS: 20,
          MAX_VIOLATIONS: 10,
          THROTTLE_WINDOW_MS: 1000,
        };
        return config[key] ?? defaultValue;
      }),
    };

    service = new ClickValidatorService(
      mockThrottleService as any,
      mockConfigService as any,
    );
  });

  describe('validateClick', () => {
    it('should accept a valid click with a current timestamp', async () => {
      const result = await service.validateClick({
        userId: 'user-1',
        timestamp: Date.now(),
      });

      expect(result.isValid).toBe(true);
      expect(result.detectedCPS).toBe(5);
      expect(result.maxAllowedCPS).toBe(20);
    });

    it('should reject clicks from banned users', async () => {
      mockThrottleService.isUserBanned.mockResolvedValue(true);

      const result = await service.validateClick({
        userId: 'banned-user',
        timestamp: Date.now(),
      });

      expect(result.isValid).toBe(false);
      expect(result.reason).toBe(ClickRejectionReason.USER_BANNED);
    });

    it('should reject clicks with timestamps too far in the future', async () => {
      const futureTimestamp = Date.now() + 60_000; // 60 seconds in future

      const result = await service.validateClick({
        userId: 'user-1',
        timestamp: futureTimestamp,
      });

      expect(result.isValid).toBe(false);
      expect(result.reason).toBe(ClickRejectionReason.TIMESTAMP_IN_FUTURE);
    });

    it('should reject clicks with timestamps that are too old', async () => {
      const oldTimestamp = Date.now() - 15_000; // 15 seconds ago

      const result = await service.validateClick({
        userId: 'user-1',
        timestamp: oldTimestamp,
      });

      expect(result.isValid).toBe(false);
      expect(result.reason).toBe(ClickRejectionReason.TIMESTAMP_INVALID);
    });

    it('should accept clicks with timestamps within 5-second drift tolerance', async () => {
      // Slightly in the future but within tolerance
      const slightFuture = Date.now() + 3000;

      const result = await service.validateClick({
        userId: 'user-1',
        timestamp: slightFuture,
      });

      expect(result.isValid).toBe(true);
    });

    it('should reject clicks when rate limit is exceeded', async () => {
      mockThrottleService.checkClickThrottle.mockResolvedValue({
        allowed: false,
        currentCPS: 25,
      });

      const result = await service.validateClick({
        userId: 'fast-clicker',
        timestamp: Date.now(),
      });

      expect(result.isValid).toBe(false);
      expect(result.reason).toBe(ClickRejectionReason.RATE_LIMIT_EXCEEDED);
      expect(result.detectedCPS).toBe(25);
    });

    it('should record a violation when rate limit is exceeded', async () => {
      mockThrottleService.checkClickThrottle.mockResolvedValue({
        allowed: false,
        currentCPS: 25,
      });

      await service.validateClick({
        userId: 'fast-clicker',
        timestamp: Date.now(),
      });

      expect(mockThrottleService.recordViolation).toHaveBeenCalledWith(
        'fast-clicker',
      );
    });

    it('should record a violation when timestamp is invalid', async () => {
      const futureTimestamp = Date.now() + 60_000;

      await service.validateClick({
        userId: 'user-1',
        timestamp: futureTimestamp,
      });

      expect(mockThrottleService.recordViolation).toHaveBeenCalledWith(
        'user-1',
      );
    });

    it('should not record a violation for valid clicks', async () => {
      await service.validateClick({
        userId: 'good-user',
        timestamp: Date.now(),
      });

      expect(mockThrottleService.recordViolation).not.toHaveBeenCalled();
    });

    it('should check ban status before other validations', async () => {
      mockThrottleService.isUserBanned.mockResolvedValue(true);

      await service.validateClick({
        userId: 'banned-user',
        timestamp: Date.now() + 60_000, // Also invalid timestamp
      });

      // Should return banned, not timestamp error
      expect(mockThrottleService.checkClickThrottle).not.toHaveBeenCalled();
    });
  });

  describe('getConfig', () => {
    it('should return a copy of the throttle configuration', () => {
      const config = service.getConfig();
      expect(config.maxCPS).toBe(20);
      expect(config.maxViolations).toBe(10);
      expect(config.banDurationMs).toBe(300_000);
      expect(config.windowMs).toBe(1000);
    });

    it('should return a new object (not the internal reference)', () => {
      const config1 = service.getConfig();
      const config2 = service.getConfig();
      expect(config1).toEqual(config2);
      expect(config1).not.toBe(config2);
    });
  });
});
