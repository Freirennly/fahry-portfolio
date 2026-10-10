import urllib.request
import json
from playwright.sync_api import sync_playwright

routes = [
    "/",
    "/work/kalanata",
    "/work/kinarya",
    "/work/pkkmb-fkip-uns-2025"
]

print("=== Starting Routes and Assets Audit ===")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    
    for route in routes:
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        console_errors = []
        failed_requests = []
        
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        page.on("requestfailed", lambda req: failed_requests.append(req.url))
        
        url = f"http://localhost:3000{route}"
        res = page.goto(url, wait_until="networkidle")
        assert res.status == 200, f"Route {route} failed with status {res.status}"
        
        # Check Title
        title = page.title()
        print(f"\nRoute [{route}]:")
        print(f"  Title: {title}")
        assert len(title) > 0, f"Missing title on {route}"
        
        # Check Meta Description
        meta_desc = page.locator("meta[name='description']").get_attribute("content")
        print(f"  Description: {meta_desc}")
        assert meta_desc and len(meta_desc) > 0, f"Missing meta description on {route}"
        
        # Check Canonical Link
        canonical = page.locator("link[rel='canonical']").get_attribute("href")
        print(f"  Canonical: {canonical}")
        assert canonical and len(canonical) > 0, f"Missing canonical on {route}"
        
        # Check Open Graph
        og_title = page.locator("meta[property='og:title']").get_attribute("content")
        og_image = page.locator("meta[property='og:image']").get_attribute("content")
        print(f"  OG Title: {og_title}")
        print(f"  OG Image: {og_image}")
        assert og_title and len(og_title) > 0, f"Missing og:title on {route}"
        
        # Check Favicon
        favicon = page.locator("link[rel*='icon']").first.get_attribute("href")
        print(f"  Favicon: {favicon}")
        assert favicon and len(favicon) > 0, f"Missing favicon link on {route}"
        
        # Scroll through page to trigger lazy loading of images
        page.evaluate("() => window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(1000)
        page.evaluate("() => window.scrollTo(0, 0)")
        page.wait_for_timeout(500)
        
        # Check Images: naturalWidth > 0 and alt attribute exists
        images = page.locator("img").all()
        print(f"  Total images found: {len(images)}")
        for idx, img in enumerate(images):
            alt = img.get_attribute("alt")
            src = img.get_attribute("src")
            aria_hidden = img.get_attribute("aria-hidden")
            # Natural width check
            is_loaded = page.evaluate("(el) => el.complete && el.naturalWidth > 0", img.element_handle())
            assert is_loaded, f"Image {src} failed to load on {route}"
            # Check alt (either descriptive or alt='' for decorative/aria-hidden)
            assert alt is not None, f"Image {src} missing alt attribute on {route}"
            
        print(f"  Console errors: {len(console_errors)}")
        print(f"  Failed requests: {len(failed_requests)}")
        assert len(console_errors) == 0, f"Console errors on {route}: {console_errors}"
        assert len(failed_requests) == 0, f"Failed requests on {route}: {failed_requests}"
        
        page.close()

    # Check sitemap.xml
    print("\n=== Checking /sitemap.xml ===")
    page_sm = browser.new_page()
    sm_res = page_sm.goto("http://localhost:3000/sitemap.xml")
    print(f"  Status: {sm_res.status}")
    assert sm_res.status == 200, "sitemap.xml returned non-200"
    sm_content = page_sm.content()
    assert "<urlset" in sm_content, "sitemap.xml missing urlset"
    assert "/work/kalanata" in sm_content, "sitemap.xml missing case studies"
    page_sm.close()

    # Check robots.txt
    print("\n=== Checking /robots.txt ===")
    page_rb = browser.new_page()
    rb_res = page_rb.goto("http://localhost:3000/robots.txt")
    print(f"  Status: {rb_res.status}")
    assert rb_res.status == 200, "robots.txt returned non-200"
    rb_text = page_rb.content()
    assert "User-Agent" in rb_text, "robots.txt missing User-Agent"
    page_rb.close()

    browser.close()

print("\nALL ROUTES AND ASSETS VERIFIED SUCCESSFULLY!")
