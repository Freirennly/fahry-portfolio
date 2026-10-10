import os
from playwright.sync_api import sync_playwright

output_dir = "artifacts/visual-audit"
os.makedirs(output_dir, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # 1. Desktop 1440
    page_1440 = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
    page_1440.goto("http://localhost:3000", wait_until="networkidle")
    page_1440.wait_for_timeout(1500)
    jb_1440 = page_1440.locator("#journey").bounding_box()
    if jb_1440:
        page_1440.evaluate(f"window.scrollTo(0, {jb_1440['y'] + 100})")
        page_1440.wait_for_timeout(1000)
        page_1440.screenshot(path=os.path.join(output_dir, "after_desktop_1440_journey_top.png"))
        page_1440.evaluate(f"window.scrollTo(0, {jb_1440['y'] + 900})")
        page_1440.wait_for_timeout(1000)
        page_1440.screenshot(path=os.path.join(output_dir, "after_desktop_1440_journey_mid.png"))
        page_1440.evaluate(f"window.scrollTo(0, {jb_1440['y'] + 1800})")
        page_1440.wait_for_timeout(1000)
        page_1440.screenshot(path=os.path.join(output_dir, "after_desktop_1440_journey_bot.png"))

    # 2. Desktop 1024
    page_1024 = browser.new_page(viewport={"width": 1024, "height": 768}, device_scale_factor=1)
    page_1024.goto("http://localhost:3000", wait_until="networkidle")
    page_1024.wait_for_timeout(1500)
    jb_1024 = page_1024.locator("#journey").bounding_box()
    if jb_1024:
        page_1024.evaluate(f"window.scrollTo(0, {jb_1024['y'] + 100})")
        page_1024.wait_for_timeout(1000)
        page_1024.screenshot(path=os.path.join(output_dir, "after_desktop_1024_journey_top.png"))

    # 3. Mobile 390
    page_390 = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2)
    page_390.goto("http://localhost:3000", wait_until="networkidle")
    page_390.wait_for_timeout(1500)
    jb_390 = page_390.locator("#journey").bounding_box()
    if jb_390:
        page_390.evaluate(f"window.scrollTo(0, {jb_390['y'] + 100})")
        page_390.wait_for_timeout(1000)
        page_390.screenshot(path=os.path.join(output_dir, "after_mobile_390_journey_top.png"))
        page_390.evaluate(f"window.scrollTo(0, {jb_390['y'] + 700})")
        page_390.wait_for_timeout(1000)
        page_390.screenshot(path=os.path.join(output_dir, "after_mobile_390_journey_mid.png"))

    browser.close()
    print("Journey verification screenshots captured!")
