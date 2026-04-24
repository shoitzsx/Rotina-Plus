import { api } from './api';
import { Habit, HabitWithCompletion } from '../types';

export async function getHabits(): Promise<Habit[]> {
  const { data } = await api.get<Habit[]>('/habits');
  return data;
}

export async function getTodayHabits(): Promise<HabitWithCompletion[]> {
  const { data } = await api.get<HabitWithCompletion[]>('/habits/today');
  return data;
}

export async function createHabit(payload: Omit<Habit, 'id' | 'user_id' | 'created_at'>): Promise<Habit> {
  const { data } = await api.post<Habit>('/habits', payload);
  return data;
}

export async function updateHabit(id: string, payload: Partial<Habit>): Promise<Habit> {
  const { data } = await api.put<Habit>(`/habits/${id}`, payload);
  return data;
}

export async function deleteHabit(id: string): Promise<void> {
  await api.delete(`/habits/${id}`);
}

export async function completeHabit(id: string): Promise<void> {
  await api.post(`/habits/${id}/complete`);
}

export async function uncompleteHabit(id: string): Promise<void> {
  await api.delete(`/habits/${id}/complete`);
}
