import os
from playwright.sync_api import sync_playwright

output_dir = "artifacts/visual-audit"
os.makedirs(output_dir, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    
    # 1. Desktop 1440
    page = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
    page.goto("http://localhost:3000", wait_until="networkidle")
    page.wait_for_timeout(1500)
    
    # Hero desktop
    page.screenshot(path=os.path.join(output_dir, "before_desktop_1440_hero.png"))
    
    # Scroll to journey
    journey_box = page.locator("#journey").bounding_box()
    if journey_box:
        page.evaluate(f"window.scrollTo(0, {journey_box['y']})")
        page.wait_for_timeout(1000)
        page.screenshot(path=os.path.join(output_dir, "before_desktop_1440_journey_top.png"))
        
        # Scroll further down journey
        page.evaluate(f"window.scrollTo(0, {journey_box['y'] + 800})")
        page.wait_for_timeout(1000)
        page.screenshot(path=os.path.join(output_dir, "before_desktop_1440_journey_mid.png"))

    # 2. Desktop 1024
    page_1024 = browser.new_page(viewport={"width": 1024, "height": 768}, device_scale_factor=1)
    page_1024.goto("http://localhost:3000", wait_until="networkidle")
    page_1024.wait_for_timeout(1500)
    jb_1024 = page_1024.locator("#journey").bounding_box()
    if jb_1024:
        page_1024.evaluate(f"window.scrollTo(0, {jb_1024['y']})")
        page_1024.wait_for_timeout(1000)
        page_1024.screenshot(path=os.path.join(output_dir, "before_desktop_1024_journey_top.png"))

    # 3. Mobile 390x844
    page_mobile = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2)
    page_mobile.goto("http://localhost:3000", wait_until="networkidle")
    page_mobile.wait_for_timeout(1500)
    page_mobile.screenshot(path=os.path.join(output_dir, "before_mobile_390_hero.png"))
    
    # Open mobile menu
    btn = page_mobile.locator("button[aria-label='Buka menu']")
    if btn.is_visible():
        btn.click()
        page_mobile.wait_for_timeout(500)
        page_mobile.screenshot(path=os.path.join(output_dir, "before_mobile_390_menu_open.png"))
        btn.click() # close it
        page_mobile.wait_for_timeout(500)

    # Journey mobile
    jb_m = page_mobile.locator("#journey").bounding_box()
    if jb_m:
        page_mobile.evaluate(f"window.scrollTo(0, {jb_m['y']})")
        page_mobile.wait_for_timeout(1000)
        page_mobile.screenshot(path=os.path.join(output_dir, "before_mobile_390_journey_top.png"))
        page_mobile.evaluate(f"window.scrollTo(0, {jb_m['y'] + 600})")
        page_mobile.wait_for_timeout(1000)
        page_mobile.screenshot(path=os.path.join(output_dir, "before_mobile_390_journey_mid.png"))

    browser.close()
    print("Baseline screenshots captured successfully!")
