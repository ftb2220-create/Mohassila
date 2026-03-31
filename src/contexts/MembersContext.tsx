import React, { createContext, useContext, useState, type ReactNode, useCallback, useEffect } from 'react';
import type { Member, Transaction, DashboardStats } from '../types';
import {
    subscribeToMembers, createMember as createMemberDoc,
    updateMember as updateMemberDoc, deleteMemberDoc,
    renewMembershipDoc, issueCardDoc, suspendMemberDoc, activateMemberDoc
} from '../firebase/membersService';
import { subscribeToTransactions, createTransaction } from '../firebase/transactionsService';
import { subscribeToActivityLog, addActivityEntry } from '../firebase/activityService';

export interface ActivityEntry {
    id: string;
    action: string;
    details: string;
    performedBy: string;
    timestamp: string;
    type: 'add' | 'delete' | 'renew' | 'suspend' | 'activate' | 'card' | 'upgrade' | 'other';
}

interface MembersContextType {
    members: Member[];
    transactions: Transaction[];
    stats: DashboardStats;
    activityLog: ActivityEntry[];
    loading: boolean;
    addMember: (member: Omit<Member, 'id' | 'memberId' | 'cards' | 'familyMembers' | 'totalSpent' | 'cashbackEarned' | 'cashbackBalance' | 'points'>, performedBy?: string) => Promise<Member>;
    updateMember: (id: string, updates: Partial<Member>) => Promise<void>;
    deleteMember: (id: string, performedBy?: string) => Promise<void>;
    renewMembership: (id: string, employeeId: string, performedBy?: string) => Promise<void>;
    issueCard: (memberId: string, holderName: string, type: 'primary' | 'family', performedBy?: string) => Promise<void>;
    suspendMember: (id: string, performedBy?: string) => Promise<void>;
    activateMember: (id: string, performedBy?: string) => Promise<void>;
    getMember: (id: string) => Member | undefined;
    searchMembers: (query: string) => Member[];
    addActivity: (entry: Omit<ActivityEntry, 'id' | 'timestamp'>) => void;
}

const MembersContext = createContext<MembersContextType | null>(null);

export const useMembers = () => {
    const ctx = useContext(MembersContext);
    if (!ctx) throw new Error('useMembers must be used within MembersProvider');
    return ctx;
};

// حساب الإحصائيات من البيانات الحقيقية
function calculateStats(members: Member[], transactions: Transaction[]): DashboardStats {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const activeMembers = members.filter(m => m.status === 'active').length;
    const expiredMembers = members.filter(m => m.status === 'expired').length;
    const newMembersThisMonth = members.filter(m => {
        const joinDate = new Date(m.joinDate);
        return joinDate.getMonth() === thisMonth && joinDate.getFullYear() === thisYear;
    }).length;

    const monthlyTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });

    const renewalsThisMonth = monthlyTransactions.filter(t => t.type === 'renewal').length;
    const monthlyRevenue = monthlyTransactions
        .filter(t => t.type !== 'refund')
        .reduce((sum, t) => sum + t.amount, 0);
    const totalRevenue = transactions
        .filter(t => t.type !== 'refund')
        .reduce((sum, t) => sum + t.amount, 0);
    const totalCashbackPaid = members.reduce((sum, m) => sum + m.cashbackEarned, 0);
    const cardsIssued = members.reduce((sum, m) => sum + m.cards.length, 0);

    return {
        totalMembers: members.length,
        activeMembers,
        expiredMembers,
        newMembersThisMonth,
        renewalsThisMonth,
        totalRevenue,
        monthlyRevenue,
        totalCashbackPaid,
        cardsIssued,
    };
}

