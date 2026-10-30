"""Modul operasi matematika: geometri dan konversi suhu."""

PI = 3.14159


# ---------- Geometri ----------
def luas_persegi(sisi):
    """Menghitung luas persegi.

    Parameter:
        sisi (float): panjang sisi.

    Mengembalikan:
        float: luas = sisi * sisi.
    """
    return sisi * sisi


def keliling_persegi(sisi):
    """Menghitung keliling persegi.

    Parameter:
        sisi (float): panjang sisi.

    Mengembalikan:
        float: keliling = 4 * sisi.
    """
    return 4 * sisi


def luas_persegi_panjang(panjang, lebar):
    """Menghitung luas persegi panjang.

    Parameter:
        panjang (float): panjang.
        lebar (float): lebar.

    Mengembalikan:
        float: luas = panjang * lebar.
    """
    return panjang * lebar


def keliling_persegi_panjang(panjang, lebar):
    """Menghitung keliling persegi panjang.

    Parameter:
        panjang (float): panjang.
        lebar (float): lebar.

    Mengembalikan:
        float: keliling = 2 * (panjang + lebar).
    """
    return 2 * (panjang + lebar)


def luas_lingkaran(jari_jari):
    """Menghitung luas lingkaran.

    Parameter:
        jari_jari (float): jari-jari lingkaran.

    Mengembalikan:
        float: luas = PI * r * r.
    """
    return PI * jari_jari * jari_jari


def keliling_lingkaran(jari_jari):
    """Menghitung keliling lingkaran.

    Parameter:
        jari_jari (float): jari-jari lingkaran.

    Mengembalikan:
        float: keliling = 2 * PI * r.
    """
    return 2 * PI * jari_jari


# ---------- Konversi suhu ----------
def celsius_ke_fahrenheit(celsius):
    """Mengonversi Celsius ke Fahrenheit.

    Parameter:
        celsius (float): suhu dalam Celsius.

    Mengembalikan:
        float: suhu dalam Fahrenheit.
    """
    return celsius * 9 / 5 + 32


def celsius_ke_kelvin(celsius):
    """Mengonversi Celsius ke Kelvin.

    Parameter:
        celsius (float): suhu dalam Celsius.

    Mengembalikan:
        float: suhu dalam Kelvin.
    """
    return celsius + 273.15
