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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

import { AuthService, IAuthResult } from './auth.service';

interface IAuthenticatedUser {
  email: string;
  userId: string;
  username: string;
}

class LoginDto {
  @ApiProperty({ example: 'player@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'secureP@ss1', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;
}

class RegisterDto {
  @ApiProperty({ example: 'PlayerOne', minLength: 3, maxLength: 32 })
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  username!: string;

  @ApiProperty({ example: 'player@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'secureP@ss1', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;
}

class AuthResultDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  accessToken!: string;

  @ApiProperty({ example: 'abc-123-def-456' })
  userId!: string;

  @ApiProperty({ example: 'PlayerOne' })
  username!: string;
}

class MeResponseDto {
  @ApiProperty({ example: 'abc-123-def-456' })
  userId!: string;

  @ApiProperty({ example: 'PlayerOne' })
  username!: string;

  @ApiProperty({ example: 'player@example.com' })
  email!: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/v1/auth/register
   */
  @Post('register')
  @ApiOperation({ summary: 'Register a new player account' })
  @ApiCreatedResponse({
    description: 'Account created, JWT returned',
    type: AuthResultDto,
  })
  async register(@Body() dto: RegisterDto): Promise<IAuthResult> {
    this.logger.log(`Register attempt: ${dto.email}`);
    return this.authService.register(dto);
  }

  /**
   * POST /api/v1/auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and receive a JWT token' })
  @ApiOkResponse({
    description: 'Login successful, JWT returned',
    type: AuthResultDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
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
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiOkResponse({ description: 'Current user info', type: MeResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT' })
  me(@Request() req: { user: IAuthenticatedUser }) {
    return {
      email: req.user.email,
      userId: req.user.userId,
      username: req.user.username,
    };
  }
}
