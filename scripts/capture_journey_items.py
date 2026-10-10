import os
from playwright.sync_api import sync_playwright

output_dir = "artifacts/visual-audit"
os.makedirs(output_dir, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # 1. Mobile 390
    page_m = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2)
    page_m.goto("http://localhost:3000", wait_until="networkidle")
    page_m.wait_for_timeout(1000)

    items = page_m.locator("#journey ol > li")
    count = items.count()
    print(f"Journey items on mobile: {count}")
    for i in range(count):
        item = items.nth(i)
        item.scroll_into_view_if_needed()
        page_m.wait_for_timeout(400)
        item.screenshot(path=os.path.join(output_dir, f"journey_mobile_item_{i+1}.png"))

    # 2. Desktop 1440
    page_d = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
    page_d.goto("http://localhost:3000", wait_until="networkidle")
    page_d.wait_for_timeout(1000)
    items_d = page_d.locator("#journey ol > li")
    count_d = items_d.count()
    print(f"Journey items on desktop: {count_d}")
    for i in range(count_d):
        item = items_d.nth(i)
        item.scroll_into_view_if_needed()
        page_d.wait_for_timeout(400)
        item.screenshot(path=os.path.join(output_dir, f"journey_desktop_item_{i+1}.png"))

    browser.close()
    print("Individual milestone screenshots captured!")
