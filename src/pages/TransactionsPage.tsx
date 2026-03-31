import React, { useState } from 'react';
import { useMembers } from '../contexts/MembersContext';
import { formatCurrency, formatDate } from '../data/mockData';
import { exportToCSV } from '../utils/exportCSV';
import { exportToPDF } from '../utils/exportPDF';

const TransactionsPage: React.FC = () => {
    const { transactions } = useMembers();
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [dateRange, setDateRange] = useState<string>('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    let filtered = transactions;
    if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(t =>
            t.memberName.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.id.includes(q)
        );
    }
    if (filterType !== 'all') {
        filtered = filtered.filter(t => t.type === filterType);
    }
    // Date filter
    if (dateRange === 'today') {
        const today = new Date().toISOString().split('T')[0];
        filtered = filtered.filter(t => t.date === today);
    } else if (dateRange === 'week') {
        const d = new Date(); d.setDate(d.getDate() - 7);
        const weekAgo = d.toISOString().split('T')[0];
        filtered = filtered.filter(t => t.date >= weekAgo);
    } else if (dateRange === 'month') {
        const d = new Date(); d.setMonth(d.getMonth() - 1);
        const monthAgo = d.toISOString().split('T')[0];
        filtered = filtered.filter(t => t.date >= monthAgo);
    } else if (dateRange === 'custom') {
        if (dateFrom) filtered = filtered.filter(t => t.date >= dateFrom);
        if (dateTo) filtered = filtered.filter(t => t.date <= dateTo);
    }

    const typeLabels: Record<string, { label: string; class: string; icon: React.ReactNode }> = {
        purchase: {
            label: 'شراء',
            class: 'bg-cyan-100 text-cyan-700',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>,
        },
        renewal: {
            label: 'تجديد',
            class: 'bg-emerald-100 text-emerald-700',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
        },
        cashback: {
            label: 'كاش باك',
            class: 'bg-amber-100 text-amber-700',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        },
        refund: {
            label: 'استرجاع',
            class: 'bg-red-100 text-red-700',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" /></svg>,
        },
    };

    // Summary stats
    const totalPurchases = transactions.filter(t => t.type === 'purchase').reduce((sum, t) => sum + t.amount, 0);
    const totalRenewals = transactions.filter(t => t.type === 'renewal').reduce((sum, t) => sum + t.amount, 0);
    const totalCashback = transactions.filter(t => t.type === 'purchase').reduce((sum, t) => sum + t.cashback, 0);
    const totalRefunds = transactions.filter(t => t.type === 'refund').reduce((sum, t) => sum + t.amount, 0);

    const handleExportTransactions = () => {
        const typeNames: Record<string, string> = { purchase: 'شراء', renewal: 'تجديد', cashback: 'كاش باك', refund: 'استرجاع' };
        const data = filtered.map(t => ({
            type: typeNames[t.type] || t.type,
            memberName: t.memberName,
            description: t.description,
            amount: t.amount,
            cashback: t.cashback,
            date: formatDate(t.date),
        }));
        exportToCSV(data, [
            { key: 'type', label: 'النوع' },
            { key: 'memberName', label: 'العضو' },
            { key: 'description', label: 'الوصف' },
            { key: 'amount', label: 'المبلغ' },
            { key: 'cashback', label: 'كاش باك' },
            { key: 'date', label: 'التاريخ' },
        ], 'عمليات_محصلة');
    };

    const handleExportPDF = () => {
        const typeNames: Record<string, string> = { purchase: 'شراء', renewal: 'تجديد', cashback: 'كاش باك', refund: 'استرجاع' };
        const data = filtered.map(t => ({
            type: typeNames[t.type] || t.type,
            memberName: t.memberName,
            description: t.description,
            amount: t.amount,
            cashback: t.cashback,
            date: formatDate(t.date),
        }));
        exportToPDF({
            title: 'تقرير العمليات',
            subtitle: `إجمالي ${filtered.length} عملية`,
            data,
            columns: [
                { key: 'type', label: 'النوع' },
                { key: 'memberName', label: 'العضو' },
                { key: 'description', label: 'الوصف' },
                { key: 'amount', label: 'المبلغ' },
                { key: 'cashback', label: 'كاش باك' },
                { key: 'date', label: 'التاريخ' },
            ],
            filename: 'عمليات_محصلة',
            showTotal: true,
            totalColumns: ['amount', 'cashback'],
            orientation: 'landscape',
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">سجل العمليات</h1>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{transactions.length} عملية مسجلة</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        id="export-transactions-btn"
                        onClick={handleExportTransactions}
                        className="border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        CSV
                    </button>
                    <button
                        id="export-transactions-pdf-btn"
                        onClick={handleExportPDF}
                        className="border border-red-200 text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        PDF
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 relative group hover:shadow-lg hover:shadow-cyan-100/40 hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 left-3 right-3 h-[2px] bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full opacity-0 group-hover:opacity-80 transition-opacity duration-300" />
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-500 shadow-sm group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4" /></svg>
                        </div>
                        <span className="text-xs text-slate-500 font-bold">المشتريات</span>
                    </div>
                    <p className="text-xl font-black text-slate-900 dark:text-white font-tabular">{formatCurrency(totalPurchases)}</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5 relative group hover:shadow-lg hover:shadow-emerald-100/40 hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 left-3 right-3 h-[2px] bg-gradient-to-r from-emerald-500 to-green-500 rounded-full opacity-0 group-hover:opacity-80 transition-opacity duration-300" />
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 shadow-sm group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9" /></svg>
                        </div>
                        <span className="text-xs text-slate-500 font-bold">التجديدات</span>
                    </div>
                    <p className="text-xl font-black text-slate-900 dark:text-white font-tabular">{formatCurrency(totalRenewals)}</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5 relative group hover:shadow-lg hover:shadow-amber-100/40 hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 left-3 right-3 h-[2px] bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full opacity-0 group-hover:opacity-80 transition-opacity duration-300" />
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 shadow-sm group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" /></svg>
                        </div>
                        <span className="text-xs text-slate-500 font-bold">كاش باك</span>
                    </div>
                    <p className="text-xl font-black text-emerald-600 font-tabular">{formatCurrency(totalCashback)}</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5 relative group hover:shadow-lg hover:shadow-red-100/40 hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 left-3 right-3 h-[2px] bg-gradient-to-r from-red-500 to-rose-500 rounded-full opacity-0 group-hover:opacity-80 transition-opacity duration-300" />
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 shadow-sm group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3" /></svg>
                        </div>
                        <span className="text-xs text-slate-500 font-bold">الاسترجاعات</span>
                    </div>
                    <p className="text-xl font-black text-red-600 font-tabular">{formatCurrency(totalRefunds)}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm relative z-10">
                <div className="flex flex-col gap-4">
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
                                placeholder="ابحث بالاسم أو الوصف..."
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all font-bold ${search ? 'pr-4' : 'pr-12'}`}
                            />
                        </div>
                        <select
                            value={filterType}
                            onChange={e => setFilterType(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all min-w-[160px] font-bold"
                        >
                            <option value="all">كل العمليات</option>
                            <option value="purchase">شراء</option>
                            <option value="renewal">تجديد</option>
                            <option value="cashback">كاش باك</option>
                            <option value="refund">استرجاع</option>
                        </select>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-slate-100 pt-4 mt-2">
                        <div className="w-full sm:w-auto flex-1">
                            <div className="flex flex-wrap gap-2">
                                {['all', 'today', 'week', 'month', 'custom'].map(r => {
                                    const labels: Record<string, string> = {
                                        all: 'كل الوقت', today: 'اليوم', week: 'هذا الأسبوع', month: 'هذا الشهر', custom: 'تاريخ مخصص'
                                    };
                                    return (
                                        <button
                                            key={r}
                                            onClick={() => setDateRange(r)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${dateRange === r
                                                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md'
                                                : 'bg-slate-50 text-slate-500 hover:bg-slate-200 border border-slate-200/60'
                                                }`}
                                        >
                                            {labels[r]}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        {dateRange === 'custom' && (
                            <div className="flex items-center gap-3 w-full sm:w-auto bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">من</label>
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={e => setDateFrom(e.target.value)}
                                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all font-tabular"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-slate-400 font-bold">إلى</label>
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={e => setDateTo(e.target.value)}
                                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all font-tabular"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden  shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100">
                                    <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">النوع</th>
                                    <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">العضو</th>
                                    <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">الوصف</th>
                                    <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">المبلغ</th>
                                    <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">كاش باك</th>
                                    <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">التاريخ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 relative">
                                {filtered.map((trx, index) => {
                                    const tl = typeLabels[trx.type];
                                    return (
                                        <tr key={trx.id} className="hover:bg-cyan-50/30 transition-colors group relative" style={{ animationDelay: `${index * 30}ms` }}>
                                            <td className="px-6 py-4 relative">
                                                {/* Hover Left Border Accent */}
                                                <div className={`absolute inset-y-0 right-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity ${trx.type === 'refund' ? 'bg-red-400' : 'bg-gradient-to-b from-cyan-400 to-teal-400'}`} />
                                                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg ${tl.class}`}>
                                                    {tl.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-slate-800">{trx.memberName}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-slate-500">{trx.description}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className={`text-sm font-black font-tabular ${trx.type === 'refund' ? 'text-red-500' : 'text-slate-800'}`}>
                                                    {trx.type === 'refund' ? '-' : ''}{formatCurrency(trx.amount)}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className={`text-sm font-bold ${trx.cashback > 0 ? 'text-emerald-600' : trx.cashback < 0 ? 'text-red-500' : 'text-slate-300'}`}>
                                                    {trx.cashback !== 0 ? formatCurrency(Math.abs(trx.cashback)) : '—'}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-xs text-slate-500">{formatDate(trx.date)}</p>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {filtered.length === 0 && (
                        <div className="p-12 text-center">
                            <p className="text-slate-500 font-bold">لا توجد عمليات</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionsPage;
