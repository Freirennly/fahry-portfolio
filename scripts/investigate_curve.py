import os
import sys

# Use forward slashes for cross-compatibility
base = "D:/Portofolio/portofolio"
audit_dir = os.path.join(base, "artifacts", "visual-audit")
os.makedirs(audit_dir, exist_ok=True)

from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2)
    page = ctx.new_page()
    page.goto("http://localhost:3000", wait_until="networkidle")
    page.wait_for_timeout(1200)

    # Scroll to bring the curved line area into view
    page.evaluate("window.scrollTo(0, 700)")
    page.wait_for_timeout(500)

    # Screenshot the area around Y=700-850
    page.screenshot(
        path=os.path.join(audit_dir, "mobile-curved-line.png"),
        clip={"x": 0, "y": 700, "width": 390, "height": 150},
    )

    # Check all elements with bounding boxes near Y=700-850 using query_selector_all
    elements = page.query_selector_all("*")
    print("\n=== Elements with y in [680, 860] (first 300) ===")
    for i, el in enumerate(elements[:300]):
        box = el.bounding_box()
        if box and box["y"] > 680 and box["y"] < 860:
            tag = el.evaluate_handle("e => e.tagName").json_value()["text"]
            className = el.get_attribute("class") or ""
            style = el.get_attribute("style") or ""
            idAttr = el.get_attribute("id") or ""
            print(
                f"{i}: <{tag}> id={idAttr} class={className} style={style} box={box}"
            )

    # Check for any SVG in the page
    svgs = page.locator("svg")
    svg_count = svgs.count()
    print(f"\n=== SVG count on page: {svg_count} ===")
    for i in range(svg_count):
        svg = svgs.nth(i)
        bbox = svg.bounding_box()
        if bbox and bbox["y"] > 680 and bbox["y"] < 860:
            print(f"SVG {i} at Y={bbox['y']}: {bbox}")

    # Check hero section bottom
    hero = page.locator("#hero")
    hb = hero.bounding_box()
    print(f"\n=== Hero box: {hb} ===")

    # Get all div elements with their positions
    divs = page.query_selector_all("div")
    print(f"\n=== Divs with y in [680, 860] ===")
    for i, d in enumerate(divs[:500]):
        box = d.bounding_box()
        if box and box["y"] > 680 and box["y"] < 860:
            cls = d.get_attribute("class") or ""
            # Skip known elements
            skip_terms = ["banner", "marquee", "nav", "header", "footer", "type-", "animate-"]
            if any(x in cls.lower() for x in skip_terms):
                continue
            if box["width"] > 100 or box["height"] > 20:
                print(f"Div {i}: class={cls[:80]}... box={box}")

    # Check position of Hero image
    print("\n=== Hero banner image ===")
    # Look for the banner inside hero
    imgs = page.query_selector_all("#hero img")
    for img in imgs:
        bbox = img.bounding_box()
        if bbox:
            print(f"Hero img box: {bbox}, class={img.get_attribute('class') or ''}")

    # Check page sections order
    print("\n=== Section positions ===")
    sections = page.query_selector_all("section")
    for i, s in enumerate(sections[:20]):
        box = s.bounding_box()
        if box:
            cls = s.get_attribute("class") or ""
            print(f"Section {i}: class={cls[:50]}... box={box}")

    # Check computed styles at Y=720
    print("\n=== Computed style at Y=720 ===")
    style_at_720 = page.evaluate(
        "() => { const visible = document.elementFromPoint(200, 720); if (!visible) return null; const s = getComputedStyle(visible); return {tag: visible.tagName, class: visible.className, backgroundImage: s.backgroundImage, backgroundColor: s.backgroundColor, position: s.position, left: s.left, top: s.top, width: s.width, height: s.height}; }"
    )
    print(f"Element at Y=720: {style_at_720}")

    # Check what the banner background is
    print("\n=== Hero background-related elements ===")
    # The absolute inset-0 bg-blue-deep/15 mix-blend-multiply div
    blend = page.locator(".absolute.inset-0.bg-blue-deep.mix-blend-multiply")
    print(f"Blend div count: {blend.count()}")
    for i in range(blend.count()):
        b = blend.nth(i)
        bbox = b.bounding_box()
        if bbox:
            print(f"Blend div {i} box: {bbox}")

    # Try to find any element with background-image or gradient that could produce a curve
    print("\n=== Elements with background-gradient ===")
    elems_with_bg = page.query_selector_all("[style*='background-gradient'], [style*='gradient']")
    print(f"Count: {elems_with_bg.count()}")
    for i in range(elems_with_bg.count()):
        e = elems_with_bg.nth(i)
        sty = e.get_attribute("style") or ""
        bbox = e.bounding_box()
        if bbox and bbox["y"] > 680 and bbox["y"] < 860:
            print(f"  {i}: style={sty[:100]}... box={bbox}")

    ctx.close()
    browser.close()
print("\nDone.")