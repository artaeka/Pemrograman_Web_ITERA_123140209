"""Latihan 5: Katalog kontak sederhana menggunakan dictionary."""

kontak = {
    "Budi": "081234567890",
    "Citra": "082345678901",
    "Dewi": "083456789012",
}


def tambah_kontak(daftar, nama, nomor):
    """Menambahkan kontak baru ke dictionary.

    Parameter:
        daftar (dict): dictionary kontak (nama -> nomor telepon).
        nama (str): nama kontak.
        nomor (str): nomor telepon kontak.

    Mengembalikan:
        None
    """
    daftar[nama] = nomor
    print(f"Kontak '{nama}' berhasil ditambahkan.")


def cari_kontak(daftar, nama):
    """Mencari nomor telepon berdasarkan nama menggunakan .get().

    Parameter:
        daftar (dict): dictionary kontak.
        nama (str): nama kontak yang dicari.

    Mengembalikan:
        str | None: nomor telepon, atau None jika tidak ditemukan.
    """
    return daftar.get(nama)


def tampilkan_kontak(daftar):
    """Menampilkan seluruh kontak yang tersimpan.

    Parameter:
        daftar (dict): dictionary kontak.

    Mengembalikan:
        None
    """
    if not daftar:
        print("Belum ada kontak tersimpan.")
        return

    print("=" * 38)
    print(f"{'No':<4}{'Nama':<18}{'Nomor Telepon':<16}")
    print("=" * 38)
    for i, (nama, nomor) in enumerate(daftar.items(), start=1):
        print(f"{i:<4}{nama:<18}{nomor:<16}")
    print("=" * 38)


def main():
    """Menjalankan menu interaktif katalog kontak."""
    while True:
        print("\n=== KATALOG KONTAK ===")
        print("1. Tambah kontak")
        print("2. Cari nomor telepon")
        print("3. Tampilkan semua kontak")
        print("4. Keluar")
        pilihan = input("Pilih menu (1-4): ")

        if pilihan == "1":
            nama = input("Nama   : ")
            nomor = input("Nomor  : ")
            tambah_kontak(kontak, nama, nomor)
        elif pilihan == "2":
            nama = input("Nama yang dicari: ")
            nomor = cari_kontak(kontak, nama)
            if nomor is None:
                print(f"Kontak '{nama}' tidak ditemukan.")
            else:
                print(f"Nomor {nama}: {nomor}")
        elif pilihan == "3":
            tampilkan_kontak(kontak)
        elif pilihan == "4":
            print("Terima kasih!")
            break
        else:
            print("Pilihan tidak valid, coba lagi.")


if __name__ == "__main__":
    main()