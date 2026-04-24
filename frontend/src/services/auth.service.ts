import { api } from './api';
import type { AuthSession, User } from '@/types';

const TOKEN_KEY = 'rotina_access_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function persistToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(email: string, password: string): Promise<AuthSession> {
  const data = await api.post<AuthSession>('/auth/login', { email, password });
  persistToken(data.access_token);
  return data;
}

export async function register(name: string, email: string, password: string): Promise<AuthSession> {
  const data = await api.post<AuthSession>('/auth/register', { name, email, password });
  persistToken(data.access_token);
  return data;
}

export async function getProfile(token: string): Promise<User> {
  return api.get<User>('/auth/profile', token);
}

export function logout(): void {
  clearToken();
}
