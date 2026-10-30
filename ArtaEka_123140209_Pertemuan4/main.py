"""Program utama: menguji seluruh fungsi pada math_operations."""

import math_operations  # cara impor 1: seluruh modul
from math_operations import (  # cara impor 2: fungsi tertentu
    celsius_ke_fahrenheit,
    celsius_ke_kelvin,
)


def garis(judul):
    """Mencetak judul bagian.

    Parameter:
        judul (str): teks judul.

    Mengembalikan:
        None
    """
    print(f"\n=== {judul} ===")


def main():
    """Menjalankan pengujian semua fungsi modul."""
    print(f"Konstanta PI = {math_operations.PI}")

    garis("PERSEGI")
    for sisi in (4, 7.5):
        print(
            f"Sisi {sisi}: luas = {math_operations.luas_persegi(sisi):.2f}, "
            f"keliling = {math_operations.keliling_persegi(sisi):.2f}"
        )

    garis("PERSEGI PANJANG")
    for p, l in ((5, 3), (10, 2.5)):
        print(
            f"P={p}, L={l}: "
            f"luas = {math_operations.luas_persegi_panjang(p, l):.2f}, "
            f"keliling = {math_operations.keliling_persegi_panjang(p, l):.2f}"
        )

    garis("LINGKARAN")
    for r in (7, 10.5):
        print(
            f"r={r}: luas = {math_operations.luas_lingkaran(r):.2f}, "
            f"keliling = {math_operations.keliling_lingkaran(r):.2f}"
        )

    garis("KONVERSI SUHU")
    for c in (0, 37, 100):
        print(
            f"{c} C = {celsius_ke_fahrenheit(c):.2f} F = "
            f"{celsius_ke_kelvin(c):.2f} K"
        )


if __name__ == "__main__":
    main()
