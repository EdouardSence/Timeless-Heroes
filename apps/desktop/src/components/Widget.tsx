/**
 * Widget Component - Always visible floating overlay
 */

import { useEffect, useRef, useState } from 'react';
import type { GameState } from '../types/electron';
import { BongoCat } from './BongoCat';
import './Widget.css';

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(2) + 'K';
  return Math.floor(num).toString();
}

export default function Widget() {
  const [gameState, setGameState] = useState<GameState>({
    linesOfCode: 0,
    totalKeyPresses: 0,
    level: 1,
    experience: 0,
    experienceToNext: 100,
    multiplier: 1.0,
    passiveRate: 0.0,
  });

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [keyPressAnimation, setKeyPressAnimation] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Combo Logic
  const [combo, setCombo] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const comboTimeoutRef = useRef<number | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  // References to track previous values
  const prevKeyPressesRef = useRef<number>(0);

  useEffect(() => {
    // Load initial state
    window.electronAPI?.getGameState().then((state) => {
      setGameState(state);
      prevKeyPressesRef.current = state.totalKeyPresses;
    });

    // Listen for updates
    const disposeState = window.electronAPI?.onGameStateUpdate((state) => {
      setGameState(state);
    });

    const disposeLevelUp = window.electronAPI?.onLevelUp(() => {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 2000);
    });

    return () => {
      if (disposeState || disposeLevelUp) {
        disposeState?.();
        disposeLevelUp?.();
      } else {
        window.electronAPI?.removeAllListeners();
      }
      if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  // Effect to handle key presses based on state changes
  useEffect(() => {
    if (gameState.totalKeyPresses > prevKeyPressesRef.current) {
      handleKeyPress();
      prevKeyPressesRef.current = gameState.totalKeyPresses;
    }
  }, [gameState.totalKeyPresses]);

  const handleKeyPress = () => {
    setKeyPressAnimation(true);
    setTimeout(() => setKeyPressAnimation(false), 100);

    // Typing animation
    setIsTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(
      () => setIsTyping(false),
      150,
    ) as unknown as number;

    // Combo logic
    setCombo((prev) => prev + 1);
    if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
    comboTimeoutRef.current = setTimeout(
      () => setCombo(0),
      2000,
    ) as unknown as number; // Reset combo after 2s idle
  };

  const handleOpenMenu = () => {
    window.electronAPI?.showMenu();
  };

  const toggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    window.electronAPI?.toggleWidgetSize(newState);
  };

  const expProgress =
    gameState.experienceToNext > 0
      ? (gameState.experience / gameState.experienceToNext) * 100
      : 0;

  if (collapsed) {
    return (
      <div
        className={`widget-container collapsed ${keyPressAnimation ? 'key-press' : ''}`}
        onClick={toggleCollapse}
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
        title="Click to expand"
      >
        <div className="collapsed-icon">💎</div>
        <div className="collapsed-value">
          {formatNumber(gameState.linesOfCode)}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`widget-container ${keyPressAnimation ? 'key-press' : ''}`}
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {showLevelUp && (
        <div className="level-up-notification">
          🎉 Niveau {gameState.level}!
        </div>
      )}

      {/* Header with actions */}
      <div className="widget-header">
        <div className="drag-handle">
          Timeless Heroes{' '}
          {combo > 5 && <span className="combo-text">x{combo}</span>}
        </div>
        <div
          className="header-actions"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <button className="icon-button" onClick={handleOpenMenu} title="Menu">
            ☰
          </button>
          <button
            className="icon-button"
            onClick={toggleCollapse}
            title="Réduire"
          >
            ─
          </button>
        </div>
      </div>

      <div className="widget-content-row">
        <BongoCat isTyping={isTyping} combo={combo} />

        <div className="widget-info-col">
          <div className="gem-display">
            <span className="gem-icon">💎</span>
            <div className="gem-content">
              <span className="gem-value">
                {formatNumber(gameState.linesOfCode)}
              </span>
              <span className="gem-sub">LoC</span>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-compact" title="Multiplicateur">
              <span className="stat-icon">⚡</span>x
              {gameState.multiplier.toFixed(1)}
            </div>
            <div className="stat-compact" title="Revenu passif">
              <span className="stat-icon">⏱️</span>
              {gameState.passiveRate > 0
                ? `+${gameState.passiveRate.toFixed(1)}/s`
                : '0/s'}
            </div>
          </div>
        </div>
      </div>

      <div className="widget-footer">
        <div
          className="exp-container"
          title={`Niveau ${gameState.level} (${Math.floor(expProgress)}%)`}
        >
          <div className="exp-info">
            <span className="level-badge">Lv.{gameState.level}</span>
            <span className="exp-text">{Math.floor(expProgress)}%</span>
          </div>
          <div className="exp-bar">
            <div
              className="exp-fill"
              style={{ width: `${expProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
