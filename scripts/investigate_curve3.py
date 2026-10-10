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

    # Scroll to bring the curved line area into view
    page.evaluate("window.scrollTo(0, 700)")
    page.wait_for_timeout(500)

    # Screenshot
    page.screenshot(
        path=os.path.join(audit_dir, "mobile-curved-line-noscale.png"),
        clip={"x": 0, "y": 700, "width": 390, "height": 150},
    )

    # Check hero section
    hero = page.locator("#hero")
    hb = hero.bounding_box()
    print(f"\n=== Hero box: {hb} ===")

    # Section positions
    sections = page.query_selector_all("section")
    print(f"\n=== Section positions ===")
    for i, s in enumerate(sections[:10]):
        box = s.bounding_box()
        if box:
            cls = s.get_attribute("class") or ""
            print(f"Section {i}: y={box.get('y')}, h={box.get('h')}, class={cls[:60]}...")

    # Element at Y=720
    el_at_720 = page.evaluate(
        "() => { const visible = document.elementFromPoint(200, 720); if (!visible) return null; const s = getComputedStyle(visible); return {tag: visible.tagName, class: visible.className, style: s.cssText, backgroundImage: s.backgroundImage, backgroundColor: s.backgroundColor, position: s.position}; }"
    )
    print(f"\n=== Element at Y=720: {el_at_720} ===")

    # Check what the banner image covers
    print(f"\n=== Banner image in Hero ===")
    # The hero has an OptimizedImage with fill
    imgs = page.query_selector_all("#hero img")
    for img in imgs:
        bbox = img.bounding_box()
        if bbox:
            print(f"Hero img: y={bbox.get('y')}, h={bbox.get('h')}, w={bbox.get('w')}, src={img.get_attribute('src') or ''}")

    # Check all div elements with y in meaningful ranges
    print(f"\n=== Divs with y in [0, 100] ===")
    divs = page.query_selector_all("div")
    for i, d in enumerate(divs[:300]):
        box = d.bounding_box()
        if box and 0 < box.get("y", 0) < 100:
            cls = d.get_attribute("class") or ""
            if box.get("width", 0) > 20 or box.get("height", 0) > 10:
                print(f"Div {i}: y={box.get('y')}, h={box.get('h')}, w={box.get('w')}, class={cls[:60]}...")

    print(f"\n=== Divs with y in [100, 200] ===")
    for i, d in enumerate(divs[:300]):
        box = d.bounding_box()
        if box and 100 < box.get("y", 0) < 200:
            cls = d.get_attribute("class") or ""
            if box.get("width", 0) > 20 or box.get("height", 0) > 10:
                print(f"Div {i}: y={box.get('y')}, h={box.get('h')}, w={box.get('w')}, class={cls[:60]}...")

    print(f"\n=== Divs with y in [600, 700] ===")
    for i, d in enumerate(divs[:300]):
        box = d.bounding_box()
        if box and 600 < box.get("y", 0) < 700:
            cls = d.get_attribute("class") or ""
            if box.get("width", 0) > 20 or box.get("height", 0) > 10:
                print(f"Div {i}: y={box.get('y')}, h={box.get('h')}, w={box.get('w')}, class={cls[:60]}...")

    # Check for any SVG that might be the curve - just print first 20 SVG bounding boxes
    print(f"\n=== First 20 SVG bounding boxes ===")
    svgs = page.locator("svg")
    for i in range(min(20, svgs.count())):
        svg = svgs.nth(i)
        try:
            bbox = svg.bounding_box()
            if bbox:
                print(f"SVG {i}: y={bbox.get('y')}, h={bbox.get('h')}, w={bbox.get('w')}")
        except Exception as e:
            print(f"SVG {i}: error={e}")

    # Check the blend mode div inside hero
    print(f"\n=== Blend div in Hero ===")
    blend = page.locator(".absolute.inset-0.bg-blue-deep.mix-blend-multiply")
    try:
        bbox = blend.bounding_box()
        if bbox:
            print(f"Blend div: y={bbox.get('y')}, h={bbox.get('h')}, w={bbox.get('w')}")
    except:
        print("Could not get blend div bbox")

    # Get all position: absolute/fixed elements
    print(f"\n=== Position:absolute elements near Y=700 ===")
    abs_elems = page.query_selector_all("[style*='position: absolute']")
    for i, e in enumerate(abs_elems[:50]):
        try:
            bbox = e.bounding_box()
            if bbox and 680 < bbox.get("y", 0) < 860:
                sty = e.get_attribute("style") or ""
                print(f"  {i}: {sty[:100]}... y={bbox.get('y')}")
        except:
            pass

    ctx.close()
    browser.close()
print("\nDone.")