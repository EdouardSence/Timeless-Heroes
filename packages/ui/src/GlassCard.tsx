/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║      🃏 GLASS CARD — Soft Cyberpunk Kawaii Component                      ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║  A glassmorphism card with animated circuit borders and glow effects      ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import './GlassCard.css';

export type GlassVariant =
  | 'default'
  | 'cyan'
  | 'lavender'
  | 'pink'
  | 'mint'
  | 'gold';
export type GlassSize = 'sm' | 'md' | 'lg';

interface GlassCardProps {
  children: React.ReactNode;
  circuitBorder?: boolean;
  className?: string;
  glow?: boolean;
  hover?: boolean;
  onClick?: () => void;
  size?: GlassSize;
  variant?: GlassVariant;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  circuitBorder = false,
  className = '',
  glow = false,
  hover = true,
  onClick,
  size = 'md',
  variant = 'default',
}) => {
  const classes = [
    'glass-card',
    `glass-card--${variant}`,
    `glass-card--${size}`,
    glow && 'glass-card--glow',
    circuitBorder && 'glass-card--circuit',
    hover && 'glass-card--hover',
    onClick && 'glass-card--clickable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} onClick={onClick}>
      {circuitBorder && <div className="glass-card__circuit-border" />}
      <div className="glass-card__content">{children}</div>
      {glow && <div className="glass-card__glow" />}
    </div>
  );
};

export default GlassCard;
