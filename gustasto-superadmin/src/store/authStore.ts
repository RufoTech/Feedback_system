import { create } from 'zustand';
import api from '../api/axios';

interface SuperAdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: SuperAdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // Backend api is /auth/login
      const response = await api.post('/auth/login', { email, password });
      const { access_token, admin } = response.data;
      
      // Ensure the user has super_admin role
      if (admin.role !== 'super_admin') {
        throw new Error('Sizin Super Admin panelinə giriş səlahiyyətiniz yoxdur');
      }

      localStorage.setItem('superadmin_token', access_token);
      localStorage.setItem('superadmin_user', JSON.stringify(admin));
      
      set({
        token: access_token,
        user: admin,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Giriş zamanı xəta baş verdi';
      set({
        error: message,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('superadmin_token');
    localStorage.removeItem('superadmin_user');
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },

  loadFromStorage: () => {
    const token = localStorage.getItem('superadmin_token');
    const userJson = localStorage.getItem('superadmin_user');
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        set({
          token,
          user,
          isAuthenticated: true,
        });
      } catch (e) {
        localStorage.removeItem('superadmin_token');
        localStorage.removeItem('superadmin_user');
      }
    }
  },
}));
