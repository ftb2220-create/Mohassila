import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs: React.FC = () => {
    const location = useLocation();

    const pathMap: Record<string, string> = {
        '/dashboard': 'لوحة التحكم',
        '/dashboard/members': 'الأعضاء',
        '/dashboard/members/new': 'عضو جديد',
        '/dashboard/cards': 'البطاقات',
        '/dashboard/transactions': 'العمليات',
        '/dashboard/settings': 'الإعدادات',
    };

    const segments = location.pathname.split('/').filter(Boolean);
    const crumbs: { label: string; path: string }[] = [];

    let currentPath = '';
    for (const seg of segments) {
        currentPath += `/${seg}`;
        const label = pathMap[currentPath];
        if (label) {
            crumbs.push({ label, path: currentPath });
        } else if (currentPath.startsWith('/dashboard/members/') && seg !== 'new') {
            crumbs.push({ label: 'تفاصيل العضو', path: currentPath });
        }
    }

    if (crumbs.length <= 1) return null;

    return (
        <nav className="flex items-center gap-2 text-xs mb-4">
            {crumbs.map((crumb, i) => (
                <React.Fragment key={crumb.path}>
                    {i > 0 && (
                        <svg className="w-3 h-3 text-slate-300 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    )}
                    {i === crumbs.length - 1 ? (
                        <span className="font-bold text-slate-600">{crumb.label}</span>
                    ) : (
                        <Link
                            to={crumb.path}
                            className="text-slate-400 hover:text-cyan-500 transition-colors font-medium"
                        >
                            {crumb.label}
                        </Link>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumbs;
