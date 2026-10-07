// Array & Objek - jalankan: node array_objek.js (atau tempel di Console browser)
const mahasiswa = [
  { nama: "Arta", nim: "123140209", ipk: 3.8, prodi: "Teknik Informatika" },
  { nama: "Budi", nim: "123140210", ipk: 3.2, prodi: "Sistem Informasi" },
  { nama: "Citra", nim: "123140211", ipk: 3.6, prodi: "Teknik Informatika" },
];

// Method array: push, pop, map, filter, find, reduce, sort
mahasiswa.push({ nama: "Dedi", nim: "123140212", ipk: 2.9, prodi: "Teknik Elektro" });
console.log("Nama semua:", mahasiswa.map((m) => m.nama));
console.log("IPK >= 3.5:", mahasiswa.filter((m) => m.ipk >= 3.5).map((m) => m.nama));
console.log("Cari NIM 123140210:", mahasiswa.find((m) => m.nim === "123140210"));
const rata = mahasiswa.reduce((s, m) => s + m.ipk, 0) / mahasiswa.length;
console.log("Rata-rata IPK:", rata.toFixed(2));
console.log("Urut IPK tertinggi:", [...mahasiswa].sort((a, b) => b.ipk - a.ipk).map((m) => m.nama));

// Akses & ubah objek
const mhs = mahasiswa[0];
mhs.semester = 5;            // tambah properti
mhs["ipk"] = 3.85;           // ubah dengan bracket
delete mhs.semester;         // hapus properti
console.log("Keys:", Object.keys(mhs));
console.log("Entries:", Object.entries(mhs));

// Mengelompokkan berdasarkan prodi
const perProdi = mahasiswa.reduce((hasil, m) => {
  (hasil[m.prodi] ||= []).push(m.nama);
  return hasil;
}, {});
console.log("Per prodi:", perProdi);

// Objek bersarang & looping
const kelas = { nama: "Pemrograman Web", dosen: { nama: "Pak Andi" }, peserta: mahasiswa.length };
for (const key in kelas) console.log(key, "=>", kelas[key]);
