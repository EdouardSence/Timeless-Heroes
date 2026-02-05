'use client';

import { useEffect, useRef, useState } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface GameState {
  linesOfCode: number;
  totalKeyPresses: number;
  level: number;
  experience: number;
  experienceToNext: number;
  multiplier: number;
  passiveRate: number;
  items: { [key: string]: number };
}

interface ShopItem {
  slug: string;
  name: string;
  baseCost: number;
  owned: number;
  nextCost: number;
  canAfford: boolean;
  icon: string;
  effect: string;
}

// ============================================================================
// ITEMS DATA
// ============================================================================

const ITEMS_CONFIG: { [key: string]: { name: string; baseCost: number; icon: string; effect: string } } = {
  'mechanical-keyboard': { name: 'Clavier Mécanique', baseCost: 100, icon: '⌨️', effect: '+1 LoC/frappe' },
  'monitor-4k': { name: 'Écran 4K', baseCost: 500, icon: '🖥️', effect: '+2 LoC/frappe' },
  'coffee-machine': { name: 'Machine à Café', baseCost: 2500, icon: '☕', effect: '+10% mult' },
  'junior-dev': { name: 'Dev Junior', baseCost: 1000, icon: '👨‍💻', effect: '+0.5 LoC/sec' },
  'senior-dev': { name: 'Dev Senior', baseCost: 10000, icon: '👩‍💻', effect: '+5 LoC/sec' },
  'cloud-server': { name: 'Serveur Cloud', baseCost: 50000, icon: '☁️', effect: '+50 LoC/sec' },
};

