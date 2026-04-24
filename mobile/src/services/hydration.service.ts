import { api } from './api';
import { HydrationSummary, HydrationGoal, HydrationLog } from '../types';

export async function getToday(): Promise<HydrationSummary> {
  const { data } = await api.get<HydrationSummary>('/hydration/today');
  return data;
}

export async function getGoal(): Promise<HydrationGoal> {
  const { data } = await api.get<HydrationGoal>('/hydration/goal');
  return data;
}

export async function updateGoal(payload: Partial<HydrationGoal>): Promise<HydrationGoal> {
  const { data } = await api.put<HydrationGoal>('/hydration/goal', payload);
  return data;
}

export async function addLog(amount_ml: number): Promise<HydrationLog> {
  const { data } = await api.post<HydrationLog>('/hydration/logs', { amount_ml });
  return data;
}

export async function deleteLog(id: string): Promise<void> {
  await api.delete(`/hydration/logs/${id}`);
}
