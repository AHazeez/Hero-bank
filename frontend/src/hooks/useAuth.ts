import { useState, useEffect, useCallback } from 'react';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../types';
import apiService from '../services/api';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      setLoading(true);
      const currentUser = await apiService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);
      const authResponse: AuthResponse = await apiService.login(credentials);
      
      localStorage.setItem('authToken', authResponse.token);
      localStorage.setItem('user', JSON.stringify(authResponse.user));
      setUser(authResponse.user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setLoading(true);
      setError(null);
      const authResponse: AuthResponse = await apiService.register(userData);
      
      localStorage.setItem('authToken', authResponse.token);
      localStorage.setItem('user', JSON.stringify(authResponse.user));
      setUser(authResponse.user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
};
