import urllib.request
import re
import os

print("=== 1. DIAGNOSIS LIVE GITHUB PAGES ===")
url = "https://freirennly.github.io/fahry-portfolio/"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})

try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode("utf-8")
        img_srcs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html)
        print(f"Total img tags found on live site: {len(img_srcs)}")
        for s in img_srcs[:20]:
            print("  Image src:", s)
            
        # Check HTTP status of first 5 images on live site
        for s in img_srcs[:5]:
            # if relative, resolve
            full_img_url = s if s.startswith("http") else ("https://freirennly.github.io" + (s if s.startswith("/") else "/" + s))
            try:
                img_req = urllib.request.Request(full_img_url, headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(img_req) as img_resp:
                    print(f"  [HTTP {img_resp.status}] {full_img_url}")
            except urllib.error.HTTPError as e:
                print(f"  [HTTP {e.code} FAIL] {full_img_url}")
except Exception as e:
    print("Error fetching live site:", e)

print("\n=== 2. DIAGNOSIS LOCAL OUT/ FOLDER ===")
if os.path.exists("out/index.html"):
    with open("out/index.html", "r", encoding="utf-8") as f:
        local_html = f.read()
    local_img_srcs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', local_html)
    print(f"Total img tags in local out/index.html: {len(local_img_srcs)}")
    for s in local_img_srcs[:20]:
        print("  Local img src:", s)
        # Check if file exists in out/
        # If src starts with /fahry-portfolio/, remove it to find path in out/
        clean_path = s.replace("/fahry-portfolio/", "").lstrip("/")
        exists = os.path.exists(os.path.join("out", clean_path))
        print(f"    File exists in out/{clean_path}: {exists}")
