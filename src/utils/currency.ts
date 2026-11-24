/**
 * Format numeric amounts consistently in Brazilian Real (BRL) without locale drift across JS runtimes.
 */
export function formatBrl(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  const negative = safe < 0;
  const [intPart, decPart] = Math.abs(safe).toFixed(2).split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${negative ? '-' : ''}R$ ${grouped},${decPart}`;
}

/**
 * Format an ISO date string (YYYY-MM-DD) to DD/MM/YYYY for display.
 */
export function formatShortDate(isoDate: string): string {
  const parts = isoDate.slice(0, 10).split('-');
  if (parts.length !== 3) {
    return isoDate;
  }
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}
