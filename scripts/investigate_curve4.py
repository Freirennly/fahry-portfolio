import os
import sys

base = "D:/Portofolio/portofolio"
audit_dir = os.path.join(base, "artifacts", "visual-audit")
os.makedirs(audit_dir, exist_ok=True)

from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={"width": 390, "height": 844})
    page = ctx.new_page()
    page.goto("http://localhost:3000", wait_until="networkidle")
    page.wait_for_timeout(1200)
    # NO scrolling - keep at Y=0 (default page load position)

    # Check hero section
    hero = page.locator("#hero")
    hb = hero.bounding_box()
    print(f"\n=== Hero box (no scroll, Y=0 start): {hb} ===")

    # Section positions
    sections = page.query_selector_all("section")
    print(f"\n=== Section positions (no scroll) ===")
    for i, s in enumerate(sections[:10]):
        box = s.bounding_box()
        if box:
            cls = s.get_attribute("class") or ""
            print(f"Section {i}: y={box.get('y')}, h_approx={box.get('h')}, class={cls[:50]}...")

    # Element at various Y positions (no scroll)
    for test_y in [340, 500, 559, 700, 710, 750, 800, 850, 869]:
        el = page.evaluate(
            f"() => {{ const visible = document.elementFromPoint(200, {test_y}); if (!visible) return 'no element'; const s = getComputedStyle(visible); return {{tag: visible.tagName, class: visible.className, style: s.cssText, backgroundImage: s.backgroundImage, backgroundColor: s.backgroundColor}}; }}"
        )
        print(f"\n=== Element at Y={test_y}: {el} ===")

    # Banner image details
    print(f"\n=== Banner image in Hero ===")
    imgs = page.query_selector_all("#hero img")
    for img in imgs:
        bbox = img.bounding_box()
        if bbox:
            print(f"Hero img: y={bbox.get('y')}, h={bbox.get('h')}, w={bbox.get('w')}, src={img.get_attribute('src') or ''}")
            # Also check the parent span
            parent = img.locator("..")
            pbox = parent.bounding_box() if parent else None
            print(f"  Parent span box: {pbox}")

    # Marquee position
    print(f"\n=== Marquee position ===")
    marquee = page.locator(".marquee-row")
    if marquee.count() > 0:
        bbox = marquee.bounding_box()
        print(f"Marquee-row: y={bbox.get('y')}, h={bbox.get('h')}, w={bbox.get('w')}")

    # Check for any SVG at Y=710
    print(f"\n=== Checking for curved line source ===")
    # The blend div
    blend = page.locator(".absolute.inset-0.bg-blue-deep.mix-blend-multiply")
    try:
        bbox = blend.bounding_box()
        if bbox:
            print(f"Blend div: y={bbox.get('y')}, h={bbox.get('h')}, w={bbox.get('w')}")
    except Exception as e:
        print(f"Blend div error: {e}")

    # The curved line user sees - let me check what the background looks like
    # at Y=710 by getting the background-image of elements there
    for test_y in [559, 710]:
        # Get all elements at this Y, check their background
        el_at_y = page.evaluate(
            f"() => {{ const visible = document.elementFromPoint(200, {test_y}); if (!visible) return 'no element'; const s = getComputedStyle(visible); }}",
        )
        # Check a few known selectors
        for sel in [".absolute.inset-0", ".bg-blue-deep/15", ".mix-blend-multiply", "svg"]:
            try:
                found = page.locator(sel).first
                if found:
                    bbox = found.bounding_box()
                    if bbox and (bbox.get('y', 999) - 50 < test_y < bbox.get('y', -999) + 50):
                        print(f"  Selector {sel}: y={bbox.get('y')}, h={bbox.get('h')}, overlaps Y={test_y}")
            except:
                pass

    # Print all div classes near Y=500-900
    print(f"\n=== All divs with y in [500, 900] ===")
    divs = page.query_selector_all("div")
    seen_classes = set()
    for i, d in enumerate(divs[:500]):
        box = d.bounding_box()
        if box and 500 < box.get('y', 0) < 900:
            cls = d.get_attribute("class") or ""
            h = box.get('h', 0)
            w = box.get('w', 0)
            # Only print if this is a notable div
            if h > 5 or w > 20 or 'marquee' in cls.lower() or 'bg-' in cls.lower() or 'arc' in cls.lower() or 'hero' in cls.lower() or 'transition' in cls.lower():
                if cls not in seen_classes:
                    seen_classes.add(cls)
                    print(f"Div {i}: y={box['y']}, h={h}, w={w}, class={cls[:80]}")

    ctx.close()
    browser.close()
print("\nDone (no scroll, matching baseline).")