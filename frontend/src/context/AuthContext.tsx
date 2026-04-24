import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import * as authService from '@/services/auth.service';
import type { User } from '@/types';

interface AuthContextValue {
  user:    User | null;
  token:   string | null;
  loading: boolean;
  login:   (email: string, password: string) => Promise<void>;
  register:(name: string, email: string, password: string) => Promise<void>;
  logout:  () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [token,   setToken]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* Restore session on mount */
  useEffect(() => {
    const stored = authService.getStoredToken();
    if (!stored) { setLoading(false); return; }

    authService.getProfile(stored)
      .then((profile) => { setUser(profile); setToken(stored); })
      .catch(() => authService.logout())
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const session = await authService.login(email, password);
    setToken(session.access_token);
    setUser(session.user);
  }

  async function register(name: string, email: string, password: string) {
    const session = await authService.register(name, email, password);
    setToken(session.access_token);
    setUser(session.user);
  }

  function logout() {
    authService.logout();
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
