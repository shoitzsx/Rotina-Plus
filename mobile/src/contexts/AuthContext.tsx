import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types';
import * as authService from '../services/auth.service';

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  signIn:  (email: string, password: string) => Promise<void>;
  signUp:  (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]           = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      if (token) {
        const profile = await authService.getProfile();
        setUser(profile);
      }
    } catch {
      await SecureStore.deleteItemAsync('access_token');
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    const { user: u, session } = await authService.login(email, password);
    await SecureStore.setItemAsync('access_token', session.access_token);
    setUser(u as User);
  }

  async function signUp(name: string, email: string, password: string) {
    const { session } = await authService.register(name, email, password);
    if (session) {
      await SecureStore.setItemAsync('access_token', session.access_token);
      const profile = await authService.getProfile();
      setUser(profile);
    }
  }

  async function signOut() {
    await SecureStore.deleteItemAsync('access_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
