/**
 * Game Page — Pure helper functions
 * No side effects, easily unit-testable.
 */

export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
  return Math.floor(num).toString();
}

export function calculateCost(
  baseCost: number,
  costMultiplier: number,
  owned: number,
): number {
  return Math.floor(baseCost * Math.pow(costMultiplier, owned));
}
