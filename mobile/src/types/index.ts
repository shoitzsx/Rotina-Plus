// ============================================================
// Rotina+ — TypeScript types & interfaces
// ============================================================

// ─── Auth ────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  weight?: number;
  height?: number;
  created_at: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

// ─── Agenda ──────────────────────────────────────────────────

export interface Event {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  all_day: boolean;
  reminder?: string;
  color: string;
  created_at: string;
}

export type CreateEventDTO = Omit<Event, 'id' | 'user_id' | 'created_at'>;
export type UpdateEventDTO = Partial<CreateEventDTO>;

// ─── Studies ─────────────────────────────────────────────────

export interface StudySubject {
  id: string;
  user_id: string;
  name: string;
  color: string;
  goal_hours_per_week: number;
  created_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  subject_id: string;
  study_subjects?: Pick<StudySubject, 'name' | 'color'>;
  duration_minutes: number;
  date: string;
  notes?: string;
  created_at: string;
}

// ─── Finances ────────────────────────────────────────────────

export type TransactionType = 'income' | 'expense';

export interface TransactionCategory {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  user_id: string;
  category_id?: string;
  transaction_categories?: Pick<TransactionCategory, 'name' | 'icon' | 'color'>;
  title: string;
  amount: number;
  type: TransactionType;
  date: string;
  notes?: string;
  created_at: string;
}

export interface FinanceSummary {
  income: number;
  expenses: number;
  balance: number;
}

// ─── Hydration ───────────────────────────────────────────────

export interface HydrationGoal {
  daily_goal_ml: number;
  cup_size_ml: number;
}

export interface HydrationLog {
  id: string;
  amount_ml: number;
  logged_at: string;
}

export interface HydrationSummary extends HydrationGoal {
  consumed_ml: number;
  percentage: number;
  cups: number;
  logs: HydrationLog[];
}

// ─── Nutrition ───────────────────────────────────────────────

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export const MEAL_TYPE_LABEL: Record<MealType, string> = {
  breakfast: 'Café da manhã',
  lunch:     'Almoço',
  dinner:    'Jantar',
  snack:     'Lanche',
};

export interface Meal {
  id: string;
  user_id: string;
  name: string;
  meal_type: MealType;
  scheduled_time?: string;
  calories?: number;
  logged_at: string;
  notes?: string;
  created_at: string;
}

// ─── Habits ──────────────────────────────────────────────────

export type HabitFrequency = 'daily' | 'weekly';

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  target_days?: number[];
  created_at: string;
}

export interface HabitWithCompletion extends Habit {
  completed_today: boolean;
}

// ─── Dashboard ───────────────────────────────────────────────

export interface DashboardData {
  today_events: Pick<Event, 'id' | 'title' | 'start_date' | 'end_date' | 'color' | 'all_day'>[];
  hydration: { consumed_ml: number; goal_ml: number; percentage: number };
  finances: { income: number; expenses: number; balance: number };
  study: { minutes: number };
  habits: { completed: number; total: number };
}

// ─── Navigation ──────────────────────────────────────────────

export type RootStackParamList = {
  Auth:  undefined;
  Main:  undefined;
};

export type AuthStackParamList = {
  Login:    undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Agenda:    undefined;
  Finances:  undefined;
  Hydration: undefined;
  More:      undefined;
};

export type AgendaStackParamList = {
  AgendaScreen:    undefined;
  EventForm:       { eventId?: string };
};

export type FinancesStackParamList = {
  FinancesScreen:     undefined;
  TransactionForm:    { transactionId?: string };
  Categories:         undefined;
};

export type MoreStackParamList = {
  MoreScreen:    undefined;
  Studies:       undefined;
  StudyForm:     { sessionId?: string };
  Nutrition:     undefined;
  MealForm:      { mealId?: string };
  Habits:        undefined;
  HabitForm:     { habitId?: string };
  Profile:       undefined;
};
