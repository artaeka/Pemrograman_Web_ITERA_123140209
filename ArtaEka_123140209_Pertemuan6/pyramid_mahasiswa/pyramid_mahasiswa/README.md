# Aplikasi RESTful API Manajemen Matakuliah

Pengembangan dari praktikum Pertemuan 06 (Pyramid Framework). Aplikasi ini
menambahkan modul **Matakuliah** berbasis PostgreSQL yang mencakup model ORM
SQLAlchemy, migrasi Alembic, seeding data awal, routing URL Dispatch, dan view
CRUD berformat JSON. Modul **Mahasiswa** dari praktikum sebelumnya tetap ada.

## Identitas

| | |
|---|---|
| Nama | Arta Eka Yuly R |
| NIM | 123140209 |
| Kelas | Praktikum PAW-RB |

## Teknologi

- Python 3.10+
- Pyramid 2.x
- SQLAlchemy 2.x
- Alembic
- PostgreSQL
- Waitress (server WSGI)

## Struktur Proyek

```
pyramid_mahasiswa/
├── development.ini
├── README.md
├── screenshots/                    # bukti pengujian
├── tests_curl/                     # berkas JSON dan skrip uji cURL
└── pyramid_mahasiswa/
    ├── alembic/versions/           # revisi migrasi (mahasiswa, matakuliah)
    ├── models/matakuliah.py        # model ORM + to_dict()
    ├── views/matakuliah.py         # view CRUD matakuliah
    ├── routes.py                   # 5 route dengan predikat request_method
    └── scripts/initialize_db.py    # seeding data awal
```

## Instalasi

```powershell
git clone <url-repositori>
cd <nama-folder-repositori>
python -m venv venv
venv\Scripts\Activate.ps1
pip install -e ".[testing]"
pip install psycopg2-binary
```

Jika PowerShell menolak menjalankan skrip aktivasi, jalankan:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Konfigurasi Database

Masuk ke PostgreSQL (`psql -U postgres`), lalu jalankan:

```sql
CREATE DATABASE pyramid_mahasiswa;
CREATE USER pyramid_user WITH ENCRYPTED PASSWORD 'pyramid_pass';
ALTER DATABASE pyramid_mahasiswa OWNER TO pyramid_user;
\c pyramid_mahasiswa
ALTER SCHEMA public OWNER TO pyramid_user;
GRANT ALL ON SCHEMA public TO pyramid_user;
\q
```

Atur koneksi pada `development.ini`:

```ini
sqlalchemy.url = postgresql+psycopg2://pyramid_user:pyramid_pass@localhost:5432/pyramid_mahasiswa
```

## Migrasi dan Seeding

```powershell
alembic -c development.ini upgrade head
initialize_pyramid_mahasiswa_db development.ini
```

Migrasi untuk tabel `matakuliah` dibuat dengan:

```powershell
alembic -c development.ini revision --autogenerate -m "create matakuliah table"
```

Seeding aman dijalankan berulang kali karena hanya mengisi tabel yang masih
kosong. Data awal matakuliah:

| kode_mk | nama_mk | sks | semester |
|---------|---------|-----|----------|
| IF2110 | Algoritma dan Struktur Data | 3 | 3 |
| IF3140 | Basis Data | 4 | 5 |
| IF3110 | Pemrograman Web | 3 | 5 |

## Menjalankan Server

```powershell
pserve development.ini --reload
```

Server berjalan di `http://localhost:6543`.

## Endpoint Matakuliah

| Method | URL | Keterangan | Status |
|--------|-----|-----------|--------|
| GET | `/api/matakuliah` | Daftar seluruh matakuliah | 200 |
| GET | `/api/matakuliah/{id}` | Detail matakuliah berdasarkan ID | 200, 404 |
| POST | `/api/matakuliah` | Tambah matakuliah baru | 200, 400 |
| PUT | `/api/matakuliah/{id}` | Perbarui matakuliah (parsial) | 200, 400, 404 |
| DELETE | `/api/matakuliah/{id}` | Hapus matakuliah | 200, 404 |

### Aturan Validasi

- `kode_mk`, `nama_mk`, `sks`, dan `semester` wajib diisi saat POST.
- `sks` dan `semester` harus bilangan bulat lebih dari 0 (nol dan negatif ditolak).
- `kode_mk` harus unik.
- PUT menerima sebagian field; field yang tidak dikirim tidak berubah.
- Body yang bukan JSON object yang valid menghasilkan 400.

### Contoh Request dan Response

POST `/api/matakuliah`

```json
{
  "kode_mk": "IF4010",
  "nama_mk": "Kecerdasan Buatan",
  "sks": 3,
  "semester": 6
}
```

Response 200:

```json
{
  "success": true,
  "matakuliah": {
    "id": 4,
    "kode_mk": "IF4010",
    "nama_mk": "Kecerdasan Buatan",
    "sks": 3,
    "semester": 6
  }
}
```

## Pengujian

Pengujian memakai cURL di Windows PowerShell. Gunakan `curl.exe` (bukan
`curl`, yang merupakan alias `Invoke-WebRequest`) dan kirim JSON lewat berkas
agar tanda kutip tidak rusak. Berkas uji ada di folder `tests_curl/`.

```powershell
curl.exe -i http://localhost:6543/api/matakuliah
curl.exe -i http://localhost:6543/api/matakuliah/1
curl.exe -i http://localhost:6543/api/matakuliah/9999
curl.exe -i -X POST http://localhost:6543/api/matakuliah -H "Content-Type: application/json" -d "@tests_curl/post_ok.json"
curl.exe -i -X POST http://localhost:6543/api/matakuliah -H "Content-Type: application/json" -d "@tests_curl/post_incomplete.json"
curl.exe -i -X POST http://localhost:6543/api/matakuliah -H "Content-Type: application/json" -d "@tests_curl/post_invalid.json"
curl.exe -i -X PUT http://localhost:6543/api/matakuliah/1 -H "Content-Type: application/json" -d "@tests_curl/put_ok.json"
curl.exe -i -X DELETE http://localhost:6543/api/matakuliah/4
curl.exe -i -X DELETE http://localhost:6543/api/matakuliah/4
```

### Bukti Tangkapan Layar

**1. GET semua matakuliah (200)**

![GET semua](screenshots/01_get_all.png)

**2. GET detail matakuliah (200)**

![GET detail](screenshots/02_get_detail.png)

**3. GET ID tidak ditemukan (404)**

![GET 404](screenshots/03_get_404.png)

**4. POST data valid (200)**

![POST sukses](screenshots/04_post_ok.png)

**5. POST data tidak lengkap (400)**

![POST tidak lengkap](screenshots/05_post_400.png)

**6. POST sks nol dan semester negatif (400)**

![POST tidak valid](screenshots/06_post_invalid.png)

**7. PUT perbarui data (200)**

![PUT](screenshots/07_put.png)

**8. DELETE data (200)**

![DELETE](screenshots/08_delete.png)

**9. DELETE ulang, data sudah tidak ada (404)**

![DELETE 404](screenshots/09_delete_404.png)

## Kerapian Kode

Kode mengikuti PEP 8 dan diperiksa dengan:

```powershell
pip install flake8
flake8 pyramid_mahasiswa --max-line-length=79 --exclude=alembic
```