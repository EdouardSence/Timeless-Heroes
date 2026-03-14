'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { IShopItem, SHOP_ITEMS, WebSocketEvent } from '@repo/shared-types';

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

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  score: string;
  level: number;
  prestigeLevel: number;
}

// ============================================================================
// HELPERS
// ============================================================================

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
  return Math.floor(num).toString();
}

function calculateCost(
  baseCost: number,
  costMultiplier: number,
  owned: number,
): number {
  return Math.floor(baseCost * Math.pow(costMultiplier, owned));
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
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'shop' | 'leaderboard' | 'info'>(
    'shop',
  );
  const [notification, setNotification] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const showNotification = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Connect to game server via Socket.IO
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');

    const socket = io('http://localhost:3000/game', {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionAttempts: Infinity,
    });

    socket.on('connect', () => {
      setConnected(true);
      console.log('Connected to game server via Socket.IO');
    });

    socket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from game server');
    });

    socket.on('connect_error', (err: Error) => {
      setConnected(false);
      console.error('Socket.IO connection error:', err.message);
    });

    // Handle initial balance data sent on connection
    socket.on(
      WebSocketEvent.BALANCE_UPDATE,
      (data: {
        linesOfCode?: string;
        level?: number;
        clickMultiplier?: number;
        passiveMultiplier?: number;
      }) => {
        setGameState((prev) => ({
          ...prev,
          linesOfCode: parseFloat(data.linesOfCode || '0') || prev.linesOfCode,
          level: data.level ?? prev.level,
          multiplier: data.clickMultiplier ?? prev.multiplier,
          passiveRate: data.passiveMultiplier ?? prev.passiveRate,
        }));
      },
    );

    // Handle click processed acknowledgement
    socket.on(
      WebSocketEvent.CLICK_PROCESSED,
      (result: {
        newBalance?: string;
        multipliers?: { totalMultiplier?: number };
      }) => {
        setGameState((prev) => ({
          ...prev,
          linesOfCode:
            parseFloat(result.newBalance || '0') || prev.linesOfCode,
          totalKeyPresses: prev.totalKeyPresses + 1,
          multiplier: result.multipliers?.totalMultiplier ?? prev.multiplier,
        }));
      },
    );

    // Handle item purchase result
    socket.on(
      WebSocketEvent.ITEM_PURCHASED,
      (result: {
        success: boolean;
        newBalance?: string;
        itemSlug?: string;
        newQuantityOwned?: number;
        error?: string;
      }) => {
        if (result.success) {
          setGameState((prev) => ({
            ...prev,
            linesOfCode:
              parseFloat(result.newBalance || '0') || prev.linesOfCode,
            items: {
              ...prev.items,
              [result.itemSlug || '']: result.newQuantityOwned || 0,
            },
          }));
          showNotification('Achat effectue !');
        } else {
          showNotification(
            `Echec de l'achat: ${result.error || 'Erreur inconnue'}`,
          );
        }
      },
    );

    // Handle leaderboard updates
    socket.on(
      WebSocketEvent.LEADERBOARD_UPDATE,
      (data: { entries?: LeaderboardEntry[] }) => {
        if (data.entries) {
          setLeaderboard(data.entries);
        }
      },
    );

    // Handle offline rewards
    socket.on(
      WebSocketEvent.OFFLINE_REWARDS,
      (data: { earnedLoc?: string }) => {
        const earnedLoc = parseFloat(data.earnedLoc || '0') || 0;
        if (earnedLoc > 0) {
          showNotification(
            `Recompenses hors-ligne : +${formatNumber(earnedLoc)} LoC !`,
          );
          setGameState((prev) => ({
            ...prev,
            linesOfCode: prev.linesOfCode + earnedLoc,
          }));
        }
      },
    );

    // Handle shop catalog response
    socket.on(WebSocketEvent.SHOP_CATALOG, (data: unknown) => {
      // Shop catalog received from server — can be used for dynamic updates
      console.log('Shop catalog received:', data);
    });

    // Handle errors from server
    socket.on(
      WebSocketEvent.ERROR,
      (err: { code?: string; message?: string }) => {
        console.error('Server error:', err);
        if (err.code === 'AUTH_REQUIRED' || err.code === 'AUTH_FAILED') {
          showNotification('Authentification requise. Veuillez vous connecter.');
        }
      },
    );

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [showNotification]);

  // Update items list from SHOP_ITEMS (single source of truth from shared-types)
  useEffect(() => {
    const newItems: ShopItem[] = SHOP_ITEMS.map((item: IShopItem) => {
      const owned = gameState.items[item.id] || 0;
      const nextCost = calculateCost(item.baseCost, item.costMultiplier, owned);
      return {
        slug: item.id,
        name: item.name,
        baseCost: item.baseCost,
        owned,
        nextCost,
        canAfford: gameState.linesOfCode >= nextCost,
        icon: item.icon,
        effect: item.description,
      };
    });
    setItems(newItems);
  }, [gameState]);

  // Send key press to server
  const sendKeyPress = useCallback(() => {
    if (!socketRef.current?.connected) {
      showNotification('Non connecte au serveur');
      return;
    }

    socketRef.current.emit(WebSocketEvent.KEY_PRESS, {
      keyType: 'NORMAL',
      timestamp: Date.now(),
    });
  }, [showNotification]);

  // Listen for actual keyboard events and send them
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore modifier-only keys and repeats
      if (e.repeat) return;
      if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) return;
      sendKeyPress();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sendKeyPress]);

  const purchaseItem = (slug: string) => {
    if (!socketRef.current?.connected) {
      showNotification('Non connecte au serveur');
      return;
    }

    socketRef.current.emit(WebSocketEvent.PURCHASE_ITEM, {
      itemSlug: slug,
      quantity: 1,
    });
    showNotification('Achat en cours...');
  };

  const requestLeaderboard = useCallback(() => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit('GET_LEADERBOARD', { type: 'GLOBAL', count: 50 });
  }, []);

  // Fetch leaderboard when tab is selected
  useEffect(() => {
    if (activeTab === 'leaderboard') {
      requestLeaderboard();
    }
  }, [activeTab, requestLeaderboard]);

  const expProgress =
    gameState.experienceToNext > 0
      ? (gameState.experience / gameState.experienceToNext) * 100
      : 0;

  return (
    <div style={styles.container}>
      {notification && <div style={styles.notification}>{notification}</div>}

      <header style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>{'<>'}</span>
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
          {connected ? 'Connecte au serveur' : 'Recherche du serveur...'}
        </div>
      </header>

      {!connected && (
        <div style={styles.setupInstructions}>
          <h2>Comment jouer</h2>
          <p>Connecte-toi au serveur pour commencer a jouer :</p>
          <ol>
            <li>
              Assure-toi que l&apos;api-gateway tourne sur{' '}
              <code style={styles.code}>http://localhost:3000</code>
            </li>
            <li>Connecte-toi / inscris-toi pour obtenir un token JWT</li>
            <li>Tape sur ton clavier pour gagner des LoC !</li>
          </ol>
          <p style={styles.hint}>
            Les frappes clavier sur cette page sont envoyees au serveur en temps
            reel via Socket.IO.
          </p>
        </div>
      )}

      <section style={styles.statsPanel}>
        <div style={{ ...styles.statCard, ...styles.mainStat }}>
          <div style={styles.statIcon}>{'</>'}</div>
          <div>
            <div style={styles.statLabel}>Lines of Code</div>
            <div style={styles.statValue}>
              {formatNumber(gameState.linesOfCode)}
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>×</div>
          <div>
            <div style={styles.statLabel}>Multiplicateur</div>
            <div style={styles.statValue}>
              ×{gameState.multiplier.toFixed(2)}
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>&gt;_</div>
          <div>
            <div style={styles.statLabel}>Passif</div>
            <div style={styles.statValue}>
              {gameState.passiveRate.toFixed(1)}/sec
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>#</div>
          <div>
            <div style={styles.statLabel}>Frappes totales</div>
            <div style={styles.statValue}>
              {formatNumber(gameState.totalKeyPresses)}
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>^</div>
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
          Boutique
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
          Classement
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
          Info
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
                  <p style={styles.itemOwned}>Possede: {item.owned}</p>
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
                {leaderboard.length > 0 ? (
                  leaderboard.map((entry) => (
                    <tr key={entry.userId} style={styles.leaderboardRow}>
                      <td style={styles.td}>{entry.rank}</td>
                      <td style={styles.td}>{entry.username}</td>
                      <td style={styles.td}>
                        {formatNumber(parseFloat(entry.score))}
                      </td>
                      <td style={styles.td}>{entry.level}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={styles.td} colSpan={4}>
                      {connected
                        ? 'Chargement du classement...'
                        : 'Connectez-vous pour voir le classement'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'info' && (
          <div style={styles.infoPanel}>
            <h2>Comment ca marche</h2>
            <div style={styles.infoCard}>
              <h3>Gagner des LoC</h3>
              <p>
                Chaque frappe sur ton clavier te donne{' '}
                <strong>1 × multiplicateur</strong> LoC.
              </p>
              <p>
                Les frappes sont envoyees au serveur en temps reel via
                Socket.IO.
              </p>
            </div>
            <div style={styles.infoCard}>
              <h3>Boutique</h3>
              <p>Achete des items pour augmenter tes gains.</p>
              <p>Les prix augmentent a chaque achat (formule exponentielle).</p>
            </div>
            <div style={styles.infoCard}>
              <h3>Revenus passifs</h3>
              <p>
                Certains items generent des LoC automatiquement chaque seconde.
              </p>
            </div>
            <div style={styles.infoCard}>
              <h3>Recompenses hors-ligne</h3>
              <p>
                Quand tu te reconnectes, tu recois 50% de tes gains passifs (max
                8h).
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
  leaderboardRow: {
    transition: 'background 0.2s',
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
};
