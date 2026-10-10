# Audit Report: Current Portfolio vs Visuvate Reference

## Observed Design Patterns: Visuvate (https://visuvate.com/)

### 1. Hero Section
- **Composition**: Balanced layout with portrait imagery + text introduction side-by-side or text overlay
- **Typography**: Strong hierarchical contrast - large display type for name, smaller accent text
- **Background**: Dark/near-black canvas with light text; selective use of accent color
- **Imagery**: Portraits or key visuals that feel intentional, not decorative
- **Motion**: Purposeful, minimal; no generic fade/in/float
- **Whitespace**: Generous, "breathing room" around elements

### 2. Project Showcase
- **Layout**: Dark backgrounds (#062f55 territory), large full-bleed or near-full-bleed imagery
- **Interaction**: Press-and-hold to preview (PressPreview component adapted) - scales media, drops scrim
- **Typography**: High contrast - white/light text on dark, or dark on light with clear hierarchy
- **Geometry**: Clean lines, intentional bleed, no orbital/curved decorative arcs
- **Card style**: Plates with minimal framing, images can bleed past container edges

### 3. General Page Structure
- **Sections**: Hero → About/Services → Works/Portfolio → Skills → Contact
- **Color**: Dark on light OR light on dark, consistently. Not mixed randomly.
- **Typography**: Display type in El Messiri or Jakarta; body in Jakarta; clear scale ratio
- **Motion**: "Editorial cuts" - press/hold interactions, not continuous animation
- **No**: Generic fade-in, floating, glow, parallax, decorative blobs, meaningless badges

### 4. Visual Language
- **Dark canvas** with light text as primary mode
- **Large display typography** as visual anchor
- **Intentional imagery** - images that carry meaning, not placeholder gradients
- **Grid-based** but with purposeful breaks/bleeds
- **Sparse decorative elements** - every element earns its place

---

## Current Portfolio: Identified Gaps vs Visuvate

| Area | Current Implementation | Visuvate Pattern | Gap |
|------|----------------------|------------------|-----|
| Hero | Complex orbital arcs, portrait right-side, dense grid layout | Balanced portrait+text, dark canvas, generous whitespace | Overly complex; too many orbital arcs; portrait dominates unnaturally |
| SelectedWork | 3-column plates with terminal strips, color accents | Dark plates, large imagery, PressPreview press-and-hold | Plate style; interaction pattern; lack of dark-mode visuals |
| Curved line language (ArcLines) | Orbit/intersect/horizon/quadrant arcs everywhere | Minimal, purposeful geometry; no continuous orbital lines | Excessive decorative arcs; Visuvate uses clean geometry |
| Journey/Currently | Dense axis layout, alternating visual/type entries | Clean sections, clear hierarchy | Too dense; axis grid feels institutional |
| Skills | 4 disciplinary columns with focus areas | Simple, direct presentation | Over-structured; too many columns/decorative markers |
| Marquee | Two marquee bands at top | May be absent or very minimal | Two marquee bands not typical of Visuvate |
| Motion | Continuous rotate/infinite animations | Press-and-hold, deliberate transitions | Generic continuous vs purposeful interaction |
| Color usage | Full palette across all sections | Dark-on-light or light-on-dark per section | Mixed palette usage without section purpose |
| Whitespace | Dense with grid lines, arcs, rules | Generous, elements breathe | Too cramped; decorative elements reduce breathing room |

---

## Content Constraints (Must Preserve)

- **Fonts**: Plus Jakarta Sans (primary), El Messiri (secondary if design-supportive)
- **Color palette**: #0876ce and #062f55 based, with white/off-white
- **Projects**: KALANATA, KINARYA, PKKMB FKIP UNS 2025
- **Remove**: KKN Logbook Automation from all public content
- **Highlight**: Jabatan Wakil Menteri Riset dan Data BEM FKIP UNS as historical experience
- **No new sections**: Don't add section/card/badge just because template-portfolio
- **No gradient-as-image**: Use actual project images
- **No invented content**: Don't fabricate testimonials, stats, commercial info

---

## Redesign Strategy

Adapt Visuvate's visual patterns (composition, hierarchy, motion) while preserving:
- Personal identity of Muhammad Fahry Ali
- All existing project data and images
- Font + color identity
- No new dependencies

Key changes:
1. **Hero**: Simplify composition; balance portrait + text; reduce orbital arcs
2. **SelectedWork**: Dark background plates; PressPreview interaction; larger imagery
3. **Remove**: Excessive ArcLines/orbital decoration from all sections
4. **Journey/Currently**: Cleaner section layout; fewer dense grids
5. **Skills**: Simpler presentation; fewer columns/markers
6. **Marquee**: Reduce to one or adapt pattern
7. **Globals.css**: Refine palette, typography scales