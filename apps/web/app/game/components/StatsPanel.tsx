/**
 * StatsPanel — Pure presentational component
 * Displays the player's game statistics (LoC, multiplier, passive rate, etc.).
 */

import React, { memo } from 'react';

import { formatNumber } from '../helpers';
import { styles } from '../styles';
import { GameState } from '../types';

interface StatsPanelProps {
  expProgress: number;
  gameState: GameState;
}

export const StatsPanel: React.FC<StatsPanelProps> = memo(function StatsPanel({
  expProgress,
  gameState,
}) {
  return (
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
        <div style={styles.statIcon}>&times;</div>
        <div>
          <div style={styles.statLabel}>Multiplicateur</div>
          <div style={styles.statValue}>
            &times;{gameState.multiplier.toFixed(2)}
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
            <div style={{ ...styles.expFill, width: `${expProgress}%` }}></div>
          </div>
        </div>
      </div>
    </section>
  );
});
