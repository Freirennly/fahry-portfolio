import os
import re

root_dir = "D:/Portofolio/portofolio"
patterns = [
    (re.compile(r"-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----"), "Private Key"),
    (re.compile(r"(?:api[_-]?key|secret[_-]?key|auth[_-]?token)\s*[:=]\s*['\"][^'\"]{10,}", re.IGNORECASE), "API Key/Secret Pattern"),
    (re.compile(r"ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{82}"), "GitHub Token"),
    (re.compile(r"AKIA[0-9A-Z]{16}"), "AWS Access Key"),
    (re.compile(r"AIza[0-9A-Za-z-_]{35}"), "Google API Key")
]

findings = []
for root, dirs, files in os.walk(root_dir):
    if "node_modules" in root or ".next" in root or ".git" in root:
        continue
    for f in files:
        ext = os.path.splitext(f)[1].lower()
        if ext in [".png", ".jpg", ".jpeg", ".webp", ".ico", ".pdf"]:
            continue
        fp = os.path.join(root, f)
        try:
            with open(fp, "r", encoding="utf-8", errors="ignore") as fh:
                content = fh.read()
                for pat, name in patterns:
                    m = pat.search(content)
                    if m:
                        findings.append((fp, name, m.group(0)[:30]))
        except Exception:
            pass

print("=== SECRET SCANNER RESULTS ===")
print(f"Total findings: {len(findings)}")
for fp, name, snippet in findings:
    print(f"  - {fp}: {name} -> {snippet}")

if len(findings) == 0:
    print("-> PASSED: No secrets, private keys, or API tokens detected in trackable files.")
