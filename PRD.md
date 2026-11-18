# PRD — Tebak Intro (Intro Guess Game)

## 1. Informasi Proyek

| Field | Nilai |
|---|---|
| Nama Proyek | Tebak Intro (Intro Guess Game) |
| Repo | dezzorigin/intro-guess-game |
| Live | https://tebak-intro.pages.dev |
| Tech Stack | HTML / CSS / JavaScript (statis, tanpa build step, tanpa backend) |
| Status | Live — rilis 1.2.0 (landing SaaS) |
| Penanggung Jawab | Nabil Aulia Dika (dezzorigin) |
| Versi Dokumen | 2.1 (diperbarui 18 Nov 2026) |

## 2. Latar Belakang

Game tebak lagu dari intro: pemain mendengar potongan awal sebuah lagu, lalu
menebak judulnya. Semakin pendek intro yang dibutuhkan, semakin besar poin.
Game ini dibuat sebagai proyek portofolio — satu halaman statis yang langsung
bisa dimainkan tanpa daftar, tanpa instalasi, tanpa server. Pengunjung baru
melihat landing page ala SaaS dulu (navbar, hero, cara main, fitur), lalu
klik "Mulai Main" untuk masuk ke game.

## 3. Masalah yang Diselesaikan

- Hiburan tebak lagu yang biasanya butuh aplikasi / akun — di sini cukup buka
  link dan main.
- Preview lagu legal dan gratis: memakai preview 30 detik dari iTunes Search
  API, tanpa menyimpan file audio apa pun di repo.

## 4. Tujuan & Sasaran

- Pemain bisa menyelesaikan satu ronde penuh (menang atau kalah) tanpa error.
- Game jalan di browser desktop dan mobile, tanpa login.
- Kode dan dokumentasi rapi standar repo proper: README lengkap, CI hijau,
  docs arsitektur, deploy live.

## 5. Ruang Lingkup

### In Scope

- Landing page ala SaaS: navbar sticky (logo, Cara Main, Fitur, ikon GitHub
  di kanan → repo), hero dua kolom (headline + preview mockup tampilan
  game), section Cara Main, section fitur, CTA band, footer.
- 4 kategori lagu: Indonesia Hits, Barat Hits, K-Pop, TikTok Viral.
- 5 level kesulitan: Easy 1 dtk, Medium 2,5 dtk, Hard 5 dtk, Expert 10 dtk,
  Impossible 16 dtk.
- Skor (500–100 poin per jawaban benar, tergantung level), streak, ronde.
- Pencarian lagu (iTunes Search API), Skip, Menyerah, Putar Full Preview.
- Deploy statis di Cloudflare Pages.

### Out of Scope

- Akun, leaderboard server, dan penyimpanan skor permanen (skor hanya
  selama sesi berjalan).
- File audio di repo — semua audio di-stream dari iTunes.
- Backend apa pun.

## 6. Fitur & Persyaratan Fungsional

| # | Fitur | Perilaku |
|---|---|---|
| 0 | Landing page | Pengunjung baru melihat landing; klik "Mulai Main" menyembunyikan landing + navbar dan menampilkan game; ronde pertama sudah dimuat di latar belakang |
| 1 | Pilih kategori | Dropdown 4 kategori; lagu baru diambil dari pool artis kategori itu |
| 2 | Putar intro | Tombol play memutar preview sepanjang durasi level aktif, lalu berhenti sendiri |
| 3 | Tebak lagu | Ketik judul/penyanyi → hasil pencarian iTunes (maks. 8) → klik jawaban |
| 4 | Jawaban benar | Skor += (5 − level) × 100, streak +1, kartu reveal tampil (judul, artis, cover, pesan menang) |
| 5 | Jawaban salah / Skip | Naik satu level; di level Impossible, jawaban salah = kalah |
| 6 | Kalah | Streak reset 0, kartu reveal tampil dengan jawaban benar |
| 7 | Ronde berikut | Tombol Lanjut memuat lagu baru, ronde +1, skor dipertahankan |
| 8 | Menyerah | Reveal jawaban tanpa poin |
| 9 | Full preview | Putar preview 30 detik penuh dari kartu reveal |

## 7. Persyaratan Non-Fungsional

- **Performa:** satu halaman statis; tidak ada build step; muat cepat.
- **Ketergantungan:** iTunes Search API (`itunes.apple.com/search`, tanpa key)
  dan CDN audio iTunes. Kalau API tidak terjangkau, game menampilkan pesan
  gagal load dan tombol Lagu Baru.
- **Keamanan:** tidak ada secret di repo; tidak ada `.env`; tidak ada data
  pengguna yang dikumpulkan.
- **Portabilitas:** semua browser modern; layout responsif sampai 600px.
- **Keterbatasan yang diketahui:** skor hilang saat halaman di-refresh;
  kualitas tebakan tergantung hasil pencarian iTunes.

## 8. Arsitektur & Tech Stack

Satu halaman statis, tanpa framework: `index.html` (struktur) +
`style.css` (tema ungu-hijau) + `app.js` (semua logika). Detail alur dan
diagram ada di [docs/architecture.md](docs/architecture.md).

## 9. Milestone / Roadmap

| Fase | Status |
|---|---|
| Game inti (kategori, level, skor, reveal) | ✅ Selesai |
| Rilis proper 1.1.0 (README, CI, docs, deploy) | ✅ Selesai 18 Nov 2026 |
| Landing page ala SaaS (navbar + hero + cara main + fitur) | ✅ Selesai 18 Nov 2026 |
| Video demo + screenshot di README | ✅ Selesai 18 Nov 2026 |
| Skor tersimpan (localStorage) | 🔮 Berikutnya |
| Mode duel / bagikan skor | 🔮 Berikutnya |
| Kategori tambahan | 🔮 Berikutnya |

## 10. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| iTunes API tidak terjangkau | Pesan error jelas + tombol Lagu Baru; tidak ada yang crash |
| Preview audio gagal diputar | `play()` ditangkap promise-nya; ronde tetap bisa dilanjutkan |
| Perubahan format respons iTunes | Filter hanya hasil yang punya `previewUrl` |

## 11. Kriteria Keberhasilan

- Landing page tampil dulu untuk pengunjung baru; "Mulai Main" masuk ke game.
- Satu ronde penuh (menang + lanjut + kalah) terverifikasi di situs live.
- CI hijau (html-validate + link check).
- README memuat screenshot + video demo dari situs live.

## 12. Lampiran

- Arsitektur: [docs/architecture.md](docs/architecture.md)
- Lisensi: MIT ([LICENSE](LICENSE))
