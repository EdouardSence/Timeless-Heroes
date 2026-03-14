# Documentation Technique - Timeless Heroes

> Choix de programmation, Docker, linting, tests et CI/CD.
> Derniere mise a jour : Mars 2026

---

## 1. Stack technique

| Composant            | Technologie                 | Version                  |
| -------------------- | --------------------------- | ------------------------ |
| **Monorepo**         | pnpm workspaces + Turborepo | pnpm 8.15.5, turbo 2.8.1 |
| **Backend**          | NestJS                      | -                        |
| **ORM**              | Prisma                      | 5.22.0                   |
| **Base de donnees**  | PostgreSQL                  | 16-alpine                |
| **Cache / Broker**   | Redis + ioredis             | 7-alpine / ioredis 5.4.1 |
| **File d'attente**   | BullMQ                      | 5.25.0                   |
| **WebSocket**        | Socket.IO                   | -                        |
| **Auth**             | JWT + Passport + bcrypt     | -                        |
| **Paiements**        | Stripe                      | -                        |
| **Frontend Web**     | Next.js 16 + React 19       | Turbopack                |
| **Desktop**          | Electron + React + Vite     | electron-builder         |
| **UI Library**       | @repo/ui (Cozy Cyber)       | React 19                 |
| **TypeScript**       | TypeScript                  | 5.8.2                    |
| **Linter**           | ESLint (flat config)        | -                        |
| **Formatter**        | Prettier                    | 3.2.5                    |
| **Tests**            | Jest + ts-jest              | -                        |
| **Conteneurisation** | Docker + Docker Compose     | 3.8                      |

---

## 2. Configuration du monorepo

### 2.1 pnpm Workspaces

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

Chaque application dans `apps/` et chaque librairie dans `packages/` est un workspace independant avec son propre `package.json`.

### 2.2 Turborepo

```json
// turbo.json
{
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "dev": { "cache": false, "persistent": true },
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {},
    "test": {},
    "test:e2e": {}
  }
}
```

**Scripts root disponibles :**

| Script                 | Commande                              |
| ---------------------- | ------------------------------------- |
| `pnpm dev`             | Demarre tous les services en dev      |
| `pnpm dev:gateway`     | Demarre uniquement l'API Gateway      |
| `pnpm dev:progression` | Demarre svc-user-progression          |
| `pnpm dev:worker`      | Demarre worker-game-loop              |
| `pnpm dev:payment`     | Demarre svc-payment                   |
| `pnpm build`           | Build tous les packages/apps          |
| `pnpm test`            | Execute tous les tests                |
| `pnpm lint`            | Execute ESLint sur tout le monorepo   |
| `pnpm format`          | Formate avec Prettier                 |
| `pnpm db:generate`     | Genere le client Prisma               |
| `pnpm db:migrate`      | Execute les migrations Prisma         |
| `pnpm docker:up`       | Demarre tous les conteneurs           |
| `pnpm infra:up`        | Demarre uniquement PostgreSQL + Redis |

### 2.3 Conventions de nommage

| Scope        | Convention    | Exemple                           |
| ------------ | ------------- | --------------------------------- |
| Applications | `@app/<nom>`  | `@app/api-gateway`, `@app/web`    |
| Packages     | `@repo/<nom>` | `@repo/prisma-client`, `@repo/ui` |

---

## 3. TypeScript

### 3.1 Presets de configuration

Le package `@repo/typescript-config` fournit 4 presets :

#### `base.json` (le plus strict)

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "isolatedModules": true,
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  }
}
```

#### `nestjs.json` (relache pour NestJS)

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "node",
    "noImplicitAny": false, // RELACHE
    "strictNullChecks": false, // RELACHE
    "strictBindCallApply": false, // RELACHE
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  }
}
```

#### `nextjs.json` et `react-library.json`

Heritent de `base.json` sans relachement. Strict mode complet.

### 3.2 Ecart par rapport au cahier des charges

