# Visual Audit Resume - Pre-Deployment Operational Instructions

## Status Terkini
Audit pra-deployment telah selesai dengan status siap terbit (**Ready for Deployment**). Tidak ada deployment atau perubahan produksi yang dijalankan.

---

### Perubahan Kode Terakhir (Pelepasan Tautan EDAS)
1. `src/components/sections/Archive.tsx`:
   - Menghapus rendering tombol/link `Sumber EDAS ↗` dari callout publikasi.
   - Menghapus rendering tautan `Sumber EDAS ↗` dari kartu katalog katalog arsip.
   - Status tetap "Accepted" dan "Belum terbit sebagai prosiding".
2. `src/lib/data/archive.ts`:
   - Menghapus properti `sourceUrl: "https://edas.info/showPaper.php?m=1571304167"` pada entri `icvee-2026-paper`.
   - Seluruh metadata karya ilmiah (penulis, konferensi, track, tahun, abstrak deskripsi) dipertahankan 100%.

---

### Rencana Deployment (Tanpa Eksekusi)

#### 1. Target Hosting & Runtime
- **Arsitektur**: Next.js App Router (16.4.0) dengan React 19.
- **Hasil Build**: 11 halaman static/SSG (`○ Static` & `● SSG`).
- **Pilihan Hosting**:
  - **Vercel** (Rekomendasi Native): Mendukung penuh image optimization bawaan Next.js dan SSR tanpa konfigurasi tambahan.
  - **Cloudflare Pages**: Memerlukan runtime Node/Workers melalui `@opennextjs/cloudflare`, atau jika diekspor statis (`output: 'export'`), memerlukan `images: { unoptimized: true }`.
  - **Node.js Server / VPS / Docker**: Mendukung native `npm run build && npm run start`.

#### 2. Prasyarat Deployment
1. Konfirmasi nama domain produksi definitif (jangan berasumsi `fahryali.com` kecuali telah dipastikan).
2. Konfirmasi platform hosting yang dipilih.
3. Inisialisasi Git repository lokal dan hubungkan ke remote repository privat:
   ```bash
   git init
   git add .
   git commit -m "feat: portfolio ready for deployment"
   git remote add origin <REMOTE_URL>
   git push -u origin main
   ```
4. Set environment variable di dashboard hosting (lihat di bawah).

#### 3. Environment Variables yang Dibutuhkan
- `NEXT_PUBLIC_SITE_URL`: URL origin kanonikal resmi tanpa trailing slash (contoh saat domain terkonfirmasi: `https://namadomain.com`).

#### 4. Risiko yang Belum Terselesaikan
1. **Upstream Vulnerabilities**: Peringatan `npm audit` pada dependensi sekunder `braces` (lewat `eslint-config-next`) dan `next-mdx-remote` v5 (GHSA-g4xw-jxrg-5f6m). Karena proyek ini adalah portofolio statis tanpa input MDX dari pengunjung, resikonya rendah, namun disarankan update versi saat rilis berikutnya stabil.
2. **Domain Belum Terkonfirmasi**: Jika domain produksi bukan `https://fahryali.com`, metadata Open Graph dan canonical fallback perlu diselaraskan via `NEXT_PUBLIC_SITE_URL`.
3. **Hero Banner PNG Ukuran Besar**: `public/images/brand/hero-banner.png` berukuran 3.7 MB. Next.js Image component berhasil mengonversinya menjadi WebP/AVIF secara dinamis di server; jika kelak menggunakan hosting static export murni tanpa image optimizer, file sumber ini perlu dikompresi secara statis terlebih dahulu.

#### 5. Checklist Smoke Test Pasca-Deployment (Untuk Dijalankan Nanti)
Setelah website dideploy oleh pemilik proyek:
- [ ] Buka URL root di browser, periksa status HTTP 200 dan sertifikat SSL HTTPS valid.
- [ ] Buka DevTools Console, pastikan 0 error JavaScript.
- [ ] Buka Network tab, pastikan seluruh gambar termuat sukses tanpa 404.
- [ ] Buka `/work/kalanata`, `/work/kinarya`, `/work/pkkmb-fkip-uns-2025`.
- [ ] Buka `/sitemap.xml` dan `/robots.txt`.
- [ ] Uji navigasi mobile pada smartphone atau device mode DevTools.
- [ ] Buka URL acak (contoh `/halaman-tidak-ada`) dan pastikan halaman 404 muncul dengan benar.
- [ ] Uji sharing link di Telegram/WhatsApp/LinkedIn untuk memverifikasi Open Graph preview.