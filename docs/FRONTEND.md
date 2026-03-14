# Timeless Heroes — Documentation Frontend

> Web (Next.js), Desktop (Electron), Design System (@repo/ui).
> Dernière mise à jour : Mars 2026

---

## 1. Vue d'ensemble Frontend

Le projet possède **deux frontends distincts** qui ne communiquent pas entre eux et ne partagent pas leur état :

| App | Tech | Port | Usage | Connexion Backend |
|-----|------|------|-------|------------------|
| `apps/web` | Next.js 14 App Router | 3001 | Dashboard web, jeu en navigateur | Partielle (port erroné) |
| `apps/desktop` | Electron + Vite + React | 4000 (dev) | Overlay always-on-top, usage quotidien | **Aucune** (100% local) |

**Design system partagé :** `@repo/ui` — composants React "Cozy Cyber" utilisés dans les deux apps.

---

## 2. Frontend Web (`apps/web`)

### Stack

- **Framework :** Next.js 14 (App Router)
- **Styling :** CSS Modules + Tailwind CSS
- **Composants UI :** `@repo/ui` (GlassCard, NeonButton, NeonProgress, StatCard)
- **Connexion WS :** WebSocket natif (pas Socket.IO client — incohérence avec le serveur)

### Structure

```
apps/web/
├── app/
│   ├── layout.tsx          Layout racine (font, metadata)
│   ├── page.tsx            Route / — Template Turborepo (non jeu)
│   ├── dashboard/
│   │   └── page.tsx        Route /dashboard — Command Center (UI mockée)
│   └── game/
│       └── page.tsx        Route /game — Jeu WebSocket (partiellement fonctionnel)
├── components/             (aucun composant personnalisé actuellement)
├── styles/                 CSS global
└── package.json
```

### Routes

---

#### Route `/` — Page d'accueil

**Fichier :** `app/page.tsx`
**Statut :** Template Turborepo, non modifié pour le jeu

```typescript
// Récupère des "links" depuis localhost:3000/links (API template)
// Affiche une liste de liens Turborepo
// À remplacer par une vraie landing page du jeu
```

**À faire :** Remplacer par une page d'accueil du jeu ou une redirection vers `/dashboard`.

---

#### Route `/dashboard` — Command Center

**Fichier :** `app/dashboard/page.tsx`
**Statut :** UI complète avec données mockées (pas de connexion API)

**Sections de la page :**

1. **Header** — Titre "Command Center", indicateur de statut
2. **Stats Row** — 4 `StatCard` :
   - LoC totaux (hardcodé : "2.4M")
   - Niveau actuel (hardcodé : "42")
   - Frappes aujourd'hui (hardcodé : "1,337")
   - Rang global (hardcodé : "#127")
3. **Daily Commits** (quêtes journalières) — 3 quêtes avec `NeonProgress` :
   - "Type 500 characters" (350/500)
   - "Complete a program" (1/1)
   - "Reach top 100" (127/100)
4. **Package Manager** (boutique) — 4 items avec `GlassCard` + `NeonButton` :
   - "junior-dev" — 1,000 LoC
   - "coffee-machine" — 2,500 LoC
   - "senior-dev" — 10,000 LoC
   - "cloud-server" — 50,000 LoC
5. **System Monitor** — 2 métriques avec `NeonProgress` :
   - "Processing Power" (73%)
   - "Memory Allocation" (45%)

**Tous les chiffres sont hardcodés** — aucun appel API.

---

#### Route `/game` — Interface de Jeu

**Fichier :** `app/game/page.tsx`
**Statut :** Fonctionnel partiellement — WebSocket présent mais connexion au mauvais port

**Connexion WebSocket :**
```typescript
// PROBLÈME : Se connecte à ws://localhost:9998 (ancien keylogger WS server)
// CORRECT : Devrait être ws://localhost:3000/game (Socket.IO namespace)
const ws = new WebSocket('ws://localhost:9998');
```

**Structure de la page :**

1. **Onglet Jeu principal** :
   - Compteur LoC (mis à jour via WebSocket `STATE_UPDATE`)
   - Bouton "Appuyer" (envoie `CLICK`)
   - Indicateur connexion (vert/rouge selon WS)
   - Instructions pour lancer le keylogger PowerShell

