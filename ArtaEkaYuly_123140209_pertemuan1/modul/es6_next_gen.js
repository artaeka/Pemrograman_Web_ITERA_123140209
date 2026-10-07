// JavaScript Next Gen (ES6+) - jalankan: node es6_next_gen.js

// 1. let & const
const PI = 3.14; let counter = 0; counter++;

// 2. Arrow function & default parameter
const tambah = (a, b = 0) => a + b;
console.log("Arrow:", tambah(5), tambah(5, 3));

// 3. Template literal
const nama = "Arta";
console.log(`Halo, ${nama}! 2 + 3 = ${2 + 3}`);

// 4. Destructuring (objek & array)
const mhs = { nama: "Arta", nim: "123140209", prodi: "TI" };
const { nim, prodi } = mhs;
const [pertama, , ketiga] = [10, 20, 30];
console.log("Destructuring:", nim, prodi, pertama, ketiga);

// 5. Spread & rest
const a = [1, 2], b = [3, 4];
const gabung = [...a, ...b];
const mhsBaru = { ...mhs, semester: 5 };
const jumlah = (...angka) => angka.reduce((s, n) => s + n, 0);
console.log("Spread:", gabung, mhsBaru, "Rest:", jumlah(1, 2, 3, 4));

// 6. Shorthand property & optional chaining & nullish coalescing
const umur = 20;
const orang = { nama, umur, alamat: null };
console.log(orang, orang.alamat?.kota, orang.alamat ?? "Belum diisi");

// 7. Class
class Mahasiswa {
  constructor(nama, ipk) { this.nama = nama; this.ipk = ipk; }
  info() { return `${this.nama} (IPK ${this.ipk})`; }
}
class MahasiswaAktif extends Mahasiswa {
  info() { return super.info() + " - aktif"; }
}
console.log(new MahasiswaAktif("Budi", 3.4).info());

// 8. Module (ES Module) - contoh sintaks:
//   export const sapa = (n) => `Hai ${n}`;   |   import { sapa } from "./file.js";

// 9. Promise & async/await
const tunggu = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function jalankan() {
  console.log("Mulai...");
  await tunggu(500);
  console.log("Selesai setelah 500 ms");
}
jalankan();

// 10. Map, Set, dan method baru
const unik = [...new Set([1, 2, 2, 3, 3])];
const peta = new Map([["a", 1], ["b", 2]]);
console.log("Set:", unik, "Map:", peta.get("b"), "includes:", [1, 2].includes(2));
