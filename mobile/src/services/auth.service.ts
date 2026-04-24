import { api } from './api';
import { User, Session } from '../types';

export async function register(name: string, email: string, password: string) {
  const { data } = await api.post<{ user: User; session: Session | null }>('/auth/register', { name, email, password });
  return data;
}

export async function login(email: string, password: string) {
  const { data } = await api.post<{ user: User; session: Session }>('/auth/login', { email, password });
  return data;
}

export async function getProfile(): Promise<User> {
  const { data } = await api.get<User>('/auth/profile');
  return data;
}

export async function updateProfile(updates: Partial<Pick<User, 'name' | 'avatar_url' | 'weight' | 'height'>>) {
  const { data } = await api.put<User>('/auth/profile', updates);
  return data;
}
