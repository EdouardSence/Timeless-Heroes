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
    // TODO: Integrate with Prisma to fetch user
    // For now, mock validation
    
    const { email, password } = credentials;
    
    // Mock user (in production, fetch from DB)
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      username: 'TestPlayer',
      passwordHash: await bcrypt.hash('password123', this.SALT_ROUNDS),
    };
    
    if (email !== mockUser.email) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const isPasswordValid = await bcrypt.compare(password, mockUser.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const payload: Omit<IJwtPayload, 'iat' | 'exp'> = {
      sub: mockUser.id,
      email: mockUser.email,
      username: mockUser.username,
    };
    
    const accessToken = await this.jwtService.signAsync(payload);
    
    this.logger.log(`User logged in: ${mockUser.email}`);
    
    return {
      accessToken,
      user: {
        id: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
      },
    };
  }
  
  /**
   * Register a new user
   */
  async register(data: IRegisterData): Promise<IAuthResult> {
    const { email, password, username } = data;
    
    // TODO: Check if user exists with Prisma
    // TODO: Create user in DB
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS);
    
    // Mock user creation
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      username,
      passwordHash,
    };
    
    const payload: Omit<IJwtPayload, 'iat' | 'exp'> = {
      sub: newUser.id,
      email: newUser.email,
      username: newUser.username,
    };
    
    const accessToken = await this.jwtService.signAsync(payload);
    
    this.logger.log(`User registered: ${newUser.email}`);
    
    return {
      accessToken,
      user: {
        id: newUser.id,
        email: newUser.email,
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
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
  
  /**
   * Generate a new JWT token for a user
   */
  async generateToken(userId: string, email: string, username: string): Promise<string> {
    const payload: Omit<IJwtPayload, 'iat' | 'exp'> = {
      sub: userId,
      email,
      username,
    };
    
    return this.jwtService.signAsync(payload);
  }
}
