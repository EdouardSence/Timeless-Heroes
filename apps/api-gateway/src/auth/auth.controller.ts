/**
 * Auth Controller
 * REST endpoints for user authentication
 *
 * POST /auth/register - Create a new account
 * POST /auth/login    - Login and receive JWT
 * GET  /auth/me       - Get current user (requires JWT)
 */

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

import { AuthService, IAuthResult } from './auth.service';

interface IAuthenticatedUser {
  email: string;
  userId: string;
  username: string;
}

class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

class RegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/v1/auth/register
   */
  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<IAuthResult> {
    this.logger.log(`Register attempt: ${dto.email}`);
    return this.authService.register(dto);
  }

  /**
   * POST /api/v1/auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<IAuthResult> {
    this.logger.log(`Login attempt: ${dto.email}`);
    return this.authService.login(dto);
  }

  /**
   * GET /api/v1/auth/me
   * Requires a valid JWT Bearer token
   */
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  me(@Request() req: { user: IAuthenticatedUser }) {
    return {
      email: req.user.email,
      userId: req.user.userId,
      username: req.user.username,
    };
  }
}
