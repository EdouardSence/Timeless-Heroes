# Fonctionnalites - Timeless Heroes

> Resume du concept, fonctionnalites principales, roles utilisateurs et flux fonctionnels.
> Derniere mise a jour : Mars 2026

---

## 1. Concept du jeu

**Timeless Heroes** est un jeu incremental (idle/clicker) concu pour les developpeurs. Le joueur accumule des **Lines of Code (LoC)** en tapant sur son clavier pendant qu'il travaille ou code. Ces LoC servent de monnaie pour acheter des equipements, recruter une equipe virtuelle et lancer des programmes automatises.

### Pitch

> "Chaque touche de clavier augmente un compteur. Avec ce compteur, on achete des objets, ameliorations et programmes. Les programmes travaillent pendant X temps et reviennent avec du loot. Un leaderboard global classe les joueurs. La progression continue hors-ligne (avec limites)."

### Genre et inspirations

- **Genre** : Idle Game / Clicker / Incremental
- **Theme** : Developpement informatique, culture dev
- **Inspirations** : Cookie Clicker, Adventure Capitalist, Bongo Cat
- **Differenciation** : Le "click" est remplace par les vraies frappes clavier du joueur pendant son travail quotidien

---

## 2. Roles utilisateurs

### 2.1 Joueur (utilisateur final)

| Action                           | Description                                                                       |
| -------------------------------- | --------------------------------------------------------------------------------- |
| S'inscrire / Se connecter        | Compte avec email, username, mot de passe                                         |
| Taper au clavier                 | Genere des LoC automatiquement via l'agent desktop ou le script PowerShell        |
| Acheter des items                | Utilise les LoC pour ameliorer ses multiplicateurs                                |
| Lancer des programmes            | Envoie des expeditions automatisees qui rapportent des recompenses apres un delai |
| Consulter le leaderboard         | Se comparer aux autres joueurs (global, hebdomadaire, quotidien)                  |
| Recevoir des recompenses offline | Accumulation passive pendant l'absence (cap 8h, 50% du taux passif)               |
| Acheter du contenu premium       | Via Stripe (monnaie premium, packs, boosts)                                       |

### 2.2 Roles de l'equipe projet

| Role          | Responsabilite                                       |
| ------------- | ---------------------------------------------------- |
| Product Owner | Definition du backlog, priorisation des User Stories |
| Scrum Master  | Facilitation des sprints, gestion du Kanban          |
| Tech Lead     | Decisions architecturales, revue de code             |
| DevOps        | Infrastructure Docker, CI/CD, monitoring             |

---

## 3. Fonctionnalites principales (Epics)

### Epic 1 : Systeme de frappe clavier et anti-cheat

**Statut : Implemente**

Le coeur du jeu. Chaque frappe clavier est captee, anonymisee et convertie en LoC.

**User Stories :**

- En tant que joueur, je veux que mes frappes clavier soient comptabilisees automatiquement pendant que je travaille
- En tant que joueur, je veux que mes frappes soient anonymisees (seule la categorie est transmise, jamais la touche reelle)
- En tant que systeme, je veux detecter les bots via l'analyse heuristique (CPS, variance, regularite)

**Fonctionnement :**

- Categories anonymisees : CHAR (+1 LoC), ENTER (+3), TAB (+2), FUNCTION (+2), MODIFIER (+1)
- Anti-cheat : max 20 CPS, ecart-type minimum 15ms, detection de regularite
- Write-behind : 600 touches/min bufferisees, 1 ecriture BDD toutes les 5s

**Issues liees :** #15 (Detection de Bot - Pattern Analysis), #9 (Worker de Batch Processing)

---

### Epic 2 : Authentification et gestion des sessions

**Statut : Implemente**

**User Stories :**

- En tant que joueur, je veux creer un compte et me connecter de facon securisee
- En tant que joueur, je veux rester connecte sans re-saisir mes identifiants
- En tant que systeme, je veux revoquer les tokens compromis

**Fonctionnement :**

- JWT access token (cookie httpOnly ou Bearer header)
- Refresh token rotation avec detection de reutilisation (revocation en cascade)
- Mots de passe hashes avec bcrypt
- Tokens stockes en base sous forme de hash SHA256
- Middleware Next.js protege toutes les routes web

**Issue liee :** #12 (Authentification JWT Centralisee)

---

### Epic 3 : Progression du joueur (XP, niveaux, multiplicateurs)

**Statut : Partiellement implemente (Maps en memoire, TODO Prisma)**

**User Stories :**

- En tant que joueur, je veux voir mon niveau et mon XP progresser
- En tant que joueur, je veux que mes multiplicateurs augmentent avec mes achats
- En tant que systeme, je veux persister la progression en base de donnees

**Fonctionnement :**

