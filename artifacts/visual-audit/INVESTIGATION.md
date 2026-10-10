# Visual Audit Investigation Log

## Investigation 1: Curved Line Below Hero Banner (Mobile) - RESOLVED

### Root Cause Confirmed
- **Source**: `src/components/sections/Intro.tsx` lines 42-46.
- The `<div className="pointer-events-none absolute -top-[16%] left-1/2 h-[760px] w-[1500px] ...">` contained an `<ArcLines variant="horizon" stroke="rgba(7,89,155,0.30)" ... />` SVG.
- Because `Intro.tsx` lacked `overflow-hidden`, and had `-top-[16%]` offset on a 760px tall container, the SVG circle extended ~120px above `Intro`, bleeding straight through `Marquee` and into the bottom margin of `Hero` at Y ≈ 710px on mobile 390×844.
- **Resolution**:
  1. Added `overflow-hidden` to `Intro.tsx` section container (`gutter-safe relative overflow-hidden ...`).
  2. Anchored the arc at `top-0` instead of `-top-[16%]`.
- **Proof**: Screenshots in `verified_mobile_390_hero.png` verify that the curved line artifact is 100% gone from the Hero/Marquee boundary.

---

## Investigation 2: Journey Layout Disorganization & Redundant Metadata - RESOLVED

### Root Cause Confirmed
1. **Misaligned Columns & Sticking Text**:
   - `Journey.tsx` split layout using an ad-hoc `COMPOSITION: Record<string, "visual" | "type">`.
   - In "visual" items, `item.role` was placed in column 1 (`col-span-4`) under `item.year`, while `item.title` was thrown into column 2 under an image! This separated Title and Role across columns and caused `2021` and `Video Editor Intern · Gamelab` to stick together in column 1 without the experience title.
   - For alternate visual items, `flipped && "lg:[direction:rtl]"` reversed reading direction from left-to-right to right-to-left, flipping column order arbitrarily and ruining scanability.
   - In "type" items (2023), `item.year` was in column 1 and `item.role` was in column 2, creating inconsistent layout rules across milestones.
2. **`KreatifKreatif / Video` Duplication & Detached Category**:
   - A metadata bar `<div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1">` printed `{DISCIPLINE_LABEL[item.discipline]}` ("Kreatif") followed by `{item.theme}` ("Kreatif / Video"). Because both strings began with "Kreatif", it read `Kreatif Kreatif / Video`.
   - This block was rendered before the grid columns, visually detached from the actual role and experience title.
3. **Redundant Giant Year Stamped on Image**:
   - The image fragment had `<span className="type-display absolute bottom-4 left-5 text-[44px] sm:text-[56px]">{item.year}</span>` overlaying the preview, which was jarring and redundant with the main year column.

### Resolution
- Standardized all 6 entries into a disciplined 3-part responsive grid:
  - **Column 1 (`lg:col-span-2`)**: Dedicated Year column, consistently aligned at the top of the entry.
  - **Column 2 (`lg:col-span-6` or `10`)**: Cohesive Experience Unit:
    - Clean category pill (`{item.theme}`) directly above the title.
    - Title (`font-heading font-bold`) and Role/Organization stacked together as an immediate unit.
    - Narrative description, highlights tag list, and case study link.
  - **Column 3 (`lg:col-span-4`)**: Media preview card with subtle `Dokumentasi {year}` caption.
- Removed `direction: rtl` hack.
- On mobile: Year and Category badge sit side-by-side at the top, followed by Title & Role unit, image preview, description, and highlights.
- **Proof**: `journey_desktop_item_1.png`, `journey_desktop_item_3.png`, `journey_mobile_item_1.png`.

---

## Investigation 3: Hamburger Dropdown Redesign - RESOLVED

### Root Cause Confirmed
- Previous mobile drawer styled the entire `<header>` element with `bg-blue-abyss/90 backdrop-blur-xl border-b ... shadow-[0_24px_48px_-16px_...]` and rendered a full-width `<nav id="mobile-nav">` inside the navbar container flow.
- This made the entire top of the screen turn into a thick dark block, pushing the hero content down and dominating the page.

### Resolution
- Converted mobile menu into a floating, compact glassmorphism panel anchored at top-right:
  - Fixed position: `right-4 sm:right-6 top-[calc(3.5rem+6px)] md:hidden`.
  - Measured width: `w-[min(260px,calc(100vw-32px))]`.
  - Styling: Translucent navy `bg-[#06172a]/88`, `backdrop-blur-xl`, `border border-white/12`, `shadow-[0_16px_40px_rgba(2,10,24,0.52)]`, `rounded-xl`.
  - Links: 01 WORK, 02 ABOUT, 03 ARCHIVE, 04 CONTACT. No dividing lines, comfortable touch target.
  - Interaction: Closes on link click, click outside, and Escape key. Focus returned to toggle button on Escape.
  - Responsive: Desktop nav unaffected, hamburger button hidden on screens ≥ 768px.
- **Proof**: `after_mobile_360_menu_open.png`, `after_mobile_390_menu_open.png`, `after_tablet_768_header.png`.

---

## Investigation 4: Pelepasan Tautan Sumber EDAS dari Halaman Publik - RESOLVED

### Latar Belakang & Persyaratan
- Karya ilmiah `icvee-2026-paper` ("Implementation and Performance Evaluation of Rule-Based Systems in Educational Assessment", ICVEE 2026) memiliki tautan internal sementara ke sistem review EDAS (`https://edas.info/showPaper.php?m=1571304167`).
- Tautan review EDAS bukan merupakan tautan publikasi resmi publik dan harus dihilangkan dari antarmuka pengguna website tanpa merusak fakta karya ilmiah (status tetap "Accepted", bukan "Published").

### Lokasi Ditemukan
1. `src/components/sections/Archive.tsx`:
   - Blok sorotan publikasi (`publication.sourceUrl && (<a ...>Sumber EDAS ↗</a>)`).
   - Kartu katalog arsip (`item.sourceUrl ? (<a ...>Sumber EDAS ↗</a>) : ...`).
2. `src/lib/data/archive.ts`:
   - Properti `sourceUrl: "https://edas.info/showPaper.php?m=1571304167"` pada entri `icvee-2026-paper`.

### Tindakan Resolusi
1. Menghapus elemen tautan EDAS beserta ikon panah `↗` dari `Archive.tsx` pada callout publikasi dan kartu katalog.
2. Menghapus properti `sourceUrl` dari entri `icvee-2026-paper` di `src/lib/data/archive.ts`.
3. Mempertahankan seluruh metadata karya:
   - Judul: "Implementation and Performance Evaluation of Rule-Based Systems in Educational Assessment"
   - Penulis: "Muhammad Fahry Ali dan Febri Liantoni"
   - Konferensi: "2026 Ninth International Conference on Vocational Education and Electrical Engineering (ICVEE)"
   - Track: "Education Engineering"
   - Tahun: "2026"
   - Status: "Accepted" (dengan keterangan akurat: "Belum terbit sebagai prosiding")
4. Tidak membuat URL fiktif atau tautan pengganti tiruan.
5. Verifikasi via ripgrep dan Playwright: Teks "Sumber EDAS" dan URL `edas.info` 0 hasil (tidak ada yang tampil di UI publik).