from pyramid.httpexceptions import HTTPBadRequest, HTTPNotFound
from pyramid.view import view_config

from ..models import Matakuliah

REQUIRED_FIELDS = ('kode_mk', 'nama_mk', 'sks', 'semester')


def _bad_request(message):
    return HTTPBadRequest(json_body={'error': message})


def _not_found(mk_id):
    return HTTPNotFound(
        json_body={'error': f'Matakuliah dengan ID {mk_id} tidak ditemukan'}
    )


def _get_json(request):
    """Ambil body JSON berupa object; kembalikan None jika tidak valid."""
    try:
        data = request.json_body
    except ValueError:
        return None
    return data if isinstance(data, dict) else None


def _validate(data, partial=False):
    """Kembalikan pesan error (str), atau None jika data valid."""
    if not partial:
        missing = [f for f in REQUIRED_FIELDS if data.get(f) in (None, '')]
        if missing:
            return 'Field wajib belum lengkap: ' + ', '.join(missing)

    for field in ('kode_mk', 'nama_mk'):
        if field in data:
            value = data[field]
            if not isinstance(value, str) or not value.strip():
                return f'{field} harus berupa teks yang tidak kosong'

    for field in ('sks', 'semester'):
        if field in data:
            value = data[field]
            # bool adalah subclass dari int, jadi ditolak secara eksplisit
            if isinstance(value, bool) or not isinstance(value, int):
                return f'{field} harus berupa bilangan bulat'
            if value <= 0:
                return f'{field} harus lebih besar dari 0'
    return None


def _kode_exists(dbsession, kode_mk, exclude_id=None):
    query = dbsession.query(Matakuliah).filter_by(kode_mk=kode_mk)
    if exclude_id is not None:
        query = query.filter(Matakuliah.id != exclude_id)
    return query.first() is not None


def _find(request):
    """Cari matakuliah dari {id} di URL; kembalikan (objek, id_mentah)."""
    raw_id = request.matchdict['id']
    if not raw_id.isdigit():
        return None, raw_id
    return request.dbsession.get(Matakuliah, int(raw_id)), raw_id


# 1. READ ALL
@view_config(route_name='matakuliah_list', renderer='json')
def matakuliah_list(request):
    """Menampilkan seluruh daftar mata kuliah."""
    items = request.dbsession.query(Matakuliah).order_by(Matakuliah.id).all()
    return {'matakuliah': [mk.to_dict() for mk in items]}


# 2. READ ONE
@view_config(route_name='matakuliah_detail', renderer='json')
def matakuliah_detail(request):
    """Menampilkan detail mata kuliah berdasarkan ID (404 jika tidak ada)."""
    mk, raw_id = _find(request)
    if mk is None:
        return _not_found(raw_id)
    return {'matakuliah': mk.to_dict()}


# 3. CREATE
@view_config(route_name='matakuliah_add', renderer='json')
def matakuliah_add(request):
    """Menambah mata kuliah baru (400 jika data tidak lengkap/valid)."""
    data = _get_json(request)
    if data is None:
        return _bad_request('Body harus berupa JSON object yang valid')

    message = _validate(data)
    if message:
        return _bad_request(message)

    kode_mk = data['kode_mk'].strip()
    if _kode_exists(request.dbsession, kode_mk):
        return _bad_request(f'kode_mk {kode_mk} sudah digunakan')

    mk = Matakuliah(
        kode_mk=kode_mk,
        nama_mk=data['nama_mk'].strip(),
        sks=data['sks'],
        semester=data['semester'],
    )
    request.dbsession.add(mk)
    # flush agar id dari autoincrement PostgreSQL sudah terisi
    request.dbsession.flush()
    return {'success': True, 'matakuliah': mk.to_dict()}


# 4. UPDATE
@view_config(route_name='matakuliah_update', renderer='json')
def matakuliah_update(request):
    """Memperbarui mata kuliah; field yang tidak dikirim tidak berubah."""
    mk, raw_id = _find(request)
    if mk is None:
        return _not_found(raw_id)

    data = _get_json(request)
    if data is None:
        return _bad_request('Body harus berupa JSON object yang valid')

    message = _validate(data, partial=True)
    if message:
        return _bad_request(message)

    if 'kode_mk' in data:
        kode_mk = data['kode_mk'].strip()
        if _kode_exists(request.dbsession, kode_mk, exclude_id=mk.id):
            return _bad_request(f'kode_mk {kode_mk} sudah digunakan')
        mk.kode_mk = kode_mk
    if 'nama_mk' in data:
        mk.nama_mk = data['nama_mk'].strip()
    if 'sks' in data:
        mk.sks = data['sks']
    if 'semester' in data:
        mk.semester = data['semester']

    return {'success': True, 'matakuliah': mk.to_dict()}


# 5. DELETE
@view_config(route_name='matakuliah_delete', renderer='json')
def matakuliah_delete(request):
    """Menghapus mata kuliah berdasarkan ID (404 jika tidak ada)."""
    mk, raw_id = _find(request)
    if mk is None:
        return _not_found(raw_id)

    request.dbsession.delete(mk)
    return {
        'success': True,
        'message': f'Matakuliah dengan ID {raw_id} berhasil dihapus',
    }
