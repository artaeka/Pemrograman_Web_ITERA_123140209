import { useState } from 'react'
import { useBooks } from '../../context/BookContext'
import BookFilter from '../../components/BookFilter/BookFilter'
import BookList from '../../components/BookList/BookList'
import BookForm from '../../components/BookForm/BookForm'
import './Home.css'

/**
 * Halaman Beranda: daftar buku + filter + pencarian,
 * serta edit (form muncul sebagai modal) dan hapus (dengan konfirmasi).
 */
export default function Home() {
  const {
    books,
    filteredBooks,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    updateBook,
    deleteBook,
  } = useBooks()

  const [editingBook, setEditingBook] = useState(null) // buku yang sedang diedit
  const [deletingBook, setDeletingBook] = useState(null) // buku yang akan dihapus

  const handleUpdate = (data) => {
    updateBook(editingBook.id, data)
    setEditingBook(null)
  }

  const handleConfirmDelete = () => {
    deleteBook(deletingBook.id)
    setDeletingBook(null)
  }

  // Pesan kosong berbeda: belum ada data vs. hasil filter tidak ditemukan
  const emptyMessage =
    books.length === 0
      ? 'Belum ada buku. Klik "Tambah Buku" untuk memulai.'
      : 'Tidak ada buku yang cocok dengan pencarian/filter.'

  return (
    <section className="home">
      <h1>Koleksi Buku</h1>
      <p className="subtitle">
        Menampilkan {filteredBooks.length} dari {books.length} buku
      </p>

      <BookFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <BookList
        books={filteredBooks}
        onEdit={setEditingBook}
        onDelete={setDeletingBook}
        emptyMessage={emptyMessage}
      />

      {/* Modal edit */}
      {editingBook && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Edit buku">
          <div className="modal">
            <h2>Edit Buku</h2>
            {/* key = id buku, sehingga form di-reset otomatis saat berpindah buku */}
            <BookForm
              key={editingBook.id}
              initialData={editingBook}
              onSubmit={handleUpdate}
              onCancel={() => setEditingBook(null)}
              submitLabel="Simpan Perubahan"
            />
          </div>
        </div>
      )}

      {/* Modal konfirmasi hapus */}
      {deletingBook && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Konfirmasi hapus">
          <div className="modal">
            <h2>Hapus Buku?</h2>
            <p>
              Buku <strong>{deletingBook.title}</strong> akan dihapus permanen.
            </p>
            <div className="form-actions">
              <button className="btn btn-danger" onClick={handleConfirmDelete}>
                Ya, Hapus
              </button>
              <button className="btn btn-secondary" onClick={() => setDeletingBook(null)}>
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
