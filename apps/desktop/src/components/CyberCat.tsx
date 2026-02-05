/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║               🐱 CYBER-CAT — Soft Cyberpunk Kawaii Mascot                 ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║  A cute hacker cat with VR headset, RGB mechanical keyboard,              ║
 * ║  and hoodie that reacts to the developer's keystrokes.                    ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { FC, useMemo } from 'react';
import './CyberCat.css';


interface CyberCatProps {
    isTyping: boolean;
    combo: number;
    level?: number;
    compact?: boolean;
}

// Combo thresholds for visual effects
const COMBO_TIERS = {
    COMMON: 10,
    RARE: 25,
    EPIC: 50,
    LEGENDARY: 100,
} as const;

export const CyberCat: FC<CyberCatProps> = ({ isTyping, combo, level = 1, compact = false }) => {
    // Determine combo tier for visual effects
    const comboTier = useMemo(() => {
        if (combo >= COMBO_TIERS.LEGENDARY) return 'legendary';
        if (combo >= COMBO_TIERS.EPIC) return 'epic';
        if (combo >= COMBO_TIERS.RARE) return 'rare';
        if (combo >= COMBO_TIERS.COMMON) return 'common';
        return 'idle';
    }, [combo]);

    // Dynamic colors based on combo
    const glowColor = useMemo(() => {
        switch (comboTier) {
            case 'legendary': return 'var(--neon-gold)';
            case 'epic': return 'var(--neon-pink)';
            case 'rare': return 'var(--neon-lavender)';
            case 'common': return 'var(--neon-cyan)';
            default: return 'var(--neon-cyan)';
        }
    }, [comboTier]);

    // RGB keyboard colors cycling based on typing
    const keyColors = useMemo(() => [
        'var(--neon-cyan)',
        'var(--neon-lavender)',
        'var(--neon-pink)',
        'var(--neon-mint)',
        'var(--neon-peach)',
    ], []);

    return (
        <div
            className={`cyber-cat cyber-cat--${comboTier} ${isTyping ? 'cyber-cat--typing' : ''} ${compact ? 'cyber-cat--compact' : ''}`}
            style={{ '--glow-color': glowColor } as React.CSSProperties}
        >
            {/* Holographic Aura */}
            <div className="cyber-cat__aura" />

            {/* Main SVG Avatar */}
            <svg
                viewBox="0 0 240 220"
                className="cyber-cat__svg"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    {/* Gradient for hoodie */}
                    <linearGradient id="hoodieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2a2a4a" />
                        <stop offset="100%" stopColor="#1a1a2e" />
                    </linearGradient>

                    {/* Glow filter */}
                    <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* VR visor gradient */}
                    <linearGradient id="visorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#7fdbda" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="#b4a7d6" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#f4a5c1" stopOpacity="0.9" />
                    </linearGradient>

                    {/* Screen reflection */}
                    <linearGradient id="screenReflection" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="white" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* === HOODIE (Back) === */}
                <path
                    className="cyber-cat__hoodie-back"
                    d="M 70 95 Q 60 100 55 120 L 55 180 Q 55 195 70 195 L 170 195 Q 185 195 185 180 L 185 120 Q 180 100 170 95"
                    fill="url(#hoodieGradient)"
                />

                {/* Hood */}
                <path
                    className="cyber-cat__hood"
                    d="M 75 55 Q 60 65 55 85 Q 50 100 55 110 Q 75 100 120 100 Q 165 100 185 110 Q 190 100 185 85 Q 180 65 165 55"
                    fill="#222240"
                    opacity="0.6"
                />

                {/* === CAT BODY === */}
                <ellipse
                    className="cyber-cat__body"
                    cx="120"
                    cy="150"
                    rx="55"
                    ry="45"
                    fill="#f5f0e6"
                />

                {/* === CAT HEAD === */}
                <circle
                    className="cyber-cat__head"
                    cx="120"
                    cy="75"
                    r="42"
                    fill="#f5f0e6"
                />

                {/* === EARS === */}
                <g className="cyber-cat__ears">
                    {/* Left ear */}
                    <polygon points="82,45 90,10 105,40" fill="#f5f0e6" />
                    <polygon points="86,40 91,20 100,38" fill="#f4a5c1" />

                    {/* Right ear */}
                    <polygon points="158,45 150,10 135,40" fill="#f5f0e6" />
                    <polygon points="154,40 149,20 140,38" fill="#f4a5c1" />

                    {/* Ear piercings (small cyber accents) */}
                    <circle cx="88" cy="28" r="2" fill="var(--neon-cyan)" className="cyber-cat__piercing" />
                    <circle cx="152" cy="28" r="2" fill="var(--neon-lavender)" className="cyber-cat__piercing" />
                </g>

                {/* === VR HEADSET === */}
                <g className="cyber-cat__vr-headset">
                    {/* Headset strap */}
                    <path
                        d="M 75 65 Q 120 55 165 65"
                        stroke="#333"
                        strokeWidth="4"
                        fill="none"
                    />

                    {/* Visor base */}
                    <rect
                        x="78"
                        y="58"
                        width="84"
                        height="30"
                        rx="8"
                        fill="#1a1a2e"
                        stroke="#333"
                        strokeWidth="2"
                    />

                    {/* Visor screen */}
                    <rect
                        className="cyber-cat__visor"
                        x="82"
                        y="62"
                        width="76"
                        height="22"
                        rx="5"
                        fill="url(#visorGradient)"
                        filter="url(#neonGlow)"
                    />

                    {/* Screen reflection */}
                    <rect
                        x="82"
                        y="62"
                        width="76"
                        height="11"
                        rx="5"
                        fill="url(#screenReflection)"
                    />

                    {/* Visor data lines (animated) */}
                    <g className="cyber-cat__visor-data">
                        <line x1="88" y1="70" x2="95" y2="70" stroke="#fff" strokeWidth="1" opacity="0.5" />
                        <line x1="88" y1="74" x2="100" y2="74" stroke="#fff" strokeWidth="1" opacity="0.3" />
                        <line x1="88" y1="78" x2="92" y2="78" stroke="#fff" strokeWidth="1" opacity="0.4" />
                        <circle cx="148" cy="73" r="6" stroke="#fff" strokeWidth="1" fill="none" opacity="0.3" />
                        <line x1="145" y1="73" x2="151" y2="73" stroke="#fff" strokeWidth="1" opacity="0.5" />
                        <line x1="148" y1="70" x2="148" y2="76" stroke="#fff" strokeWidth="1" opacity="0.5" />
                    </g>

                    {/* Small antenna on headset */}
                    <line x1="158" y1="58" x2="165" y2="48" stroke="#333" strokeWidth="2" />
                    <circle cx="166" cy="46" r="3" fill="var(--neon-mint)" className="cyber-cat__antenna-light" />
                </g>

                {/* === NOSE & MOUTH === */}
                <ellipse cx="120" cy="95" rx="5" ry="3" fill="#f4a5c1" />
                <path
                    d="M 112 100 Q 120 108 128 100"
                    stroke="#666"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                />

                {/* === WHISKERS (Fiber Optic style) === */}
                <g className="cyber-cat__whiskers" filter="url(#neonGlow)">
                    <line x1="68" y1="88" x2="95" y2="92" stroke="var(--neon-cyan)" strokeWidth="1.5" opacity="0.6" />
                    <line x1="65" y1="95" x2="95" y2="97" stroke="var(--neon-cyan)" strokeWidth="1.5" opacity="0.8" />
                    <line x1="68" y1="102" x2="95" y2="100" stroke="var(--neon-cyan)" strokeWidth="1.5" opacity="0.6" />

                    <line x1="172" y1="88" x2="145" y2="92" stroke="var(--neon-lavender)" strokeWidth="1.5" opacity="0.6" />
                    <line x1="175" y1="95" x2="145" y2="97" stroke="var(--neon-lavender)" strokeWidth="1.5" opacity="0.8" />
                    <line x1="172" y1="102" x2="145" y2="100" stroke="var(--neon-lavender)" strokeWidth="1.5" opacity="0.6" />
                </g>

                {/* === HOODIE FRONT === */}
                <path
                    className="cyber-cat__hoodie-front"
                    d="M 75 110 Q 120 120 165 110 L 165 195 L 75 195 Z"
                    fill="url(#hoodieGradient)"
                />

                {/* Hoodie pocket */}
                <path
                    d="M 90 155 L 150 155 L 150 175 Q 150 180 145 180 L 95 180 Q 90 180 90 175 Z"
                    fill="#1a1a2e"
                    opacity="0.5"
                />

                {/* Hoodie strings with glowing tips */}
                <line x1="110" y1="115" x2="105" y2="145" stroke="#444" strokeWidth="2" />
                <line x1="130" y1="115" x2="135" y2="145" stroke="#444" strokeWidth="2" />
                <circle cx="105" cy="147" r="3" fill="var(--neon-pink)" className="cyber-cat__string-tip" />
                <circle cx="135" cy="147" r="3" fill="var(--neon-cyan)" className="cyber-cat__string-tip" />

                {/* === MECHANICAL KEYBOARD === */}
                <g className="cyber-cat__keyboard">
                    {/* Keyboard base */}
                    <rect
                        x="55"
                        y="190"
                        width="130"
                        height="25"
                        rx="4"
                        fill="#1a1a2e"
                        stroke="#333"
                        strokeWidth="1"
                    />

                    {/* Key row 1 */}
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                        <rect
                            key={`key-1-${i}`}
                            className={`cyber-cat__key ${isTyping && Math.random() > 0.5 ? 'cyber-cat__key--pressed' : ''}`}
                            x={60 + i * 11}
                            y={193}
                            width="9"
                            height="8"
                            rx="1"
                            fill="#2a2a4a"
                            style={{ '--key-color': keyColors[i % keyColors.length] } as React.CSSProperties}
                        />
                    ))}

                    {/* Key row 2 */}
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                        <rect
                            key={`key-2-${i}`}
                            className={`cyber-cat__key ${isTyping && Math.random() > 0.5 ? 'cyber-cat__key--pressed' : ''}`}
                            x={65 + i * 11}
                            y={203}
                            width="9"
                            height="8"
                            rx="1"
                            fill="#2a2a4a"
                            style={{ '--key-color': keyColors[(i + 2) % keyColors.length] } as React.CSSProperties}
                        />
                    ))}
                </g>

                {/* === PAWS === */}
                <g className="cyber-cat__paws">
                    {/* Left paw */}
                    <ellipse
                        className="cyber-cat__paw cyber-cat__paw--left"
                        cx="75"
                        cy="195"
                        rx="18"
                        ry="12"
                        fill="#f5f0e6"
                    />
                    {/* Paw pads */}
                    <ellipse cx="70" cy="198" rx="4" ry="3" fill="#f4a5c1" />
                    <ellipse cx="78" cy="200" rx="3" ry="2" fill="#f4a5c1" />
                    <ellipse cx="82" cy="196" rx="3" ry="2" fill="#f4a5c1" />

                    {/* Right paw */}
                    <ellipse
                        className="cyber-cat__paw cyber-cat__paw--right"
                        cx="165"
                        cy="195"
                        rx="18"
                        ry="12"
                        fill="#f5f0e6"
                    />
                    {/* Paw pads */}
                    <ellipse cx="170" cy="198" rx="4" ry="3" fill="#f4a5c1" />
                    <ellipse cx="162" cy="200" rx="3" ry="2" fill="#f4a5c1" />
                    <ellipse cx="158" cy="196" rx="3" ry="2" fill="#f4a5c1" />
                </g>

                {/* === STATUS LED on hoodie === */}
                <circle
                    className="cyber-cat__status-led"
                    cx="145"
                    cy="135"
                    r="4"
                    fill="var(--neon-mint)"
                />

                {/* Level badge */}
                <g className="cyber-cat__level-badge">
                    <rect x="88" y="128" width="28" height="14" rx="3" fill="#1a1a2e" opacity="0.8" />
                    <text
                        x="102"
                        y="139"
                        fontSize="9"
                        fontFamily="var(--font-mono)"
                        fill="var(--neon-cyan)"
                        textAnchor="middle"
                    >
                        v{level}.0
                    </text>
                </g>
            </svg>

            {/* Combo Effect Particles */}
            {combo >= COMBO_TIERS.RARE && (
                <div className="cyber-cat__particles">
                    {Array.from({ length: comboTier === 'legendary' ? 12 : comboTier === 'epic' ? 8 : 4 }).map((_, i) => (
                        <span
                            key={i}
                            className="cyber-cat__particle"
                            style={{
                                '--delay': `${i * 0.1}s`,
                                '--x': `${(Math.random() - 0.5) * 60}px`,
                                '--color': keyColors[i % keyColors.length],
                            } as React.CSSProperties}
                        />
                    ))}
                </div>
            )}

            {/* Combo Counter */}
            {combo >= COMBO_TIERS.COMMON && (
                <div className={`cyber-cat__combo-display cyber-cat__combo-display--${comboTier} ${compact ? 'cyber-cat__combo-display--compact' : ''}`}>
                    <span className="cyber-cat__combo-value">{combo}x</span>
                    {!compact && <span className="cyber-cat__combo-label">COMBO</span>}
                </div>
            )}
        </div>
    );
};

export default CyberCat;