2. **Onglet Boutique** :
   - 6 items hardcodés dans le composant (légèrement différents de `SHOP_ITEMS`) :
     - mechanical-keyboard (100 LoC)
     - monitor-4k (500 LoC)
     - coffee-machine (2500 LoC)
     - junior-dev (1000 LoC)
     - senior-dev (10000 LoC)
     - cloud-server (50000 LoC)
   - Bouton "Acheter" envoie `PURCHASE` via WebSocket

3. **Onglet Leaderboard** :
   - Placeholder vide "coming soon"

**Messages WebSocket attendus :**
```typescript
// Reçus depuis le serveur
{ type: 'STATE_UPDATE', payload: { linesOfCode, level, ... } }

// Envoyés au serveur
{ type: 'CLICK' }
{ type: 'PURCHASE', payload: { itemSlug: string } }
```

**Incohérence de protocole :** Le serveur utilise **Socket.IO** avec des events nommés (`click_ack`, `state_update`), mais le client web utilise du **WebSocket brut** avec des messages JSON `{ type, payload }`.

---

## 3. Frontend Desktop (`apps/desktop`)

### Stack

- **Framework :** Electron 29
- **Build tool :** Vite (mode dev : port 4000)
- **UI :** React 18 + TypeScript
- **Styling :** CSS Modules + animations CSS
- **Hook clavier global :** `uiohook-napi`
- **Persistance locale :** `electron-store`
- **Routing :** React Router DOM (dans le renderer)

### Architecture Electron

```
apps/desktop/
├── electron/
│   ├── main.ts             Process principal Electron
│   └── preload.ts          Bridge contextBridge → window.electronAPI
├── src/
│   ├── main.tsx            Point d'entrée React (renderer)
│   ├── components/
│   │   ├── HoloWidget.tsx         Widget overlay principal
│   │   ├── HoloWidget.css
│   │   ├── CyberCat.tsx           Mascotte SVG animée
│   │   ├── CyberCat.css
│   │   ├── Menu.tsx               Fenêtre menu (shop + stats + leaderboard)
│   │   ├── Menu.css
│   │   ├── Auth.tsx               Fenêtre auth (login / register)  ← NEW
│   │   └── Auth.css               Styles auth cozy cyberpunk        ← NEW
│   ├── types/
│   │   └── electron.d.ts          Déclarations window.electronAPI
│   ├── components/Widget/         (legacy, non utilisé)
│   └── components/BongoCat/       (legacy, non utilisé)
└── package.json
```

### Flux de démarrage (startup flow)

```
app.whenReady()
  └── tryRestoreSession()
        ├── true  → createWidgetWindow() + createMenuWindow()
        │           startKeyboardListener() + startPassiveLoop()
        └── false → createAuthWindow()   ← shows /#/auth (Auth component)
                      │
                      └── user logs in / registers
                            └── IPC "launch-game" sent by Auth component
                                  └── closeAuthWindow()
                                      createWidgetWindow() + createMenuWindow()
                                      startKeyboardListener() + startPassiveLoop()
```

### Process Principal (electron/main.ts)

```typescript
// Variables d'état (in-memory + persisté via electron-store)
let gameState: IGameState;           // LoC, level, XP, multiplier, passiveRate
let items: Record<string, number>;   // Quantité de chaque item possédé

// Trois fenêtres possibles
authWindow   = BrowserWindow({ width: 420, height: 560, frame: false, ... })
               // → /#/auth → Auth component
widgetWindow = BrowserWindow({ width: 420, height: 320, alwaysOnTop: true, ... })
               // → /#/widget → HoloWidget
menuWindow   = BrowserWindow({ width: 450, height: 600, center: true, ... })
               // → /#/menu → Menu

// authWindow est créée uniquement si tryRestoreSession() retourne false
// widgetWindow + menuWindow sont créées soit par tryRestoreSession (true), soit par IPC "launch-game"

// System tray
const tray = new Tray(icon);
tray.on('click', () => menuWindow.show() ou menuWindow.hide());
```

### Game Loop Local

