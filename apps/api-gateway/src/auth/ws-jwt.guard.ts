/**
 * WebSocket JWT Guard
 * Validates JWT tokens for WebSocket connections
 */

import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { IJwtPayload } from './jwt.strategy';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);
  
  constructor(private readonly jwtService: JwtService) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient();
      const token = this.extractToken(client);
      
      if (!token) {
        throw new WsException('No token provided');
      }
      
      const payload = await this.jwtService.verifyAsync<IJwtPayload>(token);
      
      // Attach user info to socket for later use
      (client as any).userId = payload.sub;
      (client as any).email = payload.email;
      (client as any).username = payload.username;
      
      return true;
    } catch (error) {
      this.logger.warn(`WebSocket auth failed: ${error}`);
      throw new WsException('Unauthorized');
    }
  }
  
  private extractToken(client: Socket): string | null {
    // Try auth object first (Socket.IO client)
    const authToken = client.handshake.auth?.token;
    if (authToken) {
      return authToken;
    }
    
    // Try Authorization header
    const authHeader = client.handshake.headers?.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }
    
    // Try query parameter
    const queryToken = client.handshake.query?.token;
    if (typeof queryToken === 'string') {
      return queryToken;
    }
    
    return null;
  }
}