export const MembersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [members, setMembers] = useState<Member[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [activityLog, setActivityLog] = useState<ActivityEntry[]>([]);
    const [loading, setLoading] = useState(true);

    // Real-time subscriptions
    useEffect(() => {
        let membersLoaded = false;
        let transactionsLoaded = false;

        const checkLoaded = () => {
            if (membersLoaded && transactionsLoaded) setLoading(false);
        };

        const unsubMembers = subscribeToMembers((data) => {
            setMembers(data);
            membersLoaded = true;
            checkLoaded();
        });

        const unsubTransactions = subscribeToTransactions((data) => {
            setTransactions(data);
            transactionsLoaded = true;
            checkLoaded();
        });

        const unsubActivity = subscribeToActivityLog((data) => {
            setActivityLog(data);
        });

        return () => {
            unsubMembers();
            unsubTransactions();
            unsubActivity();
        };
    }, []);

    // حساب الإحصائيات تلقائياً من البيانات
    const stats = calculateStats(members, transactions);

    const addActivity = useCallback((entry: Omit<ActivityEntry, 'id' | 'timestamp'>) => {
        addActivityEntry(entry).catch(err => console.error('Error adding activity:', err));
    }, []);

    const addMember = useCallback(async (
        memberData: Omit<Member, 'id' | 'memberId' | 'cards' | 'familyMembers' | 'totalSpent' | 'cashbackEarned' | 'cashbackBalance' | 'points'>,
        performedBy?: string
    ): Promise<Member> => {
        const newMember = await createMemberDoc(memberData);
        addActivity({ action: 'إضافة عضو', details: `تم إضافة ${memberData.name}`, performedBy: performedBy || 'النظام', type: 'add' });
        return newMember;
    }, [addActivity]);

    const updateMember = useCallback(async (id: string, updates: Partial<Member>) => {
        await updateMemberDoc(id, updates);
    }, []);

    const deleteMember = useCallback(async (id: string, performedBy?: string) => {
        const member = members.find(m => m.id === id);
        if (!member) return;
        await deleteMemberDoc(id);
        addActivity({ action: 'حذف عضو', details: `تم حذف ${member.name}`, performedBy: performedBy || 'النظام', type: 'delete' });
    }, [members, addActivity]);

    const renewMembership = useCallback(async (id: string, employeeId: string, performedBy?: string) => {
        const member = members.find(m => m.id === id);
        if (!member) return;
        await renewMembershipDoc(id);

        const tierPrice = member.tier === 'gold' ? 399 : 199;
        await createTransaction({
            memberId: id,
            memberName: member.name,
            type: 'renewal',
            amount: tierPrice,
            cashback: 0,
            date: new Date().toISOString().split('T')[0],
            description: `تجديد عضوية ${member.tier === 'gold' ? 'ذهبية' : 'فضية'}`,
            employeeId,
        });
        addActivity({ action: 'تجديد عضوية', details: `تم تجديد عضوية ${member.name}`, performedBy: performedBy || 'النظام', type: 'renew' });
    }, [members, addActivity]);

    const issueCard = useCallback(async (memberId: string, holderName: string, type: 'primary' | 'family', performedBy?: string) => {
        await issueCardDoc(memberId, holderName, type);
        addActivity({ action: 'إصدار بطاقة', details: `بطاقة جديدة لـ ${holderName}`, performedBy: performedBy || 'النظام', type: 'card' });
    }, [addActivity]);

    const suspendMember = useCallback(async (id: string, performedBy?: string) => {
        const member = members.find(m => m.id === id);
        await suspendMemberDoc(id);
        addActivity({ action: 'تعليق عضوية', details: `تم تعليق ${member?.name || ''}`, performedBy: performedBy || 'النظام', type: 'suspend' });
    }, [members, addActivity]);

    const activateMember = useCallback(async (id: string, performedBy?: string) => {
        const member = members.find(m => m.id === id);
        await activateMemberDoc(id);
        addActivity({ action: 'تفعيل عضوية', details: `تم تفعيل ${member?.name || ''}`, performedBy: performedBy || 'النظام', type: 'activate' });
    }, [members, addActivity]);

    const getMember = useCallback((id: string) => {
        return members.find(m => m.id === id);
    }, [members]);

    const searchMembers = useCallback((query: string) => {
        const q = query.toLowerCase().trim();
        if (!q) return members;
        return members.filter(m =>
            m.name.toLowerCase().includes(q) ||
            m.memberId.includes(q) ||
            m.phone.includes(q) ||
            m.nationalId.includes(q) ||
            m.email.toLowerCase().includes(q)
        );
    }, [members]);

    return (
        <MembersContext.Provider value={{
            members, transactions, stats, activityLog, loading,
            addMember, updateMember, deleteMember, renewMembership,
            issueCard, suspendMember, activateMember,
            getMember, searchMembers, addActivity,
        }}>
            {children}
        </MembersContext.Provider>
    );
};
