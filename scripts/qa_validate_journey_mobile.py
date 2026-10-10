import os
from playwright.sync_api import sync_playwright

output_dir = "artifacts/visual-audit"
os.makedirs(output_dir, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # Mobile 390x844
    p_mobile = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2)
    p_mobile.goto("http://localhost:3000", wait_until="networkidle")
    p_mobile.wait_for_timeout(1000)

    items_m = p_mobile.locator("#journey ol > li")
    total_m = items_m.count()
    print(f"Total Journey items (Mobile): {total_m}")
    assert total_m == 6

    mobile_data = []
    for i in range(total_m):
        item = items_m.nth(i)
        box = item.bounding_box()
        if box:
            p_mobile.evaluate(f"window.scrollTo(0, {box['y'] - 60})")
            p_mobile.wait_for_timeout(500)
            p_mobile.screenshot(path=os.path.join(output_dir, f"qa_journey_mobile_page_{i+1}.png"), clip={"x": 0, "y": 0, "width": 390, "height": 450})

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

    for m in mobile_data:
        print(f"  Item {m['index']}: Year={m['year']}, Badge='{m['badge']}', Title='{m['title'][:25]}', Role='{m['role'][:25]}', Image={m['has_image']}")

    browser.close()
    print("Mobile Journey validation completed successfully!")
