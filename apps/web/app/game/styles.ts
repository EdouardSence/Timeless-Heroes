/**
 * Game Page — Centralized style definitions
 * Extracted from the monolithic page component for separation of concerns.
 */

import React from 'react';

export const styles: Record<string, React.CSSProperties> = {
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
