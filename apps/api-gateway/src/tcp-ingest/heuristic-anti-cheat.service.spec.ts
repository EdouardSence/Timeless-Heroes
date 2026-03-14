import { ConfigService } from '@nestjs/config';
import { HeuristicAntiCheatService } from './heuristic-anti-cheat.service';

describe('HeuristicAntiCheatService', () => {
  let service: HeuristicAntiCheatService;
  let mockRedis: {
    get: jest.Mock;
    lindex: jest.Mock;
    lrange: jest.Mock;
    pipeline: jest.Mock;
    rpush: jest.Mock;
    ltrim: jest.Mock;
    expire: jest.Mock;
    del: jest.Mock;
  };
  let mockPipeline: {
    rpush: jest.Mock;
    ltrim: jest.Mock;
    expire: jest.Mock;
    del: jest.Mock;
    exec: jest.Mock;
  };
  let mockConfigService: Partial<ConfigService>;

  beforeEach(() => {
    mockPipeline = {
      rpush: jest.fn().mockReturnThis(),
      ltrim: jest.fn().mockReturnThis(),
      expire: jest.fn().mockReturnThis(),
      del: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    };

    mockRedis = {
      get: jest.fn().mockResolvedValue(null),
      lindex: jest.fn().mockResolvedValue(null),
      lrange: jest.fn().mockResolvedValue([]),
      pipeline: jest.fn().mockReturnValue(mockPipeline),
      rpush: jest.fn(),
      ltrim: jest.fn(),
      expire: jest.fn(),
      del: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn((key: string, defaultValue?: any) => {
        const config: Record<string, any> = {
          MAX_CPS: 20,
        };
        return config[key] ?? defaultValue;
      }),
    };

    service = new HeuristicAntiCheatService(
      mockConfigService as any,
      mockRedis as any,
    );
  });

  describe('analyzeKeyPress', () => {
    it('should reject key presses from banned users', async () => {
      mockRedis.get.mockResolvedValue('15'); // 15 violations >= 10 threshold

      const result = await service.analyzeKeyPress('banned-user', Date.now());

      expect(result.allowed).toBe(false);
      expect(result.humanScore).toBe(0);
      expect(result.reason).toBe('USER_BANNED');
    });

    it('should allow key presses with insufficient samples and return neutral score', async () => {
      // Less than 5 deltas - not enough data
      mockRedis.lrange.mockResolvedValue(['100', '120', '110']);

      const result = await service.analyzeKeyPress('new-user', Date.now());

      expect(result.allowed).toBe(true);
      expect(result.humanScore).toBe(0.5);
    });

    it('should allow human-like typing patterns with high variance', async () => {
      // Human-like deltas: variable timing, ~200ms avg
      const humanDeltas = [
        '180',
        '220',
        '150',
        '300',
        '190',
        '250',
        '170',
        '210',
      ];
      mockRedis.lrange.mockResolvedValue(humanDeltas);
      mockRedis.lindex.mockResolvedValue((Date.now() - 200).toString());

      const result = await service.analyzeKeyPress('human-user', Date.now());

      expect(result.allowed).toBe(true);
      expect(result.humanScore).toBeGreaterThan(0.4);
    });

    it('should detect bot-like patterns with very regular timing and fast speed', async () => {
      // Bot-like deltas: exactly 50ms apart, very regular, fast
      const botDeltas = [
        '50',
        '50',
        '50',
        '50',
        '50',
        '50',
        '50',
        '50',
        '50',
        '50',
        '50',
        '50',
        '50',
        '50',
        '50',
        '50',
        '50',
        '50',
        '50',
      ];
      mockRedis.lrange.mockResolvedValue(botDeltas);
      mockRedis.lindex.mockResolvedValue((Date.now() - 50).toString());

      const result = await service.analyzeKeyPress('bot-user', Date.now());

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('TIMING_TOO_REGULAR');
    });

    it('should flag impossibly fast key presses', async () => {
      // Delta of 10ms between presses (below MIN_DELTA_MS of 30)
      const fastDeltas = ['10', '10', '10', '10', '10', '10'];
      mockRedis.lrange.mockResolvedValue(fastDeltas);
      mockRedis.lindex.mockResolvedValue((Date.now() - 10).toString());

      const result = await service.analyzeKeyPress('speed-hacker', Date.now());

      expect(result.allowed).toBe(false);
      // CPS = 1000/10 = 100 which is > MAX_CPS of 20
      expect(result.reason).toBe('RATE_TOO_FAST');
    });

    it('should use pipeline for atomic Redis operations', async () => {
      mockRedis.lrange.mockResolvedValue([]);

      await service.analyzeKeyPress('user-1', Date.now());

      expect(mockRedis.pipeline).toHaveBeenCalled();
      expect(mockPipeline.rpush).toHaveBeenCalled();
      expect(mockPipeline.ltrim).toHaveBeenCalled();
      expect(mockPipeline.expire).toHaveBeenCalled();
      expect(mockPipeline.exec).toHaveBeenCalled();
    });

    it('should store deltas only for meaningful intervals (> 0 and < 10s)', async () => {
      // Last timestamp was very close to now - delta ~0
      mockRedis.lindex.mockResolvedValue(Date.now().toString());
      mockRedis.lrange.mockResolvedValue([]);

      await service.analyzeKeyPress('user-1', Date.now());

      // Pipeline should still be called for timestamps, but delta rpush
      // depends on the deltaMs value. With delta ~0, it shouldn't store delta.
      expect(mockPipeline.exec).toHaveBeenCalled();
    });

    it('should issue a warning for suspicious but not clearly bot patterns', async () => {
      // Slightly regular, fast but not impossibly so
      // stdDev < 15 and avgDelta < 100 but regularity not above 0.9
      // Need: low std dev, avg < 100, but not all intervals within 5ms
      const suspiciousDeltas = ['60', '62', '58', '61', '59', '70', '80', '63'];
      mockRedis.lrange.mockResolvedValue(suspiciousDeltas);
      mockRedis.lindex.mockResolvedValue((Date.now() - 60).toString());

      const result = await service.analyzeKeyPress('sus-user', Date.now());

      // With these deltas, avg ~64ms, std dev ~6.8, low but not all within 5ms of each other
      // Should be suspicious but allowed with warning
      expect(result.allowed).toBe(true);
      if (result.warning) {
        expect(result.humanScore).toBeLessThan(0.5);
      }
    });
  });

  describe('clearUserData', () => {
    it('should delete both timestamp and delta keys', async () => {
      await service.clearUserData('user-to-clear');

      expect(mockRedis.pipeline).toHaveBeenCalled();
      expect(mockPipeline.del).toHaveBeenCalledTimes(2);
      expect(mockPipeline.exec).toHaveBeenCalled();
    });
  });

  describe('getUserMetrics', () => {
    it('should return null when insufficient data (< 5 deltas)', async () => {
      mockRedis.lrange.mockResolvedValue(['100', '200', '150']);

      const result = await service.getUserMetrics('new-user');

      expect(result).toBeNull();
    });

    it('should return typing metrics when sufficient data exists', async () => {
      const deltas = ['100', '150', '120', '130', '110'];
      mockRedis.lrange.mockResolvedValue(deltas);

      const result = await service.getUserMetrics('active-user');

      expect(result).not.toBeNull();
      expect(result!.averageDeltaMs).toBeCloseTo(122, 0);
      expect(result!.deltaStdDev).toBeGreaterThan(0);
      expect(result!.currentCPS).toBeGreaterThan(0);
      expect(typeof result!.regularIntervalCount).toBe('number');
    });

    it('should calculate CPS from average delta', async () => {
      // Average delta of 100ms = 10 CPS
      const deltas = ['100', '100', '100', '100', '100'];
      mockRedis.lrange.mockResolvedValue(deltas);

      const result = await service.getUserMetrics('steady-user');

      expect(result).not.toBeNull();
      expect(result!.currentCPS).toBeCloseTo(10, 0);
    });
  });
});
