import { supabase } from '../config/supabase';

export async function getEvents(userId: string, from?: string, to?: string) {
  let query = supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: true });

  if (from) query = query.gte('start_date', from);
  if (to)   query = query.lte('start_date', to);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

export async function getEvent(userId: string, id: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();
  if (error) throw new Error('Evento não encontrado');
  return data;
}

export async function createEvent(userId: string, payload: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('events')
    .insert({ ...payload, user_id: userId })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateEvent(userId: string, id: string, payload: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('events')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteEvent(userId: string, id: string) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
}
