/**
 * Auth Service
 * Handles user authentication and token generation via Prisma + JWT
 */

import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { prisma } from '@repo/prisma-client';
import * as bcrypt from 'bcrypt';

import { LeaderboardService } from '@repo/redis-client';
import { Role } from '@repo/shared-types';
import { IJwtPayload } from './jwt.strategy';

interface IUserCredentials {
  email: string;
  password: string;
}

interface IRegisterData extends IUserCredentials {
  username: string;
}

export interface IAuthResult {
  accessToken: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly SALT_ROUNDS = 10;

  constructor(
    private readonly jwtService: JwtService,
    private readonly leaderboardService: LeaderboardService,
  ) {}

  /**
   * Validate user credentials and return JWT token
   */
  async login(credentials: IUserCredentials): Promise<IAuthResult> {
    const { email, password } = credentials;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const payload: Omit<IJwtPayload, 'iat' | 'exp'> = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: (user.role as Role) ?? Role.PLAYER,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    this.logger.log(`User logged in: ${user.email}`);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }

  /**
   * Register a new user
   */
  async register(data: IRegisterData): Promise<IAuthResult> {
    const { email, password, username } = data;

    // Check if user already exists
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existing) {
      const field = existing.email === email ? 'email' : 'username';
      throw new ConflictException(`A user with this ${field} already exists`);
    }

    // Hash password and create user
    const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS);

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: passwordHash,
      },
    });

    // Create default progression row
    await prisma.progression.create({
      data: {
        userId: newUser.id,
        linesOfCode: 0,
        totalClicks: 0,
        level: 1,
        experience: 0,
        experienceToNext: 100,
        clickMultiplier: 1.0,
        passiveMultiplier: 0.0,
        criticalChance: 0.05,
        criticalMultiplier: 2.0,
      },
    });

    // Seed leaderboard so the new user appears immediately (score 0)
    await this.leaderboardService.updateScore(newUser.id, 0);

    const payload: Omit<IJwtPayload, 'iat' | 'exp'> = {
      email: newUser.email,
      sub: newUser.id,
      username: newUser.username,
      role: (newUser.role as Role) ?? Role.PLAYER,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    this.logger.log(`User registered: ${newUser.email}`);

    return {
      accessToken,
      user: {
        email: newUser.email,
        id: newUser.id,
        username: newUser.username,
      },
    };
  }

  /**
   * Verify a JWT token
   */
  async verifyToken(token: string): Promise<IJwtPayload> {
    try {
      return await this.jwtService.verifyAsync<IJwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * Generate a new JWT token for a user
   */
  async generateToken(
    userId: string,
    email: string,
    username: string,
  ): Promise<string> {
    const payload: Omit<IJwtPayload, 'iat' | 'exp'> = {
      email,
      sub: userId,
      username,
      role: Role.PLAYER,
    };

    return this.jwtService.signAsync(payload);
  }
}
