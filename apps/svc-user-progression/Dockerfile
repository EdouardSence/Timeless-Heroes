# Dockerfile for svc-user-progression

FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.15.5 --activate

COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY turbo.json ./

COPY apps/svc-user-progression/package.json ./apps/svc-user-progression/
COPY packages/prisma-client/package.json ./packages/prisma-client/
COPY packages/redis-client/package.json ./packages/redis-client/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/

RUN pnpm install --frozen-lockfile

COPY packages ./packages
COPY apps/svc-user-progression ./apps/svc-user-progression

WORKDIR /app/packages/prisma-client
RUN pnpm run generate

WORKDIR /app
RUN pnpm run build --filter=@app/svc-user-progression

FROM node:20-alpine AS runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.15.5 --activate
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/svc-user-progression/dist ./apps/svc-user-progression/dist
COPY --from=builder /app/apps/svc-user-progression/package.json ./apps/svc-user-progression/
COPY --from=builder /app/packages ./packages

RUN chown -R nestjs:nodejs /app

USER nestjs

WORKDIR /app/apps/svc-user-progression

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

CMD ["node", "dist/main.js"]
