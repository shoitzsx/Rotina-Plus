import { supabase } from '../config/supabase';

export async function getMeals(userId: string, date?: string) {
  const target = date ?? new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .eq('logged_at', target)
    .order('scheduled_time', { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function createMeal(userId: string, payload: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('meals')
    .insert({ ...payload, user_id: userId })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateMeal(userId: string, id: string, payload: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('meals')
    .update(payload)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteMeal(userId: string, id: string) {
  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
}
