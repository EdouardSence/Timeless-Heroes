# Timeless Heroes — TODOs & Bugs

> Tableau de bord complet de tous les travaux, classés par priorité.
> Dernière mise à jour : Mars 2026 — **Session sync desktop ↔ server + double-count/crash fixes**

---

## Légende

| Symbole | Signification |
|---------|---------------|
| ✅ | Corrigé / Implémenté |
| ⏭️ | Ignoré volontairement |
| 🚀 | Roadmap future |

| Priorité | Signification |
|----------|---------------|
| **P0** | Bloquant — le jeu ne fonctionne pas sans ce fix |
| **P1** | Important — fonctionnalité dégradée ou données incorrectes |
| **P2** | Amélioration — qualité de code ou UX |
| **P3** | Nice-to-have — optimisation ou future feature |

---

## BUGs Critiques (P0) — Tous résolus ✅

### ✅ BUG-01 — Click buffer worker → NATS

| Champ | Valeur |
|-------|--------|
| **Fichier** | `apps/worker-game-loop/src/click-buffer/click-buffer.worker.ts` |
| **Gravité** | P0 |
| **Status** | **CORRIGÉ** |

**Problème :** Le ClickBufferWorker écrivait le résultat en Redis au lieu d'appeler `svc-user-progression` via NATS.

**Fix appliqué :** Réécriture complète du worker. Appels NATS vers `PROGRESSION_UPDATE_BALANCE` et `PROGRESSION_ADD_EXPERIENCE`. Module mis à jour avec `ClientsModule.registerAsync` pour injecter le `ClientProxy` NATS.

---

### ✅ BUG-02 — Complétion de programme ne crédite pas le joueur

| Champ | Valeur |
|-------|--------|
| **Fichier** | `apps/worker-game-loop/src/program-processor/program.worker.ts` |
| **Gravité** | P0 |
| **Status** | **CORRIGÉ** |

**Problème :** Le `ProgramWorker` marquait le programme comme `COMPLETED` mais l'appel NATS pour créditer LoC/XP/loot était commenté.

**Fix appliqué :** Ajout des appels NATS `PROGRESSION_UPDATE_BALANCE`, `PROGRESSION_ADD_EXPERIENCE` et `PROGRESSION_ADD_ITEM` (pour chaque item du loot drop). Notification Redis Pub/Sub émise après crédit. Module mis à jour.

---

### ✅ BUG-03 — Récompenses offline calculées mais non créditées

| Champ | Valeur |
|-------|--------|
| **Fichier** | `apps/worker-game-loop/src/offline-calculator/offline.worker.ts` |
| **Gravité** | P0 |
| **Status** | **CORRIGÉ** |

**Problème :** `OfflineCalculatorService.calculateOfflineRewards()` calculait correctement les LoC/XP mais l'appel de crédit vers la progression était commenté.

**Fix appliqué :** Appels NATS `PROGRESSION_UPDATE_BALANCE` et `PROGRESSION_ADD_EXPERIENCE` ajoutés après calcul. Module mis à jour.

---

### ✅ BUG-04 — Provisioning des paiements non implémenté

| Champ | Valeur |
|-------|--------|
| **Fichier** | `apps/svc-payment/src/provision/provision.service.ts` |
| **Gravité** | P0 |
| **Status** | **CORRIGÉ** |

**Problème :** Les 4 méthodes de provisioning (`provisionPremiumCurrency`, `provisionItemPack`, `provisionSubscription`, `provisionBoost`) étaient des stubs vides.

**Fix appliqué :**
- `provisionPremiumCurrency` → NATS `PROGRESSION_UPDATE_BALANCE`
- `provisionItemPack` → NATS `PROGRESSION_ADD_ITEM` pour chaque item
- `provisionSubscription` → Redis `SET subscription:{userId}` avec TTL (durationDays × 86400s), JSON `{ type, activatedAt, expiresAt, durationDays }`
- `provisionBoost` → Redis `SET boost:{userId}:{boostType}` avec TTL (durationSeconds), JSON `{ multiplier, activatedAt, expiresAt }`
- `payment.module.ts` mis à jour avec `ClientsModule.registerAsync` + provider Redis

