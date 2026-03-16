/**
 * InfoPanel — Pure presentational component
 * Displays game instructions and mechanics.
 */

import React, { memo } from 'react';

import { styles } from '../styles';

export const InfoPanel: React.FC = memo(function InfoPanel() {
  return (
    <div style={styles.infoPanel}>
      <h2>Comment ca marche</h2>
      <div style={styles.infoCard}>
        <h3>Gagner des LoC</h3>
        <p>
          Chaque frappe sur ton clavier te donne{' '}
          <strong>1 &times; multiplicateur</strong> LoC.
        </p>
        <p>Les frappes sont envoyees au serveur en temps reel via Socket.IO.</p>
      </div>
      <div style={styles.infoCard}>
        <h3>Boutique</h3>
        <p>Achete des items pour augmenter tes gains.</p>
        <p>Les prix augmentent a chaque achat (formule exponentielle).</p>
      </div>
      <div style={styles.infoCard}>
        <h3>Revenus passifs</h3>
        <p>Certains items generent des LoC automatiquement chaque seconde.</p>
      </div>
      <div style={styles.infoCard}>
        <h3>Recompenses hors-ligne</h3>
        <p>
          Quand tu te reconnectes, tu recois 50% de tes gains passifs (max 8h).
        </p>
      </div>
    </div>
  );
});
