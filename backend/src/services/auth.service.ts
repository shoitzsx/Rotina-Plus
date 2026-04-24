import { supabase } from '../config/supabase';

interface RegisterParams { name: string; email: string; password: string }
interface LoginParams    { email: string; password: string }

export async function register({ name, email, password }: RegisterParams) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error) throw new Error(error.message);
  return { user: data.user, session: data.session };
}

export async function login({ email, password }: LoginParams) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return { user: data.user, session: data.session };
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw new Error('Perfil não encontrado');
  return data;
}

export async function updateProfile(userId: string, updates: Record<string, unknown>) {
  const allowed = ['name', 'avatar_url', 'weight', 'height'];
  const filtered = Object.fromEntries(
    Object.entries(updates).filter(([k]) => allowed.includes(k))
  );
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...filtered, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}
