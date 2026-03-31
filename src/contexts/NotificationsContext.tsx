import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import { useMembers } from './MembersContext';
import { daysUntilExpiry, isExpiringSoon } from '../data/mockData';

export interface Notification {
    id: string;
    type: 'warning' | 'info' | 'success';
    title: string;
    message: string;
    time: string;
    read: boolean;
}

interface NotificationsContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export const useNotifications = () => {
    const ctx = useContext(NotificationsContext);
    if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
    return ctx;
};

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { members, transactions } = useMembers();
    const [readIds, setReadIds] = useState<Set<string>>(() => {
        const saved = localStorage.getItem('mohassila_read_notifications');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });

    // Generate notifications from data
    const notifications = useMemo(() => {
        const notifs: Notification[] = [];

        // 1. Expiring soon members
        const expiring = members.filter(m => isExpiringSoon(m.expiryDate) && m.status === 'active');
        expiring.forEach(m => {
            const days = daysUntilExpiry(m.expiryDate);
            notifs.push({
                id: `exp-${m.id}`,
                type: 'warning',
                title: 'عضوية توشك على الانتهاء',
                message: `${m.name} — متبقي ${days} يوم`,
                time: 'قريباً',
                read: readIds.has(`exp-${m.id}`),
            });
        });

        // 2. Expired members
        const expired = members.filter(m => m.status === 'expired');
        expired.forEach(m => {
            notifs.push({
                id: `expired-${m.id}`,
                type: 'warning',
                title: 'عضوية منتهية',
                message: `${m.name} — العضوية انتهت`,
                time: 'منتهي',
                read: readIds.has(`expired-${m.id}`),
            });
        });

        // 3. Suspended members
        const suspended = members.filter(m => m.status === 'suspended');
        suspended.forEach(m => {
            notifs.push({
                id: `susp-${m.id}`,
                type: 'info',
                title: 'عضوية معلقة',
                message: `${m.name} — العضوية معلقة`,
                time: 'معلق',
                read: readIds.has(`susp-${m.id}`),
            });
        });

        // 4. Recent transactions (last 3)
        const recent = transactions.slice(0, 3);
        const typeNames: Record<string, string> = {
            purchase: 'عملية شراء',
            renewal: 'تجديد عضوية',
            cashback: 'كاش باك',
            refund: 'استرجاع',
        };
        recent.forEach(t => {
            notifs.push({
                id: `trx-${t.id}`,
                type: 'success',
                title: typeNames[t.type] || t.type,
                message: `${t.memberName} — ${t.amount} ر.س`,
                time: 'اليوم',
                read: readIds.has(`trx-${t.id}`),
            });
        });

        return notifs;
    }, [members, transactions, readIds]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = useCallback((id: string) => {
        setReadIds(prev => {
            const next = new Set(prev);
            next.add(id);
            localStorage.setItem('mohassila_read_notifications', JSON.stringify([...next]));
            return next;
        });
    }, []);

    const markAllAsRead = useCallback(() => {
        setReadIds(prev => {
            const next = new Set(prev);
            notifications.forEach(n => next.add(n.id));
            localStorage.setItem('mohassila_read_notifications', JSON.stringify([...next]));
            return next;
        });
    }, [notifications]);

    return (
        <NotificationsContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
            {children}
        </NotificationsContext.Provider>
    );
};
