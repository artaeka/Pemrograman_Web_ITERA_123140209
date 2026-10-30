"""Program utama: menguji modul password_gen."""

import password_gen
from password_gen import buat_password_acak


def main():
    """Menguji fungsi buat_password_acak dengan berbagai panjang."""
    print("=== Generator Password Acak ===")

    # Panjang default (8 karakter)
    print(f"Default (8)  : {password_gen.buat_password_acak()}")

    # Panjang bervariasi
    for panjang in (6, 12, 16):
        print(f"Panjang {panjang:<4}: {buat_password_acak(panjang)}")

    # Membuat beberapa password sekaligus
    print("\n5 password acak (panjang 10):")
    for i in range(1, 6):
        print(f"{i}. {buat_password_acak(10)}")


if __name__ == "__main__":
    main()