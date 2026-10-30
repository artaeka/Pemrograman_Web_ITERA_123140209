"""Latihan 3: Game tebak angka rahasia sederhana."""

ANGKA_RAHASIA = 7

print("=== Game Tebak Angka ===")
print("Tebak angka rahasia saya!")

while True:
    tebakan = int(input("Masukkan tebakanmu: "))

    if tebakan < ANGKA_RAHASIA:
        print("Terlalu kecil!")
    elif tebakan > ANGKA_RAHASIA:
        print("Terlalu besar!")
    else:
        print("Selamat, tebakan benar!")
        break