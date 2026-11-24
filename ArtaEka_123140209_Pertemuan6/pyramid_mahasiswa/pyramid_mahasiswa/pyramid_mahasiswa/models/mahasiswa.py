from sqlalchemy import (
    Column,
    Integer,
    Text,
    Date,
)
from .meta import Base


class Mahasiswa(Base):
    """Model ORM untuk tabel data mahasiswa"""
    __tablename__ = 'mahasiswa'

    id = Column(Integer, primary_key=True)
    nim = Column(Text, unique=True, nullable=False)
    nama = Column(Text, nullable=False)
    jurusan = Column(Text, nullable=False)
    tanggal_lahir = Column(Date)
    alamat = Column(Text)

    def to_dict(self):
        """Serialisasi objek model menjadi dictionary (siap jadi JSON)"""
        tanggal = self.tanggal_lahir
        return {
            'id': self.id,
            'nim': self.nim,
            'nama': self.nama,
            'jurusan': self.jurusan,
            'tanggal_lahir': tanggal.isoformat() if tanggal else None,
            'alamat': self.alamat,
        }
