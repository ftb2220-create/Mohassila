// ============ SEED DATA SERVICE ============
// خدمة تعبئة البيانات الأولية في Firestore
// تُستخدم مرة واحدة فقط لنقل البيانات الوهمية إلى قاعدة البيانات

import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from './config';
import { mockMembers, mockTransactions, mockEmployees } from '../data/mockData';

/**
 * تعبئة بيانات الموظفين + إنشاء حسابات Auth
 * ⚠️ تُستخدم مرة واحدة فقط
 */
export async function seedEmployees(): Promise<void> {
    for (const emp of mockEmployees) {
        try {
            const email = `${emp.username}@mohassila.app`;
            // إنشاء حساب في Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, emp.password);
            // حفظ بيانات الموظف في Firestore (بدون كلمة المرور)
            const { password: _pw, ...empData } = emp;
            await setDoc(doc(db, 'employees', userCredential.user.uid), {
                ...empData,
                email,
            });
            console.log(`✅ تم إنشاء حساب: ${emp.name} (${emp.username})`);
        } catch (error: unknown) {
            const err = error as { code?: string };
            if (err.code === 'auth/email-already-in-use') {
                console.log(`⚠️ الحساب موجود مسبقاً: ${emp.username}`);
            } else {
                console.error(`❌ خطأ في إنشاء حساب ${emp.username}:`, error);
            }
        }
    }
}

/**
 * تعبئة بيانات الأعضاء
 */
export async function seedMembers(): Promise<void> {
    for (const member of mockMembers) {
        try {
            await setDoc(doc(db, 'members', member.id), member);
            console.log(`✅ تم إضافة عضو: ${member.name}`);
        } catch (error) {
            console.error(`❌ خطأ في إضافة ${member.name}:`, error);
        }
    }
}

/**
 * تعبئة بيانات العمليات
 */
export async function seedTransactions(): Promise<void> {
    for (const trx of mockTransactions) {
        try {
            await setDoc(doc(db, 'transactions', trx.id), trx);
            console.log(`✅ تم إضافة عملية: ${trx.id}`);
        } catch (error) {
            console.error(`❌ خطأ في إضافة عملية ${trx.id}:`, error);
        }
    }
}

/**
 * تعبئة جميع البيانات
 */
export async function seedAllData(): Promise<void> {
    console.log('🔄 بدء تعبئة البيانات...');
    
    // تحقق إذا البيانات موجودة مسبقاً
    const membersSnap = await getDocs(collection(db, 'members'));
    if (membersSnap.size > 0) {
        console.log(`⚠️ البيانات موجودة مسبقاً (${membersSnap.size} عضو). هل تريد المتابعة؟`);
    }

    await seedEmployees();
    await seedMembers();
    await seedTransactions();
    console.log('✅ تم تعبئة جميع البيانات بنجاح!');
}
