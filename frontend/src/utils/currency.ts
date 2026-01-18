export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format angka tanpa simbol Rp
 */
export function formatNumber(amount: number): string {
  return new Intl.NumberFormat("id-ID").format(amount);
}

/**
 * Parse string Rupiah ke number
 */
export function parseIDR(value: string): number {
  // Remove all non-numeric characters except comma and dot
  const cleaned = value.replace(/[^\d,-]/g, "");
  return parseFloat(cleaned.replace(",", ".")) || 0;
}