---

### ✅ BUG-05 — Frontend web ne se connecte pas au bon WebSocket

| Champ | Valeur |
|-------|--------|
| **Fichier** | `apps/web/app/game/page.tsx` |
| **Gravité** | P0 |
| **Status** | **CORRIGÉ** |

**Problème :** La page de jeu web était un template statique sans connexion Socket.IO, avec 6 items hardcodés.

**Fix appliqué :** Réécriture complète. Connexion Socket.IO vers `http://localhost:3000/game` avec JWT depuis `localStorage`. Tous les events utilisent les constantes `WebSocketEvent` de `@repo/shared-types`. Écouteur clavier qui émet `KEY_PRESS`. Catalogue de la boutique migré vers `SHOP_ITEMS` de `@repo/shared-types` (TD-02 simultané).

---

## BUGs Importants (P1) — Tous résolus ✅

### ✅ BUG-06 — Desktop non connecté au backend

| Champ | Valeur |
|-------|--------|
| **Fichiers** | `apps/desktop/electron/main.ts`, `electron/preload.ts`, `src/types/electron.d.ts`, `src/components/Auth.tsx` |
| **Gravité** | P1 |
| **Status** | **CORRIGÉ** |

**Problème :** L'app Electron fonctionnait en mode offline complet, sans authentification ni envoi de données au backend. L'app ouvrait directement le widget sans demander de credentials.

**Fix appliqué :** Classe `BackendSync` dans `main.ts` :
- `POST /api/v1/auth/login` → récupère JWT + userId
- `POST /api/v1/auth/register` → crée un compte, puis auto-login (`BackendSync.register()`)
- `POST /api/v1/ingest/auth` → crée une session ingest (sessionId)
- Buffer de keystrokes flush toutes les 3s vers `POST /api/v1/ingest/key`
- Anonymisation des touches via `classifyKeyCode()` (CHAR, ENTER, SPACE, TAB, MODIFIER, FUNCTION, NAVIGATION, BACKSPACE, UNKNOWN)
- `tryRestoreSession()` retourne `boolean` — gère le flux de démarrage
- Fenêtre `authWindow` (420×560, frameless) créée si session absente → route `/#/auth`
- Composant `Auth.tsx` — formulaire login/register cozy cyberpunk avec tabs, spinner, shake on error
- IPC `launch-game` — ferme authWindow, ouvre widget+menu, démarre le jeu
- APIs exposées via `preload.ts` : `backendLogin`, `backendRegister`, `backendLogout`, `backendStatus`, `launchGame`, `onBackendStatus`

---

### ✅ BUG-07 — Leaderboard avec usernames/levels hardcodés

| Champ | Valeur |
|-------|--------|
| **Fichier** | `apps/api-gateway/src/gateway/game.gateway.ts` |
| **Gravité** | P1 |
| **Status** | **CORRIGÉ** |

**Problème :** `handleGetLeaderboard` et `sendInitialData` envoyaient des usernames fictifs (`Player_xxx`) et un level hardcodé à `1`.

**Fix appliqué :**
- `handleConnection` stocke `username` dans le JSON de session Redis
- `sendInitialData` lit le username depuis la session Redis de chaque userId du leaderboard
- Level réel récupéré via NATS `PROGRESSION_GET` pour chaque joueur en parallèle

---

### ✅ BUG-08 — Boost/multiplicateur non appliqué aux clics

| Champ | Valeur |
|-------|--------|
| **Fichier** | `apps/api-gateway/src/click-processor/click-processor.service.ts` |
| **Gravité** | P1 |
| **Status** | **CORRIGÉ** |

**Problème :** `bonusMultiplier` était hardcodé à `1.0` — boosts et abonnements ignorés.

