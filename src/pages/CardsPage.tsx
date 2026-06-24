import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMembers } from '../contexts/MembersContext';
import { useAuth } from '../contexts/AuthContext';
import { TIERS } from '../types';
import { formatDate } from '../data/mockData';
import { getPermissions } from '../utils/permissions';

const CardsPage: React.FC = () => {
    const { members, updateCardStatus, issueCard } = useMembers();
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
    const [currentPage, setCurrentPage] = useState(1);
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

    const totalPages = Math.ceil(filteredCards.length / 9);


    const cardStatusConfig: Record<string, { label: string; class: string }> = {
        active: { label: 'نشطة', class: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-450' },
        inactive: { label: 'غير نشطة', class: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' },
        lost: { label: 'مفقودة', class: 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400' },
        replaced: { label: 'مُستبدلة', class: 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400' },
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
                            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                            placeholder="ابحث برقم البطاقة أو اسم الحامل..."
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all pr-12"
                        />
                    </div>
                    <select
                        value={filterTier}
                        onChange={e => { setFilterTier(e.target.value); setCurrentPage(1); }}
                        className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 min-w-[130px]"
                    >
                        <option value="all" className="dark:bg-slate-800">كل الفئات</option>
                        <option value="silver" className="dark:bg-slate-800">الفضية</option>
                        <option value="gold" className="dark:bg-slate-800">الذهبية</option>
                    </select>
                    <select
                        value={filterStatus}
                        onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                        className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 min-w-[130px]"
                    >
                        <option value="all" className="dark:bg-slate-800">كل الحالات</option>
                        <option value="active" className="dark:bg-slate-800">نشطة</option>
                        <option value="inactive" className="dark:bg-slate-800">غير نشطة</option>
                        <option value="lost" className="dark:bg-slate-800">مفقودة</option>
                        <option value="replaced" className="dark:bg-slate-800">مُستبدلة</option>
                    </select>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" ref={printRef}>
                {(filteredCards.slice((currentPage - 1) * 9, currentPage * 9)).map((card, index) => {
                    const cs = cardStatusConfig[card.status];
                    const isSelected = selectedCard === card.id;
                    return (
                        <div
                            key={card.id}
                            onClick={() => setSelectedCard(isSelected ? null : card.id)}
                            style={{ animationDelay: `${index * 50}ms` }}
                            className={`bg-white dark:bg-slate-800 rounded-3xl border-2 p-6 cursor-pointer relative group transition-all duration-300 ${isSelected ? 'border-cyan-500 ring-2 ring-cyan-500/20 shadow-[0_8px_30px_-5px_rgba(6,182,212,0.3)]' : 'border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-lg'
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
                                    <span className="text-xs text-slate-400 dark:text-slate-500">الحامل</span>
                                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{card.holderName}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-400 dark:text-slate-500">العضو الأساسي</span>
                                    <span className="text-sm text-slate-600 dark:text-slate-400">{card.memberName}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-400 dark:text-slate-500">النوع</span>
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                                        {card.type === 'primary' ? 'رئيسية' : 'عائلة'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-400 dark:text-slate-500">الحالة</span>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${cs.class}`}>{cs.label}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-400 dark:text-slate-500">تاريخ الإصدار</span>
                                    <span className="text-xs text-slate-600 dark:text-slate-400">{formatDate(card.issuedDate)}</span>
                                </div>
                            </div>

                            {isSelected && (
                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap gap-2 justify-between" onClick={e => e.stopPropagation()}>
                                    <div className="flex gap-1.5 w-full mb-1">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handlePrint(); }}
                                            className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-md hover:shadow-lg"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                            طباعة بطاقة العضوية
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-1.5 w-full mt-1.5">
                                        <button
                                            onClick={async (e) => { e.stopPropagation(); try { await updateCardStatus(card.memberId, card.id, 'active', employee?.name); } catch(err) { console.error(err); } }}
                                            disabled={card.status === 'active'}
                                            className="bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 py-2.5 rounded-xl text-xs font-bold disabled:opacity-40 transition-all border border-emerald-200/40 dark:border-emerald-900/30"
                                        >
                                            تفعيل
                                        </button>
                                        <button
                                            onClick={async (e) => { e.stopPropagation(); try { await updateCardStatus(card.memberId, card.id, 'inactive', employee?.name); } catch(err) { console.error(err); } }}
                                            disabled={card.status === 'inactive'}
                                            className="bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl text-xs font-bold disabled:opacity-40 transition-all border border-slate-200/40 dark:border-slate-600"
                                        >
                                            تعطيل
                                        </button>
                                        <button
                                            onClick={async (e) => { e.stopPropagation(); try { await updateCardStatus(card.memberId, card.id, 'lost', employee?.name); } catch(err) { console.error(err); } }}
                                            disabled={card.status === 'lost' || card.status === 'replaced'}
                                            className="bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40 text-red-700 dark:text-red-400 py-2.5 rounded-xl text-xs font-bold disabled:opacity-40 transition-all border border-red-200/40 dark:border-red-900/30"
                                        >
                                            مفقودة
                                        </button>
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                if (window.confirm(`هل أنت متأكد من استبدال بطاقة ${card.holderName}؟ سيتم إلغاء البطاقة الحالية وإصدار بطاقة جديدة بديلة.`)) {
                                                    try {
                                                        await updateCardStatus(card.memberId, card.id, 'replaced', employee?.name);
                                                        await issueCard(card.memberId, `${card.holderName} (بديل)`, card.type, employee?.name);
                                                    } catch(err) {
                                                        console.error(err);
                                                    }
                                                }
                                            }}
                                            disabled={card.status === 'replaced'}
                                            className="col-span-3 bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/40 text-blue-700 dark:text-blue-400 py-2.5 rounded-xl text-xs font-bold disabled:opacity-40 transition-all text-center mt-1 border border-blue-200/40 dark:border-blue-900/30"
                                        >
                                            إصدار بطاقة بديلة (استبدال)
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {filteredCards.length === 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-12 text-center shadow-sm">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-slate-350 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-bold">لا توجد بطاقات</p>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">جرب تعديل البحث أو الفلاتر</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 px-6 py-4 mt-6">
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                        عرض {(currentPage - 1) * 9 + 1}-{Math.min(currentPage * 9, filteredCards.length)} من {filteredCards.length}
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                        >
                            السابق
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => setCurrentPage(p)}
                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === p
                                    ? 'bg-cyan-500 text-white'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                        >
                            التالي
                        </button>
                    </div>
                </div>
            )}
        </div>

    );
};

export default CardsPage;
