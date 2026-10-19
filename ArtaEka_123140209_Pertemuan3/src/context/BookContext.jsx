import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import useLocalStorage from '../hooks/useLocalStorage'
import useBookStats from '../hooks/useBookStats'

// Daftar status yang valid, diekspor agar bisa dipakai komponen lain
export const STATUS_OPTIONS = [
  { value: 'milik', label: 'Dimiliki' },
  { value: 'baca', label: 'Sedang Dibaca' },
  { value: 'beli', label: 'Ingin Dibeli' },
]

const BookContext = createContext(null)

/**
 * BookProvider: menyimpan seluruh state global aplikasi (Context API)
 * - books         : daftar buku (persisten via localStorage)
 * - filter/search : state filter status dan kata kunci pencarian
 * - filteredBooks : hasil gabungan filter + pencarian
 * - addBook, updateBook, deleteBook : aksi CRUD
 */
export function BookProvider({ children }) {
  const [books, setBooks] = useLocalStorage('books', [])
  const [statusFilter, setStatusFilter] = useState('semua')
  const [searchQuery, setSearchQuery] = useState('')

  const stats = useBookStats(books)

  // CREATE
  const addBook = useCallback(
    ({ title, author, status }) => {
      const newBook = {
        id: crypto.randomUUID(),
        title: title.trim(),
        author: author.trim(),
        status,
      }
      setBooks((prev) => [newBook, ...prev])
    },
    [setBooks],
  )

  // UPDATE
  const updateBook = useCallback(
    (id, { title, author, status }) => {
      setBooks((prev) =>
        prev.map((b) =>
          b.id === id
            ? { ...b, title: title.trim(), author: author.trim(), status }
            : b,
        ),
      )
    },
    [setBooks],
  )

  // DELETE
  const deleteBook = useCallback(
    (id) => setBooks((prev) => prev.filter((b) => b.id !== id)),
    [setBooks],
  )

  // Filter berdasarkan status + pencarian judul/penulis (case-insensitive)
  const filteredBooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return books.filter((b) => {
      const matchStatus = statusFilter === 'semua' || b.status === statusFilter
      const matchSearch =
        q === '' ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
  }, [books, statusFilter, searchQuery])

  const value = {
    books,
    filteredBooks,
    stats,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    addBook,
    updateBook,
    deleteBook,
  }

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>
}

BookProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

/** Hook kecil untuk mengakses context dengan pengecekan Provider */
// eslint-disable-next-line react-refresh/only-export-components
export function useBooks() {
  const ctx = useContext(BookContext)
  if (!ctx) {
    throw new Error('useBooks harus dipakai di dalam <BookProvider>')
  }
  return ctx
}
