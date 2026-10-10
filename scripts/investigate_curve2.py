import os
import sys

base = "D:/Portofolio/portofolio"
audit_dir = os.path.join(base, "artifacts", "visual-audit")
os.makedirs(audit_dir, exist_ok=True)

from playwright.sync_api import sync_playwright

# Launch WITHOUT device_scale_factor (default 1 = CSS pixels)
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    # No device_scale_factor → viewport is raw CSS pixels
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

    # Check all elements with bounding boxes near Y=700-850
    elements = page.query_selector_all("*")
    print(f"\n=== Elements with y in [680, 860] (first 300) ===")
    candidates = []
    for i, el in enumerate(elements[:300]):
        box = el.bounding_box()
        if box and box["y"] > 680 and box["y"] < 860:
            tag = el.evaluate_handle("e => e.tagName").json_value()["text"]
            className = el.get_attribute("class") or ""
            style = el.get_attribute("style") or ""
            idAttr = el.get_attribute("id") or ""
            print(f"{i}: <{tag}> id={idAttr} class={className} style={style} box={box}")
            candidates.append((i, el, box))

    # Check SVG positions
    svgs = page.locator("svg")
    svg_count = svgs.count()
    print(f"\n=== SVG count on page (no scale): {svg_count} ===")
    for i in range(svg_count):
        svg = svgs.nth(i)
        bbox = svg.bounding_box()
        if bbox and 600 < bbox.get("y", 0) < 900:
            print(f"SVG {i}: y={bbox.get('y')}, h={bbox.get('h')}, w={bbox.get('w')}, class={svg.nth(i).get_attribute('class') or ''}")

    # Hero section
    hero = page.locator("#hero")
    hb = hero.bounding_box()
    print(f"\n=== Hero box (no scale): {hb} ===")

    # Section positions
    sections = page.query_selector_all("section")
    print(f"\n=== Section positions (no scale) ===")
    for i, s in enumerate(sections[:10]):
        box = s.bounding_box()
        if box:
            cls = s.get_attribute("class") or ""
            print(f"Section {i}: y={box.get('y')}, h={box.get('h')}, class={cls[:60]}...")

    # Check what's at Y=720 specifically
    print(f"\n=== Element at Y=720 (no scale) ===")
    el_at_720 = page.evaluate(
        "() => { const visible = document.elementFromPoint(200, 720); if (!visible) return null; const s = getComputedStyle(visible); return {tag: visible.tagName, class: visible.className, style: s.cssText, backgroundImage: s.backgroundImage, backgroundColor: s.backgroundColor, position: s.position}; }"
    )
    print(f"Element at Y=720: {el_at_720}")

    # Check computed styles for elements with position absolute/fixed near Y=700-800
    print(f"\n=== Absolute/Fixed elements near Y=700-800 ===")
    abs_elems = page.query_selector_all("[style*='position: absolute'], [style*='position: fixed']")
    for i, e in enumerate(abs_elems[:20]):
        bbox = e.bounding_box()
        if bbox and 680 < bbox.get("y", 0) < 860:
            sty = e.get_attribute("style") or ""
            print(f"  {i}: {sty[:120]}... box={bbox}")

    # Check marquee position
    print(f"\n=== Marquee positions ===")
    marquees = page.query_selector_all(".marquee")
    for i, m in enumerate(marquees[:5]):
        bbox = m.bounding_box()
        if bbox:
            print(f"Marquee {i}: y={bbox.get('y')}, h={bbox.get('h')}")

    # Check for any section or div between Hero (ends) and Intro (starts)
    print(f"\n=== All div elements with y in [100, 300] ===")
    divs = page.query_selector_all("div")
    for i, d in enumerate(divs[:500]):
        box = d.bounding_box()
        if box and 100 < box.get("y", 0) < 300:
            cls = d.get_attribute("class") or ""
            # Only print if it's a meaningful div (not tiny spacing)
            if box.get("width", 0) > 20 or box.get("height", 0) > 10:
                print(f"Div {i}: y={box.get('y')}, h={box.get('h')}, w={box.get('w')}, class={cls[:60]}...")

    ctx.close()
    browser.close()
print("\nDone (no scale).")