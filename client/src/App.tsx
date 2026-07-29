import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/auth.api';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { VerifyEmailPage } from '@/pages/VerifyEmailPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { ChatPage } from '@/pages/ChatPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppInitializer() {
  const { isAuthenticated, setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      if (!isAuthenticated) return;
      try {
        const { data: refreshData } = await authApi.refresh();
        const { data: meData } = await authApi.getMe();
        setAuth(meData.user, refreshData.accessToken);
      } catch {
        clearAuth();
      }
    };

    initAuth();
  }, []);

  return null;
}

export default function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <BrowserRouter>
      <AppInitializer />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'hsl(240 10% 8%)',
            border: '1px solid hsl(240 3.7% 15.9%)',
            color: 'hsl(0 0% 98%)',
          },
        }}
      />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:id"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