- XP necessaire par niveau : scaling 1.5x (level 1 = 100 XP, level 2 = 150 XP, ...)
- Multiplicateurs recalcules dynamiquement a chaque achat
- Leaderboards Redis Sorted Sets : global, hebdomadaire (reset lundi), quotidien (reset minuit)

**Lacune :** Le service `svc-user-progression` utilise des `Map<string, ...>` en memoire au lieu de Prisma. Les donnees sont perdues au redemarrage.

---

### Epic 4 : Boutique (systeme d'items)

**Statut : Backend implemente, frontend partiel**

**User Stories :**

- En tant que joueur, je veux acheter des items pour ameliorer ma production de LoC
- En tant que joueur, je veux voir le cout et l'effet de chaque item avant l'achat
- En tant que joueur, je veux que les prix augmentent a chaque achat

**Items disponibles :**

| Item                | Cout de base | Effet                  | Rarete    |
| ------------------- | ------------ | ---------------------- | --------- |
| Mechanical Keyboard | 100 LoC      | Click multiplier +0.5  | COMMON    |
| Monitor 4K          | 500 LoC      | Click multiplier +1.0  | UNCOMMON  |
| Coffee Machine      | 1,000 LoC    | Passive income +0.1/s  | RARE      |
| Junior Dev          | 5,000 LoC    | Passive income +1.0/s  | RARE      |
| Senior Dev          | 25,000 LoC   | Passive income +5.0/s  | EPIC      |
| Cloud Server        | 100,000 LoC  | Passive income +20.0/s | LEGENDARY |

**Formule de cout :** `Prix = CoutBase * 1.15^NombrePossede`

**Issue liee :** #26 (Integration Boutique UI & API)

---

### Epic 5 : Programmes / Expeditions

**Statut : Backend implemente**

**User Stories :**

- En tant que joueur, je veux envoyer mes personnages en expedition automatique
- En tant que joueur, je veux recevoir du loot aleatoire a la fin d'un programme
- En tant que joueur, je veux pouvoir lancer jusqu'a 3 programmes simultanement

**Types de programmes :**

| Programme            | Duree  | Recompenses LoC | XP           | Loot              |
| -------------------- | ------ | --------------- | ------------ | ----------------- |
| Fix Typo             | 1 min  | 50-100          | 10-20        | Items basiques    |
| Compile Kernel       | 10 min | 500-1,000       | 100-200      | Items uncommon    |
| Deploy Microservices | 30 min | 2,000-5,000     | 500-1,000    | Items rares       |
| Refactor Legacy      | 1h     | 5,000-15,000    | 1,000-3,000  | Items epiques     |
| Research AI          | 2h     | 20,000-50,000   | 5,000-10,000 | Items legendaires |

**Mecanique de loot :**

- Chaque programme a une loot table avec des taux de drop
- Possibilite de "critical loot" (2x quantite)
- Quantites aleatoires par drop
- Consolidation automatique des doublons

---

### Epic 6 : Notifications temps reel (WebSocket)

**Statut : Implemente**

**User Stories :**

- En tant que joueur, je veux voir mon solde se mettre a jour en temps reel
- En tant que joueur, je veux etre notifie quand un programme se termine
- En tant que joueur, je veux voir le leaderboard evoluer en direct

**Evenements WebSocket (Socket.IO, namespace `/game`) :**

| Evenement            | Direction         | Payload                            |
| -------------------- | ----------------- | ---------------------------------- |
| `KEY_PRESS`          | Client -> Serveur | timestamp, keyType                 |
| `CLICK_PROCESSED`    | Serveur -> Client | finalValue, newBalance, isCritical |
| `BALANCE_UPDATE`     | Serveur -> Client | newBalance, delta                  |
| `LEADERBOARD_UPDATE` | Serveur -> Client | entries[]                          |
| `PROGRAM_COMPLETED`  | Serveur -> Client | rewards, loot[]                    |
| `OFFLINE_REWARDS`    | Serveur -> Client | rewards, duration, programs[]      |

**Issue liee :** #10 (Systeme de Notification Temps Reel)

---

### Epic 7 : Progression hors-ligne

**Statut : Backend implemente**

**User Stories :**

- En tant que joueur, je veux accumuler des LoC meme quand je ne suis pas connecte
- En tant que joueur premium, je veux beneficier d'une duree hors-ligne etendue

**Regles :**

- Taux offline = 50% du taux passif
- Duree max : 8h (standard), 24h (premium)
- Les programmes en cours se terminent normalement pendant l'absence
- Upgrades possibles : `offline-efficiency` (+25%, +50%, +75%), `offline-time` (+4h, +8h)

---

### Epic 8 : Paiements (Stripe)

**Statut : Backend implemente (stubs provisioning)**

**User Stories :**

