# Timeless Heroes — Modèles de Données

> Référence complète : schéma Prisma, interfaces TypeScript, clés Redis, enums.
> Dernière mise à jour : Mars 2026

---

## 1. Schéma Prisma (PostgreSQL)

Fichier source : `packages/prisma-client/prisma/schema.prisma`

### Modèle `User`

```prisma
model User {
  id           String          @id @default(uuid())
  email        String          @unique
  username     String          @unique
  passwordHash String                              // bcrypt hash
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt

  // Relations
  progression  UserProgression?
  items        UserItem[]
  programs     UserProgram[]
  lootDrops    LootDrop[]
  transactions Transaction[]
}
```

| Champ | Type | Contrainte | Description |
|-------|------|-----------|-------------|
| `id` | String (UUID) | PK | Identifiant unique auto-généré |
| `email` | String | UNIQUE | Email de connexion |
| `username` | String | UNIQUE | Nom d'affichage dans le jeu |
| `passwordHash` | String | — | Hash bcrypt du mot de passe |
| `createdAt` | DateTime | auto | Date de création du compte |
| `updatedAt` | DateTime | auto | Dernière modification |

---

### Modèle `UserProgression`

```prisma
model UserProgression {
  id                   String           @id @default(uuid())
  userId               String           @unique          // FK → User, relation 1:1
  
  // Monnaie principale
  linesOfCode          Decimal          @default(0) @db.Decimal(30, 0)
  totalLoCEarned       Decimal          @default(0) @db.Decimal(30, 0)
  totalKeyPresses      BigInt           @default(0)
  
  // Niveau & Expérience
  level                Int              @default(1)
  experience           Int              @default(0)
  experienceToNextLevel Int             @default(100)
  
  // Multiplicateurs
  clickMultiplier      Decimal          @default(1.0) @db.Decimal(10, 4)
  passiveIncomeRate    Decimal          @default(0.0) @db.Decimal(10, 4)
  
  // Monétisation
  subscriptionTier     SubscriptionTier @default(FREE)
  premiumCurrency      Int              @default(0)
  
  // Timestamps
  lastActiveAt         DateTime         @default(now())
  createdAt            DateTime         @default(now())
  updatedAt            DateTime         @updatedAt

  // Relations
  user                 User             @relation(...)
  leaderboardSnapshots LeaderboardSnapshot[]
}
```

**Notes importantes :**
- `linesOfCode` : `Decimal(30, 0)` — entier de 30 chiffres max (supporte des valeurs astronomiques pour le late-game)
- `clickMultiplier` : commence à `1.0`, augmente avec les items boutique
- `passiveIncomeRate` : LoC générés par seconde sans interaction (items passifs)
- `premiumCurrency` : monnaie premium pour achats Stripe, non encore utilisée en jeu

---

### Modèle `UserItem`

```prisma
model UserItem {
  id          String   @id @default(uuid())
  userId      String                          // FK → User
  itemId      String                          // Référence à SHOP_ITEMS[].id
  quantity    Int      @default(1)
  purchasedAt DateTime @default(now())

  @@unique([userId, itemId])                  // Un seul enregistrement par (user, item)
}
```

**Relation avec le catalogue :** `itemId` fait référence à l'id des items dans `SHOP_ITEMS` du package `@repo/shared-types`. Il n'y a pas de table `Item` en DB — le catalogue est statique dans le code.

---

### Modèle `UserProgram`

```prisma
model UserProgram {
  id                      String        @id @default(uuid())
  userId                  String                              // FK → User
  programId               String                              // Référence à PROGRAM_TYPES[].id
  status                  ProgramStatus @default(IN_PROGRESS)
  startedAt               DateTime      @default(now())
  completedAt             DateTime?
  keyPressesContributed   Int           @default(0)           // Progression vers keyPressesRequired
  locReward               Decimal?      @db.Decimal(20, 0)   // Calculé à la complétion
  xpReward                Int?
  lootTier                LootTier?                           // Tier de loot obtenu

  // Relations
  user                    User          @relation(...)
  lootDrops               LootDrop[]
}
```

---

### Modèle `LootDrop`

```prisma
model LootDrop {
  id            String      @id @default(uuid())
  userId        String                            // FK → User
  userProgramId String                            // FK → UserProgram
  itemId        String                            // Item droppé (référence catalogue)
  tier          LootTier                          // COMMON/RARE/EPIC/LEGENDARY
  quantity      Int         @default(1)
  droppedAt     DateTime    @default(now())
  claimed       Boolean     @default(false)       // Si le joueur a récupéré le drop

  // Relations
  user          User        @relation(...)
  userProgram   UserProgram @relation(...)
}
```

---

### Modèle `Transaction`

