/**
 * Prisma Service
 * NestJS-managed lifecycle wrapper around the singleton Prisma client.
 * Ensures the connection pool is properly torn down on app shutdown.
 */

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { prisma } from '@repo/prisma-client';

import type { PrismaClient } from '@repo/prisma-client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  readonly client: PrismaClient = prisma;

  async onModuleInit(): Promise<void> {
    await this.client.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.$disconnect();
  }
}
