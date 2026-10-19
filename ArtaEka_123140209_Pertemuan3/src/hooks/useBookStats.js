import { useMemo } from 'react'

/**
 * Custom hook #2: useBookStats
 * Menghitung statistik koleksi buku (total & jumlah per status).
 * useMemo dipakai agar perhitungan hanya diulang saat daftar buku berubah.
 *
 * @param {Array<{status: string}>} books
 * @returns {{total:number, milik:number, baca:number, beli:number, persen:Object}}
 */
export default function useBookStats(books) {
  return useMemo(() => {
    const total = books.length
    const milik = books.filter((b) => b.status === 'milik').length
    const baca = books.filter((b) => b.status === 'baca').length
    const beli = books.filter((b) => b.status === 'beli').length

    // Persentase tiap status (0 jika belum ada buku, hindari pembagian dengan nol)
    const toPercent = (n) => (total === 0 ? 0 : Math.round((n / total) * 100))

    return {
      total,
      milik,
      baca,
      beli,
      persen: {
        milik: toPercent(milik),
        baca: toPercent(baca),
        beli: toPercent(beli),
      },
    }
  }, [books])
}
