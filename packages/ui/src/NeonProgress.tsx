/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║      📊 NEON PROGRESS BAR — Soft Cyberpunk Kawaii Component               ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║  An animated progress bar with shimmer effect and segmented visualization ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import './NeonProgress.css';

export type ProgressVariant = 'cyan' | 'lavender' | 'pink' | 'mint' | 'gold' | 'rainbow';
export type ProgressSize = 'xs' | 'sm' | 'md' | 'lg';

interface NeonProgressProps {
    value: number; // 0-100
    max?: number;
    variant?: ProgressVariant;
    size?: ProgressSize;
    showLabel?: boolean;
    labelPosition?: 'top' | 'inside' | 'right';
    segments?: number;
    animated?: boolean;
    className?: string;
}

export const NeonProgress: React.FC<NeonProgressProps> = ({
    value,
    max = 100,
    variant = 'cyan',
    size = 'md',
    showLabel = false,
    labelPosition = 'right',
    segments = 0,
    animated = true,
    className = '',
}) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const classes = [
        'neon-progress',
        `neon-progress--${variant}`,
        `neon-progress--${size}`,
        animated && 'neon-progress--animated',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes}>
            {showLabel && labelPosition === 'top' && (
                <div className="neon-progress__label neon-progress__label--top">
                    <span className="neon-progress__value">{Math.floor(percentage)}%</span>
                </div>
            )}

            <div className="neon-progress__container">
                <div className="neon-progress__track">
                    <div
                        className="neon-progress__fill"
                        style={{ width: `${percentage}%` }}
                    >
                        <div className="neon-progress__shimmer" />
                        <div className="neon-progress__glow" />
                    </div>

                    {segments > 0 && (
                        <div className="neon-progress__segments">
                            {Array.from({ length: segments }).map((_, i) => (
                                <span key={i} className="neon-progress__segment" />
                            ))}
                        </div>
                    )}
                </div>

                {showLabel && labelPosition === 'right' && (
                    <span className="neon-progress__label neon-progress__label--right">
                        {Math.floor(percentage)}%
                    </span>
                )}
            </div>

            {showLabel && labelPosition === 'inside' && percentage > 15 && (
                <span
                    className="neon-progress__label neon-progress__label--inside"
                    style={{ left: `${Math.min(percentage - 2, 95)}%` }}
                >
                    {Math.floor(percentage)}%
                </span>
            )}
        </div>
    );
};

export default NeonProgress;
