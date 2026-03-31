// ============ MEMBERSHIP TYPES ============
export type TierType = 'silver' | 'gold';
export type MemberStatus = 'active' | 'expired' | 'suspended';
export type CardStatus = 'active' | 'inactive' | 'lost' | 'replaced';
export type TransactionType = 'purchase' | 'renewal' | 'cashback' | 'refund';

export interface Member {
    id: string;
    memberId: string;          // رقم العضوية (10 digits)
    name: string;              // اسم العضو
    phone: string;             // رقم الجوال
    email: string;             // البريد الإلكتروني
    nationalId: string;        // رقم الهوية
    tier: TierType;            // نوع العضوية
    status: MemberStatus;      // حالة العضوية
    joinDate: string;          // تاريخ الانضمام
    expiryDate: string;        // تاريخ انتهاء العضوية
    totalSpent: number;        // إجمالي المشتريات
    cashbackEarned: number;    // إجمالي الكاش باك
    cashbackBalance: number;   // رصيد الكاش باك الحالي
    points: number;            // النقاط
    cards: MemberCard[];       // البطاقات
    familyMembers: FamilyMember[]; // أفراد العائلة
    notes: string;             // ملاحظات
    city: string;              // المدينة
    createdBy: string;         // الموظف المسؤول
}

export interface MemberCard {
    id: string;
    cardNumber: string;
    holderName: string;
    type: 'primary' | 'family';
    status: CardStatus;
    issuedDate: string;
    tier: TierType;
}

export interface FamilyMember {
    id: string;
    name: string;
    relation: string;
    phone: string;
    cardId?: string;
}

export interface Transaction {
    id: string;
    memberId: string;
    memberName: string;
    type: TransactionType;
    amount: number;
    cashback: number;
    date: string;
    description: string;
    employeeId: string;
}

export interface Employee {
    id: string;
    name: string;
    username: string;
    role: 'admin' | 'employee' | 'manager';
    branch: string;
    avatar?: string;
}

export interface TierInfo {
    name: string;
    nameAr: string;
    price: number;
    cashbackRate: number;    // نسبة الكاش باك
    maxCards: number;         // عدد البطاقات
    freeDeliveryMin: number; // الحد الأدنى للتوصيل المجاني (0 = بدون حد)
    color: string;
    gradient: string;
}

export const TIERS: Record<TierType, TierInfo> = {
    silver: {
        name: 'Silver',
        nameAr: 'الفضية',
        price: 199,
        cashbackRate: 0.02,
        maxCards: 2,
        freeDeliveryMin: 300,
        color: '#64748B',
        gradient: 'from-slate-600 to-slate-800',
    },
    gold: {
        name: 'Gold',
        nameAr: 'الذهبية',
        price: 399,
        cashbackRate: 0.05,
        maxCards: 4,
        freeDeliveryMin: 0,
        color: '#B8860B',
        gradient: 'from-amber-700 via-amber-600 to-yellow-700',
    },
};

// ============ DASHBOARD STATS ============
export interface DashboardStats {
    totalMembers: number;
    activeMembers: number;
    expiredMembers: number;
    newMembersThisMonth: number;
    renewalsThisMonth: number;
    totalRevenue: number;
    monthlyRevenue: number;
    totalCashbackPaid: number;
    cardsIssued: number;
}

// Saudi cities
export const SAUDI_CITIES = [
    'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام',
    'الخبر', 'الطائف', 'تبوك', 'بريدة', 'خميس مشيط',
    'حائل', 'نجران', 'جازان', 'ينبع', 'أبها',
];
