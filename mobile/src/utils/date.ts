/**
 * Format a date string to Brazilian Portuguese locale.
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  return new Date(date).toLocaleDateString('pt-BR', options);
}

/**
 * Format a time string (HH:MM).
 */
export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Returns today's date as an ISO string (YYYY-MM-DD).
 */
export function today(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Returns a human-friendly relative label for a date.
 */
export function relativeDayLabel(dateStr: string): string {
  const date    = new Date(dateStr);
  const todayMs = new Date().setHours(0, 0, 0, 0);
  const dateMs  = new Date(date).setHours(0, 0, 0, 0);
  const diff    = (dateMs - todayMs) / (1000 * 60 * 60 * 24);

  if (diff === 0)  return 'Hoje';
  if (diff === 1)  return 'Amanhã';
  if (diff === -1) return 'Ontem';

  return formatDate(date, { weekday: 'long', day: 'numeric', month: 'short' });
}

/**
 * Convert minutes to a human-readable string (e.g., "1h 30min").
 */
export function minutesToReadable(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}
