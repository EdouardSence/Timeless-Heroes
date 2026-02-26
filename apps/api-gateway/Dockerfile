# Dockerfile for api-gateway
# Multi-stage build using turbo prune for optimized Docker images

# ============================================================================
# PRUNE STAGE - Generate pruned monorepo subset
# ============================================================================
FROM node:20-alpine AS builder

RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.15.5 --activate

COPY . .
RUN pnpm dlx turbo prune @app/api-gateway --docker

# ============================================================================
# INSTALL & BUILD STAGE
# ============================================================================
FROM node:20-alpine AS installer

RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.15.5 --activate

# Install dependencies from pruned lockfile (better Docker cache)
COPY --from=builder /app/out/json/ .
RUN pnpm install --frozen-lockfile

# Copy full source and build
COPY --from=builder /app/out/full/ .

# Generate Prisma client
RUN pnpm -F @repo/prisma-client generate

# Build shared-types first (required by all services)
RUN pnpm run build --filter=@repo/shared-types

# Build prisma-client
RUN pnpm run build --filter=@repo/prisma-client

# Build redis-client
RUN pnpm run build --filter=@repo/redis-client

# Build the application
RUN pnpm run build --filter=@app/api-gateway

# ============================================================================
# PRODUCTION STAGE
# ============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built application from installer
COPY --from=installer --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=installer --chown=nestjs:nodejs /app/apps/api-gateway/dist ./apps/api-gateway/dist
COPY --from=installer --chown=nestjs:nodejs /app/apps/api-gateway/package.json ./apps/api-gateway/
COPY --from=installer --chown=nestjs:nodejs /app/packages ./packages

# Create missing workspace symlinks
RUN mkdir -p ./node_modules/@repo && \
    ln -sf ../../packages/shared-types ./node_modules/@repo/shared-types && \
    ln -sf ../../packages/prisma-client ./node_modules/@repo/prisma-client && \
    ln -sf ../../packages/redis-client ./node_modules/@repo/redis-client

USER nestjs

WORKDIR /app/apps/api-gateway

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "dist/main.js"]
