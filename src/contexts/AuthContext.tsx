import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Employee } from '../types';
import { loginEmployee, logoutEmployee, onAuthChange, getEmployeeByUid } from '../firebase/authService';
import { useToast } from './ToastContext';

interface AuthContextType {
    employee: Employee | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const login = useCallback(async (username: string, password: string): Promise<boolean> => {
        try {
            const emp = await loginEmployee(username, password);
            setEmployee(emp);
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await logoutEmployee();
            setEmployee(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }, []);

    // مراقبة حالة المصادقة عند تحميل التطبيق
    useEffect(() => {
        const unsubscribe = onAuthChange(async (user) => {
            if (user) {
                try {
                    const emp = await getEmployeeByUid(user.uid);
                    setEmployee(emp);
                } catch (error) {
                    console.error('Error fetching employee data:', error);
                    setEmployee(null);
                }
            } else {
                setEmployee(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // مراقبة نشاط المستخدم لتسجيل الخروج تلقائياً بعد فترة خمول (15 دقيقة)
    useEffect(() => {
        if (!employee) return;

        const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 دقيقة بالملي ثانية
        let timeoutId: any;

        const resetTimer = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                logout();
                showToast('تم تسجيل الخروج تلقائياً لعدم النشاط لفترة طويلة حفاظاً على أمان بياناتك.', 'warning');
            }, INACTIVITY_TIMEOUT);
        };

        const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        
        activityEvents.forEach(event => {
            window.addEventListener(event, resetTimer);
        });

        resetTimer();

        return () => {
            clearTimeout(timeoutId);
            activityEvents.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [employee, logout, showToast]);

    return (
        <AuthContext.Provider value={{ employee, login, logout, isAuthenticated: !!employee, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
