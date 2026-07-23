# UnitsML.org IA Redesign & Page Overhaul

## Objective
Fix identified UI bugs, establish a coherent information architecture, and create rich, authentic pages that position UnitsML as the authoritative XML units standard through dedicated adopter showcases, a standalone history page, a redesigned About page, and a logo-enriched Supporters page.

## Root Causes Identified
1. **Hero logo invisible** — `symbol.svg` has no explicit `width`/`height` attributes, so the browser renders it at 0×0. Fix by adding explicit width/height to the SVG and setting a display width in CSS.
2. **Mobile nav not sticky** — `.VPNav` uses `position: relative` on small screens. Override to `position: sticky; top: 0; z-index: 100`.
3. **Mobile hero padding too large** — `6rem 2rem 4rem` wastes horizontal space. Reduce to `4rem 1rem 3rem` under 768px.

## Approach: Content-First IA (Recommended)
Keep the existing navigation structure but add three new top-level destinations and enrich existing pages. This avoids nav-churn risk while delivering the requested content.

### New pages
- `who-uses-unitsml.md` — “Who uses UnitsML” overview with adopter cards linking to detail pages.
- `adopters/ocx.md` — deep dive on Open Class 3D Exchange.
- `adopters/iec-cdd.md` — deep dive on IEC CDD / IEC/TS 62720.
- `history.md` — standalone, visually rich timeline/history page.

### Redesigned / enriched pages
- `index.md` / `HomePage.vue` — fix logo, mobile padding, nav; move “Used by Leading Standards” directly after hero; add small OCX/IEC logo badges in hero linking to `who-uses-unitsml`.
- `about.md` — better visual hierarchy, improved org grid, clearer governance cards.
- `supporters.md` — replace placeholder icons with real logos from `pubid.github.io`.
- `.vitepress/config.ts` — add new nav/sidebar entries.

## Detailed Page Designs

### 1. Homepage fixes
- Logo: add `width="93" height="107"` to `symbol.svg` and set `.home-hero-logo { width: 180px; height: auto; }`.
- Mobile nav: `.VPNav { position: sticky; top: 0; z-index: 100; }` globally, and confirm it on small screens.
- Mobile hero: `@media (max-width: 768px) { .home-hero { padding: 4rem 1rem 3rem; } }`.
- Adopters section: move the `adopters-grid` to immediately after the hero, before the UnitsDB CTA.
- Hero badges: add two small OCX/IEC logo badges under the CTA buttons that link to `/who-uses-unitsml`.

### 2. Who uses UnitsML (`who-uses-unitsml.md`)
- Lead: “Standards and products that rely on UnitsML for unambiguous unit encoding.”
- Adopter cards (grid): OCX, IEC CDD, ECLASS, Plurimath, AnIML.
- Each card: logo, one-line description, link to detail page.
- “Why organizations choose UnitsML” bullet list.

### 3. OCX adopter page (`adopters/ocx.md`)
- Hero: OCX logo + “Open Class 3D Exchange” + tagline.
- “How OCX uses UnitsML”: XML snippet showing `unit="Um"` attributes in OCX.
- “What UnitsML gives OCX”: bullet list of benefits.
- Links: 3docx.org, OCX GitHub.

### 4. IEC CDD adopter page (`adopters/iec-cdd.md`)
- Hero: IEC logo + “IEC Common Data Dictionary” + tagline.
- “How IEC CDD uses UnitsML”: explain IEC/TS 62720 units, ECLASS 1:1 mapping, OPC UA mapping example.
- “What UnitsML gives IEC”: stability, SI alignment, cross-references.
- Links: cdd.iec.ch, IEC webstore.

### 5. History page (`history.md`)
- New enhanced `HistoryTimeline.vue` component with:
  - Era-based visual bands (NIST era, OASIS era, CalConnect era).
  - Richer entries with dates, quotes, and artifact links.
  - Alternate card layout.
- Use the existing timeline data plus new entries from archives.

### 6. About page (`about.md`)
- Keep existing sections but improve:
  - Governance cards: larger icons, clearer era labels.
  - Organizations grid: use real logos for NIST, CalConnect, LBNL, Ribose, IBM, CML, OASIS, BIPM, OCX, IEC.
  - Historical quote block retained.

### 7. Supporters page (`supporters.md`)
- Replace SVG placeholders with real logos copied from `pubid.github.io/public/logos/`:
  - NIST: `nist-logo.svg`
  - CalConnect: `calconnect-logo.svg`
  - LBNL: no logo in pubid; keep icon or find one
  - Ribose: no logo in pubid; keep icon
  - IBM: no logo in pubid; keep icon
  - CML: no logo in pubid; keep icon
  - OASIS: `oasis-logo.svg`
  - BIPM: `bipm-logo.svg`
  - IEC: `iec-logo.svg`
  - OCX: use existing `ocx-logo.png`

### 8. Navigation updates
- Top nav: add “Who uses UnitsML” under Learn dropdown; add “History” under Learn dropdown.
- Sidebar: add new pages under Learn and About sections.

## Files to create / modify
- `public/symbol.svg` (edit)
- `.vitepress/theme/custom.css` (edit)
- `.vitepress/theme/components/HomePage.vue` (edit)
- `.vitepress/config.ts` (edit)
- `who-uses-unitsml.md` (new)
- `adopters/ocx.md` (new)
- `adopters/iec-cdd.md` (new)
- `history.md` (new)
- `.vitepress/theme/components/HistoryTimeline.vue` (new)
- `about.md` (edit)
- `supporters.md` (edit)
- `public/logos/*.svg|png` (new copies)

## Success Criteria
- [ ] Hero logo visible on desktop and mobile.
- [ ] Mobile nav is sticky; hero has no excessive horizontal padding.
- [ ] Homepage shows adopters immediately after hero.
- [ ] `/who-uses-unitsml`, `/adopters/ocx`, `/adopters/iec-cdd`, `/history` exist and render.
- [ ] Supporters page shows real logos for at least 8 organizations.
- [ ] `npm run build` passes.