```typescript
// Hook clavier (uiohook-napi)
uIOhook.on('keyup', (event) => {
  // 1. Incrémente gameState.linesOfCode += floor(1 * gameState.multiplier)
  // 2. Incrémente gameState.totalKeyPresses++
  // 3. Incrémente gameState.experience += 1
  // 4. Check level-up : if experience >= experienceToNext
  //      → level++
  //      → experience = 0
  //      → experienceToNext = Math.ceil(experienceToNext * 1.5)
  //      → Envoie IPC 'level-up' aux deux fenêtres
  // 5. Sauvegarde dans electron-store
  // 6. Envoie IPC 'game-state-update' aux deux fenêtres
  // 7. Envoie IPC 'user-keypress' aux deux fenêtres (pour combo)
});

// Revenu passif
setInterval(() => {
  // gameState.linesOfCode += gameState.passiveRate * gameState.multiplier
  // → Chaque seconde, génère du LoC passif
  // Sauvegarde et notifie les deux fenêtres
}, 1000);
```

### IPC Channels

| Channel | Direction | Handler | Description |
|---------|-----------|---------|-------------|
| `get-game-state` | invoke (renderer→main) | Retourne `gameState` | Récupère l'état initial |
| `get-items` | invoke (renderer→main) | Retourne `items` | Récupère les items possédés |
| `update-multiplier` | invoke (renderer→main) | Met à jour `gameState.multiplier` | Après achat d'upgrade |
| `update-passive-rate` | invoke (renderer→main) | Met à jour `gameState.passiveRate` | Après achat d'item passif |
| `subtract-loc` | invoke (renderer→main) | Déduit LoC, retourne `boolean` (succès) | Paiement achat boutique |
| `save-items` | invoke (renderer→main) | Sauvegarde `items` | Après modification du stock |
| `show-menu` | send (renderer→main) | `menuWindow.show()` | Ouvre le menu |
| `hide-menu` | send (renderer→main) | `menuWindow.hide()` | Ferme le menu |
| `toggle-widget-size` | send (renderer→main) | Resize widget window | Collapse/expand |
| `close-app` | send (renderer→main) | `app.quit()` | Quitter l'application |
| `move-widget` | send (renderer→main) | `widgetWindow.setPosition(x, y)` | Déplacement du widget |
| `backend-login` | invoke (renderer→main) | `BackendSync.login()` | Authentification backend |
| `backend-register` | invoke (renderer→main) | `BackendSync.register()` | Inscription backend |
| `backend-logout` | invoke (renderer→main) | `BackendSync.logout()` | Déconnexion |
| `backend-status` | invoke (renderer→main) | Retourne `BackendStatus` | Statut connexion |
| `backend-leaderboard` | invoke (renderer→main) | `GET /api/v1/progression/leaderboard` | Classement |
| `launch-game` | send (renderer→main) | Ferme authWindow, ouvre widget+menu | Lancement post-auth |
| `game-state-update` | send (main→renderer) | Reçu dans les composants | État mis à jour |
| `user-keypress` | send (main→renderer) | Reçu dans HoloWidget | Frappe pour le combo |
| `level-up` | send (main→renderer) | Reçu dans HoloWidget | Notification de level-up |

### Composant HoloWidget

**Route :** `/widget`
**Fichier :** `src/components/HoloWidget/HoloWidget.tsx`

```
┌──────────────────────────────────────────┐
│  [≡] TIMELESS HEROES               [×]   │
│  ─────────────────────────────────────   │
│  [CyberCat]    💻 2,450 LoC              │
│                🏆 Niveau 3               │
│                ⌨️  ×2.5 mult             │
│                💤 5.0 /sec              │
│                🔑 1,337 frappes          │
│  ─────────────────────────────────────   │
│  BUILD ████████░░░░░░ 65%               │
│  ─────────────────────────────────────   │
│  COMBO: x12  [RARE ✦]                   │
│  ─────────────────────────────────────   │
│  [Shop]              [Drag: ☰]          │
└──────────────────────────────────────────┘
```

**Fonctionnalités :**
- Affichage temps réel (écoute IPC `game-state-update`)
- Barre de progression BUILD = `experience / experienceToNext`
- Système de combo : compteur de frappes consécutives sans pause > 3s
- Mascotte CyberCat qui réagit (`isTyping`, `comboTier`)
- Bouton shop → IPC `show-menu`
- Drag → IPC `move-widget` (mousedown + mousemove)
- Bouton collapse → IPC `toggle-widget-size`
- Bouton close → IPC `close-app`

