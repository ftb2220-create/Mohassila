// ============ ROLE-BASED PERMISSIONS ============
// مدير النظام (admin): صلاحيات كاملة
// مشرف (manager): كل شي ماعدا الحذف
// موظف (employee): عرض + إضافة عضو + تجديد عضوية

type Role = 'admin' | 'manager' | 'employee';

export interface Permissions {
    canAddMember: boolean;          // إضافة عضو جديد
    canDeleteMember: boolean;       // حذف عضو
    canEditMember: boolean;         // تعديل بيانات العضو (ترقية، تعليق، تفعيل)
    canRenewMembership: boolean;    // تجديد العضوية
    canManageCards: boolean;        // صفحة إدارة البطاقات
    canIssueCard: boolean;          // إصدار بطاقة جديدة
    canViewTransactions: boolean;   // عرض سجل العمليات
    canViewMembers: boolean;        // عرض قائمة الأعضاء
    canViewDashboard: boolean;      // عرض لوحة التحكم
}

const ROLE_PERMISSIONS: Record<Role, Permissions> = {
    admin: {
        canAddMember: true,
        canDeleteMember: true,
        canEditMember: true,
        canRenewMembership: true,
        canManageCards: true,
        canIssueCard: true,
        canViewTransactions: true,
        canViewMembers: true,
        canViewDashboard: true,
    },
    manager: {
        canAddMember: true,
        canDeleteMember: false,
        canEditMember: true,
        canRenewMembership: true,
        canManageCards: true,
        canIssueCard: true,
        canViewTransactions: true,
        canViewMembers: true,
        canViewDashboard: true,
    },
    employee: {
        canAddMember: true,
        canDeleteMember: false,
        canEditMember: false,
        canRenewMembership: true,
        canManageCards: false,
        canIssueCard: false,
        canViewTransactions: true,
        canViewMembers: true,
        canViewDashboard: true,
    },
};

export const getPermissions = (role: Role | undefined): Permissions => {
    if (!role) return ROLE_PERMISSIONS.employee; // default to least privileges
    return ROLE_PERMISSIONS[role];
};
