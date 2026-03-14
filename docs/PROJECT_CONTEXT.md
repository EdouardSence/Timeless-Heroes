# Timeless Heroes — Contexte Projet

> Fichier de référence principal destiné à toute IA ou développeur rejoignant le projet.
> Dernière mise à jour : Mars 2026

---

## 1. Vision & Concept

**Timeless Heroes** est un jeu de type **Idle/Clicker** sur le thème du développement informatique.

### Mécanique centrale
Les **vraies frappes clavier** de l'utilisateur pendant son travail quotidien génèrent de la monnaie in-game appelée **"Lines of Code" (LoC)**. Le joueur accumule des LoC pour acheter des upgrades, lancer des programmes en arrière-plan, et grimper dans un classement mondial.

### Concept UX
- Un **overlay desktop discret** (Electron, toujours visible, draggable) affiche le score en temps réel pendant que le joueur code/travaille
- Un **dashboard web** permet de gérer la progression, la boutique, et les programmes
- Le jeu fonctionne **en permanence en arrière-plan** — même sans interagir, le revenu passif continue

### Public cible
Développeurs et étudiants en informatique — le jeu transforme leur activité quotidienne (taper du code) en progression de jeu.

---

## 2. Structure du Monorepo

Le projet utilise **Turborepo + pnpm workspaces**. La structure complète :

```
Timeless-Heroes/
├── turbo.json                     Pipeline Turborepo (build, dev, lint, test)
├── package.json                   Root — workspaces pnpm
├── pnpm-workspace.yaml            Déclaration des workspaces
├── docker-compose.yml             Infrastructure : PostgreSQL, Redis, NATS
├── .env / .env.example            Variables d'environnement
│
├── apps/
│   ├── api-gateway/               NestJS — Point d'entrée HTTP/WebSocket/TCP (port 3000)
│   ├── svc-user-progression/      NestJS — Microservice NATS, propriétaire des stats joueur
│   ├── worker-game-loop/          NestJS — Workers BullMQ (click flush, programmes, offline)
│   ├── svc-payment/               NestJS — Webhooks Stripe + provisioning (port 3002)
│   ├── web/                       Next.js App Router — Frontend web (port 3001)
│   ├── desktop/                   Electron + Vite + React — Overlay desktop (port 4000 dev)
│   ├── keylogger/                 Scripts plateforme : hook clavier global (Windows/macOS/Linux)
│   └── api/                       NestJS stub — Template Turborepo (CRUD "links"), prévu pour
│                                  un usage futur (ex: API publique, liens vers ressources)
│
└── packages/
    ├── shared-types/              Tous les types TS, DTOs, constantes, catalogue boutique
    ├── prisma-client/             Schéma Prisma + client généré
    ├── redis-client/              Utilitaires Redis : ClickBuffer, Leaderboard, Throttle, DistributedLock
    ├── ui/                        Design system React "Cozy Cyber" (4 composants)
    ├── api/                       Entités NestJS partagées (templates Turborepo)
    ├── eslint-config/             Config ESLint partagée
    ├── jest-config/               Config Jest partagée
    └── typescript-config/         Bases tsconfig partagées
```

---

## 3. Stack Technique

| Couche | Technologie | Version | Rôle |
|--------|-------------|---------|------|
| **Monorepo** | Turborepo + pnpm | pnpm 8+ | Build pipeline, workspaces |
| **Backend framework** | NestJS | v10 | Tous les services backend |
| **Base de données** | PostgreSQL | 16 | Persistance principale |
| **ORM** | Prisma | v5 | Schéma, migrations, client |
| **Cache & Buffer** | Redis | 7 | Hot storage, Pub/Sub, BullMQ backend |
| **Message broker** | NATS | 2.10 | Communication inter-microservices |
| **File de tâches** | BullMQ | v4 | Jobs asynchrones (flush, offline, payment) |
| **WebSocket** | Socket.IO | v4 | Temps réel client ↔ gateway |
| **Auth** | JWT + Passport | — | Authentification stateless |
| **Paiements** | Stripe | — | Webhooks, checkout sessions |
| **Frontend web** | Next.js App Router | v14 | Dashboard + interface jeu |
| **Frontend desktop** | Electron + Vite + React | Electron 29 | Overlay toujours visible |
| **Hook clavier** | uiohook-napi (desktop) / PowerShell WinAPI (keylogger) | — | Capture globale des frappes |
| **Containerisation** | Docker + Docker Compose | — | Déploiement infrastructure |
| **Langage** | TypeScript | v5 | Tous les packages |

