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
                    <linearGradient id={`logoGrad_${uniqueId}`} x1="0" y1="0" x2="64" y2="64">
                        <stop offset="0%" stopColor="#06B6D4" />
                        <stop offset="50%" stopColor="#0891B2" />
                        <stop offset="100%" stopColor="#0D9488" />
                    </linearGradient>
                    <linearGradient id={`shieldGrad_${uniqueId}`} x1="20" y1="18" x2="44" y2="48">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                        <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0.85" />
                    </linearGradient>
                    <linearGradient id={`checkGrad_${uniqueId}`} x1="24" y1="34" x2="40" y2="50">
                        <stop offset="0%" stopColor="#FCD34D" />
                        <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                </defs>
                {/* Background */}
                <rect x="2" y="2" width="60" height="60" rx="16" fill={`url(#logoGrad_${uniqueId})`} />
                {/* Shield */}
                <path d="M32 14C32 14 22 16 18 18V30C18 38 24 44 32 50C40 44 46 38 46 30V18C42 16 32 14 32 14Z"
                    fill={`url(#shieldGrad_${uniqueId})`} opacity="0.95" />
                {/* Checkmark */}
                <path d="M24 32L29 37L40 26" stroke={`url(#checkGrad_${uniqueId})`}
                    strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                {/* Sparkles */}
                <circle cx="44" cy="14" r="2" fill="#FCD34D" opacity="0.8" />
                <circle cx="48" cy="18" r="1.2" fill="#FCD34D" opacity="0.5" />
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
