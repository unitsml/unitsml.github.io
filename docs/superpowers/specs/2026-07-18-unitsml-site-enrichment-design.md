# UnitsML.org Site Enrichment Design

## Objective
Enrich UnitsML.org with authentic historical material, showcase authoritative standards adoption (OCX, IEC CDD), and add tasteful interactive easter eggs that reinforce the project's established, credible, and engaging identity.

## 1. Historical Content Enrichment

### 1.1 Timeline additions (`TimelineSection.vue`)
Add specific, verifiable milestones discovered in sibling repositories:
- **2003-01-22** — Sixth Open Forum on Metadata Registries, Santa Fe, NM
- **2006-07-12** — First official OASIS UnitsML TC teleconference
- **2010-01-25** — NVUnitsML interactive demo published
- **2011-09-11** — SCC-20 TII/TAD Working Group presentation
- **2011-12-13** — UnitsML v1.0-csd04 approved
- **2021-02-19** — NIST UnitsDB dump preserved in `unitsdb-archive`
- **2022-06-20** — SciDataCon 2022 Units Summit presentation
- **2022-09-12** — CIPM/BIPM presentation on semantic SI Brochure
- **2025-03-15** — UnitsDB 1.0 release
- **2025-05-21** — UnitsDB 2.0 release (organization-neutral IDs, multilingual names)

### 1.2 Resources page additions (`resources.md`)
Add cards for:
- OASIS flyer (May 2006)
- First OASIS TC teleconference slides (2006-07-12)
- SCC-20 presentation (2011-09-11)
- CIPM 2022 presentation PDF
- NIST JRES article (already present)
- Naming & Design Rules (NDRs) PDF

### 1.3 People grid additions (`PeopleGrid.vue`)
Add key contributors identified from archives:
- Peter Linstrom (NIST CSTL)
- Martin S. Weber (NIST Associate)
- Kent Reed (NIST BFRL)
- Ismet Celebi (former NIST, JRES lead author)
- Reinhold Schaefer (WICIL / RheinMain University)
- Karen LeGrand (IEM)

### 1.4 About page enrichment (`about.md`)
- Expand the "Participating Organizations" grid with OCX Consortium and IEC.
- Add historical quote from the original NIST homepage / OASIS flyer.

## 2. Authoritative Adoption Showcase

### 2.1 New "Adopted by leading standards" section
Add a section to the homepage (`HomePage.vue`) between "How UnitsML Works" and the CTA strip, displaying:
- **OCX Consortium** — Open Class 3D Exchange XML standard for shipbuilding, uses UnitsML v0.9.18 for unit encoding in 3D model-based class approval.
- **IEC CDD / IEC/TS 62720** — IEC Common Data Dictionary uses IEC/TS 62720 for units; ECLASS provides IRDIs based on UnitsML with a 1:1 relationship to IEC units.

Each adopter gets a card with logo, short description, and a link to the standard body.

### 2.2 Logo assets
- `public/logos/ocx-logo.png` — OCX Consortium logo (paper boat)
- `public/logos/iec-logo.svg` — IEC logo

### 2.3 Content pages
- Update `learn/who-is-it-for.md` "Real-world use cases" to mention shipbuilding (OCX) and industrial automation / IEC CDD.
- Update `learn/what-is-unitsml.md` "Relationship to SI" section to mention alignment with BIPM Digital SI Framework and IEC/TS 62720.

## 3. Easter Eggs

### 3.1 WAPPI mascot
Create `WappiMascot.vue` — a small, friendly SVG unit sprite. WAPPI appears when:
- User clicks the hero logo, or
- User types "wappi" anywhere on the page.

WAPPI waves, then displays a short, fun fact about units/measurement history (e.g. "The Mars Climate Orbiter was lost because of a unit mix-up!"). It auto-hides after a few seconds or on click.

### 3.2 Logo hover enhancement
The hero logo subtly pulses/glows on hover and shows a tooltip with the Lao Tze quote used in the brand guide: "What is empty provides utility."

### 3.3 Konami-code unit parade
Typing the Konami code (↑↑↓↓←→←→BA) on the homepage temporarily speeds up the floating dimensional symbols and makes WAPPI appear.

## 4. Implementation Files
- `.vitepress/theme/components/WappiMascot.vue` — new
- `.vitepress/theme/components/HomePage.vue` — add adopter section and WAPPI
- `.vitepress/theme/components/TimelineSection.vue` — add entries
- `.vitepress/theme/components/PeopleGrid.vue` — add people
- `about.md` — add orgs and historical context
- `resources.md` — add resource cards
- `learn/who-is-it-for.md` — add use cases
- `learn/what-is-unitsml.md` — add adoption context
- `public/logos/ocx-logo.png` — new
- `public/logos/iec-logo.svg` — new

## 5. Success Criteria
- [ ] Timeline contains at least 5 new verifiable milestones.
- [ ] Resources page links to OASIS flyer, SCC-20, and CIPM presentations.
- [ ] Homepage displays OCX and IEC adoption cards with logos.
- [ ] WAPPI mascot appears on logo click or typing "wappi".
- [ ] Site builds and renders without errors (`npm run build`).
