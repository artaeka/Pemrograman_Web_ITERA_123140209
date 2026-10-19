import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { BookProvider } from './context/BookContext'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import AddBook from './pages/AddBook/AddBook'
import Stats from './pages/Stats/Stats'

/**
 * App: membungkus seluruh aplikasi dengan
 * - BookProvider  (Context API: state global buku)
 * - BrowserRouter (React Router: navigasi multi-halaman)
 */
export default function App() {
  return (
    <BookProvider>
      <BrowserRouter>
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tambah" element={<AddBook />} />
            <Route path="/statistik" element={<Stats />} />
            {/* Route tidak dikenal -> kembali ke beranda */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </BookProvider>
  )
}
