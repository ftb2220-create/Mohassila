// ============ MEMBERS SERVICE ============
// خدمة إدارة الأعضاء - CRUD Operations

import {
    collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
    query, orderBy, onSnapshot, serverTimestamp, type Unsubscribe,
    Timestamp
} from 'firebase/firestore';
import { db } from './config';
import type { Member, MemberCard, FamilyMember, TierType } from '../types';
import { generateMemberId, generateCardNumber } from '../data/mockData';

const MEMBERS_COLLECTION = 'members';

// ---- تحويل بين Firestore و App Types ----

function memberFromFirestore(id: string, data: Record<string, unknown>): Member {
    return {
        id,
        memberId: data.memberId as string || '',
        name: data.name as string || '',
        phone: data.phone as string || '',
        email: data.email as string || '',
        nationalId: data.nationalId as string || '',
        tier: data.tier as TierType || 'silver',
        status: data.status as Member['status'] || 'active',
        joinDate: data.joinDate instanceof Timestamp
            ? data.joinDate.toDate().toISOString().split('T')[0]
            : data.joinDate as string || '',
        expiryDate: data.expiryDate instanceof Timestamp
            ? data.expiryDate.toDate().toISOString().split('T')[0]
            : data.expiryDate as string || '',
        totalSpent: data.totalSpent as number || 0,
        cashbackEarned: data.cashbackEarned as number || 0,
        cashbackBalance: data.cashbackBalance as number || 0,
        points: data.points as number || 0,
        cards: (data.cards as MemberCard[]) || [],
        familyMembers: (data.familyMembers as FamilyMember[]) || [],
        notes: data.notes as string || '',
        city: data.city as string || '',
        createdBy: data.createdBy as string || '',
    };
}

function memberToFirestore(member: Partial<Member>): Record<string, unknown> {
    const data: Record<string, unknown> = { ...member };
    // Convert date strings to Timestamps for proper ordering
    if (member.joinDate) data.joinDate = member.joinDate;
    if (member.expiryDate) data.expiryDate = member.expiryDate;
    // Remove the 'id' field - Firestore uses document ID
    delete data.id;
    return data;
}

// ---- CRUD Operations ----

/**
 * جلب جميع الأعضاء (مرة واحدة)
 */
export async function fetchMembers(): Promise<Member[]> {
    const q = query(collection(db, MEMBERS_COLLECTION), orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => memberFromFirestore(d.id, d.data()));
}

/**
 * مراقبة الأعضاء في الوقت الحقيقي (Real-time)
 */
export function subscribeToMembers(callback: (members: Member[]) => void): Unsubscribe {
    const q = query(collection(db, MEMBERS_COLLECTION), orderBy('name'));
    return onSnapshot(q, (snapshot) => {
        const members = snapshot.docs.map(d => memberFromFirestore(d.id, d.data()));
        callback(members);
    });
}

/**
 * جلب عضو واحد
 */
export async function fetchMember(id: string): Promise<Member | null> {
    const docRef = doc(db, MEMBERS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return memberFromFirestore(docSnap.id, docSnap.data());
    }
    return null;
}

/**
 * إضافة عضو جديد
 */
export async function createMember(
    memberData: Omit<Member, 'id' | 'memberId' | 'cards' | 'familyMembers' | 'totalSpent' | 'cashbackEarned' | 'cashbackBalance' | 'points'>
): Promise<Member> {
    const memberId = generateMemberId();
    const cardNumber = generateCardNumber(memberId, 1);
    const newMemberData = {
        ...memberData,
        memberId,
        totalSpent: 0,
        cashbackEarned: 0,
        cashbackBalance: 0,
        points: 0,
        cards: [{
            id: `card-${Date.now()}`,
            cardNumber,
            holderName: memberData.name,
            type: 'primary' as const,
            status: 'active' as const,
            issuedDate: memberData.joinDate,
            tier: memberData.tier,
        }],
        familyMembers: [],
        createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, MEMBERS_COLLECTION), memberToFirestore(newMemberData));
    return {
        id: docRef.id,
        ...newMemberData,
    } as Member;
}

/**
 * تحديث بيانات عضو
 */
export async function updateMember(id: string, updates: Partial<Member>): Promise<void> {
    const docRef = doc(db, MEMBERS_COLLECTION, id);
    await updateDoc(docRef, memberToFirestore(updates));
}

/**
 * حذف عضو
 */
export async function deleteMemberDoc(id: string): Promise<void> {
    const docRef = doc(db, MEMBERS_COLLECTION, id);
    await deleteDoc(docRef);
}

/**
 * تجديد عضوية
 */
export async function renewMembershipDoc(id: string): Promise<void> {
    const member = await fetchMember(id);
    if (!member) throw new Error('العضو غير موجود');

    const currentExpiry = new Date(member.expiryDate);
    const now = new Date();
    const baseDate = currentExpiry > now ? currentExpiry : now;
    const newExpiry = new Date(baseDate);
    newExpiry.setFullYear(newExpiry.getFullYear() + 1);

    await updateMember(id, {
        status: 'active',
        expiryDate: newExpiry.toISOString().split('T')[0],
        cards: member.cards.map(c => ({ ...c, status: 'active' as const })),
    });
}

/**
 * تعليق عضوية
 */
export async function suspendMemberDoc(id: string): Promise<void> {
    const member = await fetchMember(id);
    if (!member) throw new Error('العضو غير موجود');

    await updateMember(id, {
        status: 'suspended',
        cards: member.cards.map(c => ({ ...c, status: 'inactive' as const })),
    });
}

/**
 * تفعيل عضوية
 */
export async function activateMemberDoc(id: string): Promise<void> {
    const member = await fetchMember(id);
    if (!member) throw new Error('العضو غير موجود');

    await updateMember(id, {
        status: 'active',
        cards: member.cards.map(c => ({ ...c, status: 'active' as const })),
    });
}

/**
 * إصدار بطاقة جديدة
 */
export async function issueCardDoc(memberId: string, holderName: string, type: 'primary' | 'family'): Promise<void> {
    const member = await fetchMember(memberId);
    if (!member) throw new Error('العضو غير موجود');

    const seq = member.cards.length + 1;
    const cardNumber = generateCardNumber(member.memberId, seq);
    const newCard: MemberCard = {
        id: `card-${Date.now()}`,
        cardNumber,
        holderName,
        type,
        status: 'active',
        issuedDate: new Date().toISOString().split('T')[0],
        tier: member.tier,
    };
    await updateMember(memberId, {
        cards: [...member.cards, newCard],
    });
}

/**
 * بحث الأعضاء
 */
export async function searchMembersQuery(searchQuery: string): Promise<Member[]> {
    // Firestore لا يدعم full-text search بشكل مباشر
    // نجلب كل الأعضاء ونفلتر محلياً (مناسب لأقل من 10,000 عضو)
    const members = await fetchMembers();
    const q = searchQuery.toLowerCase().trim();
    if (!q) return members;
    return members.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.memberId.includes(q) ||
        m.phone.includes(q) ||
        m.nationalId.includes(q) ||
        m.email.toLowerCase().includes(q)
    );
}
