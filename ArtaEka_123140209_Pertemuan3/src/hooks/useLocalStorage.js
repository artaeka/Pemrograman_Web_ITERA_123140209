import { useState, useEffect } from 'react'

/**
 * Custom hook #1: useLocalStorage
 * Bekerja seperti useState, tetapi nilainya disinkronkan ke localStorage
 * sehingga data tetap ada setelah halaman di-refresh.
 *
 * @param {string} key - kunci penyimpanan di localStorage
 * @param {*} initialValue - nilai awal jika belum ada data tersimpan
 * @returns {[*, Function]} pasangan [value, setValue]
 */
export default function useLocalStorage(key, initialValue) {
  // Lazy initializer: localStorage hanya dibaca sekali saat render pertama
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch (error) {
      // JSON rusak / localStorage tidak tersedia -> pakai nilai awal
      console.error(`Gagal membaca localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Setiap value berubah, simpan ulang ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Gagal menyimpan localStorage key "${key}":`, error)
    }
  }, [key, value])

  return [value, setValue]
}
