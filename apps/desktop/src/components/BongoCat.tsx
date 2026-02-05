/**
 * Bongo Cat Component
 * Animated avatar that reacts to keystrokes.
 */

import { FC } from 'react';
import './BongoCat.css';

interface BongoCatProps {
    isTyping: boolean;
    combo: number;
}

export const BongoCat: FC<BongoCatProps> = ({ isTyping, combo }) => {
    // Determine animation intensity based on combo
    const getComboClass = (): string => {
        if (combo >= 100) return 'combo-legendary';
        if (combo >= 50) return 'combo-epic';
        if (combo >= 25) return 'combo-rare';
        if (combo >= 10) return 'combo-common';
        return '';
    };

    return (
        <div className={`bongo-cat ${isTyping ? 'typing' : ''} ${getComboClass()}`}>
            <svg
                viewBox="0 0 200 200"
                className="cat-svg"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Cat body */}
                <ellipse cx="100" cy="130" rx="60" ry="50" fill="#f5f5dc" />

                {/* Cat head */}
                <circle cx="100" cy="70" r="45" fill="#f5f5dc" />

                {/* Ears */}
                <polygon points="60,40 70,10 85,35" fill="#f5f5dc" />
                <polygon points="140,40 130,10 115,35" fill="#f5f5dc" />
                <polygon points="65,35 72,18 80,33" fill="#ffb6c1" />
                <polygon points="135,35 128,18 120,33" fill="#ffb6c1" />

                {/* Eyes */}
                <ellipse cx="80" cy="65" rx="8" ry={isTyping ? 2 : 10} fill="#333" />
                <ellipse cx="120" cy="65" rx="8" ry={isTyping ? 2 : 10} fill="#333" />

                {/* Nose */}
                <ellipse cx="100" cy="80" rx="5" ry="3" fill="#ffb6c1" />

                {/* Mouth */}
                <path d="M 90 85 Q 100 95 110 85" stroke="#333" strokeWidth="2" fill="none" />

                {/* Whiskers */}
                <line x1="50" y1="75" x2="75" y2="78" stroke="#333" strokeWidth="1" />
                <line x1="50" y1="82" x2="75" y2="82" stroke="#333" strokeWidth="1" />
                <line x1="125" y1="78" x2="150" y2="75" stroke="#333" strokeWidth="1" />
                <line x1="125" y1="82" x2="150" y2="82" stroke="#333" strokeWidth="1" />

                {/* Left paw - animated */}
                <ellipse
                    className="paw left-paw"
                    cx="55"
                    cy="160"
                    rx="20"
                    ry="15"
                    fill="#f5f5dc"
                    stroke="#ddd"
                    strokeWidth="1"
                />

                {/* Right paw - animated */}
                <ellipse
                    className="paw right-paw"
                    cx="145"
                    cy="160"
                    rx="20"
                    ry="15"
                    fill="#f5f5dc"
                    stroke="#ddd"
                    strokeWidth="1"
                />
            </svg>

            {/* Combo effect particles */}
            {combo >= 25 && (
                <div className="combo-particles">
                    <span className="particle" />
                    <span className="particle" />
                    <span className="particle" />
                    <span className="particle" />
                </div>
            )}
        </div>
    );
};
