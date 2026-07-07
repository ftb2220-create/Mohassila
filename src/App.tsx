import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MembersProvider } from './contexts/MembersContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { ToastProvider } from './contexts/ToastContext';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import MembersPage from './pages/MembersPage';
import MemberDetailPage from './pages/MemberDetailPage';
import NewMemberPage from './pages/NewMemberPage';
import CardsPage from './pages/CardsPage';
import TransactionsPage from './pages/TransactionsPage';
import SettingsPage from './pages/SettingsPage';

const LoadingScreen: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #0A0F1E 0%, #111827 40%, #0F172A 100%)' }}>
    <div style={{ textAlign: 'center' }}>
      {/* Logo with pulse */}
      <div style={{ marginBottom: 20, animation: 'logoPulse 2s ease-in-out infinite' }}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="loadGrad" x1="0" y1="0" x2="64" y2="64">
              <stop offset="0%" stopColor="#0A0F1E" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="loadGoldGrad" x1="16" y1="16" x2="48" y2="48">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#loadGrad)" stroke="#06B6D4" strokeWidth="1.5" />
          <path d="M18 34L25 41L33 22" stroke="url(#loadGoldGrad)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M38 41V28" stroke="url(#loadGoldGrad)" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M46 41V16" stroke="url(#loadGoldGrad)" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <circle cx="46" cy="16" r="2.5" fill="#FDE047" />
        </svg>
      </div>
      <p style={{ color: '#94A3B8', fontSize: 14, fontWeight: 600 }}>جاري التحميل...</p>
      {/* Loading bar */}
      <div style={{ width: 120, height: 3, borderRadius: 4, background: 'rgba(255,255,255,0.06)', margin: '14px auto 0', overflow: 'hidden' }}>
        <div style={{ width: '40%', height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #06B6D4, #0D9488)', animation: 'loadingSlide 1.2s ease-in-out infinite' }} />
      </div>
      <style>{`
        @keyframes logoPulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.85; } }
        @keyframes loadingSlide { 0% { transform: translateX(-100%); } 100% { transform: translateX(350%); } }
      `}</style>
    </div>
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider>
            <MembersProvider>
              <NotificationsProvider>
                <Routes>
                  {/* Public Routes */}
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <LoginPage />
                      </PublicRoute>
                    }
                  />

                  {/* Protected Dashboard Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<DashboardPage />} />
                    <Route path="members" element={<MembersPage />} />
                    <Route path="members/new" element={<NewMemberPage />} />
                    <Route path="members/:id" element={<MemberDetailPage />} />
                    <Route path="cards" element={<CardsPage />} />
                    <Route path="transactions" element={<TransactionsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Route>

                  {/* Default redirect */}
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </NotificationsProvider>
            </MembersProvider>
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
