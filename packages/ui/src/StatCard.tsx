/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║      📈 STAT CARD — System Monitor Style Component                        ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║  Displays a metric with icon, value and label in dev/system monitor style ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import './StatCard.css';

export type StatColor = 'cyan' | 'lavender' | 'pink' | 'mint' | 'gold' | 'peach';

interface StatCardProps {
    icon: React.ReactNode;
    value: string | number;
    label: string;
    prefix?: string;
    suffix?: string;
    color?: StatColor;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    mono?: boolean;
    className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    icon,
    value,
    label,
    prefix,
    suffix,
    color = 'cyan',
    trend,
    trendValue,
    mono = true,
    className = '',
}) => {
    const classes = [
        'stat-card',
        `stat-card--${color}`,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes}>
            {/* Accent top line */}
            <div className="stat-card__accent" />

            {/* Icon */}
            <div className="stat-card__icon">{icon}</div>

            {/* Value */}
            <div className={`stat-card__value ${mono ? 'stat-card__value--mono' : ''}`}>
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
                        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
                    </span>
                    <span className="stat-card__trend-value">{trendValue}</span>
                </div>
            )}
        </div>
    );
};

export default StatCard;
