# Timeless Heroes — Spécifications Fonctionnelles (SPECS)

> Liste exhaustive de toutes les fonctionnalités du projet, avec leur statut d'implémentation.
> Dernière mise à jour : Mars 2026

---

## Légende des statuts

| Statut | Signification |
|--------|---------------|
| **IMPLÉMENTÉ** | Fonctionnel et testé |
| **PARTIEL** | Code présent mais incomplet ou non connecté |
| **MOCKÉE** | Interface UI présente, données hardcodées |
| **STUB** | Scaffold / squelette, logique métier manquante |
| **PLANIFIÉ** | Non commencé, dans la roadmap |

---

## Module 1 — Authentification & Identité

| ID | Spec | Statut | Service | Détails |
|----|------|--------|---------|---------|
| SP-AUTH-01 | Inscription utilisateur (email + username + mot de passe) | **IMPLÉMENTÉ** | api-gateway | `POST /auth/register` — bcrypt hash, création User + UserProgression |
| SP-AUTH-02 | Connexion (email + mot de passe) | **IMPLÉMENTÉ** | api-gateway | `POST /auth/login` — retourne JWT Bearer |
| SP-AUTH-03 | Token JWT (Bearer, expiration configurable) | **IMPLÉMENTÉ** | api-gateway | `JWT_SECRET` + `JWT_EXPIRES_IN` env vars |
| SP-AUTH-04 | Guard WebSocket JWT | **IMPLÉMENTÉ** | api-gateway | `WsJwtGuard` — vérifie `auth.token` à la connexion Socket.IO |
| SP-AUTH-05 | Guard HTTP JWT | **IMPLÉMENTÉ** | api-gateway | `@UseGuards(JwtAuthGuard)` sur les routes protégées |
| SP-AUTH-06 | Récupération du profil connecté | **IMPLÉMENTÉ** | api-gateway | `GET /auth/profile` — retourne l'utilisateur depuis le JWT |
| SP-AUTH-07 | Gestion des sessions TCP (keylogger) | **IMPLÉMENTÉ** | api-gateway | Sessions stockées en Redis (`tcp:session:{sessionId}`) avec TTL |

---

## Module 2 — Capture des Frappes (Keylogger)

