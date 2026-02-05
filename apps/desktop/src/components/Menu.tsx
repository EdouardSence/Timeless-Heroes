/**
 * Menu Component - Shop, Stats, Leaderboard
 */

import { useEffect, useRef, useState } from 'react';
import type { GameState } from '../types/electron';
import './Menu.css';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  baseCost: number;
  owned: number;
  effect: { type: 'multiplier' | 'passive' | 'click'; value: number };
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'mechanical-keyboard',
    name: 'Clavier Mécanique',
    description: '+1 LoC par frappe',
    icon: '⌨️',
    baseCost: 100,
    owned: 0,
    effect: { type: 'click', value: 1 },
  },
  {
    id: 'monitor-4k',
    name: 'Écran 4K',
    description: '+2 LoC par frappe',
    icon: '🖥️',
    baseCost: 500,
    owned: 0,
    effect: { type: 'click', value: 2 },
  },
  {
    id: 'coffee-machine',
    name: 'Machine à Café',
    description: '+10% multiplicateur',
    icon: '☕',
    baseCost: 2500,
    owned: 0,
    effect: { type: 'multiplier', value: 0.1 },
  },
  {
    id: 'junior-dev',
    name: 'Dev Junior',
    description: '+0.5 keys/sec auto',
    icon: '👨‍💻',
    baseCost: 1000,
    owned: 0,
    effect: { type: 'passive', value: 0.5 },
  },
  {
    id: 'senior-dev',
    name: 'Dev Senior',
    description: '+5 keys/sec auto',
    icon: '👩‍💻',
    baseCost: 10000,
    owned: 0,
    effect: { type: 'passive', value: 5 },
  },
  {
    id: 'cloud-server',
    name: 'Serveur Cloud',
    description: '+50 keys/sec auto',
    icon: '☁️',
    baseCost: 50000,
    owned: 0,
    effect: { type: 'passive', value: 50 },
  },
  {
    id: 'ai-copilot',
    name: 'AI Copilot',
    description: '+200 keys/sec auto',
    icon: '🤖',
    baseCost: 250000,
    owned: 0,
    effect: { type: 'passive', value: 200 },
  },
  {
    id: 'quantum-computer',
    name: 'Ordinateur Quantique',
    description: 'x2 multiplicateur global',
    icon: '⚛️',
    baseCost: 1000000,
    owned: 0,
    effect: { type: 'multiplier', value: 1.0 },
  },
];

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

  const [items, setItems] = useState<ShopItem[]>(SHOP_ITEMS);
  const [activeTab, setActiveTab] = useState<'shop' | 'stats' | 'leaderboard'>('shop');
  const [notification, setNotification] = useState<string | null>(null);
  const itemsLoadedRef = useRef(false);

  useEffect(() => {
    // Load initial state
    window.electronAPI?.getGameState().then(setGameState);
    
    // Load saved items
    window.electronAPI?.getItems().then((savedItems) => {
      if (savedItems && Object.keys(savedItems).length > 0) {
        setItems(prev => prev.map(item => ({
          ...item,
          owned: savedItems[item.id] || 0,
        })));
      }
      // Mark as loaded AFTER setting items
      itemsLoadedRef.current = true;
    });

    // Listen for updates
    window.electronAPI?.onGameStateUpdate(setGameState);

    return () => {
      window.electronAPI?.removeAllListeners();
    };
  }, []);

  // Update multiplier and passive when items change (only after initial load)
  useEffect(() => {
    // Skip if items haven't been loaded from storage yet
    if (!itemsLoadedRef.current) return;

    let newMultiplier = 1.0;
    let newPassive = 0.0; // This is now "keys per second" which generates LoC
    let clickBonus = 0;
    const itemsToSave: Record<string, number> = {};

    items.forEach(item => {
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
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const cost = calculateCost(item.baseCost, item.owned);

    if (gameState.linesOfCode < cost) {
      showNotification('❌ Pas assez de LoC!');
      return;
    }

    const success = await window.electronAPI?.subtractLoC(cost);

    if (success) {
      setItems(prev => prev.map(i => 
        i.id === itemId ? { ...i, owned: i.owned + 1 } : i
      ));

      const newState = await window.electronAPI?.getGameState();
      if (newState) setGameState(newState);

      showNotification(`✅ ${item.name} acheté!`);
    }
  };

  const handleClose = () => {
    window.electronAPI?.hideMenu();
  };

  const expProgress = gameState.experienceToNext > 0
    ? (gameState.experience / gameState.experienceToNext) * 100
    : 0;

  return (
    <div className="menu-container" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}>
      {notification && <div className="notification">{notification}</div>}

      <header className="menu-header">
        <div className="logo">
          <span className="logo-icon">💎</span>
          <h1>Timeless Heroes</h1>
        </div>
        <button 
          className="close-button" 
          onClick={handleClose}
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          ✕
        </button>
      </header>

      <div className="stats-bar" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <div className="stat-item main">
          <span className="stat-icon">💎</span>
          <span className="stat-value">{formatNumber(gameState.linesOfCode)}</span>
          <span className="stat-label">LoC</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">⚡</span>
          <span className="stat-value">x{gameState.multiplier.toFixed(2)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">⏱️</span>
          <span className="stat-value">{gameState.passiveRate.toFixed(1)}/s</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">📊</span>
          <span className="stat-value">Lv.{gameState.level}</span>
        </div>
      </div>

      <div className="exp-bar">
        <div className="exp-fill" style={{ width: `${expProgress}%` }}></div>
      </div>

      <nav className="tabs" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
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

      <main className="tab-content" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        {activeTab === 'shop' && (
          <div className="shop-grid">
            {items.map(item => {
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
              <h3>🏆 Classement</h3>
              <p className="coming-soon">Le classement multijoueur arrive bientôt!</p>
              <p className="hint">Connecte-toi au serveur NestJS pour la compétition.</p>
              <div className="your-rank">
                <span className="rank-number">#1</span>
                <span className="rank-name">Toi 👑</span>
                <span className="rank-score">{formatNumber(gameState.linesOfCode)} LoC</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
