/**
 * Format a number as currency (EGP)
 */
export function formatCurrency(value: number | undefined | null): string {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number with commas
 */
export function formatNumber(value: number | undefined | null): string {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Format percentage
 */
export function formatPercent(value: number | undefined | null, decimals = 1): string {
  if (value == null) return '—';
  return `${value.toFixed(decimals)}%`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}…`;
}

/**
 * Generate stagger class for animations
 */
export function staggerClass(index: number): string {
  const capped = Math.min(index, 5);
  return `stagger-${capped + 1}`;
}
