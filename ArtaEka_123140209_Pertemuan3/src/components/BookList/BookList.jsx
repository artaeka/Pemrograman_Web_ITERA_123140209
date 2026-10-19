import PropTypes from 'prop-types'
import BookItem from '../BookItem/BookItem'
import './BookList.css'

/**
 * Komponen reusable #3: BookList
 * Merender daftar BookItem, atau pesan kosong jika tidak ada buku.
 */
export default function BookList({
  books,
  onEdit,
  onDelete,
  emptyMessage = 'Belum ada buku.',
}) {
  if (books.length === 0) {
    return <p className="empty-state">{emptyMessage}</p>
  }

  return (
    <ul className="book-list">
      {books.map((book) => (
        <BookItem key={book.id} book={book} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  )
}

BookList.propTypes = {
  books: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  emptyMessage: PropTypes.string,
}