**Probleme :** Le cahier des charges exige TypeScript en mode strict avec `noImplicitAny` et `noImplicitNull` (strictNullChecks). Le preset `nestjs.json` desactive ces deux options, ce qui s'applique a tous les backends NestJS (api-gateway, svc-user-progression, worker-game-loop, svc-payment).

**Impact :** Tous les services NestJS compilent sans verification de `null`/`undefined` et acceptent `any` implicite. C'est une source potentielle de bugs runtime et un ecart critique avec les exigences du cours.

**Action requise :** Modifier `packages/typescript-config/nestjs.json` pour activer :

```json
{
  "noImplicitAny": true,
  "strictNullChecks": true,
  "strictBindCallApply": true
}
```

Puis corriger les erreurs TypeScript qui en resultent dans tous les services.

**Note :** Les erreurs LSP deja visibles dans `packages/redis-client/src/index.ts` (5 erreurs `string | undefined not assignable to string`) sont un apercu du travail de correction necessaire.

---

## 4. ESLint (Flat Config)

### 4.1 Architecture du package `@repo/eslint-config`

```
packages/eslint-config/
├── base.js              # Config commune (regles de base)
├── nest.js              # Preset NestJS (node/jest globals, CommonJS)
├── next.js              # Preset Next.js (React, hooks, Next plugin)
├── library.js           # Preset pour librairies Node.js
├── react-internal.js    # Preset React strict (strictTypeChecked)
├── prettier-base.js     # Config Prettier partagee
└── config/
    ├── import.js        # Regles eslint-plugin-import-x
    ├── perfectionist.js # Tri objets/interfaces/enums
    ├── sonarjs.js       # Regles qualite code
    ├── typescript.js    # strictTypeChecked + stylisticTypeChecked
    └── unicorn.js       # Regles unicorn (recommandees)
```

### 4.2 Plugins utilises

| Plugin                        | Role                                              |
| ----------------------------- | ------------------------------------------------- |
| `typescript-eslint`           | Regles TypeScript (strict + stylistic)            |
| `eslint-plugin-unicorn`       | Conventions modernes JavaScript                   |
| `eslint-plugin-import-x`      | Ordre des imports                                 |
| `eslint-plugin-perfectionist` | Tri alphabetique des proprietes                   |
| `eslint-plugin-sonarjs`       | Detection de code smells                          |
| `eslint-plugin-turbo`         | Regles specifiques Turborepo                      |
| `eslint-plugin-only-warn`     | Downgrade toutes les erreurs en warnings          |
| `eslint-config-prettier`      | Desactive les regles conflictuelles avec Prettier |
| `eslint-plugin-react`         | Regles React                                      |
| `eslint-plugin-react-hooks`   | Regles React Hooks                                |
| `@next/eslint-plugin-next`    | Regles Next.js                                    |

### 4.3 Format flat config

Toutes les configurations utilisent le format **flat config** (ESLint v9+) :

- `type: "module"` dans `package.json`
- Export de tableaux d'objets de configuration
- Pas de fichier `.eslintrc` (legacy)
- Utilisation de `projectService: true` pour le linting type-aware

**Conformite cahier des charges :** OK. Le format flat config dans un package dedie est respecte.

### 4.4 Point d'attention

Le plugin `eslint-plugin-only-warn` convertit toutes les erreurs ESLint en simples warnings. Cela signifie que `eslint` ne retournera jamais un code d'erreur non-zero, et donc ne bloquera jamais un pipeline CI. Il faudra soit retirer ce plugin, soit configurer le CI pour echouer egalement sur les warnings (`--max-warnings=0`).

---

## 5. Prettier

Configuration partagee via `@repo/eslint-config/prettier-base.js` :

```javascript
export default {
  singleQuote: true,
  // ... autres options
};
```

Appliquee dans chaque package via `.prettierrc.mjs` :

```javascript
import config from '@repo/eslint-config/prettier-base';
export default config;
```

---

## 6. Docker

### 6.1 docker-compose.yml

