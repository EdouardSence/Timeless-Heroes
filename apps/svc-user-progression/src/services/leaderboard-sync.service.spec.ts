/**
 * LeaderboardSyncService unit tests
 */

// Mock external modules before importing the service
jest.mock('@repo/redis-client', () => ({
  LeaderboardService: jest.fn().mockImplementation(() => ({
    updateScore: jest.fn(),
    getUserRank: jest.fn(),
    getTopPlayers: jest.fn(),
  })),
  RedisKeys: {
    LEADERBOARD_GLOBAL: 'leaderboard:global',
    LEADERBOARD_WEEKLY: 'leaderboard:weekly',
    LEADERBOARD_DAILY: 'leaderboard:daily',
  },
  getRedisClient: jest.fn().mockReturnValue({
    rename: jest.fn(),
    expire: jest.fn(),
  }),
}));

jest.mock('@repo/prisma-client', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
    },
  },
}));

import { LeaderboardSyncService } from './leaderboard-sync.service';
import {
  LeaderboardService,
  getRedisClient,
  RedisKeys,
} from '@repo/redis-client';
import { prisma } from '@repo/prisma-client';
import { LeaderboardType } from '@repo/shared-types';

jest.mock('@repo/shared-types', () => ({
  LeaderboardType: {
    GLOBAL: 'GLOBAL',
    WEEKLY: 'WEEKLY',
    DAILY: 'DAILY',
  },
}));

describe('LeaderboardSyncService', () => {
  let service: LeaderboardSyncService;
  let mockLeaderboardService: jest.Mocked<LeaderboardService>;
  let mockRedis: { rename: jest.Mock; expire: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();

    mockRedis = { rename: jest.fn(), expire: jest.fn() };
    (getRedisClient as jest.Mock).mockReturnValue(mockRedis);

    mockLeaderboardService = {
      updateScore: jest.fn().mockResolvedValue(1),
      getUserRank: jest.fn(),
      getTopPlayers: jest.fn(),
    } as unknown as jest.Mocked<LeaderboardService>;

    (LeaderboardService as jest.Mock).mockImplementation(
      () => mockLeaderboardService,
    );

    service = new LeaderboardSyncService();
  });

  describe('syncUserScore', () => {
    it('should update global, weekly, and daily leaderboards', async () => {
      await service.syncUserScore('user-1', '42000');

      expect(mockLeaderboardService.updateScore).toHaveBeenCalledTimes(3);
      expect(mockLeaderboardService.updateScore).toHaveBeenCalledWith(
        'user-1',
        42000,
        RedisKeys.LEADERBOARD_GLOBAL,
      );
      expect(mockLeaderboardService.updateScore).toHaveBeenCalledWith(
        'user-1',
        42000,
        RedisKeys.LEADERBOARD_WEEKLY,
      );
      expect(mockLeaderboardService.updateScore).toHaveBeenCalledWith(
        'user-1',
        42000,
        RedisKeys.LEADERBOARD_DAILY,
      );
    });

    it('should parse fractional scores correctly', async () => {
      await service.syncUserScore('user-2', '123.456');

      expect(mockLeaderboardService.updateScore).toHaveBeenCalledWith(
        'user-2',
        123.456,
        RedisKeys.LEADERBOARD_GLOBAL,
      );
    });
  });

  describe('getUserRanks', () => {
    it('should return ranks from all three leaderboards', async () => {
      mockLeaderboardService.getUserRank
        .mockResolvedValueOnce(1) // global
        .mockResolvedValueOnce(3) // weekly
        .mockResolvedValueOnce(7); // daily

      const result = await service.getUserRanks('user-1');

      expect(result).toEqual({ global: 1, weekly: 3, daily: 7 });
    });

    it('should handle null ranks (user not on leaderboard)', async () => {
      mockLeaderboardService.getUserRank
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      const result = await service.getUserRanks('unknown-user');

      expect(result).toEqual({ global: null, weekly: null, daily: null });
    });
  });

  describe('getLeaderboard', () => {
    const mockEntries = [
      { userId: 'user-1', score: 5000, rank: 1 },
      { userId: 'user-2', score: 3000, rank: 2 },
    ];

    it('should query global leaderboard by default', async () => {
      mockLeaderboardService.getTopPlayers.mockResolvedValue(mockEntries);
      (prisma.user.findMany as jest.Mock).mockResolvedValue([
        { id: 'user-1', username: 'Alice' },
        { id: 'user-2', username: 'Bob' },
      ]);

      const result = await service.getLeaderboard(LeaderboardType.GLOBAL);

      expect(mockLeaderboardService.getTopPlayers).toHaveBeenCalledWith(
        100,
        RedisKeys.LEADERBOARD_GLOBAL,
      );
      expect(result[0]).toMatchObject({ userId: 'user-1', username: 'Alice' });
    });

    it('should query weekly leaderboard when type is WEEKLY', async () => {
      mockLeaderboardService.getTopPlayers.mockResolvedValue(mockEntries);
      (prisma.user.findMany as jest.Mock).mockResolvedValue([]);

      await service.getLeaderboard(LeaderboardType.WEEKLY);

      expect(mockLeaderboardService.getTopPlayers).toHaveBeenCalledWith(
        100,
        RedisKeys.LEADERBOARD_WEEKLY,
      );
    });

    it('should query daily leaderboard when type is DAILY', async () => {
      mockLeaderboardService.getTopPlayers.mockResolvedValue(mockEntries);
      (prisma.user.findMany as jest.Mock).mockResolvedValue([]);

      await service.getLeaderboard(LeaderboardType.DAILY);

      expect(mockLeaderboardService.getTopPlayers).toHaveBeenCalledWith(
        100,
        RedisKeys.LEADERBOARD_DAILY,
      );
    });

    it('should respect custom count parameter', async () => {
      mockLeaderboardService.getTopPlayers.mockResolvedValue([]);

      await service.getLeaderboard(LeaderboardType.GLOBAL, 10);

      expect(mockLeaderboardService.getTopPlayers).toHaveBeenCalledWith(
        10,
        RedisKeys.LEADERBOARD_GLOBAL,
      );
    });
  });

  describe('resetPeriodicLeaderboards', () => {
    it('should archive and expire the weekly leaderboard', async () => {
      await service.resetPeriodicLeaderboards('weekly');

      expect(mockRedis.rename).toHaveBeenCalledWith(
        RedisKeys.LEADERBOARD_WEEKLY,
        expect.stringContaining(`${RedisKeys.LEADERBOARD_WEEKLY}:archive:`),
      );
      expect(mockRedis.expire).toHaveBeenCalledWith(
        expect.stringContaining(`${RedisKeys.LEADERBOARD_WEEKLY}:archive:`),
        30 * 24 * 60 * 60,
      );
    });

    it('should archive and expire the daily leaderboard', async () => {
      await service.resetPeriodicLeaderboards('daily');

      expect(mockRedis.rename).toHaveBeenCalledWith(
        RedisKeys.LEADERBOARD_DAILY,
        expect.stringContaining(`${RedisKeys.LEADERBOARD_DAILY}:archive:`),
      );
    });
  });
});
