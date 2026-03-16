/**
 * JWT Strategy for Passport
 * Validates JWT tokens from Authorization header
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Role } from '@repo/shared-types';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface IJwtPayload {
  email: string;
  exp: number;
  iat: number;
  role: Role;
  sub: string; // User ID
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(payload: IJwtPayload) {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return {
      email: payload.email,
      role: payload.role, // Role field is always present in IJwtPayload
      userId: payload.sub,
      username: payload.username,
    };
  }
}
