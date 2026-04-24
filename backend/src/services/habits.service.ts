import { supabase } from '../config/supabase';

export async function getHabits(userId: string) {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at');
  if (error) throw new Error(error.message);
  return data;
}

export async function getTodayHabits(userId: string) {
  const today = new Date().toISOString().split('T')[0];

  const [habitsResult, logsResult] = await Promise.all([
    supabase.from('habits').select('*').eq('user_id', userId),
    supabase
      .from('habit_logs')
      .select('habit_id')
      .eq('user_id', userId)
      .eq('date', today),
  ]);

  if (habitsResult.error) throw new Error(habitsResult.error.message);

  const completedIds = new Set((logsResult.data ?? []).map(l => l.habit_id));

  return (habitsResult.data ?? []).map(habit => ({
    ...habit,
    completed_today: completedIds.has(habit.id),
  }));
}

export async function createHabit(userId: string, payload: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('habits')
    .insert({ ...payload, user_id: userId })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateHabit(userId: string, id: string, payload: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('habits')
    .update(payload)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteHabit(userId: string, id: string) {
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
}

export async function completeHabit(userId: string, habitId: string) {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('habit_logs')
    .insert({ habit_id: habitId, user_id: userId, date: today })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function uncompleteHabit(userId: string, habitId: string) {
  const today = new Date().toISOString().split('T')[0];
  const { error } = await supabase
    .from('habit_logs')
    .delete()
    .eq('habit_id', habitId)
    .eq('user_id', userId)
    .eq('date', today);
  if (error) throw new Error(error.message);
}
