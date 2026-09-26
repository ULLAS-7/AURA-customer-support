'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthStateShape {
  user: User | null;
  demoMode: boolean;
  isHydrated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  enableDemoMode: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthStateShape | null>(null);
const AUTH_STORAGE_KEY = 'aura-auth-v1';
const DEMO_USER: User = {
  id: 'demo-001',
  name: 'Demo Visitor',
  email: 'demo@aura.inc',
  role: 'admin',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.user) setUser(parsed.user);
        if (parsed.demoMode) setDemoMode(parsed.demoMode);
      }
    } catch {
      // ignore
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, demoMode }));
    } catch {
      // ignore
    }
  }, [user, demoMode, isHydrated]);

  useEffect(() => {
    // Route guarding
    if (!isHydrated) return;
    const publicPaths = ['/login', '/register', '/'];
    if (!user && !demoMode && !publicPaths.includes(pathname)) {
      router.push('/login');
    }
  }, [user, demoMode, isHydrated, pathname, router]);

  const login = async (email: string, password: string) => {
    // Mock login
    if (email && password) {
      setUser({
        id: 'user-' + Date.now(),
        name: email.split('@')[0],
        email,
        role: email.includes('admin') ? 'admin' : 'user',
      });
      setDemoMode(false);
      router.push('/dashboard');
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string) => {
    // Mock register
    if (name && email && password) {
      setUser({
        id: 'user-' + Date.now(),
        name,
        email,
        role: email.includes('admin') ? 'admin' : 'user',
      });
      setDemoMode(false);
      router.push('/dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setDemoMode(false);
    router.push('/login');
  };

  const enableDemoMode = () => {
    setDemoMode(true);
    setUser(DEMO_USER);
    router.push('/dashboard');
  };

  const updateProfile = (data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        demoMode,
        isHydrated,
        login,
        register,
        logout,
        enableDemoMode,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
