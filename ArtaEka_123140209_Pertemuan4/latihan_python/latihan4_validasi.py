"""Latihan 4: Fungsi validator password."""


def validasi_password(password):
    """Memvalidasi password.

    Parameter:
        password (str): password yang akan diperiksa.

    Mengembalikan:
        bool: True jika panjang minimal 8 karakter dan mengandung
        setidaknya satu angka, selain itu False.
    """
    if len(password) < 8:
        return False

    for karakter in password:
        if karakter.isdigit():
            return True

    return False


# Pengujian dengan beberapa contoh password
daftar_uji = [
    "abc12345",       # valid: 8 karakter, ada angka
    "Rahasia2026",    # valid: panjang, ada angka
    "pass1",          # tidak valid: terlalu pendek
    "passwordsaja",   # tidak valid: tidak ada angka
    "12345678",       # valid: 8 karakter, semuanya angka
    "",               # tidak valid: kosong
]

print("=== Pengujian Validator Password ===")
for pw in daftar_uji:
    hasil = validasi_password(pw)
    status = "VALID" if hasil else "TIDAK VALID"
    print(f"{pw!r:<16} -> {hasil!s:<6} ({status})")