### Composant CyberCat

**Fichier :** `src/components/HoloWidget/CyberCat.tsx`

SVG custom d'un chat cyberpunk (casque VR, clavier RGB, hoodie à capuche).

**Props :**
```typescript
interface CyberCatProps {
  isTyping: boolean;    // Anime le chat (mouvement des pattes)
  combo: number;        // Nombre de frappes combo actuel
  compact?: boolean;    // Mode réduit (widget effondré)
}
```

**Tiers de combo et effets visuels :**
| Seuil combo | Tier | Couleur | Effets |
|-------------|------|---------|--------|
| < 10 | COMMON | Gris/blanc | Aucun effet spécial |
| 10–24 | RARE | Bleu cyan | Lueur douce |
| 25–49 | EPIC | Violet | Lueur intense + particules |
| 50–99 | LEGENDARY | Or/rainbow | Rainbow + particules + animation spéciale |
| 100+ | MAX | Arc-en-ciel | Plein effet légendaire |

### Composant Menu

**Route :** `/menu`
**Fichier :** `src/components/Menu/Menu.tsx`

Trois onglets :

#### Onglet "SHOP" (boutique)

```typescript
// Charge les items depuis @repo/shared-types SHOP_ITEMS
// Pour chaque item, affiche :
//   - Nom, icône, description
//   - Coût calculé : baseCost * 1.15^owned (via ItemCostCalculatorService local)
//   - Quantité possédée
//   - Bouton "ACHETER" → handlePurchase()

async handlePurchase(item: IShopItem) {
  const cost = calculateCost(item, items[item.id] || 0);
  const success = await ipcRenderer.invoke('subtract-loc', cost);
  if (success) {
    items[item.id] = (items[item.id] || 0) + 1;
    
    // Applique l'effet de l'item
    if (item.effect.type === 'click') {
      const newMultiplier = gameState.multiplier + item.effect.value;
      await ipcRenderer.invoke('update-multiplier', newMultiplier);
    } else if (item.effect.type === 'passive') {
      const newPassive = gameState.passiveRate + item.effect.value;
      await ipcRenderer.invoke('update-passive-rate', newPassive);
    }
    // Les effets 'multiplier' et 'special' sont appliqués différemment
    
    await ipcRenderer.invoke('save-items', items);
  }
}
```

#### Onglet "STATS"

Affiche les statistiques du joueur :
- LoC totaux
- Niveau + barre XP
- Multiplicateur actuel
- Revenu passif /sec
- Total frappes

#### Onglet "LEADERBOARD"

Statut : placeholder hardcodé
```
🏆 Classement
#1 Toi 👑  —  coming soon
```

---

### Composant Auth

**Route :** `/auth`
**Fichiers :** `src/components/Auth.tsx`, `src/components/Auth.css`

Fenêtre de login/register affichée au démarrage si aucune session sauvegardée.

**Props :** Aucune — utilise `window.electronAPI` directement.

**Modes :**
- `login` — email + password → `window.electronAPI.backendLogin()`
- `register` — username + email + password → `window.electronAPI.backendRegister()`

**Flux :**
1. L'utilisateur remplit le formulaire et soumet.
2. L'API `backendLogin` ou `backendRegister` est appelée via IPC.
3. Si succès → `window.electronAPI.launchGame()` → main process ferme authWindow et ouvre widget+menu.
4. Si erreur → message d'erreur affiché inline (animation shake).

**Design :** cozy cyberpunk — bordure de circuit animée, fond glassmorphism, fonts JetBrains Mono, palette `var(--neon-cyan)` / `var(--neon-lavender)`. Matches HoloWidget/Menu aesthetic.

---

## 4. Design System `@repo/ui`

### GlassCard

```typescript
interface GlassCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'cyan' | 'lavender' | 'pink' | 'mint' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;          // Lueur colorée
  hover?: boolean;         // Effet hover (scale + brightness)
  circuitBorder?: boolean; // Bordure style circuit imprimé
  className?: string;
}
```

**Usage :**
```tsx
<GlassCard variant="cyan" glow hover circuitBorder>
  <p>Contenu de la carte</p>
</GlassCard>
```