**Fix appliqué :** Méthode `getActiveBoostMultiplier(userId)` :
- Lit `boost:{userId}:*` via Redis KEYS + MGET → stack multiplicatif
- Lit `subscription:{userId}` → PREMIUM=1.5×, VIP=2.0×, ELITE=3.0×
- Fallback silencieux à `1.0` en cas d'erreur Redis

---

### ✅ BUG-09 — Dashboard web avec données mockées

| Champ | Valeur |
|-------|--------|
| **Fichier** | `apps/web/app/dashboard/page.tsx` |
| **Gravité** | P1 |
| **Status** | **CORRIGÉ** |

**Problème :** Le dashboard affichait des données statiques hardcodées.

**Fix appliqué :**
- Appels parallèles à `GET /api/v1/auth/me` et `GET /api/v1/progression/me` au montage
- États de loading/error gérés
- Données réelles de progression affichées (LoC, level, XP, multiplicateurs)
- Création du endpoint `GET /api/v1/progression/me` dans `ProgressionController` (nouveau fichier)
- `ProgressionModule` enregistré dans `app.module.ts`

---

### ✅ BUG-10 — Calcul offline avec stats hardcodées

| Champ | Valeur |
|-------|--------|
| **Fichier** | `apps/worker-game-loop/src/offline-calculator/offline-calculator.service.ts` |
| **Gravité** | P1 |
| **Status** | **CORRIGÉ** |

**Problème :** `getUserOfflineStats` retournait `passiveRate=1, multiplier=1` hardcodé pour tous les joueurs.

**Fix appliqué :** Appel NATS `PROGRESSION_GET` pour récupérer le `passiveMultiplier` réel du joueur. Fallback sur les valeurs par défaut en cas d'erreur.

---

### ✅ BUG-11 — Compte réinitialisé au redémarrage (session perdue)

| Champ | Valeur |
|-------|--------|
| **Fichier** | `apps/desktop/electron/main.ts` |
| **Gravité** | P1 |
| **Status** | **CORRIGÉ** |

**Problème :** Si Docker n'était pas encore disponible au moment du démarrage de l'app Electron, `tryRestoreSession()` recevait une erreur réseau et appelait `this.logout()`, effaçant les credentials valides. Au prochain démarrage, l'utilisateur semblait avoir "perdu son compte".

**Fix appliqué :** Dans le `catch` de `tryRestoreSession()`, suppression de l'appel `this.logout()`. Les credentials sont conservés en cas d'erreur réseau. L'utilisateur voit la fenêtre d'auth et peut se reconnecter sans re-créer de compte.

---

### ✅ BUG-12 — Leaderboard desktop affiche des userId (UUID) au lieu des usernames

| Champ | Valeur |
|-------|--------|
| **Fichiers** | `apps/svc-user-progression/src/services/leaderboard-sync.service.ts`, `apps/desktop/src/components/Menu.tsx`, `apps/desktop/src/types/electron.d.ts` |
| **Gravité** | P1 |
| **Status** | **CORRIGÉ** |

**Problème :** `getLeaderboard()` retournait les entrées Redis brutes avec seulement `userId`. L'UI affichait `userId.slice(0, 8)...`.

**Fix appliqué :**
- `leaderboard-sync.service.ts` : après `getTopPlayers()`, batch-fetch des usernames via `prisma.user.findMany({ where: { id: { in: userIds } } })`. Les entrées sont enrichies avec le champ `username` (fallback sur `userId` si introuvable).
- `LeaderboardEntry` dans `electron.d.ts` : ajout du champ `username: string`
- `Menu.tsx` : rendu `{entry.username}` au lieu de `{entry.userId.slice(0,8)}...`

---

### ✅ BUG-13 — Leaderboard desktop ne se rafraîchit pas automatiquement

| Champ | Valeur |
|-------|--------|
| **Fichier** | `apps/desktop/src/components/Menu.tsx` |
| **Gravité** | P1 |
| **Status** | **CORRIGÉ** |

