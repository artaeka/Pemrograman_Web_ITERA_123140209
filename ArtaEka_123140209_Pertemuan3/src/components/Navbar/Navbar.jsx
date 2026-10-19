import { NavLink } from 'react-router-dom'
import './Navbar.css'

/** Navbar: navigasi antar halaman memakai NavLink (otomatis memberi class "active") */
export default function Navbar() {
  const linkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <span className="brand">📚 Buku Saya</span>
        <nav>
          <NavLink to="/" end className={linkClass}>
            Beranda
          </NavLink>
          <NavLink to="/tambah" className={linkClass}>
            Tambah Buku
          </NavLink>
          <NavLink to="/statistik" className={linkClass}>
            Statistik
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