Le fichier definit 7 services repartis en 2 categories :

**Infrastructure :**

| Service           | Image              | Port | Configuration                                    |
| ----------------- | ------------------ | ---- | ------------------------------------------------ |
| `postgres`        | postgres:16-alpine | 5432 | AOF, healthcheck `pg_isready`, volume persistant |
| `redis`           | redis:7-alpine     | 6379 | Password auth, AOF, volume persistant            |
| `redis-commander` | rediscommander     | 8081 | Profile `dev` uniquement                         |

**Application :**

| Service                | Dockerfile                           | Ports      | Dependances                         |
| ---------------------- | ------------------------------------ | ---------- | ----------------------------------- |
| `api-gateway`          | apps/api-gateway/Dockerfile          | 3000, 9999 | postgres (healthy), redis (healthy) |
| `svc-user-progression` | apps/svc-user-progression/Dockerfile | 3001       | postgres (healthy), redis (healthy) |
| `worker-game-loop`     | apps/worker-game-loop/Dockerfile     | 3002       | postgres (healthy), redis (healthy) |
| `svc-payment`          | apps/svc-payment/Dockerfile          | 3003       | postgres (healthy), redis (healthy) |

**Dockerfiles :** Multi-stage builds avec `node:20-alpine`. Les volumes delegated permettent le hot-reload en dev.

### 6.2 Script d'initialisation BDD

**Statut : MANQUANT**

Le repertoire `docker/postgres/init.sql/` existe mais est vide. Le cahier des charges exige un script d'initialisation.

**Contenu attendu :**

```sql
-- docker/postgres/init.sql/01-init.sql

-- Creation des tables via Prisma migrations (automatique)
-- Seed des donnees de reference :

-- Items de base
INSERT INTO "Item" (id, name, slug, category, ...) VALUES ...;

-- Types de programmes
INSERT INTO "ProgramType" (id, name, slug, ...) VALUES ...;

-- Achievements
INSERT INTO "Achievement" (id, name, slug, ...) VALUES ...;
```

**Alternative recommandee :** Utiliser le systeme de seed Prisma (`prisma/seed.ts`) monte dans le conteneur postgres via un script d'entrypoint. Ajouter dans `docker-compose.yml` :

```yaml
postgres:
  volumes:
    - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/
```

### 6.3 Variables d'environnement

Le fichier `.env.example` documente toutes les variables necessaires :

| Categorie  | Variables                                                                                      |
| ---------- | ---------------------------------------------------------------------------------------------- |
| Database   | `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `DATABASE_URL`                            |
| Redis      | `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_DB`                                       |
| Auth       | `JWT_SECRET`, `JWT_EXPIRES_IN`                                                                 |
| Stripe     | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLISHABLE_KEY`                         |
| Ports      | `PORT` (3000), `PROGRESSION_PORT` (3001), `WORKER_PORT` (3002), `PAYMENT_PORT` (3003)          |
| Anti-cheat | `MAX_CPS` (20), `THROTTLE_WINDOW_MS` (1000), `MAX_VIOLATIONS` (10), `BAN_DURATION_MS` (300000) |

---

## 7. Tests automatises

### 7.1 Etat actuel

**Couverture : quasi nulle.**

| Localisation                                  | Type | Contenu                      |
| --------------------------------------------- | ---- | ---------------------------- |
| `apps/api/src/app.controller.spec.ts`         | Unit | "Hello World" (scaffold)     |
| `apps/api/src/links/links.controller.spec.ts` | Unit | Smoke test (scaffold)        |
| `apps/api/src/links/links.service.spec.ts`    | Unit | Smoke test (scaffold)        |
| `apps/api/test/app.e2e-spec.ts`               | E2E  | GET / returns 200 (scaffold) |

Les 4 fichiers sont des templates Turborepo dans `apps/api/` (scaffold non utilise). **Aucun test n'existe pour le code metier reel.**

### 7.2 Configuration Jest

Le package `@repo/jest-config` fournit 3 presets :

