import api from './client';
import type { User } from '../types';

interface AuthResponse {
  accessToken: string;
  user: User;
}

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<{ message: string }>('/api/auth/register', data),

  verifyEmail: (token: string) =>
    api.post<{ message: string }>('/api/auth/verify-email', { token }),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/api/auth/login', data),

  refresh: () =>
    api.post<{ accessToken: string }>('/api/auth/refresh'),

  logout: () =>
    api.post<{ message: string }>('/api/auth/logout'),

  forgotPassword: (email: string) =>
    api.post<{ message: string }>('/api/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post<{ message: string }>('/api/auth/reset-password', { token, password }),

  getMe: () =>
    api.get<{ user: User }>('/api/auth/me'),
};
