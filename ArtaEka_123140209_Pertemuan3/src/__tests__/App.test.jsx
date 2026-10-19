import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

// Data awal di localStorage agar test fokus pada fitur filter/search/edit/hapus
const seed = [
  { id: '1', title: 'Laskar Pelangi', author: 'Andrea Hirata', status: 'milik' },
  { id: '2', title: 'Bumi Manusia', author: 'Pramoedya Ananta Toer', status: 'baca' },
  { id: '3', title: 'Atomic Habits', author: 'James Clear', status: 'beli' },
]

beforeEach(() => {
  localStorage.setItem('books', JSON.stringify(seed))
  window.history.pushState({}, '', '/') // mulai dari halaman beranda
})

describe('Integrasi aplikasi', () => {
  // Test 9
  it('menampilkan semua buku dari localStorage', () => {
    render(<App />)
    expect(screen.getByText('Laskar Pelangi')).toBeInTheDocument()
    expect(screen.getByText('Bumi Manusia')).toBeInTheDocument()
    expect(screen.getByText('Atomic Habits')).toBeInTheDocument()
  })

  // Test 10
  it('memfilter buku berdasarkan status', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: 'Sedang Dibaca' }))
    expect(screen.getByText('Bumi Manusia')).toBeInTheDocument()
    expect(screen.queryByText('Laskar Pelangi')).not.toBeInTheDocument()
  })

  // Test 11
  it('mencari buku berdasarkan judul ATAU nama penulis', async () => {
    render(<App />)
    const search = screen.getByLabelText('Cari buku')

    await userEvent.type(search, 'clear') // nama penulis
    expect(screen.getByText('Atomic Habits')).toBeInTheDocument()
    expect(screen.queryByText('Bumi Manusia')).not.toBeInTheDocument()

    await userEvent.clear(search)
    await userEvent.type(search, 'laskar') // judul
    expect(screen.getByText('Laskar Pelangi')).toBeInTheDocument()
    expect(screen.queryByText('Atomic Habits')).not.toBeInTheDocument()
  })

  // Test 12
  it('menghapus buku setelah konfirmasi', async () => {
    render(<App />)
    await userEvent.click(screen.getByLabelText('Hapus Atomic Habits'))
    const dialog = screen.getByRole('dialog')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Ya, Hapus' }))

    expect(screen.queryByText('Atomic Habits')).not.toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('books'))).toHaveLength(2)
  })

  // Test 13
  it('mengedit buku dan menyimpan perubahan', async () => {
    render(<App />)
    await userEvent.click(screen.getByLabelText('Edit Atomic Habits'))
    const dialog = screen.getByRole('dialog')
    await userEvent.selectOptions(within(dialog).getByLabelText('Status'), 'milik')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Simpan Perubahan' }))

    const stored = JSON.parse(localStorage.getItem('books'))
    expect(stored.find((b) => b.id === '3').status).toBe('milik')
  })

  // Test 14
  it('menambah buku lewat halaman Tambah Buku dan muncul di statistik', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('link', { name: 'Tambah Buku' }))
    await userEvent.type(screen.getByLabelText('Judul'), 'Filosofi Teras')
    await userEvent.type(screen.getByLabelText('Penulis'), 'Henry Manampiring')
    await userEvent.click(screen.getByRole('button', { name: 'Tambah Buku' }))
    expect(screen.getByRole('status')).toHaveTextContent('berhasil ditambahkan')

    await userEvent.click(screen.getByRole('link', { name: 'Statistik' }))
    expect(screen.getByTestId('stat-total')).toHaveTextContent('4')
  })
})