### NeonButton

```typescript
interface NeonButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  color?: 'cyan' | 'lavender' | 'pink' | 'mint' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;   // Icône à gauche du texte
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}
```

**Usage :**
```tsx
<NeonButton variant="primary" color="cyan" size="lg" loading={isLoading}>
  Acheter
</NeonButton>
```

### NeonProgress

```typescript
interface NeonProgressProps {
  value: number;            // 0–100
  variant?: 'cyan' | 'lavender' | 'pink' | 'mint' | 'gold' | 'rainbow';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  animated?: boolean;       // Animation de shimmer
  segments?: number;        // Divise la barre en N segments
  showLabel?: boolean;      // Affiche le pourcentage
  label?: string;           // Label personnalisé
  className?: string;
}
```

**Usage :**
```tsx
<NeonProgress
  value={65}
  variant="cyan"
  size="md"
  animated
  showLabel
  label="BUILD PROGRESS"
/>
```

### StatCard

```typescript
interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color?: 'cyan' | 'lavender' | 'pink' | 'mint' | 'gold' | 'peach';
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;      // Ex: "+12%"
  prefix?: string;          // Ex: "#" pour les rangs
  suffix?: string;          // Ex: "/sec" pour les taux
  className?: string;
}
```

**Usage :**
```tsx
<StatCard
  icon={<CodeIcon />}
  value="2.4M"
  label="Lines of Code"
  color="cyan"
  trend="up"
  trendValue="+15%"
  suffix=" LoC"
/>
```

---

## 5. Problèmes Connus Frontend

### Problème 1 : Port WebSocket erroné (apps/web/game)

**Fichier :** `apps/web/app/game/page.tsx`
**Problème :** Connexion à `ws://localhost:9998` (ancien serveur keylogger standalone)
**Correct :** Socket.IO sur `ws://localhost:3000/game` avec le client `socket.io-client`

**Fix attendu :**
```typescript
// Remplacer :
const ws = new WebSocket('ws://localhost:9998');

// Par :
import { io } from 'socket.io-client';
const socket = io('http://localhost:3000/game', {
  auth: { token: jwtToken }
});
socket.on('click_ack', (data) => { ... });
socket.on('state_update', (data) => { ... });
```

### ~~Problème 2 : Desktop app isolée du backend~~ — CORRIGÉ (BUG-06)

**Fichiers :** `apps/desktop/electron/main.ts`, `preload.ts`, `src/components/Auth.tsx`
**Statut :** Corrigé — authentification JWT + fenêtre auth + flush de keystrokes vers l'ingest service.

**Ce qui a été fait :**
1. Fenêtre auth (`authWindow` 420×560) montrée au démarrage si aucune session sauvegardée
2. Composant `Auth.tsx` — formulaire login / register cozy cyberpunk
3. `BackendSync.register()` ajouté — `POST /api/v1/auth/register` puis auto-login
4. `tryRestoreSession()` retourne `boolean` — gère le flux de démarrage
5. IPC `launch-game` — ferme authWindow, ouvre widget+menu, démarre le jeu
6. Keystrokes anonymisés flushés toutes les 3s via `POST /api/v1/ingest/key`
3. Synchroniser l'état local avec le serveur toutes les N secondes

### Problème 3 : Données hardcodées dans le dashboard web

**Fichier :** `apps/web/app/dashboard/page.tsx`
**Problème :** Toutes les statistiques et la boutique affichent des données statiques
**Fix attendu :** Intégrer des appels API vers `GET /api/v1/progression/:userId`

### Problème 4 : Catalogue boutique incohérent

**Fichier :** `apps/web/app/game/page.tsx` (ligne ~85)
**Problème :** 6 items définis en dur dans le composant, légèrement différents de `SHOP_ITEMS` dans `@repo/shared-types`
**Fix attendu :** Importer `SHOP_ITEMS` depuis `@repo/shared-types`

### Problème 5 : Leaderboard desktop toujours mockée

**Fichier :** `apps/desktop/src/components/Menu/Menu.tsx`
**Problème :** Onglet Leaderboard affiche "#1 Toi 👑 — coming soon" hardcodé
**Fix attendu :** Appel API `GET /api/v1/progression/leaderboard/GLOBAL` après intégration backend
