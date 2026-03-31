import React, { createContext, useContext, useState, type ReactNode, useCallback } from 'react';
import type { Member, Transaction, DashboardStats } from '../types';
import { mockMembers, mockTransactions, mockDashboardStats, generateMemberId, generateCardNumber } from '../data/mockData';

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
    addMember: (member: Omit<Member, 'id' | 'memberId' | 'cards' | 'familyMembers' | 'totalSpent' | 'cashbackEarned' | 'cashbackBalance' | 'points'>, performedBy?: string) => Member;
    updateMember: (id: string, updates: Partial<Member>) => void;
    deleteMember: (id: string, performedBy?: string) => void;
    renewMembership: (id: string, employeeId: string, performedBy?: string) => void;
    issueCard: (memberId: string, holderName: string, type: 'primary' | 'family', performedBy?: string) => void;
    suspendMember: (id: string, performedBy?: string) => void;
    activateMember: (id: string, performedBy?: string) => void;
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

export const MembersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [members, setMembers] = useState<Member[]>(mockMembers);
    const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
    const [stats, setStats] = useState<DashboardStats>(mockDashboardStats);
    const [activityLog, setActivityLog] = useState<ActivityEntry[]>([]);

    const addActivity = useCallback((entry: Omit<ActivityEntry, 'id' | 'timestamp'>) => {
        setActivityLog(prev => [{
            ...entry,
            id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            timestamp: new Date().toISOString(),
        }, ...prev]);
    }, []);

    const addMember = useCallback((memberData: Omit<Member, 'id' | 'memberId' | 'cards' | 'familyMembers' | 'totalSpent' | 'cashbackEarned' | 'cashbackBalance' | 'points'>, performedBy?: string) => {
        const memberId = generateMemberId();
        const id = `mem-${Date.now()}`;
        const cardNumber = generateCardNumber(memberId, 1);
        const newMember: Member = {
            ...memberData,
            id,
            memberId,
            totalSpent: 0,
            cashbackEarned: 0,
            cashbackBalance: 0,
            points: 0,
            cards: [{
                id: `card-${Date.now()}`,
                cardNumber,
                holderName: memberData.name,
                type: 'primary',
                status: 'active',
                issuedDate: memberData.joinDate,
                tier: memberData.tier,
            }],
            familyMembers: [],
        };
        setMembers(prev => [...prev, newMember]);
        setStats(prev => ({
            ...prev,
            totalMembers: prev.totalMembers + 1,
            activeMembers: prev.activeMembers + 1,
            newMembersThisMonth: prev.newMembersThisMonth + 1,
            cardsIssued: prev.cardsIssued + 1,
        }));
        addActivity({ action: 'إضافة عضو', details: `تم إضافة ${memberData.name}`, performedBy: performedBy || 'النظام', type: 'add' });
        return newMember;
    }, [addActivity]);

    const updateMember = useCallback((id: string, updates: Partial<Member>) => {
        setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    }, []);

    const deleteMember = useCallback((id: string, performedBy?: string) => {
        const member = members.find(m => m.id === id);
        if (!member) return;
        setMembers(prev => prev.filter(m => m.id !== id));
        setTransactions(prev => prev.filter(t => t.memberId !== id));
        setStats(prev => ({
            ...prev,
            totalMembers: prev.totalMembers - 1,
            activeMembers: member.status === 'active' ? prev.activeMembers - 1 : prev.activeMembers,
            expiredMembers: member.status === 'expired' ? prev.expiredMembers - 1 : prev.expiredMembers,
            cardsIssued: prev.cardsIssued - member.cards.length,
        }));
        addActivity({ action: 'حذف عضو', details: `تم حذف ${member.name}`, performedBy: performedBy || 'النظام', type: 'delete' });
    }, [members, addActivity]);

    const renewMembership = useCallback((id: string, employeeId: string, performedBy?: string) => {
        setMembers(prev => prev.map(m => {
            if (m.id !== id) return m;
            const currentExpiry = new Date(m.expiryDate);
            const now = new Date();
            const baseDate = currentExpiry > now ? currentExpiry : now;
            const newExpiry = new Date(baseDate);
            newExpiry.setFullYear(newExpiry.getFullYear() + 1);
            return {
                ...m,
                status: 'active' as const,
                expiryDate: newExpiry.toISOString().split('T')[0],
                cards: m.cards.map(c => ({ ...c, status: 'active' as const })),
            };
        }));
        const member = members.find(m => m.id === id);
        if (member) {
            const tierPrice = member.tier === 'gold' ? 399 : 199;
            const newTrx: Transaction = {
                id: `trx-${Date.now()}`,
                memberId: id,
                memberName: member.name,
                type: 'renewal',
                amount: tierPrice,
                cashback: 0,
                date: new Date().toISOString().split('T')[0],
                description: `تجديد عضوية ${member.tier === 'gold' ? 'ذهبية' : 'فضية'}`,
                employeeId,
            };
            setTransactions(prev => [newTrx, ...prev]);
            setStats(prev => ({
                ...prev,
                renewalsThisMonth: prev.renewalsThisMonth + 1,
                monthlyRevenue: prev.monthlyRevenue + tierPrice,
                activeMembers: member.status !== 'active' ? prev.activeMembers + 1 : prev.activeMembers,
                expiredMembers: member.status === 'expired' ? prev.expiredMembers - 1 : prev.expiredMembers,
            }));
        }
        addActivity({ action: 'تجديد عضوية', details: `تم تجديد عضوية ${member?.name || ''}`, performedBy: performedBy || 'النظام', type: 'renew' });
    }, [members, addActivity]);

    const issueCard = useCallback((memberId: string, holderName: string, type: 'primary' | 'family', performedBy?: string) => {
        setMembers(prev => prev.map(m => {
            if (m.id !== memberId) return m;
            const seq = m.cards.length + 1;
            const cardNumber = generateCardNumber(m.memberId, seq);
            const newCard = {
                id: `card-${Date.now()}`,
                cardNumber,
                holderName,
                type,
                status: 'active' as const,
                issuedDate: new Date().toISOString().split('T')[0],
                tier: m.tier,
            };
            return { ...m, cards: [...m.cards, newCard] };
        }));
        setStats(prev => ({ ...prev, cardsIssued: prev.cardsIssued + 1 }));
        addActivity({ action: 'إصدار بطاقة', details: `بطاقة جديدة لـ ${holderName}`, performedBy: performedBy || 'النظام', type: 'card' });
    }, [addActivity]);

    const suspendMember = useCallback((id: string, performedBy?: string) => {
        const member = members.find(m => m.id === id);
        setMembers(prev => prev.map(m => {
            if (m.id !== id) return m;
            return {
                ...m,
                status: 'suspended' as const,
                cards: m.cards.map(c => ({ ...c, status: 'inactive' as const })),
            };
        }));
        setStats(prev => ({ ...prev, activeMembers: prev.activeMembers - 1 }));
        addActivity({ action: 'تعليق عضوية', details: `تم تعليق ${member?.name || ''}`, performedBy: performedBy || 'النظام', type: 'suspend' });
    }, [members, addActivity]);

    const activateMember = useCallback((id: string, performedBy?: string) => {
        const member = members.find(m => m.id === id);
        setMembers(prev => prev.map(m => {
            if (m.id !== id) return m;
            return {
                ...m,
                status: 'active' as const,
                cards: m.cards.map(c => ({ ...c, status: 'active' as const })),
            };
        }));
        setStats(prev => ({ ...prev, activeMembers: prev.activeMembers + 1 }));
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
            members, transactions, stats, activityLog,
            addMember, updateMember, deleteMember, renewMembership,
            issueCard, suspendMember, activateMember,
            getMember, searchMembers, addActivity,
        }}>
            {children}
        </MembersContext.Provider>
    );
};