```prisma
model Transaction {
  id                    String            @id @default(uuid())
  userId                String                               // FK → User
  stripePaymentIntentId String            @unique            // ID Stripe (clé idempotence)
  amount                Decimal           @db.Decimal(10, 2) // Montant en centimes / unité monétaire
  currency              String            @default("eur")
  status                TransactionStatus @default(PENDING)
  itemId                String?                              // Item acheté (optionnel)
  metadata              Json?                                // Données Stripe brutes
  createdAt             DateTime          @default(now())

  // Relations
  user                  User              @relation(...)
}
```

**Rôle d'idempotence :** `stripePaymentIntentId` est UNIQUE — empêche de créditer deux fois le même paiement Stripe.

---

### Modèle `LeaderboardSnapshot`

```prisma
model LeaderboardSnapshot {
  id            String   @id @default(uuid())
  userId        String                         // FK → UserProgression
  snapshotType  String                         // "daily" | "weekly" | "all_time"
  rank          Int                            // Position dans le classement
  score         Decimal  @db.Decimal(30, 0)   // LoC totaux au moment du snapshot
  snapshotDate  DateTime @default(now())

  // Relations
  userProgression UserProgression @relation(...)

  @@unique([userId, snapshotType, snapshotDate])
}
```

---

## 2. Enums Prisma

```typescript
enum SubscriptionTier {
  FREE      // Accès de base
  BASIC     // Premier niveau payant
  PREMIUM   // Milieu de gamme
  ELITE     // Top tier
}

enum ProgramStatus {
  AVAILABLE    // Programme disponible mais non démarré
  IN_PROGRESS  // En cours d'exécution
  COMPLETED    // Terminé avec succès
  FAILED       // Échoué
}

enum LootTier {
  COMMON     // Drop fréquent, faible valeur
  RARE       // Drop peu fréquent
  EPIC       // Drop rare, haute valeur
  LEGENDARY  // Drop exceptionnel
}

enum TransactionStatus {
  PENDING    // En attente de traitement
  COMPLETED  // Traité avec succès
  FAILED     // Échec du traitement
  REFUNDED   // Remboursé
}
```

---

## 3. Interfaces TypeScript (@repo/shared-types)

Source : `packages/shared-types/src/`

### IUserProgression

```typescript
interface IUserProgression {
  userId: string;
  linesOfCode: string;            // Decimal sérialisé en string (valeurs très larges)
  totalKeyPresses: number;
  totalLoCEarned: string;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  clickMultiplier: number;
  passiveIncomeRate: number;
  subscriptionTier: SubscriptionTier;
  premiumCurrency: number;
  lastActiveAt: Date;
}
```

### IShopItem

```typescript
interface IShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;                  // Emoji ou nom d'icône
  type: ShopItemType;            // UPGRADE | SUBSCRIPTION | BOOST | COSMETIC
  baseCost: number;              // Coût de base (quantité 0)
  effect: {
    type: EffectType;            // multiplier | passive | click | offline_bonus | special
    value: number;               // Valeur de l'effet
    description: string;         // Texte affiché
  };
}
```

### IProgram

```typescript
interface IProgram {
  id: string;
  name: string;
  type: string;
  status: ProgramStatus;
  difficulty: ProgramDifficulty;
  requiredKeyPresses: number;    // Frappes nécessaires pour compléter
  rewardLoC: number;             // LoC gagnés à la complétion
  rewardXP: number;              // XP gagnés à la complétion
  rewardLootTier: LootTier;      // Tier du loot droppé
  startedAt?: Date;
  completedAt?: Date;
  keyPressesContributed?: number; // Progression actuelle
}
```

### IClickEvent

```typescript
interface IClickEvent {
  userId: string;
  sessionId: string;
  keyCategory: KeyCategory;       // Catégorie anonymisée de la touche
  timestamp: number;              // Unix timestamp ms
  deltaMs: number;                // Temps depuis la frappe précédente
  locValue?: number;              // Calculé côté serveur
}
```

### IClickBatch

```typescript
interface IClickBatch {
  userId: string;
  clicks: IClickEvent[];
  totalLoC: number;               // LoC total du batch
  batchTimestamp: number;
}
```

### Events WebSocket

```typescript
// Serveur → Client : mise à jour du solde
interface IBalanceUpdate {
  userId: string;
  newBalance: string;             // LoC total après mise à jour
  delta: number;                  // LoC gagnés dans cette mise à jour
  source: 'click' | 'passive' | 'program' | 'offline';
}

// Serveur → Client : état complet du jeu
interface IGameStateUpdate {
  userId: string;
  progression: IUserProgression;
  activePrograms: IProgram[];
  currentEvent?: ITemporaryEvent; // Événement temporaire actif (FUT-05)
}

// Serveur → Client : mise à jour du classement
interface ILeaderboardUpdate {
  entries: ILeaderboardEntry[];
  userRank: number;
  totalPlayers: number;
}

// Entrée du classement
interface ILeaderboardEntry {
  userId: string;
  rank: number;
  score: string;                  // LoC en string (Decimal)
  username: string;
  level: number;
}

// Récompenses offline
interface IOfflineReward {
  userId: string;
  duration: number;               // Durée offline en secondes
  locEarned: number;
  xpEarned: number;
}
```

