"""
library_item.py
Berisi abstract class LibraryItem beserta subclass Book dan Magazine.
"""

from abc import ABC, abstractmethod


class LibraryItem(ABC):
    """
    Abstract class: dasar untuk semua item di perpustakaan.
    Tidak bisa diinstansiasi langsung, harus diwarisi oleh subclass.
    """

    def __init__(self, item_id, judul, tahun_terbit):
        # Atribut protected (_): boleh diakses subclass, tidak untuk dipakai dari luar
        self._item_id = item_id
        self._judul = judul
        self._tahun_terbit = tahun_terbit
        # Atribut private (__): hanya bisa diubah lewat method pinjam()/kembalikan()
        self.__dipinjam = False

    # ---------- Property (getter) ----------
    @property
    def item_id(self):
        """ID item (read-only)."""
        return self._item_id

    @property
    def judul(self):
        """Judul item (read-only)."""
        return self._judul

    @property
    def is_dipinjam(self):
        """Status peminjaman: True jika sedang dipinjam (read-only)."""
        return self.__dipinjam

    # ---------- Method yang mengubah data private ----------
    def pinjam(self):
        """Meminjam item. Mengembalikan True jika berhasil, False jika sedang dipinjam."""
        if self.__dipinjam:
            return False
        self.__dipinjam = True
        return True

    def kembalikan(self):
        """Mengembalikan item. Mengembalikan True jika berhasil, False jika memang tidak dipinjam."""
        if not self.__dipinjam:
            return False
        self.__dipinjam = False
        return True

    # ---------- Abstract method (wajib di-override subclass) ----------
    @abstractmethod
    def get_detail(self):
        """Mengembalikan string detail lengkap item."""
        pass

    @abstractmethod
    def hitung_denda(self, hari_terlambat):
        """Menghitung denda keterlambatan berdasarkan jumlah hari."""
        pass

    def __str__(self):
        status = "Dipinjam" if self.__dipinjam else "Tersedia"
        return f"[{self._item_id}] {self._judul} ({status})"


class Book(LibraryItem):
    """Subclass untuk buku. Denda: Rp1.000 per hari."""

    DENDA_PER_HARI = 1000

    def __init__(self, item_id, judul, tahun_terbit, penulis, jumlah_halaman):
        super().__init__(item_id, judul, tahun_terbit)
        self._penulis = penulis
        self._jumlah_halaman = jumlah_halaman

    def get_detail(self):
        """Override: detail khusus buku."""
        status = "Dipinjam" if self.is_dipinjam else "Tersedia"
        return (f"[BUKU] ID: {self._item_id} | Judul: {self._judul} | "
                f"Penulis: {self._penulis} | Tahun: {self._tahun_terbit} | "
                f"Halaman: {self._jumlah_halaman} | Status: {status}")

    def hitung_denda(self, hari_terlambat):
        """Override: denda buku Rp1.000 per hari."""
        return max(0, hari_terlambat) * self.DENDA_PER_HARI


class Magazine(LibraryItem):
    """Subclass untuk majalah. Denda: Rp500 per hari."""

    DENDA_PER_HARI = 500

    def __init__(self, item_id, judul, tahun_terbit, edisi, penerbit):
        super().__init__(item_id, judul, tahun_terbit)
        self._edisi = edisi
        self._penerbit = penerbit

    def get_detail(self):
        """Override: detail khusus majalah."""
        status = "Dipinjam" if self.is_dipinjam else "Tersedia"
        return (f"[MAJALAH] ID: {self._item_id} | Judul: {self._judul} | "
                f"Edisi: {self._edisi} | Penerbit: {self._penerbit} | "
                f"Tahun: {self._tahun_terbit} | Status: {status}")

    def hitung_denda(self, hari_terlambat):
        """Override: denda majalah Rp500 per hari."""
        return max(0, hari_terlambat) * self.DENDA_PER_HARI
