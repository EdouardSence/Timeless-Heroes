/**
 * Auth Service
 * Handles user authentication and token generation
 */

import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { IJwtPayload } from './jwt.strategy';

interface IUserCredentials {
  email: string;
  password: string;
}

interface IRegisterData extends IUserCredentials {
  username: string;
}

interface IAuthResult {
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

  constructor(private readonly jwtService: JwtService) {}

  /**
   * Validate user credentials and return JWT token
   */
  async login(credentials: IUserCredentials): Promise<IAuthResult> {
    // eslint-disable-next-line sonarjs/todo-tag
    // TODO: Integrate with Prisma to fetch user
    // For now, mock validation

    const { email, password } = credentials;

    // Mock user (in production, fetch from DB)
    const mockUser = {
      email: 'test@example.com',
      id: 'user-123',
      passwordHash: await bcrypt.hash('password123', this.SALT_ROUNDS),
      username: 'TestPlayer',
    };

    if (email !== mockUser.email) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      mockUser.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: Omit<IJwtPayload, 'iat' | 'exp'> = {
      email: mockUser.email,
      sub: mockUser.id,
      username: mockUser.username,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    this.logger.log(`User logged in: ${mockUser.email}`);

    return {
      accessToken,
      user: {
        email: mockUser.email,
        id: mockUser.id,
        username: mockUser.username,
      },
    };
  }

  /**
   * Register a new user
   */
  async register(data: IRegisterData): Promise<IAuthResult> {
    const { email, password, username } = data;

    // eslint-disable-next-line sonarjs/todo-tag
    // TODO: Check if user exists with Prisma
    // eslint-disable-next-line sonarjs/todo-tag
    // TODO: Create user in DB

    // Hash password
    const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS);

    // Mock user creation
    const newUser = {
      email,
      id: `user-${Date.now()}`,
      passwordHash,
      username,
    };

    const payload: Omit<IJwtPayload, 'iat' | 'exp'> = {
      email: newUser.email,
      sub: newUser.id,
      username: newUser.username,
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
    };

    return this.jwtService.signAsync(payload);
  }
}