// ============================================================================
// HELPERS
// ============================================================================

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(2) + 'K';
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
    linesOfCode: 0,
    totalKeyPresses: 0,
    level: 1,
    experience: 0,
    experienceToNext: 100,
    multiplier: 1.0,
    passiveRate: 0,
    items: {},
  });

  const [items, setItems] = useState<ShopItem[]>([]);
  const [activeTab, setActiveTab] = useState<'shop' | 'leaderboard' | 'info'>('shop');
  const [notification, setNotification] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Connect to game server
  useEffect(() => {
    const connect = () => {
      try {
        const ws = new WebSocket('ws://localhost:9998');
        
        ws.onopen = () => {
          setConnected(true);
          console.log('Connected to game server');
        };

        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            
            if (msg.type === 'STATE_UPDATE') {
              setGameState(msg.data);
            }
          } catch (e) {
            console.error('Parse error:', e);
          }
        };

        ws.onclose = () => {
          setConnected(false);
          console.log('Disconnected from game server');
          // Reconnect after 2 seconds
          setTimeout(connect, 2000);
        };

        ws.onerror = () => {
          ws.close();
        };

        wsRef.current = ws;
      } catch (e) {
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
    const newItems: ShopItem[] = Object.entries(ITEMS_CONFIG).map(([slug, config]) => {
      const owned = gameState.items[slug] || 0;
      const nextCost = calculateCost(config.baseCost, owned);
      return {
        slug,
        name: config.name,
        baseCost: config.baseCost,
        owned,
        nextCost,
        canAfford: gameState.linesOfCode >= nextCost,
        icon: config.icon,
        effect: config.effect,
      };
    });
    setItems(newItems);
  }, [gameState]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const purchaseItem = (slug: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      showNotification('❌ Non connecté au serveur');
      return;
    }

    wsRef.current.send(JSON.stringify({ type: 'PURCHASE', slug }));
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
          <span style={{
            ...styles.statusDot,
            background: connected ? '#4ade80' : '#f87171',
            boxShadow: connected ? '0 0 10px #4ade80' : 'none',
          }}></span>
          {connected ? 'Connecté au serveur' : 'Recherche du serveur...'}
        </div>
      </header>

      {!connected && (
        <div style={styles.setupInstructions}>
          <h2>🚀 Comment jouer</h2>
          <p>Pour gagner des LoC à chaque frappe clavier, lance le serveur :</p>
          <ol>
            <li>Ouvre un terminal dans <code>apps/keylogger</code></li>
            <li>Lance: <code style={styles.code}>pnpm dev</code></li>
            <li>Dans un autre terminal, lance: <code style={styles.code}>powershell -ExecutionPolicy Bypass -File .\keyboard-hook.ps1</code></li>
          </ol>
          <p style={styles.hint}>Le serveur capture TOUTES tes frappes clavier, peu importe l'application!</p>
        </div>
      )}

      <section style={styles.statsPanel}>
        <div style={{...styles.statCard, ...styles.mainStat}}>
          <div style={styles.statIcon}>💎</div>
          <div>
            <div style={styles.statLabel}>Lines of Code</div>
            <div style={styles.statValue}>{formatNumber(gameState.linesOfCode)}</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>⚡</div>
          <div>
            <div style={styles.statLabel}>Multiplicateur</div>
            <div style={styles.statValue}>x{gameState.multiplier.toFixed(2)}</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>⏱️</div>
          <div>
            <div style={styles.statLabel}>Passif</div>
            <div style={styles.statValue}>{gameState.passiveRate.toFixed(1)}/sec</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>⌨️</div>
          <div>
            <div style={styles.statLabel}>Frappes totales</div>
            <div style={styles.statValue}>{formatNumber(gameState.totalKeyPresses)}</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>📊</div>
          <div style={{width: '100%'}}>
            <div style={styles.statLabel}>Niveau {gameState.level}</div>
            <div style={styles.expBar}>
              <div style={{...styles.expFill, width: `${expProgress}%`}}></div>
            </div>
          </div>
        </div>
      </section>

      <nav style={styles.tabs}>
        <button 
          style={{...styles.tab, ...(activeTab === 'shop' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('shop')}
        >
          🛒 Boutique
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'leaderboard' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('leaderboard')}
        >
          🏆 Classement
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'info' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('info')}
        >
          ℹ️ Info
        </button>
      </nav>

      <main style={styles.tabContent}>
        {activeTab === 'shop' && (
          <div style={styles.shopGrid}>
            {items.map(item => (
              <div 
                key={item.slug} 
                style={{
                  ...styles.shopItem,
                  ...(item.canAfford ? styles.affordable : styles.locked)
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
                    ...(item.canAfford ? {} : styles.buyButtonDisabled)
                  }}
                  disabled={!item.canAfford || !connected}
                  onClick={() => purchaseItem(item.slug)}
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
                  <td style={styles.td}>{formatNumber(gameState.linesOfCode)}</td>
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
              <p>Chaque frappe sur ton clavier te donne <strong>1 × multiplicateur</strong> LoC.</p>
              <p>Le programme capture TOUTES tes frappes, peu importe l'application!</p>
            </div>
            <div style={styles.infoCard}>
              <h3>🛒 Boutique</h3>
              <p>Achète des items pour augmenter tes gains.</p>
              <p>Les prix augmentent de 15% à chaque achat (formule: Prix = Base × 1.15^n)</p>
            </div>
            <div style={styles.infoCard}>
              <h3>⏱️ Revenus passifs</h3>
              <p>Certains items génèrent des LoC automatiquement chaque seconde.</p>
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

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0c29 0%, #1a1a2e 50%, #16213e 100%)',
    color: '#fff',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    padding: '20px',
  },
  notification: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '15px 25px',
    borderRadius: '10px',
    fontWeight: 'bold',
    zIndex: 1000,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '15px',
    marginBottom: '20px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  logoIcon: {
    fontSize: '2.5rem',
  },
  logoText: {
    fontSize: '1.8rem',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
  },
  connectionStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    color: '#aaa',
  },
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  setupInstructions: {
    background: 'rgba(102, 126, 234, 0.1)',
    border: '1px solid rgba(102, 126, 234, 0.3)',
    borderRadius: '15px',
    padding: '25px',
    marginBottom: '20px',
  },
  code: {
    background: 'rgba(0, 0, 0, 0.3)',
    padding: '3px 8px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    color: '#4ade80',
  },
  statsPanel: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '15px',
    marginBottom: '20px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '15px',
  },
  mainStat: {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)',
    border: '1px solid rgba(102, 126, 234, 0.5)',
  },
  statIcon: {
    fontSize: '2rem',
  },
  statLabel: {
    fontSize: '0.85rem',
    color: '#aaa',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  expBar: {
    width: '100%',
    height: '8px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '5px',
  },
  expFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea, #764ba2)',
    transition: 'width 0.3s',
  },
  hint: {
    color: '#aaa',
    fontSize: '0.9rem',
    margin: '15px 0',
    textAlign: 'center',
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  tab: {
    flex: 1,
    padding: '15px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: 'none',
    borderRadius: '10px',
    color: '#aaa',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  tabActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
  },
  tabContent: {
    minHeight: '400px',
  },
  shopGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  shopItem: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '15px',
  },
  affordable: {
    border: '1px solid rgba(74, 222, 128, 0.5)',
  },
  locked: {
    opacity: 0.7,
  },
  itemIcon: {
    fontSize: '2.5rem',
    marginBottom: '10px',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    margin: '0 0 5px 0',
    fontSize: '1.1rem',
  },
  itemEffect: {
    color: '#4ade80',
    fontWeight: 'bold',
    margin: '5px 0',
  },
  itemOwned: {
    color: '#667eea',
    fontSize: '0.85rem',
    margin: '5px 0',
  },
  buyButton: {
    marginTop: '10px',
    padding: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  buyButtonDisabled: {
    background: '#444',
    cursor: 'not-allowed',
  },
  leaderboardPanel: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '15px',
    padding: '20px',
  },
  leaderboardTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '15px',
    textAlign: 'left',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#aaa',
    fontWeight: 'normal',
  },
  td: {
    padding: '15px',
    textAlign: 'left',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  youRow: {
    background: 'rgba(102, 126, 234, 0.2)',
  },
  infoPanel: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '15px',
    padding: '25px',
  },
  infoCard: {
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '15px',
  },
};
