# Timeless Heroes — Détail des Services

> Documentation exhaustive de chaque microservice : endpoints, logique métier, queues, sujets NATS.
> Dernière mise à jour : Mars 2026

---

## Vue d'ensemble des services

```
┌────────────────────────────────────────────────────────────────────┐
│                       CLIENTS                                       │
│   Web Browser (Next.js)  |  Electron Desktop  |  Keylogger Script  │
└───────────────┬──────────┴──────────┬──────────┴─────────┬─────────┘
                │ HTTP/WebSocket       │ (non connecté)     │ HTTP REST
                │ :3000               │                    │ :3000
                ▼                     │                    ▼
┌───────────────────────────────────────────────────────────────────┐
│                    apps/api-gateway  (port 3000)                   │
│  - AuthController     - GameGateway (Socket.IO /game)             │
│  - TcpIngestController - ClickProcessorService                    │
│  - HeuristicAntiCheatService - HealthController                   │
└──────────────────────┬────────────────────────────────────────────┘
                       │ NATS
          ┌────────────┼────────────┐
          ▼            ▼            ▼
┌─────────────┐  ┌──────────┐  ┌──────────────────────────────────┐
│   NATS      │  │  Redis   │  │  apps/worker-game-loop           │
│  :4222      │  │  :6379   │  │  (BullMQ workers, pas de port HTTP│
└──────┬──────┘  └──────────┘  │  exposé en production)           │
       │                        └──────────────────────────────────┘
       ▼
┌─────────────────────────────────────────────────────────────────┐
│             apps/svc-user-progression (NATS only)               │
│  Gère UserProgression, UserItem, Leaderboard, Levels            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              apps/svc-payment  (port 3002)                      │
│  Stripe Webhooks + Idempotence + BullMQ PAYMENT_PROVISION       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. `apps/api-gateway` — Point d'Entrée Principal

**Port :** 3000 (HTTP + WebSocket) + 9999 (TCP legacy, remplacé par HTTP dans la version sécurisée)

### 1.1 Module Auth

**Fichiers :**
- `src/auth/auth.module.ts`
- `src/auth/auth.controller.ts`
- `src/auth/auth.service.ts`
- `src/auth/strategies/jwt.strategy.ts`
- `src/auth/guards/jwt-auth.guard.ts`
- `src/auth/guards/ws-jwt.guard.ts`

#### Endpoints REST

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/auth/register` | Non | Inscription — `{email, username, password}` → `{accessToken, user}` |
| POST | `/auth/login` | Non | Connexion — `{email, password}` → `{accessToken, user}` |
| GET | `/auth/profile` | JWT | Profil du compte connecté → `{id, email, username}` |

**Logique `register` :**
1. Vérifie que l'email n'existe pas
2. Hash le mot de passe avec bcrypt
3. Crée `User` en DB via Prisma
4. Crée `UserProgression` initialisée (1:1 avec User)
5. Retourne un JWT signé avec `JWT_SECRET`

**Logique `login` :**
1. Cherche l'utilisateur par email
2. Compare le mot de passe avec bcrypt
3. Retourne un JWT signé

**JWT Strategy :** Extrait le token du header `Authorization: Bearer <token>`. Payload : `{sub: userId, email, username}`.

---

### 1.2 Module TCP Ingest (Keylogger)

**Fichiers :**
- `src/tcp-ingest/tcp-ingest.controller.ts`
- `src/tcp-ingest/tcp-ingest.service.ts`
- `src/tcp-ingest/heuristic-anti-cheat.service.ts`

