/** Formats a JS Date or ISO string to pt-BR locale */
export function formatDate(value: string | Date, opts?: Intl.DateTimeFormatOptions): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleDateString('pt-BR', opts);
}

/** Formats a number as BRL currency */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/** Converts milliliters to a human-readable string */
export function formatMl(ml: number): string {
  return ml >= 1000 ? `${(ml / 1000).toFixed(1)} L` : `${ml} ml`;
}
