"""Tugas 2: Program pengelolaan data nilai mahasiswa."""

BOBOT_UTS = 0.30
BOBOT_UAS = 0.40
BOBOT_TUGAS = 0.30

data_mahasiswa = [
    {"nama": "Arta Eka", "nim": "123140001", "nilai_uts": 85, "nilai_uas": 90, "nilai_tugas": 88},
    {"nama": "Abdullah Azzam", "nim": "123370141", "nilai_uts": 72, "nilai_uas": 75, "nilai_tugas": 80},
    {"nama": "Monica Laraswati", "nim": "123140003", "nilai_uts": 65, "nilai_uas": 60, "nilai_tugas": 70},
    {"nama": "Muhammad Fatir", "nim": "123140004", "nilai_uts": 55, "nilai_uas": 50, "nilai_tugas": 60},
    {"nama": "Ignatius Fernando", "nim": "123140005", "nilai_uts": 40, "nilai_uas": 45, "nilai_tugas": 35},
    {"nama": "Dini Diamini", "nim": "123140006", "nilai_uts": 78, "nilai_uas": 82, "nilai_tugas": 75},
]


def hitung_nilai_akhir(uts, uas, tugas):
    """Menghitung nilai akhir berbobot.

    Parameter:
        uts (float): nilai UTS.
        uas (float): nilai UAS.
        tugas (float): nilai tugas.

    Mengembalikan:
        float: 30% * UTS + 40% * UAS + 30% * Tugas.
    """
    return BOBOT_UTS * uts + BOBOT_UAS * uas + BOBOT_TUGAS * tugas


def tentukan_grade(nilai_akhir):
    """Menentukan grade huruf dari nilai akhir.

    Parameter:
        nilai_akhir (float): nilai akhir mahasiswa.

    Mengembalikan:
        str: grade A, B, C, D, atau E.
    """
    if nilai_akhir >= 80:
        return "A"
    elif nilai_akhir >= 70:
        return "B"
    elif nilai_akhir >= 60:
        return "C"
    elif nilai_akhir >= 50:
        return "D"
    else:
        return "E"


def proses_data(daftar):
    """Menambahkan kunci nilai_akhir dan grade ke setiap mahasiswa.

    Parameter:
        daftar (list): list dictionary data mahasiswa.

    Mengembalikan:
        None: dictionary pada list diperbarui langsung.
    """
    for mhs in daftar:
        mhs["nilai_akhir"] = hitung_nilai_akhir(
            mhs["nilai_uts"], mhs["nilai_uas"], mhs["nilai_tugas"]
        )
        mhs["grade"] = tentukan_grade(mhs["nilai_akhir"])


def tampilkan_tabel(daftar):
    """Mencetak tabel data mahasiswa ke terminal.

    Parameter:
        daftar (list): list dictionary mahasiswa yang sudah diproses.

    Mengembalikan:
        None
    """
    garis = "=" * 62
    print(garis)
    print(f"{'No':<4}{'Nama':<20}{'NIM':<14}{'Nilai Akhir':>12}{'Grade':>8}")
    print(garis)
    for i, mhs in enumerate(daftar, start=1):
        print(
            f"{i:<4}{mhs['nama']:<20}{mhs['nim']:<14}"
            f"{mhs['nilai_akhir']:>12.2f}{mhs['grade']:>8}"
        )
    print(garis)


def tampilkan_info(judul, mhs):
    """Mencetak informasi satu mahasiswa.

    Parameter:
        judul (str): judul yang ditampilkan.
        mhs (dict): data mahasiswa.

    Mengembalikan:
        None
    """
    print(
        f"{judul}: {mhs['nama']} ({mhs['nim']}) - "
        f"Nilai Akhir {mhs['nilai_akhir']:.2f}, Grade {mhs['grade']}"
    )


def main():
    """Menjalankan seluruh alur program."""
    proses_data(data_mahasiswa)
    tampilkan_tabel(data_mahasiswa)

    tertinggi = max(data_mahasiswa, key=lambda m: m["nilai_akhir"])
    terendah = min(data_mahasiswa, key=lambda m: m["nilai_akhir"])

    print()
    tampilkan_info("Nilai tertinggi", tertinggi)
    tampilkan_info("Nilai terendah ", terendah)


if __name__ == "__main__":
    main()
