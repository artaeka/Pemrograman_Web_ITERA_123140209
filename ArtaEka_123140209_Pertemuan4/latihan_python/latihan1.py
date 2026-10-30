"""Latihan 1: Identitas diri dan eksperimen fungsi print()."""

nama = "Arta Eka Yuli Rajagukguk"
nim = "123140209"
angkatan = "2023"  # sesuaikan jika berbeda
minat = "Web GIS dan Pengembangan Web"

# 1. Cetak biasa
print("=== Profil Diri ===")
print("Nama           :", nama)
print("NIM            :", nim)
print("Angkatan       :", angkatan)
print("Minat Penelitian:", minat)

# 2. Eksperimen parameter sep
print("\n=== Eksperimen sep ===")
print(nama, nim, angkatan, minat, sep=" | ")
print(nama, nim, angkatan, minat, sep=" - ")
print(nama, nim, angkatan, minat, sep="\n")

# 3. Eksperimen parameter end
print("\n=== Eksperimen end ===")
print("Halo,", end=" ")
print("saya", end=" ")
print(nama)

# 4. Kartu identitas berbingkai '#' memakai escape character (\n dan \t)
garis = "#" * 50
print("\n" + garis)
print("#" + " " * 48 + "#")
print("#\t   KARTU IDENTITAS MAHASISWA\t #")
print("#" + " " * 48 + "#")
print(f"#  Nama     : {nama:<34}#")
print(f"#  NIM      : {nim:<34}#")
print(f"#  Angkatan : {angkatan:<34}#")
print(f"#  Minat    : {minat:<34}#")
print("#" + " " * 48 + "#")
print(garis)

# 5. Contoh escape character lain
print("\nContoh escape character:")
print("Baris 1\nBaris 2\tTab\t\"Tanda kutip\"\t\\ (backslash)")