import React from 'react';

interface LogoProps {
    size?: number;
    showText?: boolean;
    light?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 40, showText = true, light = false }) => {
    const textColor = light ? '#FFFFFF' : '#0F172A';

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.25 }}>
            <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="logoGrad1" x1="0" y1="0" x2="64" y2="64">
                        <stop offset="0%" stopColor="#06B6D4" />
                        <stop offset="100%" stopColor="#14B8A6" />
                    </linearGradient>
                </defs>
                <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#logoGrad1)" />
                <path d="M16 42C16 42 20 24 26 24C30 24 28 38 32 38C36 38 34 20 38 20C42 20 48 42 48 42"
                    stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <circle cx="32" cy="48" r="3" fill="#FCD34D" />
                <path d="M50 12L52 16L56 14L52 18L50 22L48 18L44 14L48 16Z" fill="#FCD34D" opacity="0.9" />
            </svg>

            {showText && (
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                    <span style={{
                        fontSize: size * 0.5,
                        fontWeight: 900,
                        color: textColor,
                        letterSpacing: '-0.02em',
                        fontFamily: "'Noto Sans Arabic', 'Inter', sans-serif",
                    }}>
                        محصّلة
                    </span>
                    <span style={{
                        fontSize: size * 0.2,
                        fontWeight: 700,
                        background: 'linear-gradient(90deg, #06B6D4, #14B8A6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '0.15em',
                        fontFamily: "'Inter', sans-serif",
                        textTransform: 'uppercase' as const,
                    }}>
                        MOHASSILA
                    </span>
                </div>
            )}
        </div>
    );
};

export default Logo;
