import React, { useState } from 'react';
import { useMembers } from '../contexts/MembersContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TIERS } from '../types';
import { formatCurrency, formatDate, daysUntilExpiry } from '../data/mockData';
import { getPermissions } from '../utils/permissions';
import { exportToCSV } from '../utils/exportCSV';
import { exportToPDF } from '../utils/exportPDF';
import ConfirmModal from '../components/ui/ConfirmModal';

const ITEMS_PER_PAGE = 10;

const MembersPage: React.FC = () => {
    const { members, searchMembers, deleteMember } = useMembers();
    const navigate = useNavigate();
    const { employee } = useAuth();
    const permissions = getPermissions(employee?.role);
    const [search, setSearch] = useState('');
    const [filterTier, setFilterTier] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);

    let filteredMembers = search ? searchMembers(search) : members;

    if (filterTier !== 'all') {
        filteredMembers = filteredMembers.filter(m => m.tier === filterTier);
    }
    if (filterStatus !== 'all') {
        filteredMembers = filteredMembers.filter(m => m.status === filterStatus);
    }

    // Sorting
    const sorted = [...filteredMembers].sort((a, b) => {
        let cmp = 0;
        if (sortBy === 'name') cmp = a.name.localeCompare(b.name, 'ar');
        else if (sortBy === 'totalSpent') cmp = a.totalSpent - b.totalSpent;
        else if (sortBy === 'expiryDate') cmp = new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
        else if (sortBy === 'joinDate') cmp = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
        return sortDir === 'asc' ? cmp : -cmp;
    });

    // Pagination
    const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
    const paginatedMembers = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleSort = (col: string) => {
        if (sortBy === col) {
            setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(col);
            setSortDir('asc');
        }
        setCurrentPage(1);
    };

    const SortIcon: React.FC<{ col: string }> = ({ col }) => (
        <span className={`inline-block mr-1 text-xs ${sortBy === col ? 'text-cyan-500' : 'text-slate-300'}`}>
            {sortBy === col ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
        </span>
    );

    const statusBadge = (status: string) => {
        const config: Record<string, { label: string; class: string }> = {
            active: { label: 'نشط', class: 'bg-emerald-100 text-emerald-700' },
            expired: { label: 'منتهي', class: 'bg-red-100 text-red-700' },
            suspended: { label: 'معلق', class: 'bg-amber-100 text-amber-700' },
        };
        const c = config[status] || config.active;
        return <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${c.class}`}>{c.label}</span>;
    };

    const handleExportMembers = () => {
        const statusLabels: Record<string, string> = { active: 'نشط', expired: 'منتهي', suspended: 'معلق' };
        const data = filteredMembers.map(m => ({
            name: m.name,
            memberId: m.memberId,
            phone: m.phone,
            email: m.email,
            nationalId: m.nationalId,
            tier: TIERS[m.tier].nameAr,
            status: statusLabels[m.status] || m.status,
            city: m.city,
            joinDate: formatDate(m.joinDate),
            expiryDate: formatDate(m.expiryDate),
            totalSpent: m.totalSpent,
            cashbackBalance: m.cashbackBalance,
        }));
        exportToCSV(data, [
            { key: 'name', label: 'الاسم' },
            { key: 'memberId', label: 'رقم العضوية' },
            { key: 'phone', label: 'الجوال' },
            { key: 'email', label: 'البريد' },
            { key: 'nationalId', label: 'الهوية' },
            { key: 'tier', label: 'العضوية' },
            { key: 'status', label: 'الحالة' },
            { key: 'city', label: 'المدينة' },
            { key: 'joinDate', label: 'تاريخ الانضمام' },
            { key: 'expiryDate', label: 'تاريخ الانتهاء' },
            { key: 'totalSpent', label: 'المشتريات' },
            { key: 'cashbackBalance', label: 'رصيد كاش باك' },
        ], 'اعضاء_محصلة');
    };

    const handleExportPDF = () => {
        const statusLabels: Record<string, string> = { active: 'نشط', expired: 'منتهي', suspended: 'معلق' };
        const data = filteredMembers.map(m => ({
            name: m.name,
            memberId: m.memberId,
            phone: m.phone,
            tier: TIERS[m.tier].nameAr,
            status: statusLabels[m.status] || m.status,
            city: m.city,
            totalSpent: m.totalSpent,
        }));
        exportToPDF({
            title: 'تقرير الأعضاء',
            subtitle: `إجمالي ${filteredMembers.length} عضو`,
            data,
            columns: [
                { key: 'name', label: 'الاسم' },
                { key: 'memberId', label: 'رقم العضوية' },
                { key: 'phone', label: 'الجوال' },
                { key: 'tier', label: 'العضوية' },
                { key: 'status', label: 'الحالة' },
                { key: 'city', label: 'المدينة' },
                { key: 'totalSpent', label: 'المشتريات' },
            ],
            filename: 'اعضاء_محصلة',
            showTotal: true,
            totalColumns: ['totalSpent'],
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">إدارة الأعضاء</h1>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{members.length} عضو مسجل</p>
                </div>
                <div className="flex items-center gap-3">
                    {permissions.canAddMember && (
                        <button
                            id="add-member-btn"
                            onClick={() => navigate('/dashboard/members/new')}
                            className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/25 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            عضو جديد
                        </button>
                    )}
                    <button
                        id="export-members-btn"
                        onClick={handleExportMembers}
                        className="border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        CSV
                    </button>
                    <button
                        id="export-members-pdf-btn"
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

            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <div className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-opacity duration-200 ${search ? 'opacity-0' : 'opacity-100'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            id="member-search"
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="ابحث بالاسم، رقم العضوية، الجوال، الهوية..."
                            className={`w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all ${search ? 'pr-4' : 'pr-12'}`}
                        />
                    </div>

                    {/* Tier Filter */}
                    <select
                        value={filterTier}
                        onChange={(e) => setFilterTier(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all min-w-[140px]"
                    >
                        <option value="all">كل العضويات</option>
                        <option value="silver">الفضية</option>
                        <option value="gold">الذهبية</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all min-w-[140px]"
                    >
                        <option value="all">كل الحالات</option>
                        <option value="active">نشط</option>
                        <option value="expired">منتهي</option>
                        <option value="suspended">معلق</option>
                    </select>
                </div>
            </div>

            {/* Members Table */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/80 dark:bg-slate-700/50 backdrop-blur-sm border-b border-slate-100 dark:border-slate-700">
                                <th onClick={() => handleSort('name')} className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-cyan-600 select-none">العضو <SortIcon col="name" /></th>
                                <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">رقم العضوية</th>
                                <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">العضوية</th>
                                <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">الحالة</th>
                                <th onClick={() => handleSort('expiryDate')} className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-cyan-600 select-none">الانتهاء <SortIcon col="expiryDate" /></th>
                                <th onClick={() => handleSort('totalSpent')} className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-cyan-600 select-none">المشتريات <SortIcon col="totalSpent" /></th>
                                <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">المدينة</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 relative">
                            {paginatedMembers.map((member, index) => {
                                const days = daysUntilExpiry(member.expiryDate);
                                return (
                                    <tr
                                        key={member.id}
                                        className="hover:bg-cyan-50/30 cursor-pointer transition-colors group relative"
                                        onClick={() => navigate(`/dashboard/members/${member.id}`)}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <td className="px-6 py-4 relative">
                                            {/* Hover Left Border Accent */}
                                            <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-cyan-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black bg-gradient-to-br ${TIERS[member.tier].gradient}`}>
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{member.name}</p>
                                                    <p className="text-xs text-slate-400">{member.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-lg font-mono">{member.memberId}</code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${member.tier === 'gold' ? 'text-amber-600' : 'text-slate-600'}`}>
                                                <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${TIERS[member.tier].gradient}`} />
                                                {TIERS[member.tier].nameAr}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{statusBadge(member.status)}</td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className={`text-xs font-bold ${days <= 0 ? 'text-red-500' : days <= 30 ? 'text-amber-500' : 'text-slate-600'}`}>
                                                    {days <= 0 ? 'منتهي' : `${days} يوم`}
                                                </p>
                                                <p className="text-xs text-slate-400">{formatDate(member.expiryDate)}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-slate-700">{formatCurrency(member.totalSpent)}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-slate-500">{member.city}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                {permissions.canDeleteMember && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setDeleteTarget({ id: member.id, name: member.name }); }}
                                                        className="text-slate-300 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                                                        title="حذف العضو"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                                <button className="text-slate-400 hover:text-cyan-500 transition-colors p-1">
                                                    <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredMembers.length === 0 && (
                    <div className="p-12 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <p className="text-slate-500 font-bold">لا توجد نتائج</p>
                        <p className="text-sm text-slate-400 mt-1">جرب تعديل البحث أو الفلاتر</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-100 px-6 py-4">
                    <p className="text-xs text-slate-400">
                        عرض {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, sorted.length)} من {sorted.length}
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-600"
                        >
                            السابق
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => setCurrentPage(p)}
                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === p
                                    ? 'bg-cyan-500 text-white'
                                    : 'text-slate-500 hover:bg-slate-100'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-600"
                        >
                            التالي
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deleteTarget}
                title="حذف العضو"
                message={`هل أنت متأكد من حذف ${deleteTarget?.name || ''}? هذا الإجراء لا يمكن التراجع عنه.`}
                confirmText="حذف نهائياً"
                cancelText="إلغاء"
                type="danger"
                onConfirm={async () => { if (deleteTarget) { await deleteMember(deleteTarget.id, employee?.name); setDeleteTarget(null); } }}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
};

export default MembersPage;
