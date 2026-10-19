import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useBooks } from '../../context/BookContext'
import BookForm from '../../components/BookForm/BookForm'
import './AddBook.css'

/** Halaman Tambah Buku: memakai BookForm dalam mode "tambah" */
export default function AddBook() {
  const { addBook } = useBooks()
  const [success, setSuccess] = useState(false)

  const handleSubmit = (data) => {
    addBook(data)
    setSuccess(true)
  }

  return (
    <section className="add-book">
      <h1>Tambah Buku Baru</h1>

      {success && (
        <div className="success-banner" role="status">
          Buku berhasil ditambahkan! <Link to="/">Lihat koleksi</Link>
        </div>
      )}

      <div className="card">
        <BookForm onSubmit={handleSubmit} submitLabel="Tambah Buku" />
      </div>
    </section>
  )
}
