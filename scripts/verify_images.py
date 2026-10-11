import os
import re
import glob

html_files = glob.glob('out/**/*.html', recursive=True)
print(f"Total HTML files found in out/: {len(html_files)}")

all_passed = True
total_imgs = 0
total_preloads = 0

for hf in sorted(html_files):
    with open(hf, 'r', encoding='utf-8') as f:
        content = f.read()
    imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', content)
    preloads = re.findall(r'<link[^>]+as=["\']image["\'][^>]+href=["\']([^"\']+)["\']', content)
    total_imgs += len(imgs)
    total_preloads += len(preloads)
    print(f"\n--- {hf} ({len(imgs)} imgs, {len(preloads)} image preloads) ---")
    for p in preloads:
        print(f"  [PRELOAD] {p}")
        if not p.startswith('/fahry-portfolio/'):
            print(f"  [ERROR PRELOAD WITHOUT BASEPATH] {p}")
            all_passed = False
    for src in imgs:
        print(f"  [IMG SRC] {src}")
        if not src.startswith('/fahry-portfolio/'):
            print(f"  [ERROR IMG WITHOUT BASEPATH] {src}")
            all_passed = False
        else:
            rel_file = src[len('/fahry-portfolio/'):]
            disk_path = os.path.join('out', rel_file.replace('/', os.sep))
            if not os.path.isfile(disk_path):
                print(f"  [ERROR FILE MISSING ON DISK] {disk_path}")
                all_passed = False

print(f"\nTotal images checked: {total_imgs}")
print(f"Total image preloads checked: {total_preloads}")
print(f"All images valid and exist on disk: {all_passed}")

if not all_passed:
    exit(1)
