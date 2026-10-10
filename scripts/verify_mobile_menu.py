import os
from playwright.sync_api import sync_playwright

output_dir = "artifacts/visual-audit"
os.makedirs(output_dir, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # 1. Mobile 360
    page_360 = browser.new_page(viewport={"width": 360, "height": 800}, device_scale_factor=2)
    page_360.goto("http://localhost:3000", wait_until="networkidle")
    page_360.wait_for_timeout(1000)
    btn_360 = page_360.locator("button[aria-label='Buka menu']")
    assert btn_360.is_visible(), "Hamburger button must be visible on 360px"
    btn_360.click()
    page_360.wait_for_timeout(400)
    menu_360 = page_360.locator("#mobile-nav")
    assert menu_360.is_visible(), "Mobile nav must be visible on 360px after click"
    page_360.screenshot(path=os.path.join(output_dir, "after_mobile_360_menu_open.png"))
    
    # Test Escape key
    page_360.keyboard.press("Escape")
    page_360.wait_for_timeout(400)
    assert not menu_360.is_visible(), "Mobile nav must close on Escape key"
    # Check focus returned to button
    focused_aria = page_360.evaluate("document.activeElement.getAttribute('aria-label')")
    print(f"360px: Active element after Escape: {focused_aria}")

    # 2. Mobile 390
    page_390 = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2)
    page_390.goto("http://localhost:3000", wait_until="networkidle")
    page_390.wait_for_timeout(1000)
    btn_390 = page_390.locator("button[aria-label='Buka menu']")
    btn_390.click()
    page_390.wait_for_timeout(400)
    page_390.screenshot(path=os.path.join(output_dir, "after_mobile_390_menu_open.png"))
    
    # Check bounding box of menu on 390px
    menu_box = page_390.locator("#mobile-nav").bounding_box()
    print(f"390px menu box: {menu_box}")

    # Test link click closes menu
    page_390.locator("#mobile-nav a[href='#work']").click()
    page_390.wait_for_timeout(400)
    assert not page_390.locator("#mobile-nav").is_visible(), "Menu must close after link click"

    # 3. Tablet 768
    page_768 = browser.new_page(viewport={"width": 768, "height": 1024}, device_scale_factor=1)
    page_768.goto("http://localhost:3000", wait_until="networkidle")
    page_768.wait_for_timeout(1000)
    desktop_nav_768 = page_768.locator("nav[aria-label='Navigasi utama']")
    assert desktop_nav_768.is_visible(), "Desktop nav must be visible on 768px"
    btn_768 = page_768.locator("button[aria-label='Buka menu']")
    assert not btn_768.is_visible(), "Hamburger button must be hidden on 768px"
    page_768.screenshot(path=os.path.join(output_dir, "after_tablet_768_header.png"), clip={"x": 0, "y": 0, "width": 768, "height": 120})

    # 4. Desktop 1024
    page_1024 = browser.new_page(viewport={"width": 1024, "height": 768}, device_scale_factor=1)
    page_1024.goto("http://localhost:3000", wait_until="networkidle")
    page_1024.wait_for_timeout(1000)
    desktop_nav_1024 = page_1024.locator("nav[aria-label='Navigasi utama']")
    assert desktop_nav_1024.is_visible(), "Desktop nav must be visible on 1024px"
    btn_1024 = page_1024.locator("button[aria-label='Buka menu']")
    assert not btn_1024.is_visible(), "Hamburger button must be hidden on 1024px"

    # 5. Desktop 1440
    page_1440 = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
    page_1440.goto("http://localhost:3000", wait_until="networkidle")
    page_1440.wait_for_timeout(1000)
    desktop_nav_1440 = page_1440.locator("nav[aria-label='Navigasi utama']")
    assert desktop_nav_1440.is_visible(), "Desktop nav must be visible on 1440px"
    btn_1440 = page_1440.locator("button[aria-label='Buka menu']")
    assert not btn_1440.is_visible(), "Hamburger button must be hidden on 1440px"

    browser.close()
    print("Mobile menu verification completed successfully!")
