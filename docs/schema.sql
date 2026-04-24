-- ============================================================
-- Rotina+ — Supabase / PostgreSQL Schema
-- Run this entire script in the Supabase SQL Editor
-- ============================================================

-- ========================
-- PROFILES
-- ========================
CREATE TABLE profiles (
  id          UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  avatar_url  TEXT,
  weight      DECIMAL(5,2),   -- kg, used to calculate daily water goal
  height      DECIMAL(5,2),   -- cm
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- AGENDA — EVENTS
-- ========================
CREATE TABLE events (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title       TEXT        NOT NULL,
  description TEXT,
  start_date  TIMESTAMPTZ NOT NULL,
  end_date    TIMESTAMPTZ NOT NULL,
  all_day     BOOLEAN     DEFAULT FALSE,
  reminder    TIMESTAMPTZ,
  color       TEXT        DEFAULT '#6366F1',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_user_id   ON events(user_id);
CREATE INDEX idx_events_start_date ON events(start_date);

-- ========================
-- STUDIES — SUBJECTS
-- ========================
CREATE TABLE study_subjects (
  id                  UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             UUID    REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name                TEXT    NOT NULL,
  color               TEXT    DEFAULT '#6366F1',
  goal_hours_per_week DECIMAL(4,1) DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- STUDIES — SESSIONS
-- ========================
CREATE TABLE study_sessions (
  id               UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID    REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subject_id       UUID    REFERENCES study_subjects(id) ON DELETE SET NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  date             DATE    NOT NULL DEFAULT CURRENT_DATE,
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX idx_study_sessions_date    ON study_sessions(date);

-- ========================
-- FINANCES — CATEGORIES
-- ========================
CREATE TABLE transaction_categories (
  id      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name    TEXT NOT NULL,
  icon    TEXT DEFAULT '💰',
  color   TEXT DEFAULT '#10B981',
  type    TEXT NOT NULL CHECK (type IN ('income', 'expense'))
);

-- ========================
-- FINANCES — TRANSACTIONS
-- ========================
CREATE TABLE transactions (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category_id UUID        REFERENCES transaction_categories(id) ON DELETE SET NULL,
  title       TEXT        NOT NULL,
  amount      DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  type        TEXT        NOT NULL CHECK (type IN ('income', 'expense')),
  date        DATE        NOT NULL DEFAULT CURRENT_DATE,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date    ON transactions(date);

-- ========================
-- HYDRATION — GOALS
-- ========================
CREATE TABLE hydration_goals (
  id           UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID    REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  daily_goal_ml INTEGER NOT NULL DEFAULT 2000,
  cup_size_ml  INTEGER NOT NULL DEFAULT 250,
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- HYDRATION — LOGS
-- ========================
CREATE TABLE hydration_logs (
  id        UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id   UUID    REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount_ml INTEGER NOT NULL CHECK (amount_ml > 0),
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hydration_logs_user_id   ON hydration_logs(user_id);
CREATE INDEX idx_hydration_logs_logged_at ON hydration_logs(logged_at);

-- ========================
-- NUTRITION — MEALS
-- ========================
CREATE TABLE meals (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name           TEXT NOT NULL,
  meal_type      TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  scheduled_time TIME,
  calories       INTEGER,
  logged_at      DATE NOT NULL DEFAULT CURRENT_DATE,
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_meals_user_id   ON meals(user_id);
CREATE INDEX idx_meals_logged_at ON meals(logged_at);

-- ========================
-- HABITS
-- ========================
CREATE TABLE habits (
  id          UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID    REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name        TEXT    NOT NULL,
  icon        TEXT    DEFAULT '⭐',
  color       TEXT    DEFAULT '#6366F1',
  frequency   TEXT    NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly')),
  target_days INTEGER[],  -- 0=Sun, 1=Mon, ..., 6=Sat
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- HABIT LOGS
-- ========================
CREATE TABLE habit_logs (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id     UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  user_id      UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date         DATE NOT NULL DEFAULT CURRENT_DATE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (habit_id, date)
);

CREATE INDEX idx_habit_logs_user_id ON habit_logs(user_id);
CREATE INDEX idx_habit_logs_date    ON habit_logs(date);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Each user can only read/write their own data
-- ============================================================

ALTER TABLE profiles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE events                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_subjects         ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE hydration_goals        ENABLE ROW LEVEL SECURITY;
ALTER TABLE hydration_logs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs             ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Generic policies for user-owned tables
CREATE POLICY "events_all"                 ON events                 USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "study_subjects_all"         ON study_subjects         USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "study_sessions_all"         ON study_sessions         USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "transaction_categories_all" ON transaction_categories USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "transactions_all"           ON transactions           USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "hydration_goals_all"        ON hydration_goals        USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "hydration_logs_all"         ON hydration_logs         USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "meals_all"                  ON meals                  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "habits_all"                 ON habits                 USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "habit_logs_all"             ON habit_logs             USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- TRIGGER: auto-create profile + hydration goal after signup
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    NEW.email
  );

  INSERT INTO public.hydration_goals (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
