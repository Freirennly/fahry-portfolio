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
    # NO scrolling - keep at Y=0

    # Check divs between Y=844 and Y=950 (between hero end and intro start)
    print(f"\n=== All divs with y in [844, 950] ===")
    divs = page.query_selector_all("div")
    for i, d in enumerate(divs[:500]):
        box = d.bounding_box()
        if box and 844 < box.get('y', 0) < 950:
            cls = d.get_attribute("class") or ""
            h = box.get('h', 0)
            w = box.get('w', 0)
            print(f"Div {i}: y={box['y']}, h={h}, w={w}, class={cls[:100]}")

    # Check section 1 (Intro) details
    print(f"\n=== Section 1 (Intro) details ===")
    s1 = page.locator("section").nth(1)
    bbox1 = s1.bounding_box()
    print(f"Section 1 bbox: {bbox1}")
    s1_class = s1.get_attribute("class") or ""
    print(f"Section 1 class: {s1_class[:100]}")

    # Check what's inside section 1
    print(f"\n=== Section 1 inner content ===")
    # Get all child elements of section 1
    children = s1.query_selector_all("*")
    for i, c in enumerate(children[:20]):
        cbox = c.bounding_box()
        if cbox:
            ccls = c.get_attribute("class") or ""
            print(f"Child {i}: tag={c.evaluate_handle('e => e.tagName').json_value()['text']}, y={cbox.get('y')}, h={cbox.get('h')}, class={ccls[:60]}")

    # Check for ArcLines in section 1
    print(f"\n=== ArcLines in Section 1 ===")
    arc_in_s1 = page.locator(".arc-lines, [class*='ArcLines'], [class*='arc']", has=s1)
    print(f"ArcLines count in section 1: {arc_in_s1.count()}")
    for i in range(arc_in_s1.count()):
        arc = arc_in_s1.nth(i)
        abbox = arc.bounding_box()
        if abbox:
            print(f"Arc {i}: y={abbox.get('y')}, h={abbox.get('h')}, w={abbox.get('w')}, class={arc.get_attribute('class') or ''}")

    # Check marquee elements
    print(f"\n=== Marquee elements ===")
    marquees = page.locator(".marquee")
    print(f"Marquee count: {marquees.count()}")
    for i in range(marquees.count()):
        m = marquees.nth(i)
        mbbox = m.bounding_box()
        if mbbox:
            print(f"Marquee {i}: y={mbbox.get('y')}, h={mbbox.get('h')}, w={mbbox.get('w')}, class={m.get_attribute('class') or ''}")

    # Get the actual page HTML at Y=869
    print(f"\n=== HTML at Y=869 ===")
    html_at_869 = page.evaluate(
        "() => { const visible = document.elementFromPoint(200, 869); if (!visible) return 'no element at 869'; const r = visible.getBoundingClientRect(); return {tag: visible.tagName, class: visible.className, style: visible.style.cssText, x: r.left, y: r.top, w: r.w, h: r.h}; }"
    )
    print(f"Element at Y=869: {html_at_869}")

    # Check all elements' bounding boxes in range Y=840-930
    print(f"\n=== ALL elements with y in [840, 930] ===")
    all_els = page.query_selector_all("*")
    for i, el in enumerate(all_els[:500]):
        box = el.bounding_box()
        if box and 840 < box.get('y', 999) < 930:
            tag = el.evaluate_handle('e => e.tagName').json_value()['text']
            cls = el.get_attribute('class') or ''
            print(f"{i}: <{tag}> class={cls[:60]}... y={box.get('y')}, h={box.get('h')}, w={box.get('w')}")

    ctx.close()
    browser.close()
print("\nDone.")