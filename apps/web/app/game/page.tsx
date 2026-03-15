'use client';

/**
 * Game Page — Orchestrator component
 *
 * Follows separation of concerns:
 * - Business logic & side effects  → useGameSocket hook
 * - Presentational rendering       → pure child components (memo'd)
 * - Types, helpers, styles         → dedicated modules
 *
 * This component is a thin shell that wires the hook's return values
 * to the pure components' props — no business logic here.
 */


import { GameHeader } from './components/GameHeader';
import { InfoPanel } from './components/InfoPanel';
import { LeaderboardPanel } from './components/LeaderboardPanel';
import { NotificationBanner } from './components/NotificationBanner';
import { ShopPanel } from './components/ShopPanel';
import { StatsPanel } from './components/StatsPanel';
import { useGameSocket } from './hooks/useGameSocket';
import { styles } from './styles';

export default function GamePage() {
  const {
    activeTab,
    connected,
    expProgress,
    gameState,
    items,
    leaderboard,
    notification,
    purchaseItem,
    setActiveTab,
  } = useGameSocket();

  return (
    <div style={styles.container}>
      <NotificationBanner message={notification} />

      <GameHeader connected={connected} />

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

      <StatsPanel gameState={gameState} expProgress={expProgress} />

      <nav style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'shop' ? styles.tabActive : {}),
          }}
          onClick={() => { setActiveTab('shop'); }}
        >
          Boutique
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'leaderboard' ? styles.tabActive : {}),
          }}
          onClick={() => { setActiveTab('leaderboard'); }}
        >
          Classement
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'info' ? styles.tabActive : {}),
          }}
          onClick={() => { setActiveTab('info'); }}
        >
          Info
        </button>
      </nav>

      <main style={styles.tabContent}>
        {activeTab === 'shop' && (
          <ShopPanel
            items={items}
            connected={connected}
            onPurchase={purchaseItem}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardPanel entries={leaderboard} connected={connected} />
        )}

        {activeTab === 'info' && <InfoPanel />}
      </main>
    </div>
  );
}
