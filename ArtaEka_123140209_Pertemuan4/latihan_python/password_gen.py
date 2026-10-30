"""Modul generator password acak."""

import random
import string


def buat_password_acak(panjang=8):
    """Membuat password acak dari huruf dan angka.

    Parameter:
        panjang (int): jumlah karakter password (default 8).

    Mengembalikan:
        str: password acak berisi huruf (a-z, A-Z) dan angka (0-9).
    """
    karakter = string.ascii_letters + string.digits
    return "".join(random.choice(karakter) for _ in range(panjang))