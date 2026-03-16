/**
 * Menu Component - Shop, Stats, Leaderboard
 */

import { IShopItem, SHOP_ITEMS as SHOP_CATALOG } from '@repo/shared-types';
import { useEffect, useRef, useState } from 'react';
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

function calculateCost(
  baseCost: number,
  owned: number,
  costMultiplier = 1.15,
): number {
  return Math.floor(baseCost * Math.pow(costMultiplier, owned));
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
    prestigeLevel: 0,
    totalLinesWritten: 0,
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
  const [showPrestigeConfirm, setShowPrestigeConfirm] = useState(false);
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
    if (!backendOnline) return;

    fetchLeaderboard();

    // Auto-refresh every 15 seconds while on the leaderboard tab
    const interval = setInterval(fetchLeaderboard, 15000);
    return () => clearInterval(interval);
  }, [activeTab, backendOnline]);

  // Persist item ownership when items change (only after initial load).
  // NOTE: multiplier and passiveRate are controlled by the server — we only save
  // the owned-count map locally so the shop UI can display it immediately on load.
  useEffect(() => {
    // Skip if items haven't been loaded from storage yet
    if (!itemsLoadedRef.current) return;

    const itemsToSave: Record<string, number> = {};
    items.forEach((item) => {
      itemsToSave[item.id] = item.owned;
    });

    window.electronAPI?.saveItems(itemsToSave);
  }, [items]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2000);
  };

  const handlePurchase = async (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    // Client-side level check
    if (gameState.level < (item.unlockLevel ?? 1)) {
      showNotification(
        `Niveau ${item.unlockLevel} requis pour acheter ${item.name}`,
      );
      return;
    }

    const cost = calculateCost(item.baseCost, item.owned, item.costMultiplier);

    if (gameState.linesOfCode < cost) {
      showNotification('Pas assez de LoC!');
      return;
    }

    // Use backend purchase — server deducts LoC, updates multipliers, and syncs state
    const result = await window.electronAPI?.backendBuyItem(item.id);

    // The response structure is: { success, data: { success, data: { newQuantityOwned, ... }, error? } }
    const apiResponse = result?.data as Record<string, unknown> | undefined;
    const purchaseData = apiResponse?.data as
      | Record<string, unknown>
      | undefined;
    const purchaseSuccess = result?.success && apiResponse?.success !== false;

    if (purchaseSuccess) {
      const newQuantityOwned =
        typeof purchaseData?.newQuantityOwned === 'number'
          ? purchaseData.newQuantityOwned
          : item.owned + 1;

      setItems((prev) =>
        prev.map((i) =>
          i.id === itemId ? { ...i, owned: newQuantityOwned } : i,
        ),
      );

      // Refresh game state (backendBuyItem already synced from server)
      const newState = await window.electronAPI?.getGameState();
      if (newState) setGameState(newState);

      showNotification(`${item.name} acheté!`);
    } else {
      const rawError =
        (apiResponse?.error as Record<string, unknown>)?.message ||
        result?.error ||
        'Achat échoué!';

      // Translate known server errors to user-friendly messages
      let errorMsg = String(rawError);
      if (errorMsg.includes('LEVEL_TOO_LOW')) {
        errorMsg = `Niveau ${item.unlockLevel} requis pour acheter ${item.name}`;
      } else if (errorMsg.includes('INSUFFICIENT_FUNDS')) {
        errorMsg = 'Pas assez de LoC!';
      }

      showNotification(errorMsg);
    }
  };

  const handleClose = () => {
    window.electronAPI?.hideMenu();
  };

  const handleLogout = () => {
    window.electronAPI?.logoutSession();
  };

  const handlePrestige = async () => {
    setShowPrestigeConfirm(false);
    const result = await window.electronAPI?.backendPrestige();
    if (result?.success) {
      // Reset local item display (server already deleted all items)
      setItems((prev) => prev.map((item) => ({ ...item, owned: 0 })));
      // Refresh game state
      const newState = await window.electronAPI?.getGameState();
      if (newState) setGameState(newState);
      showNotification('Prestige accompli! Multiplicateur augmente!');
    } else {
      showNotification(result?.error ?? 'Prestige echoue!');
    }
  };

  const prestigeMultiplier = 1 + gameState.prestigeLevel * 2;
  const nextPrestigeMultiplier = 1 + (gameState.prestigeLevel + 1) * 2;

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
              const cost = calculateCost(
                item.baseCost,
                item.owned,
                item.costMultiplier,
              );
              const canAfford = gameState.linesOfCode >= cost;
              const levelLocked = gameState.level < (item.unlockLevel ?? 1);
              const canBuy = canAfford && !levelLocked;

              return (
                <div
                  key={item.id}
                  className={`shop-item ${levelLocked ? 'level-locked' : canAfford ? 'affordable' : 'locked'}`}
                >
                  <div className="item-icon">{item.icon}</div>
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p className="item-desc">{item.description}</p>
                    {levelLocked ? (
                      <p className="item-level-req">
                        Niveau {item.unlockLevel} requis
                      </p>
                    ) : (
                      <p className="item-owned">Possédé: {item.owned}</p>
                    )}
                  </div>
                  <button
                    className={`buy-button ${canBuy ? '' : 'disabled'}`}
                    disabled={!canBuy}
                    onClick={() => handlePurchase(item.id)}
                  >
                    {levelLocked
                      ? `Niv.${item.unlockLevel}`
                      : `${formatNumber(cost)} LoC`}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="stats-panel">
            {gameState.prestigeLevel > 0 && (
              <div className="stat-card prestige-card">
                <h3>👑 Prestige {gameState.prestigeLevel}</h3>
                <div className="stat-row">
                  <span>Multiplicateur prestige</span>
                  <span>x{prestigeMultiplier}</span>
                </div>
                <div className="stat-row">
                  <span>LoC total (historique)</span>
                  <span>{formatNumber(gameState.totalLinesWritten)}</span>
                </div>
              </div>
            )}
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

            {gameState.level >= 5 && (
              <div className="prestige-section">
                {showPrestigeConfirm ? (
                  <div className="prestige-confirm">
                    <p className="prestige-confirm-text">
                      Ton niveau, LoC, XP et items seront reinitialises.
                      <br />
                      Multiplicateur: x{prestigeMultiplier} → x
                      {nextPrestigeMultiplier}
                    </p>
                    <div className="prestige-confirm-actions">
                      <button
                        className="prestige-confirm-btn prestige-confirm-btn--yes"
                        onClick={handlePrestige}
                      >
                        Confirmer
                      </button>
                      <button
                        className="prestige-confirm-btn prestige-confirm-btn--no"
                        onClick={() => setShowPrestigeConfirm(false)}
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="prestige-button"
                    onClick={() => setShowPrestigeConfirm(true)}
                  >
                    ⭐ Prestige (x{nextPrestigeMultiplier})
                  </button>
                )}
              </div>
            )}
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
                    {entry.prestigeLevel > 0 && (
                      <span
                        className="rank-prestige"
                        title={`Prestige ${entry.prestigeLevel}`}
                      >
                        👑{entry.prestigeLevel}{' '}
                      </span>
                    )}
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
