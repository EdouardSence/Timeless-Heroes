# Timeless Heroes — Mécaniques de Jeu

> Toutes les formules, systèmes de jeu, catalogues, et règles de gameplay.
> Dernière mise à jour : Mars 2026

---

## 1. Mécanique Centrale : Lines of Code (LoC)

**LoC** est la monnaie principale du jeu. C'est à la fois :
- La **monnaie** pour acheter des upgrades et des programmes
- Le **score** qui détermine le classement
- L'**indicateur de progression** du joueur

### Sources de LoC

| Source | Mécanisme | Où calculé |
|--------|-----------|-----------|
| Frappes clavier | Chaque touche appuyée génère N LoC | api-gateway + Electron local |
| Revenu passif | Items "passifs" génèrent X LoC/sec en continu | Electron (local), TODO: serveur |
| Programmes | Récompense à la complétion d'un programme | worker-game-loop (TODO: crédit non implémenté) |
| Récompenses offline | LoC gagnés pendant l'absence | worker-game-loop (TODO: crédit non implémenté) |

### Formule LoC par Frappe

```
locValue = baseKeyValue × clickMultiplier × bonusMultiplier
```

- **`baseKeyValue`** : valeur de base selon la catégorie de touche (voir section 2)
- **`clickMultiplier`** : multiplicateur accumulé via les items (commence à 1.0)
- **`bonusMultiplier`** : bonus des boosts/abonnements (actuellement hardcodé à 1.0 — BUG-08)

**Exemple :**
- Appuyer sur ENTER avec `clickMultiplier = 2.5` → `3 × 2.5 × 1.0 = 7 LoC`
- Appuyer sur CHAR avec `clickMultiplier = 2.5` → `1 × 2.5 × 1.0 = 2 LoC` (arrondi plancher)

---

## 2. Catégories de Touches (Keylogger)

Le keylogger **n'envoie jamais le code touche réel** — seulement la catégorie anonymisée.

| Catégorie | Touches concernées | Valeur LoC de base | Justification |
|-----------|-------------------|-------------------|---------------|
| `CHAR` | Lettres (A-Z), chiffres (0-9), ponctuation, symboles | 1 | Frappe de base |
| `ENTER` | Entrée / Retour | 3 | "Valider une ligne de code" |
| `TAB` | Tabulation | 2 | "Indenter du code" |
| `FUNCTION` | F1–F12 | 2 | "Raccourcis développeur" |
| `MODIFIER` | Shift, Ctrl, Alt, Meta, CapsLock | 1 | Combinaisons |
| `SPACE` | Espace | 1 | Espace dans le code |
| `BACKSPACE` | Suppression arrière | 1 | "Corriger des erreurs" |
| `NAVIGATION` | Flèches, PageUp/Down, Home/End, Ins, Del | 1 | Navigation dans l'IDE |
| `UNKNOWN` | Toute autre touche non catégorisée | 1 | Valeur par défaut |

**Mapping Windows (vkCode) vers catégories :**
```powershell
# Extrait du keyboard-hook-secure.ps1
function CategorizeKey($vkCode) {
  if ($vkCode -ge 65 -and $vkCode -le 90) { return "CHAR" }      # A-Z
  if ($vkCode -ge 48 -and $vkCode -le 57) { return "CHAR" }      # 0-9
  if ($vkCode -ge 112 -and $vkCode -le 123) { return "FUNCTION" } # F1-F12
  if ($vkCode -eq 13) { return "ENTER" }
  if ($vkCode -eq 9)  { return "TAB" }
  if ($vkCode -eq 8)  { return "BACKSPACE" }
  if ($vkCode -eq 32) { return "SPACE" }
  if (@(16,17,18,91) -contains $vkCode) { return "MODIFIER" }    # Shift,Ctrl,Alt,Win
  if (@(37,38,39,40,33,34,35,36,45,46) -contains $vkCode) { return "NAVIGATION" }
  return "UNKNOWN"
}
```

---

## 3. Boutique (Shop)

