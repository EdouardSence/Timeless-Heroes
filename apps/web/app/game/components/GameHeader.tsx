/**
 * GameHeader — Pure presentational component
 * Displays the logo and connection status indicator.
 */

import React, { memo } from 'react';

import { styles } from '../styles';

interface GameHeaderProps {
  connected: boolean;
}

export const GameHeader: React.FC<GameHeaderProps> = memo(function GameHeader({
  connected,
}) {
  return (
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
  );
});
