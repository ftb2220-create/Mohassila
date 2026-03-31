import type { Member, Transaction, Employee, DashboardStats } from '../types';

// ============ MOCK EMPLOYEES ============
export const mockEmployees: (Employee & { password: string })[] = [
    { id: 'emp-001', name: 'عبدالعزيز الشمري', username: 'admin', password: 'Admin@2026', role: 'admin', branch: 'الرياض - الفرع الرئيسي' },
    { id: 'emp-002', name: 'محمد العتيبي', username: 'mohammed', password: 'Mo@12345', role: 'manager', branch: 'جدة - فرع التحلية' },
    { id: 'emp-003', name: 'سارة القحطاني', username: 'sarah', password: 'Sara@2026', role: 'employee', branch: 'الرياض - فرع النخيل' },
];

// ============ MOCK MEMBERS ============
export const mockMembers: Member[] = [
    {
        id: 'mem-001',
        memberId: '1119283746',
        name: 'عبدالرحمن الدوسري',
        phone: '0501234567',
        email: 'abd@email.com',
        nationalId: '1089234567',
        tier: 'gold',
        status: 'active',
        joinDate: '2025-06-15',
        expiryDate: '2026-06-15',
        totalSpent: 45890,
        cashbackEarned: 2294.50,
        cashbackBalance: 856.30,
        points: 4589,
        cards: [
            { id: 'card-001', cardNumber: '4820-0001-1119-2837', holderName: 'عبدالرحمن الدوسري', type: 'primary', status: 'active', issuedDate: '2025-06-15', tier: 'gold' },
            { id: 'card-002', cardNumber: '4820-0002-1119-2837', holderName: 'نورة الدوسري', type: 'family', status: 'active', issuedDate: '2025-07-01', tier: 'gold' },
        ],
        familyMembers: [
            { id: 'fam-001', name: 'نورة الدوسري', relation: 'زوجة', phone: '0551234567', cardId: 'card-002' },
        ],
        notes: 'عميل VIP - يفضل التوصيل المسائي',
        city: 'الرياض',
        createdBy: 'emp-001',
    },
    {
        id: 'mem-002',
        memberId: '2029384756',
        name: 'سارة المطيري',
        phone: '0559876543',
        email: 'sara.m@email.com',
        nationalId: '1098765432',
        tier: 'silver',
        status: 'active',
        joinDate: '2026-01-10',
        expiryDate: '2027-01-10',
        totalSpent: 12450,
        cashbackEarned: 249.00,
        cashbackBalance: 249.00,
        points: 1245,
        cards: [
            { id: 'card-003', cardNumber: '4820-0003-2029-3847', holderName: 'سارة المطيري', type: 'primary', status: 'active', issuedDate: '2026-01-10', tier: 'silver' },
        ],
        familyMembers: [],
        notes: '',
        city: 'جدة',
        createdBy: 'emp-002',
    },
    {
        id: 'mem-003',
        memberId: '3039485867',
        name: 'فهد العنزي',
        phone: '0541112233',
        email: 'fahad@email.com',
        nationalId: '1076543210',
        tier: 'gold',
        status: 'active',
        joinDate: '2025-09-20',
        expiryDate: '2026-09-20',
        totalSpent: 78320,
        cashbackEarned: 3916.00,
        cashbackBalance: 1230.50,
        points: 7832,
        cards: [
            { id: 'card-004', cardNumber: '4820-0004-3039-4858', holderName: 'فهد العنزي', type: 'primary', status: 'active', issuedDate: '2025-09-20', tier: 'gold' },
            { id: 'card-005', cardNumber: '4820-0005-3039-4858', holderName: 'منى العنزي', type: 'family', status: 'active', issuedDate: '2025-10-01', tier: 'gold' },
            { id: 'card-006', cardNumber: '4820-0006-3039-4858', holderName: 'خالد العنزي', type: 'family', status: 'active', issuedDate: '2025-10-01', tier: 'gold' },
        ],
        familyMembers: [
            { id: 'fam-002', name: 'منى العنزي', relation: 'زوجة', phone: '0551112233', cardId: 'card-005' },
            { id: 'fam-003', name: 'خالد العنزي', relation: 'ابن', phone: '0561112233', cardId: 'card-006' },
        ],
        notes: 'يشتري بالجملة - صاحب مطعم',
        city: 'الدمام',
        createdBy: 'emp-001',
    },
    {
        id: 'mem-004',
        memberId: '4049596978',
        name: 'خالد الحربي',
        phone: '0573334455',
        email: 'khaled.h@email.com',
        nationalId: '1065432109',
        tier: 'silver',
        status: 'expired',
        joinDate: '2025-01-05',
        expiryDate: '2026-01-05',
        totalSpent: 8900,
        cashbackEarned: 178.00,
        cashbackBalance: 78.00,
        points: 890,
        cards: [
            { id: 'card-007', cardNumber: '4820-0007-4049-5969', holderName: 'خالد الحربي', type: 'primary', status: 'inactive', issuedDate: '2025-01-05', tier: 'silver' },
        ],
        familyMembers: [],
        notes: 'العضوية منتهية - يحتاج تجديد',
        city: 'الرياض',
        createdBy: 'emp-003',
    },
    {
        id: 'mem-005',
        memberId: '5059607089',
        name: 'نوف السبيعي',
        phone: '0585556677',
        email: 'nouf.s@email.com',
        nationalId: '1054321098',
        tier: 'gold',
        status: 'active',
        joinDate: '2025-11-01',
        expiryDate: '2026-11-01',
        totalSpent: 34560,
        cashbackEarned: 1728.00,
        cashbackBalance: 980.00,
        points: 3456,
        cards: [
            { id: 'card-008', cardNumber: '4820-0008-5059-6070', holderName: 'نوف السبيعي', type: 'primary', status: 'active', issuedDate: '2025-11-01', tier: 'gold' },
        ],
        familyMembers: [],
        notes: '',
        city: 'مكة المكرمة',
        createdBy: 'emp-002',
    },
    {
        id: 'mem-006',
        memberId: '6069718200',
        name: 'تركي الزهراني',
        phone: '0597778899',
        email: 'turki@email.com',
        nationalId: '1043210987',
        tier: 'silver',
        status: 'active',
        joinDate: '2026-02-14',
        expiryDate: '2027-02-14',
        totalSpent: 5670,
        cashbackEarned: 113.40,
        cashbackBalance: 113.40,
        points: 567,
        cards: [
            { id: 'card-009', cardNumber: '4820-0009-6069-7182', holderName: 'تركي الزهراني', type: 'primary', status: 'active', issuedDate: '2026-02-14', tier: 'silver' },
            { id: 'card-010', cardNumber: '4820-0010-6069-7182', holderName: 'هند الزهراني', type: 'family', status: 'active', issuedDate: '2026-02-20', tier: 'silver' },
        ],
        familyMembers: [
            { id: 'fam-004', name: 'هند الزهراني', relation: 'زوجة', phone: '0507778899', cardId: 'card-010' },
        ],
        notes: 'عضو جديد',
        city: 'الطائف',
        createdBy: 'emp-001',
    },
    {
        id: 'mem-007',
        memberId: '7079829311',
        name: 'ريم الغامدي',
        phone: '0508889900',
        email: 'reem.g@email.com',
        nationalId: '1032109876',
        tier: 'gold',
        status: 'suspended',
        joinDate: '2025-08-20',
        expiryDate: '2026-08-20',
        totalSpent: 22340,
        cashbackEarned: 1117.00,
        cashbackBalance: 0,
        points: 2234,
        cards: [
            { id: 'card-011', cardNumber: '4820-0011-7079-8293', holderName: 'ريم الغامدي', type: 'primary', status: 'inactive', issuedDate: '2025-08-20', tier: 'gold' },
        ],
        familyMembers: [],
        notes: 'العضوية معلقة - مراجعة مطلوبة',
        city: 'المدينة المنورة',
        createdBy: 'emp-002',
    },
    {
        id: 'mem-008',
        memberId: '8089930422',
        name: 'عبدالله القرني',
        phone: '0519990011',
        email: 'abdullah.q@email.com',
        nationalId: '1021098765',
        tier: 'gold',
        status: 'active',
        joinDate: '2025-04-10',
        expiryDate: '2026-04-10',
        totalSpent: 92150,
        cashbackEarned: 4607.50,
        cashbackBalance: 2100.00,
        points: 9215,
        cards: [
            { id: 'card-012', cardNumber: '4820-0012-8089-9304', holderName: 'عبدالله القرني', type: 'primary', status: 'active', issuedDate: '2025-04-10', tier: 'gold' },
            { id: 'card-013', cardNumber: '4820-0013-8089-9304', holderName: 'مها القرني', type: 'family', status: 'active', issuedDate: '2025-05-01', tier: 'gold' },
            { id: 'card-014', cardNumber: '4820-0014-8089-9304', holderName: 'ياسر القرني', type: 'family', status: 'active', issuedDate: '2025-05-01', tier: 'gold' },
            { id: 'card-015', cardNumber: '4820-0015-8089-9304', holderName: 'لين القرني', type: 'family', status: 'lost', issuedDate: '2025-05-01', tier: 'gold' },
        ],
        familyMembers: [
            { id: 'fam-005', name: 'مها القرني', relation: 'زوجة', phone: '0559990011', cardId: 'card-013' },
            { id: 'fam-006', name: 'ياسر القرني', relation: 'ابن', phone: '0569990011', cardId: 'card-014' },
            { id: 'fam-007', name: 'لين القرني', relation: 'ابنة', phone: '0579990011', cardId: 'card-015' },
        ],
        notes: 'عميل مميز - أعلى إنفاق في الفرع',
        city: 'الرياض',
        createdBy: 'emp-001',
    },
];

