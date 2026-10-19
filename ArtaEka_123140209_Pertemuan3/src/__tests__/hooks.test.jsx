import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useLocalStorage from '../hooks/useLocalStorage'
import useBookStats from '../hooks/useBookStats'

describe('useLocalStorage', () => {
  // Test 1
  it('mengembalikan nilai awal jika localStorage kosong', () => {
    const { result } = renderHook(() => useLocalStorage('k1', ['a']))
    expect(result.current[0]).toEqual(['a'])
  })

  // Test 2
  it('menyimpan nilai baru ke localStorage dan membacanya kembali', () => {
    const { result, unmount } = renderHook(() => useLocalStorage('k2', 0))
    act(() => result.current[1](42))
    expect(JSON.parse(localStorage.getItem('k2'))).toBe(42)

    // Simulasi refresh halaman: hook dibuat ulang, nilai harus tetap 42
    unmount()
    const { result: again } = renderHook(() => useLocalStorage('k2', 0))
    expect(again.current[0]).toBe(42)
  })
})

describe('useBookStats', () => {
  const books = [
    { id: '1', title: 'A', author: 'X', status: 'milik' },
    { id: '2', title: 'B', author: 'Y', status: 'baca' },
    { id: '3', title: 'C', author: 'Z', status: 'milik' },
    { id: '4', title: 'D', author: 'W', status: 'beli' },
  ]

  // Test 3
  it('menghitung total dan jumlah per status', () => {
    const { result } = renderHook(() => useBookStats(books))
    expect(result.current).toMatchObject({ total: 4, milik: 2, baca: 1, beli: 1 })
    expect(result.current.persen.milik).toBe(50)
  })

  // Test 4
  it('tidak error (persen 0) ketika daftar buku kosong', () => {
    const { result } = renderHook(() => useBookStats([]))
    expect(result.current.total).toBe(0)
    expect(result.current.persen).toEqual({ milik: 0, baca: 0, beli: 0 })
  })
})