- En tant que joueur, je veux acheter de la monnaie premium
- En tant que systeme, je veux garantir qu'un paiement n'est credite qu'une seule fois

**Types de produits :**

- `PREMIUM_CURRENCY` : Monnaie premium
- `ITEM_PACK` : Pack d'items
- `SUBSCRIPTION` : Abonnement premium
- `BOOST` : Boost temporaire

**Lacune :** Les fonctions de provisioning sont des stubs (TODO dans le code).

---

### Epic 9 : Application Desktop

**Statut : Implemente**

**User Stories :**

- En tant que joueur, je veux un widget discret qui s'affiche par-dessus mes applications
- En tant que joueur, je veux voir ma mascotte reagir a mes frappes
- En tant que joueur, je veux acceder au shop sans quitter mon travail

**Fonctionnalites :**

- Widget overlay transparent et draggable avec mascotte `CyberCat` animee
- Fenetre menu pour le shop, les stats et la gestion
- System tray avec menu contextuel
- Capture globale clavier via `uiohook-napi`
- Persistance locale via `electron-store`
- Build multi-plateforme : Windows (NSIS), Linux (AppImage), macOS (DMG)

---

### Epic 10 : Leaderboard

**Statut : Backend implemente, frontend placeholder**

**User Stories :**

- En tant que joueur, je veux me comparer aux autres joueurs
- En tant que joueur, je veux voir mon classement global, hebdomadaire et quotidien

**Types de leaderboard :**

| Type   | Reset       | Cle Redis                     |
| ------ | ----------- | ----------------------------- |
| GLOBAL | Jamais      | `leaderboard:global`          |
| WEEKLY | Lundi 00:00 | `leaderboard:weekly:{weekId}` |
| DAILY  | 00:00       | `leaderboard:daily:{date}`    |

---

## 4. Fonctionnalites planifiees (Backlog)

Issues ouvertes et TODOs identifies dans le code :

| Priorite | Fonctionnalite                                       | Source                        |
| -------- | ---------------------------------------------------- | ----------------------------- |
| Haute    | Integration Prisma dans svc-user-progression         | TODO dans le code             |
| Haute    | Integration Prisma dans worker-game-loop             | TODO dans le code             |
| Haute    | Script init BDD (seed items, programs, achievements) | Contrainte cahier des charges |
| Haute    | Tests automatises                                    | Contrainte cahier des charges |
| Haute    | CI/CD GitHub Actions                                 | Contrainte cahier des charges |
| Moyenne  | Integration Boutique UI & API                        | Issue #26                     |
| Moyenne  | Detection de Bot avancee                             | Issue #15                     |
| Moyenne  | Authentification JWT Centralisee (finition)          | Issue #12                     |
| Moyenne  | Notifications Temps Reel (finition)                  | Issue #10                     |
| Moyenne  | Worker Batch Processing (finition)                   | Issue #9                      |
| Basse    | Communication gRPC inter-services                    | Code commente                 |
| Basse    | Systeme de prestige                                  | README backlog                |
| Basse    | Evenements temporaires                               | README backlog                |
| Basse    | Guildes / Equipes                                    | README backlog                |
| Basse    | Mode competitif                                      | README backlog                |

---

## 5. Flux fonctionnels

### 5.1 Premiere connexion

```
Joueur -> /register (username, email, password)
       -> Compte cree en BDD (Prisma)
       -> Progression initialisee (level 1, 0 LoC)
       -> JWT access + refresh tokens generes
       -> Redirect /dashboard
       -> Telecharge l'app desktop OU lance le script PowerShell
       -> Agent s'authentifie via TCP avec le JWT
       -> Les frappes commencent a compter
```

### 5.2 Session de jeu typique

```
1. Le joueur ouvre son IDE et travaille normalement
2. L'agent desktop capte chaque frappe -> TCP -> API Gateway
3. Le widget overlay affiche les LoC en temps reel
4. Le joueur accumule des LoC pendant 1h de travail
5. Il ouvre le menu -> achete un "Junior Dev" (+1 LoC/s passif)
6. Il lance un programme "Deploy Microservices" (30 min)
7. Il continue a travailler
8. Notification : programme termine -> +3,500 LoC, +750 XP, loot "Rare Monitor"
9. Il consulte le leaderboard -> il est 42eme mondial
10. Il ferme son PC -> progression offline commence
```

### 5.3 Reconnexion apres absence

```
1. Le joueur se reconnecte apres 6h d'absence
2. API Gateway detecte la reconnexion
3. OfflineCalculator :
   - 6h * passiveRate * 0.5 = recompenses AFK
   - Programmes termines pendant l'absence : loot ajoute
4. Notification OFFLINE_REWARDS avec le resume
5. Le joueur reprend le jeu avec ses recompenses
```
