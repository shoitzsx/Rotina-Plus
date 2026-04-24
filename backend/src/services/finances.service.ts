import { supabase } from '../config/supabase';

// ─── Transactions ─────────────────────────────────────────────

interface TransactionFilters { month?: string; year?: string; type?: string }

export async function getTransactions(userId: string, filters: TransactionFilters = {}) {
  const now = new Date();
  const month = filters.month ? parseInt(filters.month) : now.getMonth() + 1;
  const year  = filters.year  ? parseInt(filters.year)  : now.getFullYear();

  const from = `${year}-${String(month).padStart(2, '0')}-01`;
  const to   = new Date(year, month, 0).toISOString().split('T')[0];

  let query = supabase
    .from('transactions')
    .select('*, transaction_categories(name, icon, color)')
    .eq('user_id', userId)
    .gte('date', from)
    .lte('date', to)
    .order('date', { ascending: false });

  if (filters.type) query = query.eq('type', filters.type);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

export async function createTransaction(userId: string, payload: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('transactions')
    .insert({ ...payload, user_id: userId })
    .select('*, transaction_categories(name, icon, color)')
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateTransaction(userId: string, id: string, payload: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('transactions')
    .update(payload)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteTransaction(userId: string, id: string) {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
}

// ─── Categories ───────────────────────────────────────────────

export async function getCategories(userId: string) {
  const { data, error } = await supabase
    .from('transaction_categories')
    .select('*')
    .eq('user_id', userId)
    .order('name');
  if (error) throw new Error(error.message);
  return data;
}

export async function createCategory(userId: string, payload: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('transaction_categories')
    .insert({ ...payload, user_id: userId })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteCategory(userId: string, id: string) {
  const { error } = await supabase
    .from('transaction_categories')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
}

// ─── Summary ──────────────────────────────────────────────────

export async function getMonthlySummary(userId: string, month?: string, year?: string) {
  const now = new Date();
  const m = month ? parseInt(month) : now.getMonth() + 1;
  const y = year  ? parseInt(year)  : now.getFullYear();

  const from = `${y}-${String(m).padStart(2, '0')}-01`;
  const to   = new Date(y, m, 0).toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('transactions')
    .select('amount, type, transaction_categories(name, color)')
    .eq('user_id', userId)
    .gte('date', from)
    .lte('date', to);

  if (error) throw new Error(error.message);

  const income   = data.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
  const expenses = data.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);

  return { income, expenses, balance: income - expenses };
}