### Formule de Coût Exponentiel

```
coût(quantitéPossédée) = baseCost × 1.15^quantitéPossédée
```

- Le coût **augmente de 15%** à chaque item acheté
- Arrondi à l'entier supérieur (`Math.ceil`)

**Tableau de coûts par item (exemples) :**

| Item | baseCost | Quantité 0 | Quantité 1 | Quantité 5 | Quantité 10 | Quantité 20 |
|------|---------|-----------|-----------|-----------|------------|------------|
| mechanical-keyboard | 100 | 100 | 115 | 201 | 405 | 1,637 |
| coffee-machine | 2,500 | 2,500 | 2,875 | 5,028 | 10,114 | 40,916 |
| junior-dev | 1,000 | 1,000 | 1,150 | 2,011 | 4,046 | 16,367 |
| quantum-computer | 1,000,000 | 1,000,000 | 1,150,000 | 2,011,357 | 4,045,558 | 16,366,537 |

### Catalogue Complet des Items

Source : `packages/shared-types/src/shop-items.ts`

#### Upgrades (effets `click` — bonus LoC par frappe)

| ID | Nom | baseCost | Effet | Valeur ajoutée |
|----|-----|---------|-------|----------------|
| `mechanical-keyboard` | Clavier Mécanique | 100 LoC | +N LoC/frappe (`click`) | +1 LoC/frappe |
| `monitor-4k` | Écran 4K | 500 LoC | +N LoC/frappe (`click`) | +2 LoC/frappe |

#### Passifs (effets `passive` — LoC/sec en continu)

| ID | Nom | baseCost | Effet | Valeur ajoutée |
|----|-----|---------|-------|----------------|
| `junior-dev` | Dev Junior | 1,000 LoC | +X LoC/sec (`passive`) | +0.5/sec |
| `senior-dev` | Dev Senior | 10,000 LoC | +X LoC/sec (`passive`) | +5/sec |
| `cloud-server` | Serveur Cloud | 50,000 LoC | +X LoC/sec (`passive`) | +50/sec |
| `quantum-computer` | Ordinateur Quantique | 1,000,000 LoC | +X LoC/sec (`passive`) | +500/sec |

#### Multiplicateurs (effets `multiplier` — multiplie tous les gains)

| ID | Nom | baseCost | Effet | Valeur ajoutée |
|----|-----|---------|-------|----------------|
| `coffee-machine` | Machine à Café | 2,500 LoC | ×N tous les gains (`multiplier`) | ×0.1 (additionnel) |
| `ai-copilot` | IA Copilot | 250,000 LoC | ×N tous les gains (`multiplier`) | ×0.5 (additionnel) |

**Note sur les multiplicateurs :** Les effets `multiplier` s'ajoutent au `clickMultiplier` de base (1.0). Donc acheter un Coffee Machine donne `clickMultiplier = 1.1`, puis un autre → `1.2`, etc.

### Application des Effets

```typescript
// Logique dans svc-user-progression (processPurchase) et Menu.tsx (Electron)
switch (item.effect.type) {
  case 'click':
    // Incrémente directement les LoC par frappe
    // Note: dans l'implémentation actuelle, 'click' additionne (pas multiplie)
    // clickMultiplier += item.effect.value;
    break;
    
  case 'passive':
    // Incrémente le taux de revenu passif (LoC/sec)
    // passiveIncomeRate += item.effect.value;
    break;
    
  case 'multiplier':
    // Multiplie tous les gains
    // clickMultiplier *= (1 + item.effect.value); OU clickMultiplier += item.effect.value;
    // (à confirmer selon l'implémentation finale)
    break;
}
```

---

## 4. Système de Niveaux (XP)

### Formule XP

```
experienceToNextLevel(niveau_n) = 100 × 1.5^(n-1)  [arrondi à l'entier supérieur]
```

