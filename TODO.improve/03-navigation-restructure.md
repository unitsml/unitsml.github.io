# 03 — Navigation & Information Architecture

## Problem

The nav bar is flat (6 items), Schemas needs prominent placement, and the sidebar doesn't cover UnitsDB or Schemas pages well. Users need clear paths to the two most important resources: UnitsDB and Schemas.

## Current Nav

```
UnitsDB · Schemas · Learn ▾ · Software · Blog · About
```

### Issues

1. **Schemas page has no sidebar** — the sidebar config has `/schemas` but it's a single-item sidebar. The schemas page covers both UnitsML XML Schemas and UnitsDB YAML Schemas, with subsections that would benefit from a sidebar TOC.
2. **UnitsDB page has no sidebar** — by design (full-width layout), but once inside an entity detail page, there's no way to navigate to another entity type except the breadcrumb back to UnitsDB index.
3. **Blog has no sidebar** — blog posts use the default VitePress behavior. Not critical, but the blog index could benefit from a "Recent posts" sidebar.

## Plan

### Step 1: Keep current nav bar as-is

```
UnitsDB · Schemas · Learn ▾ · Software · Blog · About
```

Schemas stays top-level because:
- Schema users arrive at the site specifically to understand or reference schemas
- Schemas is a core product alongside UnitsDB
- It's a high-value destination for developers integrating UnitsML

### Step 2: Improve Schemas sidebar

**File**: `.vitepress/config.ts`

Expand the `/schemas` sidebar to include anchor links for page sections:

```ts
'/schemas': [
  {
    text: 'Schemas',
    items: [
      { text: 'Overview', link: '/schemas' },
      { text: 'UnitsML XML Schemas', link: '/schemas#unitsml-xml-schemas' },
      { text: 'UnitsDB YAML Schemas', link: '/schemas#unitsdb-yaml-schemas' },
      { text: 'Schema Browser', link: '/schemas#schema-browser' },
    ]
  }
]
```

### Step 3: Add Schemas page anchor IDs

**File**: `schemas.md`

Ensure each major section has a proper heading with an ID that the sidebar can link to:
- `## UnitsML XML Schemas` (already exists)
- `## UnitsDB YAML Schemas` (already exists)
- `## Schema Browser` or similar for the external schema browser section

### Step 4: Improve UnitsDB sub-navigation

The UnitsDB browser already has entity-type tabs (Units, Quantities, Dimensions, Prefixes, Scales, Systems). For entity detail pages, the breadcrumb provides navigation back. No structural change needed, but add a subtle "back to listing" floating button on mobile for easier navigation.

**File**: `UnitsDBEntityDetail.vue`

Add a floating back button visible on mobile:
```html
<a :href="`/unitsdb/${entityType}`" class="ep-back-float" v-if="entity">
  ← {{ TYPE_PLURAL[entityType] }}
</a>
```

```css
.ep-back-float {
  display: none; /* hidden on desktop */
  position: fixed; bottom: 1rem; left: 50%; transform: translateX(-50%);
  padding: 0.5rem 1.25rem; border-radius: 999px;
  background: var(--vp-c-brand-1); color: white;
  font-size: 0.8125rem; font-weight: 600; text-decoration: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 50;
}
@media (max-width: 768px) {
  .ep-back-float { display: inline-flex; }
}
```

### Step 5: Add "Get Started" to the top-level nav or hero

"Get Started" is currently buried in the Learn dropdown. Since it's a key conversion page, ensure it's prominent:
- Keep in Learn dropdown (current)
- Add as a secondary CTA in the hero (done in TODO 01 — "Learn about UnitsML" links to `/learn/what-is-unitsml.html`)
- Add a "Quick Start" link in the footer

**File**: `.vitepress/config.ts` footer

```ts
footer: {
  message: `<a href="/unitsdb/">UnitsDB</a> · <a href="/schemas.html">Schemas</a> · <a href="/learn/what-is-unitsml.html">Learn</a> · <a href="/get-started.html">Get Started</a> · <a href="https://github.com/unitsml">GitHub</a>`,
}
```

### Step 6: Ensure footer links are comprehensive

Current footer: `UnitsDB · Schemas · Learn · GitHub`
Updated footer: `UnitsDB · Schemas · Learn · Get Started · Software · GitHub`

**File**: `.vitepress/config.ts`

## Files Modified

| File | Change |
|------|--------|
| `.vitepress/config.ts` | Expand schemas sidebar, update footer links |
| `schemas.md` | Verify anchor IDs exist for sidebar linking |
| `UnitsDBEntityDetail.vue` | Add mobile floating back button |

## Verification

1. Schemas page has a sidebar with section links
2. Footer has all key navigation links
3. Mobile: floating back button appears on entity detail pages
4. Nav bar unchanged (Schemas stays top-level)
