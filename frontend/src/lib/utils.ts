// src/lib/utils.ts

/**
 * Memformat angka menjadi string dengan pemisah ribuan.
 * Contoh: 1500000 -> "1,500,000"
 * Menerima string seperti "IDR 1500000" dan akan mengabaikan non-digit.
 * @param value - Angka atau string yang berisi angka
 * @returns String angka yang sudah diformat, atau string aslinya jika tidak valid.
 */
export function formatPrice(value: number | string): string {
  if (value === null || value === undefined) return '';
  // Hapus semua karakter non-digit
  const numberString = String(value).replace(/\D/g, '');
  if (numberString === '') {
    return '';
  }
  const number = Number(numberString);
  // Gunakan locale 'id-ID' untuk format Rupiah tanpa simbol
  return new Intl.NumberFormat('id-ID').format(number);
}

/**
 * Menghapus pemisah ribuan dari string angka dan mengembalikannya sebagai angka.
 * Contoh: "1,500,000" -> 1500000
 * @param value - String angka yang mungkin memiliki pemisah
 * @returns Angka.
 */
export function unformatPrice(value: string): number {
  if (value === null || value === undefined) return 0;
  return Number(String(value).replace(/\D/g, ''));
}

/**
 * Menghapus semua tag HTML dari sebuah string.
 * @param htmlString - String yang berisi konten HTML.
 * @returns String yang hanya berisi teks murni.
 */
export function stripHtml(htmlString: string): string {
  if (!htmlString) return '';
  return htmlString.replace(/<[^>]*>?/gm, '');
}

/**
 * Memotong sebuah string ke panjang maksimum yang ditentukan dan menambahkan elipsis (...).
 * @param text - String teks yang akan dipotong.
 *- @param maxLength - Panjang maksimum yang diizinkan sebelum memotong.
 * @returns String yang sudah dipotong.
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}