| Preset | Environnement         | Transform  | Pattern           |
| ------ | --------------------- | ---------- | ----------------- |
| `base` | jsdom                 | -          | -                 |
| `nest` | node                  | ts-jest    | `*.spec.ts`       |
| `next` | jsdom (via next/jest) | next/babel | `*.spec.{ts,tsx}` |

### 7.3 Strategie de tests recommandee

Pour atteindre la conformite avec le cahier des charges :

**Tests unitaires (priorite haute) :**

- `svc-user-progression` : `ProgressionService` (calcul XP, level-up, achat items), `ItemCostCalculatorService` (formule exponentielle, bulk cost)
- `worker-game-loop` : `LootCalculatorService` (drop rates, critical), `OfflineCalculatorModule` (rewards AFK)
- `api-gateway` : `HeuristicAntiCheatService` (detection bot), `ClickProcessorService` (validation, multiplicateurs)
- `svc-payment` : `IdempotencyService` (lock, states), `StripeService` (webhook parsing)

**Tests d'integration :**

- API Gateway : endpoints REST auth (login, register, refresh)
- svc-user-progression : endpoints progression (purchase, leaderboard)
- Worker : flush cycle Redis -> BDD

**Tests E2E :**

- Flux complet : inscription -> connexion -> frappe clavier -> achat item -> lancement programme

**Outils complementaires a considerer :**

- Playwright (deja dans `.gitignore`) pour les tests E2E frontend
- Supertest pour les tests HTTP NestJS
- `@nestjs/testing` pour les modules NestJS

---

## 8. Git et qualite

### 8.1 Conventional Commits

**Statut : Partiellement adopte, non enforce.**

Les 5 derniers commits suivent le format `feat(scope): description` :

```
feat(prisma-client): ajout de l'enumeration RefreshTokenScalarFieldEnum...
feat(prisma): ajout du module et service Prisma...
feat(auth): ajout des DTO pour l'authentification...
feat(auth): ajout du controleur d'authentification...
```

Les commits plus anciens utilisent un style libre en francais :

```
Ajout du worker game-loop pour traitement des clicks en batch
Refactoring Desktop - nouvelle architecture composants et styles
correc macos
```

**Action requise pour conformite :**

1. Installer `commitlint` :

```bash
pnpm add -wD @commitlint/cli @commitlint/config-conventional
```

2. Creer `commitlint.config.js` :

```javascript
export default { extends: ['@commitlint/config-conventional'] };
```

3. Activer le hook Husky `commit-msg` :

```bash
echo 'npx commitlint --edit "$1"' > .husky/commit-msg
```

### 8.2 Husky (Git hooks)

**Statut : Installe mais inactif.**

Husky v9 est installe (runtime dans `.husky/_/`) mais aucun hook utilisateur n'est defini. Les fichiers attendus sont absents :

- `.husky/pre-commit` (linting + formatting)
- `.husky/commit-msg` (commitlint)
- `.husky/pre-push` (tests)

**Configuration recommandee :**

```bash
# .husky/pre-commit
pnpm lint-staged

# .husky/commit-msg
npx commitlint --edit "$1"
```

Ajouter `lint-staged` dans `package.json` :

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml}": ["prettier --write"]
  }
}
```

### 8.3 Branching strategy

Le projet utilise des feature branches avec des Pull Requests :

- `feature/dashboard_stats` (PR #29)
- `feature/integration-script-keylogger` (PR #28)

---

## 9. CI/CD

### 9.1 Etat actuel

**AUCUN pipeline CI/CD n'existe.** Le repertoire `.github/` ne contient qu'un fichier `agents/FRONTEND.agent.md` (agent GitHub Copilot). Il n'y a pas de repertoire `.github/workflows/`.

### 9.2 Pipeline recommande

Creer `.github/workflows/ci.yml` :

```yaml
name: CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 8.15.5
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint --max-warnings=0

  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test
        ports: ['5432:5432']
        options: --health-cmd pg_isready --health-interval 5s --health-timeout 5s --health-retries 5
      redis:
        image: redis:7-alpine
        ports: ['6379:6379']
        options: --health-cmd "redis-cli ping" --health-interval 5s --health-timeout 5s --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm db:generate
      - run: pnpm test

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build

  docker:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - run: docker compose build
