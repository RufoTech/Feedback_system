import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getProfile, loginApi } from '../api/auth';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  restaurantId?: string;
}

interface AuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  step: 'credentials' | 'verify';
  sessionId: string | null;
  adminEmail: string;
  sendCode: (email: string, password: string) => Promise<void>;
  verifyCode: (code: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [step, setStep] = useState<'credentials' | 'verify'>('credentials');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>('');

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('admin_token');
      if (storedToken) {
        try {
          const adminData = await getProfile(storedToken);
          setAdmin({
            id: adminData._id || adminData.id,
            email: adminData.email,
            name: adminData.name,
            role: adminData.role,
            restaurantId: adminData.restaurantId,
          });
          setToken(storedToken);
        } catch (error) {
          console.error('Sessiyanın davam etdirilməsində xəta:', error);
          localStorage.removeItem('admin_token');
          setAdmin(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const sendCode = useCallback(async (email: string, password: string) => {
    try {
      const data = await loginApi(email, password);
      const userToken = data.access_token;

      localStorage.setItem('admin_token', userToken);
      setToken(userToken);
      setAdmin({
        id: data.admin.id || data.admin._id,
        email: data.admin.email,
        name: data.admin.name,
        role: data.admin.role,
        restaurantId: data.admin.restaurantId,
      });
      setStep('credentials');
    } catch (error) {
      throw error;
    }
  }, []);

  const verifyCode = useCallback(async () => {
    // Müvəqqəti olaraq OTP dövriyyədən çıxarıldığı üçün bu funksiyaya ehtiyac yoxdur
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    setAdmin(null);
    setToken(null);
    setStep('credentials');
    setSessionId(null);
    setAdminEmail('');
  }, []);

  return (
    <AuthContext.Provider value={{
      admin, token, isAuthenticated: !!token && !!admin, isLoading,
      step, sessionId, adminEmail,
      sendCode, verifyCode, logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth mütləq AuthProvider daxilində istifadə edilməlidir');
  }
  return context;
};
