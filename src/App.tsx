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
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0A0F1E' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(6,182,212,0.2)', borderTopColor: '#06B6D4', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
      <p style={{ color: '#64748B', fontSize: 14 }}>جاري التحميل...</p>
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
