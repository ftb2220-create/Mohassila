import React from 'react';

interface MemberCardProps {
    name: string;
    memberId: string;
    tier: 'فضية' | 'ذهبية';
    joinDate: string;
}

const tierConfig = {
    'فضية': {
        bg: 'from-slate-700 via-slate-600 to-slate-800',
        badge: 'bg-slate-500',
        label: 'SILVER',
    },
    'ذهبية': {
        bg: 'from-cyan-700 via-teal-600 to-cyan-800',
        badge: 'bg-gradient-to-r from-cyan-500 to-teal-500',
        label: 'GOLD',
    },
};

const MemberCard: React.FC<MemberCardProps> = ({ name, memberId, tier, joinDate }) => {
    const config = tierConfig[tier];

    return (
        <div className={`relative w-[340px] h-[200px] rounded-2xl p-6 shadow-2xl overflow-hidden bg-gradient-to-br ${config.bg} text-white transition-all duration-500 hover:scale-105 hover:shadow-3xl`}>
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16 blur-xl" />
            <div className="absolute top-4 left-16 w-1 h-1 bg-white/40 rounded-full" />
            <div className="absolute top-8 left-24 w-1.5 h-1.5 bg-white/30 rounded-full" />
            <div className="absolute bottom-12 right-20 w-1 h-1 bg-white/40 rounded-full" />

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2">
                            <svg width="22" height="22" viewBox="0 0 64 64" fill="none">
                                <rect x="4" y="4" width="56" height="56" rx="16" fill="white" fillOpacity="0.15" />
                                <path d="M16 42C16 42 20 24 26 24C30 24 28 38 32 38C36 38 34 20 38 20C42 20 48 42 48 42"
                                    stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                            </svg>
                            <span className="font-black text-sm tracking-tight">محصّلة</span>
                        </div>
                        <p className="text-xs mt-1 opacity-60 tracking-[0.2em] uppercase font-semibold">Wholesale Member</p>
                    </div>
                    <div className={`${config.badge} text-xs font-black px-3 py-1 rounded-lg tracking-wider text-white`}>
                        {config.label}
                    </div>
                </div>

                <div>
                    <p className="text-xs opacity-50 uppercase font-bold tracking-wider mb-0.5">اسم العضو</p>
                    <p className="text-base font-bold tracking-wide">{name}</p>
                </div>

                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-xs opacity-50 uppercase font-bold tracking-wider mb-0.5">رقم العضوية</p>
                        <p className="text-xs font-mono opacity-90">{memberId}</p>
                    </div>
                    <div className="text-left">
                        <p className="text-xs opacity-50 uppercase font-bold tracking-wider mb-0.5">تاريخ الانضمام</p>
                        <p className="text-xs font-mono opacity-90">{joinDate}</p>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-3 right-6 flex gap-[2px] items-end opacity-15">
                {[3, 5, 2, 4, 3, 6, 2, 5, 3, 4, 2].map((h, i) => (
                    <div key={i} className="w-[2px] bg-white" style={{ height: `${h * 3}px` }} />
                ))}
            </div>
        </div>
    );
};

export default MemberCard;
