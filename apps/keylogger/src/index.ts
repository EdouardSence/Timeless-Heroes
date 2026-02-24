/**
 * Timeless Heroes - Keyboard Server
 * 
 * Ce serveur :
 * 1. Reçoit les frappes clavier du script hook (PowerShell/Bash/etc.)
 * 2. Met à jour les stats du joueur
 * 3. Synchronise avec le dashboard web via WebSocket
 * 
 * Compatible: Windows (PowerShell), Linux (xinput/libinput), macOS (hidutil)
 */

import chalk from 'chalk';
import * as fs from 'fs';
import * as net from 'net';
import * as os from 'os';
import * as path from 'path';
import { WebSocket, WebSocketServer } from 'ws';

// ============================================================================
// CONFIGURATION
// ============================================================================

const TCP_PORT = parseInt(process.env.KEYLOGGER_TCP_PORT || '9999', 10);
const WS_PORT = parseInt(process.env.KEYLOGGER_WS_PORT || '9997', 10);
const DATA_FILE = path.join(__dirname, '../game-data.json');
const SAVE_INTERVAL = 5000;   // Sauvegarder toutes les 5 secondes

// Détection du système d'exploitation
const PLATFORM = os.platform(); // 'win32', 'linux', 'darwin'

// ============================================================================
// GAME STATE
// ============================================================================

interface GameData {
  linesOfCode: number;
  totalKeyPresses: number;
  level: number;
  experience: number;
  experienceToNext: number;
  multiplier: number;
  passiveRate: number;
  items: { [key: string]: number };
  lastSave: string;
}

let gameData: GameData = {
  linesOfCode: 0,
  totalKeyPresses: 0,
  level: 1,
  experience: 0,
  experienceToNext: 100,
  multiplier: 1.0,
  passiveRate: 0,
  items: {},
  lastSave: new Date().toISOString(),
};

// ============================================================================
// ITEMS CONFIGURATION
// ============================================================================

const ITEMS = {
  'mechanical-keyboard': { name: 'Clavier Mécanique', baseCost: 100, clickBonus: 1 },
  'monitor-4k': { name: 'Écran 4K', baseCost: 500, clickBonus: 2 },
  'coffee-machine': { name: 'Machine à Café', baseCost: 2500, multiplierBonus: 0.1 },
  'junior-dev': { name: 'Dev Junior', baseCost: 1000, passiveBonus: 0.5 },
  'senior-dev': { name: 'Dev Senior', baseCost: 10000, passiveBonus: 5 },
  'cloud-server': { name: 'Serveur Cloud', baseCost: 50000, passiveBonus: 50 },
};

// ============================================================================
// PERSISTENCE
// ============================================================================

function loadGameData(): void {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const saved = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      gameData = { ...gameData, ...saved };
      console.log(chalk.green('✅ Données chargées'));
    }
  } catch (err) {
    console.log(chalk.yellow('⚠️  Nouvelle partie'));
  }
  recalculateMultipliers();
}

function saveGameData(): void {
  gameData.lastSave = new Date().toISOString();
  fs.writeFileSync(DATA_FILE, JSON.stringify(gameData, null, 2));
}

// ============================================================================
// GAME LOGIC
// ============================================================================

function recalculateMultipliers(): void {
  let clickBonus = 0;
  let mult = 1.0;
  let passive = 0;

  for (const [slug, count] of Object.entries(gameData.items)) {
    const item = ITEMS[slug as keyof typeof ITEMS];
    if (!item) continue;

    if ('clickBonus' in item) clickBonus += item.clickBonus * count;
    if ('multiplierBonus' in item) mult += item.multiplierBonus * count;
    if ('passiveBonus' in item) passive += item.passiveBonus * count;
  }

  gameData.multiplier = (1 + clickBonus) * mult;
  gameData.passiveRate = passive;
}

function onKeyPress(): void {
  const gained = Math.floor(1 * gameData.multiplier);
  gameData.linesOfCode += gained;
  gameData.totalKeyPresses++;
  gameData.experience++;

  // Level up check
  while (gameData.experience >= gameData.experienceToNext) {
    gameData.experience -= gameData.experienceToNext;
    gameData.level++;
    gameData.experienceToNext = Math.floor(gameData.experienceToNext * 1.5);
    console.log(chalk.magenta(`🎉 Niveau ${gameData.level} atteint!`));
  }

  // Broadcast to dashboard
  broadcastState();
}

function purchaseItem(slug: string): { success: boolean; message: string } {
  const item = ITEMS[slug as keyof typeof ITEMS];
  if (!item) return { success: false, message: 'Item inconnu' };

  const owned = gameData.items[slug] || 0;
  const cost = Math.floor(item.baseCost * Math.pow(1.15, owned));

  if (gameData.linesOfCode < cost) {
    return { success: false, message: 'Pas assez de LoC' };
  }

  gameData.linesOfCode -= cost;
  gameData.items[slug] = owned + 1;
  recalculateMultipliers();
  broadcastState();

  return { success: true, message: `${item.name} acheté!` };
}

// ============================================================================
// WEBSOCKET SERVER (pour le dashboard)
// ============================================================================

const wsClients: Set<WebSocket> = new Set();

function broadcastState(): void {
  const state = JSON.stringify({
    type: 'STATE_UPDATE',
    data: gameData,
  });

  wsClients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(state);
    }
  });
}

