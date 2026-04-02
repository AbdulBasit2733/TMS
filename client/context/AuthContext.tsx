'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

interface AuthUser { id: string; email: string; }
interface AuthCtx {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

// Decode userId + email from JWT payload (safe for display, not for security)
function decodeJwt(token: string): AuthUser | null {
  try {
    const p = JSON.parse(atob(token.split('.')[1]));
    return { id: p.userId, email: p.email ?? '' };
  } catch { return null; }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // On every page load: try silent refresh with httpOnly cookie
  // This is how the session persists after browser refresh
  useEffect(() => {
    authService.refresh().then((token) => {
      if (token) setUser(decodeJwt(token));
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const token = await authService.login(email, password);
    setUser(decodeJwt(token));
    router.push('/dashboard');
  }, [router]);

  const register = useCallback(async (email: string, password: string) => {
    await authService.register(email, password);
    // After register, redirect to login (no auto-login since backend only returns userId)
    router.push('/login?registered=true');
  }, [router]);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <Ctx.Provider value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};