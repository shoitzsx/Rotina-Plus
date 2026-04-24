import { api } from './api';
import { Transaction, TransactionCategory, FinanceSummary } from '../types';

export async function getTransactions(params?: { month?: number; year?: number; type?: string }): Promise<Transaction[]> {
  const { data } = await api.get<Transaction[]>('/finances/transactions', { params });
  return data;
}

export async function createTransaction(payload: Omit<Transaction, 'id' | 'user_id' | 'created_at'>): Promise<Transaction> {
  const { data } = await api.post<Transaction>('/finances/transactions', payload);
  return data;
}

export async function updateTransaction(id: string, payload: Partial<Transaction>): Promise<Transaction> {
  const { data } = await api.put<Transaction>(`/finances/transactions/${id}`, payload);
  return data;
}

export async function deleteTransaction(id: string): Promise<void> {
  await api.delete(`/finances/transactions/${id}`);
}

export async function getCategories(): Promise<TransactionCategory[]> {
  const { data } = await api.get<TransactionCategory[]>('/finances/categories');
  return data;
}

export async function createCategory(payload: Omit<TransactionCategory, 'id' | 'user_id'>): Promise<TransactionCategory> {
  const { data } = await api.post<TransactionCategory>('/finances/categories', payload);
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/finances/categories/${id}`);
}

export async function getMonthlySummary(month?: number, year?: number): Promise<FinanceSummary> {
  const { data } = await api.get<FinanceSummary>('/finances/summary', { params: { month, year } });
  return data;
}