#### Endpoints REST

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/v1/ingest/auth` | Non (JWT en body) | Authentifie une session keylogger |
| POST | `/api/v1/ingest/key` | Session ID | Ingère une frappe clavier |
| GET | `/api/v1/ingest/ping` | Non | Health check du service d'ingest |

**Payload `POST /api/v1/ingest/auth` :**
```json
{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```
**Réponse :**
```json
{ "sessionId": "uuid-v4", "userId": "user-uuid", "success": true }
```

**Payload `POST /api/v1/ingest/key` :**
```json
{
  "userId": "user-uuid",
  "sessionId": "session-uuid",
  "keyCategory": "CHAR",
  "timestamp": 1710000000000,
  "deltaMs": 95
}
```

**Flux de traitement d'une frappe :**
1. Valide que `sessionId` existe dans Redis (`tcp:session:{sessionId}`)
2. Vérifie que `userId` correspond à la session
3. Appelle `HeuristicAntiCheatService.analyze(userId, timestamp, deltaMs)`
4. Si trust score < seuil → retourne `{processed: false, blocked: true}`
5. Appelle `ClickProcessorService.processClick(userId, keyCategory)`
6. Bufferise en Redis via `ClickBufferService.incrementBuffer(userId, locValue)`

#### HeuristicAntiCheatService

```typescript
class HeuristicAntiCheatService {
  async analyze(userId: string, timestamp: number, deltaMs: number): Promise<AnalysisResult> {
    // Stocke les N derniers deltas dans Redis (anticheat:deltas:{userId})
    // Calcule la moyenne et l'écart-type des deltas
    // Vérifie :
    //   - deltaMs < 20ms → superhuman speed (score = 0.0)
    //   - stddev < 5ms → bot-like regularity (score = 0.0)
    //   - Burst soudain > maxCPS → score réduit
    // Retourne: { trustScore: 0.0–1.0, blocked: boolean, reason?: string }
  }
}
```

**Seuils anti-cheat :**
| Condition | Valeur | Action |
|-----------|--------|--------|
| Delta trop court | < 20ms | Bloqué immédiatement |
| Écart-type trop faible | < 5ms | Bloqué (bot détecté) |
| CPS dépassé | > 20/s | Rate limited |

---

### 1.3 Module Click Processor

**Fichiers :**
- `src/click-processor/click-processor.service.ts`

```typescript
class ClickProcessorService {
  processClick(userId: string, keyCategory: KeyCategory): { locValue: number } {
    const baseValue = KEY_BASE_VALUES[keyCategory]; // CHAR=1, ENTER=3, TAB=2...
    const multiplier = await this.getMultiplier(userId); // depuis Redis cache ou DB
    const bonusMultiplier = 1.0; // TODO: BUG-08 — boost system non implémenté
    
    return { locValue: Math.floor(baseValue * multiplier * bonusMultiplier) };
  }
}
```

---

### 1.4 Module GameGateway (WebSocket)

**Fichiers :**
- `src/gateway/game.gateway.ts`

**Namespace Socket.IO :** `/game`
**Port :** 3000 (même que HTTP)
**Auth :** `WsJwtGuard` sur la connexion (vérifie `auth.token`)

#### Événements Client → Serveur

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `{keyType: 'NORMAL'|'SPECIAL'|'FUNCTION', timestamp: number}` | Envoi d'un clic depuis le web |
| `get_state` | `{}` | Demande l'état complet du jeu |
| `purchase` | `{itemSlug: string, quantity: number}` | Achat d'un item boutique |
| `disconnect` | — | Nettoyage session WS |

#### Événements Serveur → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `click_ack` | `{success, locValue, totalLoC, rank}` | Confirmation d'un clic |
| `state_update` | `IGameStateUpdate` | État complet : progression + programmes + event |
| `balance_update` | `IBalanceUpdate` | Mise à jour du solde LoC |
| `leaderboard_update` | `ILeaderboardUpdate` | Classement mis à jour |
| `offline_reward` | `IOfflineReward` | Récompenses AFK calculées à la reconnexion |
| `error` | `{message: string}` | Erreur côté serveur |

**Logique `handleClick` :**
1. Récupère `userId` depuis le token JWT (socket handshake)
2. Appelle `ClickProcessorService.processClick()`
3. Bufferise en Redis
4. Émet `click_ack` avec la valeur calculée

**Logique `handleGetState` :**
1. Appelle `svc-user-progression` via NATS (`progression.get`)
2. Récupère le leaderboard via `LeaderboardService.getTopPlayers()`
3. Construit `IGameStateUpdate` et émet `state_update`

---

### 1.5 Module Health

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/health` | Retourne `{status: "ok", timestamp: ISO}` |

---

## 2. `apps/svc-user-progression` — Microservice Progression

**Communication :** NATS uniquement (pas de port HTTP exposé)
**Pattern :** Request-Reply via `@MessagePattern`

**Fichiers :**
- `src/progression/progression.controller.ts` — Handlers NATS
- `src/progression/progression.service.ts` — Logique métier
- `src/item/item-cost-calculator.service.ts` — Formule coût boutique
- `src/leaderboard/leaderboard-sync.service.ts` — Sync Redis → Postgres

### 2.1 Handlers NATS

| Sujet NATS | Handler | Description |
|------------|---------|-------------|
| `progression.get` | `getProgression(userId)` | Retourne `UserProgression` depuis Prisma |
| `progression.update` | `updateProgression(userId, delta)` | Ajoute LoC/XP/clics, vérifie level-up |
| `progression.purchase` | `processPurchase(userId, itemId, qty)` | Déduit LoC, crée `UserItem`, invalide cache |
| `progression.getLeaderboard` | `getLeaderboard(limit, offset)` | Retourne `LeaderboardSnapshot[]` depuis Postgres |

### 2.2 ProgressionService

```typescript
async updateProgression(userId: string, delta: {
  locToAdd: number;
  xpToAdd: number;
  clicksToAdd: number;
}) {
  // 1. Met à jour UserProgression en Prisma (atomic increment)
  // 2. Met à jour le score dans leaderboard:global Redis
  // 3. Vérifie si level-up : experience >= experienceToNextLevel
  //    → level++, experienceToNextLevel *= 1.5 (arrondi)
  // 4. Invalide le cache progression:${userId}
  // 5. Publie sur channel:balance (Redis Pub/Sub)
}
```

```typescript
async processPurchase(userId: string, itemId: string, quantity: number) {
  // 1. Calcule le coût : baseCost * 1.15^quantitéActuelle
  // 2. Vérifie le solde LoC
  // 3. Déduit le coût de linesOfCode
  // 4. Crée ou incrémente UserItem en DB
  // 5. Applique les effets : met à jour clickMultiplier ou passiveIncomeRate
  // 6. Invalide le cache items:${userId} et progression:${userId}
}
```

### 2.3 ItemCostCalculatorService

```typescript
calculateCost(item: IShopItem, currentOwned: number): number {
  return Math.ceil(item.baseCost * Math.pow(1.15, currentOwned));
}
```

**Exemple pour "junior-dev" (baseCost=1000) :**
| Quantité possédée | Coût |
|-------------------|------|
| 0 | 1 000 |
| 1 | 1 150 |
| 5 | 2 011 |
| 10 | 4 046 |
| 20 | 16 367 |
| 50 | 1 083 657 |

### 2.4 LeaderboardSyncService

```typescript
// Cron job — toutes les 5 minutes
@Cron('*/5 * * * *')
async syncLeaderboard() {
  // 1. Récupère les top 1000 joueurs depuis Redis leaderboard:global
  // 2. Upsert en Prisma (LeaderboardSnapshot, snapshotType='all_time')
  // 3. Met à jour les rangs dans le sorted set Redis
}
```

---

## 3. `apps/worker-game-loop` — Workers BullMQ

**Pas de port HTTP.** Consomme des queues BullMQ (backend Redis).

### 3.1 Click Buffer Worker

**Queue :** `CLICK_BUFFER_FLUSH`

```
ClickBufferFlushService (scheduled, toutes les 5s)
  │
  ├── Scanne Redis KEYS buffer:clicks:*
  ├── Pour chaque userId avec des clics en attente :
  │     └── Enfile un job BullMQ { userId }
  │
  └── ClickBufferWorker (consomme la queue)
        ├── Appelle ClickBufferService.flushBuffer(userId)
        │     → Lit et supprime buffer:clicks:{userId} de Redis
        │     → Retourne { clicks, totalLoC }
        │
        └── [TODO BUG-01] Devrait appeler svc-user-progression via NATS
              Actuellement : écrit directement en Redis (non persisté en DB)
```

**Structure d'un job :**
```typescript
interface ClickBufferJob {
  userId: string;
}
```

### 3.2 Program Processor Worker

**Queue :** `PROGRAM_EXECUTION`

```typescript
// 5 types de programmes définis dans ProgramProcessorService
const PROGRAM_TYPES = {
  fix_typo:            { keyPressesRequired: 50,   locReward: 100,    xpReward: 10,   lootTier: COMMON },
  compile_kernel:      { keyPressesRequired: 500,  locReward: 1500,   xpReward: 100,  lootTier: RARE },
  deploy_microservices:{ keyPressesRequired: 2000, locReward: 8000,   xpReward: 500,  lootTier: EPIC },
  refactor_legacy:     { keyPressesRequired: 1000, locReward: 4000,   xpReward: 250,  lootTier: RARE },
  research_ai:         { keyPressesRequired: 5000, locReward: 25000,  xpReward: 2000, lootTier: LEGENDARY },
};
```

**ProgramWorker — logique de traitement :**
```
1. Récupère UserProgram depuis Prisma
2. Vérifie keyPressesContributed >= keyPressesRequired
3. Appelle LootCalculatorService.calculateLoot(lootTier)
   → Génère LootDrop avec tier aléatoire pondéré
4. Crée LootDrop en DB
5. Met à jour UserProgram.status = COMPLETED
6. [TODO BUG-02] Devrait appeler NATS progression.update avec les récompenses
```

**LootCalculatorService — pondération des tiers :**
```typescript
// Probabilités de drop selon le tier de base du programme
const LOOT_WEIGHTS = {
  COMMON:    { COMMON: 0.70, RARE: 0.25, EPIC: 0.05, LEGENDARY: 0.00 },
  RARE:      { COMMON: 0.40, RARE: 0.45, EPIC: 0.13, LEGENDARY: 0.02 },
  EPIC:      { COMMON: 0.10, RARE: 0.40, EPIC: 0.40, LEGENDARY: 0.10 },
  LEGENDARY: { COMMON: 0.00, RARE: 0.15, EPIC: 0.50, LEGENDARY: 0.35 },
};
```

### 3.3 Offline Calculator Worker

**Queue :** `OFFLINE_CALCULATION`

**OfflineWorker — déclenchement :**
- Déclenché lors de la reconnexion d'un utilisateur (via GameGateway `handleConnect`)
- Payload : `{ userId: string, lastActiveAt: Date }`

**OfflineCalculatorService — logique :**
```typescript
async calculateOfflineRewards(userId: string, lastActiveAt: Date) {
  const offlineDuration = Date.now() - lastActiveAt.getTime();
  const cappedDuration = Math.min(offlineDuration, 8 * 60 * 60 * 1000); // max 8h
  const durationSeconds = cappedDuration / 1000;

  // TODO BUG-10 : hardcodé, devrait récupérer depuis UserProgression
  const stats = { passiveRate: 1, multiplier: 1 };

  const locEarned = stats.passiveRate * stats.multiplier * durationSeconds;
  const xpEarned = Math.floor(durationSeconds / 10);

  // TODO BUG-03 : calcul OK mais le crédit n'est pas appelé
  return { locEarned, xpEarned, duration: durationSeconds };
}
```

---

## 4. `apps/svc-payment` — Service de Paiement

**Port :** 3002

### 4.1 StripeWebhookController

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/stripe/webhook` | Reçoit les webhooks Stripe |

**Flux de traitement webhook :**
```
1. Vérifie la signature Stripe (STRIPE_WEBHOOK_SECRET)
2. Extrait l'event type et les données
3. Pour checkout.session.completed ou payment_intent.succeeded :
   a. Extrait userId, itemId, idempotencyKey depuis metadata Stripe
   b. Crée Transaction en Prisma (status=PENDING)
   c. Enfile un job BullMQ PAYMENT_PROVISION avec IProvisionOrder
4. Retourne 200 OK à Stripe
```

### 4.2 IdempotencyService

```typescript
class IdempotencyService {
  async checkAndLock(idempotencyKey: string): Promise<CheckResult> {
    // Vérifie Redis idempotency:{key}
    // Si COMPLETED → retourne { shouldProcess: false, reason: 'already_completed' }
    // Si PROCESSING (< 5min) → retourne { shouldProcess: false, reason: 'in_progress' }
    // Sinon → acquiert distributed lock, set PROCESSING avec TTL 7j
    //          retourne { shouldProcess: true }
  }

  async markCompleted(idempotencyKey: string, transactionId: string): Promise<void>
  async markFailed(idempotencyKey: string, reason: string): Promise<void>
  async releaseLock(idempotencyKey: string): Promise<void>
}
```

**États Redis pour idempotence :**
```
idempotency:{key} = {
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED',
  createdAt: ISO string,
  transactionId?: string
}
TTL: 7 jours
```

### 4.3 ProvisionOrderProcessor (BullMQ Worker)

```typescript
@Processor(QueueNames.PAYMENT_PROVISION)
class ProvisionOrderProcessor {
  async process(job: Job<IProvisionOrder>) {
    const { idempotencyKey, userId, itemId } = job.data;

    // 1. checkAndLock(idempotencyKey)
    // 2. Détermine le type de provision selon itemId
    // 3. Appelle la méthode appropriée de ProvisionService
    // 4. markCompleted() ou markFailed() + releaseLock()
  }
}
```

### 4.4 ProvisionService (Stubs)

```typescript
class ProvisionService {
  // TODO BUG-04 : Tous ces méthodes sont des stubs vides
  async provisionSubscription(userId: string, tier: SubscriptionTier) { /* TODO */ }
  async provisionPremiumCurrency(userId: string, amount: number) { /* TODO */ }
  async provisionBoost(userId: string, boostType: string, duration: number) { /* TODO */ }
  async provisionCosmetic(userId: string, cosmeticId: string) { /* TODO */ }
}
```

---

## 5. Infrastructure Docker

```yaml
# docker-compose.yml

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: timeless_heroes
      POSTGRES_USER: timeless
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports: ["5432:5432"]
    volumes: [postgres_data:/var/lib/postgresql/data]

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes  # AOF persistence
    ports: ["6379:6379"]
    volumes: [redis_data:/data]

  nats:
    image: nats:2.10-alpine
    command: -js  # JetStream activé
    ports:
      - "4222:4222"   # Client connections
      - "8222:8222"   # HTTP monitoring interface
```

---

## 6. Package `@repo/redis-client`

Utilitaires Redis partagés entre tous les services.

### ClickBufferService

```typescript
class ClickBufferService {
  // Incrémente atomiquement le buffer d'un utilisateur
  async incrementBuffer(userId: string, locValue: number): Promise<void>
  
  // Lit et supprime le buffer (atomic GETDEL-like)
  async flushBuffer(userId: string): Promise<{ clicks: number; locToAdd: number }>
  
  // Retourne tous les userId ayant des clics en attente
  async getAllBufferedUsers(): Promise<string[]>
}
```

### LeaderboardService

```typescript
class LeaderboardService {
  async updateScore(userId: string, newScore: number, type?: 'global'|'weekly'|'daily'): Promise<void>
  async getUserRank(userId: string, type?: string): Promise<number>
  async getTopPlayers(count: number, type?: string): Promise<Array<{userId, score, rank}>>
  async getPlayersAroundUser(userId: string, range?: number): Promise<Array<...>>
  async getTotalPlayers(type?: string): Promise<number>
}
```

### ThrottleService

```typescript
class ThrottleService {
  async checkClickThrottle(userId: string, maxCPS?: number): Promise<boolean>
  async checkRateLimit(action: string, userId: string, limit: number, window: number): Promise<boolean>
  async recordViolation(userId: string): Promise<void>
  async isUserBanned(userId: string): Promise<boolean>
}
```

### DistributedLock

```typescript
class DistributedLock {
  async acquire(lockKey: string, ttl?: number): Promise<string | null>  // retourne lockToken ou null
  async release(lockKey: string, lockToken: string): Promise<boolean>
  async withLock<T>(lockKey: string, fn: () => Promise<T>, ttl?: number): Promise<T>
}
```

---

## 7. Package `@repo/prisma-client`

Client Prisma partagé entre tous les services qui ont besoin d'accès DB.

**Exports :**
- `PrismaService` — NestJS service wrappant `PrismaClient` (connexion managée, `onModuleInit/Destroy`)
- Tous les types Prisma générés : `User`, `UserProgression`, `UserItem`, etc.
- Enums Prisma : `SubscriptionTier`, `ProgramStatus`, `LootTier`, `TransactionStatus`

**Injection dans NestJS :**
```typescript
// Dans n'importe quel module backend NestJS :
@Module({
  imports: [PrismaModule],
  providers: [MonService],
})
class MonModule {}

@Injectable()
class MonService {
  constructor(private prisma: PrismaService) {}

  async getUser(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
```

---

## 8. `apps/api/` — Template Turborepo (Usage Futur)

**Statut :** Template Turborepo — CRUD "links" non lié au jeu.

Ce service est prévu pour un **usage futur** (ex: API publique, liens vers des ressources, partage de profils joueurs). Actuellement, il expose :
- `GET /links` — Liste les liens
- `POST /links` — Crée un lien
- `DELETE /links/:id` — Supprime un lien

Il n'est pas intégré dans la logique de jeu et peut être ignoré pour l'instant.
