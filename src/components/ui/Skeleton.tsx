import React from 'react';

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
    <div className={`bg-slate-200 rounded-lg animate-pulse ${className}`} />
);

export const CardSkeleton: React.FC = () => (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
        <Skeleton className="h-8 w-1/3" />
    </div>
);

export const TableRowSkeleton: React.FC = () => (
    <tr>
        <td className="px-6 py-4">
            <div className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-xl" />
                <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-2.5 w-20" />
                </div>
            </div>
        </td>
        <td className="px-6 py-4"><Skeleton className="h-3.5 w-20" /></td>
        <td className="px-6 py-4"><Skeleton className="h-5 w-14 rounded-lg" /></td>
        <td className="px-6 py-4"><Skeleton className="h-5 w-12 rounded-lg" /></td>
        <td className="px-6 py-4"><Skeleton className="h-3.5 w-24" /></td>
        <td className="px-6 py-4"><Skeleton className="h-3.5 w-16" /></td>
        <td className="px-6 py-4"><Skeleton className="h-3.5 w-16" /></td>
        <td className="px-6 py-4"><Skeleton className="h-5 w-5 rounded" /></td>
    </tr>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <th key={i} className="px-6 py-4">
                                <Skeleton className="h-3 w-16" />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {Array.from({ length: rows }).map((_, i) => (
                        <TableRowSkeleton key={i} />
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export const DashboardSkeleton: React.FC = () => (
    <div className="space-y-6">
        {/* Welcome Banner */}
        <Skeleton className="h-40 rounded-3xl" />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>

        {/* Charts Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <Skeleton className="h-5 w-1/3 mb-4" />
                <Skeleton className="h-48" />
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <Skeleton className="h-5 w-1/3 mb-4" />
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <Skeleton className="w-8 h-8 rounded-lg" />
                            <div className="flex-1 space-y-1">
                                <Skeleton className="h-3 w-3/4" />
                                <Skeleton className="h-2.5 w-1/2" />
                            </div>
                            <Skeleton className="h-4 w-16" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export const PageSkeleton: React.FC = () => (
    <div className="space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
            <div className="space-y-2">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-11 w-32 rounded-xl" />
        </div>
        <TableSkeleton rows={6} />
    </div>
);
