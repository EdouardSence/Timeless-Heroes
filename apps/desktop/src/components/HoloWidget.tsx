/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║      🖥️ HOLO-WIDGET — Soft Cyberpunk Kawaii Desktop Overlay              ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║  A holographic floating widget that looks like a cozy terminal/IDE        ║
 * ║  Uses dev jargon: LoC, Version, Commits instead of XP/Level/Actions       ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { useEffect, useRef, useState } from 'react';
import type { AntiCheatStatus, GameState } from '../types/electron';
import { CyberCat } from './CyberCat';
import './HoloWidget.css';

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(2) + 'K';
  return Math.floor(num).toString();
}

// Convert level to semantic version format
function levelToVersion(level: number): string {
  const major = Math.floor(level / 10);
  const minor = level % 10;
  const patch = 0;
  return `${major}.${minor}.${patch}`;
}

// Get tier name based on level
function getLevelTier(level: number): string {
  if (level >= 50) return 'SENIOR';
  if (level >= 30) return 'MID';
  if (level >= 15) return 'JUNIOR';
  if (level >= 5) return 'INTERN';
  return 'NOOB';
}

export default function HoloWidget() {
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

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [keyPressAnimation, setKeyPressAnimation] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [antiCheat, setAntiCheat] = useState<AntiCheatStatus | null>(null);
  const antiCheatTimeoutRef = useRef<number | null>(null);

  // Combo Logic
  const [combo, setCombo] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const comboTimeoutRef = useRef<number | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  const handleKeyPress = () => {
    setKeyPressAnimation(true);
    setTimeout(() => setKeyPressAnimation(false), 100);

    setIsTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(
      () => setIsTyping(false),
      150,
    ) as unknown as number;

    setCombo((prev) => prev + 1);
    if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
    comboTimeoutRef.current = setTimeout(
      () => setCombo(0),
      2000,
    ) as unknown as number;
  };

  useEffect(() => {
    window.electronAPI?.getGameState().then((state) => {
      setGameState(state);
    });

    const disposeState = window.electronAPI?.onGameStateUpdate((state) => {
      setGameState(state);
    });

    const disposeKeyPress = window.electronAPI?.onUserKeyPress(() => {
      handleKeyPress();
    });

    const disposeLevelUp = window.electronAPI?.onLevelUp(() => {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    });

    const disposeAntiCheat = window.electronAPI?.onAntiCheatWarning((status) => {
      setAntiCheat(status);
      // Auto-hide warnings after 5s (but keep ban visible)
      if (antiCheatTimeoutRef.current) clearTimeout(antiCheatTimeoutRef.current);
      if (!status.banned) {
        antiCheatTimeoutRef.current = setTimeout(
          () => setAntiCheat(null),
          5000,
        ) as unknown as number;
      }
    });

    return () => {
      // Prefer individual disposers; fallback to nuclear removeAllListeners
      if (disposeState || disposeKeyPress || disposeLevelUp || disposeAntiCheat) {
        disposeState?.();
        disposeKeyPress?.();
        disposeLevelUp?.();
        disposeAntiCheat?.();
      } else {
        window.electronAPI?.removeAllListeners();
      }
      if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (antiCheatTimeoutRef.current) clearTimeout(antiCheatTimeoutRef.current);
    };
  }, []);

  const handleOpenMenu = () => {
    window.electronAPI?.showMenu();
  };

  const toggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    window.electronAPI?.toggleWidgetSize(newState);
  };

  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click for dragging
    setIsDragging(true);
    dragOffset.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.screenX - dragOffset.current.x;
      const newY = e.screenY - dragOffset.current.y;
      window.electronAPI?.moveWidget({ x: newX, y: newY });
    };
    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const buildProgress =
    gameState.experienceToNext > 0
      ? (gameState.experience / gameState.experienceToNext) * 100
      : 0;

  // Collapsed state - CyberCat only
  // Hover to see stats, click on cat to expand
  if (collapsed) {
    return (
      <div
        className={`holo-widget holo-widget--collapsed ${keyPressAnimation ? 'holo-widget--pulse' : ''}`}
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties} // Ensure global non-drag to allow events
      >
        {/* Glass background */}
        <div className="holo-widget__glass" />

        {/* Click on cat to expand */}
        <div
          className="holo-widget__collapsed-cat"
          onContextMenu={toggleCollapse}
          onMouseDown={handleMouseDown}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          title="Drag to move • Right-click to expand"
        >
          <CyberCat
            isTyping={isTyping}
            combo={combo}
            level={gameState.level}
            compact={true}
          />
        </div>

        {/* Stats tooltip on hover */}
        <div className="holo-widget__collapsed-tooltip">
          <span className="holo-widget__collapsed-loc">
            {formatNumber(gameState.linesOfCode)}
          </span>
          <span className="holo-widget__collapsed-label">LoC</span>
        </div>

        {/* Resize Guides - Visible on Hover */}
        <div className="holo-widget__resize-guides">
          <div className="holo-widget__resize-guide holo-widget__resize-guide--tl" />
          <div className="holo-widget__resize-guide holo-widget__resize-guide--tr" />
          <div className="holo-widget__resize-guide holo-widget__resize-guide--bl" />
          <div className="holo-widget__resize-guide holo-widget__resize-guide--br" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`holo-widget ${keyPressAnimation ? 'holo-widget--pulse' : ''} ${combo >= 25 ? 'holo-widget--combo-active' : ''}`}
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* Circuit border effect */}
      <div className="holo-widget__circuit-border" />

      {/* Glass background */}
      <div className="holo-widget__glass" />

      {/* Level Up Notification */}
      {showLevelUp && (
        <div className="holo-widget__level-up">
          <div className="holo-widget__level-up-icon">⬆</div>
          <div className="holo-widget__level-up-text">
            <span className="holo-widget__level-up-label">
              git push origin main
            </span>
            <span className="holo-widget__level-up-version">
              v{levelToVersion(gameState.level)}
            </span>
          </div>
        </div>
      )}

      {/* Anti-Cheat Warning / Ban Banner */}
      {antiCheat && (
        <div className={`holo-widget__ac-banner ${antiCheat.banned ? 'holo-widget__ac-banner--ban' : 'holo-widget__ac-banner--warn'}`}>
          <span className="holo-widget__ac-icon">{antiCheat.banned ? '⛔' : '⚠'}</span>
          <span className="holo-widget__ac-text">
            {antiCheat.banned
              ? `BANNED — expires in ${Math.ceil(antiCheat.banExpiresIn)}s`
              : `Warning ${antiCheat.violations}/${antiCheat.maxViolations}`}
          </span>
        </div>
      )}

      {/* Header - Terminal style */}
      <div className="holo-widget__header">
        <div className="holo-widget__terminal-dots">
          <span className="holo-widget__dot holo-widget__dot--close" />
          <span className="holo-widget__dot holo-widget__dot--minimize" />
          <span className="holo-widget__dot holo-widget__dot--maximize" />
        </div>

        <div className="holo-widget__title">
          <span className="holo-widget__title-prefix">~/</span>
          <span className="holo-widget__title-text">cyber-cat</span>
          {gameState.prestigeLevel > 0 && (
            <span className="holo-widget__prestige-badge">
              👑{gameState.prestigeLevel}
            </span>
          )}
          {combo > 5 && (
            <span className="holo-widget__combo-badge">
              <span className="holo-widget__combo-x">×</span>
              {combo}
            </span>
          )}
        </div>

        <div
          className="holo-widget__actions"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <button
            className="holo-widget__btn holo-widget__btn--menu"
            onClick={handleOpenMenu}
            title="// Open package manager"
          >
            ⚙
          </button>
          <button
            className="holo-widget__btn holo-widget__btn--collapse"
            onClick={toggleCollapse}
            title="// Minimize to tray"
          >
            ⌄
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="holo-widget__content">
        {/* Left: CyberCat Avatar */}
        <div className="holo-widget__avatar-container">
          <CyberCat isTyping={isTyping} combo={combo} level={gameState.level} />
        </div>

        {/* Right: Stats Panel */}
        <div className="holo-widget__stats-panel">
          {/* Main LoC Counter */}
          <div className="holo-widget__loc-display">
            <div className="holo-widget__loc-header">
              <span className="holo-widget__loc-label">// Lines of Code</span>
              <span className="holo-widget__loc-tier">
                {getLevelTier(gameState.level)}
              </span>
            </div>
            <div className="holo-widget__loc-value">
              <span className="holo-widget__loc-number">
                {formatNumber(gameState.linesOfCode)}
              </span>
              <span className="holo-widget__loc-unit">LoC</span>
            </div>
          </div>

          {/* Stats Grid - Styled like system monitor */}
          <div className="holo-widget__metrics">
            <div className="holo-widget__metric">
              <span className="holo-widget__metric-icon">⚡</span>
              <div className="holo-widget__metric-data">
                <span className="holo-widget__metric-value">
                  ×{gameState.multiplier.toFixed(1)}
                </span>
                <span className="holo-widget__metric-label">boost</span>
              </div>
            </div>

            <div className="holo-widget__metric">
              <span className="holo-widget__metric-icon">◎</span>
              <div className="holo-widget__metric-data">
                <span className="holo-widget__metric-value">
                  {gameState.passiveRate > 0
                    ? `+${gameState.passiveRate.toFixed(1)}`
                    : '0.0'}
                </span>
                <span className="holo-widget__metric-label">/sec</span>
              </div>
            </div>

            <div className="holo-widget__metric">
              <span className="holo-widget__metric-icon">⌨</span>
              <div className="holo-widget__metric-data">
                <span className="holo-widget__metric-value">
                  {formatNumber(gameState.totalKeyPresses)}
                </span>
                <span className="holo-widget__metric-label">keys</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Build Progress Bar */}
      <div className="holo-widget__footer">
        <div className="holo-widget__build-info">
          <span className="holo-widget__build-label">
            <span className="holo-widget__build-icon">▶</span>
            build:
          </span>
          <span className="holo-widget__version-badge">
            v{levelToVersion(gameState.level)}
          </span>
          <span className="holo-widget__build-progress-text">
            {Math.floor(buildProgress)}%
          </span>
        </div>

        <div className="holo-widget__progress-track">
          <div
            className="holo-widget__progress-fill"
            style={{ width: `${buildProgress}%` }}
          >
            <div className="holo-widget__progress-shimmer" />
          </div>
          {/* Progress segments for visual effect */}
          <div className="holo-widget__progress-segments">
            {[...Array(20)].map((_, i) => (
              <span key={i} className="holo-widget__progress-segment" />
            ))}
          </div>
        </div>
      </div>

      {/* Scan line overlay effect */}
      <div className="holo-widget__scanlines" />
    </div>
  );
}