function startWebSocketServer(): void {
  const wss = new WebSocketServer({ port: WS_PORT });

  wss.on('connection', (ws) => {
    console.log(chalk.blue('📱 Dashboard connecté'));
    wsClients.add(ws);

    // Send current state
    ws.send(JSON.stringify({ type: 'STATE_UPDATE', data: gameData }));

    // Send items list
    ws.send(JSON.stringify({ type: 'ITEMS_LIST', data: ITEMS }));

    ws.on('message', (message) => {
      try {
        const msg = JSON.parse(message.toString());

        if (msg.type === 'PURCHASE') {
          const result = purchaseItem(msg.slug);
          ws.send(JSON.stringify({ type: 'PURCHASE_RESULT', ...result }));
        }
      } catch (err) {
        // Ignore invalid messages
      }
    });

    ws.on('close', () => {
      wsClients.delete(ws);
      console.log(chalk.gray('📱 Dashboard déconnecté'));
    });
  });

  console.log(chalk.green(`🌐 WebSocket server: ws://localhost:${WS_PORT}`));
}

// ============================================================================
// TCP SERVER (pour recevoir les frappes du PowerShell)
// Robuste : gestion d'erreurs, reconnexion des clients, server restart
// ============================================================================

function startTCPServer(): void {
  const server = net.createServer((socket) => {
    console.log(chalk.green('⌨️  Keyboard hook connecté!'));

    socket.on('data', (data) => {
      const lines = data.toString().split('\n');
      lines.forEach(line => {
        if (line.startsWith('KEY:')) {
          onKeyPress();
        }
      });
    });

    socket.on('error', (err) => {
      console.log(chalk.yellow(`⌨️  Socket error: ${err.message}`));
    });

    socket.on('close', () => {
      console.log(chalk.yellow('⌨️  Keyboard hook déconnecté (reconnexion auto côté client)'));
    });
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.log(chalk.red(`❌ Port ${TCP_PORT} déjà utilisé, retry dans 3s...`));
      setTimeout(() => {
        server.close();
        server.listen(TCP_PORT, '127.0.0.1');
      }, 3000);
    } else {
      console.log(chalk.red(`❌ TCP server error: ${err.message}`));
    }
  });

  server.on('close', () => {
    console.log(chalk.yellow('🔄 TCP server fermé, redémarrage dans 3s...'));
    setTimeout(() => startTCPServer(), 3000);
  });

  server.listen(TCP_PORT, '127.0.0.1', () => {
    console.log(chalk.green(`🔌 TCP server: localhost:${TCP_PORT}`));
  });
}

// ============================================================================
// PASSIVE INCOME
// ============================================================================

function startPassiveIncome(): void {
  setInterval(() => {
    if (gameData.passiveRate > 0) {
      gameData.linesOfCode += gameData.passiveRate;
      broadcastState();
    }
  }, 1000);
}

// ============================================================================
// DISPLAY
// ============================================================================

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(2) + 'K';
  return Math.floor(num).toString();
}

function getHookInstructions(): { script: string; command: string } {
  switch (PLATFORM) {
    case 'win32':
      return {
        script: 'PowerShell',
        command: '.\\keyboard-hook.ps1',
      };
    case 'darwin':
      return {
        script: 'Script macOS',
        command: './keyboard-hook-macos.sh',
      };
    case 'linux':
    default:
      return {
        script: 'Script Linux',
        command: './keyboard-hook-linux.sh',
      };
  }
}

function startDisplay(): void {
  const instructions = getHookInstructions();

  setInterval(() => {
    console.clear();
    console.log(chalk.cyan.bold(`
╔══════════════════════════════════════════════════════════════╗
║                    🎮 TIMELESS HEROES 🎮                      ║
║                   ~ Code Your Way to Glory ~                  ║
╠══════════════════════════════════════════════════════════════╣
║                                                               ║
║  💎 Lines of Code:  ${chalk.yellow(formatNumber(gameData.linesOfCode).padEnd(15))}                     ║
║  ⚡ Multiplicateur:  ${chalk.magenta('x' + gameData.multiplier.toFixed(2).padEnd(14))}                     ║
║  ⏱️  Passif:         ${chalk.green((gameData.passiveRate.toFixed(1) + '/sec').padEnd(15))}                     ║
║  📊 Niveau:          ${chalk.white(gameData.level.toString().padEnd(15))}                     ║
║  ⌨️  Total frappes:  ${chalk.gray(formatNumber(gameData.totalKeyPresses).padEnd(15))}                     ║
║                                                               ║
╠══════════════════════════════════════════════════════════════╣
║  ${chalk.dim(`Lance le ${instructions.script} pour capturer les touches:`)}       ║
║  ${chalk.blue(instructions.command.padEnd(46))}        ║
║                                                               ║
║  ${chalk.dim('Dashboard:')} ${chalk.blue('http://localhost:3001/game')}                       ║
║  ${chalk.dim('Appuie sur Ctrl+C pour quitter')}                              ║
╚══════════════════════════════════════════════════════════════╝
`));
  }, 500);
}

// ============================================================================
// MAIN
// ============================================================================

async function main(): Promise<void> {
  console.log(chalk.cyan('🚀 Démarrage de Timeless Heroes Server...'));

  loadGameData();
  startTCPServer();
  startWebSocketServer();
  startPassiveIncome();

  // Auto-save
  setInterval(saveGameData, SAVE_INTERVAL);

  // Display
  startDisplay();

  // Save on exit
  process.on('SIGINT', () => {
    console.log(chalk.yellow('\n\n👋 Sauvegarde et fermeture...'));
    saveGameData();
    process.exit(0);
  });
}

main().catch(console.error);
