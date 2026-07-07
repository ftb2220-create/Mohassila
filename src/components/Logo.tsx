import React from 'react';

interface LogoProps {
    size?: number;
    showText?: boolean;
    light?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 40, showText = true, light = false }) => {
    const textColor = light ? '#FFFFFF' : '#0F172A';
    const uniqueId = React.useId().replace(/:/g, '');

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.25 }}>
            <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id={`bgGrad_${uniqueId}`} x1="0" y1="0" x2="64" y2="64">
                        <stop offset="0%" stopColor="#0A0F1E" />
                        <stop offset="100%" stopColor="#1E293B" />
                    </linearGradient>
                    <linearGradient id={`goldGrad_${uniqueId}`} x1="16" y1="16" x2="48" y2="48">
                        <stop offset="0%" stopColor="#FDE047" />
                        <stop offset="50%" stopColor="#EAB308" />
                        <stop offset="100%" stopColor="#CA8A04" />
                    </linearGradient>
                </defs>
                {/* Background with cyan border */}
                <rect x="2" y="2" width="60" height="60" rx="16" fill={`url(#bgGrad_${uniqueId})`} stroke="#06B6D4" strokeWidth="1.5" />
                {/* Stylized gold checkmark + trend bar emblem */}
                <path d="M18 34L25 41L33 22" stroke={`url(#goldGrad_${uniqueId})`} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M38 41V28" stroke={`url(#goldGrad_${uniqueId})`} strokeWidth="4.5" strokeLinecap="round" fill="none" />
                <path d="M46 41V16" stroke={`url(#goldGrad_${uniqueId})`} strokeWidth="4.5" strokeLinecap="round" fill="none" />
                <circle cx="46" cy="16" r="2.5" fill="#FDE047" />
            </svg>

            {showText && (
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                    <span style={{
                        fontSize: size * 0.5,
                        fontWeight: 900,
                        color: textColor,
                        letterSpacing: '-0.02em',
                        fontFamily: "'IBM Plex Sans Arabic', 'Inter', sans-serif",
                    }}>
                        محصّلة
                    </span>
                    <span style={{
                        fontSize: size * 0.2,
                        fontWeight: 700,
                        background: 'linear-gradient(90deg, #06B6D4, #0D9488)',
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
