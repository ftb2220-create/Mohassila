import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMembers } from '../contexts/MembersContext';
import { useAuth } from '../contexts/AuthContext';
import { TIERS } from '../types';
import type { TierType } from '../types';
import { formatCurrency, formatDate, daysUntilExpiry } from '../data/mockData';
import { getPermissions } from '../utils/permissions';

const MemberDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getMember, renewMembership, issueCard, suspendMember, activateMember, updateMember, deleteMember } = useMembers();
    const { employee } = useAuth();
    const navigate = useNavigate();
    const permissions = getPermissions(employee?.role);
    const member = getMember(id || '');

    const [showRenewModal, setShowRenewModal] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [cardHolderName, setCardHolderName] = useState('');
    const [cardType, setCardType] = useState<'primary' | 'family'>('family');
    const [activeTab, setActiveTab] = useState<'overview' | 'cards' | 'family'>('overview');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    if (!member) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-slate-500 font-bold">العضو غير موجود</p>
                    <button onClick={() => navigate('/dashboard/members')} className="mt-4 text-cyan-500 font-bold text-sm">← العودة</button>
                </div>
            </div>
        );
    }

    const days = daysUntilExpiry(member.expiryDate);
    const tier = TIERS[member.tier];
    const canIssueCard = member.cards.length < tier.maxCards;

    const handleRenew = () => {
        renewMembership(member.id, employee?.id || '');
        setShowRenewModal(false);
    };

    const handleIssueCard = () => {
        if (cardHolderName.trim()) {
            issueCard(member.id, cardHolderName.trim(), cardType);
            setCardHolderName('');
            setShowCardModal(false);
        }
    };

    const handleUpgrade = () => {
        updateMember(member.id, {
            tier: 'gold' as TierType,
            cards: member.cards.map(c => ({ ...c, tier: 'gold' as TierType })),
        });
        setShowUpgradeModal(false);
    };

    const handleDelete = () => {
        deleteMember(member.id);
        navigate('/dashboard/members');
    };
    const handlePrintReport = () => {
        const pw = window.open('', '_blank');
        if (!pw) return;
        const statusLabels: Record<string, string> = { active: 'نشط', expired: 'منتهي', suspended: 'معلق' };
        pw.document.write(`
        <html dir="rtl">
        <head>
            <title>تقرير العضو - ${member.name}</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700;900&display=swap');
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Noto Sans Arabic', sans-serif; padding: 40px; color: #1e293b; background: white; }
                .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; padding-bottom: 16px; border-bottom: 2px solid #e2e8f0; }
                .header h1 { font-size: 24px; font-weight: 900; }
                .header .date { font-size: 12px; color: #94a3b8; }
                .section { margin-bottom: 24px; }
                .section-title { font-size: 14px; font-weight: 900; color: #0891b2; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; }
                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; }
                .field { display: flex; justify-content: space-between; padding: 6px 0; }
                .field-label { font-size: 12px; color: #94a3b8; }
                .field-value { font-size: 13px; font-weight: 700; }
                table { width: 100%; border-collapse: collapse; font-size: 12px; }
                th { background: #f1f5f9; padding: 8px 12px; text-align: right; font-weight: 700; color: #64748b; }
                td { padding: 8px 12px; border-bottom: 1px solid #f1f5f9; }
                .badge { display: inline-block; padding: 2px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; }
                .active { background: #d1fae5; color: #059669; }
                .expired { background: #fee2e2; color: #dc2626; }
                .suspended { background: #fef3c7; color: #d97706; }
                @media print { body { padding: 20px; } }
            </style>
        </head>
        <body>
            <div class="header">
                <div>
                    <h1>تقرير العضو</h1>
                    <p style="font-size:13px;color:#64748b;margin-top:4px;">${member.name} — ${member.memberId}</p>
                </div>
                <div class="date">
                    <p>محصّلة — نظام إدارة العضويات</p>
                    <p>${new Date().toLocaleDateString('ar-SA')}</p>
                </div>
            </div>

            <div class="section">
                <div class="section-title">المعلومات الشخصية</div>
                <div class="grid">
                    <div class="field"><span class="field-label">الاسم</span><span class="field-value">${member.name}</span></div>
                    <div class="field"><span class="field-label">رقم العضوية</span><span class="field-value">${member.memberId}</span></div>
                    <div class="field"><span class="field-label">الجوال</span><span class="field-value">${member.phone}</span></div>
                    <div class="field"><span class="field-label">البريد</span><span class="field-value">${member.email}</span></div>
                    <div class="field"><span class="field-label">الهوية</span><span class="field-value">${member.nationalId}</span></div>
                    <div class="field"><span class="field-label">المدينة</span><span class="field-value">${member.city}</span></div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">معلومات العضوية</div>
                <div class="grid">
                    <div class="field"><span class="field-label">النوع</span><span class="field-value">${member.tier === 'gold' ? 'ذهبية' : 'فضية'}</span></div>
                    <div class="field"><span class="field-label">الحالة</span><span class="badge ${member.status}">${statusLabels[member.status]}</span></div>
                    <div class="field"><span class="field-label">تاريخ الانضمام</span><span class="field-value">${member.joinDate}</span></div>
                    <div class="field"><span class="field-label">تاريخ الانتهاء</span><span class="field-value">${member.expiryDate}</span></div>
                    <div class="field"><span class="field-label">إجمالي المشتريات</span><span class="field-value">${member.totalSpent.toLocaleString('ar-SA')} ر.س</span></div>
                    <div class="field"><span class="field-label">كاش باك مكتسب</span><span class="field-value">${member.cashbackEarned.toLocaleString('ar-SA')} ر.س</span></div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">البطاقات (${member.cards.length})</div>
                <table>
                    <thead><tr><th>رقم البطاقة</th><th>الحامل</th><th>النوع</th><th>الحالة</th></tr></thead>
                    <tbody>${member.cards.map(c => `<tr><td>${c.cardNumber}</td><td>${c.holderName}</td><td>${c.type === 'primary' ? 'رئيسية' : 'عائلة'}</td><td>${c.status}</td></tr>`).join('')}</tbody>
                </table>
            </div>

            <script>setTimeout(() => window.print(), 500);<\/script>
        </body>
        </html>
        `);
        pw.document.close();
    };

    const statusConfig: Record<string, { label: string; class: string; dotClass: string }> = {
        active: { label: 'نشط', class: 'bg-emerald-100 text-emerald-700', dotClass: 'bg-emerald-500' },
        expired: { label: 'منتهي', class: 'bg-red-100 text-red-700', dotClass: 'bg-red-500' },
        suspended: { label: 'معلق', class: 'bg-amber-100 text-amber-700', dotClass: 'bg-amber-500' },
    };

    const cardStatusConfig: Record<string, { label: string; class: string }> = {
        active: { label: 'نشطة', class: 'bg-emerald-100 text-emerald-700' },
        inactive: { label: 'غير نشطة', class: 'bg-slate-100 text-slate-600' },
        lost: { label: 'مفقودة', class: 'bg-red-100 text-red-700' },
        replaced: { label: 'مُستبدلة', class: 'bg-blue-100 text-blue-700' },
    };

    const st = statusConfig[member.status];

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <button
                onClick={() => navigate('/dashboard/members')}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-700 font-medium text-sm transition-colors"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                العودة لقائمة الأعضاء
            </button>

            {/* Member Header Card */}
            <div className={`bg-gradient-to-l ${tier.gradient} rounded-[2rem] p-6 md:p-10 text-white relative shadow-2xl shadow-${tier.name === 'gold' ? 'amber' : 'cyan'}-500/20`} style={{ transform: 'translateZ(0)' }}>
                <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
                    <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-[80px]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                    <div className="absolute top-0 right-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                </div>

                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl font-black border border-white/20">
                            {member.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black">{member.name}</h1>
                            <div className="flex items-center gap-3 mt-2">
                                <code className="text-sm bg-white/10 px-3 py-1 rounded-lg font-mono">{member.memberId}</code>
                                <span className={`text-xs font-bold px-3 py-1 rounded-lg ${st.class}`}>{st.label}</span>
                            </div>
                            <p className="text-white/70 text-sm mt-2">عضوية {tier.nameAr} • {member.city}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {permissions.canEditMember && member.status === 'active' && member.tier === 'silver' && (
                            <button
                                onClick={() => setShowUpgradeModal(true)}
                                className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                                ترقية للذهبية
                            </button>
                        )}
                        {permissions.canRenewMembership && (
                            <button
                                onClick={() => setShowRenewModal(true)}
                                className="bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border border-white/20 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                تجديد العضوية
                            </button>
                        )}
                        {permissions.canEditMember && (
                            member.status === 'active' ? (
                                <button
                                    onClick={() => suspendMember(member.id)}
                                    className="bg-red-500/20 hover:bg-red-500/30 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-red-400/30 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                    </svg>
                                    تعليق
                                </button>
                            ) : (
                                <button
                                    onClick={() => activateMember(member.id)}
                                    className="bg-emerald-500/20 hover:bg-emerald-500/30 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-emerald-400/30 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    تفعيل
                                </button>
                            )
                        )}
                        {permissions.canDeleteMember && (
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="bg-red-500/20 hover:bg-red-500/30 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-red-400/30 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                حذف
                            </button>
                        )}
                        <button
                            onClick={handlePrintReport}
                            className="bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-white/20 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            طباعة تقرير
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-3xl border border-slate-100 p-6 ">
                    <p className="text-xs text-slate-400 font-bold">إجمالي المشتريات</p>
                    <p className="text-2xl font-black text-slate-900 mt-2 font-tabular">{formatCurrency(member.totalSpent)}</p>
                </div>
                <div className="bg-white rounded-3xl border border-slate-100 p-6 ">
                    <p className="text-xs text-slate-400 font-bold">كاش باك مكتسب</p>
                    <p className="text-2xl font-black text-emerald-600 mt-2 font-tabular">{formatCurrency(member.cashbackEarned)}</p>
                </div>
                <div className="bg-white rounded-3xl border border-slate-100 p-6 ">
                    <p className="text-xs text-slate-400 font-bold">رصيد الكاش باك</p>
                    <p className="text-2xl font-black text-cyan-600 mt-2 font-tabular">{formatCurrency(member.cashbackBalance)}</p>
                </div>
                <div className="bg-white rounded-3xl border border-slate-100 p-6 ">
                    <p className="text-xs text-slate-400 font-bold">متبقي للانتهاء</p>
                    <p className={`text-2xl font-black mt-2 font-tabular ${days <= 0 ? 'text-red-500' : days <= 30 ? 'text-amber-500' : 'text-slate-900'}`}>
                        {days <= 0 ? 'منتهي' : `${days} يوم`}
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex border-b border-slate-100 bg-slate-50/50">
                    {[
                        { key: 'overview', label: 'البيانات الأساسية' },
                        { key: 'cards', label: `البطاقات (${member.cards.length})` },
                        { key: 'family', label: `أفراد العائلة (${member.familyMembers.length})` },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as typeof activeTab)}
                            className={`px-6 py-4 text-sm font-bold transition-colors border-b-2 ${activeTab === tab.key
                                ? 'text-cyan-600 border-cyan-500'
                                : 'text-slate-400 border-transparent hover:text-slate-600'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-5">
                                <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">معلومات شخصية</h3>
                                {[
                                    { label: 'الاسم الكامل', value: member.name },
                                    { label: 'رقم الجوال', value: member.phone },
                                    { label: 'البريد الإلكتروني', value: member.email },
                                    { label: 'رقم الهوية', value: member.nationalId },
                                    { label: 'المدينة', value: member.city },
                                ].map(item => (
                                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-50">
                                        <span className="text-sm text-slate-400">{item.label}</span>
                                        <span className="text-sm font-bold text-slate-800">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-5">
                                <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">تفاصيل العضوية</h3>
                                {[
                                    { label: 'نوع العضوية', value: tier.nameAr },
                                    { label: 'رسوم العضوية', value: `${tier.price} ر.س/سنوياً` },
                                    { label: 'نسبة الكاش باك', value: `${tier.cashbackRate * 100}%` },
                                    { label: 'تاريخ الانضمام', value: formatDate(member.joinDate) },
                                    { label: 'تاريخ الانتهاء', value: formatDate(member.expiryDate) },
                                    { label: 'النقاط', value: member.points.toLocaleString('ar-SA') },
                                ].map(item => (
                                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-50">
                                        <span className="text-sm text-slate-400">{item.label}</span>
                                        <span className="text-sm font-bold text-slate-800">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                            {member.notes && (
                                <div className="md:col-span-2">
                                    <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-3">ملاحظات</h3>
                                    <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl">{member.notes}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Cards Tab */}
                    {activeTab === 'cards' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-slate-400">
                                    {member.cards.length} / {tier.maxCards} بطاقات
                                </p>
                                {canIssueCard && permissions.canIssueCard && (
                                    <button
                                        onClick={() => setShowCardModal(true)}
                                        className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                        إصدار بطاقة جديدة
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {member.cards.map(card => {
                                    const cs = cardStatusConfig[card.status];
                                    return (
                                        <div key={card.id} className="border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-300">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{card.holderName}</p>
                                                    <p className="text-xs text-slate-400 mt-1">{card.type === 'primary' ? 'بطاقة رئيسية' : 'بطاقة عائلة'}</p>
                                                </div>
                                                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${cs.class}`}>{cs.label}</span>
                                            </div>
                                            <code className="text-lg font-mono text-slate-700 tracking-widest block mb-3">{card.cardNumber}</code>
                                            <div className="flex items-center justify-between text-xs text-slate-400">
                                                <span>تاريخ الإصدار: {formatDate(card.issuedDate)}</span>
                                                <span className={`font-bold ${card.tier === 'gold' ? 'text-amber-600' : 'text-slate-500'}`}>
                                                    {TIERS[card.tier].nameAr}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Family Tab */}
                    {activeTab === 'family' && (
                        <div className="space-y-4">
                            {member.familyMembers.length > 0 ? (
                                member.familyMembers.map(fm => (
                                    <div key={fm.id} className="flex items-center justify-between p-5 border border-slate-200 rounded-xl hover:shadow-md transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-lg font-black text-slate-500">
                                                {fm.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{fm.name}</p>
                                                <p className="text-xs text-slate-400">{fm.relation} • {fm.phone}</p>
                                            </div>
                                        </div>
                                        {fm.cardId && (
                                            <span className="text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg font-bold">لديه بطاقة</span>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium">لا يوجد أفراد عائلة مسجلين</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Renew Modal */}
            {showRenewModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowRenewModal(false)}>
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">تجديد العضوية</h3>
                            <p className="text-sm text-slate-500 mb-6">
                                هل تريد تجديد عضوية <strong>{member.name}</strong> ({tier.nameAr}) لمدة سنة إضافية؟
                            </p>
                            <div className="bg-slate-50 rounded-xl p-4 mb-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500">رسوم التجديد</span>
                                    <span className="text-lg font-black text-slate-900">{tier.price} ر.س</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleRenew}
                                    className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-3 rounded-xl font-bold transition-all hover:-translate-y-0.5"
                                >
                                    تأكيد التجديد
                                </button>
                                <button
                                    onClick={() => setShowRenewModal(false)}
                                    className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Issue Card Modal */}
            {showCardModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCardModal(false)}>
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-black text-slate-900 mb-6">إصدار بطاقة جديدة</h3>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">اسم حامل البطاقة</label>
                                <input
                                    type="text"
                                    value={cardHolderName}
                                    onChange={e => setCardHolderName(e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
                                    placeholder="ادخل اسم حامل البطاقة"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">نوع البطاقة</label>
                                <select
                                    value={cardType}
                                    onChange={e => setCardType(e.target.value as 'primary' | 'family')}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
                                >
                                    <option value="family">بطاقة عائلة</option>
                                    <option value="primary">بطاقة رئيسية (بدل فاقد)</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleIssueCard}
                                disabled={!cardHolderName.trim()}
                                className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-3 rounded-xl font-bold transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                            >
                                إصدار البطاقة
                            </button>
                            <button
                                onClick={() => setShowCardModal(false)}
                                className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Upgrade Modal */}
            {showUpgradeModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowUpgradeModal(false)}>
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">ترقية العضوية</h3>
                            <p className="text-sm text-slate-500 mb-6">
                                ترقية عضوية <strong>{member.name}</strong> من الفضية إلى الذهبية
                            </p>
                            <div className="bg-amber-50 rounded-xl p-4 mb-6 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-amber-700">كاش باك</span>
                                    <span className="font-bold text-amber-900">2% → 5%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-amber-700">البطاقات</span>
                                    <span className="font-bold text-amber-900">2 → 4</span>
                                </div>
                                <div className="flex justify-between text-sm border-t border-amber-200 pt-2 mt-2">
                                    <span className="text-amber-700">فرق الرسوم</span>
                                    <span className="font-black text-amber-900">200 ر.س</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleUpgrade}
                                    className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-600 text-white py-3 rounded-xl font-bold transition-all hover:-translate-y-0.5"
                                >
                                    تأكيد الترقية
                                </button>
                                <button
                                    onClick={() => setShowUpgradeModal(false)}
                                    className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteModal(false)}>
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">حذف العضو</h3>
                            <p className="text-sm text-slate-500 mb-6">
                                هل أنت متأكد من حذف <strong>{member.name}</strong>؟ هذا الإجراء لا يمكن التراجع عنه.
                            </p>
                            <div className="bg-red-50 rounded-xl p-3 mb-6 text-xs text-red-600 font-medium text-right">
                                ⚠️ سيتم حذف جميع بيانات العضو والبطاقات وسجل العمليات
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition-all"
                                >
                                    حذف نهائياً
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemberDetailPage;
