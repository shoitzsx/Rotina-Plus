import { supabase } from '../config/supabase';

/* ─── Types ─────────────────────────────────────────────────────────── */
export interface EventPayload {
  title:       string;
  date:        string;           // 'YYYY-MM-DD'
  start_time?: string;           // 'HH:MM'
  end_time?:   string;           // 'HH:MM'
  description?: string;
  location?:   string;
  category?:   string;
  status?:     string;
}

/* ─── Allowed fields for update (prevents mass-assignment) ──────────── */
const ALLOWED_FIELDS: (keyof EventPayload)[] = [
  'title', 'date', 'start_time', 'end_time',
  'description', 'location', 'category', 'status',
];

function pickAllowed(payload: Record<string, unknown>): Partial<EventPayload> {
  return Object.fromEntries(
    Object.entries(payload).filter(([k]) => ALLOWED_FIELDS.includes(k as keyof EventPayload)),
  ) as Partial<EventPayload>;
}

/* ─── Service functions ─────────────────────────────────────────────── */
export async function getEvents(userId: string, from?: string, to?: string) {
  let query = supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true })
    .order('start_time', { ascending: true });

  if (from) query = query.gte('date', from);
  if (to)   query = query.lte('date', to);

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

export async function createEvent(userId: string, payload: EventPayload) {
  const { data, error } = await supabase
    .from('events')
    .insert({ ...pickAllowed(payload as unknown as Record<string, unknown>), user_id: userId })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateEvent(
  userId: string,
  id: string,
  payload: Partial<EventPayload>,
) {
  const { data, error } = await supabase
    .from('events')
    .update({ ...pickAllowed(payload as unknown as Record<string, unknown>), updated_at: new Date().toISOString() })
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
