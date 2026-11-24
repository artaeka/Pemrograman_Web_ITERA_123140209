import datetime

from pyramid.httpexceptions import (
    HTTPNotFound,
    HTTPBadRequest,
)
from pyramid.view import view_config

from ..models import Mahasiswa

FORMAT_TANGGAL_ERROR = 'Format tanggal lahir tidak valid. Gunakan YYYY-MM-DD'


def _not_found(mahasiswa_id):
    return HTTPNotFound(json_body={
        'error': f'Mahasiswa dengan ID {mahasiswa_id} tidak ditemukan'
    })


def _find(request):
    mahasiswa_id = request.matchdict['id']
    mahasiswa = request.dbsession.query(Mahasiswa).filter_by(
        id=mahasiswa_id).first()
    return mahasiswa, mahasiswa_id


# 1. READ ALL: Menampilkan daftar seluruh mahasiswa
@view_config(route_name='mahasiswa_list', renderer='json')
def mahasiswa_list(request):
    """View untuk mengambil semua data mahasiswa"""
    dbsession = request.dbsession
    mahasiswas = dbsession.query(Mahasiswa).order_by(Mahasiswa.id.asc()).all()
    return {'mahasiswas': [m.to_dict() for m in mahasiswas]}


# 2. READ ONE: Menampilkan detail satu mahasiswa berdasarkan ID
@view_config(route_name='mahasiswa_detail', renderer='json')
def mahasiswa_detail(request):
    """View untuk melihat detail satu mahasiswa berdasarkan ID di URL"""
    mahasiswa, mahasiswa_id = _find(request)
    if mahasiswa is None:
        return _not_found(mahasiswa_id)
    return {'mahasiswa': mahasiswa.to_dict()}


# 3. CREATE: Menambahkan data mahasiswa baru
@view_config(route_name='mahasiswa_add', request_method='POST',
             renderer='json')
def mahasiswa_add(request):
    """View untuk menambahkan mahasiswa baru dari payload JSON"""
    try:
        json_data = request.json_body

        # Validasi field wajib
        required_fields = ['nim', 'nama', 'jurusan']
        for field in required_fields:
            if field not in json_data or not json_data[field]:
                return HTTPBadRequest(
                    json_body={'error': f'Field {field} wajib diisi!'})

        # Validasi dan konversi format tanggal ISO YYYY-MM-DD
        tanggal_lahir = None
        if 'tanggal_lahir' in json_data and json_data['tanggal_lahir']:
            try:
                tanggal_lahir = datetime.datetime.fromisoformat(
                    json_data['tanggal_lahir']).date()
            except ValueError:
                return HTTPBadRequest(
                    json_body={'error': FORMAT_TANGGAL_ERROR})

        mahasiswa = Mahasiswa(
            nim=json_data['nim'],
            nama=json_data['nama'],
            jurusan=json_data['jurusan'],
            tanggal_lahir=tanggal_lahir,
            alamat=json_data.get('alamat')
        )

        dbsession = request.dbsession
        dbsession.add(mahasiswa)
        # flush agar INSERT dijalankan dan id dari PostgreSQL terisi
        dbsession.flush()

        return {'success': True, 'mahasiswa': mahasiswa.to_dict()}

    except Exception as e:
        return HTTPBadRequest(json_body={'error': str(e)})


# 4. UPDATE: Mengubah data mahasiswa yang sudah ada
@view_config(route_name='mahasiswa_update', request_method='PUT',
             renderer='json')
def mahasiswa_update(request):
    """View untuk mengupdate data mahasiswa berdasarkan ID"""
    mahasiswa, mahasiswa_id = _find(request)
    if mahasiswa is None:
        return _not_found(mahasiswa_id)

    try:
        json_data = request.json_body

        if 'nim' in json_data:
            mahasiswa.nim = json_data['nim']
        if 'nama' in json_data:
            mahasiswa.nama = json_data['nama']
        if 'jurusan' in json_data:
            mahasiswa.jurusan = json_data['jurusan']
        if 'alamat' in json_data:
            mahasiswa.alamat = json_data['alamat']

        if 'tanggal_lahir' in json_data:
            if json_data['tanggal_lahir']:
                try:
                    mahasiswa.tanggal_lahir = (
                        datetime.datetime.fromisoformat(
                            json_data['tanggal_lahir']).date())
                except ValueError:
                    return HTTPBadRequest(
                        json_body={'error': FORMAT_TANGGAL_ERROR})
            else:
                mahasiswa.tanggal_lahir = None

        return {'success': True, 'mahasiswa': mahasiswa.to_dict()}

    except Exception as e:
        return HTTPBadRequest(json_body={'error': str(e)})


# 5. DELETE: Menghapus data mahasiswa
@view_config(route_name='mahasiswa_delete', request_method='DELETE',
             renderer='json')
def mahasiswa_delete(request):
    """View untuk menghapus mahasiswa berdasarkan ID"""
    mahasiswa, mahasiswa_id = _find(request)
    if mahasiswa is None:
        return _not_found(mahasiswa_id)

    request.dbsession.delete(mahasiswa)

    return {
        'success': True,
        'message': f'Mahasiswa dengan ID {mahasiswa_id} berhasil dihapus',
    }
