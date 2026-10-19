import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BookForm, { validateBook } from '../components/BookForm/BookForm'

describe('validateBook', () => {
  // Test 5
  it('mengembalikan error untuk judul & penulis yang kosong/spasi saja', () => {
    const errors = validateBook({ title: '   ', author: '', status: 'milik' })
    expect(errors.title).toBeDefined()
    expect(errors.author).toBeDefined()
    expect(errors.status).toBeUndefined()
  })

  // Test 6
  it('tidak mengembalikan error untuk data yang valid', () => {
    expect(validateBook({ title: 'A', author: 'B', status: 'baca' })).toEqual({})
  })
})

describe('BookForm (error handling)', () => {
  // Test 7
  it('menampilkan pesan error + gaya merah dan TIDAK submit jika kolom kosong', async () => {
    const onSubmit = vi.fn()
    render(<BookForm onSubmit={onSubmit} submitLabel="Tambah" />)

    await userEvent.click(screen.getByRole('button', { name: 'Tambah' }))

    expect(screen.getByText('Judul buku wajib diisi')).toBeInTheDocument()
    expect(screen.getByText('Nama penulis wajib diisi')).toBeInTheDocument()
    expect(screen.getByLabelText('Judul')).toHaveClass('input-error')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  // Test 8
  it('memanggil onSubmit dengan data yang benar dan mengosongkan form', async () => {
    const onSubmit = vi.fn()
    render(<BookForm onSubmit={onSubmit} submitLabel="Tambah" />)

    await userEvent.type(screen.getByLabelText('Judul'), 'Laskar Pelangi')
    await userEvent.type(screen.getByLabelText('Penulis'), 'Andrea Hirata')
    await userEvent.selectOptions(screen.getByLabelText('Status'), 'milik')
    await userEvent.click(screen.getByRole('button', { name: 'Tambah' }))

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Laskar Pelangi',
      author: 'Andrea Hirata',
      status: 'milik',
    })
    expect(screen.getByLabelText('Judul')).toHaveValue('')
  })
})
