# Laporan Audit Lanjutan: Dependensi, Validasi Backup, dan Kesiapan Git

**Lokasi Proyek**: `D:\Portofolio\portofolio`  
**Waktu Audit**: 2026-10-10  
**Tujuan**: Menilai kerentanan dependensi, validasi cadangan data, dan kesiapan version control lokal tanpa melakukan tindakan destruktif atau deployment.

---

## 1. Audit Kerentanan Dependensi

### Ringkasan Kondisi Keamanan Dependensi
- Total dependensi terpasang: 565 paket (152 produksi, 376 pengembangan, 88 opsional).
- Hasil `npm audit`: 6 advisori tingkat tinggi (*High Severity*).
- **Temuan Kunci**:
  1. `next-mdx-remote` (v5.0.0, direct dependency): Memiliki advisori `GHSA-g4xw-jxrg-5f6m`. **Hasil investigasi membuktikan paket ini sama sekali TIDAK diimpor atau digunakan di mana pun dalam kode sumber (`src/`)**. Seluruh studi kasus dan konten portofolio dirender menggunakan modul data statis TypeScript (`src/lib/data/featuredProjects.ts`).
  2. `braces` (<=3.0.3, transitive dependency via `micromatch` -> `fast-glob` -> `@next/eslint-plugin-next` -> `eslint-config-next`): Memiliki advisori `GHSA-vfj7-8cjw-p6xm` (CWE-674, DoS akibat nested pattern). Paket ini berada di pohon **devDependencies** (`eslint-config-next`), murni sebagai tooling linting lokal, dan **TIDAK PERNAH masuk ke bundle JavaScript klien produksi maupun runtime hosting**.
  3. Saran otomatis `npm audit fix --force` untuk mendowngrade ke `eslint-config-next@14.2.35` adalah **berbahaya dan destruktif** bagi proyek Next.js 16.4.0 & React 19.3.0.

### Tabel Rincian Advisori Keamanan

| ID Advisori | Paket Terdampak | Status Dependensi | Jalur Dependensi | Tingkat Keparahan & CWE | Versi Terdampak | Versi Perbaikan Resmi | Potensi Dampak Aktual | Rekomendasi Tindakan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **GHSA-g4xw-jxrg-5f6m** | `next-mdx-remote` | Direct (`dependencies`) | `root` -> `next-mdx-remote@5.0.0` | High (CVSS 8.8)<br>CWE-94 | `>=4.3.0 <6.0.0` | `6.0.0` (SemVer Major) | **NOL (Tidak Ada Dampak)**: Paket tidak pernah diimpor atau dipanggil dalam `src/`. Portofolio tidak memiliki fitur upload/input MDX dari pengunjung publik. | Usulkan penghapusan paket (*uninstall*) dari `package.json` setelah persetujuan pengguna, atau biarkan sampai siklus refactor berikutnya. |
| **GHSA-vfj7-8cjw-p6xm** | `braces` | Transitive (`devDependencies`) | `root` -> `eslint-config-next@16.4.0` -> `@next/eslint-plugin-next@16.4.0` -> `fast-glob@3.3.1` -> `micromatch@4.0.8` -> `braces@3.0.3` | High (CVSS 7.5)<br>CWE-674 | `<=3.0.3` | Belum ada rilis v3/v4 baru di npm registry | **Hanya Dev Tooling**: Hanya dieksekusi saat `npm run lint`. Tidak pernah dibundel ke output produksi `.next/static`. | **JANGAN jalankan** `npm audit fix --force`. Pertahankan versi saat ini hingga tim Next.js merilis patch dependensi linting internal. |
| **Via braces** | `micromatch` | Transitive (`devDependencies`) | via `braces` | High | `>=0.2.0` | Dipicu oleh `braces` | Hanya Dev Tooling | Selaras dengan `braces`. |
| **Via micromatch** | `fast-glob` | Transitive (`devDependencies`) | via `micromatch` | High | `*` | Dipicu oleh `micromatch` | Hanya Dev Tooling | Selaras dengan `braces`. |
| **Via fast-glob** | `@next/eslint-plugin-next` | Transitive (`devDependencies`) | via `fast-glob` | High | `>=14.3.0-canary.0` | Dipicu oleh `fast-glob` | Hanya Dev Tooling | Selaras dengan `braces`. |
| **Via plugin** | `eslint-config-next` | Direct (`devDependencies`) | `root` -> `eslint-config-next@16.4.0` | High | `>=14.3.0-canary.0` | Dipicu oleh downstream | Hanya Dev Tooling | Selaras dengan `braces`. |

---

## 2. Validasi Backup

**Lokasi Cadangan**: `D:\Portofolio\backup_pre_deploy`  
**Hasil Validasi Read-Only**: **PASS**

