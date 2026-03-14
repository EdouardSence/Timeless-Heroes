'use client';

import { useEffect, useRef, useState } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface GameState {
  experience: number;
  experienceToNext: number;
  items: Record<string, number>;
  level: number;
  linesOfCode: number;
  multiplier: number;
  passiveRate: number;
  totalKeyPresses: number;
}

interface WorkerMessage {
  data: GameState;
  type: string;
}

interface ShopItem {
  baseCost: number;
  canAfford: boolean;
  effect: string;
  icon: string;
  name: string;
  nextCost: number;
  owned: number;
  slug: string;
}

// ============================================================================
// ITEMS DATA
// ============================================================================

const ITEMS_CONFIG: Record<
  string,
  { name: string; baseCost: number; icon: string; effect: string }
> = {
  'cloud-server': {
    baseCost: 50_000,
    effect: '+50 LoC/sec',
    icon: '☁️',
    name: 'Serveur Cloud',
  },
  'coffee-machine': {
    baseCost: 2500,
    effect: '+10% mult',
    icon: '☕',
    name: 'Machine à Café',
  },
  'junior-dev': {
    baseCost: 1000,
    effect: '+0.5 LoC/sec',
    icon: '👨‍💻',
    name: 'Dev Junior',
  },
  'mechanical-keyboard': {
    baseCost: 100,
    effect: '+1 LoC/frappe',
    icon: '⌨️',
    name: 'Clavier Mécanique',
  },
  'monitor-4k': {
    baseCost: 500,
    effect: '+2 LoC/frappe',
    icon: '🖥️',
    name: 'Écran 4K',
  },
  'senior-dev': {
    baseCost: 10_000,
    effect: '+5 LoC/sec',
    icon: '👩‍💻',
    name: 'Dev Senior',
  },
};

// ============================================================================
// HELPERS
// ============================================================================

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
  return Math.floor(num).toString();
}

