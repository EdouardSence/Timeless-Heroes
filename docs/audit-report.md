# Audit Report — Timeless Heroes

**Date:** 2026-03-14  
**Phase:** Phase 2 — Consolidation, Quality & Infrastructure  
**Scope:** Git history, Linting, Docker, BullMQ, Inter-service communication, Testing

---

## 1. Git Commit Audit

### Summary

| Metric                   | Value                                            |
| ------------------------ | ------------------------------------------------ |
| Total commits (main)     | ~92                                              |
| Conventional commits     | ~62 (67%)                                        |
| Non-conventional commits | ~30 (33%)                                        |
| Commitlint enforced      | **Yes** (since commit `786fe3e`)                 |
| Husky hooks              | pre-commit (turbo lint), commit-msg (commitlint) |

### Non-conventional commits (pre-enforcement)

The following 30 commits on `main` do not follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. They were created before commitlint was installed and cannot be retroactively changed without rewriting history.

| SHA       | Message                                   | Issue                        |
| --------- | ----------------------------------------- | ---------------------------- |
| `3940d2f` | retry CI                                  | No type prefix               |
| `4dfa21a` | update pnpm-lock                          | No type prefix               |
| `946a455` | correc macos                              | No type prefix, misspelling  |
| `e95ef66` | correction rapide lancement app           | No type prefix, French       |
| `60a7130` | Ajout du worker game-loop...              | No type prefix, French       |
| `3a5d946` | Ajout du microservice user-progression... | No type prefix, French       |
| `1b51e68` | Ajout du microservice payment...          | No type prefix, French       |
| `9e16054` | Ajout du service keylogger...             | No type prefix, French       |
| `6abf2af` | Refactoring Desktop...                    | No type prefix               |
| `f55aaff` | Refactoring Web...                        | No type prefix               |
| `aabf07f` | Refactoring API...                        | No type prefix               |
| `d73cc32` | Mise à jour du package.json UI            | No type prefix, French       |
| `2d61acb` | Mise à jour du client Prisma...           | No type prefix, French       |
| `f1d3683` | Mise à jour de la config ESLint...        | No type prefix, French       |
| `5b3aad8` | Ajout de la documentation architecture    | No type prefix, French       |
| `e57d467` | Ajout des scripts de lancement...         | No type prefix, French       |
| `2dcb25e` | Mise à jour des configs et dépendances... | No type prefix, French       |
| `3405e98` | Ajout des exports du package UI           | No type prefix, French       |
| `4621624` | Ajout du composant StatCard...            | No type prefix, French       |
| `22686e0` | Ajout du composant NeonProgress...        | No type prefix, French       |
| `984e957` | Ajout du composant NeonButton...          | No type prefix, French       |
| `effa946` | Ajout du composant GlassCard...           | No type prefix, French       |
| `bae63df` | Ajout du design system...                 | No type prefix, French       |
| `ed1c019` | Ajout du package redis-client...          | No type prefix, French       |
| `992a737` | Ajout du package shared-types...          | No type prefix, French       |
| `86f28d5` | Message de commit                         | Empty/placeholder message    |
| `7b09114` | chat du futur                             | Non-descriptive              |
| `6e36d21` | chore(dashboard): nettoyage...            | French body (type prefix OK) |
| `cb99018` | chore: nettoyage des sections...          | French body (type prefix OK) |
| `b5daf20` | correction bug                            | No type prefix               |
| `5621847` | first commit                              | No type prefix               |

### Enforcement

- **Commitlint** (`@commitlint/config-conventional`) now rejects any commit that does not match `type(scope): description` format.
- **Scope enum**: `api-gateway`, `worker`, `payment`, `progression`, `web`, `desktop`, `prisma`, `redis`, `shared-types`, `eslint-config`, `typescript-config`, `jest-config`, `docker`, `ci`.
- **Husky hooks**: `commit-msg` runs commitlint; `pre-commit` runs `pnpm turbo lint`.

---

## 2. Linting Audit

### Before

| Metric                           | Value                                                |
| -------------------------------- | ---------------------------------------------------- |
| Total lint errors                | ~550                                                 |
| Total lint warnings              | ~0 (all downgraded by `eslint-plugin-only-warn`)     |
| Plugin `eslint-plugin-only-warn` | Present — silently converting all errors to warnings |

### After

| Metric                     | Value                                                               |
| -------------------------- | ------------------------------------------------------------------- |
| Total lint errors          | **0**                                                               |
| Total lint warnings        | **0**                                                               |
| `eslint-plugin-only-warn`  | **Removed**                                                         |
| ESLint flat config plugins | typescript-eslint, unicorn, import-x, perfectionist, sonarjs, turbo |
| Test file overrides        | Strict type-check rules relaxed for `*.spec.ts` / `*.test.ts`       |

### Categories of fixes applied