### Types TCP Ingest

```typescript
// Authentification du keylogger
interface ITcpAuthRequest {
  token: string;                  // JWT Bearer
}

interface ITcpAuthResponse {
  sessionId: string;              // Session ID à réutiliser
  userId: string;
  success: boolean;
  message?: string;
}

// Envoi d'une frappe
interface ITcpKeyEvent {
  userId: string;
  sessionId: string;
  keyCategory: KeyCategory;
  timestamp: number;
  deltaMs: number;
}

interface ITcpKeyResponse {
  processed: boolean;
  locValue?: number;
  trustScore?: number;            // Score anti-cheat (0.0–1.0)
  blocked?: boolean;
  reason?: string;
}
```

### Types Paiement

```typescript
interface IStripeWebhookEvent {
  type: string;                   // checkout.session.completed | payment_intent.succeeded
  data: {
    object: {
      id: string;
      customer: string;
      metadata: {
        userId: string;
        itemId: string;
        idempotencyKey: string;
      };
      amount_total: number;
      currency: string;
    };
  };
}

interface IProvisionOrder {
  userId: string;
  itemId: string;
  transactionId: string;
  idempotencyKey: string;
  amount: number;
  currency: string;
}

interface IPaymentTransaction {
  id: string;
  userId: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  itemId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}
```

---

## 4. Enums TypeScript (@repo/shared-types)

```typescript
// Statuts d'un programme (synchronisé avec Prisma)
enum ProgramStatus {
  AVAILABLE = 'AVAILABLE',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

// Difficulté d'un programme
enum ProgramDifficulty {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD',
  EXPERT = 'EXPERT'
}

// Tiers de loot (synchronisé avec Prisma)
enum LootTier {
  COMMON = 'COMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY'
}

// Statuts de transaction (synchronisé avec Prisma)
enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

// Tiers d'abonnement (synchronisé avec Prisma)
enum SubscriptionTier {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  ELITE = 'ELITE'
}

// Types d'items boutique
enum ShopItemType {
  UPGRADE = 'UPGRADE',
  SUBSCRIPTION = 'SUBSCRIPTION',
  BOOST = 'BOOST',
  COSMETIC = 'COSMETIC'
}

// Types d'effets d'items
enum EffectType {
  MULTIPLIER = 'multiplier',
  PASSIVE = 'passive',
  CLICK = 'click',
  OFFLINE_BONUS = 'offline_bonus',
  SPECIAL = 'special'
}

// Catégories de touches (anonymisation keylogger)
enum KeyCategory {
  CHAR = 'CHAR',          // Lettres, chiffres
  MODIFIER = 'MODIFIER',  // Shift, Ctrl, Alt, Meta
  FUNCTION = 'FUNCTION',  // F1–F12
  NAVIGATION = 'NAVIGATION', // Flèches, PageUp/Down, Home/End
  ENTER = 'ENTER',        // Entrée / Retour
  SPACE = 'SPACE',        // Espace
  BACKSPACE = 'BACKSPACE', // Supprimer
  TAB = 'TAB',            // Tabulation
  UNKNOWN = 'UNKNOWN'     // Toute autre touche
}
```

---

## 5. Clés Redis

Source : `packages/redis-client/src/redis-keys.ts`

### Buffers de clics

| Clé | Type | TTL | Description |
|-----|------|-----|-------------|
| `buffer:clicks:{userId}` | Hash | 60s | Clics en attente de flush — champs: `clicks`, `locToAdd`, `lastUpdate` |

### Sessions & Auth

| Clé | Type | TTL | Description |
|-----|------|-----|-------------|
| `session:{userId}` | String/Hash | — | Session utilisateur |
| `tcp:session:{sessionId}` | String/Hash | — | Session keylogger TCP authentifiée |

### Anti-cheat

| Clé | Type | TTL | Description |
|-----|------|-----|-------------|
| `anticheat:timestamps:{userId}` | List | — | Timestamps des N dernières frappes |
| `anticheat:deltas:{userId}` | List | — | Deltas inter-touches |

### Throttle / Rate Limiting

