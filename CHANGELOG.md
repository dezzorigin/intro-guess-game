# Changelog

Semua perubahan penting proyek ini dicatat di sini. Format mengikuti
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.1.0] - 2026-11-18

Rilis proper pertama (program P1 → P0, repo #1).

### Added

- README lengkap standar repo top: cara main, tabel level & skor, screenshot,
  video demo, dan link live.
- CI GitHub Actions: `html-validate` + `markdown-link-check`.
- `docs/architecture.md`: arsitektur, alur ronde, dan diagram alur game.
- `favicon.svg` (sebelumnya favicon 404).
- Deploy live di Cloudflare Pages: https://tebak-intro.pages.dev.

### Fixed

- `stopClip()` ganda memanggil `pause()` sehingga memunculkan error
  `AbortError` di console saat klip selesai. Sekarang idempotent.
- Promise `audio.play()` yang gagal tidak lagi melempar uncaught error.
- Instruksi "Getting Started" README yang salah (sebelumnya `npm install` /
  `npm run dev` padahal proyek statis tanpa `package.json`).

## [1.0.0] - 2026-11-05

### Added

- Game inti: 4 kategori lagu, 5 level kesulitan (Easy 1 dtk → Impossible
  16 dtk), skor, streak, ronde, pencarian lagu via iTunes Search API,
  Skip, Menyerah, dan kartu reveal dengan full preview 30 detik.