---

## 4. Infrastructure Docker

```yaml
# docker-compose.yml — 3 services d'infrastructure
postgres:
  image: postgres:16-alpine
  port: 5432
  database: timeless_heroes
  user: timeless

redis:
  image: redis:7-alpine
  port: 6379
  persistence: AOF (appendonly yes)

nats:
  image: nats:2.10-alpine
  ports: 4222 (client), 8222 (monitoring)
  flags: --jetstream
```

---

## 5. Variables d'Environnement

```bash
# Base de données
DATABASE_URL=postgresql://timeless:password@localhost:5432/timeless_heroes

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# NATS
NATS_URL=nats://localhost:4222

# Auth
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Anti-cheat
MAX_CPS=20                    # Max clics par seconde (défaut: 20)

# Stripe (svc-payment)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Ports services
API_GATEWAY_PORT=3000
TCP_INGEST_PORT=9999
SVC_PROGRESSION_PORT=3001
SVC_PAYMENT_PORT=3002
WORKER_PORT=3003

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

---

## 6. Flux de Données Principal

```
[Clavier Utilisateur]
        │
        ▼
[Keylogger Script]  ──── HTTP POST /api/v1/ingest/key ────►  [api-gateway: TcpIngestController]
(PS1 / bash)                                                          │
                                                                      ▼ Anti-cheat (variance timing)
                                                               [ClickProcessorService]
                                                                      │ Calcule locValue
                                                                      ▼
                                                               [Redis: buffer:clicks:{userId}]
                                                                      │
                                                      ──── toutes les 5s ────
                                                                      ▼
                                                        [BullMQ: CLICK_BUFFER_FLUSH]
                                                                      │
                                                                      ▼
                                                           [ClickBufferWorker]
                                                                      │ NATS: progression.update
                                                                      ▼
                                                           [svc-user-progression]
                                                                      │
                                                     ┌────────────────┴────────────────┐
                                                     ▼                                 ▼
                                            [PostgreSQL: UserProgression]   [Redis: leaderboard:global]
                                                                      │
                                                                      ▼ NATS Pub/Sub
                                                               [api-gateway]
                                                                      │ Socket.IO
                                                                      ▼
                                                               [Web Browser / App]

[Stripe Webhook] ──► [svc-payment] ──BullMQ: PAYMENT_PROVISION──► [ProvisionOrderProcessor]
                                                                          │ (TODO: NATS vers progression)
                                                                          ▼
                                                                   [UserProgression]
```

---

## 7. Communication Inter-Services

### NATS (microservices)
Le pattern request-reply NATS est utilisé entre `api-gateway` → `svc-user-progression`.

```typescript
// Sujets NATS définis dans @repo/shared-types (NatsSubjects)
'progression.get'           // Récupérer progression d'un joueur
'progression.update'        // Mettre à jour LoC/XP/clics
'progression.purchase'      // Acheter un item boutique
'progression.getLeaderboard' // Obtenir le classement
```

### BullMQ (workers asynchrones)
```typescript
// Queues définies dans @repo/shared-types (QueueNames)
'CLICK_BUFFER_FLUSH'    // Flush Redis → PostgreSQL (toutes les 5s)
'PROGRAM_EXECUTION'     // Traitement fin de programme
'OFFLINE_CALCULATION'   // Calcul récompenses AFK
'PAYMENT_PROVISION'     // Provisioning après paiement Stripe
```

### Redis Pub/Sub (notifications temps réel)
```typescript
// Canaux Redis (RedisKeys)
'channel:balance'       // Mise à jour solde LoC
'channel:achievement'   // Achievements débloqués
'channel:leaderboard'   // Mise à jour classement
```

---

## 8. Package Partagé : @repo/shared-types

C'est le **package central** du monorepo — tout code partagé entre services passe par là.

Il contient :
- Toutes les interfaces TypeScript (`IUserProgression`, `IShopItem`, `IProgram`, `IClickEvent`, etc.)
- Tous les enums (`ProgramStatus`, `LootTier`, `SubscriptionTier`, `KeyCategory`, etc.)
- Le catalogue de la boutique (`SHOP_ITEMS` — 8 items avec formule de coût)
- Les types de définition des programmes (`PROGRAM_TYPES` — 5 programmes)
- Les constantes de nommage (`QueueNames`, `NatsSubjects`, `RedisKeys`)
- Les types WebSocket events (`IBalanceUpdate`, `IGameStateUpdate`, `ILeaderboardUpdate`)
- Les types TCP ingest (`ITcpKeyEvent`, `ITcpAuthRequest`, `ITcpKeyResponse`)
- Les types paiement (`IStripeWebhookEvent`, `IProvisionOrder`, `IPaymentTransaction`)

---

## 9. Démarrage du Projet

### Développement local

```bash
# 1. Installer les dépendances
pnpm install