**Problème :** Le leaderboard n'était chargé qu'une seule fois à l'activation de l'onglet (`useEffect` sur `[activeTab, backendOnline]`). Après la première visite, les données ne se mettaient plus à jour.

**Fix appliqué :**
- `fetchLeaderboard()` extrait en fonction nommée (réutilisable)
- `setInterval` de 15 secondes pendant que l'onglet leaderboard est actif, nettoyé au changement d'onglet
- Bouton "Actualiser" (🔄) ajouté dans le header du panel leaderboard
- Le spinner s'affiche uniquement si la liste est vide (évite le flash sur les rafraîchissements)

---

### ✅ BUG-14 — Port accumulation au relancement (START-GAME.bat)

| Champ | Valeur |
|-------|--------|
| **Fichier** | `START-GAME.bat` |
| **Gravité** | P1 |
| **Status** | **CORRIGÉ** |

**Problème :** Chaque lancement de `START-GAME.bat` ouvrait une nouvelle fenêtre `pnpm dev` sans tuer les anciennes. Les processus Vite/Electron précédents restaient actifs sur les ports 4000–4010.

**Fix appliqué :** Ajout au step `[0/5]` d'une boucle `for /f` sur `netstat -ano` pour trouver et `taskkill /PID` tous les processus écoutant sur les ports 4000–4010 avant le démarrage.

---

### ✅ BUG-15 — Pipeline keystrokes cassé : type WRONGTYPE Redis dans reAddToBuffer

| Champ | Valeur |
|-------|--------|
| **Fichier** | `apps/worker-game-loop/src/click-buffer/click-buffer.worker.ts` |
| **Gravité** | P1 |
| **Status** | **CORRIGÉ** |

**Problème :** `reAddToBuffer()` utilisait un script Lua avec `redis.call('SET', ...)` (type string) pour re-stocker les données en cas d'échec de flush. `ClickBufferService.incrementBuffer()` utilise `HINCRBY` (type hash). Ce conflit de type Redis causait une erreur `WRONGTYPE` qui rendait les données de buffer irrécupérables et bloquait les futures mises à jour.

**Fix appliqué :** Remplacement du Lua script par `redis.hincrby(key, 'clicks', clicks)` et `redis.hincrbyfloat(key, 'locToAdd', ...)` — même type hash que `ClickBufferService`.

---

### ✅ BUG-16 — Score leaderboard décroît après achat en boutique

| Champ | Valeur |
|-------|--------|
| **Fichiers** | `apps/worker-game-loop/src/click-buffer/click-buffer.worker.ts`, `packages/shared-types/src/index.ts`, `apps/svc-user-progression/src/services/progression.service.ts` |
| **Gravité** | P1 |
| **Status** | **CORRIGÉ** |

