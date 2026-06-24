// ============ AUTHENTICATION SERVICE ============
// خدمة المصادقة - تسجيل الدخول والخروج

import { signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, inMemoryPersistence, reauthenticateWithCredential, EmailAuthProvider, updatePassword, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import type { Employee } from '../types';

/**
 * تسجيل دخول الموظف
 * نستخدم email-based auth من Firebase مع ربط بـ employee document
 * Username يتحول لـ email format: username@mohassila.app
 */
export async function loginEmployee(username: string, password: string): Promise<Employee> {
    const email = `${username}@mohassila.app`;
    
    // تعيين الجلسة في الذاكرة لتنتهي عند تحديث الصفحة أو إغلاق المتصفح
    await setPersistence(auth, inMemoryPersistence);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const employee = await getEmployeeByUid(userCredential.user.uid);
    if (!employee) {
        throw new Error('لم يتم العثور على بيانات الموظف');
    }
    return employee;
}

/**
 * تسجيل الخروج
 */
export async function logoutEmployee(): Promise<void> {
    await signOut(auth);
}

/**
 * جلب بيانات الموظف من Firestore عبر UID
 */
export async function getEmployeeByUid(uid: string): Promise<Employee | null> {
    const docRef = doc(db, 'employees', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Employee;
    }
    return null;
}

/**
 * مراقبة حالة المصادقة
 */
export function onAuthChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}

/**
 * تغيير كلمة مرور الموظف الحالي
 * يتحقق أولاً من كلمة المرور الحالية عبر إعادة المصادقة، ثم يحدّث كلمة المرور
 */
export async function changeEmployeePassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = auth.currentUser;
    if (!user || !user.email) {
        throw new Error('لا يوجد مستخدم مسجّل دخول');
    }

    // إعادة المصادقة للتحقق من كلمة المرور الحالية
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // تحديث كلمة المرور
    await updatePassword(user, newPassword);
}
