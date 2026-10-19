import { useBooks } from '../../context/BookContext'
import './Stats.css'

/** Halaman Statistik: memakai hasil custom hook useBookStats (lewat Context) */
export default function Stats() {
  const { stats } = useBooks()

  const cards = [
    { key: 'milik', label: 'Dimiliki', value: stats.milik, percent: stats.persen.milik },
    { key: 'baca', label: 'Sedang Dibaca', value: stats.baca, percent: stats.persen.baca },
    { key: 'beli', label: 'Ingin Dibeli', value: stats.beli, percent: stats.persen.beli },
  ]

  return (
    <section className="stats">
      <h1>Statistik Buku</h1>

      <div className="stat-total">
        <span className="stat-number" data-testid="stat-total">
          {stats.total}
        </span>
        <span>Total Buku</span>
      </div>

      <div className="stat-grid">
        {cards.map((c) => (
          <div key={c.key} className={`stat-card stat-${c.key}`}>
            <span className="stat-number" data-testid={`stat-${c.key}`}>
              {c.value}
            </span>
            <span className="stat-label">{c.label}</span>
            <div className="bar" aria-hidden="true">
              <div className="bar-fill" style={{ width: `${c.percent}%` }} />
            </div>
            <span className="stat-percent">{c.percent}%</span>
          </div>
        ))}
      </div>
    </section>
  )
}