| Niveau | XP nécessaires | Total XP cumulé |
|--------|---------------|-----------------|
| 1 → 2 | 100 | 100 |
| 2 → 3 | 150 | 250 |
| 3 → 4 | 225 | 475 |
| 4 → 5 | 337 | 812 |
| 5 → 6 | 506 | 1,318 |
| 10 → 11 | 3,844 | ~9,000 |
| 20 → 21 | ~117,000 | ~290,000 |

### Gain d'XP

**Sources actuelles :**
- **Frappes clavier (Electron)** : +1 XP par frappe
- **Complétion de programme (TODO)** : bonus XP selon le type de programme

**Logique de level-up :**
```typescript
// Dans electron/main.ts (game loop local)
if (gameState.experience >= gameState.experienceToNext) {
  gameState.level++;
  gameState.experience -= gameState.experienceToNext; // Reste de l'XP conservé
  gameState.experienceToNext = Math.ceil(gameState.experienceToNext * 1.5);
  // Notifie les fenêtres via IPC 'level-up'
}

// Dans svc-user-progression (serveur)
if (newExperience >= experienceToNextLevel) {
  level++;
  experience = newExperience - experienceToNextLevel;
  experienceToNextLevel = Math.ceil(experienceToNextLevel * 1.5);
}
```

### Effets du Niveau

**Actuellement :** Le niveau est affiché mais n'a pas d'effet de gameplay direct.

**Prévu (non implémenté) :**
- Débloquer de nouveaux programmes à certains niveaux
- Bonus de multiplicateur par palier de niveau
- Titre/rang affiché dans le leaderboard

---

## 5. Programmes & Expéditions

Les programmes sont des objectifs à long terme qui nécessitent d'accumuler un nombre de frappes.

### Types de Programmes

Source : `apps/worker-game-loop/src/program-processor/program-processor.service.ts`

| ID | Nom | Frappes requises | Récompense LoC | Récompense XP | Tier Loot |
|----|-----|-----------------|---------------|--------------|-----------|
| `fix_typo` | Corriger une Typo | 50 | 100 | 10 | COMMON |
| `compile_kernel` | Compiler le Kernel | 500 | 1,500 | 100 | RARE |
| `deploy_microservices` | Déployer des Microservices | 2,000 | 8,000 | 500 | EPIC |
| `refactor_legacy` | Refactoriser du Code Legacy | 1,000 | 4,000 | 250 | RARE |
| `research_ai` | Recherche IA | 5,000 | 25,000 | 2,000 | LEGENDARY |

### Cycle de Vie d'un Programme

```
AVAILABLE → IN_PROGRESS → COMPLETED
                       └→ FAILED
```

1. **AVAILABLE** : Programme non démarré, disponible pour lancement
2. **IN_PROGRESS** : Programme démarré, compteur `keyPressesContributed` s'incrémente
3. **COMPLETED** : Assez de frappes accumulées → récompenses distribuées
4. **FAILED** : Échec (ex: timeout, erreur système)

**Note :** Le mécanisme de lancement d'un programme (comment passer de AVAILABLE à IN_PROGRESS) n'est pas encore implémenté côté API.

### Progression d'un Programme

```
progression% = (keyPressesContributed / keyPressesRequired) × 100
```

Toutes les frappes clavier de l'utilisateur s'appliquent aux programmes actifs. Plusieurs programmes peuvent être actifs simultanément (à confirmer).

---

## 6. Système de Loot

### Tiers de Loot

| Tier | Rareté | Couleur UI |
|------|--------|-----------|
| `COMMON` | Fréquent | Gris/blanc |
| `RARE` | Peu fréquent | Bleu |
| `EPIC` | Rare | Violet |
| `LEGENDARY` | Exceptionnel | Or |

### Pondération des Drops

Le tier de loot droppé est **aléatoire** mais pondéré selon le tier de base du programme :

