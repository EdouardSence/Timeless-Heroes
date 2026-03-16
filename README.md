# Timeless Heroes

**Dev-Idle Terminal Game** — Un jeu idle/clicker sur le thème du développement, avec un backend NestJS distribué (BullMQ, Redis, NATS, PostgreSQL) et deux frontends : une app Electron desktop et un frontend web Next.js.

> Documentation architecture complète : [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## Table des matières

1. [Architecture](#architecture)
2. [Stack Technique](#stack-technique)
3. [Ports & Services](#ports--services)
4. [Installation](#installation)
5. [Lancement Complet](#lancement-complet)
6. [API Reference](#api-reference)
7. [Configuration (.env)](#configuration-env)
8. [Sécurité & Anti-Cheat](#sécurité--anti-cheat)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENTS                                     │
│                                                                      │
│  ┌──────────────────┐        ┌──────────────────────────────────┐   │
│  │  Desktop (Electron)│      │  Web (Next.js :3001)             │   │
│  │  :4000 (Vite dev) │       │  - Landing / Login               │   │
│  │  - Keylogger local│       │  - Dashboard (stats réelles)     │   │
│  │  - Boutique       │       │  - Jeu (Socket.IO)               │   │
│  │  - Leaderboard    │       │  - Classement                    │   │
│  └────────┬──────────┘       └──────────────┬───────────────────┘   │
└───────────┼──────────────────────────────────┼─────────────────────┘
            │ HTTP REST + WebSocket            │ HTTP REST + WebSocket
            ▼                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   API-GATEWAY  :3000                                 │
│  ┌────────────────┐  ┌─────────────────┐  ┌──────────────────────┐  │
│  │  Auth JWT       │  │  WebSocket /game│  │  REST Ingest         │  │
│  │  /auth/login    │  │  KEY_PRESS      │  │  POST /ingest/key    │  │
│  │  /auth/register │  │  CLICK_PROCESSED│  │  (keylogger desktop) │  │
│  │  /auth/me       │  │  LEADERBOARD    │  └──────────────────────┘  │
│  └────────────────┘  └─────────────────┘                             │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │  REST Progression : /progression/me  /progression/leaderboard│    │
│  └──────────────────────────────────────────────────────────────┘    │
└─────────────────────────┬───────────────────────────────────────────┘
                          │ NATS (publish/subscribe + request/reply)
          ┌───────────────┼────────────────────────────┐
          ▼               ▼                            ▼
┌──────────────────┐ ┌──────────────────┐   ┌──────────────────────┐
│ svc-user-        │ │ worker-game-loop │   │ svc-payment          │
│ progression      │ │ (BullMQ workers) │   │ :3003                │
│ NATS microservice│ │ - click-buffer   │   │ - Stripe Webhook     │
│ - getProgression │ │ - program-proc.  │   │ - Provisioning       │
│ - updateBalance  │ │ - offline-calc.  │   │   (LoC/items/boosts) │
│ - addExperience  │ └────────┬─────────┘   └──────────────────────┘
│ - addItem        │          │ NATS
│ - leaderboard    │ ←────────┘
└──────────┬───────┘
           │ Prisma
           ▼
┌─────────────────┐      ┌──────────────────┐
│   PostgreSQL    │      │      Redis        │
│   :5432         │      │      :6379        │
│ Users           │      │ - Click buffers  │
│ Progressions    │      │ - Leaderboards   │
│ OwnedItems      │      │ - Sessions JWT   │
│ Transactions    │      │ - Boosts actifs  │
└─────────────────┘      │ - Abonnements    │
                         │ - BullMQ queues  │
                         └──────────────────┘
```

---

## Stack Technique

| Composant | Technologie |
|-----------|-------------|
| Framework backend | NestJS (monorepo Turborepo) |
| Base de données | PostgreSQL 16 + Prisma ORM |
| Cache & Message Bus | Redis 7 (Pub/Sub, Sorted Sets, BullMQ) |
| Microservices | NATS 2 |
| File d'attente | BullMQ |
| WebSocket | Socket.IO |
| Auth | JWT + Passport |
| Frontend web | Next.js 16 (App Router) |
| Frontend desktop | Electron 35 + Vite + React |
| Paiements | Stripe |
| Containers | Docker + Docker Compose |
| Package Manager | pnpm 8 + Turborepo |

---

## Ports & Services

| Service | Port | Description |
|---------|------|-------------|
| **API Gateway** | `3000` | HTTP REST + WebSocket `/game` |
| **svc-user-progression** | NATS only | Microservice NATS (pas d'HTTP en dev) |
| **worker-game-loop** | — | BullMQ workers (pas d'HTTP) |
| **svc-payment** | `3003` | HTTP REST + Stripe Webhook |
| **Web (Next.js)** | `3001` | Frontend web (dev) |
| **Desktop (Vite)** | `4000` | Renderer Electron (dev) |
| **PostgreSQL** | `5432` | Base de données |
| **Redis** | `6379` | Cache + BullMQ + Pub/Sub |
| **NATS** | `4222` | Message bus inter-services |
| **NATS monitoring** | `8222` | Dashboard NATS (HTTP) |
| **Redis Commander** | `8081` | GUI Redis (profil `dev`) |

---

## Installation

### Prérequis

- Node.js 18+
- pnpm 8+ (`npm install -g pnpm@8`)
- Docker Desktop

### 1. Cloner et installer

```bash
git clone <repository-url>
cd Timeless-Heroes

# Installer les dépendances
pnpm install
```

> **Windows uniquement :** Si `pnpm install` échoue avec `EBUSY: resource busy or locked` sur `node_modules/electron/dist/resources/default_app.asar`, ferme tous les processus Electron et réessaie. Si le problème persiste, l'antivirus Windows bloque parfois ce fichier temporairement.

### 2. Configurer l'environnement

```bash
cp .env.example .env
```

Édite `.env` et remplace au minimum :
```env
JWT_SECRET=un-secret-de-32-caracteres-minimum-ici
```

Les autres valeurs fonctionnent par défaut pour le développement local.

### 3. Appliquer les migrations de base de données

```bash
# Démarrer PostgreSQL
docker-compose up -d postgres

# Générer le client Prisma
pnpm db:generate

# Appliquer les migrations
pnpm db:migrate
```

---

## Lancement Complet

Il y a deux modes : **tout en Docker** (recommandé pour tester) ou **infra Docker + services locaux** (pour développer).

---

### Mode A — Tout en Docker + frontends locaux (recommandé)

Ce mode démarre tout le backend dans Docker, puis les frontends localement.

#### Étape 1 — Démarrer tout le backend

```bash
# Depuis la racine du projet
docker-compose up -d
```

Cela démarre :
- PostgreSQL `:5432`
- Redis `:6379`
- NATS `:4222` + monitoring `:8222`
- API Gateway `:3000`
- svc-user-progression (NATS)
- worker-game-loop (BullMQ)
- svc-payment `:3003`

Vérifier que tout est healthy :
```bash
docker-compose ps
```

Optionnel — activer Redis Commander (GUI) :
```bash
docker-compose --profile dev up -d redis-commander
# Accessible sur http://localhost:8081
```

#### Étape 2 — Démarrer le frontend Web (Next.js)

Dans un nouveau terminal :
```bash
pnpm -F web dev
# ou
cd apps/web && pnpm dev
```

Accessible sur **http://localhost:3001**

#### Étape 3 — Démarrer l'app Desktop (Electron)

Dans un nouveau terminal :
```bash
cd apps/desktop && pnpm dev
```

Cela lance :
1. Le serveur Vite sur **http://localhost:4000** (renderer React)
2. L'app Electron qui charge `localhost:4000`

L'app apparaît dans la barre des tâches Windows sous forme de widget compact.

---

### Mode B — Infrastructure Docker + services locaux (développement)

Pour le hot-reload sur tous les services backend :

#### Étape 1 — Démarrer uniquement l'infrastructure

```bash
pnpm infra:up
# équivalent de : docker-compose up -d postgres redis nats
```

#### Étape 2 — Lancer tous les services en dev (hot-reload)

```bash
pnpm dev
```

Turbo démarre en parallèle :
- `api-gateway` sur `:3000`
- `svc-user-progression` (NATS)
- `worker-game-loop` (BullMQ)
- `svc-payment` sur `:3003`
- `web` sur `:3001`
- `desktop` sur `:4000` (Vite) + Electron

> **Attention :** En mode `pnpm dev`, `svc-user-progression` utilise le port 3001 comme port NATS d'écoute interne. Il n'y a pas de conflit avec Next.js car le service progression ne monte pas de serveur HTTP en dev.

---

### Launcher Windows intégré

Un script batch est disponible à la racine :

```
START-GAME.bat
```

Il :
1. Vérifie que Docker est lancé
2. Démarre tout le backend via `docker-compose up -d`
3. Ouvre l'app Electron dans un nouveau terminal

---

## Première utilisation

### Créer un compte

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"player@example.com","password":"secret123","username":"Player1"}'
```

Réponse : `{ "access_token": "eyJ..." }`

### Se connecter

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"player@example.com","password":"secret123"}'
```

### Via l'interface web

1. Aller sur **http://localhost:3001**
2. Créer un compte ou se connecter
3. Redirection automatique vers le dashboard
4. Cliquer sur "Jouer" pour accéder au jeu Socket.IO

### Via l'app Desktop

1. Lancer **START-GAME.bat** ou `cd apps/desktop && pnpm dev`
2. Cliquer sur l'icône du widget dans la barre des tâches
3. Aller dans l'onglet "Connexion" et entrer ses identifiants
4. Les frappes clavier sont automatiquement envoyées au backend

---

## API Reference

### Authentification

```http
POST /api/v1/auth/register
Body: { "email": string, "password": string, "username": string }
Response: { "access_token": string }

POST /api/v1/auth/login
Body: { "email": string, "password": string }
Response: { "access_token": string }

GET /api/v1/auth/me
Headers: Authorization: Bearer <token>
Response: { "userId": string, "email": string, "username": string }
```

### Progression

```http
GET /api/v1/progression/me
Headers: Authorization: Bearer <token>
Response: {
  "userId": string,
  "linesOfCode": string,
  "level": number,
  "experience": string,
  "clickMultiplier": number,
  "passiveMultiplier": number,
  "criticalChance": number,
  "criticalMultiplier": number
}

GET /api/v1/progression/leaderboard?type=GLOBAL
Headers: Authorization: Bearer <token>
Query: type = GLOBAL | WEEKLY | DAILY
Response: {
  "success": true,
  "data": {
    "type": "GLOBAL",
    "entries": [{ "userId": string, "score": number, "rank": number }]
  }
}
```

### Ingest (Keylogger Desktop)

```http
POST /api/v1/ingest/auth
Headers: Authorization: Bearer <token>
Body: {}
Response: { "sessionId": string }

POST /api/v1/ingest/key
Headers: Authorization: Bearer <token>
Body: {
  "sessionId": string,
  "keyCategory": "CHAR" | "ENTER" | "SPACE" | "TAB" | "MODIFIER" | "FUNCTION" | "NAVIGATION" | "BACKSPACE" | "UNKNOWN",
  "timestamp": number
}
```

### WebSocket `/game`

```javascript
// Connexion avec auth JWT
const socket = io('http://localhost:3000/game', {
  auth: { token: 'eyJ...' }
});

// Envoyer une frappe
socket.emit('KEY_PRESS', { timestamp: Date.now() });

// Écouter les mises à jour
socket.on('CLICK_PROCESSED', (data) => {
  // { finalValue, newBalance, isCritical, multiplier }
});
socket.on('BALANCE_UPDATE', (data) => {
  // { linesOfCode, level, experience }
});
socket.on('LEADERBOARD_UPDATE', (data) => {
  // [{ userId, username, score, rank, level }]
});
socket.on('OFFLINE_REWARDS', (data) => {
  // { locEarned, xpEarned, durationSeconds }
});
```

---

## Configuration (.env)

| Variable | Description | Défaut |
|----------|-------------|--------|
| `DATABASE_URL` | URL PostgreSQL complète | `postgresql://timeless:timeless_secret@localhost:5432/timeless_heroes` |
| `REDIS_HOST` | Host Redis | `localhost` |
| `REDIS_PORT` | Port Redis | `6379` |
| `REDIS_PASSWORD` | Mot de passe Redis | `redis_secret` |
| `JWT_SECRET` | **Requis** — min 32 caractères | — |
| `JWT_EXPIRES_IN` | Durée du token | `7d` |
| `NATS_URL` | URL du serveur NATS | `nats://localhost:4222` |
| `MAX_CPS` | Clics max par seconde (anti-cheat) | `20` |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe | `whsec_...` |

---

## Sécurité & Anti-Cheat

### Keylogger Desktop

- **Anonymisation** : seule la *catégorie* de touche est envoyée (CHAR, ENTER, TAB...), jamais la touche réelle ni son code
- **Authentification JWT** : obligatoire avant tout envoi
- **Anti-cheat** : détection heuristique des bots
  - Max 20 CPS (configurable via `MAX_CPS`)
  - Intervalle minimum 30ms entre deux touches
  - Régularité de timing suspecte → ban temporaire

### Boosts & Abonnements (Redis)

Les boosts et abonnements achetés sont stockés dans Redis avec TTL :

```
boost:{userId}:{boostType}   → JSON { multiplier, activatedAt, expiresAt }  — TTL = durationSeconds
subscription:{userId}        → JSON { type, activatedAt, expiresAt }         — TTL = durationDays × 86400
```

Multiplicateurs d'abonnement : `PREMIUM=1.5×` · `VIP=2.0×` · `ELITE=3.0×`

### Idempotence des Paiements

Chaque webhook Stripe est traité exactement une fois grâce à une clé d'idempotence Redis :

```
idempotency:{key}   → { status: PROCESSING | COMPLETED | FAILED, createdAt }  — TTL 7 jours
lock:payment:{key}  → distributed lock (30s TTL)
```

---

## Prochaines étapes

- [ ] Intégration gRPC pour communication inter-services
- [ ] Système de prestige
- [ ] Événements temporaires
- [ ] Achievements (infrastructure Redis déjà en place)
- [ ] Guildes / Équipes
- [ ] Mode compétitif PvP

---

## License

MIT © Timeless-Heroes Team
