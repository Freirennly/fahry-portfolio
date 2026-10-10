import os
from playwright.sync_api import sync_playwright

output_dir = "artifacts/visual-audit"
os.makedirs(output_dir, exist_ok=True)

test_routes = [
    "/",
    "/work/kalanata",
    "/work/kinarya",
    "/work/pkkmb-fkip-uns-2025",
]

print("=== STARTING PRE-DEPLOYMENT BROWSER AUDIT ===")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    
    # 1. Desktop & Mobile Route Tests
    for vp_name, vp_size in [("Desktop_1440", {"width": 1440, "height": 900}), ("Mobile_390", {"width": 390, "height": 844})]:
        print(f"\n--- Testing Viewport: {vp_name} ---")
        for route in test_routes:
            page = browser.new_page(viewport=vp_size)
            console_errors = []
            failed_requests = []
            
            page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
            page.on("requestfailed", lambda r: failed_requests.append(r.url))
            
            res = page.goto(f"http://localhost:3000{route}", wait_until="networkidle")
            assert res.status == 200, f"Route {route} failed with status {res.status}"
            
            # Check horizontal overflow
            overflow = page.evaluate("document.documentElement.scrollWidth > window.innerWidth")
            print(f"  Route [{route}] overflow: {overflow}")
            assert not overflow, f"Horizontal overflow detected on {route} ({vp_name})!"
            
            # Check all images complete and loaded
            # Scroll to trigger lazy loading
            page.evaluate("() => window.scrollTo(0, document.body.scrollHeight)")
            page.wait_for_timeout(800)
            page.evaluate("() => window.scrollTo(0, 0)")
            page.wait_for_timeout(400)
            
            images = page.locator("img").all()
            for img in images:
                src = img.get_attribute("src")
                loaded = page.evaluate("(el) => el.complete && el.naturalWidth > 0", img.element_handle())
                assert loaded, f"Image failed to load: {src} on {route}"
                
            # Verify NO EDAS link exists in rendered HTML or DOM
            edas_link = page.locator("a[href*='edas.info']")
            assert edas_link.count() == 0, f"EDAS link found on {route}!"
            page_text = page.content()
            assert "Sumber EDAS" not in page_text, f"'Sumber EDAS' text found on {route}!"
            
            # Assert zero console errors & zero failed network requests
            assert len(console_errors) == 0, f"Console errors on {route}: {console_errors}"
            assert len(failed_requests) == 0, f"Failed requests on {route}: {failed_requests}"
            
            page.close()

    # 2. Archive Filtering Test
    print("\n--- Testing Archive Filter Interactions ---")
    page_arch = browser.new_page(viewport={"width": 1440, "height": 900})
    page_arch.goto("http://localhost:3000/#archive", wait_until="networkidle")
    page_arch.wait_for_timeout(600)
    
    categories = ["ALL", "TECH", "CREATIVE", "MEDIA", "ORGANIZATION", "ACADEMIC", "EXPERIMENTS"]
    for cat in categories:
        btn = page_arch.locator(f"button:has-text('{cat}')").first
        btn.click()
        page_arch.wait_for_timeout(300)
        # Check active state
        assert btn.get_attribute("aria-pressed") == "true", f"Category {cat} button aria-pressed not true"
        # Check no EDAS in filtered view
        assert "Sumber EDAS" not in page_arch.content()
    page_arch.close()

    # 3. Accessibility & Keyboard Navigation
    print("\n--- Testing Keyboard Focus & Mobile Menu ---")
    page_kb = browser.new_page(viewport={"width": 390, "height": 844})
    page_kb.goto("http://localhost:3000", wait_until="networkidle")
    
    # Check skip to content or logo focus
    page_kb.keyboard.press("Tab")
    focused = page_kb.evaluate("document.activeElement.tagName")
    print(f"  First Tab focus element: {focused}")
    
    # Hamburger open and keyboard Escape
    menu_btn = page_kb.locator("button[aria-label='Buka menu']")
    menu_btn.click()
    page_kb.wait_for_timeout(300)
    panel = page_kb.locator("#mobile-nav")
    assert panel.is_visible(), "Mobile nav not visible after click"
    
    page_kb.keyboard.press("Escape")
    page_kb.wait_for_timeout(300)
    assert not panel.is_visible(), "Mobile nav still visible after Escape"
    assert page_kb.evaluate("document.activeElement.getAttribute('aria-label')") == "Buka menu"
    page_kb.close()

    # 4. Prefers Reduced Motion Test
    print("\n--- Testing Prefers Reduced Motion ---")
    page_rm = browser.new_page(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
    page_rm.goto("http://localhost:3000", wait_until="networkidle")
    page_rm.wait_for_timeout(600)
    # Check that motion sections have opacity: 1 immediately
    hero_title = page_rm.locator("#hero h1")
    opacity = hero_title.evaluate("el => window.getComputedStyle(el).opacity")
    print(f"  Hero title opacity under reduced-motion: {opacity}")
    assert opacity == "1", f"Opacity should be 1 under reduced motion, got {opacity}"
    page_rm.close()

    # 5. 404 Page Verification
    print("\n--- Testing 404 Page ---")
    page_404 = browser.new_page()
    res_404 = page_404.goto("http://localhost:3000/this-page-does-not-exist-test-404")
    print(f"  404 route status: {res_404.status}")
    assert res_404.status == 404, f"Expected 404 status, got {res_404.status}"
    content_404 = page_404.content()
    assert "404" in content_404 or "tidak ditemukan" in content_404.lower() or "not found" in content_404.lower()
    page_404.close()

    # 6. Check that internal audit is NOT public
    print("\n--- Testing Internal Artifact URL Isolation ---")
    page_art = browser.new_page()
    res_art = page_art.goto("http://localhost:3000/artifacts/visual-audit/STATUS.md")
    print(f"  Internal artifact URL status: {res_art.status}")
    assert res_art.status == 404, f"Artifacts MUST return 404, got {res_art.status}"
    page_art.close()

    browser.close()

print("\nALL PRE-DEPLOYMENT BROWSER AUDIT TESTS PASSED SUCCESSFULLY!")
