"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string, redirectPath?: string) => Promise<any>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  apiFetch: (url: string, options?: RequestInit) => Promise<Response>;
  currency: string;
  updateCurrency: (code: string) => void;
  updateProfile: (name: string, email: string, password?: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState('USD');
  const router = useRouter();

  // Helper to handle API requests with Bearer token header injection
  const apiFetch = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return fetch(url, { ...options, headers });
  };

  const handleRefresh = async () => {
    try {
      const res = await fetch('/api/v1/auth/refresh', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setAccessToken(data.accessToken);
        return data.accessToken;
      } else {
        setUser(null);
        setAccessToken(null);
      }
    } catch (err) {
      console.error('Silent refresh failed:', err);
    }
    return null;
  };

  // Run silent refresh and fetch currency settings on mount
  useEffect(() => {
    const initAuth = async () => {
      await handleRefresh();
      setLoading(false);
    };
    initAuth();

    // Fetch site currency settings
    fetch('/api/v1/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings?.currencyCode) {
          setCurrency(data.settings.currencyCode);
        }
      })
      .catch((err) => console.error('Failed to load context currency:', err));
  }, []);

  // Set up token auto-refresh timer (every 14 minutes)
  useEffect(() => {
    if (!accessToken) return;

    const interval = setInterval(async () => {
      await handleRefresh();
    }, 14 * 60 * 1000); // 14 minutes

    return () => clearInterval(interval);
  }, [accessToken]);

  const login = async (email: string, password: string, redirectPath?: string) => {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || 'Login failed');
    }

    setUser(data.user);
    setAccessToken(data.accessToken);

    const path = (redirectPath && redirectPath !== '/')
      ? redirectPath
      : (data.user.role === 'ADMIN' ? '/admin' : '/');
    router.push(path);

    return data.user;
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || 'Registration failed');
    }

    // Auto login after registration
    await login(email, password);
  };

  const updateProfile = async (name: string, email: string, password?: string) => {
    const res = await apiFetch('/api/v1/auth/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || 'Profile update failed.');
    }

    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setAccessToken(null);
      router.push('/login');
    }
  };

  const updateCurrency = (code: string) => {
    setCurrency(code);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, register, logout, apiFetch, currency, updateCurrency, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
