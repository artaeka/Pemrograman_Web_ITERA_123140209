"""
main.py
Skrip untuk menguji seluruh fungsionalitas sistem perpustakaan.
"""

from library_item import Book, Magazine
from library import Library


def main():
    perpus = Library("Perpustakaan ITERA")

    # 1. Menambahkan item
    print(">> MENAMBAHKAN ITEM")
    perpus.tambah_item(Book("B001", "Pemrograman Python", 2021, "Budi Santoso", 320))
    perpus.tambah_item(Book("B002", "Struktur Data", 2019, "Siti Aminah", 280))
    perpus.tambah_item(Magazine("M001", "Tech Today", 2024, "Edisi 12", "Media Teknologi"))
    perpus.tambah_item(Magazine("M002", "Sains Populer", 2023, "Edisi 5", "Pustaka Sains"))
    perpus.tambah_item(Book("B001", "Duplikat ID", 2020, "Anonim", 100))  # harus ditolak

    # 2. Menampilkan katalog
    perpus.tampilkan_katalog()

    # 3. Mencari item
    print("\n>> PENCARIAN")
    item = perpus.cari_by_id("M001")
    print("Cari ID 'M001'   :", item.get_detail() if item else "Tidak ditemukan")
    hasil = perpus.cari_by_judul("python")
    print("Cari judul 'python':")
    for h in hasil:
        print("  -", h.get_detail())
    print("Cari ID 'X999'   :", "Tidak ditemukan" if perpus.cari_by_id("X999") is None else "Ada")

    # 4. Status ketersediaan
    print("\n>> STATUS KETERSEDIAAN")
    buku = perpus.cari_by_id("B001")
    print("Pinjam B001 :", "Berhasil" if buku.pinjam() else "Gagal")
    print("Pinjam B001 lagi :", "Berhasil" if buku.pinjam() else "Gagal (sedang dipinjam)")
    print("is_dipinjam B001 :", buku.is_dipinjam)
    perpus.tampilkan_katalog()                       # B001 tidak muncul
    perpus.tampilkan_katalog(hanya_tersedia=False)   # semua item muncul

    # 5. Polymorphism: method sama, hasil berbeda tergantung jenis item
    print("\n>> POLYMORPHISM: DENDA TERLAMBAT 5 HARI")
    for kode in ("B001", "M001"):
        it = perpus.cari_by_id(kode)
        print(f"{it.judul}: Rp{it.hitung_denda(5):,}".replace(",", "."))

    buku.kembalikan()
    print("\nB001 dikembalikan ->", buku)


if __name__ == "__main__":
    main()
