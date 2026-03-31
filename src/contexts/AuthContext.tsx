import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Employee } from '../types';
import { loginEmployee, logoutEmployee, onAuthChange, getEmployeeByUid } from '../firebase/authService';

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

    return (
        <AuthContext.Provider value={{ employee, login, logout, isAuthenticated: !!employee, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