# 2. Copier et configurer les variables d'environnement
cp .env.example .env

# 3. Démarrer l'infrastructure (PostgreSQL, Redis, NATS)
docker-compose up -d postgres redis nats

# 4. Générer le client Prisma
pnpm -F @repo/prisma-client generate

# 5. Appliquer les migrations DB
pnpm -F @repo/prisma-client migrate:dev

# 6. Démarrer tous les services en mode dev (watch)
pnpm dev

# Services disponibles :
#   http://localhost:3000  — api-gateway (REST + WebSocket)
#   http://localhost:3001  — web (Next.js)
#   http://localhost:3002  — svc-payment
#   ws://localhost:3000/game — WebSocket Socket.IO
#   tcp://localhost:9999   — TCP ingest (keylogger)
```

### Lancer le keylogger (Windows)
```powershell
# 1. Se connecter sur http://localhost:3001 et récupérer son JWT
$token = "votre-jwt-token"

# 2. Lancer le hook clavier sécurisé
./apps/keylogger/keyboard-hook-secure.ps1 -Token $token
```

### Scripts de démarrage rapide
```
START-GAME.bat          Windows — Lance tout en un clic
launch-game.sh          Linux/macOS
launch-game-macos.sh    macOS spécifique
Launch-Game.ps1         PowerShell
```

### Production Docker
```bash
docker-compose up -d --build
```

---

## 10. État du Projet (Mars 2026)

### Ce qui fonctionne
- Auth complète (register/login/JWT)
- Keylogger Windows avec anonymisation et anti-cheat
- Buffering Redis + BullMQ workers (scaffold)
- Schéma Prisma complet avec migrations
- App Electron desktop autonome (game loop local)
- Design system `@repo/ui` complet
- Dashboard web (UI mockée)
- Infrastructure NATS + structure microservices

### Ce qui est en cours / incomplet
Voir `docs/TODOS.md` pour la liste exhaustive des TODOs et BUGs.

Les **4 connexions manquantes critiques** :
1. Click buffer worker → Prisma (écrit encore en Redis)
2. Program completion → progression service (NATS commenté)
3. Offline rewards → non crédités
4. Payment provisioning → stubs vides

---

## 11. Conventions de Code

- **Langage** : TypeScript strict sur tous les packages
- **Framework backend** : NestJS avec décorateurs (`@Injectable`, `@Controller`, `@Module`)
- **Nommage modules** : `feature.module.ts`, `feature.service.ts`, `feature.controller.ts`
- **DTOs** : Validés avec `class-validator` + `class-transformer`
- **Imports** : Chemins `@repo/...` pour les packages partagés
- **Linting** : ESLint config partagée (`@repo/eslint-config`)
- **Tests** : Jest config partagée (`@repo/jest-config`)
- **Formatting** : Prettier (`.prettierrc.mjs`)

---

## 12. Fichiers de Documentation

| Fichier | Contenu |
|---------|---------|
| `docs/PROJECT_CONTEXT.md` | **Ce fichier** — Vue d'ensemble complète |
| `docs/SPECS.md` | Liste exhaustive des SPECS avec statuts |
| `docs/DATA_MODELS.md` | Schéma Prisma + types/interfaces partagés |
| `docs/SERVICES.md` | Détail de chaque microservice |
| `docs/FRONTEND.md` | Web + Desktop : routes, composants, état |
| `docs/GAME_MECHANICS.md` | Toutes les mécaniques de jeu et formules |
| `docs/TODOS.md` | TODOs et BUGs avec priorités |
| `docs/ARCHITECTURE.md` | Architecture distribuée et sécurité |
| `README.md` | Installation, API reference, schéma de données |