```

### 9.3 Etapes supplementaires (futur)

- **Deploy staging** : push des images Docker vers un registry
- **E2E tests** : Playwright contre l'environnement Docker
- **Security scan** : `npm audit`, Snyk ou Trivy
- **Coverage gate** : seuil minimum de couverture de tests

---

## 10. Ecarts critiques et plan de remediation

Synthese des ecarts identifies par rapport au cahier des charges du Master 2 :

| #   | Ecart                                                                | Severite | Effort estime | Action                                                                 |
| --- | -------------------------------------------------------------------- | -------- | ------------- | ---------------------------------------------------------------------- |
| 1   | TypeScript `noImplicitAny`/`strictNullChecks` desactives pour NestJS | CRITIQUE | 2-3 jours     | Modifier `nestjs.json`, corriger les erreurs TS dans tous les services |
| 2   | Zero tests automatises sur le code metier                            | CRITIQUE | 3-5 jours     | Ecrire les tests unitaires et d'integration prioritaires               |
| 3   | Aucun pipeline CI/CD                                                 | CRITIQUE | 0.5 jour      | Creer `.github/workflows/ci.yml`                                       |
| 4   | Conventional Commits non enforces                                    | MAJEUR   | 0.5 jour      | Installer commitlint + hook Husky commit-msg                           |
| 5   | Husky hooks inactifs                                                 | MAJEUR   | 0.5 jour      | Creer pre-commit (lint-staged) et commit-msg                           |
| 6   | Script init BDD manquant                                             | MAJEUR   | 1 jour        | Creer le seed Prisma ou le SQL d'init                                  |
| 7   | svc-user-progression utilise des Maps en memoire                     | MAJEUR   | 1-2 jours     | Integrer Prisma (remplacer Maps par queries)                           |
| 8   | worker-game-loop persiste vers Redis seulement                       | MAJEUR   | 1 jour        | Integrer Prisma dans le flush cycle                                    |
| 9   | Artefacts orphelins (apps/worker, packages/dtos, packages/api)       | MINEUR   | 0.5 jour      | Supprimer les repertoires inutilises                                   |
| 10  | Dashboard web utilise des donnees mockees                            | MINEUR   | 1 jour        | Connecter au vrai API backend                                          |
| 11  | Page d'accueil web = template Turborepo                              | MINEUR   | 0.5 jour      | Designer la landing page du jeu                                        |
| 12  | gRPC non implemente (code commente)                                  | INFO     | 2 jours       | Activer la communication gRPC inter-services                           |
| 13  | Provisioning Stripe = stubs                                          | INFO     | 1-2 jours     | Implementer les 4 types de provision                                   |

**Total effort estime pour conformite minimale (ecarts 1-8) : ~10-14 jours**

---

## 11. Erreurs de compilation connues

Les diagnostics LSP revelent des erreurs existantes :

### `packages/redis-client/src/index.ts` (5 erreurs)

```
Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
```

Causees par l'acces a `process.env.REDIS_HOST` sans verification de nullite. Ces erreurs apparaissent deja avec la configuration actuelle (relachee) et devront etre corrigees avant d'activer `strictNullChecks`.

### `apps/api-gateway/src/main.ts` (1 erreur)

```
Cannot find module 'cookie-parser' or its corresponding type declarations.
```

Le package `@types/cookie-parser` manque dans les devDependencies.

### `apps/desktop/src/main.tsx` (4 erreurs)

```
'Routes' cannot be used as a JSX component.
```

Incompatibilite de versions entre `react-router-dom` et les types React 19. Necessite une mise a jour de `react-router-dom` ou l'ajout de `@types/react` compatible.
