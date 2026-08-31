import React, { createContext, useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiPut } from '../utils/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Verifikasi token yang ada saat inisialisasi aplikasi
  const fetchCurrentUser = useCallback(async () => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiGet('/api/auth/me');
      if (response && response.success && response.data?.user) {
        setUser(response.data.user);
      } else {
        // Token tidak valid
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.warn('Gagal memverifikasi token:', error.message);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Login handler
  const login = async (email, password) => {
    const response = await apiPost('/api/auth/login', { email, password });
    if (response && response.success && response.data) {
      const { user: loggedInUser, token: authToken } = response.data;
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(loggedInUser);
      return response;
    }
    throw new Error(response?.message || 'Login gagal');
  };

  // Register handler
  const register = async (nama, email, password, role = 'pelanggan') => {
    const response = await apiPost('/api/auth/register', { nama, email, password, role });
    if (response && response.success && response.data) {
      const { user: registeredUser, token: authToken } = response.data;
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(registeredUser);
      return response;
    }
    throw new Error(response?.message || 'Registrasi gagal');
  };

  // Update profile handler
  const updateProfile = async ({ nama, passwordLama, passwordBaru }) => {
    const response = await apiPut('/api/auth/profile', { nama, passwordLama, passwordBaru });
    if (response && response.success && response.data) {
      setUser(response.data.user);
      return response;
    }
    throw new Error(response?.message || 'Gagal memperbarui profil');
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: Boolean(user && token),
    isAdmin: Boolean(user && user.role === 'admin'),
    isPelanggan: Boolean(user && user.role === 'pelanggan'),
    login,
    register,
    updateProfile,
    logout,
    refreshUser: fetchCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
