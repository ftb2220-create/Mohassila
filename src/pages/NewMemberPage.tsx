import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMembers } from '../contexts/MembersContext';
import { useAuth } from '../contexts/AuthContext';
import { SAUDI_CITIES } from '../types';
import type { TierType } from '../types';
import { getPermissions } from '../utils/permissions';

const NewMemberPage: React.FC = () => {
    const { addMember } = useMembers();
    const { employee } = useAuth();
    const navigate = useNavigate();
    const permissions = getPermissions(employee?.role);

    if (!permissions.canAddMember) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-black text-slate-900">لا تملك صلاحية الوصول</h2>
                    <p className="text-sm text-slate-500 mt-2">هذه الصفحة متاحة فقط للمدير والمشرف</p>
                    <button onClick={() => navigate('/dashboard')} className="mt-4 text-cyan-500 font-bold text-sm hover:text-cyan-600 transition-colors">← العودة للوحة التحكم</button>
                </div>
            </div>
        );
    }

    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        nationalId: '',
        tier: 'silver' as TierType,
        city: 'الرياض',
        notes: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.name.trim()) errs.name = 'الاسم مطلوب';
        if (!form.phone.trim()) errs.phone = 'رقم الجوال مطلوب';
        else if (!/^05\d{8}$/.test(form.phone)) errs.phone = 'صيغة الجوال غير صحيحة (05XXXXXXXX)';
        if (!form.email.trim()) errs.email = 'البريد الإلكتروني مطلوب';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'صيغة البريد غير صحيحة';
        if (!form.nationalId.trim()) errs.nationalId = 'رقم الهوية مطلوب';
        else if (!/^[12]\d{9}$/.test(form.nationalId)) errs.nationalId = 'رقم الهوية يجب أن يبدأ بـ 1 أو 2 ويتكون من 10 أرقام';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        const today = new Date().toISOString().split('T')[0];
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);

        try {
            const newMember = await addMember({
                name: form.name.trim(),
                phone: form.phone.trim(),
                email: form.email.trim(),
                nationalId: form.nationalId.trim(),
                tier: form.tier,
                status: 'active',
                joinDate: today,
                expiryDate: expiryDate.toISOString().split('T')[0],
                notes: form.notes.trim(),
                city: form.city,
                createdBy: employee?.id || '',
            }, employee?.name);

            setLoading(false);
            setSuccess(true);
            setTimeout(() => {
                navigate(`/dashboard/members/${newMember.id}`);
            }, 1500);
        } catch (error) {
            console.error('Error adding member:', error);
            setLoading(false);
            setErrors({ name: 'حدث خطأ أثناء إضافة العضو. حاول مرة أخرى' });
        }
    };

    const tierOptions = [
        {
            value: 'silver' as TierType,
            label: 'الفضية',
            price: '199 ر.س / سنوياً',
            features: ['بطاقتين عضوية', 'كاش باك 2%', 'أسعار جملة'],
            gradient: 'from-slate-600 to-slate-800',
            border: 'border-slate-300',
            selected: 'ring-slate-500',
        },
        {
            value: 'gold' as TierType,
            label: 'الذهبية',
            price: '399 ر.س / سنوياً',
            features: ['4 بطاقات عضوية', 'كاش باك 5%', 'توصيل مجاني', 'VIP', 'أسعار جملة'],
            gradient: 'from-amber-700 via-amber-600 to-yellow-700',
            border: 'border-yellow-600/50',
            selected: 'ring-yellow-600',
        },
    ];

    if (success) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center hero-fade-in">
                    <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">تم التسجيل بنجاح! 🎉</h2>
                    <p className="text-sm text-slate-500 mt-2">جاري التحويل لصفحة العضو...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">تسجيل عضو جديد</h1>
                    <p className="text-sm text-slate-400 mt-1">أضف عضو جديد لنظام محصّلة</p>
                </div>
                <button
                    onClick={() => navigate('/dashboard/members')}
                    className="text-slate-500 hover:text-slate-700 font-medium text-sm flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    العودة
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tier Selection */}
                <div className="bg-white rounded-3xl border border-slate-100 p-8  shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6 text-lg">اختر نوع العضوية</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {tierOptions.map(option => (
                            <div
                                key={option.value}
                                onClick={() => setForm(f => ({ ...f, tier: option.value }))}
                                className={`border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 ${form.tier === option.value
                                    ? `${option.border} ring-2 ${option.selected} shadow-lg`
                                    : 'border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-10 h-10 bg-gradient-to-br ${option.gradient} rounded-xl flex items-center justify-center text-white text-sm font-black`}>
                                        {option.value === 'gold' ? 'G' : 'S'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">{option.label}</p>
                                        <p className="text-xs text-slate-400">{option.price}</p>
                                    </div>
                                </div>
                                <ul className="space-y-1.5">
                                    {option.features.map((f, i) => (
                                        <li key={i} className="text-xs text-slate-500 flex items-center gap-2">
                                            <svg className="w-3 h-3 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Personal Info */}
                <div className="bg-white rounded-3xl border border-slate-100 p-8  shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-8 text-lg">البيانات الشخصية</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">الاسم الكامل *</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                className={`w-full bg-slate-50/50 border rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-4 transition-all ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-cyan-500 focus:ring-cyan-500/10'
                                    }`}
                                placeholder="الاسم الرباعي"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.name}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">رقم الجوال *</label>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                className={`w-full bg-slate-50/50 border rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-4 transition-all font-mono ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-cyan-500 focus:ring-cyan-500/10'
                                    }`}
                                placeholder="05XXXXXXXX"
                                dir="ltr"
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.phone}</p>}
                        </div>

                        {/* National ID */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">رقم الهوية *</label>
                            <input
                                type="text"
                                value={form.nationalId}
                                onChange={e => setForm(f => ({ ...f, nationalId: e.target.value }))}
                                className={`w-full bg-slate-50/50 border rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-4 transition-all font-mono ${errors.nationalId ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-cyan-500 focus:ring-cyan-500/10'
                                    }`}
                                placeholder="1XXXXXXXXX"
                                dir="ltr"
                            />
                            {errors.nationalId && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.nationalId}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني *</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                className={`w-full bg-slate-50/50 border rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-4 transition-all font-mono ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-cyan-500 focus:ring-cyan-500/10'
                                    }`}
                                placeholder="example@email.com"
                                dir="ltr"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.email}</p>}
                        </div>

                        {/* City */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">المدينة</label>
                            <select
                                value={form.city}
                                onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all font-bold"
                            >
                                {SAUDI_CITIES.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        {/* Notes */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">ملاحظات</label>
                            <textarea
                                value={form.notes}
                                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all resize-none"
                                rows={3}
                                placeholder="ملاحظات إضافية (اختياري)"
                            />
                        </div>
                    </div>
                </div>

                {/* Summary & Submit */}
                <div className="bg-white rounded-3xl border border-slate-100 p-8  shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6 text-lg">ملخص التسجيل</h3>
                    <div className="bg-slate-50/80 rounded-2xl p-6 mb-8 space-y-4 border border-slate-100">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500 font-bold">نوع العضوية</span>
                            <span className="font-black text-slate-800">{form.tier === 'gold' ? 'الذهبية' : 'الفضية'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500 font-bold">رسوم العضوية</span>
                            <span className="font-black text-slate-800 font-tabular">{form.tier === 'gold' ? '399' : '199'} ر.س</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500 font-bold">مدة العضوية</span>
                            <span className="font-black text-slate-800">سنة واحدة</span>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-black py-4 rounded-2xl text-lg flex items-center justify-center gap-3 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/30 disabled:opacity-70 disabled:cursor-not-allowed group"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                جاري إضافة العضو...
                            </>
                        ) : (
                            <>
                                <span>إصدار العضوية وإرسال رسالة التفعيل</span>
                                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewMemberPage;
