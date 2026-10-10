import os
from playwright.sync_api import sync_playwright

output_dir = "artifacts/visual-audit"
os.makedirs(output_dir, exist_ok=True)

viewports = [
    ("360x800", {"width": 360, "height": 800}),
    ("390x844", {"width": 390, "height": 844}),
    ("390x600", {"width": 390, "height": 600}),  # Short viewport
    ("768x1024", {"width": 768, "height": 1024}),
    ("1024x768", {"width": 1024, "height": 768}),
    ("1440x900", {"width": 1440, "height": 900}),
]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    for name, vp in viewports:
        is_mobile = vp["width"] < 768
        page = browser.new_page(viewport=vp, device_scale_factor=1)
        page.goto("http://localhost:3000", wait_until="networkidle")
        page.wait_for_timeout(1000)

        desktop_nav = page.locator("nav[aria-label='Navigasi utama']")
        btn = page.locator("button[aria-label='Buka menu']")

        if is_mobile:
            print(f"\n--- Testing Mobile Viewport: {name} ---")
            btn.wait_for(state="visible", timeout=8000)
            assert btn.is_visible(), f"Hamburger must be visible on {name}"
            assert not desktop_nav.is_visible(), f"Desktop nav must be hidden on {name}"

            # Open menu
            btn.click()
            page.wait_for_timeout(400)
            panel = page.locator("#mobile-nav")
            assert panel.is_visible(), f"Panel must be visible on {name}"

            # Check bounding boxes
            panel_box = panel.bounding_box()
            logo = page.locator("header a[aria-label*='Muhammad Fahry Ali']").first
            logo_box = logo.bounding_box()

            print(f"  Panel box on {name}: {panel_box}")
            print(f"  Logo box on {name}: {logo_box}")

            # Verify panel is inside viewport bounds:
            assert panel_box["x"] >= 0, "Panel must not overflow left"
            assert panel_box["x"] + panel_box["width"] <= vp["width"] + 1, f"Panel must not overflow right on {name}"
            assert panel_box["y"] >= 0, "Panel must be below top edge"
            assert panel_box["y"] + panel_box["height"] <= vp["height"], f"Panel must fit inside viewport height on {name}"

            # Verify panel does not overlap logo:
            overlap = not (panel_box["x"] >= logo_box["x"] + logo_box["width"] or 
                           logo_box["x"] >= panel_box["x"] + panel_box["width"] or
                           panel_box["y"] >= logo_box["y"] + logo_box["height"] or
                           logo_box["y"] >= panel_box["y"] + panel_box["height"])
            print(f"  Panel overlaps logo: {overlap}")
            assert not overlap, f"Panel must NOT overlap logo on {name}!"

            # Test scroll while open:
            page.evaluate("window.scrollTo(0, 300)")
            page.wait_for_timeout(300)
            panel_box_scrolled = panel.bounding_box()
            assert panel_box_scrolled["y"] == panel_box["y"], "Panel must stay fixed during page scroll"

            # Check that page scroll is NOT locked
            body_overflow = page.evaluate("document.body.style.overflow")
            print(f"  Body overflow style: '{body_overflow}' (scroll lock not present)")
            assert body_overflow != "hidden", "Page scroll must not be locked!"

            # Take screenshot
            page.screenshot(path=os.path.join(output_dir, f"qa_header_{name}_open.png"))

            # Test Escape closes panel and returns focus
            page.keyboard.press("Escape")
            panel.wait_for(state="hidden", timeout=4000)
            assert not panel.is_visible(), "Escape must close menu"
            active_label = page.evaluate("document.activeElement.getAttribute('aria-label')")
            print(f"  Active element after Escape: {active_label}")
            assert active_label == "Buka menu", "Focus must return to hamburger button"

            # Test click outside closes panel
            btn.click()
            panel.wait_for(state="visible", timeout=4000)
            assert panel.is_visible()
            page.mouse.click(50, 400) # Click outside
            panel.wait_for(state="hidden", timeout=4000)
            assert not panel.is_visible(), "Click outside must close menu"

            # Test link click closes panel
            btn.click()
            panel.wait_for(state="visible", timeout=4000)
            assert panel.is_visible()
            page.locator("#mobile-nav a[href='#about']").click()
            panel.wait_for(state="hidden", timeout=4000)
            assert not panel.is_visible(), "Link click must close menu"

        else:
            print(f"\n--- Testing Desktop/Tablet Viewport: {name} ---")
            assert not btn.is_visible(), f"Hamburger button must be hidden on {name}"
            assert desktop_nav.is_visible(), f"Desktop nav must be visible on {name}"
            panel = page.locator("#mobile-nav")
            assert panel.count() == 0 or not panel.is_visible(), f"Mobile panel must not be present on {name}"

        page.close()

    browser.close()
    print("\nHeader & mobile hamburger glassmorphism re-validation PASSED across all 6 viewports!")