function calculateCost(baseCost: number, owned: number): number {
  return Math.floor(baseCost * Math.pow(1.15, owned));
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState>({
    experience: 0,
    experienceToNext: 100,
    items: {},
    level: 1,
    linesOfCode: 0,
    multiplier: 1,
    passiveRate: 0,
    totalKeyPresses: 0,
  });

  const [items, setItems] = useState<ShopItem[]>([]);
  const [activeTab, setActiveTab] = useState<'shop' | 'leaderboard' | 'info'>(
    'shop',
  );
  const [notification, setNotification] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Connect to game server
  useEffect(() => {
    const connect = () => {
      try {
        const ws = new WebSocket('ws://localhost:9998');

        ws.addEventListener('open', () => {
          setConnected(true);
          console.log('Connected to game server');
        });

        ws.addEventListener('message', (event: MessageEvent) => {
          try {
            const msg = JSON.parse(event.data as string) as WorkerMessage;

            if (msg.type === 'STATE_UPDATE') {
              setGameState(msg.data);
            }
          } catch (error) {
            console.error('Parse error:', error);
          }
        });

        ws.addEventListener('close', () => {
          setConnected(false);
          console.log('Disconnected from game server');
          // Reconnect after 2 seconds
          setTimeout(connect, 2000);
        });

        ws.addEventListener('error', () => {
          ws.close();
        });

        wsRef.current = ws;
      } catch {
        setTimeout(connect, 2000);
      }
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Update items list
  useEffect(() => {
    const newItems: ShopItem[] = Object.entries(ITEMS_CONFIG).map(
      ([slug, config]) => {
        const owned = gameState.items[slug] ?? 0;
        const nextCost = calculateCost(config.baseCost, owned);
        return {
          baseCost: config.baseCost,
          canAfford: gameState.linesOfCode >= nextCost,
          effect: config.effect,
          icon: config.icon,
          name: config.name,
          nextCost,
          owned,
          slug,
        };
      },
    );
    setItems(newItems);
  }, [gameState]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const purchaseItem = (slug: string) => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) {
      showNotification('❌ Non connecté au serveur');
      return;
    }

    wsRef.current.send(JSON.stringify({ slug, type: 'PURCHASE' }));
    showNotification(`✅ Achat en cours...`);
  };

  const expProgress = (gameState.experience / gameState.experienceToNext) * 100;

  return (
    <div style={styles.container}>
      {notification && <div style={styles.notification}>{notification}</div>}

      <header style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>💎</span>
          <h1 style={styles.logoText}>Timeless Heroes</h1>
        </div>
        <div style={styles.connectionStatus}>
          <span
            style={{
              ...styles.statusDot,
              background: connected ? '#4ade80' : '#f87171',
              boxShadow: connected ? '0 0 10px #4ade80' : 'none',
            }}
          ></span>
          {connected ? 'Connecté au serveur' : 'Recherche du serveur...'}
        </div>
      </header>

      {!connected && (
        <div style={styles.setupInstructions}>
          <h2>🚀 Comment jouer</h2>
          <p>Pour gagner des LoC à chaque frappe clavier, lance le serveur :</p>
          <ol>
            <li>
              Ouvre un terminal dans <code>apps/keylogger</code>
            </li>
            <li>
              Lance: <code style={styles.code}>pnpm dev</code>
            </li>
            <li>
              Dans un autre terminal, lance:{' '}
              <code style={styles.code}>
                powershell -ExecutionPolicy Bypass -File .\keyboard-hook.ps1
              </code>
            </li>
          </ol>
          <p style={styles.hint}>
            Le serveur capture TOUTES tes frappes clavier, peu importe
            l&apos;application!
          </p>
        </div>
      )}

      <section style={styles.statsPanel}>
        <div style={{ ...styles.statCard, ...styles.mainStat }}>
          <div style={styles.statIcon}>💎</div>
          <div>
            <div style={styles.statLabel}>Lines of Code</div>
            <div style={styles.statValue}>
              {formatNumber(gameState.linesOfCode)}
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>⚡</div>
          <div>
            <div style={styles.statLabel}>Multiplicateur</div>
            <div style={styles.statValue}>
              x{gameState.multiplier.toFixed(2)}
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>⏱️</div>
          <div>
            <div style={styles.statLabel}>Passif</div>
            <div style={styles.statValue}>
              {gameState.passiveRate.toFixed(1)}/sec
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>⌨️</div>
          <div>
            <div style={styles.statLabel}>Frappes totales</div>
            <div style={styles.statValue}>
              {formatNumber(gameState.totalKeyPresses)}
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>📊</div>
          <div style={{ width: '100%' }}>
            <div style={styles.statLabel}>Niveau {gameState.level}</div>
            <div style={styles.expBar}>
              <div
                style={{ ...styles.expFill, width: `${expProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      <nav style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'shop' ? styles.tabActive : {}),
          }}
          onClick={() => {
            setActiveTab('shop');
          }}
        >
          🛒 Boutique
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'leaderboard' ? styles.tabActive : {}),
          }}
          onClick={() => {
            setActiveTab('leaderboard');
          }}
        >
          🏆 Classement
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'info' ? styles.tabActive : {}),
          }}
          onClick={() => {
            setActiveTab('info');
          }}
        >
          ℹ️ Info
        </button>
      </nav>

      <main style={styles.tabContent}>
        {activeTab === 'shop' && (
          <div style={styles.shopGrid}>
            {items.map((item) => (
              <div
                key={item.slug}
                style={{
                  ...styles.shopItem,
                  ...(item.canAfford ? styles.affordable : styles.locked),
                }}
              >
                <div style={styles.itemIcon}>{item.icon}</div>
                <div style={styles.itemInfo}>
                  <h3 style={styles.itemName}>{item.name}</h3>
                  <p style={styles.itemEffect}>{item.effect}</p>
                  <p style={styles.itemOwned}>Possédé: {item.owned}</p>
                </div>
                <button
                  style={{
                    ...styles.buyButton,
                    ...(item.canAfford ? {} : styles.buyButtonDisabled),
                  }}
                  disabled={!item.canAfford || !connected}
                  onClick={() => {
                    purchaseItem(item.slug);
                  }}
                >
                  {formatNumber(item.nextCost)} LoC
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div style={styles.leaderboardPanel}>
            <table style={styles.leaderboardTable}>
              <thead>
                <tr>
                  <th style={styles.th}>Rang</th>
                  <th style={styles.th}>Joueur</th>
                  <th style={styles.th}>LoC Total</th>
                  <th style={styles.th}>Niveau</th>
                </tr>
              </thead>
              <tbody>
                <tr style={styles.youRow}>
                  <td style={styles.td}>1</td>
                  <td style={styles.td}>Toi 👑</td>
                  <td style={styles.td}>
                    {formatNumber(gameState.linesOfCode)}
                  </td>
                  <td style={styles.td}>{gameState.level}</td>
                </tr>
              </tbody>
            </table>
            <p style={styles.hint}>Le classement multijoueur arrive bientôt!</p>
          </div>
        )}

        {activeTab === 'info' && (
          <div style={styles.infoPanel}>
            <h2>📖 Comment ça marche</h2>
            <div style={styles.infoCard}>
              <h3>⌨️ Gagner des LoC</h3>
              <p>
                Chaque frappe sur ton clavier te donne{' '}
                <strong>1 × multiplicateur</strong> LoC.
              </p>
              <p>
                Le programme capture TOUTES tes frappes, peu importe
                l&apos;application!
              </p>
            </div>
            <div style={styles.infoCard}>
              <h3>🛒 Boutique</h3>
              <p>Achète des items pour augmenter tes gains.</p>
              <p>
                Les prix augmentent de 15% à chaque achat (formule: Prix = Base
                × 1.15^n)
              </p>
            </div>
            <div style={styles.infoCard}>
              <h3>⏱️ Revenus passifs</h3>
              <p>
                Certains items génèrent des LoC automatiquement chaque seconde.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles: Record<string, React.CSSProperties> = {
  affordable: {
    border: '1px solid rgba(74, 222, 128, 0.5)',
  },
  buyButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '10px',
    padding: '12px',
  },
  buyButtonDisabled: {
    background: '#444',
    cursor: 'not-allowed',
  },
  code: {
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '4px',
    color: '#4ade80',
    fontFamily: 'monospace',
    padding: '3px 8px',
  },
  connectionStatus: {
    alignItems: 'center',
    color: '#aaa',
    display: 'flex',
    fontSize: '0.9rem',
    gap: '8px',
  },
  container: {
    background:
      'linear-gradient(135deg, #0f0c29 0%, #1a1a2e 50%, #16213e 100%)',
    color: '#fff',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    minHeight: '100vh',
    padding: '20px',
  },
  expBar: {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    height: '8px',
    marginTop: '5px',
    overflow: 'hidden',
    width: '100%',
  },
  expFill: {
    background: 'linear-gradient(90deg, #667eea, #764ba2)',
    height: '100%',
    transition: 'width 0.3s',
  },
  header: {
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
    padding: '20px',
  },
  hint: {
    color: '#aaa',
    fontSize: '0.9rem',
    margin: '15px 0',
    textAlign: 'center',
  },
  infoCard: {
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '10px',
    marginBottom: '15px',
    padding: '20px',
  },
  infoPanel: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '15px',
    padding: '25px',
  },
  itemEffect: {
    color: '#4ade80',
    fontWeight: 'bold',
    margin: '5px 0',
  },
  itemIcon: {
    fontSize: '2.5rem',
    marginBottom: '10px',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: '1.1rem',
    margin: '0 0 5px 0',
  },
  itemOwned: {
    color: '#667eea',
    fontSize: '0.85rem',
    margin: '5px 0',
  },
  leaderboardPanel: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '15px',
    padding: '20px',
  },
  leaderboardTable: {
    borderCollapse: 'collapse',
    width: '100%',
  },
  locked: {
    opacity: 0.7,
  },
  logo: {
    alignItems: 'center',
    display: 'flex',
    gap: '15px',
  },
  logoIcon: {
    fontSize: '2.5rem',
  },
  logoText: {
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    fontSize: '1.8rem',
    margin: 0,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  mainStat: {
    background:
      'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)',
    border: '1px solid rgba(102, 126, 234, 0.5)',
  },
  notification: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '10px',
    fontWeight: 'bold',
    padding: '15px 25px',
    position: 'fixed',
    right: '20px',
    top: '20px',
    zIndex: 1000,
  },
  setupInstructions: {
    background: 'rgba(102, 126, 234, 0.1)',
    border: '1px solid rgba(102, 126, 234, 0.3)',
    borderRadius: '15px',
    marginBottom: '20px',
    padding: '25px',
  },
  shopGrid: {
    display: 'grid',
    gap: '20px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  },
  shopItem: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '15px',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
  },
  statCard: {
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '15px',
    display: 'flex',
    gap: '15px',
    padding: '20px',
  },
  statIcon: {
    fontSize: '2rem',
  },
  statLabel: {
    color: '#aaa',
    fontSize: '0.85rem',
  },
  statsPanel: {
    display: 'grid',
    gap: '15px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    marginBottom: '20px',
  },
  statusDot: {
    borderRadius: '50%',
    height: '10px',
    width: '10px',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  tab: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: 'none',
    borderRadius: '10px',
    color: '#aaa',
    cursor: 'pointer',
    flex: 1,
    fontSize: '1rem',
    padding: '15px',
  },
  tabActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
  },
  tabContent: {
    minHeight: '400px',
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  td: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '15px',
    textAlign: 'left',
  },
  th: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#aaa',
    fontWeight: 'normal',
    padding: '15px',
    textAlign: 'left',
  },
  youRow: {
    background: 'rgba(102, 126, 234, 0.2)',
  },
};