| ID | Spec | Statut | Service | Détails |
|----|------|--------|---------|---------|
| SP-KEY-01 | Agent PowerShell Windows (hook C# WinAPI) | **IMPLÉMENTÉ** | keylogger | `keyboard-hook-secure.ps1` — `WH_KEYBOARD_LL`, hook bas niveau |
| SP-KEY-02 | Agent bash macOS | **IMPLÉMENTÉ** | keylogger | `keyboard-hook-macos.sh` — demo mode (pas de hook global sans droits spéciaux) |
| SP-KEY-03 | Agent bash Linux | **IMPLÉMENTÉ** | keylogger | `keyboard-hook-linux.sh` — approche similaire macOS |
| SP-KEY-04 | Anonymisation des touches | **IMPLÉMENTÉ** | keylogger | Jamais le code touche réel. Catégories : `CHAR`, `MODIFIER`, `FUNCTION`, `NAVIGATION`, `ENTER`, `SPACE`, `BACKSPACE`, `TAB`, `UNKNOWN` |
| SP-KEY-05 | Authentification du session keylogger | **IMPLÉMENTÉ** | api-gateway | `POST /api/v1/ingest/auth` — JWT → `sessionId` + `userId` |
| SP-KEY-06 | Ingestion des événements clavier | **IMPLÉMENTÉ** | api-gateway | `POST /api/v1/ingest/key` — payload : `{userId, sessionId, keyCategory, timestamp, deltaMs}` |
| SP-KEY-07 | Hook clavier global desktop (Electron) | **IMPLÉMENTÉ** | desktop | `uiohook-napi` — écoute `keyup` global, incrémente LoC localement |

---

## Module 3 — Anti-Cheat

| ID | Spec | Statut | Service | Détails |
|----|------|--------|---------|---------|
| SP-AC-01 | Détection de vitesse surhumaine | **IMPLÉMENTÉ** | api-gateway | Delta inter-touches < 20ms → bloqué |
| SP-AC-02 | Détection de régularité robotique | **IMPLÉMENTÉ** | api-gateway | Écart-type des deltas < 5ms → bloqué (bot a des intervalles constants) |
| SP-AC-03 | Score de confiance (0.0–1.0) | **IMPLÉMENTÉ** | api-gateway | `HeuristicAntiCheatService` calcule un trust score |
| SP-AC-04 | Historique des deltas en Redis | **IMPLÉMENTÉ** | api-gateway | `anticheat:timestamps:{userId}` et `anticheat:deltas:{userId}` |
| SP-AC-05 | Rate limit global (max CPS) | **IMPLÉMENTÉ** | redis-client | `ThrottleService.checkClickThrottle(userId, maxCPS=20)` |
| SP-AC-06 | Compteur de violations | **IMPLÉMENTÉ** | redis-client | `throttle:violations:{userId}` — TTL 1h |
| SP-AC-07 | Système de ban | **IMPLÉMENTÉ** | redis-client | `ThrottleService.isUserBanned()` |

---

## Module 4 — Traitement des Clics

| ID | Spec | Statut | Service | Détails |
|----|------|--------|---------|---------|
| SP-CLICK-01 | Calcul de la valeur LoC par frappe | **IMPLÉMENTÉ** | api-gateway | `locValue = baseValue × multiplier × bonusMultiplier` |
| SP-CLICK-02 | Valeurs de base par catégorie | **IMPLÉMENTÉ** | shared-types | CHAR=1, ENTER=3, TAB=2, FUNCTION=2, MODIFIER=1 |
| SP-CLICK-03 | Buffering Redis des clics | **IMPLÉMENTÉ** | redis-client | `buffer:clicks:{userId}` — hash atomique, TTL 60s |
| SP-CLICK-04 | Flush automatique toutes les 5s | **IMPLÉMENTÉ** | worker-game-loop | `ClickBufferFlushService` — scanne les clés Redis, enfile des jobs BullMQ |
| SP-CLICK-05 | Worker de flush (BullMQ) | **PARTIEL** | worker-game-loop | `ClickBufferWorker` — vide le buffer Redis mais **écrit encore en Redis** au lieu de Prisma (voir BUG-01) |
| SP-CLICK-06 | Bonus multiplicateur (boost system) | **STUB** | api-gateway | `bonusMultiplier` hardcodé à `1.0` (voir BUG-08) |
| SP-CLICK-07 | Acknowledgement WebSocket | **IMPLÉMENTÉ** | api-gateway | Event `click_ack` : `{success, locValue, totalLoC, rank}` |

---

## Module 5 — Progression Joueur

| ID | Spec | Statut | Service | Détails |
|----|------|--------|---------|---------|
| SP-PROG-01 | Stockage de la progression (PostgreSQL) | **IMPLÉMENTÉ** | prisma-client | Table `UserProgression` — LoC, XP, level, multiplier, passiveRate, etc. |
| SP-PROG-02 | Récupération de la progression | **IMPLÉMENTÉ** | svc-user-progression | NATS `progression.get` |
| SP-PROG-03 | Mise à jour progression (LoC + XP + clics) | **IMPLÉMENTÉ** | svc-user-progression | NATS `progression.update` + vérification level-up |
| SP-PROG-04 | Système de niveaux | **IMPLÉMENTÉ** | svc-user-progression | Level-up basé sur l'expérience accumulée |
| SP-PROG-05 | Revenu passif (LoC/sec) | **IMPLÉMENTÉ** (local) | desktop | `setInterval(1000)` dans Electron main — non synchronisé avec le serveur |
| SP-PROG-06 | Cache progression Redis | **IMPLÉMENTÉ** | redis-client | `cache:progression:{userId}` — TTL 5min |
| SP-PROG-07 | Multiplicateur de clic | **IMPLÉMENTÉ** | shared-types / desktop | Calculé par `ItemCostCalculatorService`, appliqué dans `ClickProcessorService` |

---

## Module 6 — Boutique & Items

| ID | Spec | Statut | Service | Détails |
|----|------|--------|---------|---------|
| SP-SHOP-01 | Catalogue de 8 items | **IMPLÉMENTÉ** | shared-types | `SHOP_ITEMS` constant — voir docs/GAME_MECHANICS.md |
| SP-SHOP-02 | Formule de coût exponentiel | **IMPLÉMENTÉ** | svc-user-progression | `coût = baseCost × 1.15^quantitéPossédée` |
| SP-SHOP-03 | Achat d'item via WebSocket | **IMPLÉMENTÉ** | api-gateway | Event `purchase` → NATS `progression.purchase` |
| SP-SHOP-04 | Déduction LoC à l'achat | **IMPLÉMENTÉ** | svc-user-progression | `processPurchase()` — vérifie le solde, déduit, crée `UserItem` |
| SP-SHOP-05 | Application des effets d'item | **PARTIEL** | svc-user-progression | Items créés en DB mais les effets (multiplier, passive) non répercutés dans le calcul serveur |
| SP-SHOP-06 | Cache des coûts par joueur | **IMPLÉMENTÉ** | redis-client | `cache:items:{userId}` — TTL 5min |
| SP-SHOP-07 | Achat desktop local | **IMPLÉMENTÉ** | desktop | `Menu.tsx` — déduit LoC local, met à jour `multiplier`/`passiveRate` via IPC |

---

## Module 7 — Programmes & Expéditions

| ID | Spec | Statut | Service | Détails |
|----|------|--------|---------|---------|
| SP-PROG-01 | 5 types de programmes définis | **IMPLÉMENTÉ** | shared-types / worker | `fix_typo`, `compile_kernel`, `deploy_microservices`, `refactor_legacy`, `research_ai` |
| SP-PROG-02 | Lancement d'un programme | **STUB** | — | Non connecté — pas de route/event pour démarrer un programme |
| SP-PROG-03 | Progression par frappes (keyPressesRequired) | **IMPLÉMENTÉ** | worker-game-loop | `ProgramWorker` vérifie le compteur |
| SP-PROG-04 | Récompenses LoC + XP à la completion | **STUB** | worker-game-loop | Calculé mais appel NATS vers svc-progression commenté (voir BUG-02) |
| SP-PROG-05 | Système de loot (LootCalculatorService) | **IMPLÉMENTÉ** | worker-game-loop | Calcul de drops avec tiers pondérés |
| SP-PROG-06 | Tiers de loot (COMMON/RARE/EPIC/LEGENDARY) | **IMPLÉMENTÉ** | shared-types | Enum `LootTier`, stocké en `LootDrop` table |
| SP-PROG-07 | Statuts de programme | **IMPLÉMENTÉ** | prisma-client | `UserProgram.status` : AVAILABLE/IN_PROGRESS/COMPLETED/FAILED |

---

## Module 8 — Récompenses Offline (AFK)

| ID | Spec | Statut | Service | Détails |
|----|------|--------|---------|---------|
| SP-OFF-01 | Calcul des récompenses AFK | **IMPLÉMENTÉ** | worker-game-loop | `OfflineCalculatorService` — calcule LoC/XP selon temps hors-ligne |
| SP-OFF-02 | Plafond à 8 heures | **IMPLÉMENTÉ** | worker-game-loop | `maxOfflineHours = 8` |
| SP-OFF-03 | Déclenchement à la reconnexion | **IMPLÉMENTÉ** | worker-game-loop | `OfflineWorker` se déclenche sur reconnexion |
| SP-OFF-04 | Utilisation des vraies stats (passiveRate, multiplier) | **STUB** | worker-game-loop | `getUserOfflineStats()` retourne des valeurs hardcodées (passiveRate=1, multiplier=1) pour tous les joueurs (voir BUG-10) |
| SP-OFF-05 | Crédit effectif des récompenses | **STUB** | worker-game-loop | Calculées mais non créditées — appel progression commenté (voir BUG-03) |
| SP-OFF-06 | Notification WebSocket des récompenses | **IMPLÉMENTÉ** | api-gateway | Event `offline_reward` : `{userId, duration, locEarned, xpEarned}` (mais rien à notifier tant que SP-OFF-05 n'est pas corrigé) |

---

## Module 9 — Classement (Leaderboard)

| ID | Spec | Statut | Service | Détails |
|----|------|--------|---------|---------|
| SP-LB-01 | Classement global Redis (sorted set) | **IMPLÉMENTÉ** | redis-client | `leaderboard:global` — score = total LoC |
| SP-LB-02 | Classement hebdomadaire | **IMPLÉMENTÉ** | redis-client | `leaderboard:weekly` |
| SP-LB-03 | Classement journalier | **IMPLÉMENTÉ** | redis-client | `leaderboard:daily` |
| SP-LB-04 | Synchronisation Postgres (snapshot) | **IMPLÉMENTÉ** | svc-user-progression | `LeaderboardSyncService` — cron toutes les 5min, upsert `LeaderboardSnapshot` |
| SP-LB-05 | Top N joueurs | **IMPLÉMENTÉ** | redis-client | `getTopPlayers(count)` |
| SP-LB-06 | Rang d'un joueur spécifique | **IMPLÉMENTÉ** | redis-client | `getUserRank(userId)` |
| SP-LB-07 | Joueurs autour d'un rang (neighbours) | **IMPLÉMENTÉ** | redis-client | `getPlayersAroundUser(userId, range)` |
| SP-LB-08 | Noms d'utilisateurs dans le leaderboard | **PARTIEL** | api-gateway | Noms affichés comme `Player_${userId.slice(0,8)}` (voir BUG-07) |
| SP-LB-09 | Niveaux joueurs dans le leaderboard | **PARTIEL** | api-gateway | Level hardcodé à `1` pour tous (voir BUG-07) |
| SP-LB-10 | Mise à jour temps réel via WebSocket | **IMPLÉMENTÉ** | api-gateway | Event `leaderboard_update` : `{entries[], userRank, totalPlayers}` |

---

## Module 10 — Paiements & Monétisation

| ID | Spec | Statut | Service | Détails |
|----|------|--------|---------|---------|
| SP-PAY-01 | Intégration Stripe webhooks | **IMPLÉMENTÉ** | svc-payment | `POST /stripe/webhook` — vérification signature `STRIPE_WEBHOOK_SECRET` |
| SP-PAY-02 | Gestion `checkout.session.completed` | **IMPLÉMENTÉ** | svc-payment | Crée `Transaction` en DB, enfile BullMQ |
| SP-PAY-03 | Gestion `payment_intent.succeeded` | **IMPLÉMENTÉ** | svc-payment | Idem |
| SP-PAY-04 | Idempotence des paiements | **IMPLÉMENTÉ** | svc-payment | Distributed lock Redis + statut PROCESSING/COMPLETED/FAILED, TTL 7 jours |
| SP-PAY-05 | Worker de provisioning (BullMQ) | **IMPLÉMENTÉ** | svc-payment | `ProvisionOrderProcessor` — dépile et exécute |
| SP-PAY-06 | Provisioning abonnements | **STUB** | svc-payment | `provisionSubscription()` — TODO: NATS vers progression (voir BUG-04) |
| SP-PAY-07 | Provisioning monnaie premium | **STUB** | svc-payment | `provisionPremiumCurrency()` — TODO (voir BUG-04) |
| SP-PAY-08 | Provisioning boosts | **STUB** | svc-payment | `provisionBoost()` — TODO (voir BUG-04) |
| SP-PAY-09 | Provisioning cosmétiques | **STUB** | svc-payment | `provisionCosmetic()` — TODO (voir BUG-04) |
| SP-PAY-10 | Abonnements (FREE/BASIC/PREMIUM/ELITE) | **STUB** | shared-types | Enum défini, champ DB présent, effets non implémentés |
| SP-PAY-11 | Monnaie premium (`premiumCurrency`) | **STUB** | prisma-client | Champ présent en DB, non utilisé |

---

## Module 11 — Temps Réel (WebSocket)

| ID | Spec | Statut | Service | Détails |
|----|------|--------|---------|---------|
| SP-WS-01 | Connexion Socket.IO namespace `/game` | **IMPLÉMENTÉ** | api-gateway | Guard JWT, enregistrement dans Redis `ws:connected:users` |
| SP-WS-02 | Event `click` (client → serveur) | **IMPLÉMENTÉ** | api-gateway | Validation anti-cheat, buffering Redis |
| SP-WS-03 | Event `get_state` (client → serveur) | **IMPLÉMENTÉ** | api-gateway | Fetch progression + leaderboard via NATS |
| SP-WS-04 | Event `purchase` (client → serveur) | **IMPLÉMENTÉ** | api-gateway | Forward vers svc-user-progression via NATS |
| SP-WS-05 | Event `click_ack` (serveur → client) | **IMPLÉMENTÉ** | api-gateway | Retour immédiat après traitement |
| SP-WS-06 | Event `state_update` (serveur → client) | **IMPLÉMENTÉ** | api-gateway | État complet du jeu |
| SP-WS-07 | Event `balance_update` (serveur → client) | **IMPLÉMENTÉ** | api-gateway | Après flush BullMQ |
| SP-WS-08 | Event `leaderboard_update` (serveur → client) | **IMPLÉMENTÉ** | api-gateway | Push depuis Redis Pub/Sub |
| SP-WS-09 | Event `offline_reward` (serveur → client) | **PARTIEL** | api-gateway | Émis mais récompenses non créditées (BUG-03) |
| SP-WS-10 | Tracking des connexions actives | **IMPLÉMENTÉ** | api-gateway | `ws:connected:users` set Redis, nettoyé sur `disconnect` |

---

## Module 12 — Frontend Web (Next.js)

| ID | Spec | Statut | Route | Détails |
|----|------|--------|-------|---------|
| SP-WEB-01 | Page racine | **MOCKÉE** | `/` | Template Turborepo — affiche des "links" depuis `localhost:3000/links` |
| SP-WEB-02 | Dashboard "Command Center" | **MOCKÉE** | `/dashboard` | UI complète avec StatCards, quêtes journalières, boutique — **données 100% hardcodées** |
| SP-WEB-03 | Page de jeu avec WebSocket | **PARTIEL** | `/game` | Connexion WebSocket présente mais au **mauvais port 9998** (devrait être 3000) |
| SP-WEB-04 | Boutique web | **MOCKÉE** | `/game` | 6 items hardcodés (légèrement différents du catalogue officiel `SHOP_ITEMS`) |
| SP-WEB-05 | Leaderboard web | **STUB** | `/game` | Onglet vide "placeholder" |

---

## Module 13 — Frontend Desktop (Electron)

| ID | Spec | Statut | Composant | Détails |
|----|------|--------|-----------|---------|
| SP-DESK-01 | Widget overlay always-on-top | **IMPLÉMENTÉ** | `HoloWidget` | 420×320px, transparent, frameless, draggable |
| SP-DESK-02 | Fenêtre menu (shop + stats) | **IMPLÉMENTÉ** | `Menu` | 450×600px, show/hide via system tray |
| SP-DESK-03 | System tray icon | **IMPLÉMENTÉ** | electron/main.ts | Click tray → toggle menu |
| SP-DESK-04 | Persistance locale (electron-store) | **IMPLÉMENTÉ** | electron/main.ts | `timeless-heroes-data.json` |
| SP-DESK-05 | Hook clavier global (uiohook-napi) | **IMPLÉMENTÉ** | electron/main.ts | `keyup` → LoC + XP + level-up |
| SP-DESK-06 | Mascotte CyberCat | **IMPLÉMENTÉ** | `CyberCat` | SVG animé, 4 tiers combo |
| SP-DESK-07 | Système de combo visuel | **IMPLÉMENTÉ** | `HoloWidget` | Tiers à 10/25/50/100 frappes consécutives |
| SP-DESK-08 | Boutique desktop | **IMPLÉMENTÉ** | `Menu` | 8 items, achat local, mise à jour multiplier/passive |
| SP-DESK-09 | Onglet leaderboard | **MOCKÉE** | `Menu` | Hardcodé "#1 Toi 👑", "coming soon" |
| SP-DESK-10 | Connexion au backend | **NON IMPLÉMENTÉ** | — | L'app desktop est 100% locale, aucun appel API |
| SP-DESK-11 | Effondrement/expansion du widget | **IMPLÉMENTÉ** | `HoloWidget` | Toggle via bouton, mode compact |
| SP-DESK-12 | Glissement du widget | **IMPLÉMENTÉ** | electron/main.ts | IPC `move-widget` + mousedown/mousemove |

---

## Module 14 — Design System (@repo/ui)

| ID | Spec | Statut | Composant | Détails |
|----|------|--------|-----------|---------|
| SP-UI-01 | GlassCard | **IMPLÉMENTÉ** | `@repo/ui` | 6 variantes couleur, 3 tailles, glow, circuitBorder |
| SP-UI-02 | NeonButton | **IMPLÉMENTÉ** | `@repo/ui` | 4 variantes style, 5 couleurs, 3 tailles, loading, icon |
| SP-UI-03 | NeonProgress | **IMPLÉMENTÉ** | `@repo/ui` | Barre de progression, 7 variantes couleur, animated, segments |
| SP-UI-04 | StatCard | **IMPLÉMENTÉ** | `@repo/ui` | Carte statistique avec trend, icon, prefix/suffix |

---

## Roadmap Planifiée

| ID | Feature | Priorité | Notes |
|----|---------|----------|-------|
| FUT-01 | Migration gRPC (remplacer TODOs communication) | P0 | Unbloque les BUGs critiques |
| FUT-02 | Connexion backend ↔ desktop Electron | P0 | L'app est un silo non intégré |
| FUT-03 | Fix WebSocket port dans `/game` web | P0 | Port 9998 → 3000 |
| FUT-04 | Système de prestige | P1 | Remise à zéro avec bonus permanents |
| FUT-05 | Événements temporaires | P1 | Boosts limités dans le temps |
| FUT-06 | Guildes / Équipes | P2 | Mode collaboratif |
| FUT-07 | Mode compétitif PvP | P2 | |
| FUT-08 | Achievements complets | P1 | Canal Redis `channel:achievement` défini |
| FUT-09 | Boost system actif | P1 | `bonusMultiplier` non fonctionnel |
| FUT-10 | Monnaie premium in-game | P1 | Champ DB présent, non utilisé |

---

## Tableau de Couverture par Service

| Service | SPECS implémentées | SPECS partielles | SPECS stub/manquantes |
|---------|-------------------|-----------------|----------------------|
| api-gateway | 15 | 4 | 2 |
| svc-user-progression | 7 | 1 | 0 |
| worker-game-loop | 4 | 2 | 4 |
| svc-payment | 5 | 0 | 5 |
| web (Next.js) | 0 | 1 | 4 |
| desktop (Electron) | 11 | 1 | 1 |
| shared-types / prisma | 10 | 2 | 3 |
