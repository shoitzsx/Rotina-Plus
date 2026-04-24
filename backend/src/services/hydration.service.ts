import { supabase } from '../config/supabase';

export async function getGoal(userId: string) {
  const { data, error } = await supabase
    .from('hydration_goals')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateGoal(userId: string, payload: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('hydration_goals')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function addLog(userId: string, amount_ml: number) {
  const { data, error } = await supabase
    .from('hydration_logs')
    .insert({ user_id: userId, amount_ml })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteLog(userId: string, id: string) {
  const { error } = await supabase
    .from('hydration_logs')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
}

export async function getTodaySummary(userId: string) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [goalResult, logsResult] = await Promise.all([
    supabase.from('hydration_goals').select('*').eq('user_id', userId).single(),
    supabase
      .from('hydration_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_at', todayStart.toISOString())
      .lte('logged_at', todayEnd.toISOString()),
  ]);

  if (goalResult.error) throw new Error(goalResult.error.message);

  const goal         = goalResult.data;
  const logs         = logsResult.data ?? [];
  const consumed_ml  = logs.reduce((sum, l) => sum + l.amount_ml, 0);
  const percentage   = Math.min(Math.round((consumed_ml / goal.daily_goal_ml) * 100), 100);
  const cups         = Math.floor(consumed_ml / goal.cup_size_ml);

  return { consumed_ml, goal_ml: goal.daily_goal_ml, cup_size_ml: goal.cup_size_ml, percentage, cups, logs };
}
