import os
from playwright.sync_api import sync_playwright

output_dir = "artifacts/visual-audit"
os.makedirs(output_dir, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    viewports = [
        ("mobile-360", {"width": 360, "height": 800}),
        ("mobile-390", {"width": 390, "height": 844}),
        ("tablet-768", {"width": 768, "height": 1024}),
        ("desktop-1024", {"width": 1024, "height": 768}),
        ("desktop-1440", {"width": 1440, "height": 900}),
    ]

    for name, vp in viewports:
        page = browser.new_page(viewport=vp, device_scale_factor=1)
        page.goto("http://localhost:3000", wait_until="networkidle")
        page.wait_for_timeout(1000)

        # Full page height
        total_h = page.evaluate("document.body.scrollHeight")
        print(f"Viewport {name}: total scroll height = {total_h}")

        # Check for horizontal overflow
        has_h_overflow = page.evaluate("document.documentElement.scrollWidth > window.innerWidth")
        print(f"Viewport {name}: horizontal overflow = {has_h_overflow}")

        # Check sections
        for sec in ["#hero", "#about", "#journey", "#work", "#skills", "#archive", "#currently", "#contact"]:
            loc = page.locator(sec)
            if loc.count() > 0:
                box = loc.bounding_box()
                if box:
                    print(f"  {name} {sec}: y={box['y']}, h={box['height']}, w={box['width']}")

        page.close()

    browser.close()
    print("Multi-viewport audit complete.")