| Clé | Type | TTL | Description |
|-----|------|-----|-------------|
| `throttle:lastclick:{userId}` | String | — | Timestamp du dernier clic |
| `throttle:count:{userId}` | String | 1s | Compteur CPS sur fenêtre glissante 1s |
| `throttle:violations:{userId}` | String | 1h | Compteur de violations anti-cheat |
| `ratelimit:{action}:{userId}` | String | variable | Rate limit par action (sliding window) |

### Classement

| Clé | Type | TTL | Description |
|-----|------|-----|-------------|
| `leaderboard:global` | Sorted Set | permanent | Score = LoC total, member = userId |
| `leaderboard:weekly` | Sorted Set | permanent | Réinitialisé chaque semaine |
| `leaderboard:daily` | Sorted Set | permanent | Réinitialisé chaque jour |

### Cache

| Clé | Type | TTL | Description |
|-----|------|-----|-------------|
| `cache:progression:{userId}` | String (JSON) | 5min | UserProgression sérialisée |
| `cache:items:{userId}` | String (JSON) | 5min | Coûts des items calculés pour ce joueur |

### WebSocket

| Clé | Type | TTL | Description |
|-----|------|-----|-------------|
| `ws:connected:users` | Set | — | Ensemble des userId connectés en WebSocket |
| `ws:connected:{userId}` | String | — | Flag de connexion d'un utilisateur |

### Locks Distribués

| Clé | Type | TTL | Description |
|-----|------|-----|-------------|
| `lock:user:{userId}` | String | 30s | Lock pour opérations concurrentes sur un user |
| `lock:payment:{paymentId}` | String | 30s | Lock pour traitement de paiement |

### Pub/Sub (canaux)

| Canal | Description |
|-------|-------------|
| `channel:balance` | Mise à jour du solde LoC |
| `channel:achievement` | Achievement débloqué |
| `channel:leaderboard` | Mise à jour du classement |

### Idempotence (paiements)

| Clé | TTL | Description |
|-----|-----|-------------|
| `idempotency:{key}` | 7 jours | Enregistrement `{status, createdAt, transactionId}` |
| `lock:payment:{key}` | 30s | Lock distribué pendant le traitement |

---

## 6. Constantes de Configuration

Source : `packages/shared-types/src/constants.ts`

### QueueNames (BullMQ)

```typescript
const QueueNames = {
  CLICK_BUFFER_FLUSH: 'CLICK_BUFFER_FLUSH',
  PROGRAM_EXECUTION:  'PROGRAM_EXECUTION',
  OFFLINE_CALCULATION: 'OFFLINE_CALCULATION',
  PAYMENT_PROVISION:  'PAYMENT_PROVISION',
} as const;
```

### NatsSubjects (microservices)

```typescript
const NatsSubjects = {
  PROGRESSION_GET:          'progression.get',
  PROGRESSION_UPDATE:       'progression.update',
  PROGRESSION_PURCHASE:     'progression.purchase',
  PROGRESSION_LEADERBOARD:  'progression.getLeaderboard',
} as const;
```

### RedisKeys (namespacing)

Voir section 5 ci-dessus.

---

## 7. Diagramme de Relations

```
User (1) ──────────────── (1) UserProgression
  │                              │
  │ (1)──────────── (N) UserItem │
  │                              │ (1)──── (N) LeaderboardSnapshot
  │ (1)──────────── (N) UserProgram
  │                      │
  │                      └──── (N) LootDrop
  │
  └─ (1)──────────── (N) Transaction
```

**Légende :**
- `User` est le point central — tout est lié à l'utilisateur
- `UserProgression` est 1:1 avec `User` (créée automatiquement à l'inscription)
- `UserItem` enregistre les items achetés (quantité incluse)
- `UserProgram` suit la progression de chaque programme lancé
- `LootDrop` est lié à un `UserProgram` spécifique (drop obtenu à la complétion)
- `Transaction` est l'historique des paiements Stripe
- `LeaderboardSnapshot` est lié à `UserProgression` (pas directement à `User`)

---

## 8. État Local Electron (electron-store)

Fichier : `timeless-heroes-data.json` (AppData/Roaming)

```typescript
interface ElectronStore {
  gameState: {
    linesOfCode: number;           // LoC actuels
    totalKeyPresses: number;       // Total frappes depuis création
    level: number;                 // Niveau actuel
    experience: number;            // XP vers le prochain niveau
    experienceToNext: number;      // XP nécessaires au prochain niveau (start: 100, ×1.5/lvl)
    multiplier: number;            // LoC par frappe (modifié par les upgrades)
    passiveRate: number;           // LoC générés par seconde (setInterval 1s)
  };
  items: Record<string, number>;   // itemId → quantité possédée
  settings: {
    widgetPosition: { x: number; y: number }; // Position du widget sur l'écran
  };
}
```

**Important :** Cet état est **entièrement local** et non synchronisé avec le backend. C'est un silo de données indépendant.
