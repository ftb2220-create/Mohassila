import React from 'react';
import { useMembers } from '../contexts/MembersContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TIERS } from '../types';
import { formatCurrency, formatDate, isExpiringSoon, daysUntilExpiry } from '../data/mockData';
import { getPermissions } from '../utils/permissions';
import { DashboardSkeleton } from '../components/ui/Skeleton';

const DashboardPage: React.FC = () => {
    const { members, transactions, stats, activityLog, loading } = useMembers();
    const { employee } = useAuth();
    const navigate = useNavigate();
    const permissions = getPermissions(employee?.role);

    const expiringSoonMembers = members.filter(m => isExpiringSoon(m.expiryDate));
    const recentTransactions = transactions.slice(0, 6);
    const silverCount = members.filter(m => m.tier === 'silver').length;
    const goldCount = members.filter(m => m.tier === 'gold').length;
    const totalActive = members.filter(m => m.status === 'active').length;
    const totalInactive = members.filter(m => m.status !== 'active').length;
    const activePercent = members.length > 0 ? Math.round((totalActive / members.length) * 100) : 0;

    const typeLabels: Record<string, { label: string; color: string; iconBg: string; icon: React.ReactNode }> = {
        purchase: {
            label: 'شراء', color: 'text-cyan-700', iconBg: 'bg-cyan-100',
            icon: <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>,
        },
        renewal: {
            label: 'تجديد', color: 'text-emerald-700', iconBg: 'bg-emerald-100',
            icon: <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
        },
        cashback: {
            label: 'كاش باك', color: 'text-amber-700', iconBg: 'bg-amber-100',
            icon: <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        },
        refund: {
            label: 'استرجاع', color: 'text-red-700', iconBg: 'bg-red-100',
            icon: <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" /></svg>,
        },
    };

    // Last 7 days revenue
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dayName = d.toLocaleDateString('ar-SA', { weekday: 'short' });
        const dayTrx = transactions.filter(t => t.date === d.toISOString().split('T')[0]);
        const revenue = dayTrx.reduce((sum, t) => sum + (t.type !== 'refund' ? t.amount : 0), 0);
        return { day: dayName, revenue, date: d.toISOString().split('T')[0] };
    });
    const maxRevenue = Math.max(...last7Days.map(d => d.revenue), 1);

    // Current hour for greeting
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'صباح الخير' : hour < 17 ? 'مساء الخير' : 'مساء النور';

    if (loading) return <DashboardSkeleton />;

    return (
        <div className="space-y-6">
            {/* Welcome Banner - Premium Glassmorphism */}
            <div className="relative rounded-[1.25rem] p-6 md:p-8 text-white" style={{
                background: 'linear-gradient(135deg, #0E7490 0%, #0D9488 35%, #047857 65%, #0891B2 100%)',
                backgroundSize: '200% 200%',
                animation: 'gradient-shift 10s ease-in-out infinite',
                boxShadow: '0 24px 64px -16px rgba(6, 182, 212, 0.4), 0 0 0 1px rgba(255,255,255,0.07) inset'
            }}>
                <div className="absolute inset-0 rounded-[1.25rem] overflow-hidden pointer-events-none">
                    <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/[0.06] rounded-full blur-3xl" />
                    <div className="absolute -bottom-12 -right-12 w-56 h-56 bg-white/[0.04] rounded-full blur-3xl" />
                    {/* Geometric dot pattern */}
                    <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="dotGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                                <circle cx="2" cy="2" r="1" fill="white" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#dotGrid)" />
                    </svg>
                    {/* Decorative lines */}
                    <div className="absolute top-6 left-8 w-16 h-[1px] bg-gradient-to-l from-white/20 to-transparent" />
                    <div className="absolute bottom-6 right-8 w-24 h-[1px] bg-gradient-to-r from-white/15 to-transparent" />
                </div>
                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-sm shadow-emerald-400/50" />
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.15em]">
                                {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black mt-2 tracking-tight" style={{ lineHeight: '1.6' }}>
                            {greeting}، {employee?.name.split(' ')[0]}
                        </h1>
                        <p className="text-white/50 text-sm mt-2.5 font-medium">ملخص أداء النظام لهذا الشهر</p>
                    </div>
                    <div className="flex gap-2.5 flex-shrink-0">
                        {permissions.canAddMember && (
                            <button
                                onClick={() => navigate('/dashboard/members/new')}
                                className="bg-white/[0.08] hover:bg-white/[0.16] backdrop-blur-md text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border border-white/[0.08] hover:border-white/[0.18] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/10 flex items-center gap-2 group"
                            >
                                <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                عضو جديد
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/dashboard/transactions')}
                            className="bg-white/[0.08] hover:bg-white/[0.16] backdrop-blur-md text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border border-white/[0.08] hover:border-white/[0.18] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/10 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            العمليات
                        </button>
                    </div>
                </div>
            </div>

            {/* KPI Cards - Premium Design */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                        label: 'إجمالي الأعضاء', value: stats.totalMembers,
                        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
                        trend: `+${stats.newMembersThisMonth} هذا الشهر`,
                        iconColor: 'text-cyan-600', iconBg: 'bg-gradient-to-br from-cyan-50 to-cyan-100/50', accentColor: 'from-cyan-500 to-teal-500',
                        shadowHover: 'hover:shadow-cyan-100/60', progress: Math.min(100, stats.totalMembers), progressColor: 'from-cyan-500 to-teal-500'
                    },
                    {
                        label: 'الأعضاء النشطين', value: stats.activeMembers,
                        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                        trend: `${activePercent}% من الإجمالي`,
                        iconColor: 'text-emerald-600', iconBg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50', accentColor: 'from-emerald-500 to-green-500',
                        shadowHover: 'hover:shadow-emerald-100/60', progress: activePercent, progressColor: 'from-emerald-500 to-green-500'
                    },
                    {
                        label: 'إيرادات الشهر', value: formatCurrency(stats.monthlyRevenue),
                        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                        trend: `${stats.renewalsThisMonth} تجديد`,
                        iconColor: 'text-amber-600', iconBg: 'bg-gradient-to-br from-amber-50 to-amber-100/50', accentColor: 'from-amber-600 to-yellow-600',
                        shadowHover: 'hover:shadow-amber-100/60', progress: stats.totalRevenue > 0 ? Math.min(100, Math.round((stats.monthlyRevenue / stats.totalRevenue) * 100)) : 0, progressColor: 'from-amber-500 to-yellow-500'
                    },
                    {
                        label: 'البطاقات المصدرة', value: stats.cardsIssued,
                        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
                        trend: 'فضية + ذهبية',
                        iconColor: 'text-violet-600', iconBg: 'bg-gradient-to-br from-violet-50 to-violet-100/50', accentColor: 'from-violet-500 to-purple-500',
                        shadowHover: 'hover:shadow-violet-100/60', progress: stats.totalMembers > 0 ? Math.min(100, Math.round((stats.cardsIssued / (stats.totalMembers * 2)) * 100)) : 0, progressColor: 'from-violet-500 to-purple-500'
                    },
                ].map((card, i) => (
                    <div key={i} className={`bg-white rounded-2xl p-5 border border-slate-100/60 relative group hover:shadow-xl ${card.shadowHover} hover:-translate-y-1 transition-all duration-300 cursor-default animate-fade-in`} style={{ animationDelay: `${i * 80}ms` }}>
                        {/* Top accent bar */}
                        <div className={`absolute top-0 left-3 right-3 h-[2px] bg-gradient-to-r ${card.accentColor} rounded-full opacity-0 group-hover:opacity-80 transition-opacity duration-300`} />

                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-11 h-11 ${card.iconBg} rounded-xl flex items-center justify-center ${card.iconColor} flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                                {card.icon}
                            </div>
                            <span className="text-emerald-500 text-[10px] font-bold flex items-center gap-0.5 bg-emerald-50 px-2 py-1 rounded-md">
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                            </span>
                        </div>
                        <p className="text-2xl font-black text-slate-900 font-tabular leading-none">{card.value}</p>
                        <p className="text-[11px] text-slate-400 font-bold mt-1.5">{card.label}</p>
                        {/* Progress Bar */}
                        <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-gradient-to-r ${card.progressColor} rounded-full transition-all duration-700`}
                                style={{ width: `${card.progress}%` }}
                            />
                        </div>
                        <div className="mt-2">
                            <p className="text-[11px] font-bold text-emerald-500">{card.trend}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Revenue Chart + Distribution */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100/80 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-black text-slate-900 text-base">الإيرادات</h3>
                            <p className="text-xs text-slate-400 mt-0.5 font-medium">آخر 7 أيام</p>
                        </div>
                        <div className="text-left">
                            <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600 font-tabular">{formatCurrency(stats.totalRevenue)}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">إجمالي</p>
                        </div>
                    </div>

                    {/* Bar Chart with Grid */}
                    <div className="relative h-44 px-2">
                        {/* Horizontal grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between py-1 pointer-events-none">
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} className="w-full border-b border-dashed border-slate-100" />
                            ))}
                        </div>
                        <div className="relative flex items-end gap-2 h-full">
                            {last7Days.map((d, i) => {
                                const height = maxRevenue > 0 ? Math.max((d.revenue / maxRevenue) * 100, 4) : 4;
                                const isToday = i === last7Days.length - 1;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 relative group">
                                        <div className="w-full relative h-full flex items-end justify-center">
                                            {d.revenue > 0 && (
                                                <div className="absolute -top-9 bg-slate-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap font-bold pointer-events-none z-10 shadow-xl">
                                                    {formatCurrency(d.revenue)}
                                                    <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-slate-900 rotate-45" />
                                                </div>
                                            )}
                                            <div
                                                className={`w-full max-w-[34px] rounded-lg transition-all duration-500 ${isToday
                                                    ? 'bg-gradient-to-t from-cyan-600 to-teal-400 shadow-lg shadow-cyan-500/25 ring-2 ring-cyan-400/20 ring-offset-2 ring-offset-white'
                                                    : d.revenue > 0
                                                        ? 'bg-slate-200/80 group-hover:bg-gradient-to-t group-hover:from-cyan-400 group-hover:to-teal-300 group-hover:shadow-md group-hover:shadow-cyan-400/15'
                                                        : 'bg-slate-100/60'
                                                    }`}
                                                style={{ height: `${height}%`, minHeight: 6 }}
                                            />
                                        </div>
                                        <span className={`text-[10px] font-bold ${isToday ? 'text-cyan-600' : 'text-slate-400'}`}>{d.day}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Member Distribution */}
                <div className="bg-white rounded-2xl border border-slate-100/80 p-6">
                    <h3 className="font-black text-slate-900 text-base mb-6">توزيع العضويات</h3>

                    {/* Donut Chart */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="relative w-32 h-32">
                            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                <circle cx="18" cy="18" r="14" fill="none" stroke="#F1F5F9" strokeWidth="3.5" />
                                <circle
                                    cx="18" cy="18" r="14" fill="none"
                                    stroke="url(#silverGrad)" strokeWidth="3.5"
                                    strokeDasharray={`${(silverCount / Math.max(members.length, 1)) * 88} ${88 - (silverCount / Math.max(members.length, 1)) * 88}`}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000"
                                />
                                <circle
                                    cx="18" cy="18" r="14" fill="none"
                                    stroke="url(#goldGrad)" strokeWidth="3.5"
                                    strokeDasharray={`${(goldCount / Math.max(members.length, 1)) * 88} ${88 - (goldCount / Math.max(members.length, 1)) * 88}`}
                                    strokeDashoffset={`-${(silverCount / Math.max(members.length, 1)) * 88}`}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000"
                                />
                                <defs>
                                    <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#06B6D4" />
                                        <stop offset="100%" stopColor="#14B8A6" />
                                    </linearGradient>
                                    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#F59E0B" />
                                        <stop offset="100%" stopColor="#EF4444" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-black text-slate-900">{members.length}</span>
                                <span className="text-[10px] text-slate-400 font-bold">عضو</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        {[
                            { label: 'الفضية', count: silverCount, color: 'bg-gradient-to-r from-cyan-500 to-teal-500', bg: 'bg-cyan-50/50', pct: members.length > 0 ? Math.round((silverCount / members.length) * 100) : 0 },
                            { label: 'الذهبية', count: goldCount, color: 'bg-gradient-to-r from-amber-600 to-yellow-600', bg: 'bg-amber-50/50', pct: members.length > 0 ? Math.round((goldCount / members.length) * 100) : 0 },
                            { label: 'غير نشط', count: totalInactive, color: 'bg-gradient-to-r from-red-400 to-rose-400', bg: 'bg-red-50/50', pct: members.length > 0 ? Math.round((totalInactive / members.length) * 100) : 0 },
                        ].map((item, i) => (
                            <div key={i} className={`flex items-center justify-between p-3 ${item.bg} rounded-xl`}>
                                <div className="flex items-center gap-2.5">
                                    <div className={`w-2.5 h-2.5 ${item.color} rounded-full`} />
                                    <span className="text-xs text-slate-600 font-bold">{item.label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-slate-400 font-bold">{item.pct}%</span>
                                    <span className="text-sm font-black text-slate-900 min-w-[20px] text-left">{item.count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Stats - Sleek Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'أعضاء جدد هذا الشهر', value: stats.newMembersThisMonth, gradient: 'from-cyan-600 to-teal-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg> },
                    { label: 'تجديدات هذا الشهر', value: stats.renewalsThisMonth, gradient: 'from-amber-600 to-yellow-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> },
                    { label: 'كاش باك مدفوع', value: formatCurrency(stats.totalCashbackPaid), gradient: 'from-violet-600 to-purple-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
                ].map((card, i) => (
                    <div key={i} className={`bg-gradient-to-l ${card.gradient} rounded-2xl p-5 text-white relative group hover:-translate-y-0.5 transition-all duration-300`}>
                        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/[0.06] rounded-full blur-xl" />
                            <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/[0.04] rounded-full blur-xl" />
                        </div>
                        <div className="relative flex items-center justify-between">
                            <div>
                                <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider">{card.label}</p>
                                <p className="text-2xl font-black mt-1.5 font-tabular">{card.value}</p>
                            </div>
                            <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                                {card.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Two-column: Expiring + Recent Transactions */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Expiring Soon */}
                <div className="bg-white rounded-2xl border border-slate-100/80">
                    <div className="p-5 border-b border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl flex items-center justify-center border border-red-100/50">
                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 text-sm">تنتهي قريباً</h3>
                                <p className="text-[10px] text-slate-400 font-bold">خلال 30 يوم</p>
                            </div>
                        </div>
                        {expiringSoonMembers.length > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-black w-6 h-6 rounded-lg flex items-center justify-center shadow-sm shadow-red-500/20">
                                {expiringSoonMembers.length}
                            </span>
                        )}
                    </div>
                    <div className="divide-y divide-slate-50/80">
                        {expiringSoonMembers.length > 0 ? (
                            expiringSoonMembers.map(member => (
                                <div
                                    key={member.id}
                                    className="p-4 px-5 flex items-center justify-between hover:bg-slate-50/50 cursor-pointer transition-all duration-200 group"
                                    onClick={() => navigate(`/dashboard/members/${member.id}`)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black bg-gradient-to-br ${TIERS[member.tier].gradient} shadow-sm`}>
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 group-hover:text-slate-900">{member.name}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{TIERS[member.tier].nameAr} • {member.city}</p>
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                            <p className="text-xs font-black text-red-500">
                                                {daysUntilExpiry(member.expiryDate)} يوم
                                            </p>
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{formatDate(member.expiryDate)}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-10 text-center">
                                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-sm text-slate-500 font-bold">كل العضويات بوضع جيد</p>
                                <p className="text-xs text-slate-400 mt-1">لا توجد عضويات تنتهي قريباً</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-2xl border border-slate-100/80">
                    <div className="p-5 border-b border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl flex items-center justify-center border border-cyan-100/50">
                                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 text-sm">آخر العمليات</h3>
                                <p className="text-[10px] text-slate-400 font-bold">آخر {recentTransactions.length} عملية</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/dashboard/transactions')}
                            className="text-cyan-600 hover:text-cyan-700 text-xs font-bold hover:bg-cyan-50 px-3 py-1.5 rounded-lg transition-all"
                        >
                            عرض الكل ←
                        </button>
                    </div>
                    <div className="divide-y divide-slate-50/80">
                        {recentTransactions.map(trx => {
                            const tl = typeLabels[trx.type];
                            return (
                                <div
                                    key={trx.id}
                                    className="p-4 px-5 flex items-center justify-between hover:bg-slate-50/50 transition-all duration-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 ${tl.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                            {tl.icon}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-800">{trx.memberName}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className={`text-[10px] font-bold ${tl.color}`}>{tl.label}</span>
                                                <span className="text-[10px] text-slate-300">•</span>
                                                <span className="text-[10px] text-slate-400">{formatDate(trx.date)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-left flex-shrink-0">
                                        <p className={`text-sm font-black font-tabular ${trx.type === 'refund' ? 'text-red-500' : 'text-slate-800'}`}>
                                            {trx.type === 'refund' ? '-' : '+'}{formatCurrency(trx.amount)}
                                        </p>
                                        {trx.cashback > 0 && (
                                            <p className="text-[10px] text-emerald-500 font-bold">+{formatCurrency(trx.cashback)} كاش باك</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Activity Log - Modern Timeline */}
            {activityLog.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100/80">
                    <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-black text-slate-900">سجل النشاط</h2>
                            <p className="text-[10px] text-slate-400 font-bold mt-0.5">آخر العمليات في النظام</p>
                        </div>
                        <div className="text-[10px] text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg font-bold border border-slate-100/50">
                            آخر {Math.min(activityLog.length, 8)} عمليات
                        </div>
                    </div>
                    <div className="divide-y divide-slate-50/80">
                        {activityLog.slice(0, 8).map(a => {
                            const icons: Record<string, { bg: string; icon: React.ReactNode }> = {
                                add: { bg: 'bg-emerald-50 text-emerald-600', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg> },
                                delete: { bg: 'bg-red-50 text-red-600', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> },
                                renew: { bg: 'bg-cyan-50 text-cyan-600', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9" /></svg> },
                                suspend: { bg: 'bg-amber-50 text-amber-600', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg> },
                                activate: { bg: 'bg-emerald-50 text-emerald-600', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
                                card: { bg: 'bg-blue-50 text-blue-600', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> },
                                upgrade: { bg: 'bg-amber-50 text-amber-600', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg> },
                                other: { bg: 'bg-slate-50 text-slate-600', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
                            };
                            const ic = icons[a.type] || icons.other;
                            const time = new Date(a.timestamp);
                            const timeStr = time.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
                            return (
                                <div key={a.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-slate-50/50 transition-all duration-200">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${ic.bg}`}>
                                        {ic.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800">{a.action}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{a.details}</p>
                                    </div>
                                    <div className="text-left flex-shrink-0">
                                        <p className="text-[10px] text-slate-400 font-bold">{timeStr}</p>
                                        <p className="text-[10px] text-cyan-500 font-bold">{a.performedBy}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
