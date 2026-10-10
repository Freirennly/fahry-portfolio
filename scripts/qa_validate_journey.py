import os
import json
from playwright.sync_api import sync_playwright

output_dir = "artifacts/visual-audit"
os.makedirs(output_dir, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # 1. Desktop 1440x900
    p_desktop = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
    p_desktop.goto("http://localhost:3000", wait_until="networkidle")
    p_desktop.wait_for_timeout(1000)

    items_d = p_desktop.locator("#journey ol > li")
    total_d = items_d.count()
    print(f"Total Journey items (Desktop): {total_d}")
    assert total_d == 6, f"Expected 6 journey items, got {total_d}"

    desktop_data = []
    for i in range(total_d):
        item = items_d.nth(i)
        item.scroll_into_view_if_needed()
        p_desktop.wait_for_timeout(300)
        
        # Save screenshot
        item.screenshot(path=os.path.join(output_dir, f"qa_journey_desktop_{i+1}.png"))
        
        # Extract text & elements
        year_el = item.locator(".type-display").first
        year_text = year_el.inner_text().strip()
        year_box = year_el.bounding_box()

        # Desktop category badge
        badge_el = item.locator(".hidden.lg\\:flex span").first
        badge_text = badge_el.inner_text().strip() if badge_el.count() > 0 else "NO_BADGE"
        badge_box = badge_el.bounding_box() if badge_el.count() > 0 else None

        title_el = item.locator("h3").first
        title_text = title_el.inner_text().strip()
        title_box = title_el.bounding_box()

        role_el = item.locator("p.text-blue-primary").first
        role_text = role_el.inner_text().strip()
        role_box = role_el.bounding_box()

        desc_el = item.locator("p.text-muted").first
        desc_text = desc_el.inner_text().strip()

        highlights = [h.inner_text().strip() for h in item.locator("ul li").all()]

        has_image = item.locator("img").count() > 0
        img_box = item.locator("img").first.bounding_box() if has_image else None

        entry_info = {
            "index": i + 1,
            "year": year_text,
            "year_x": year_box["x"] if year_box else None,
            "badge": badge_text,
            "title": title_text,
            "title_x": title_box["x"] if title_box else None,
            "role": role_text,
            "desc_snippet": desc_text[:40] + "...",
            "highlights_count": len(highlights),
            "has_image": has_image,
            "img_x": img_box["x"] if img_box else None
        }
        desktop_data.append(entry_info)

    print("Desktop Journey validation results:")
    for d in desktop_data:
        print(f"  Item {d['index']}: Year={d['year']} (X={d['year_x']:.1f}), Category='{d['badge']}', Title='{d['title'][:25]}' (X={d['title_x']:.1f}), Image={d['has_image']} (ImgX={d['img_x']})")

    # Verify column alignment consistency:
    year_xs = [d["year_x"] for d in desktop_data]
    title_xs = [d["title_x"] for d in desktop_data]
    print(f"All Year X positions: {year_xs}")
    print(f"All Title X positions: {title_xs}")
    assert len(set([round(x, 1) for x in year_xs])) == 1, "Year columns must have identical X coordinates!"
    assert len(set([round(x, 1) for x in title_xs])) == 1, "Title columns must have identical X coordinates!"

    # 2. Mobile 390x844
    p_mobile = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2)
    p_mobile.goto("http://localhost:3000", wait_until="networkidle")
    p_mobile.wait_for_timeout(1000)

    items_m = p_mobile.locator("#journey ol > li")
    total_m = items_m.count()
    print(f"\nTotal Journey items (Mobile): {total_m}")
    assert total_m == 6, f"Expected 6 journey items on mobile, got {total_m}"

    mobile_data = []
    for i in range(total_m):
        item = items_m.nth(i)
        item.scroll_into_view_if_needed()
        p_mobile.wait_for_timeout(300)
        item.screenshot(path=os.path.join(output_dir, f"qa_journey_mobile_{i+1}.png"))

        year_el = item.locator(".type-display").first
        year_text = year_el.inner_text().strip()
        badge_el = item.locator(".lg\\:hidden").first
        badge_text = badge_el.inner_text().strip()
        title_el = item.locator("h3").first
        title_text = title_el.inner_text().strip()
        role_el = item.locator("p.text-blue-primary").first
        role_text = role_el.inner_text().strip()
        has_image = item.locator("img").count() > 0

        mobile_data.append({
            "index": i + 1,
            "year": year_text,
            "badge": badge_text,
            "title": title_text,
            "role": role_text,
            "has_image": has_image
        })

    print("Mobile Journey validation results:")
    for m in mobile_data:
        print(f"  Item {m['index']}: Year={m['year']}, Badge='{m['badge']}', Title='{m['title'][:25]}', Role='{m['role'][:25]}', Image={m['has_image']}")

    browser.close()
    print("\nJourney re-validation passed 100% on all 6 entries!")