```typescript
// packages/shared-types ou apps/worker-game-loop/src/program-processor/loot-calculator.service.ts
const LOOT_WEIGHTS = {
  //                   COMMON  RARE   EPIC   LEGENDARY
  COMMON:    { C: 0.70, R: 0.25, E: 0.05, L: 0.00 },
  RARE:      { C: 0.40, R: 0.45, E: 0.13, L: 0.02 },
  EPIC:      { C: 0.10, R: 0.40, E: 0.40, L: 0.10 },
  LEGENDARY: { C: 0.00, R: 0.15, E: 0.50, L: 0.35 },
};
```

**Exemple pour `research_ai` (tier LEGENDARY) :**
- 0% de chance COMMON
- 15% de chance RARE
- 50% de chance EPIC
- 35% de chance LEGENDARY

### Algorithme de Tirage

```typescript
function calculateLoot(baseTier: LootTier): LootTier {
  const weights = LOOT_WEIGHTS[baseTier];
  const roll = Math.random(); // 0.0 → 1.0
  
  let cumulative = 0;
  for (const [tier, weight] of Object.entries(weights)) {
    cumulative += weight;
    if (roll < cumulative) return tier as LootTier;
  }
  return LootTier.COMMON; // fallback
}
```

### Stockage des Drops

Les drops sont stockés dans la table `LootDrop` en DB avec :
- `claimed: false` initialement
- Le joueur doit "réclamer" le drop pour en bénéficier (mécanisme non encore implémenté côté UI)

---

## 7. Récompenses Offline (AFK)

### Principe

Quand le joueur se reconnecte après une absence, il reçoit des LoC basés sur son **revenu passif** pendant son absence.

### Calcul

```typescript
const offlineDuration = Date.now() - lastActiveAt.getTime(); // ms
const cappedDuration = Math.min(offlineDuration, 8 * 60 * 60 * 1000); // max 8h
const durationSeconds = cappedDuration / 1000;

// TODO BUG-10 : devrait utiliser les vrais stats du joueur
const locEarned = passiveIncomeRate × clickMultiplier × durationSeconds;
const xpEarned = Math.floor(durationSeconds / 10); // 1 XP toutes les 10 secondes
```

### Limites

- **Plafond :** Maximum **8 heures** d'accumulation offline
- **Dépend de :** `passiveIncomeRate` du joueur (upgrades "passifs" achetés)
- **Actuellement :** Valeurs hardcodées (`passiveRate=1, multiplier=1`) — BUG-10

### Notification

À la reconnexion WebSocket, l'event `offline_reward` est émis au client :
```typescript
{
  userId: string,
  duration: number,   // secondes
  locEarned: number,
  xpEarned: number
}
```

---

## 8. Classement (Leaderboard)

### Types de Classements

| Type | Clé Redis | Description | Reset |
|------|-----------|-------------|-------|
| Global | `leaderboard:global` | Tous les LoC accumulés depuis la création | Jamais |
| Hebdomadaire | `leaderboard:weekly` | LoC accumulés dans la semaine | Chaque lundi |
| Journalier | `leaderboard:daily` | LoC accumulés aujourd'hui | Chaque minuit |

### Score

Le score dans le leaderboard = **LoC totaux (`totalLoCEarned`)** — pas le solde courant.

```typescript
// Mise à jour du score après chaque flush de buffer
await leaderboardService.updateScore(userId, totalLoCEarned, 'global');
```

### Synchronisation DB

Le service `LeaderboardSyncService` synchronise Redis → Postgres toutes les 5 minutes :
- Top 1000 joueurs sauvegardés en `LeaderboardSnapshot`
- Permet les requêtes historiques et les statistiques

---

## 9. Anti-Cheat

### Principes

Le keylogger ne peut pas être vérifié côté client, donc le serveur applique une analyse heuristique sur les **patterns temporels**.

### Métriques Analysées

| Métrique | Calcul | Seuil de détection |
|---------|--------|-------------------|
| Vitesse des frappes | `deltaMs` entre deux touches | < 20ms → bloqué (impossible humainement) |
| Régularité (bot) | Écart-type des N derniers deltas | < 5ms → bot détecté (intervalles trop réguliers) |
| Débit (CPS) | Compteur sur fenêtre 1s | > 20 CPS → throttled |
| Score de confiance | Combinaison des métriques | < 0.3 → clic refusé |

