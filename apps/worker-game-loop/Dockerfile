# Dockerfile for worker-game-loop
# Multi-stage build using turbo prune for optimized Docker images

# ============================================================================
# PRUNE STAGE - Generate pruned monorepo subset
# ============================================================================
FROM node:20-alpine3.21 AS builder

RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.15.5 --activate

COPY . .
RUN pnpm dlx turbo prune @app/worker-game-loop --docker

# ============================================================================
# INSTALL & BUILD STAGE
# ============================================================================
FROM node:20-alpine3.21 AS installer

RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.15.5 --activate

# Install dependencies from pruned lockfile (better Docker cache)
COPY --from=builder /app/out/json/ .
RUN pnpm install --frozen-lockfile

# Copy full source and build
COPY --from=builder /app/out/full/ .

# Clean pre-generated Prisma client and regenerate for Alpine
RUN rm -rf packages/prisma-client/generated/client/*.node
RUN pnpm -F @repo/prisma-client generate

# Build shared-types first (required by all services)
RUN pnpm run build --filter=@repo/shared-types

# Build prisma-client
RUN pnpm run build --filter=@repo/prisma-client

# Build redis-client
RUN pnpm run build --filter=@repo/redis-client

# Build the application
RUN pnpm run build --filter=@app/worker-game-loop

# ============================================================================
# PRODUCTION STAGE
# ============================================================================
FROM node:20-alpine3.21 AS runner

RUN apk add --no-cache openssl libssl3

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=installer --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=installer --chown=nestjs:nodejs /app/apps/worker-game-loop/dist ./apps/worker-game-loop/dist
COPY --from=installer --chown=nestjs:nodejs /app/apps/worker-game-loop/package.json ./apps/worker-game-loop/
COPY --from=installer --chown=nestjs:nodejs /app/packages ./packages

# Create missing workspace symlinks
RUN mkdir -p ./node_modules/@repo && \
    ln -sf ../../packages/shared-types ./node_modules/@repo/shared-types && \
    ln -sf ../../packages/prisma-client ./node_modules/@repo/prisma-client && \
    ln -sf ../../packages/redis-client ./node_modules/@repo/redis-client

USER nestjs

WORKDIR /app/apps/worker-game-loop

# No EXPOSE — this is a pure NATS microservice with no HTTP port.
# Health is checked via NATS health.check pattern from the api-gateway.

CMD ["node", "dist/main.js"]