| Category                                                | Count (approx.) | Examples                                            |
| ------------------------------------------------------- | --------------- | --------------------------------------------------- |
| Import ordering (`import-x/order`)                      | ~100            | Auto-fixed by `eslint --fix`                        |
| Object key sorting (`perfectionist/sort-objects`)       | ~80             | Auto-fixed                                          |
| Numeric separators (`unicorn/numeric-separators-style`) | ~30             | Auto-fixed                                          |
| Brace spacing / formatting                              | ~50             | Auto-fixed by Prettier integration                  |
| `\|\|` → `??` nullish coalescing                        | ~30             | Manual replacement                                  |
| Remove `async` from non-awaiting methods                | ~12             | Manual removal                                      |
| Type `any` values with proper interfaces                | ~15             | Redis `hgetall`, JWT payloads, Socket.IO handshake  |
| Unused imports/variables                                | ~10             | Manual removal                                      |
| `restrict-template-expressions`                         | ~8              | Wrapped with `String(error)`                        |
| `sonarjs/todo-tag`, `sonarjs/pseudo-random`             | ~5              | Suppressed with eslint-disable (legitimate uses)    |
| React JSX issues                                        | ~5              | Unescaped entities, `priority` → `preload` on Image |

---

## 3. Docker Infrastructure Audit

### docker-compose.yml

| Aspect            | Before                     | After                                                                              |
| ----------------- | -------------------------- | ---------------------------------------------------------------------------------- |
| `version` field   | `'3.8'` (deprecated)       | Removed                                                                            |
| Redis healthcheck | `redis-cli ping` (no auth) | `redis-cli -a $$REDIS_PASSWORD ping`                                               |
| Internal services | Exposed via `ports`        | `expose` only (not host-accessible)                                                |
| Web service       | Missing                    | Added with port 3001                                                               |
| Service discovery | Hardcoded hostnames        | Env vars: `SVC_USER_PROGRESSION_HOST`, `SVC_PAYMENT_HOST`, `WORKER_GAME_LOOP_HOST` |
| DB init           | No seed script             | Volume mount `./scripts/db:/docker-entrypoint-initdb.d`                            |
| Network           | Default                    | Named `app-network` bridge                                                         |
| `NODE_ENV`        | Not set                    | Defaults to `production`                                                           |

### DB Seed Script (`scripts/db/01-init.sql`)

- **~300 lines** of DDL + seed data
- Full schema matching Prisma: 9 tables, 8 enums, all foreign keys, indexes, and constraints
- Seed data: 20 shop items (5 categories), 14 program types (6 categories), 23 achievements (8 condition types)
- `_prisma_migrations` metadata table for Prisma compatibility
- **Eliminatory criterion**: Satisfied

### Web Dockerfile (`apps/web/Dockerfile`)

- Multi-stage build: turbo prune → pnpm install → Next.js build → standalone output
- Healthcheck: `curl -f http://localhost:3000/ || exit 1`
- Follows same pattern as `apps/api-gateway/Dockerfile`

---

## 4. BullMQ & Redis Audit

### Queue configuration

All queue names are centralized in `packages/shared-types/src/index.ts`:

| Queue Name            | Service              | Purpose                      |
| --------------------- | -------------------- | ---------------------------- |
| `CLICK_BUFFER`        | worker-game-loop     | Batch click processing       |
| `PROGRAM_COMPLETION`  | worker-game-loop     | Program completion events    |
| `OFFLINE_CALCULATION` | worker-game-loop     | Offline progress calculation |
| `PROVISION_ORDER`     | svc-payment          | Stripe payment provisioning  |
| `LEADERBOARD_UPDATE`  | svc-user-progression | Leaderboard sync             |
| `ACHIEVEMENT_CHECK`   | svc-user-progression | Achievement evaluation       |

### Redis connection

- All services use `getRedisConfig()` utility from `@repo/redis-client`
- Connection params are fully env-driven: `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_DB`
- `BullModule.forRoot()` registered in 3 services: worker-game-loop, svc-user-progression, svc-payment

### Worker concurrency

| Worker          | Concurrency | Source    |
| --------------- | ----------- | --------- |
| click-buffer    | 10          | Hardcoded |
| program         | 20          | Hardcoded |
| offline         | 10          | Hardcoded |
| provision-order | 5           | Hardcoded |

**Recommendation:** Move concurrency values to environment variables for production tuning without redeployment.

### Rate limiters

No rate limiters configured on any queue. Consider adding for production:

- Click buffer: rate limit to prevent abuse
- Payment provisioning: rate limit for Stripe API compliance

---

## 5. Inter-Service Communication Audit

### Finding: No direct inter-service communication exists

| Pattern                                 | Present?                                   |
| --------------------------------------- | ------------------------------------------ |
| `ClientsModule.register()`              | No                                         |
| `ClientProxy`                           | No                                         |
| `@MessagePattern()` / `@EventPattern()` | No                                         |
| HTTP calls between services             | No                                         |
| gRPC transport                          | No (commented-out stubs with TODO markers) |

### Actual communication pattern

