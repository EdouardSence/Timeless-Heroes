/**
 * TCP Auth Guard
 * Validates authentication for TCP microservice messages
 */

import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { TcpContext } from '@nestjs/microservices';

import { TcpIngestService } from './tcp-ingest.service';

@Injectable()
export class TcpAuthGuard implements CanActivate {
  private readonly logger = new Logger(TcpAuthGuard.name);

  constructor(private readonly tcpIngestService: TcpIngestService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const data = context.switchToRpc().getData();

    // Extract session ID from the payload
    const sessionId = data?.sessionId;

    if (!sessionId) {
      this.logger.warn('TCP request missing sessionId');
      return false;
    }

    // Validate session (now async - checks Redis)
    const isValid = await this.tcpIngestService.isSessionValid(sessionId);

    if (!isValid) {
      this.logger.warn(`Invalid session: ${sessionId}`);
      return false;
    }

    // Verify userId matches session
    const expectedUserId = await this.tcpIngestService.getUserIdFromSession(sessionId);
    if (data?.userId && data.userId !== expectedUserId) {
      this.logger.warn(`User ID mismatch: expected ${expectedUserId}, got ${data.userId}`);
      return false;
    }

    return true;
  }
}
