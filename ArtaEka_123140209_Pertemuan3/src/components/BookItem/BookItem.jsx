import PropTypes from 'prop-types'
import { STATUS_OPTIONS } from '../../context/BookContext'
import './BookItem.css'

/**
 * Komponen reusable #2: BookItem
 * Menampilkan satu kartu buku beserta tombol Edit & Hapus.
 */
export default function BookItem({ book, onEdit, onDelete }) {
  const statusLabel =
    STATUS_OPTIONS.find((o) => o.value === book.status)?.label ?? book.status

  return (
    <li className="book-item">
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">oleh {book.author}</p>
        <span className={`badge badge-${book.status}`}>{statusLabel}</span>
      </div>
      <div className="book-actions">
        <button
          className="btn btn-secondary"
          onClick={() => onEdit(book)}
          aria-label={`Edit ${book.title}`}
        >
          Edit
        </button>
        <button
          className="btn btn-danger"
          onClick={() => onDelete(book)}
          aria-label={`Hapus ${book.title}`}
        >
          Hapus
        </button>
      </div>
    </li>
  )
}

BookItem.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['milik', 'baca', 'beli']).isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}
