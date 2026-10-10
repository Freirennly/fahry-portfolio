import os
import glob
from PIL import Image

print("=== 1. AUDIT GAMBAR (PUBLIC/IMAGES) ===")
image_dir = "public/images"
image_files = []
large_images = []
formats_count = {}

for root, dirs, files in os.walk(image_dir):
    for f in files:
        ext = os.path.splitext(f)[1].lower()
        if ext in [".png", ".jpg", ".jpeg", ".webp", ".svg", ".avif"]:
            full_path = os.path.join(root, f)
            size_kb = os.path.getsize(full_path) / 1024
            image_files.append((full_path, size_kb, ext))
            formats_count[ext] = formats_count.get(ext, 0) + 1
            if size_kb > 500:  # Flag images > 500 KB
                large_images.append((full_path, size_kb))

print(f"Total image files found: {len(image_files)}")
print(f"Format breakdown: {formats_count}")
print(f"Large images (>500KB): {len(large_images)}")
for p, s in large_images:
    print(f"  - {p}: {s:.1f} KB")

# Verify PIL readable for raster formats
unreadable = []
for p, s, ext in image_files:
    if ext in [".png", ".jpg", ".jpeg", ".webp"]:
        try:
            with Image.open(p) as img:
                img.verify()
        except Exception as e:
            unreadable.append((p, str(e)))

print(f"Corrupt/Unreadable images: {len(unreadable)}")
if unreadable:
    for p, err in unreadable:
        print(f"  - {p}: {err}")

print("\n=== 2. AUDIT SECRET / SENSITIVE LEAKAGE IN STATIC OUTPUT ===")
# Search .next/static for sensitive patterns like API keys or tokens
secret_keywords = ["SECRET", "PRIVATE_KEY", "AWS_ACCESS", "GITHUB_TOKEN", "BEARER "]
leaks_found = []

if os.path.exists(".next/static"):
    for root, dirs, files in os.walk(".next/static"):
        for f in files:
            if f.endswith(".js"):
                fp = os.path.join(root, f)
                with open(fp, "r", encoding="utf-8", errors="ignore") as js_file:
                    content = js_file.read()
                    for kw in secret_keywords:
                        if kw in content:
                            leaks_found.append((fp, kw))

print(f"Potential secrets found in client JS bundles: {len(leaks_found)}")
if leaks_found:
    for fp, kw in leaks_found:
        print(f"  - {fp}: Keyword '{kw}' detected")
else:
    print("  -> PASSED: No sensitive secret keywords found in client bundles.")

print("\nImage & Security Static Audit Complete.")
