"""
library.py
Berisi class Library yang mengelola koleksi item perpustakaan.
"""

from library_item import LibraryItem


class Library:
    """Mengelola koleksi LibraryItem (Book, Magazine, dst.)."""

    def __init__(self, nama):
        self.nama = nama
        # Atribut private: koleksi tidak bisa diubah langsung dari luar class
        self.__koleksi = []

    def tambah_item(self, item):
        """Menambahkan item ke koleksi. Menolak jika bukan LibraryItem atau ID sudah ada."""
        if not isinstance(item, LibraryItem):
            print("Gagal: objek bukan LibraryItem.")
            return False
        if self.cari_by_id(item.item_id) is not None:
            print(f"Gagal: ID '{item.item_id}' sudah terdaftar.")
            return False
        self.__koleksi.append(item)
        print(f"Berhasil menambahkan: {item.judul}")
        return True

    def tampilkan_katalog(self, hanya_tersedia=True):
        """Menampilkan katalog. Jika hanya_tersedia=True, item yang dipinjam disembunyikan."""
        judul = "Item Tersedia" if hanya_tersedia else "Semua Item"
        print(f"\n=== Katalog {self.nama} ({judul}) ===")
        ditampilkan = 0
        for item in self.__koleksi:
            if hanya_tersedia and item.is_dipinjam:
                continue
            print(item.get_detail())  # polymorphism: tiap subclass punya format sendiri
            ditampilkan += 1
        if ditampilkan == 0:
            print("(kosong)")

    def cari_by_id(self, item_id):
        """Mencari item berdasarkan ID (persis). Mengembalikan item atau None."""
        for item in self.__koleksi:
            if item.item_id == item_id:
                return item
        return None

    def cari_by_judul(self, kata_kunci):
        """Mencari item yang judulnya memuat kata kunci (tidak peka huruf besar/kecil)."""
        kata_kunci = kata_kunci.lower()
        return [item for item in self.__koleksi if kata_kunci in item.judul.lower()]

    def jumlah_item(self):
        """Mengembalikan jumlah seluruh item di koleksi."""
        return len(self.__koleksi)
