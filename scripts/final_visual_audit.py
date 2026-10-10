import os
from playwright.sync_api import sync_playwright

output_dir = "artifacts/visual-audit"
os.makedirs(output_dir, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    
    # Track console errors & failed requests
    console_errors = []
    failed_requests = []

    def on_console(msg):
        if msg.type == "error":
            console_errors.append(msg.text)

    def on_request_failed(req):
        failed_requests.append(req.url)

    # 1. Desktop 1440x900
    p_1440 = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
    p_1440.on("console", on_console)
    p_1440.on("requestfailed", on_request_failed)
    p_1440.goto("http://localhost:3000", wait_until="networkidle")
    p_1440.wait_for_timeout(1000)

    # Hero desktop
    p_1440.screenshot(path=os.path.join(output_dir, "verified_desktop_1440_hero.png"))

    # Selected Work desktop
    p_1440.locator("#work").scroll_into_view_if_needed()
    p_1440.wait_for_timeout(600)
    p_1440.screenshot(path=os.path.join(output_dir, "verified_desktop_1440_work.png"))

    # Archive desktop
    p_1440.locator("#archive").scroll_into_view_if_needed()
    p_1440.wait_for_timeout(600)
    p_1440.screenshot(path=os.path.join(output_dir, "verified_desktop_1440_archive.png"))

    # Contact & Footer desktop
    p_1440.locator("#contact").scroll_into_view_if_needed()
    p_1440.wait_for_timeout(600)
    p_1440.screenshot(path=os.path.join(output_dir, "verified_desktop_1440_contact.png"))

    # Case study page /work/kalanata desktop
    p_1440.goto("http://localhost:3000/work/kalanata", wait_until="networkidle")
    p_1440.wait_for_timeout(1000)
    p_1440.screenshot(path=os.path.join(output_dir, "verified_desktop_1440_case_study.png"))

    # 2. Mobile 390x844
    p_390 = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2)
    p_390.on("console", on_console)
    p_390.on("requestfailed", on_request_failed)
    p_390.goto("http://localhost:3000", wait_until="networkidle")
    p_390.wait_for_timeout(1000)

    # Hero mobile
    p_390.screenshot(path=os.path.join(output_dir, "verified_mobile_390_hero.png"))

    # Check gap between banner bottom and marquee on mobile 390
    banner = p_390.locator("#hero img").first
    bb = banner.bounding_box()
    marquee = p_390.locator("main > div").first  # Marquee container
    mb = marquee.bounding_box()
    if bb and mb:
        banner_bottom = bb["y"] + bb["height"]
        marquee_top = mb["y"]
        gap = marquee_top - banner_bottom
        print(f"Mobile 390px: Banner bottom={banner_bottom:.1f}, Marquee top={marquee_top:.1f}, Gap={gap:.1f}px")

    # Mobile menu
    btn_m = p_390.locator("button[aria-label='Buka menu']")
    btn_m.click()
    p_390.wait_for_timeout(300)
    p_390.screenshot(path=os.path.join(output_dir, "verified_mobile_390_menu.png"))
    btn_m.click()
    p_390.wait_for_timeout(300)

    # Contact & Footer mobile
    p_390.locator("#contact").scroll_into_view_if_needed()
    p_390.wait_for_timeout(600)
    p_390.screenshot(path=os.path.join(output_dir, "verified_mobile_390_contact.png"))

    # Case study page /work/kalanata mobile
    p_390.goto("http://localhost:3000/work/kalanata", wait_until="networkidle")
    p_390.wait_for_timeout(1000)
    p_390.screenshot(path=os.path.join(output_dir, "verified_mobile_390_case_study.png"))

    # Check horizontal overflow on both
    p_1440.goto("http://localhost:3000", wait_until="networkidle")
    overflow_1440 = p_1440.evaluate("document.documentElement.scrollWidth > window.innerWidth")
    overflow_390 = p_390.evaluate("document.documentElement.scrollWidth > window.innerWidth")

    print(f"Overflow 1440: {overflow_1440}")
    print(f"Overflow 390: {overflow_390}")
    print(f"Console errors: {len(console_errors)}")
    if console_errors:
        print("Errors:", console_errors)
    print(f"Failed requests: {len(failed_requests)}")
    if failed_requests:
        print("Failed:", failed_requests)

    browser.close()
    print("Final visual audit verification complete!")
