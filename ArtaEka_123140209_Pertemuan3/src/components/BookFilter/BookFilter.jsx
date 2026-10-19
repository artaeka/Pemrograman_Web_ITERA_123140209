import PropTypes from 'prop-types'
import { STATUS_OPTIONS } from '../../context/BookContext'
import './BookFilter.css'

/**
 * BookFilter: kotak pencarian (judul/penulis) + tombol filter status.
 * Komponen ini "controlled": nilainya berasal dari props (state ada di Context).
 */
export default function BookFilter({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}) {
  const options = [{ value: 'semua', label: 'Semua' }, ...STATUS_OPTIONS]

  return (
    <div className="book-filter">
      <input
        type="search"
        className="search-input"
        placeholder="Cari judul atau penulis..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Cari buku"
      />
      <div className="filter-buttons" role="group" aria-label="Filter status">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            className={`filter-btn ${statusFilter === o.value ? 'active' : ''}`}
            onClick={() => onStatusChange(o.value)}
            aria-pressed={statusFilter === o.value}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

BookFilter.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  statusFilter: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
}
