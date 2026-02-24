/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║      📈 STAT CARD — System Monitor Style Component                        ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║  Displays a metric with icon, value and label in dev/system monitor style ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import './StatCard.css';

export type StatColor =
  | 'cyan'
  | 'lavender'
  | 'pink'
  | 'mint'
  | 'gold'
  | 'peach';

interface StatCardProps {
  className?: string;
  color?: StatColor;
  icon: React.ReactNode;
  label: string;
  mono?: boolean;
  prefix?: string;
  suffix?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  value: string | number;
}

export const StatCard: React.FC<StatCardProps> = ({
  className = '',
  color = 'cyan',
  icon,
  label,
  mono = true,
  prefix,
  suffix,
  trend,
  trendValue,
  value,
}) => {
  const classes = ['stat-card', `stat-card--${color}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      {/* Accent top line */}
      <div className="stat-card__accent" />

      {/* Icon */}
      <div className="stat-card__icon">{icon}</div>

      {/* Value */}
      <div
        className={`stat-card__value ${mono ? 'stat-card__value--mono' : ''}`}
      >
        {prefix && <span className="stat-card__prefix">{prefix}</span>}
        {value}
        {suffix && <span className="stat-card__suffix">{suffix}</span>}
      </div>

      {/* Label */}
      <div className="stat-card__label">{label}</div>

      {/* Trend indicator */}
      {trend && trendValue && (
        <div className={`stat-card__trend stat-card__trend--${trend}`}>
          <span className="stat-card__trend-icon">
            {({ down: '↓', neutral: '→', up: '↑' } as const)[trend]}
          </span>
          <span className="stat-card__trend-value">{trendValue}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
