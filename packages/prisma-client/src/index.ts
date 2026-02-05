/**
 * @repo/prisma-client
 * Centralized Prisma client export for the monorepo
 */

import { PrismaClient } from '../generated/client';

// Singleton pattern for Prisma client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Re-export all Prisma types
export * from '../generated/client';
export { PrismaClient };

// Export the singleton instance
export default prisma;
