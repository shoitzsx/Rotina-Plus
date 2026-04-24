import { supabase } from '../config/supabase';

export async function getDashboardSummary(userId: string) {
  const today      = new Date().toISOString().split('T')[0];
  const todayStart = `${today}T00:00:00.000Z`;
  const todayEnd   = `${today}T23:59:59.999Z`;

  const [
    eventsResult,
    hydrationResult,
    hydrationGoalResult,
    transactionsResult,
    studyResult,
    habitsResult,
    habitLogsResult,
  ] = await Promise.all([
    supabase
      .from('events')
      .select('id, title, start_date, end_date, color, all_day')
      .eq('user_id', userId)
      .gte('start_date', todayStart)
      .lte('start_date', todayEnd)
      .order('start_date'),

    supabase
      .from('hydration_logs')
      .select('amount_ml')
      .eq('user_id', userId)
      .gte('logged_at', todayStart)
      .lte('logged_at', todayEnd),

    supabase
      .from('hydration_goals')
      .select('daily_goal_ml, cup_size_ml')
      .eq('user_id', userId)
      .single(),

    supabase
      .from('transactions')
      .select('amount, type')
      .eq('user_id', userId)
      .eq('date', today),

    supabase
      .from('study_sessions')
      .select('duration_minutes')
      .eq('user_id', userId)
      .eq('date', today),

    supabase
      .from('habits')
      .select('id')
      .eq('user_id', userId),

    supabase
      .from('habit_logs')
      .select('habit_id')
      .eq('user_id', userId)
      .eq('date', today),
  ]);

  const consumed_ml  = (hydrationResult.data ?? []).reduce((s, l) => s + l.amount_ml, 0);
  const goal_ml      = hydrationGoalResult.data?.daily_goal_ml ?? 2000;
  const transactions = transactionsResult.data ?? [];
  const income       = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
  const expenses     = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
  const studyMinutes = (studyResult.data ?? []).reduce((s, s2) => s + s2.duration_minutes, 0);
  const totalHabits  = (habitsResult.data ?? []).length;
  const doneHabits   = (habitLogsResult.data ?? []).length;

  return {
    today_events: eventsResult.data ?? [],
    hydration: {
      consumed_ml,
      goal_ml,
      percentage: Math.min(Math.round((consumed_ml / goal_ml) * 100), 100),
    },
    finances: { income, expenses, balance: income - expenses },
    study:    { minutes: studyMinutes },
    habits:   { completed: doneHabits, total: totalHabits },
  };
}
