import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMembers } from '../contexts/MembersContext';
import { useAuth } from '../contexts/AuthContext';
import { TIERS } from '../types';
import { formatDate } from '../data/mockData';
import { getPermissions } from '../utils/permissions';

const CardsPage: React.FC = () => {
    const { members } = useMembers();
    const { employee } = useAuth();
    const navigate = useNavigate();
    const permissions = getPermissions(employee?.role);

    if (!permissions.canManageCards) {
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
    const [search, setSearch] = useState('');
    const [selectedCard, setSelectedCard] = useState<string | null>(null);
    const [filterTier, setFilterTier] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const printRef = useRef<HTMLDivElement>(null);

    // Collect all cards with member info
    const allCards = members.flatMap(m =>
        m.cards.map(c => ({
            ...c,
            memberName: m.name,
            memberId: m.memberId,
            memberStatus: m.status,
            expiryDate: m.expiryDate,
        }))
    );

    let filteredCards = allCards;
    if (search) {
        const q = search.toLowerCase();
        filteredCards = filteredCards.filter(c =>
            c.holderName.toLowerCase().includes(q) ||
            c.cardNumber.includes(q) ||
            c.memberName.toLowerCase().includes(q)
        );
    }
    if (filterTier !== 'all') {
        filteredCards = filteredCards.filter(c => c.tier === filterTier);
    }
    if (filterStatus !== 'all') {
        filteredCards = filteredCards.filter(c => c.status === filterStatus);
    }

    const cardStatusConfig: Record<string, { label: string; class: string }> = {
        active: { label: 'نشطة', class: 'bg-emerald-100 text-emerald-700' },
        inactive: { label: 'غير نشطة', class: 'bg-slate-100 text-slate-600' },
        lost: { label: 'مفقودة', class: 'bg-red-100 text-red-700' },
        replaced: { label: 'مُستبدلة', class: 'bg-blue-100 text-blue-700' },
    };

    const handlePrint = () => {
        if (!selectedCard) return;
        const card = allCards.find(c => c.id === selectedCard);
        if (!card) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const tierGrad = card.tier === 'gold'
            ? 'linear-gradient(135deg, #B8860B, #8B6508)'
            : 'linear-gradient(135deg, #475569, #1E293B)';

        printWindow.document.write(`
      <html dir="rtl">
      <head>
        <title>بطاقة عضوية - ${card.holderName}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700;900&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Noto Sans Arabic', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f1f5f9; }
          .card { width: 340px; height: 200px; border-radius: 16px; padding: 24px; background: ${tierGrad}; color: white; position: relative; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
          .card::before { content: ''; position: absolute; top: -60px; right: -60px; width: 160px; height: 160px; background: rgba(255,255,255,0.08); border-radius: 50%; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
          .logo { font-weight: 900; font-size: 14px; }
          .badge { font-size: 9px; font-weight: 900; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 8px; letter-spacing: 1px; }
          .name-label { font-size: 9px; opacity: 0.5; text-transform: uppercase; font-weight: 700; margin-bottom: 2px; }
          .name { font-size: 16px; font-weight: 700; }
          .bottom { display: flex; justify-content: space-between; align-items: flex-end; position: absolute; bottom: 24px; left: 24px; right: 24px; }
          .field { }
          .field-label { font-size: 9px; opacity: 0.5; text-transform: uppercase; font-weight: 700; margin-bottom: 2px; }
          .field-value { font-size: 12px; opacity: 0.9; font-family: monospace; }
          @media print { body { background: white; } }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <div>
              <div class="logo">محصّلة</div>
              <div style="font-size:8px;opacity:0.6;margin-top:2px;letter-spacing:2px;">WHOLESALE MEMBER</div>
            </div>
            <div class="badge">${card.tier === 'gold' ? 'GOLD' : 'SILVER'}</div>
          </div>
          <div style="margin-top: 12px;">
            <div class="name-label">اسم العضو</div>
            <div class="name">${card.holderName}</div>
          </div>
          <div class="bottom">
            <div class="field">
              <div class="field-label">رقم العضوية</div>
              <div class="field-value">${card.cardNumber}</div>
            </div>
            <div class="field" style="text-align: left;">
              <div class="field-label">الصلاحية</div>
              <div class="field-value">${card.expiryDate}</div>
            </div>
          </div>
        </div>
        <script>setTimeout(() => window.print(), 500);</script>
      </body>
      </html>
    `);
        printWindow.document.close();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">إدارة البطاقات</h1>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{allCards.length} بطاقة مصدرة</p>
                </div>
                {selectedCard && (
                    <button
                        onClick={handlePrint}
                        className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        طباعة البطاقة
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <div className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-opacity duration-200 ${search ? 'opacity-0' : 'opacity-100'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="ابحث برقم البطاقة أو اسم الحامل..."
                            className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all ${search ? 'pr-4' : 'pr-12'}`}
                        />
                    </div>
                    <select
                        value={filterTier}
                        onChange={e => setFilterTier(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-cyan-500 min-w-[130px]"
                    >
                        <option value="all">كل الفئات</option>
                        <option value="silver">الفضية</option>
                        <option value="gold">الذهبية</option>
                    </select>
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-cyan-500 min-w-[130px]"
                    >
                        <option value="all">كل الحالات</option>
                        <option value="active">نشطة</option>
                        <option value="inactive">غير نشطة</option>
                        <option value="lost">مفقودة</option>
                    </select>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" ref={printRef}>
                {filteredCards.map((card, index) => {
                    const cs = cardStatusConfig[card.status];
                    const isSelected = selectedCard === card.id;
                    return (
                        <div
                            key={card.id}
                            onClick={() => setSelectedCard(isSelected ? null : card.id)}
                            style={{ animationDelay: `${index * 50}ms` }}
                            className={`bg-white dark:bg-slate-800 rounded-3xl border-2 p-6 cursor-pointer relative group ${isSelected ? 'border-cyan-500 ring-2 ring-cyan-500/20 shadow-[0_8px_30px_-5px_rgba(6,182,212,0.3)]' : 'border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'
                                }`}
                        >

                            {/* Mini card preview */}
                            <div className={`w-full h-32 rounded-xl bg-gradient-to-br ${TIERS[card.tier].gradient} p-4 text-white relative overflow-hidden mb-4`}>
                                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 blur-lg" />
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-black">محصّلة</span>
                                    <span className="text-[8px] font-bold bg-white/15 px-2 py-1 rounded-md">
                                        {card.tier === 'gold' ? 'GOLD' : 'SILVER'}
                                    </span>
                                </div>
                                <p className="text-sm font-bold mt-4">{card.holderName}</p>
                                <p className="text-xs font-mono mt-2 opacity-80 tracking-widest">{card.cardNumber}</p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-400">الحامل</span>
                                    <span className="text-sm font-bold text-slate-800">{card.holderName}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-400">العضو الأساسي</span>
                                    <span className="text-sm text-slate-600">{card.memberName}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-400">النوع</span>
                                    <span className="text-xs font-bold text-slate-600">
                                        {card.type === 'primary' ? 'رئيسية' : 'عائلة'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-400">الحالة</span>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${cs.class}`}>{cs.label}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-400">تاريخ الإصدار</span>
                                    <span className="text-xs text-slate-600">{formatDate(card.issuedDate)}</span>
                                </div>
                            </div>

                            {isSelected && (
                                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-cyan-500 text-xs font-bold">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    محددة للطباعة
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {filteredCards.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    </div>
                    <p className="text-slate-500 font-bold">لا توجد بطاقات</p>
                    <p className="text-sm text-slate-400 mt-1">جرب تعديل البحث أو الفلاتر</p>
                </div>
            )}
        </div>
    );
};

export default CardsPage;
