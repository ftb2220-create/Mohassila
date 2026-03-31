import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Employee } from '../types';
import { mockEmployees } from '../data/mockData';

interface AuthContextType {
    employee: Employee | null;
    login: (username: string, password: string) => boolean;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [employee, setEmployee] = useState<Employee | null>(() => {
        const saved = localStorage.getItem('mohassila_employee');
        return saved ? JSON.parse(saved) : null;
    });

    const login = useCallback((username: string, password: string) => {
        const emp = mockEmployees.find(e => e.username === username && e.password === password);
        if (emp) {
            const { password: _pw, ...empData } = emp;
            setEmployee(empData);
            localStorage.setItem('mohassila_employee', JSON.stringify(empData));
            return true;
        }
        return false;
    }, []);

    const logout = useCallback(() => {
        setEmployee(null);
        localStorage.removeItem('mohassila_employee');
    }, []);

    return (
        <AuthContext.Provider value={{ employee, login, logout, isAuthenticated: !!employee }}>
            {children}
        </AuthContext.Provider>
    );
};
