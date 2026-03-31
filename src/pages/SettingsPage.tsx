import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

type Tab = 'account' | 'appearance' | 'notifications' | 'security';

const SettingsPage: React.FC = () => {
    const { employee } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState<Tab>('account');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [loading, setLoading] = useState(false);

    // Notification settings state
    const [notifNewMember, setNotifNewMember] = useState(true);
    const [notifExpiry, setNotifExpiry] = useState(true);
    const [notifTransaction, setNotifTransaction] = useState(false);
    const [notifSound, setNotifSound] = useState(true);

    const roleLabel: Record<string, string> = {
        admin: 'مدير النظام',
        manager: 'مشرف',
        employee: 'موظف',
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setMessage({ type: 'error', text: 'يرجى ملء جميع الحقول' });
            return;
        }
        if (newPassword.length < 4) {
            setMessage({ type: 'error', text: 'كلمة المرور الجديدة يجب أن تكون 4 أحرف على الأقل' });
            return;
        }
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'كلمة المرور الجديدة غير متطابقة' });
            return;
        }

        setLoading(true);
        await new Promise(r => setTimeout(r, 800));

        setMessage({ type: 'success', text: 'تم تغيير كلمة المرور بنجاح' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setLoading(false);
    };

    const ToggleSwitch: React.FC<{ checked: boolean; onChange: (v: boolean) => void; color?: string }> = ({ checked, onChange, color = 'bg-cyan-500' }) => (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${checked ? color : 'bg-slate-300 dark:bg-slate-600'}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${checked ? 'translate-x-1.5' : 'translate-x-6'}`} />
        </button>
    );

    const tabs: { id: Tab; label: string; icon: React.ReactNode; activeColor: string; activeBg: string }[] = [
        {
            id: 'account', label: 'الحساب الشخصي',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
            activeColor: 'text-cyan-700 dark:text-cyan-300', activeBg: 'bg-cyan-50 dark:bg-cyan-900/40 border-cyan-100/50 dark:border-cyan-800/50'
        },
        {
            id: 'appearance', label: 'المظهر والثيم',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
            activeColor: 'text-violet-700 dark:text-violet-300', activeBg: 'bg-violet-50 dark:bg-violet-900/40 border-violet-100/50 dark:border-violet-800/50'
        },
        {
            id: 'notifications', label: 'الإشعارات',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
            activeColor: 'text-emerald-700 dark:text-emerald-300', activeBg: 'bg-emerald-50 dark:bg-emerald-900/40 border-emerald-100/50 dark:border-emerald-800/50'
        },
        {
            id: 'security', label: 'الأمان والمرور',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
            activeColor: 'text-amber-700 dark:text-amber-300', activeBg: 'bg-amber-50 dark:bg-amber-900/40 border-amber-100/50 dark:border-amber-800/50'
        },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">إعدادات النظام</h1>
                    <p className="text-sm text-slate-400 mt-1">إدارة حسابك وتفضيلات النظام</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-3 py-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">آخر تحديث: الآن</span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Vertical Tabs Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-3 shadow-sm flex flex-col gap-1 md:sticky md:top-24">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${activeTab === tab.id
                                    ? `${tab.activeBg} ${tab.activeColor} shadow-sm border`
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0">
                    {activeTab === 'account' && (
                        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 md:p-8 shadow-sm relative animate-fade-in">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-50 dark:bg-cyan-900/20 rounded-full blur-3xl -translate-y-32 translate-x-32 pointer-events-none" />

                            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-8 relative z-10">الملف الشخصي</h2>

                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-8 relative z-10">
                                <div className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-[2rem] flex items-center justify-center text-white text-4xl md:text-5xl font-black mx-auto sm:mx-0 shadow-2xl shadow-cyan-500/20 transform hover:scale-105 transition-transform duration-300 ring-4 ring-white dark:ring-slate-800 shrink-0">
                                    {employee?.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0 space-y-4 text-center sm:text-right">
                                    <div className="py-2">
                                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-[1.6] mb-1">{employee?.name}</h3>
                                        <p className="text-base text-slate-500 dark:text-slate-400 font-mono">@{employee?.username}</p>
                                    </div>
                                    <div className="inline-flex px-5 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 rounded-2xl items-center shadow-sm">
                                        <span className="text-sm font-extrabold text-slate-700 dark:text-slate-200 flex items-center gap-2 leading-none">
                                            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            حساب نشط • {employee && roleLabel[employee.role]}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-8 md:mt-10 relative z-10">
                                <div className="bg-slate-50 dark:bg-slate-700/40 p-3.5 md:p-4 rounded-xl border border-slate-100 dark:border-slate-600/50 shadow-sm">
                                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-widest">الفرع الحالي</p>
                                    <p className="text-sm md:text-base font-black text-slate-800 dark:text-slate-100">{employee?.branch || 'الفرع الرئيسي'}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-700/40 p-3.5 md:p-4 rounded-xl border border-slate-100 dark:border-slate-600/50 shadow-sm">
                                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-widest">تاريخ الانضمام</p>
                                    <p className="text-sm md:text-base font-black text-slate-800 dark:text-slate-100 font-tabular">2024 / 01 / 01</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 md:p-8 shadow-sm relative animate-fade-in">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-50 dark:bg-violet-900/20 rounded-full blur-3xl -translate-y-32 translate-x-32 pointer-events-none" />

                            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2 relative z-10">تخصيص المظهر</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 font-medium relative z-10">اختر الوضع المناسب لراحة عينيك</p>

                            <div className="relative z-10 space-y-8">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">الوضع الليلي (Dark Mode)</h3>
                                    <div className="grid grid-cols-2 gap-4 max-w-sm">
                                        <button
                                            onClick={() => theme !== 'light' && toggleTheme()}
                                            className={`border-2 rounded-2xl p-5 text-center transition-all duration-200 group ${theme === 'light' ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/30 shadow-md ring-2 ring-violet-500/20' : 'border-slate-100 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'}`}
                                        >
                                            <div className="w-12 h-12 mx-auto bg-amber-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                            </div>
                                            <span className="font-bold text-sm text-slate-800 dark:text-slate-200">فاتح</span>
                                            {theme === 'light' && <p className="text-[10px] text-violet-500 font-bold mt-1">مُفعّل</p>}
                                        </button>

                                        <button
                                            onClick={() => theme !== 'dark' && toggleTheme()}
                                            className={`border-2 rounded-2xl p-5 text-center transition-all duration-200 group ${theme === 'dark' ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/30 shadow-md ring-2 ring-violet-500/20' : 'border-slate-100 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'}`}
                                        >
                                            <div className="w-12 h-12 mx-auto bg-slate-800 dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                                            </div>
                                            <span className="font-bold text-sm text-slate-800 dark:text-slate-200">داكن</span>
                                            {theme === 'dark' && <p className="text-[10px] text-violet-500 font-bold mt-1">مُفعّل</p>}
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 font-medium bg-slate-50 dark:bg-slate-700/30 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                                        💡 الوضع الداكن يقلل من إجهاد العين في الإضاءة المنخفضة ويعطي طابعاً فخماً للنظام.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 md:p-8 shadow-sm relative animate-fade-in">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/20 rounded-full blur-3xl -translate-y-32 translate-x-32 pointer-events-none" />

                            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2 relative z-10">إعدادات الإشعارات</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 font-medium relative z-10">تحكم في الإشعارات التي تريد استقبالها</p>

                            <div className="relative z-10 space-y-1 max-w-lg">
                                <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-cyan-50 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center">
                                            <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">إشعارات الأعضاء الجدد</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500">شعارات عند إضافة عضو جديد</p>
                                        </div>
                                    </div>
                                    <ToggleSwitch checked={notifNewMember} onChange={setNotifNewMember} />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                                            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">تنبيهات انتهاء العضوية</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500">تنبيه قبل انتهاء عضوية الأعضاء</p>
                                        </div>
                                    </div>
                                    <ToggleSwitch checked={notifExpiry} onChange={setNotifExpiry} color="bg-amber-500" />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                                            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">إشعارات العمليات</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500">إشعار عند كل عملية شراء أو تجديد</p>
                                        </div>
                                    </div>
                                    <ToggleSwitch checked={notifTransaction} onChange={setNotifTransaction} color="bg-emerald-500" />
                                </div>

                                <div className="border-t border-slate-100 dark:border-slate-700 my-4" />

                                <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-violet-50 dark:bg-violet-900/30 rounded-xl flex items-center justify-center">
                                            <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">صوت الإشعارات</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500">تفعيل الصوت عند وصول إشعار</p>
                                        </div>
                                    </div>
                                    <ToggleSwitch checked={notifSound} onChange={setNotifSound} color="bg-violet-500" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 md:p-8 shadow-sm relative animate-fade-in">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 dark:bg-amber-900/20 rounded-full blur-3xl -translate-y-32 translate-x-32 pointer-events-none" />

                            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2 relative z-10">تغيير كلمة المرور</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 font-medium relative z-10">قم بتحديث كلمة المرور الخاصة بك للوصول الآمن لحسابك</p>

                            <form onSubmit={handleChangePassword} className="space-y-6 max-w-md relative z-10">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">كلمة المرور الحالية</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={e => setCurrentPassword(e.target.value)}
                                        placeholder="أدخل كلمة المرور الحالية"
                                        className="w-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-2xl px-4 py-3.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">كلمة المرور الجديدة</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        placeholder="أدخل كلمة المرور الجديدة"
                                        className="w-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-2xl px-4 py-3.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">تأكيد كلمة المرور</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder="أعد إدخال كلمة المرور الجديدة"
                                        className="w-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-2xl px-4 py-3.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all font-mono"
                                    />
                                </div>

                                {message && (
                                    <div className={`flex items-center gap-3 p-4 rounded-2xl text-sm font-bold animate-fade-in ${message.type === 'success'
                                        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50 shadow-sm shadow-emerald-500/10'
                                        : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200/60 dark:border-red-800/50 shadow-sm shadow-red-500/10'
                                        }`}>
                                        {message.type === 'success' ? (
                                            <div className="bg-emerald-100 dark:bg-emerald-900/50 p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                        ) : (
                                            <div className="bg-red-100 dark:bg-red-900/50 p-1.5 rounded-lg text-red-600 dark:text-red-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                        )}
                                        {message.text}
                                    </div>
                                )}

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                جاري التحديث...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                تحديث كلمة المرور
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
