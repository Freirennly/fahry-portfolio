import os
import re

out_dir = "out"
print("=== VERIFIKASI FOLDER OUT (STATIC EXPORT) ===")

assert os.path.isdir(out_dir), "Folder out/ tidak ditemukan!"

# 1. Periksa berkas penting
required_files = [
    "index.html",
    "404.html",
    "robots.txt",
    "sitemap.xml",
    "work/kalanata/index.html",
    "work/kinarya/index.html",
    "work/pkkmb-fkip-uns-2025/index.html"
]

for rf in required_files:
    fp = os.path.join(out_dir, rf)
    exists = os.path.isfile(fp)
    print(f"  [{'OK' if exists else 'FAIL'}] {rf}")
    assert exists, f"Berkas wajib {rf} tidak ada di out/!"

# 2. Periksa index.html untuk subpath /fahry-portfolio
with open(os.path.join(out_dir, "index.html"), "r", encoding="utf-8") as f:
    html = f.read()

# Check script/css chunks
has_basepath_scripts = "/fahry-portfolio/_next/static/" in html
print(f"  Subpath /fahry-portfolio/_next/static/ terdeteksi di index.html: {has_basepath_scripts}")
assert has_basepath_scripts, "Skrip Next.js tidak menggunakan basePath /fahry-portfolio!"

# Check EDAS links
has_edas = "edas.info" in html or "Sumber EDAS" in html
print(f"  Tautan EDAS muncul di index.html: {has_edas}")
assert not has_edas, "Tautan EDAS ditemukan di index.html!"

# 3. Periksa sitemap.xml
with open(os.path.join(out_dir, "sitemap.xml"), "r", encoding="utf-8") as f:
    sitemap = f.read()

print("  Contoh URL di sitemap.xml:")
urls = re.findall(r"<loc>(.*?)</loc>", sitemap)
for u in urls:
    print(f"    - {u}")
assert all("https://freirennly.github.io/fahry-portfolio" in u for u in urls), "URL sitemap salah!"

# 4. Periksa robots.txt
with open(os.path.join(out_dir, "robots.txt"), "r", encoding="utf-8") as f:
    robots = f.read()
print(f"  Isi robots.txt:\n    {robots.strip().replace(chr(10), chr(10) + '    ')}")
assert "https://freirennly.github.io/fahry-portfolio/sitemap.xml" in robots, "Robots.txt sitemap URL salah!"

# 5. Periksa detail studi kasus
for slug in ["kalanata", "kinarya", "pkkmb-fkip-uns-2025"]:
    with open(os.path.join(out_dir, "work", slug, "index.html"), "r", encoding="utf-8") as f:
        case_html = f.read()
        assert "edas.info" not in case_html, f"EDAS ditemukan di {slug}!"
        assert "/fahry-portfolio/_next/static/" in case_html, f"basePath hilang di {slug}!"
        print(f"  Studi kasus {slug}: terverifikasi aman dan memiliki basePath.")

print("\nSELURUH PEMERIKSAAN STATIC EXPORT LULUS SEMPURNA!")
