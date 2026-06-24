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
    notifNewMember: boolean;
    setNotifNewMember: (v: boolean) => void;
    notifExpiry: boolean;
    setNotifExpiry: (v: boolean) => void;
    notifTransaction: boolean;
    setNotifTransaction: (v: boolean) => void;
    notifSound: boolean;
    setNotifSound: (v: boolean) => void;
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

    // Load preferences from localStorage or defaults
    const [notifNewMember, setNotifNewMemberState] = useState<boolean>(() => {
        const val = localStorage.getItem('notifNewMember');
        return val !== null ? JSON.parse(val) : true;
    });
    const [notifExpiry, setNotifExpiryState] = useState<boolean>(() => {
        const val = localStorage.getItem('notifExpiry');
        return val !== null ? JSON.parse(val) : true;
    });
    const [notifTransaction, setNotifTransactionState] = useState<boolean>(() => {
        const val = localStorage.getItem('notifTransaction');
        return val !== null ? JSON.parse(val) : false;
    });
    const [notifSound, setNotifSoundState] = useState<boolean>(() => {
        const val = localStorage.getItem('notifSound');
        return val !== null ? JSON.parse(val) : true;
    });

    // Save preferences on change
    const setNotifNewMember = (v: boolean) => {
        setNotifNewMemberState(v);
        localStorage.setItem('notifNewMember', JSON.stringify(v));
    };

    const setNotifExpiry = (v: boolean) => {
        setNotifExpiryState(v);
        localStorage.setItem('notifExpiry', JSON.stringify(v));
    };

    const setNotifTransaction = (v: boolean) => {
        setNotifTransactionState(v);
        localStorage.setItem('notifTransaction', JSON.stringify(v));
    };

    const setNotifSound = (v: boolean) => {
        setNotifSoundState(v);
        localStorage.setItem('notifSound', JSON.stringify(v));
    };

    // Generate notifications from data
    const notifications = useMemo(() => {
        const notifs: Notification[] = [];

        // 1. Expiring soon & Expired & Suspended members
        if (notifExpiry) {
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
        }

        // 2. Recent transactions (last 3)
        if (notifTransaction) {
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
        }

        // 3. New members (joined in last 3 days)
        if (notifNewMember) {
            const today = new Date();
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate(today.getDate() - 3);
            const limitDate = threeDaysAgo.toISOString().split('T')[0];

            const newMembers = members.filter(m => m.joinDate >= limitDate);
            newMembers.forEach(m => {
                notifs.push({
                    id: `new-${m.id}`,
                    type: 'info',
                    title: 'عضو جديد منضم',
                    message: `${m.name} انضم للنظام`,
                    time: 'حديثاً',
                    read: readIds.has(`new-${m.id}`),
                });
            });
        }

        return notifs;
    }, [members, transactions, readIds, notifNewMember, notifExpiry, notifTransaction]);

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
        <NotificationsContext.Provider value={{
            notifications,
            unreadCount,
            markAsRead,
            markAllAsRead,
            notifNewMember,
            setNotifNewMember,
            notifExpiry,
            setNotifExpiry,
            notifTransaction,
            setNotifTransaction,
            notifSound,
            setNotifSound
        }}>
            {children}
        </NotificationsContext.Provider>
    );
};
