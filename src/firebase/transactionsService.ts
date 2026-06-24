// ============ TRANSACTIONS SERVICE ============
// خدمة العمليات المالية

import {
    collection, addDoc, getDocs, query, orderBy, onSnapshot,
    type Unsubscribe, Timestamp, serverTimestamp
} from 'firebase/firestore';
import { db } from './config';
import type { Transaction, TransactionType } from '../types';

const TRANSACTIONS_COLLECTION = 'transactions';

function transactionFromFirestore(id: string, data: Record<string, unknown>): Transaction {
    return {
        id,
        memberId: data.memberId as string || '',
        memberName: data.memberName as string || '',
        type: data.type as TransactionType || 'purchase',
        amount: data.amount as number || 0,
        cashback: data.cashback as number || 0,
        date: data.date instanceof Timestamp
            ? data.date.toDate().toISOString().split('T')[0]
            : data.date as string || '',
        description: data.description as string || '',
        employeeId: data.employeeId as string || '',
    };
}

/**
 * جلب جميع العمليات
 */
export async function fetchTransactions(): Promise<Transaction[]> {
    const q = query(collection(db, TRANSACTIONS_COLLECTION), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => transactionFromFirestore(d.id, d.data()));
}

/**
 * مراقبة العمليات في الوقت الحقيقي
 */
export function subscribeToTransactions(
    callback: (transactions: Transaction[]) => void,
    onError?: (error: any) => void
): Unsubscribe {
    const q = query(collection(db, TRANSACTIONS_COLLECTION), orderBy('date', 'desc'));
    return onSnapshot(q, {
        next: (snapshot) => {
            const transactions = snapshot.docs.map(d => transactionFromFirestore(d.id, d.data()));
            callback(transactions);
        },
        error: (err) => {
            console.error("subscribeToTransactions error:", err);
            if (onError) onError(err);
        }
    });
}

/**
 * إضافة عملية جديدة
 */
export async function createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const docData = {
        ...transaction,
        createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), docData);
    return { id: docRef.id, ...transaction };
}