### Exemple de Détection

```
Humain typique :
  Deltas: [95ms, 112ms, 88ms, 134ms, 76ms, 103ms]
  Moyenne: 101ms | StdDev: 19.7ms → HUMAIN ✅ (score: 0.85)

Robot/Script :
  Deltas: [10ms, 10ms, 10ms, 10ms, 10ms]
  Moyenne: 10ms | StdDev: 0ms → BOT ❌ (score: 0.0, bloqué)

Macro rapide :
  Deltas: [50ms, 51ms, 49ms, 50ms, 50ms]
  StdDev: 0.7ms → SUSPECT ❌ (score: 0.1, bloqué)
```

### Stockage Redis

```
anticheat:timestamps:{userId}  → Liste des N derniers timestamps
anticheat:deltas:{userId}      → Liste des N derniers deltas inter-touches
throttle:violations:{userId}   → Compteur de violations (TTL 1h)
```

---

## 10. Abonnements (Monétisation)

### Tiers d'Abonnement

| Tier | Description | Statut |
|------|-------------|--------|
| `FREE` | Accès de base, toutes les fonctionnalités core | Actif par défaut |
| `BASIC` | Premier niveau payant | Structuré, non implémenté |
| `PREMIUM` | Milieu de gamme | Structuré, non implémenté |
| `ELITE` | Top tier | Structuré, non implémenté |

**Note :** Les tiers d'abonnement sont définis dans le schéma DB mais leurs **effets de gameplay ne sont pas encore implémentés** (voir BUG-04 et BUG-08).

### Effets Prévus des Abonnements (non implémentés)

| Tier | Multiplicateur offline | Durée offline max | Bonus passif |
|------|----------------------|------------------|--------------|
| FREE | ×1.0 | 8h | 0% |
| BASIC | ×1.5 | 12h | +10% |
| PREMIUM | ×2.0 | 24h | +25% |
| ELITE | ×3.0 | 72h | +50% |

---

## 11. Système de Combo (Desktop Only)

Le widget Electron affiche un multiplicateur visuel basé sur les frappes consécutives sans pause.

### Règles

- **Combo s'incrémente** : à chaque frappe clavier
- **Combo se réinitialise** : après une pause de 3 secondes sans frappe
- **Effet :** Purement visuel (changement de l'apparence de la mascotte CyberCat)

### Tiers Visuels

| Seuil | Tier | Couleur | Animation CyberCat |
|-------|------|---------|-------------------|
| 0–9 | — | Normal | Position neutre |
| 10–24 | RARE | Cyan/bleu | Légère lueur, chat "alert" |
| 25–49 | EPIC | Violet | Lueur intense + particules |
| 50–99 | LEGENDARY | Or | Rainbow + particules + animation spéciale |
| 100+ | MAX COMBO | Arc-en-ciel | Effet plein légendaire, intensité maximale |

**Note :** Le combo n'a aucun effet sur les LoC gagnés — c'est un feedback visuel uniquement.

---

## 12. Flux Économique Complet

```
[Frappes] ──×multiplier──► [LoC gagnés]
[Passif /sec] ──────────────►     │
[Programmes] ───────────────►     │
[Offline AFK] ──────────────►     │
                                  │
                          [Solde LoC]
                                  │
                    ┌─────────────┼──────────────┐
                    ▼             ▼              ▼
               [Boutique]   [Programmes]   [Stripe (€)]
               (dépense LoC) (dépense temps)  (achète €→LoC/boosts)
                    │
            [Items achetés]
          ┌─────────┴──────────┐
          ▼                    ▼
    [+clickMultiplier]    [+passiveIncomeRate]
          │                    │
     [Boucle de        [Boucle de
      rétroaction]      rétroaction]
```

Le jeu est une **boucle d'optimisation** : plus tu as de LoC, plus tu peux acheter d'upgrades, plus tu gagnes de LoC rapidement.
