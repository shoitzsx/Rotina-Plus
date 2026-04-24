/* ─── Auth ──────────────────────────────────────────────────────────── */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  weight?: number;
  height?: number;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  user: User;
}

/* ─── API ───────────────────────────────────────────────────────────── */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

/* ─── Agenda ────────────────────────────────────────────────────────── */
export interface Event {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  all_day: boolean;
  color: string;
  created_at: string;
}

/* ─── Hydration ─────────────────────────────────────────────────────── */
export interface HydrationLog {
  id: string;
  user_id: string;
  amount_ml: number;
  logged_at: string;
}

export interface HydrationGoal {
  user_id: string;
  goal_ml: number;
}

/* ─── Finances ──────────────────────────────────────────────────────── */
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  description?: string;
  category?: string;
  date: string;
}

/* ─── Habits ────────────────────────────────────────────────────────── */
export interface Habit {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon?: string;
  frequency: string[];
}
