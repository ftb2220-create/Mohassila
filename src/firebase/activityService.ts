// ============ ACTIVITY LOG SERVICE ============
// خدمة سجل النشاط

import {
    collection, addDoc, getDocs, query, orderBy, limit,
    onSnapshot, serverTimestamp, Timestamp, type Unsubscribe
} from 'firebase/firestore';
import { db } from './config';
import type { ActivityEntry } from '../contexts/MembersContext';

const ACTIVITY_COLLECTION = 'activityLog';

function activityFromFirestore(id: string, data: Record<string, unknown>): ActivityEntry {
    return {
        id,
        action: data.action as string || '',
        details: data.details as string || '',
        performedBy: data.performedBy as string || '',
        timestamp: data.timestamp instanceof Timestamp
            ? data.timestamp.toDate().toISOString()
            : data.timestamp as string || new Date().toISOString(),
        type: data.type as ActivityEntry['type'] || 'other',
    };
}

/**
 * جلب سجل النشاط
 */
export async function fetchActivityLog(maxEntries = 50): Promise<ActivityEntry[]> {
    const q = query(
        collection(db, ACTIVITY_COLLECTION),
        orderBy('timestamp', 'desc'),
        limit(maxEntries)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => activityFromFirestore(d.id, d.data()));
}

/**
 * مراقبة سجل النشاط في الوقت الحقيقي
 */
export function subscribeToActivityLog(
    callback: (entries: ActivityEntry[]) => void,
    maxEntries = 50
): Unsubscribe {
    const q = query(
        collection(db, ACTIVITY_COLLECTION),
        orderBy('timestamp', 'desc'),
        limit(maxEntries)
    );
    return onSnapshot(q, (snapshot) => {
        const entries = snapshot.docs.map(d => activityFromFirestore(d.id, d.data()));
        callback(entries);
    });
}

/**
 * إضافة نشاط جديد
 */
export async function addActivityEntry(entry: Omit<ActivityEntry, 'id' | 'timestamp'>): Promise<void> {
    await addDoc(collection(db, ACTIVITY_COLLECTION), {
        ...entry,
        timestamp: serverTimestamp(),
    });
}
