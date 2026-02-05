/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║      🔘 NEON BUTTON — Soft Cyberpunk Kawaii Component                     ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║  A glowing button with multiple variants and hover effects                ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import './NeonButton.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonColor = 'cyan' | 'lavender' | 'pink' | 'mint' | 'gold';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: ButtonVariant;
    color?: ButtonColor;
    size?: ButtonSize;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    loading?: boolean;
    fullWidth?: boolean;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
    children,
    variant = 'primary',
    color = 'cyan',
    size = 'md',
    icon,
    iconPosition = 'left',
    loading = false,
    fullWidth = false,
    className = '',
    disabled,
    ...props
}) => {
    const classes = [
        'neon-button',
        `neon-button--${variant}`,
        `neon-button--${color}`,
        `neon-button--${size}`,
        fullWidth && 'neon-button--full',
        loading && 'neon-button--loading',
        disabled && 'neon-button--disabled',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button className={classes} disabled={disabled || loading} {...props}>
            <span className="neon-button__bg" />
            <span className="neon-button__glow" />

            <span className="neon-button__content">
                {loading && (
                    <span className="neon-button__spinner">
                        <svg viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                    </span>
                )}

                {icon && iconPosition === 'left' && !loading && (
                    <span className="neon-button__icon">{icon}</span>
                )}

                <span className="neon-button__text">{children}</span>

                {icon && iconPosition === 'right' && !loading && (
                    <span className="neon-button__icon">{icon}</span>
                )}
            </span>
        </button>
    );
};

export default NeonButton;
