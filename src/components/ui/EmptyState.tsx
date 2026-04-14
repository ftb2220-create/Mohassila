import React from 'react';

interface EmptyStateProps {
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    type?: 'search' | 'members' | 'transactions' | 'cards' | 'general';
}

const illustrations: Record<string, React.ReactNode> = {
    search: (
        <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="52" cy="44" r="28" fill="url(#searchBg)" opacity="0.15" />
            <circle cx="52" cy="44" r="22" stroke="url(#searchStroke)" strokeWidth="3" fill="none" />
            <line x1="68" y1="60" x2="85" y2="77" stroke="url(#searchStroke)" strokeWidth="3" strokeLinecap="round" />
            <circle cx="52" cy="44" r="8" fill="url(#searchDot)" opacity="0.4" />
            <line x1="44" y1="44" x2="60" y2="44" stroke="url(#searchLine)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            <line x1="52" y1="36" x2="52" y2="52" stroke="url(#searchLine)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            <defs>
                <linearGradient id="searchBg" x1="0" y1="0" x2="80" y2="80">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#14B8A6" />
                </linearGradient>
                <linearGradient id="searchStroke" x1="30" y1="22" x2="74" y2="66">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#0891B2" />
                </linearGradient>
                <linearGradient id="searchDot" x1="44" y1="36" x2="60" y2="52">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#14B8A6" />
                </linearGradient>
                <linearGradient id="searchLine" x1="0" y1="0" x2="20" y2="0">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#14B8A6" />
                </linearGradient>
            </defs>
        </svg>
    ),
    members: (
        <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="60" cy="85" rx="35" ry="6" fill="#06B6D4" opacity="0.08" />
            <circle cx="60" cy="34" r="18" fill="url(#memberBg)" opacity="0.15" />
            <circle cx="60" cy="30" r="12" stroke="url(#memberStroke)" strokeWidth="2.5" fill="none" />
            <path d="M36 70c0-13.255 10.745-24 24-24s24 10.745 24 24" stroke="url(#memberStroke)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <circle cx="32" cy="36" r="8" stroke="#94A3B8" strokeWidth="2" fill="none" opacity="0.5" />
            <path d="M16 58c0-8.837 7.163-16 16-16" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
            <circle cx="88" cy="36" r="8" stroke="#94A3B8" strokeWidth="2" fill="none" opacity="0.5" />
            <path d="M104 58c0-8.837-7.163-16-16-16" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
            <defs>
                <linearGradient id="memberBg" x1="42" y1="12" x2="78" y2="52">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#14B8A6" />
                </linearGradient>
                <linearGradient id="memberStroke" x1="36" y1="18" x2="84" y2="70">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#0891B2" />
                </linearGradient>
            </defs>
        </svg>
    ),
    transactions: (
        <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="22" y="18" width="76" height="64" rx="10" fill="url(#txBg)" opacity="0.1" />
            <rect x="22" y="18" width="76" height="64" rx="10" stroke="url(#txStroke)" strokeWidth="2.5" fill="none" />
            <line x1="36" y1="40" x2="84" y2="40" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            <line x1="36" y1="54" x2="70" y2="54" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
            <line x1="36" y1="67" x2="60" y2="67" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" opacity="0.2" />
            <circle cx="90" cy="67" r="14" fill="url(#txCoin)" />
            <text x="86" y="72" fontFamily="system-ui" fontSize="12" fontWeight="bold" fill="white">＄</text>
            <defs>
                <linearGradient id="txBg" x1="22" y1="18" x2="98" y2="82">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#14B8A6" />
                </linearGradient>
                <linearGradient id="txStroke" x1="22" y1="18" x2="98" y2="82">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#0891B2" />
                </linearGradient>
                <linearGradient id="txCoin" x1="76" y1="53" x2="104" y2="81">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
            </defs>
        </svg>
    ),
    cards: (
        <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="16" y="24" width="88" height="56" rx="10" fill="url(#cardBg)" opacity="0.12" />
            <rect x="16" y="24" width="88" height="56" rx="10" stroke="url(#cardStroke)" strokeWidth="2.5" fill="none" />
            <rect x="16" y="38" width="88" height="10" fill="url(#cardStripe)" opacity="0.2" />
            <rect x="30" y="60" width="24" height="8" rx="2" fill="url(#cardChip)" opacity="0.5" />
            <circle cx="80" cy="64" r="7" stroke="url(#cardStroke)" strokeWidth="2" fill="none" opacity="0.4" />
            <circle cx="90" cy="64" r="7" fill="url(#cardStroke2)" opacity="0.3" />
            <defs>
                <linearGradient id="cardBg" x1="16" y1="24" x2="104" y2="80">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
                <linearGradient id="cardStroke" x1="16" y1="24" x2="104" y2="80">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#0891B2" />
                </linearGradient>
                <linearGradient id="cardStripe" x1="16" y1="38" x2="104" y2="48">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#14B8A6" />
                </linearGradient>
                <linearGradient id="cardChip" x1="30" y1="60" x2="54" y2="68">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
                <linearGradient id="cardStroke2" x1="83" y1="57" x2="97" y2="71">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
            </defs>
        </svg>
    ),
    general: (
        <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="50" r="30" fill="url(#genBg)" opacity="0.1" />
            <circle cx="60" cy="50" r="22" stroke="url(#genStroke)" strokeWidth="2.5" fill="none" />
            <line x1="60" y1="38" x2="60" y2="52" stroke="url(#genStroke)" strokeWidth="3" strokeLinecap="round" />
            <circle cx="60" cy="60" r="2" fill="url(#genStroke)" />
            <defs>
                <linearGradient id="genBg" x1="30" y1="20" x2="90" y2="80">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#14B8A6" />
                </linearGradient>
                <linearGradient id="genStroke" x1="38" y1="28" x2="82" y2="72">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#0891B2" />
                </linearGradient>
            </defs>
        </svg>
    ),
};

const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    action,
    type = 'general',
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            {/* Illustration */}
            <div className="relative mb-5">
                <div
                    className="absolute inset-0 rounded-full blur-2xl opacity-20"
                    style={{ background: 'radial-gradient(circle, #06B6D4, transparent)', transform: 'scale(1.4)' }}
                />
                <div className="relative bg-gradient-to-br from-slate-50 to-cyan-50/50 border border-cyan-100/60 rounded-3xl p-6 shadow-sm">
                    {illustrations[type]}
                </div>
            </div>

            {/* Text */}
            <h3 className="text-base font-black text-slate-700 dark:text-slate-300 mb-1.5">{title}</h3>
            {description && (
                <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs leading-relaxed">{description}</p>
            )}

            {/* Action */}
            {action && (
                <button
                    onClick={action.onClick}
                    className="mt-5 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white text-sm font-bold rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/25"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