Services communicate **exclusively through Redis**:

1. **Shared Redis data structures**: Services read/write to common Redis keys (e.g., leaderboard sorted sets, user progression hashes)
2. **BullMQ queues**: Indirect communication via job queues — one service enqueues, another dequeues
3. **No request/response**: All communication is fire-and-forget via queues

### Unused code

- `IProgressionServiceClient` interface defined in `packages/shared-types/src/index.ts` but never implemented
- gRPC stubs exist in several files with `// TODO` markers
- Branch `feature/authentification-jwt` has WIP NATS-based communication (`NatsClientsModule`) that was never merged to main

### Implications

- The architecture is **loosely coupled** but lacks a proper service mesh or RPC layer
- Adding NATS or gRPC transport would be the natural next step for request/response patterns
- Current Redis-only approach works for the idle game use case but won't scale for complex cross-service queries

---

## 6. Testing Audit

### Coverage summary

| Service              | Test File                            | Tests  | Stmt% | Branch% | Func% | Line% |
| -------------------- | ------------------------------------ | ------ | ----- | ------- | ----- | ----- |
| svc-user-progression | item-cost-calculator.service.spec.ts | 26     | 92.95 | 88.23   | 100   | 92.95 |
| worker-game-loop     | loot-calculator.service.spec.ts      | 23     | 100   | 100     | 100   | 100   |
| api-gateway          | click-validator.service.spec.ts      | 12     | 97.29 | 84.21   | 100   | 97.29 |
| api-gateway          | heuristic-anti-cheat.service.spec.ts | 12     | 97.33 | 89.74   | 100   | 97.33 |
| **Total**            |                                      | **73** |       |         |       |       |

### Coverage configuration

- **Collected**: `*.service.ts`, `*.controller.ts`, `*.guard.ts`, `*.gateway.ts`, `*.worker.ts`, `*.processor.ts`
- **Excluded**: `*.dto.ts`, `*.entity.ts`, `*.interface.ts`, `*.types.ts`, `*.module.ts`, `main.ts`, `index.ts`

### What is tested

- **Item cost calculator**: Base price, quantity discounts, bulk pricing, edge cases (0 quantity, negative, overflow)
- **Loot calculator**: Drop rates, rarity weighting, random seed reproducibility, empty inventory, legendary drops
- **Click validator**: Throttle enforcement, ban checking, rate limits, concurrent clicks, cooldown periods
- **Heuristic anti-cheat**: Pattern detection, timing analysis, threshold configuration, false positive avoidance

### What is NOT tested

- Controllers (no unit tests — would need e2e/integration)
- WebSocket gateway (`game.gateway.ts`)
- BullMQ workers/processors (would need Redis mock)
- Stripe webhook handler
- Prisma database operations (no database in test environment)

---

## 7. Orphaned Code Cleanup

### Removed directories

| Directory        | Reason                                                               | Status      |
| ---------------- | -------------------------------------------------------------------- | ----------- |
| `apps/api/`      | Turborepo scaffold, never part of real architecture                  | **Deleted** |
| `apps/worker/`   | Only contained `dist/`, superseded by `worker-game-loop`             | **Deleted** |
| `packages/api/`  | Scaffold Link entity, unused                                         | **Deleted** |
| `packages/dtos/` | Source deleted, only compiled dist remained, `@codetyper/` namespace | **Deleted** |

### Remaining concern

- `docker/postgres/init.sql/` — Empty directory owned by root, cannot be deleted without elevated permissions. Not harmful but untidy.

---

## 8. Summary of Phase 2 Deliverables

| Deliverable                    | Status | Commit    |
| ------------------------------ | ------ | --------- |
| TypeScript strict mode enabled | Done   | `b914bd4` |
| All lint errors fixed (0/0)    | Done   | `198b1c2` |
| docker-compose.yml rewritten   | Done   | `262d2a7` |
| DB seed script (eliminatory)   | Done   | `262d2a7` |
| Commitlint + Husky hooks       | Done   | `786fe3e` |
| 73 unit tests, 4 test suites   | Done   | `097341e` |
| Jest coverage config           | Done   | `097341e` |
| turbo.json globalEnv           | Done   | `6ed4973` |
| Web Dockerfile                 | Done   | `6ed4973` |
| Architecture docs              | Done   | `6ed4973` |
| Orphaned scaffold cleanup      | Done   | `f472cc5` |
| ESLint test file overrides     | Done   | `f472cc5` |

### Remaining recommendations

1. **Move worker concurrency to env vars** — Currently hardcoded, should be configurable
2. **Add NATS or gRPC transport** — For proper request/response inter-service communication
3. **Implement `IProgressionServiceClient`** — Currently defined but unused
4. **Add e2e tests** — No integration/e2e tests exist for any service
5. **Add rate limiters** — On BullMQ queues for production safety
6. **CI pipeline** — Ensure `turbo lint`, `turbo build`, and `turbo test` all run in CI
