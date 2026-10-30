"""Tugas 1: Program penghitung BMI (Body Mass Index) sederhana."""


def hitung_bmi(berat, tinggi):
    """Menghitung nilai BMI.

    Parameter:
        berat (float): berat badan dalam kilogram (kg).
        tinggi (float): tinggi badan dalam meter (m).

    Mengembalikan:
        float: nilai BMI = berat / (tinggi * tinggi).
    """
    return berat / (tinggi * tinggi)


def tentukan_kategori(bmi):
    """Menentukan kategori BMI.

    Parameter:
        bmi (float): nilai BMI.

    Mengembalikan:
        str: kategori status berat badan.
    """
    if bmi < 18.5:
        return "Berat badan kurang"
    elif bmi < 25:
        return "Berat badan normal"
    elif bmi < 30:
        return "Berat badan berlebih"
    else:
        return "Obesitas"


def main():
    """Meminta input pengguna, lalu mencetak BMI dan kategorinya."""
    berat_badan = float(input("Masukkan berat badan (kg): "))
    tinggi_badan = float(input("Masukkan tinggi badan (m): "))

    if berat_badan <= 0 or tinggi_badan <= 0:
        print("Berat dan tinggi badan harus lebih dari 0.")
        return

    bmi = hitung_bmi(berat_badan, tinggi_badan)
    kategori = tentukan_kategori(bmi)

    print("-" * 35)
    print(f"Berat badan : {berat_badan:.1f} kg")
    print(f"Tinggi badan: {tinggi_badan:.2f} m")
    print(f"Nilai BMI   : {bmi:.2f}")
    print(f"Kategori    : {kategori}")
    print("-" * 35)


if __name__ == "__main__":
    main()
