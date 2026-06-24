import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMembers } from '../contexts/MembersContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { TIERS, SAUDI_CITIES } from '../types';
import type { TierType } from '../types';
import { formatCurrency, formatDate, daysUntilExpiry } from '../data/mockData';
import { getPermissions } from '../utils/permissions';

const MemberDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getMember, renewMembership, issueCard, suspendMember, activateMember, updateMember, deleteMember, transactions } = useMembers();
    const { employee } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const permissions = getPermissions(employee?.role);
    const member = getMember(id || '');

    const [showRenewModal, setShowRenewModal] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [cardHolderName, setCardHolderName] = useState('');
    const [cardType, setCardType] = useState<'primary' | 'family'>('family');
    const [activeTab, setActiveTab] = useState<'overview' | 'cards' | 'family' | 'transactions'>('overview');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Family member states
    const [showFamilyModal, setShowFamilyModal] = useState(false);
    const [editingFamilyMember, setEditingFamilyMember] = useState<any | null>(null);
    const [familyForm, setFamilyForm] = useState({ name: '', relation: '', phone: '' });
    const [familyErrors, setFamilyErrors] = useState<{ name?: string; relation?: string; phone?: string }>({});
    const [familyLoading, setFamilyLoading] = useState(false);

    // Member notes log states
    const [newNoteText, setNewNoteText] = useState('');
    const [noteLoading, setNoteLoading] = useState(false);

    // Edit mode state
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', phone: '', email: '', city: '', notes: '' });
    const [editErrors, setEditErrors] = useState<{ name?: string; phone?: string; email?: string }>({});
    const [editLoading, setEditLoading] = useState(false);

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

    const handleRenew = async () => {
        try {
            await renewMembership(member.id, employee?.id || '', employee?.name);
            setShowRenewModal(false);
        } catch (error) {
            console.error('Error renewing membership:', error);
        }
    };

    const handleIssueCard = async () => {
        if (cardHolderName.trim()) {
            try {
                await issueCard(member.id, cardHolderName.trim(), cardType, employee?.name);
                setCardHolderName('');
                setShowCardModal(false);
            } catch (error) {
                console.error('Error issuing card:', error);
            }
        }
    };

    const handleUpgrade = async () => {
        try {
            await updateMember(member.id, {
                tier: 'gold' as TierType,
                cards: member.cards.map(c => ({ ...c, tier: 'gold' as TierType })),
            });
            setShowUpgradeModal(false);
        } catch (error) {
            console.error('Error upgrading member:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteMember(member.id, employee?.name);
            navigate('/dashboard/members');
        } catch (error) {
            console.error('Error deleting member:', error);
        }
    };
    const handleStartEdit = () => {
        setEditForm({
            name: member.name,
            phone: member.phone,
            email: member.email,
            city: member.city,
            notes: member.notes || '',
        });
        setEditErrors({});
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditErrors({});
    };

    const handleSaveEdit = async () => {
        // Validate
        const errors: { name?: string; phone?: string; email?: string } = {};
        if (!editForm.name.trim()) {
            errors.name = 'الاسم مطلوب';
        }
        if (editForm.phone && !/^05\d{8}$/.test(editForm.phone)) {
            errors.phone = 'رقم الجوال يجب أن يكون بصيغة 05XXXXXXXX';
        }
        if (editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
            errors.email = 'البريد الإلكتروني غير صالح';
        }
        if (Object.keys(errors).length > 0) {
            setEditErrors(errors);
            return;
        }
        setEditErrors({});
        setEditLoading(true);
        try {
            await updateMember(member.id, {
                name: editForm.name.trim(),
                phone: editForm.phone.trim(),
                email: editForm.email.trim(),
                city: editForm.city,
                notes: editForm.notes.trim(),
            });
            showToast('تم تحديث بيانات العضو بنجاح', 'success');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating member:', error);
            showToast('حدث خطأ أثناء تحديث البيانات', 'error');
        } finally {
            setEditLoading(false);
        }
    };

    const handleOpenFamilyModal = (fm?: any) => {
        if (fm) {
            setEditingFamilyMember(fm);
            setFamilyForm({ name: fm.name, relation: fm.relation, phone: fm.phone || '' });
        } else {
            setEditingFamilyMember(null);
            setFamilyForm({ name: '', relation: '', phone: '' });
        }
        setFamilyErrors({});
        setShowFamilyModal(true);
    };

    const handleSaveFamilyMember = async () => {
        const errors: { name?: string; relation?: string; phone?: string } = {};
        if (!familyForm.name.trim()) {
            errors.name = 'الاسم مطلوب';
        }
        if (!familyForm.relation.trim()) {
            errors.relation = 'صلة القرابة مطلوبة';
        }
        if (familyForm.phone && !/^05\d{8}$/.test(familyForm.phone)) {
            errors.phone = 'رقم الجوال يجب أن يكون بصيغة 05XXXXXXXX';
        }

        if (Object.keys(errors).length > 0) {
            setFamilyErrors(errors);
            return;
        }

        setFamilyLoading(true);
        try {
            let updatedFamily = [...(member.familyMembers || [])];
            if (editingFamilyMember) {
                updatedFamily = updatedFamily.map(f => f.id === editingFamilyMember.id ? { ...f, ...familyForm } : f);
            } else {
                const newFm = {
                    id: Math.random().toString(36).substring(2, 9),
                    name: familyForm.name.trim(),
                    relation: familyForm.relation.trim(),
                    phone: familyForm.phone.trim(),
                };
                updatedFamily.push(newFm);
            }
            await updateMember(member.id, { familyMembers: updatedFamily });
            showToast(editingFamilyMember ? 'تم تحديث بيانات فرد العائلة بنجاح' : 'تم إضافة فرد العائلة بنجاح', 'success');
            setShowFamilyModal(false);
        } catch (error) {
            console.error('Error saving family member:', error);
            showToast('حدث خطأ أثناء حفظ البيانات', 'error');
        } finally {
            setFamilyLoading(false);
        }
    };

    const handleDeleteFamilyMember = async (fmId: string) => {
        if (!window.confirm('هل أنت متأكد من حذف فرد العائلة هذا؟')) return;
        try {
            const updatedFamily = (member.familyMembers || []).filter(f => f.id !== fmId);
            await updateMember(member.id, { familyMembers: updatedFamily });
            showToast('تم حذف فرد العائلة بنجاح', 'success');
        } catch (error) {
            console.error('Error deleting family member:', error);
            showToast('حدث خطأ أثناء الحذف', 'error');
        }
    };

    const handleAddNoteLog = async () => {
        if (!newNoteText.trim()) return;
        setNoteLoading(true);
        try {
            const newEntry = {
                id: Math.random().toString(36).substring(2, 9),
                text: newNoteText.trim(),
                date: new Date().toISOString(),
                author: employee?.name || 'موظف',
            };
            const updatedLog = [newEntry, ...(member.notesLog || [])];
            await updateMember(member.id, { notesLog: updatedLog });
            setNewNoteText('');
            showToast('تم إضافة الملاحظة بنجاح', 'success');
        } catch (error) {
            console.error('Error adding note log:', error);
            showToast('حدث خطأ أثناء إضافة الملاحظة', 'error');
        } finally {
            setNoteLoading(false);
        }
    };

    const handleDeleteNoteLog = async (noteId: string) => {
        if (!window.confirm('هل أنت متأكد من حذف هذه الملاحظة؟')) return;
        try {
            const updatedLog = (member.notesLog || []).filter(n => n.id !== noteId);
            await updateMember(member.id, { notesLog: updatedLog });
            showToast('تم حذف الملاحظة بنجاح', 'success');
        } catch (error) {
            console.error('Error deleting note log:', error);
            showToast('حدث خطأ أثناء حذف الملاحظة', 'error');
        }
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
    const memberTransactions = (transactions || []).filter(t => t.memberId === member.id);

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <button
                onClick={() => navigate('/dashboard/members')}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium text-sm transition-colors"
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
                        {permissions.canEditMember && (
                            <button
                                onClick={handleStartEdit}
                                className="bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border border-white/20 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                تعديل البيانات
                            </button>
                        )}
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
                                    onClick={async () => { try { await suspendMember(member.id, employee?.name); } catch (err) { console.error(err); } }}
                                    className="bg-red-500/20 hover:bg-red-500/30 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-red-400/30 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                    </svg>
                                    تعليق
                                </button>
                            ) : (
                                <button
                                    onClick={async () => { try { await activateMember(member.id, employee?.name); } catch (err) { console.error(err); } }}
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
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 ">
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-bold">إجمالي المشتريات</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-tabular">{formatCurrency(member.totalSpent)}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 ">
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-bold">كاش باك مكتسب</p>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2 font-tabular">{formatCurrency(member.cashbackEarned)}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 ">
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-bold">رصيد الكاش باك</p>
                    <p className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-2 font-tabular">{formatCurrency(member.cashbackBalance)}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 ">
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-bold">متبقي للانتهاء</p>
                    <p className={`text-2xl font-black mt-2 font-tabular ${days <= 0 ? 'text-red-500' : days <= 30 ? 'text-amber-500' : 'text-slate-900 dark:text-white'}`}>
                        {days <= 0 ? 'منتهي' : `${days} يوم`}
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20">
                    {[
                        { key: 'overview', label: 'البيانات الأساسية' },
                        { key: 'cards', label: `البطاقات (${member.cards.length})` },
                        { key: 'family', label: `أفراد العائلة (${member.familyMembers.length})` },
                        { key: 'transactions', label: `العمليات (${memberTransactions.length})` },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as typeof activeTab)}
                            className={`px-6 py-4 text-sm font-bold transition-colors border-b-2 ${activeTab === tab.key
                                ? 'text-cyan-600 border-cyan-500'
                                : 'text-slate-400 border-transparent hover:text-slate-600 dark:hover:text-slate-200'
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
                                <h3 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">معلومات شخصية</h3>
                                {isEditing ? (
                                    <div className="space-y-4">
                                        {/* Name */}
                                        <div>
                                            <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-1.5">الاسم الكامل</label>
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                                className={`w-full border rounded-xl px-4 py-3 text-sm font-bold bg-white dark:bg-slate-800 dark:text-white text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                                                    editErrors.name
                                                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                                                        : 'border-slate-200 dark:border-slate-600 focus:border-cyan-500 focus:ring-cyan-500/10'
                                                }`}
                                                placeholder="ادخل الاسم الكامل"
                                            />
                                            {editErrors.name && <p className="text-xs text-red-500 font-bold mt-1">{editErrors.name}</p>}
                                        </div>
                                        {/* Phone */}
                                        <div>
                                            <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-1.5">رقم الجوال</label>
                                            <input
                                                type="text"
                                                value={editForm.phone}
                                                onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                                className={`w-full border rounded-xl px-4 py-3 text-sm font-bold bg-white dark:bg-slate-800 dark:text-white text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                                                    editErrors.phone
                                                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                                                        : 'border-slate-200 dark:border-slate-600 focus:border-cyan-500 focus:ring-cyan-500/10'
                                                }`}
                                                placeholder="05XXXXXXXX"
                                                dir="ltr"
                                            />
                                            {editErrors.phone && <p className="text-xs text-red-500 font-bold mt-1">{editErrors.phone}</p>}
                                        </div>
                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-1.5">البريد الإلكتروني</label>
                                            <input
                                                type="email"
                                                value={editForm.email}
                                                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                                className={`w-full border rounded-xl px-4 py-3 text-sm font-bold bg-white dark:bg-slate-800 dark:text-white text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                                                    editErrors.email
                                                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                                                        : 'border-slate-200 dark:border-slate-600 focus:border-cyan-500 focus:ring-cyan-500/10'
                                                }`}
                                                placeholder="example@email.com"
                                                dir="ltr"
                                            />
                                            {editErrors.email && <p className="text-xs text-red-500 font-bold mt-1">{editErrors.email}</p>}
                                        </div>
                                        {/* City */}
                                        <div>
                                            <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-1.5">المدينة</label>
                                            <select
                                                value={editForm.city}
                                                onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                                                className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm font-bold bg-white dark:bg-slate-800 dark:text-white text-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all"
                                            >
                                                <option value="">اختر المدينة</option>
                                                {SAUDI_CITIES.map(city => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {/* National ID (read-only) */}
                                        <div className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-700">
                                            <span className="text-sm text-slate-400 dark:text-slate-500">رقم الهوية</span>
                                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{member.nationalId}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {[
                                            { label: 'الاسم الكامل', value: member.name },
                                            { label: 'رقم الجوال', value: member.phone },
                                            { label: 'البريد الإلكتروني', value: member.email },
                                            { label: 'رقم الهوية', value: member.nationalId },
                                            { label: 'المدينة', value: member.city },
                                        ].map(item => (
                                            <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-700">
                                                <span className="text-sm text-slate-400 dark:text-slate-500">{item.label}</span>
                                                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.value}</span>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                            <div className="space-y-5">
                                <h3 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">تفاصيل العضوية</h3>
                                {[
                                    { label: 'نوع العضوية', value: tier.nameAr },
                                    { label: 'رسوم العضوية', value: `${tier.price} ر.س/سنوياً` },
                                    { label: 'نسبة الكاش باك', value: `${tier.cashbackRate * 100}%` },
                                    { label: 'تاريخ الانضمام', value: formatDate(member.joinDate) },
                                    { label: 'تاريخ الانتهاء', value: formatDate(member.expiryDate) },
                                    { label: 'النقاط', value: member.points.toLocaleString('ar-SA') },
                                ].map(item => (
                                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-700">
                                        <span className="text-sm text-slate-400 dark:text-slate-500">{item.label}</span>
                                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                            {/* Notes section */}
                            {isEditing ? (
                                <div className="md:col-span-2">
                                    <h3 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-3">ملاحظات</h3>
                                    <textarea
                                        value={editForm.notes}
                                        onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                                        rows={4}
                                        className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm font-bold bg-white dark:bg-slate-800 dark:text-white text-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all resize-none"
                                        placeholder="أضف ملاحظات عن العضو..."
                                    />
                                </div>
                            ) : (
                                <>
                                    {member.notes && (
                                        <div className="md:col-span-2">
                                            <h3 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-3">ملاحظات</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">{member.notes}</p>
                                        </div>
                                    )}

                                    {/* Chronological Notes Log */}
                                    <div className="md:col-span-2 border-t border-slate-100 dark:border-slate-700 pt-6 mt-6">
                                        <h3 className="text-base font-black text-slate-900 dark:text-white mb-6">سجل الملاحظات والتعليقات</h3>
                                        
                                        {/* Add note input */}
                                        <div className="flex gap-3 mb-6">
                                            <input
                                                type="text"
                                                value={newNoteText}
                                                onChange={e => setNewNoteText(e.target.value)}
                                                placeholder="اكتب ملاحظة أو تعليق جديد (مثال: تم التواصل للتجديد)..."
                                                className="flex-1 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm bg-white dark:bg-slate-805 dark:text-white text-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all font-medium"
                                            />
                                            <button
                                                onClick={handleAddNoteLog}
                                                disabled={noteLoading || !newNoteText.trim()}
                                                className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0 shrink-0"
                                            >
                                                إضافة ملاحظة
                                            </button>
                                        </div>

                                        {/* Timeline list */}
                                        {(member.notesLog || []).length > 0 ? (
                                            <div className="relative border-r-2 border-slate-100 dark:border-slate-700/60 mr-3 pr-6 space-y-5">
                                                {(member.notesLog || []).map(note => (
                                                    <div key={note.id} className="relative group/note">
                                                        {/* Dot indicator */}
                                                        <div className="absolute top-1 -right-[31px] w-4.5 h-4.5 bg-cyan-50 dark:bg-cyan-950/20 border-2 border-cyan-500 rounded-full flex items-center justify-center">
                                                            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                                                        </div>
                                                        <div className="bg-slate-50/50 dark:bg-slate-800/40 p-4 rounded-xl relative hover:shadow-sm transition-shadow">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">{note.author}</span>
                                                                    <span className="text-[10px] text-slate-350 dark:text-slate-550">•</span>
                                                                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{new Date(note.date).toLocaleString('ar-SA')}</span>
                                                                </div>
                                                                {permissions.canEditMember && (
                                                                    <button
                                                                        onClick={() => handleDeleteNoteLog(note.id)}
                                                                        className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors opacity-0 group-hover/note:opacity-100 p-1 rounded-lg"
                                                                        title="حذف الملاحظة"
                                                                    >
                                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                        </svg>
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-[1.6]">{note.text}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-400 dark:text-slate-500 italic pr-3">لا توجد ملاحظات مسجلة في السجل التاريخي بعد.</p>
                                        )}
                                    </div>
                                </>
                            )}
                            {/* Save / Cancel buttons */}
                            {isEditing && (
                                <div className="md:col-span-2 flex gap-3 pt-2">
                                    <button
                                        onClick={handleSaveEdit}
                                        disabled={editLoading}
                                        className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-3 rounded-xl font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                                    >
                                        {editLoading ? (
                                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                        {editLoading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        disabled={editLoading}
                                        className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 py-3 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all disabled:opacity-50"
                                    >
                                        إلغاء
                                    </button>
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
                                        <div key={card.id} className="border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 dark:bg-slate-800/40">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{card.holderName}</p>
                                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{card.type === 'primary' ? 'بطاقة رئيسية' : 'بطاقة عائلة'}</p>
                                                </div>
                                                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${cs.class}`}>{cs.label}</span>
                                            </div>
                                            <code className="text-lg font-mono text-slate-700 dark:text-slate-350 tracking-widest block mb-3">{card.cardNumber}</code>
                                            <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                                                <span>تاريخ الإصدار: {formatDate(card.issuedDate)}</span>
                                                <span className={`font-bold ${card.tier === 'gold' ? 'text-amber-600' : 'text-slate-500 dark:text-slate-400'}`}>
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
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-slate-400">
                                    أفراد العائلة المسجلين: {member.familyMembers?.length || 0}
                                </p>
                                {permissions.canEditMember && (
                                    <button
                                        onClick={() => handleOpenFamilyModal()}
                                        className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                        إضافة فرد عائلة
                                    </button>
                                )}
                            </div>

                            {(member.familyMembers || []).length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {(member.familyMembers || []).map(fm => (
                                        <div key={fm.id} className="flex items-center justify-between p-5 border border-slate-200 dark:border-slate-700 rounded-2xl hover:shadow-md transition-all dark:bg-slate-800/40">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center text-lg font-black text-slate-500 dark:text-slate-400">
                                                    {fm.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{fm.name}</p>
                                                    <p className="text-xs text-slate-400 dark:text-slate-500">{fm.relation} {fm.phone ? `• ${fm.phone}` : ''}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {fm.cardId && (
                                                    <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20 px-2.5 py-1.5 rounded-lg font-bold">لديه بطاقة</span>
                                                )}
                                                {permissions.canEditMember && (
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => handleOpenFamilyModal(fm)}
                                                            className="text-slate-400 dark:text-slate-500 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors p-1.5 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-950/20"
                                                            title="تعديل فرد العائلة"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteFamilyMember(fm.id)}
                                                            className="text-slate-350 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
                                                            title="حذف فرد العائلة"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-8 h-8 text-slate-300 dark:text-slate-650" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">لا يوجد أفراد عائلة مسجلين</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Transactions Tab */}
                    {activeTab === 'transactions' && (
                        <div className="space-y-4">
                            {memberTransactions.length > 0 ? (
                                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-slate-50/80 dark:bg-slate-700/50 backdrop-blur-sm border-b border-slate-100 dark:border-slate-700">
                                                    <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">النوع</th>
                                                    <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">الوصف</th>
                                                    <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">المبلغ</th>
                                                    <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">كاش باك</th>
                                                    <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">التاريخ</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50 dark:divide-slate-700 relative">
                                                {memberTransactions.map((trx, index) => {
                                                    const typeLabels: Record<string, { label: string; class: string }> = {
                                                        purchase: { label: 'شراء', class: 'bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400' },
                                                        renewal: { label: 'تجديد', class: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400' },
                                                        cashback: { label: 'كاش باك', class: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400' },
                                                        refund: { label: 'استرجاع', class: 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400' },
                                                    };
                                                    const tl = typeLabels[trx.type] || { label: trx.type, class: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-350' };
                                                    return (
                                                        <tr key={trx.id} className="hover:bg-cyan-50/30 dark:hover:bg-slate-700/30 transition-colors group relative" style={{ animationDelay: `${index * 30}ms` }}>
                                                            <td className="px-6 py-4 relative">
                                                                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg ${tl.class}`}>
                                                                    {tl.label}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <p className="text-sm text-slate-500 dark:text-slate-400">{trx.description}</p>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <p className={`text-sm font-black font-tabular ${trx.type === 'refund' ? 'text-red-500' : 'text-slate-800 dark:text-slate-200'}`}>
                                                                    {trx.type === 'refund' ? '-' : ''}{formatCurrency(trx.amount)}
                                                                </p>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <p className={`text-sm font-bold ${trx.cashback > 0 ? 'text-emerald-600 dark:text-emerald-450' : trx.cashback < 0 ? 'text-red-500' : 'text-slate-300 dark:text-slate-650'}`}>
                                                                    {trx.cashback !== 0 ? formatCurrency(Math.abs(trx.cashback)) : '—'}
                                                                </p>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(trx.date)}</p>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-8 h-8 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                        </svg>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">لا توجد عمليات مسجلة للعضو بعد</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Renew Modal */}
            {showRenewModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowRenewModal(false)}>
                    <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-cyan-50 dark:bg-cyan-950/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-cyan-500 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">تجديد العضوية</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                هل تريد تجديد عضوية <strong>{member.name}</strong> ({tier.nameAr}) لمدة سنة إضافية؟
                            </p>
                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 mb-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500 dark:text-slate-400">رسوم التجديد</span>
                                    <span className="text-lg font-black text-slate-900 dark:text-white">{tier.price} ر.س</span>
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
                                    className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 py-3 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
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
                    <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">إصدار بطاقة جديدة</h3>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">اسم حامل البطاقة</label>
                                <input
                                    type="text"
                                    value={cardHolderName}
                                    onChange={e => setCardHolderName(e.target.value)}
                                    className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 bg-white dark:bg-slate-900/50 dark:text-white"
                                    placeholder="ادخل اسم حامل البطاقة"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">نوع البطاقة</label>
                                <select
                                    value={cardType}
                                    onChange={e => setCardType(e.target.value as 'primary' | 'family')}
                                    className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 bg-white dark:bg-slate-900/50 dark:text-white"
                                >
                                    <option value="family" className="dark:bg-slate-800">بطاقة عائلة</option>
                                    <option value="primary" className="dark:bg-slate-800">بطاقة رئيسية (بدل فاقد)</option>
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
                                className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 py-3 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
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
                    <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-amber-500 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">ترقية العضوية</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                ترقية عضوية <strong>{member.name}</strong> من الفضية إلى الذهبية
                            </p>
                            <div className="bg-amber-50 dark:bg-amber-950/25 border dark:border-amber-900/30 rounded-xl p-4 mb-6 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-amber-700 dark:text-amber-400">كاش باك</span>
                                    <span className="font-bold text-amber-900 dark:text-amber-300">2% إلى 5%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-amber-700 dark:text-amber-400">البطاقات</span>
                                    <span className="font-bold text-amber-900 dark:text-amber-300">2 إلى 4</span>
                                </div>
                                <div className="flex justify-between text-sm border-t border-amber-200 dark:border-amber-900/40 pt-2 mt-2">
                                    <span className="text-amber-700 dark:text-amber-400 font-bold">فرق الرسوم</span>
                                    <span className="font-black text-amber-900 dark:text-amber-300">200 ر.س</span>
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
                                    className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 py-3 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
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
                    <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-50 dark:bg-red-950/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">حذف العضو</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                هل أنت متأكد من حذف <strong>{member.name}</strong>؟ هذا الإجراء لا يمكن التراجع عنه.
                            </p>
                            <div className="bg-red-50 dark:bg-red-950/20 border dark:border-red-900/30 rounded-xl p-3 mb-6 text-xs text-red-600 dark:text-red-400 font-medium text-right">
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

            {/* Add/Edit Family Member Modal */}
            {showFamilyModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowFamilyModal(false)}>
                    <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">
                            {editingFamilyMember ? 'تعديل بيانات فرد العائلة' : 'إضافة فرد عائلة جديد'}
                        </h3>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الاسم الكامل</label>
                                <input
                                    type="text"
                                    value={familyForm.name}
                                    onChange={e => setFamilyForm({ ...familyForm, name: e.target.value })}
                                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 bg-white dark:bg-slate-900/50 dark:text-white ${
                                        familyErrors.name
                                            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                                            : 'border-slate-200 dark:border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/10'
                                    }`}
                                    placeholder="ادخل الاسم الكامل"
                                />
                                {familyErrors.name && <p className="text-xs text-red-500 font-bold mt-1">{familyErrors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">صلة القرابة</label>
                                <select
                                    value={familyForm.relation}
                                    onChange={e => setFamilyForm({ ...familyForm, relation: e.target.value })}
                                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 bg-white dark:bg-slate-900/50 dark:text-white ${
                                        familyErrors.relation
                                            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                                            : 'border-slate-200 dark:border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/10'
                                    }`}
                                >
                                    <option value="" className="dark:bg-slate-800">اختر الصلة</option>
                                    <option value="زوجة" className="dark:bg-slate-800">زوجة</option>
                                    <option value="زوج" className="dark:bg-slate-800">زوج</option>
                                    <option value="ابن" className="dark:bg-slate-800">ابن</option>
                                    <option value="ابنة" className="dark:bg-slate-800">ابنة</option>
                                    <option value="أب" className="dark:bg-slate-800">أب</option>
                                    <option value="أم" className="dark:bg-slate-800">أم</option>
                                    <option value="أخ" className="dark:bg-slate-800">أخ</option>
                                    <option value="أخت" className="dark:bg-slate-800">أخت</option>
                                </select>
                                {familyErrors.relation && <p className="text-xs text-red-500 font-bold mt-1">{familyErrors.relation}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">رقم الجوال (اختياري)</label>
                                <input
                                    type="text"
                                    value={familyForm.phone}
                                    onChange={e => setFamilyForm({ ...familyForm, phone: e.target.value })}
                                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 bg-white dark:bg-slate-900/50 dark:text-white ${
                                        familyErrors.phone
                                            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                                            : 'border-slate-200 dark:border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/10'
                                    }`}
                                    placeholder="05XXXXXXXX"
                                    dir="ltr"
                                />
                                {familyErrors.phone && <p className="text-xs text-red-500 font-bold mt-1">{familyErrors.phone}</p>}
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleSaveFamilyMember}
                                disabled={familyLoading}
                                className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-3 rounded-xl font-bold transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                            >
                                {familyLoading && (
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                )}
                                {familyLoading ? 'جاري الحفظ...' : 'حفظ'}
                            </button>
                            <button
                                onClick={() => setShowFamilyModal(false)}
                                disabled={familyLoading}
                                className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 py-3 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all disabled:opacity-50"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemberDetailPage;
