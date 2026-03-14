# Dockerfile for web (Next.js)
# Multi-stage build using turbo prune for optimized Docker images

# ============================================================================
# PRUNE STAGE - Generate pruned monorepo subset
# ============================================================================
FROM node:20-alpine AS builder

RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.15.5 --activate

COPY . .
RUN pnpm dlx turbo prune web --docker

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

# Build the Next.js application
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build --filter=web

# ============================================================================
# PRODUCTION STAGE
# ============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy built application from installer
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "apps/web/server.js"]
