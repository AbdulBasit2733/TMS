'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { authService, AuthUser } from '@/services/authService';

interface AuthCtx {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    authService.refresh().then((authUser) => {
      setUser(authUser);
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const authUser = await authService.login(email, password);
      setUser(authUser);
      router.push('/dashboard');
    },
    [router]
  );

  const register = useCallback(
    async (email: string, password: string) => {
      await authService.register(email, password);
      router.push('/login?registered=true');
    },
    [router]
  );

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <Ctx.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};