1. **Ketersediaan**: Direktori cadangan tersedia penuh dan utuh (173 file).
2. **Kelengkapan Source Code**: Seluruh file inti aplikasi (`src/app/`, `src/components/`, `src/lib/`, `public/images/`, `scripts/`, `next.config.ts`, `package.json`, `package-lock.json`) tercakup lengkap.
3. **Penyaringan Berkas Sensitif / Berat**:
   - `node_modules` **TIDAK ADA** (bersih).
   - `.next` **TIDAK ADA** (bersih).
   - `.git` **TIDAK ADA** (bersih).
   - `.env` / `.env.local` **TIDAK ADA** (bersih). Satu-satunya file yang memuat substring `.env` adalah `.env.example` (template publik).
4. **Perbandingan Delta dengan Workspace Aktif**:
   - `backup_pre_deploy` diambil sebelum instruksi penghapusan tautan EDAS dijalankan.
   - Perbedaan file:
     - Di `backup_pre_deploy`: `Archive.tsx` dan `archive.ts` masih memuat tautan `Sumber EDAS`.
     - Di workspace aktif: Tautan `Sumber EDAS` sudah dihapus, status *Accepted* terjaga.
     - Di workspace aktif terdapat 2 skrip audit tambahan: `scripts/pre_deploy_audit.py` dan `scripts/pre_deploy_browser_audit.py`.
5. **Kemampuan Pemulihan (Disaster Recovery)**: Cadangan sepenuhnya fungsional untuk mengembalikan kondisi codebase ke titik awal pra-audit jika diperlukan.

---

## 3. Kesiapan Git Lokal

**Status Repositori**: Belum diinisialisasi (`.git` tidak ada).  
**Hasil Pindaian Secret (Zero-Leakage)**: **PASS** (0 secret, 0 private key, 0 token API ditemukan).

### Kecukupan `.gitignore`
File `.gitignore` yang ada sudah memadai dan mencakup aturan standar Next.js:
- Dependencies: `/node_modules`, `.pnp.*`, `.yarn/*`
- Build outputs: `/.next/`, `/out/`, `/build`
- Logs & Cache: `*.log`, `npm-debug.log*`, `*.tsbuildinfo`
- Secrets: `.env*`, dengan pengecualian eksplisit untuk `!.env.example`
- Misc: `.DS_Store`, `*.pem`, `.vercel`

### Rekomendasi Struktur Commit Awal (Menunggu Persetujuan)
Setelah disetujui untuk menginisialisasi Git:
```bash
# 1. Inisialisasi
git init

# 2. Periksa status staging
git status

# 3. Commit awal terstruktur
git add .
git commit -m "feat: portfolio pre-deployment baseline with editorial layout and verified QA"
```

---

## 4. Pemeriksaan Konsistensi Konfigurasi

### Penggunaan `NEXT_PUBLIC_SITE_URL`
- Nilai fallback saat ini: `https://fahryali.com` (didefinisikan di `src/lib/data/site.ts`).
- Penggunaan:
  - `src/app/layout.tsx`: `metadataBase: new URL(PROVISIONAL_SITE_URL)` dan `openGraph.url`.
  - `src/app/sitemap.ts`: Pembentukan URL sitemap untuk root dan studi kasus.
  - `src/app/robots.ts`: URL penunjuk sitemap.
  - `src/app/work/[slug]/page.tsx`: Menggunakan canonical relatif `/work/{slug}` yang otomatis diselesaikan oleh Next.js terhadap `metadataBase`.
- **Catatan Resiko**:
  - `site.ts` sudah dilengkapi pembersihan trailing slash (`.replace(/\/+$/, "")`) untuk mencegah double slash (`//`).
  - Pemilik proyek harus memastikan saat memasukkan variabel `NEXT_PUBLIC_SITE_URL` di dashboard hosting menyertakan skema protokol lengkap (misal `https://domainresmi.com`, bukan hanya `domainresmi.com`), agar tidak memicu `TypeError: Invalid URL` pada `new URL()`.

### Arsitektur Optimasi Gambar
- `next.config.ts` saat ini menggunakan konfigurasi default Next.js Image Optimization (`formats: ["image/avif", "image/webp"]`).
- Mode ini kompatibel langsung dengan hosting yang menyediakan runtime Node.js/Edge (Vercel, Cloudflare Pages via OpenNext, VPS Docker).
- Jika di kemudian hari diputuskan menggunakan hosting statis murni tanpa runtime (misal GitHub Pages atau S3 murni), Next.js memerlukan `output: 'export'` dan `images: { unoptimized: true }`.

---

## 5. Hasil Pengujian Regresi

| Pengujian | Perintah | Hasil | Catatan |
| :--- | :--- | :--- | :--- |
| **TypeScript** | `npx tsc --noEmit` | **PASS** | 0 error |
| **ESLint** | `npm run lint` | **PASS** | 0 warning, 0 error |
| **Next.js Production Build** | `npx next build --webpack` | **PASS** | 11/11 halaman statis dihasilkan sempurna (8.0s kompilasi) |
| **Verifikasi Tautan EDAS** | Ripgrep & Browser inspection | **PASS** | Tautan EDAS dan teks "Sumber EDAS" tidak ditemukan di seluruh antarmuka publik |
| **Verifikasi Status Karya Ilmiah** | Data inspection `archive.ts` | **PASS** | Status tetap `Accepted`, seluruh metadata penulis & konferensi utuh |
