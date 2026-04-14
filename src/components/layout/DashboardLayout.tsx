import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotifications } from '../../contexts/NotificationsContext';
import { useMembers } from '../../contexts/MembersContext';
import { getPermissions } from '../../utils/permissions';
import ScrollToTop from '../ui/ScrollToTop';
import PageTransition from '../ui/PageTransition';
import Tooltip from '../ui/Tooltip';

const DashboardLayout: React.FC = () => {
    const { employee, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const notifRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const permissions = getPermissions(employee?.role);
    const { isDark, toggleTheme } = useTheme();
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const { members, transactions } = useMembers();

    // Keyboard shortcut: Ctrl+K to focus search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
                setTimeout(() => searchInputRef.current?.focus(), 100);
            }
            if (e.key === 'Escape') {
                setSearchOpen(false);
                setNotifOpen(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setNotifOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Search results
    const searchResults = searchQuery.length >= 2 ? {
        members: members.filter(m =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.memberId.includes(searchQuery) ||
            m.phone.includes(searchQuery)
        ).slice(0, 5),
        transactions: transactions.filter(t =>
            t.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 3),
    } : { members: [], transactions: [] };

    const hasResults = searchResults.members.length > 0 || searchResults.transactions.length > 0;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const roleLabel: Record<string, string> = {
        admin: 'مدير النظام',
        manager: 'مشرف',
        employee: 'موظف',
    };

    const roleBadge: Record<string, string> = {
        admin: 'bg-cyan-500/20 text-cyan-400',
        manager: 'bg-amber-500/20 text-amber-400',
        employee: 'bg-emerald-500/20 text-emerald-400',
    };

    // Check if a nav item is active - custom logic to prevent overlap
    const isNavActive = (path: string) => {
        const current = location.pathname;
        if (path === '/dashboard') return current === '/dashboard';
        if (path === '/dashboard/members') return current === '/dashboard/members' || (current.startsWith('/dashboard/members/') && current !== '/dashboard/members/new');
        if (path === '/dashboard/members/new') return current === '/dashboard/members/new';
        return current === path;
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex" dir="rtl">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 right-0 z-50 w-64 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
                    }`}
                style={{ background: 'linear-gradient(160deg, #0A1628 0%, #0D1F2D 40%, #071A1F 100%)', boxShadow: 'inset -1px 0 0 rgba(6,182,212,0.07)' }}
            >
                {/* Top accent line */}
                <div className="h-[3px] bg-gradient-to-l from-cyan-500 via-teal-500 to-emerald-500" />
                {/* Radial glow behind employee info */}
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle at 80% 20%, rgba(6,182,212,0.08) 0%, transparent 70%)' }} />
                {/* Mobile Close Button */}
                <div className="lg:hidden flex justify-end px-4 pt-3">
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="text-white/50 hover:text-white p-1"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Employee Info */}
                <div className="px-4 pt-4 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-cyan-500/20">
                            {employee?.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-bold">{employee?.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-xs font-bold px-1.5 py-1 rounded-md ${employee ? roleBadge[employee.role] : ''}`}>
                                    {employee && roleLabel[employee.role]}
                                </span>
                            </div>
                        </div>
                    </div>
                    <p className="text-slate-600 text-xs mt-2 flex items-center gap-1 pr-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {employee?.branch}
                    </p>
                    {/* Logout Button */}
                    <button
                        id="logout-btn"
                        onClick={handleLogout}
                        className="mt-3 w-full flex items-center justify-center gap-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 py-2 px-3 rounded-xl text-sm font-semibold transition-all duration-200 border border-white/5 hover:border-red-500/20"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        تسجيل الخروج
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 px-3 py-4 overflow-y-auto">
                    {/* Main Section */}
                    <p className="text-cyan-900/60 text-xs font-bold uppercase tracking-wider px-3 mb-2">الرئيسية</p>
                    <NavLink
                        to="/dashboard"
                        end
                        onClick={() => setSidebarOpen(false)}
                        className={() =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 mb-1 ${isNavActive('/dashboard')
                                ? 'bg-gradient-to-l from-cyan-500/20 to-teal-500/10 text-cyan-400 border border-cyan-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        لوحة التحكم
                    </NavLink>

                    {/* Members Section */}
                    <p className="text-cyan-900/60 text-xs font-bold uppercase tracking-wider px-3 mb-2 mt-5">الأعضاء</p>
                    <NavLink
                        to="/dashboard/members"
                        end
                        onClick={() => setSidebarOpen(false)}
                        className={() =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 mb-1 ${isNavActive('/dashboard/members')
                                ? 'bg-gradient-to-l from-cyan-500/20 to-teal-500/10 text-cyan-400 border border-cyan-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        إدارة الأعضاء
                    </NavLink>
                    {permissions.canAddMember && (
                        <NavLink
                            to="/dashboard/members/new"
                            onClick={() => setSidebarOpen(false)}
                            className={() =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 mb-1 ${isNavActive('/dashboard/members/new')
                                    ? 'bg-gradient-to-l from-cyan-500/20 to-teal-500/10 text-cyan-400 border border-cyan-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`
                            }
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            عضو جديد
                        </NavLink>
                    )}

                    {/* Other Section */}
                    <p className="text-cyan-900/60 text-xs font-bold uppercase tracking-wider px-3 mb-2 mt-5">النظام</p>
                    {permissions.canManageCards && (
                        <NavLink
                            to="/dashboard/cards"
                            onClick={() => setSidebarOpen(false)}
                            className={() =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 mb-1 ${isNavActive('/dashboard/cards')
                                    ? 'bg-gradient-to-l from-cyan-500/20 to-teal-500/10 text-cyan-400 border border-cyan-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`
                            }
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            البطاقات
                        </NavLink>
                    )}
                    <NavLink
                        to="/dashboard/transactions"
                        onClick={() => setSidebarOpen(false)}
                        className={() =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 mb-1 ${isNavActive('/dashboard/transactions')
                                ? 'bg-gradient-to-l from-cyan-500/20 to-teal-500/10 text-cyan-400 border border-cyan-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        العمليات
                    </NavLink>
                    <NavLink
                        to="/dashboard/settings"
                        onClick={() => setSidebarOpen(false)}
                        className={() =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 mb-1 ${isNavActive('/dashboard/settings')
                                ? 'bg-gradient-to-l from-cyan-500/20 to-teal-500/10 text-cyan-400 border border-cyan-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        الإعدادات
                    </NavLink>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden">
                {/* Top Bar */}
                <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border-b border-slate-200/40 dark:border-slate-700/40 px-5 py-3 flex items-center justify-between sticky top-0 z-30" style={{ boxShadow: '0 1px 3px -1px rgba(0,0,0,0.04), 0 4px 16px -4px rgba(0,0,0,0.03)', paddingLeft: 'clamp(1rem, 2.5vw, 2.5rem)', paddingRight: 'clamp(1.25rem, 3vw, 2.5rem)' }}>
                    <div className="flex items-center gap-3">
                        <button
                            id="sidebar-toggle"
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-slate-600 hover:text-slate-800 p-2 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                        <div className="relative" ref={searchRef}>
                            <Tooltip content="بحث (Ctrl+K)" position="bottom">
                                <button
                                    onClick={() => { setSearchOpen(!searchOpen); setSearchQuery(''); }}
                                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                </button>
                            </Tooltip>

                            {searchOpen && (
                                <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-50 animate-scale-in">
                                    <div className="p-3 border-b border-slate-100">
                                        <div className="relative">
                                            <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            <input
                                                id="global-search"
                                                ref={searchInputRef}
                                                type="text"
                                                value={searchQuery}
                                                onChange={e => setSearchQuery(e.target.value)}
                                                placeholder="ابحث عن عضو أو عملية... (Ctrl+K)"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-9 pl-3 text-sm text-slate-900 placeholder-slate-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 transition-all font-bold"
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                    <div className="max-h-72 overflow-y-auto">
                                        {searchQuery.length < 2 ? (
                                            <div className="p-4 text-center text-slate-400 text-xs font-bold">اكتب حرفين على الأقل للبحث</div>
                                        ) : !hasResults ? (
                                            <div className="p-4 text-center text-slate-400 text-xs font-bold">لا توجد نتائج</div>
                                        ) : (
                                            <>
                                                {searchResults.members.length > 0 && (
                                                    <>
                                                        <p className="text-xs font-bold text-slate-400 px-4 pt-2 pb-1">الأعضاء</p>
                                                        {searchResults.members.map(m => (
                                                            <div
                                                                key={m.id}
                                                                onClick={() => { navigate(`/dashboard/members/${m.id}`); setSearchOpen(false); setSearchQuery(''); }}
                                                                className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors"
                                                            >
                                                                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center text-white text-xs font-black">
                                                                    {m.name.charAt(0)}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-xs font-bold text-slate-900">{m.name}</p>
                                                                    <p className="text-xs text-slate-400 font-bold font-tabular">{m.memberId} · {m.phone}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </>
                                                )}
                                                {searchResults.transactions.length > 0 && (
                                                    <>
                                                        <p className="text-xs font-bold text-slate-400 px-4 pt-2 pb-1">العمليات</p>
                                                        {searchResults.transactions.map(t => (
                                                            <div
                                                                key={t.id}
                                                                onClick={() => { navigate('/dashboard/transactions'); setSearchOpen(false); setSearchQuery(''); }}
                                                                className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors"
                                                            >
                                                                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 text-xs">
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-xs font-bold text-slate-900">{t.description}</p>
                                                                    <p className="text-xs text-slate-400 font-bold font-tabular">{t.memberName} · {t.amount} ر.س</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <Tooltip content={isDark ? 'الوضع الفاتح' : 'الوضع الداكن'} position="bottom">
                            <button
                                id="theme-toggle"
                                onClick={toggleTheme}
                                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                            {isDark ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                            </button>
                        </Tooltip>
                        <div className="relative" ref={notifRef}>
                            <Tooltip content="الإشعارات" position="bottom">
                                <button
                                    id="notifications-btn"
                                    onClick={() => setNotifOpen(!notifOpen)}
                                    className="relative w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                    {unreadCount > 0 && (
                                        <span className="absolute top-[3px] right-[3px] min-w-[16px] h-[16px] bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                                            {unreadCount > 9 ? '+9' : unreadCount}
                                        </span>
                                    )}
                                </button>
                            </Tooltip>

                            {/* Notifications Dropdown */}
                            {notifOpen && (
                                <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-50 animate-scale-in">
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                                        <h3 className="text-sm font-black text-slate-900">الإشعارات</h3>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={markAllAsRead}
                                                className="text-xs font-bold text-cyan-500 hover:text-cyan-600 transition-colors"
                                            >
                                                قراءة الكل
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-6 text-center">
                                                <p className="text-slate-400 text-sm">لا توجد إشعارات</p>
                                            </div>
                                        ) : (
                                            notifications.map(n => (
                                                <div
                                                    key={n.id}
                                                    onClick={() => markAsRead(n.id)}
                                                    className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 ${!n.read ? 'bg-cyan-50/30' : ''}`}
                                                >
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${n.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                                                        n.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                                                            'bg-blue-100 text-blue-600'
                                                        }`}>
                                                        {n.type === 'warning' ? (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                                                        ) : n.type === 'success' ? (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        ) : (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-slate-900">{n.title}</p>
                                                        <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                                                    </div>
                                                    <span className="text-xs text-slate-400 flex-shrink-0">{n.time}</span>
                                                    {!n.read && (
                                                        <span className="w-2 h-2 bg-cyan-500 rounded-full flex-shrink-0 mt-1.5" />
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-5 lg:p-8 overflow-y-auto overflow-x-hidden" style={{ paddingLeft: 'clamp(1rem, 2.5vw, 2.5rem)', paddingRight: 'clamp(1.25rem, 3vw, 2.5rem)' }}>
                    <ScrollToTop />
                    <PageTransition>
                        <Outlet />
                    </PageTransition>
                </main>

                {/* Footer */}
                <footer className="px-5 py-3 border-t border-slate-100/60 dark:border-slate-700/40 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500" />
                        <p className="text-xs text-slate-400 font-medium">© 2026 محصّلة — نظام إدارة العضويات</p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default DashboardLayout;
