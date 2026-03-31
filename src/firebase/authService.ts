// ============ AUTHENTICATION SERVICE ============
// خدمة المصادقة - تسجيل الدخول والخروج

import { signInWithEmailAndPassword, signOut, onAuthStateChanged, type User } from 'firebase/auth';
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