// ============ MOCK TRANSACTIONS ============
export const mockTransactions: Transaction[] = [
    { id: 'trx-001', memberId: 'mem-001', memberName: 'عبدالرحمن الدوسري', type: 'purchase', amount: 1250, cashback: 62.50, date: '2026-03-03', description: 'مشتريات - فرع الرياض', employeeId: 'emp-001' },
    { id: 'trx-002', memberId: 'mem-003', memberName: 'فهد العنزي', type: 'purchase', amount: 3800, cashback: 190.00, date: '2026-03-03', description: 'مشتريات بالجملة - فرع الدمام', employeeId: 'emp-001' },
    { id: 'trx-003', memberId: 'mem-005', memberName: 'نوف السبيعي', type: 'renewal', amount: 399, cashback: 0, date: '2026-03-02', description: 'تجديد عضوية ذهبية', employeeId: 'emp-002' },
    { id: 'trx-004', memberId: 'mem-002', memberName: 'سارة المطيري', type: 'purchase', amount: 890, cashback: 17.80, date: '2026-03-02', description: 'مشتريات - فرع جدة', employeeId: 'emp-002' },
    { id: 'trx-005', memberId: 'mem-006', memberName: 'تركي الزهراني', type: 'purchase', amount: 2100, cashback: 42.00, date: '2026-03-01', description: 'مشتريات - فرع الطائف', employeeId: 'emp-001' },
    { id: 'trx-006', memberId: 'mem-008', memberName: 'عبدالله القرني', type: 'cashback', amount: 500, cashback: 0, date: '2026-03-01', description: 'استرداد كاش باك', employeeId: 'emp-001' },
    { id: 'trx-007', memberId: 'mem-001', memberName: 'عبدالرحمن الدوسري', type: 'purchase', amount: 4200, cashback: 210.00, date: '2026-02-28', description: 'مشتريات بالجملة', employeeId: 'emp-003' },
    { id: 'trx-008', memberId: 'mem-004', memberName: 'خالد الحربي', type: 'refund', amount: 350, cashback: -7.00, date: '2026-02-27', description: 'استرجاع منتج', employeeId: 'emp-003' },
];

// ============ DASHBOARD STATS ============
export const mockDashboardStats: DashboardStats = {
    totalMembers: 8,
    activeMembers: 6,
    expiredMembers: 1,
    newMembersThisMonth: 1,
    renewalsThisMonth: 3,
    totalRevenue: 287450,
    monthlyRevenue: 42890,
    totalCashbackPaid: 14203.40,
    cardsIssued: 15,
};

// ============ UTILITY FUNCTIONS ============
export function generateMemberId(): string {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

export function generateCardNumber(memberId: string, seq: number): string {
    const seqStr = seq.toString().padStart(4, '0');
    const mid = memberId.substring(0, 4);
    const mid2 = memberId.substring(4, 8);
    return `4820-${seqStr}-${mid}-${mid2}`;
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ar-SA', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount) + ' ر.س';
}

export function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function isExpiringSoon(expiryDate: string): boolean {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30;
}

export function daysUntilExpiry(expiryDate: string): number {
    const expiry = new Date(expiryDate);
    const now = new Date();
    return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}
