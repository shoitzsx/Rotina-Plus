/**
 * Calculates recommended daily water intake in ml based on body weight.
 * Formula: 35ml per kg of body weight (common recommendation)
 */
export function calculateDailyWaterGoal(weightKg: number): number {
  return Math.round(weightKg * 35);
}

/**
 * Converts ml to number of cups given a cup size.
 */
export function mlToCups(ml: number, cupSizeMl: number): number {
  return Math.floor(ml / cupSizeMl);
}

/**
 * Returns a motivational message based on hydration percentage.
 */
export function getHydrationMessage(percentage: number): string {
  if (percentage >= 100) return 'Meta atingida! Excelente! 🎉';
  if (percentage >= 75)  return 'Quase lá! Continue assim! 💪';
  if (percentage >= 50)  return 'Metade do caminho! Beba mais água 💧';
  if (percentage >= 25)  return 'Você precisa beber mais água! 😅';
  return 'Atenção! Hidratação muito baixa! ⚠️';
}
