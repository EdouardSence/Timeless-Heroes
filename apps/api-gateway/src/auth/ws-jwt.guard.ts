/**
 * WebSocket JWT Guard
 * Validates JWT tokens for WebSocket connections
 */

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { Role } from '@repo/shared-types';

import { IJwtPayload } from './jwt.strategy';

/**
 * Extended Socket interface with authenticated user data
 */
export interface IAuthenticatedSocket extends Socket {
  userId?: string;
  email?: string;
  username?: string;
  role?: Role;
}

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client = context.switchToWs().getClient<IAuthenticatedSocket>();
      const token = this.extractToken(client);

      if (!token) {
        throw new WsException('No token provided');
      }

      const payload = await this.jwtService.verifyAsync<IJwtPayload>(token);

      // Attach user info to socket for later use
      client.userId = payload.sub;
      client.email = payload.email;
      client.username = payload.username;
      client.role = payload.role ?? Role.PLAYER;

      return true;
    } catch (error) {
      this.logger.warn(
        `WebSocket auth failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new WsException('Unauthorized');
    }
  }

  private extractToken(client: Socket): string | null {
    // Try auth object first (Socket.IO client)
    const authToken: unknown = client.handshake.auth.token;
    if (typeof authToken === 'string' && authToken.length > 0) {
      return authToken;
    }

    // Try Authorization header
    const authHeader = client.handshake.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }

    // Try query parameter (ParsedUrlQuery values are string | string[] | undefined)
    const queryToken = client.handshake.query.token ?? null;
    if (typeof queryToken === 'string') {
      return queryToken;
    }

    return null;
  }
}