**Problème :** `click-buffer.worker.ts:75` mettait à jour le leaderboard avec `updatedProgression.linesOfCode` (balance courante, qui diminue lors d'achats). Après un achat en boutique, le score leaderboard du joueur pouvait donc baisser.

**Fix appliqué :**
- `IProgressionData` dans `@repo/shared-types` : ajout du champ `totalLinesWritten: string` (monotoniquement croissant).
- `toProgressionData()` dans `progression.service.ts` : exposition du champ `totalLinesWritten` dans le DTO.
- `click-buffer.worker.ts` : utilisation de `updatedProgression.totalLinesWritten` pour `leaderboardService.updateScore()`.

---

### ✅ BUG-17 — Nouveaux utilisateurs absents du leaderboard jusqu'au premier flush

| Champ | Valeur |
|-------|--------|
| **Fichier** | `apps/api-gateway/src/auth/auth.service.ts` |
| **Gravité** | P1 |
| **Status** | **CORRIGÉ** |

**Problème :** Un utilisateur fraîchement inscrit n'apparaissait pas dans le leaderboard avant son premier flush de buffer (premier gain de LoC). Les utilisateurs avec 0 LoC étaient invisibles.

**Fix appliqué :** Après la création de la ligne `Progression` dans `register()`, appel `leaderboardService.updateScore(newUser.id, 0)` pour insérer immédiatement l'utilisateur dans le classement Redis avec un score de 0.

---

### ✅ BUG-18 — Worker crash sur Decimal string BigInt + double-credit leaderboard

| Champ | Valeur |
|-------|--------|
| **Fichiers** | `apps/worker-game-loop/src/click-buffer/click-buffer.worker.ts`, `apps/worker-game-loop/src/click-buffer/click-buffer.module.ts` |
| **Gravité** | P1 |
| **Status** | **CORRIGÉ** |

**Problème A :** `Number(BigInt(totalLinesWritten))` plantait avec `SyntaxError` quand Prisma retournait un `Decimal` sérialisé en `"3.0"` (avec décimale). Le catch appelait `reAddToBuffer` — mais Postgres avait déjà été mis à jour — causant un double-crédit au prochain flush → inflation infinie du score.

**Fix A :** Remplacement de `Number(BigInt(...))` par `Math.round(parseFloat(...))`.

**Problème B :** Le worker appelait `leaderboardService.updateScore()` en plus de l'appel déjà présent dans `progression.service.ts::updateBalance()` → double appel `ZADD` redondant.

**Fix B :** Suppression de l'injection `LeaderboardService` et de l'appel `updateScore()` du worker. Module `click-buffer.module.ts` nettoyé (provider retiré).

---

### ✅ BUG-19 — Local LoC désynchronisé du serveur après DB wipe (320 vs 35)

| Champ | Valeur |
|-------|--------|
| **Fichier** | `apps/desktop/electron/main.ts` |
| **Gravité** | P1 |
| **Status** | **CORRIGÉ** |

**Problème :** La desktop app utilise des save slots par userId dans `electron-store`. Après un TRUNCATE de la DB, l'utilisateur se reconnecte mais `loadUserState(userId)` restaure l'ancien état local (ex. 285 LoC de la session précédente). Le serveur repart à 0. L'utilisateur tape 35 touches → local affiche 285+35=320, leaderboard affiche 35.

**Fix :** Ajout de `syncProgressionFromServer()` qui appelle `GET /api/v1/progression/me` (JWT auth) et écrase `gameState.linesOfCode`, `multiplier`, et `level` avec les valeurs canoniques du serveur. Appelé après `loadUserState()` dans trois endroits :
- Handler IPC `backend-login`
- Handler IPC `backend-register`
- Path `app.whenReady()` → `sessionRestored = true`

---

### ✅ BUG-20 — Leaderboard desktop bloqué si backendOnline=false au premier chargement

| Champ | Valeur |
|-------|--------|
| **Fichier** | `apps/desktop/src/components/Menu.tsx` |
| **Gravité** | P1 |
| **Status** | **CORRIGÉ** |

**Problème :** `fetchLeaderboard()` avait un guard `if (!backendOnline) return` silencieux qui empêchait le chargement lors de la navigation vers l'onglet leaderboard même quand l'utilisateur était authentifié.

**Fix :** Suppression du guard dans `fetchLeaderboard()`. L'handler IPC gère déjà l'état non-authentifié. Le `useEffect` de polling (15s interval) conserve son guard `backendOnline` pour éviter le polling inutile.

---

## Tech Debt (P2) — Tous résolus ✅

### ✅ TD-01 — Page d'accueil web manquante

| **Fichier** | `apps/web/app/page.tsx` |
|-------------|--------------------------|
| **Status** | **FAIT** |

Page de login/register avec stockage JWT dans `localStorage` et redirections vers `/dashboard` et `/game`. Metadata du layout mis à jour.

---

### ✅ TD-02 — Catalogue boutique dupliqué

| **Fichier** | `apps/web/app/game/page.tsx` |
|-------------|-------------------------------|
| **Status** | **FAIT** |

Remplacement des 6 items hardcodés par `SHOP_ITEMS` depuis `@repo/shared-types` (8 items, `costMultiplier` par item). Résolu en même temps que BUG-05.

---

### ✅ TD-03 — Leaderboard desktop hardcodé

| **Fichier** | `apps/desktop/src/components/Menu.tsx` |
|-------------|----------------------------------------|
| **Status** | **FAIT** |

- `useEffect` déclenché à l'activation de l'onglet Leaderboard (si `backendOnline`)
- Appel `window.electronAPI.backendLeaderboard('GLOBAL')` via IPC → `ipcMain.handle('backend-leaderboard')` → `GET /api/v1/progression/leaderboard?type=GLOBAL`
- Rendu conditionnel : offline / loading / vide / liste des entrées avec rang, username, score
- Endpoint `GET /api/v1/progression/leaderboard` créé dans `ProgressionController`

---

### ⏭️ TD-04 — `apps/api/` template non nettoyé

| **Fichier** | `apps/api/` |
|-------------|-------------|
| **Status** | **IGNORÉ** |

Prévu pour usage futur (API publique). Non intégré. Peut être supprimé ultérieurement.

---

### ✅ TD-05 — Erreurs TypeScript dans worker-game-loop (et tous les services)

| **Fichiers** | `apps/worker-game-loop/src/**/*.ts`, `apps/api-gateway/`, `apps/svc-payment/`, `apps/svc-user-progression/` |
|--------------|--------------------------------------------------------------------------------------------------------------|
| **Status** | **CORRIGÉ** |

**Cause :** `pnpm install` ne se complétait pas à cause d'un lock Windows sur `node_modules/electron/dist/resources/default_app.asar`. Packages `bullmq`, `rxjs`, `@nestjs/microservices` (incomplet), `@nestjs/common` (incomplet), `class-validator`, `stripe` étaient absents ou corrompus dans `node_modules`.

**Fix appliqué :** Téléchargement et extraction manuelle des packages manquants depuis le registre npm :
- `bullmq@5.25.0`
- `rxjs@7.8.2`
- `@nestjs/microservices@10.4.22` (réinstallation complète)
- `@nestjs/common@10.4.22` (réinstallation complète)
- `class-validator@0.14.1`
- `stripe@14.24.0`

**Résultat :** `tsc --noEmit` passe à 0 erreur sur les 4 services backend.

> **Note :** Pour que `pnpm install` fonctionne normalement, fermer tout processus Electron avant de lancer `pnpm install`.

---

### ⏭️ TD-06 — Composants legacy non utilisés dans desktop

| **Fichiers** | `apps/desktop/src/components/Widget/`, `BongoCat/` |
|--------------|-----------------------------------------------------|
| **Status** | **IGNORÉ** (décision utilisateur) |

Code mort conservé intentionnellement. Peut être supprimé dans une future session de nettoyage.

---

## Fichiers Créés / Modifiés

### Nouveaux fichiers
| Fichier | Raison |
|---------|--------|
| `apps/api-gateway/src/progression/progression.controller.ts` | BUG-09 + TD-03 : endpoints `GET /me` et `GET /leaderboard` |
| `apps/api-gateway/src/progression/progression.module.ts` | BUG-09 : module NestJS pour ProgressionController |
| `apps/desktop/src/components/Auth.tsx` | BUG-06 : fenêtre auth login/register |
| `apps/desktop/src/components/Auth.css` | BUG-06 : styles cozy cyberpunk pour auth |

### Fichiers modifiés
| Fichier | Bug/TD |
|---------|--------|
| `START-GAME.bat` | BUG-14 (port cleanup via taskkill + netstat) |
| `packages/shared-types/src/index.ts` | BUG-16 (`totalLinesWritten` ajouté à `IProgressionData`) |
| `apps/worker-game-loop/src/click-buffer/click-buffer.worker.ts` | BUG-01, BUG-15 (reAddToBuffer → HINCRBY), BUG-16 (leaderboard → totalLinesWritten), BUG-18 (parseFloat + remove LeaderboardService) |
| `apps/worker-game-loop/src/click-buffer/click-buffer.module.ts` | BUG-01, BUG-18 (remove LeaderboardService provider) |
| `apps/worker-game-loop/src/program-processor/program.worker.ts` | BUG-02 |
| `apps/worker-game-loop/src/program-processor/program-processor.module.ts` | BUG-02 |
| `apps/worker-game-loop/src/offline-calculator/offline.worker.ts` | BUG-03 |
| `apps/worker-game-loop/src/offline-calculator/offline-calculator.module.ts` | BUG-03 |
| `apps/worker-game-loop/src/offline-calculator/offline-calculator.service.ts` | BUG-10 |
| `apps/svc-payment/src/provision/provision.service.ts` | BUG-04 |
| `apps/svc-payment/src/payment.module.ts` | BUG-04 |
| `apps/svc-user-progression/src/services/progression.service.ts` | BUG-16 (`toProgressionData` expose `totalLinesWritten`) |
| `apps/svc-user-progression/src/services/leaderboard-sync.service.ts` | BUG-12 (prisma username enrichment) |
| `apps/api-gateway/src/auth/auth.service.ts` | BUG-17 (leaderboard seed score=0 on register) |
| `apps/api-gateway/src/gateway/game.gateway.ts` | BUG-07 |
| `apps/api-gateway/src/click-processor/click-processor.service.ts` | BUG-08 |
| `apps/api-gateway/src/app.module.ts` | BUG-09 (import ProgressionModule) |
| `apps/web/app/game/page.tsx` | BUG-05 + TD-02 |
| `apps/web/app/dashboard/page.tsx` | BUG-09 |
| `apps/web/app/page.tsx` | TD-01 |
| `apps/web/app/layout.tsx` | TD-01 |
| `apps/web/package.json` | BUG-05 (socket.io-client, @repo/shared-types) |
| `apps/desktop/electron/main.ts` | BUG-06 + BUG-11 + TD-03 + BUG-19 (authWindow, register, launch-game, tryRestoreSession, syncProgressionFromServer) |
| `apps/desktop/electron/preload.ts` | BUG-06 + TD-03 (backendRegister, launchGame) |
| `apps/desktop/src/types/electron.d.ts` | BUG-06 + BUG-12 + TD-03 (backendRegister, launchGame, LeaderboardEntry.username) |
| `apps/desktop/src/main.tsx` | BUG-06 (route /auth → Auth component) |
| `apps/desktop/src/components/Menu.tsx` | TD-03 + BUG-12 + BUG-13 + BUG-20 (username display, auto-refresh, refresh button, removed fetchLeaderboard guard) |
| `apps/desktop/src/components/Menu.css` | BUG-13 (leaderboard-header, refresh-button styles) |

---

## Roadmap Future (P3)

### FEAT-01 — Intégration gRPC inter-services
Remplacer NATS request-reply par gRPC pour un typage fort et de meilleures performances. Prérequis : tous les BUGs P0/P1 résolus (fait).

### FEAT-02 — Système de Prestige
- Nouveau champ `prestigeLevel` dans `UserProgression`
- Bonus permanent +5% par niveau de prestige
- Event WebSocket `prestige_achieved`

### FEAT-03 — Événements Temporaires
- Modèle `TemporaryEvent` en DB
- Interface `ITemporaryEvent` (déjà référencée dans `IGameStateUpdate`)
- Service de gestion planifiée (activation/désactivation)

### FEAT-04 — Achievements (Succès)
Le canal Redis `channel:achievement` est déjà défini dans `@repo/redis-client`. Il manque :
- Catalogue des achievements
- Service de vérification après chaque action
- Stockage des achievements débloqués en DB
- Notification WebSocket `achievement_unlocked`

### FEAT-05 — Guildes / Équipes
Regroupement de joueurs pour des objectifs collectifs.

### FEAT-06 — Mode Compétitif PvP
Challenges directs entre joueurs.
