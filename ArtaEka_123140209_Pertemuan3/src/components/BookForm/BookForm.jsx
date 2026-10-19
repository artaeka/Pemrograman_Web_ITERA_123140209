import { useState } from 'react'
import PropTypes from 'prop-types'
import { STATUS_OPTIONS } from '../../context/BookContext'
import './BookForm.css'

const EMPTY_FORM = { title: '', author: '', status: 'beli' }

/**
 * Validasi form. Mengembalikan objek error (kosong = valid).
 * Diekspor agar bisa dites secara terpisah.
 */
export function validateBook({ title, author, status }) {
  const errors = {}
  if (!title.trim()) errors.title = 'Judul buku wajib diisi'
  if (!author.trim()) errors.author = 'Nama penulis wajib diisi'
  if (!STATUS_OPTIONS.some((o) => o.value === status)) {
    errors.status = 'Status wajib dipilih'
  }
  return errors
}

/**
 * Komponen reusable #1: BookForm
 * Dipakai untuk menambah buku (initialData kosong) maupun mengedit
 * buku (initialData berisi data buku yang dipilih).
 */
export default function BookForm({
  initialData = null,
  onSubmit,
  onCancel = null,
  submitLabel = 'Simpan',
}) {
  const [form, setForm] = useState(initialData ?? EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    const next = { ...form, [name]: value }
    setForm(next)
    // Setelah user pernah submit, validasi ulang secara live agar feedback langsung hilang
    if (touched) setErrors(validateBook(next))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched(true)
    const validation = validateBook(form)
    setErrors(validation)
    if (Object.keys(validation).length > 0) return // berhenti jika ada error

    onSubmit(form)
    // Kosongkan form hanya pada mode tambah
    if (!initialData) {
      setForm(EMPTY_FORM)
      setTouched(false)
    }
  }

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="title">Judul</label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="Contoh: Laskar Pelangi"
          className={errors.title ? 'input-error' : ''}
          aria-invalid={Boolean(errors.title)}
        />
        {errors.title && (
          <span className="error-message" role="alert">
            {errors.title}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="author">Penulis</label>
        <input
          id="author"
          name="author"
          type="text"
          value={form.author}
          onChange={handleChange}
          placeholder="Contoh: Andrea Hirata"
          className={errors.author ? 'input-error' : ''}
          aria-invalid={Boolean(errors.author)}
        />
        {errors.author && (
          <span className="error-message" role="alert">
            {errors.author}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={form.status}
          onChange={handleChange}
          className={errors.status ? 'input-error' : ''}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {errors.status && (
          <span className="error-message" role="alert">
            {errors.status}
          </span>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Batal
          </button>
        )}
      </div>
    </form>
  )
}

BookForm.propTypes = {
  initialData: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    status: PropTypes.oneOf(['milik', 'baca', 'beli']),
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  submitLabel: PropTypes.string,
}
