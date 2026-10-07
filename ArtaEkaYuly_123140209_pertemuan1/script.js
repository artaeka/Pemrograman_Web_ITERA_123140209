const KEY = "keranjangKasir";
const DISKON_MIN = 50000;
const PERSEN_DISKON = 0.1;

let keranjang = [];

const $ = (id) => document.getElementById(id);
const rupiah = (n) => "Rp " + n.toLocaleString("id-ID");

/* ---------- LocalStorage ---------- */
function simpan() {
  localStorage.setItem(KEY, JSON.stringify(keranjang));
}
function muat() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY));
    keranjang = Array.isArray(data) ? data : [];
  } catch (e) {
    keranjang = [];
  }
}

/* ---------- Validasi ---------- */
function setError(inputId, errId, pesan) {
  $(errId).textContent = pesan;
  $(inputId).classList.toggle("invalid", pesan !== "");
}

function validasi() {
  const nama = $("nama").value.trim();
  const harga = $("harga").value.trim();
  const qty = $("qty").value.trim();
  let valid = true;

  if (nama.length < 3) {
    setError("nama", "errNama", "Nama barang wajib diisi, minimal 3 karakter.");
    valid = false;
  } else setError("nama", "errNama", "");

  if (harga === "" || isNaN(Number(harga)) || Number(harga) < 500) {
    setError("harga", "errHarga", "Harga wajib berupa angka, minimal Rp 500.");
    valid = false;
  } else setError("harga", "errHarga", "");

  if (qty === "" || !Number.isInteger(Number(qty)) || Number(qty) < 1) {
    setError("qty", "errQty", "Jumlah wajib berupa angka bulat, minimal 1.");
    valid = false;
  } else setError("qty", "errQty", "");

  return valid ? { nama, harga: Number(harga), qty: Number(qty) } : null;
}

/* ---------- Perhitungan ---------- */
function hitung() {
  const total = keranjang.reduce((sum, b) => sum + b.harga * b.qty, 0);
  const kode = $("promo").value.trim().toUpperCase();
  const dapatDiskon = total >= DISKON_MIN || (kode === "HEMAT10" && total > 0);
  const diskon = dapatDiskon ? Math.round(total * PERSEN_DISKON) : 0;
  return { total, diskon, totalAkhir: total - diskon, dapatDiskon, kode };
}

/* ---------- Render ---------- */
function render() {
  const tbody = $("tbodyKeranjang");
  tbody.innerHTML = "";

  if (keranjang.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty">Keranjang masih kosong. Tambahkan barang lewat form.</td></tr>';
  }

  keranjang.forEach((b, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td></td>
      <td class="num">${rupiah(b.harga)}</td>
      <td class="num">${b.qty}</td>
      <td class="num">${rupiah(b.harga * b.qty)}</td>
      <td><button class="btn btn-danger" type="button" data-index="${i}">Hapus</button></td>`;
    tr.children[1].textContent = b.nama; // textContent mencegah injeksi HTML
    tbody.appendChild(tr);
  });

  const h = hitung();
  $("total").textContent = rupiah(h.total);
  $("diskon").textContent = "- " + rupiah(h.diskon);
  $("totalAkhir").textContent = rupiah(h.totalAkhir);

  if (h.diskon > 0) $("infoDiskon").textContent = "Diskon 10% berlaku.";
  else if (h.kode && h.kode !== "HEMAT10") $("infoDiskon").textContent = "Kode promo tidak dikenal.";
  else $("infoDiskon").textContent = "Diskon 10% untuk belanja minimal " + rupiah(DISKON_MIN) + " atau kode HEMAT10.";

  hitungKembalian();
}

function hitungKembalian() {
  const el = $("kembalian");
  const bayarStr = $("bayar").value.trim();
  const { totalAkhir } = hitung();
  el.className = "kembalian";

  if (bayarStr === "" || keranjang.length === 0) {
    el.textContent = "Kembalian: Rp 0";
    return;
  }
  const selisih = Number(bayarStr) - totalAkhir;
  if (selisih < 0) {
    el.textContent = "Uang belum mencukupi, kurang " + rupiah(Math.abs(selisih));
    el.classList.add("kurang");
  } else {
    el.textContent = "Kembalian: " + rupiah(selisih);
    el.classList.add("ok");
  }
}

/* ---------- Event ---------- */
$("formBarang").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = validasi();
  if (!data) return;
  keranjang.push(data);
  simpan();
  e.target.reset();
  render();
});

$("tbodyKeranjang").addEventListener("click", (e) => {
  const idx = e.target.dataset.index;
  if (idx === undefined) return;
  keranjang.splice(Number(idx), 1);
  simpan();
  render();
});

$("promo").addEventListener("input", render);
$("bayar").addEventListener("input", hitungKembalian);

$("btnReset").addEventListener("click", () => {
  if (keranjang.length > 0 && !confirm("Kosongkan keranjang dan mulai transaksi baru?")) return;
  keranjang = [];
  localStorage.removeItem(KEY);
  $("formBarang").reset();
  $("promo").value = "";
  $("bayar").value = "";
  ["nama", "harga", "qty"].forEach((f) => setError(f, "err" + f[0].toUpperCase() + f.slice(1), ""));
  render();
});

muat();
render();
