/**
 * Menu Component - Shop, Stats, Leaderboard
 */

import { useEffect, useRef, useState } from 'react';
import { SHOP_ITEMS as SHOP_CATALOG, IShopItem } from '@repo/shared-types';
import type { GameState, LeaderboardEntry } from '../types/electron';
import './Menu.css';

interface ShopItemWithOwned extends IShopItem {
  owned: number;
}

// Initialize shop items from shared catalog
const SHOP_ITEMS: ShopItemWithOwned[] = SHOP_CATALOG.map((item) => ({
  ...item,
  owned: 0,
}));

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(2) + 'K';
  return Math.floor(num).toString();
}

function calculateCost(baseCost: number, owned: number): number {
  return Math.floor(baseCost * Math.pow(1.15, owned));
}

export default function Menu() {
  const [gameState, setGameState] = useState<GameState>({
    linesOfCode: 0,
    totalKeyPresses: 0,
    level: 1,
    experience: 0,
    experienceToNext: 100,
    multiplier: 1.0,
    passiveRate: 0.0,
  });

  const [items, setItems] = useState<ShopItemWithOwned[]>(SHOP_ITEMS);
  const [activeTab, setActiveTab] = useState<'shop' | 'stats' | 'leaderboard'>(
    'shop',
  );
  const [notification, setNotification] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const itemsLoadedRef = useRef(false);

  useEffect(() => {
    // Load initial state
    window.electronAPI?.getGameState().then(setGameState);

    // Load saved items
    window.electronAPI?.getItems().then((savedItems) => {
      if (savedItems && Object.keys(savedItems).length > 0) {
        setItems((prev) =>
          prev.map((item) => ({
            ...item,
            owned: savedItems[item.id] || 0,
          })),
        );
      }
      // Mark as loaded AFTER setting items
      itemsLoadedRef.current = true;
    });

    // Check backend status on mount
    window.electronAPI?.backendStatus().then((status) => {
      setBackendOnline(status?.online ?? false);
      setUsername(status?.username ?? null);
    });

    // Listen for updates
    const disposeState = window.electronAPI?.onGameStateUpdate(setGameState);
    const disposeBackend = window.electronAPI?.onBackendStatus((status) => {
      setBackendOnline(status?.online ?? false);
      setUsername(status?.username ?? null);
    });

    return () => {
      if (disposeState) disposeState();
      if (disposeBackend) disposeBackend();
      if (!disposeState && !disposeBackend) {
        window.electronAPI?.removeAllListeners();
      }
    };
  }, []);

  // Fetch leaderboard — always attempt, even if backendOnline state is stale.
  // The IPC handler will return an error gracefully if not authenticated.
  const fetchLeaderboard = () => {
    setLeaderboardLoading(true);
    window.electronAPI
      ?.backendLeaderboard('GLOBAL')
      .then((res) => {
        if (res?.success && res.data?.entries) {
          setLeaderboard(res.data.entries);
        }
      })
      .catch(() => {
        // Silently fail — leaderboard stays at last-known state
      })
      .finally(() => {
        setLeaderboardLoading(false);
      });
  };

  useEffect(() => {
    if (activeTab !== 'leaderboard') return;

    fetchLeaderboard();

    // Auto-refresh every 15 seconds while on the leaderboard tab
    const interval = setInterval(fetchLeaderboard, 15000);
    return () => clearInterval(interval);
  }, [activeTab]);

  // Update multiplier and passive when items change (only after initial load)
  useEffect(() => {
    // Skip if items haven't been loaded from storage yet
    if (!itemsLoadedRef.current) return;

    let newMultiplier = 1.0;
    let newPassive = 0.0; // This is now "keys per second" which generates LoC
    let clickBonus = 0;
    const itemsToSave: Record<string, number> = {};

    items.forEach((item) => {
      itemsToSave[item.id] = item.owned;

      if (item.effect.type === 'multiplier') {
        newMultiplier += item.effect.value * item.owned;
      } else if (item.effect.type === 'passive') {
        // Passive is now "keys per second" - the actual LoC rate = passive * multiplier
        newPassive += item.effect.value * item.owned;
      } else if (item.effect.type === 'click') {
        clickBonus += item.effect.value * item.owned;
      }
    });

    newMultiplier = (1 + clickBonus) * newMultiplier;

    window.electronAPI?.updateMultiplier(newMultiplier);
    window.electronAPI?.updatePassiveRate(newPassive);
    window.electronAPI?.saveItems(itemsToSave);
  }, [items]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2000);
  };

  const handlePurchase = async (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    const cost = calculateCost(item.baseCost, item.owned);

    if (gameState.linesOfCode < cost) {
      showNotification('❌ Pas assez de LoC!');
      return;
    }

    const success = await window.electronAPI?.subtractLoC(cost);

    if (success) {
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, owned: i.owned + 1 } : i)),
      );

      const newState = await window.electronAPI?.getGameState();
      if (newState) setGameState(newState);

      showNotification(`✅ ${item.name} acheté!`);
    }
  };

  const handleClose = () => {
    window.electronAPI?.hideMenu();
  };

  const handleLogout = () => {
    window.electronAPI?.logoutSession();
  };

  const expProgress =
    gameState.experienceToNext > 0
      ? (gameState.experience / gameState.experienceToNext) * 100
      : 0;

  return (
    <div
      className="menu-container"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {notification && <div className="notification">{notification}</div>}

      <header className="menu-header">
        <div className="logo">
          <span className="logo-icon">💎</span>
          <h1>Timeless Heroes</h1>
        </div>
        <div className="menu-header-actions">
          {username && <span className="menu-username">@{username}</span>}
          <button
            className="logout-button"
            onClick={handleLogout}
            title="Se déconnecter"
            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
          >
            ⏻
          </button>
          <button
            className="close-button"
            onClick={handleClose}
            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
          >
            ✕
          </button>
        </div>
      </header>

      <div
        className="stats-bar"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <div className="stat-item main">
          <span className="stat-icon">💎</span>
          <span className="stat-value">
            {formatNumber(gameState.linesOfCode)}
          </span>
          <span className="stat-label">LoC</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">⚡</span>
          <span className="stat-value">x{gameState.multiplier.toFixed(2)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">⏱️</span>
          <span className="stat-value">
            {gameState.passiveRate.toFixed(1)}/s
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">📊</span>
          <span className="stat-value">Lv.{gameState.level}</span>
        </div>
      </div>

      <div className="exp-bar">
        <div className="exp-fill" style={{ width: `${expProgress}%` }}></div>
      </div>

      <nav
        className="tabs"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <button
          className={`tab ${activeTab === 'shop' ? 'active' : ''}`}
          onClick={() => setActiveTab('shop')}
        >
          🛒 Boutique
        </button>
        <button
          className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📈 Stats
        </button>
        <button
          className={`tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          🏆 Classement
        </button>
      </nav>

      <main
        className="tab-content"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        {activeTab === 'shop' && (
          <div className="shop-grid">
            {items.map((item) => {
              const cost = calculateCost(item.baseCost, item.owned);
              const canAfford = gameState.linesOfCode >= cost;

              return (
                <div
                  key={item.id}
                  className={`shop-item ${canAfford ? 'affordable' : 'locked'}`}
                >
                  <div className="item-icon">{item.icon}</div>
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p className="item-desc">{item.description}</p>
                    <p className="item-owned">Possédé: {item.owned}</p>
                  </div>
                  <button
                    className={`buy-button ${canAfford ? '' : 'disabled'}`}
                    disabled={!canAfford}
                    onClick={() => handlePurchase(item.id)}
                  >
                    {formatNumber(cost)} LoC
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="stats-panel">
            <div className="stat-card">
              <h3>📊 Statistiques</h3>
              <div className="stat-row">
                <span>Total de frappes</span>
                <span>{formatNumber(gameState.totalKeyPresses)}</span>
              </div>
              <div className="stat-row">
                <span>LoC actuel</span>
                <span>{formatNumber(gameState.linesOfCode)}</span>
              </div>
              <div className="stat-row">
                <span>Niveau</span>
                <span>{gameState.level}</span>
              </div>
              <div className="stat-row">
                <span>Multiplicateur</span>
                <span>x{gameState.multiplier.toFixed(2)}</span>
              </div>
              <div className="stat-row">
                <span>Revenu passif</span>
                <span>{gameState.passiveRate.toFixed(1)} LoC/sec</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="leaderboard-panel">
            <div className="leaderboard-card">
              <div className="leaderboard-header">
                <h3>🏆 Classement</h3>
                {backendOnline && (
                  <button
                    className="refresh-button"
                    onClick={fetchLeaderboard}
                    disabled={leaderboardLoading}
                    title="Actualiser"
                  >
                    {leaderboardLoading ? '⏳' : '🔄'}
                  </button>
                )}
              </div>
              {!backendOnline ? (
                <>
                  <p className="coming-soon">
                    Connecte-toi au backend pour voir le classement.
                  </p>
                  <p className="hint">
                    Utilise le menu de connexion pour te connecter au serveur.
                  </p>
                </>
              ) : leaderboardLoading && leaderboard.length === 0 ? (
                <p className="coming-soon">Chargement du classement...</p>
              ) : leaderboard.length === 0 ? (
                <p className="coming-soon">Aucun joueur dans le classement.</p>
              ) : (
                leaderboard.map((entry) => (
                  <div key={entry.userId} className="your-rank">
                    <span className="rank-number">#{entry.rank}</span>
                    <span className="rank-name">{entry.username}</span>
                    <span className="rank-score">
                      {formatNumber(entry.score)} LoC
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
