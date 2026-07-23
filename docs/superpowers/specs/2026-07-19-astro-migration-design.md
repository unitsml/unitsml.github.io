# UnitsML.org Astro Migration Design

## Objective
Fully migrate UnitsML.org from VitePress to Astro 7 with Vite 8 and Vue islands/components, preserving all content, pages, components, dynamic UnitsDB data, and custom styling while gaining a more flexible architecture.

## Current State
- **Framework:** VitePress 1.6.4
- **Pages:** 35+ markdown pages across Home, About, History, Supporters, Learn, Adopt, Software, Resources, Blog, UnitsDB
- **Components:** 13 Vue components (HomePage, TimelineSection, PeopleGrid, WappiMascot, UnitsDBBrowser, etc.)
- **Dynamic data:** UnitsDB browser with ~716 entities across 6 entity types, JSON exports, dynamic [type]/[id] routes
- **Features:** Dark mode, local search, custom asciidoc plugin, custom theme

## Approach: Full Rewrite (Phased)
Create a new Astro project in a top-level `astro/` directory, migrate content and components incrementally, then cut over. Keep the existing VitePress site untouched until the new site is fully verified.

## Phase 1: Scaffold & Layout
- `astro/` directory with `astro.config.mjs`
- Vite 8, Vue 3, TypeScript
- Base layout (`BaseLayout.astro`) with nav, footer, dark mode toggle
- Migrate `custom.css` theme variables and global styles
- Migrate favicon and static assets

## Phase 2: Static Pages
- Migrate markdown pages to Astro content collections:
  - `src/content/pages/` — About, History, Supporters, Resources, FAQ, Privacy, TOS, Get Started, Schemas
  - `src/content/learn/` — Learn pages
  - `src/content/software/` — Software pages
  - `src/content/adopters/` — Adopter pages
- Markdown frontmatter: title, description, layout
- MDX or Astro markdown with Vue component injection where needed

## Phase 3: Vue Islands
- Migrate components to `src/components/` as Vue islands:
  - HomePage.vue → `src/components/home/HomePage.vue` (or split into sections)
  - TimelineSection.vue → `src/components/TimelineSection.vue`
  - HistoryTimeline.vue → `src/components/HistoryTimeline.vue`
  - PeopleGrid.vue → `src/components/PeopleGrid.vue`
  - FAQAccordion.vue → `src/components/FAQAccordion.vue`
  - WappiMascot.vue → `src/components/WappiMascot.vue`
  - EcosystemDiagram.vue → `src/components/EcosystemDiagram.vue`
  - DataModelDiagram.vue → `src/components/DataModelDiagram.vue`
  - UnitsDBDiagram.vue → `src/components/UnitsDBDiagram.vue`
  - UnitsDBComposite.vue → `src/components/UnitsDBComposite.vue`
  - NavScrollHandler.vue → `src/components/NavScrollHandler.vue`
  - BlogIndex.vue → `src/components/BlogIndex.vue`
  - BlogByline.vue → `src/components/BlogByline.vue`
- Use `client:load`, `client:visible`, or `client:idle` as appropriate

## Phase 4: UnitsDB Browser
- Migrate UnitsDB JSON data to `src/data/unitsdb/`
- Create dynamic routes with Astro `getStaticPaths()`:
  - `/unitsdb/` — browser index
  - `/unitsdb/units/`, `/unitsdb/quantities/`, etc. — entity type pages
  - `/unitsdb/[type]/[id]/` — entity detail pages
- Migrate UnitsDBBrowser.vue and UnitsDBEntityDetail.vue as interactive islands

## Phase 5: Blog & Search
- Migrate blog posts to `src/content/blog/`
- Blog index and individual post pages
- Implement search (Pagefind or Astro's built-in search)

## Phase 6: Cutover & Cleanup
- Verify all routes, links, images, and components
- Update package.json scripts
- Remove VitePress artifacts
- Deploy

## Success Criteria
- [ ] All 35+ pages render correctly in Astro
- [ ] All 13 Vue components work as islands
- [ ] UnitsDB browser and entity detail pages fully functional
- [ ] Dark mode, search, and navigation work
- [ ] Build passes with zero errors
- [ ] No VitePress dependencies remain
