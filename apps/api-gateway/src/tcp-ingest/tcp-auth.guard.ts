/**
 * Ingest Auth Guard (HTTP)
 * Validates session authentication for keylogger HTTP requests
 */

import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';

import { TcpIngestService } from './tcp-ingest.service';

@Injectable()
export class IngestAuthGuard implements CanActivate {
  private readonly logger = new Logger(IngestAuthGuard.name);

  constructor(private readonly tcpIngestService: TcpIngestService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const data = request.body;

    // Extract session ID from the request body
    const sessionId = data?.sessionId;

    if (!sessionId) {
      this.logger.warn('Ingest request missing sessionId');
      return false;
    }

    // Validate session in Redis
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
