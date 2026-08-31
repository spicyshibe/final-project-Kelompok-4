/**
 * Format angka ke format Rupiah standar Indonesia
 * Contoh: 38000 -> "Rp 38.000"
 */
export function formatRupiah(amount) {
  if (typeof amount !== 'number') {
    amount = Number(amount) || 0;
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
