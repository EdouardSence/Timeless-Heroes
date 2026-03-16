/**
 * LeaderboardPanel — Pure presentational component
 * Renders the leaderboard table.
 */

import React, { memo } from 'react';

import { formatNumber } from '../helpers';
import { styles } from '../styles';
import { LeaderboardEntry } from '../types';

interface LeaderboardPanelProps {
  connected: boolean;
  entries: LeaderboardEntry[];
}

export const LeaderboardPanel: React.FC<LeaderboardPanelProps> = memo(
  function LeaderboardPanel({ connected, entries }) {
    return (
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
            {entries.length > 0 ? (
              entries.map((entry) => (
                <tr key={entry.userId} style={styles.leaderboardRow}>
                  <td style={styles.td}>{entry.rank}</td>
                  <td style={styles.td}>{entry.username}</td>
                  <td style={styles.td}>
                    {formatNumber(Number.parseFloat(entry.score))}
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
    );
  },
);
