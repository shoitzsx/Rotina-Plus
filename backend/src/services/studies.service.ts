import { supabase } from '../config/supabase';

// ─── Subjects ────────────────────────────────────────────────

export async function getSubjects(userId: string) {
  const { data, error } = await supabase
    .from('study_subjects')
    .select('*')
    .eq('user_id', userId)
    .order('name');
  if (error) throw new Error(error.message);
  return data;
}

export async function createSubject(userId: string, payload: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('study_subjects')
    .insert({ ...payload, user_id: userId })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateSubject(userId: string, id: string, payload: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('study_subjects')
    .update(payload)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteSubject(userId: string, id: string) {
  const { error } = await supabase
    .from('study_subjects')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
}

// ─── Sessions ────────────────────────────────────────────────

interface SessionFilters { date?: string; subject_id?: string }

export async function getSessions(userId: string, filters: SessionFilters = {}) {
  let query = supabase
    .from('study_sessions')
    .select('*, study_subjects(name, color)')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (filters.date)       query = query.eq('date', filters.date);
  if (filters.subject_id) query = query.eq('subject_id', filters.subject_id);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

export async function createSession(userId: string, payload: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('study_sessions')
    .insert({ ...payload, user_id: userId })
    .select('*, study_subjects(name, color)')
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteSession(userId: string, id: string) {
  const { error } = await supabase
    .from('study_sessions')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
}
