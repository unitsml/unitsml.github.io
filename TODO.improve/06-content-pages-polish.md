# 06 — Content Pages Polish

## Problem

Learn pages, About, and Schemas are walls of text with minimal visual breaks. The About page is extremely long (ecosystem, governance, timeline, people, orgs, FAQ). Schemas page lacks visual hierarchy. Blog posts have no reading-time indicator.

## Plan

### Step 1: Schemas page — visual cards for each schema type

**File**: `schemas.md`

The current schemas page uses markdown headings and code blocks. Restructure into visual cards:

```html
<div class="schemas-grid">
  <div class="schema-type-card">
    <div class="schema-type-icon"><!-- XML icon --></div>
    <h3>UnitsML XML Schemas</h3>
    <p>Authoritative XML schemas (XSD) for encoding units of measure...</p>
    <div class="schema-meta">
      <span>Format: XSD</span>
      <span>Hosted: schema.unitsml.org</span>
    </div>
    <div class="schema-links">
      <a href="https://schema.unitsml.org">Browse schemas →</a>
      <a href="https://github.com/unitsml/unitsml-schema">GitHub →</a>
    </div>
  </div>
  <div class="schema-type-card">
    <div class="schema-type-icon"><!-- YAML icon --></div>
    <h3>UnitsDB YAML Schemas</h3>
    <p>YAML schemas defining the structure of UnitsDB entries...</p>
    <div class="schema-meta">
      <span>Format: YAML</span>
      <span>Repo: unitsdb</span>
    </div>
    <div class="schema-links">
      <a href="https://github.com/unitsml/unitsdb/tree/main/schemas">Browse schemas →</a>
    </div>
  </div>
</div>
```

Style as side-by-side cards with:
- Icon (file icon with XML/YAML badge)
- Title + description
- Meta chips (format, hosting location)
- Action links

### Step 2: Schemas page — add a "Schema Browser" embed/preview

Below the cards, add a compact preview of the schema browser experience. This could be:
- A screenshot/mockup of schema.unitsml.org in a browser frame (similar to the UnitsDB CTA preview window on the homepage)
- Or a simple CTA card linking to schema.unitsml.org

Reuse the `preview-window` pattern from the homepage:
```html
<div class="preview-window">
  <div class="preview-bar"><span></span><span></span><span></span></div>
  <div class="preview-content">
    <div class="preview-url-bar">https://schema.unitsml.org/unitsml/1.0</div>
    <!-- Static representation of schema structure -->
    <pre>UnitSet
  ├── Unit (xml:id, dimensionURL)
  │   ├── UnitName
  │   ├── UnitSymbol
  │   └── RootUnits
  ├── QuantitySet
  └── DimensionSet</pre>
  </div>
</div>
```

### Step 3: Learn pages — add visual callout patterns

**Files**: `learn/*.md`

The "What is UnitsML" page has a good pattern with `callout-grid` (Mars Climate Orbiter story). Extend this pattern to other learn pages:

- `how-it-works.md`: Add a callout for the BIPM/UCUM/QUDT cross-reference table — wrap it in a styled card with authority logos
- `incorporating-unitsml.md`: Add a "real-world example" callout showing how UnitsML fits into a specific domain (e.g., materials science with MatML, chemistry with CML)
- `who-is-it-for.md`: Add persona callout cards with icons for each audience (Metrologist, Software Developer, Standards Body, Researcher)

These are scoped CSS additions in each page's `<style scoped>` block.

### Step 4: About page — add section navigation / TOC

The About page is ~300 lines of markdown with 8+ sections. Add an inline TOC at the top:

```html
<nav class="about-toc">
  <a href="#the-unitsml-ecosystem">Ecosystem</a>
  <a href="#vision">Vision</a>
  <a href="#governance">Governance</a>
  <a href="#history">History</a>
  <a href="#people">People</a>
  <a href="#participating-organizations">Organizations</a>
  <a href="#frequently-asked-questions">FAQ</a>
</nav>
```

Style as a horizontal pill bar at the top of the page (below the lead paragraph), sticky on scroll if the page is long enough. Each pill links to its section anchor.

```css
.about-toc {
  display: flex; gap: 0.5rem; flex-wrap: wrap;
  margin-bottom: 2rem; padding: 0.75rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}
.about-toc a {
  font-size: 0.8125rem; padding: 0.25rem 0.75rem;
  border-radius: 999px; background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2); text-decoration: none;
  border: 1px solid var(--vp-c-divider);
}
.about-toc a:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
```

### Step 5: Blog — add reading time estimate

**File**: `.vitepress/posts.data.ts`

Add a reading-time calculation to the blog post frontmatter:

```ts
export default createContentLoader('blog/*.md', {
  transform(raw) {
    return raw.map(({ url, frontmatter, src }) => {
      const wordCount = src ? src.split(/\s+/).length : 0
      const readingTime = Math.max(1, Math.round(wordCount / 200))
      return { url, frontmatter, readingTime }
    })
  }
})
```

**File**: `BlogIndex.vue`

Display in the card:
```html
<span class="blog-reading-time">{{ post.readingTime }} min read</span>
```

### Step 6: Blog — add author avatar/initials

**File**: `BlogByline.vue`

If no avatar image is provided, show author initials in a colored circle:
```html
<div class="author-avatar" v-if="!author.avatar">
  {{ author.name.split(' ').map(n => n[0]).join('') }}
</div>
<img v-else :src="author.avatar" class="author-avatar" />
```

```css
.author-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; font-weight: 700;
}
```

## Files Modified

| File | Change |
|------|--------|
| `schemas.md` | Visual card layout, schema browser preview |
| `learn/how-it-works.md` | Authority callout cards with logos |
| `learn/incorporating-unitsml.md` | Real-world example callout |
| `learn/who-is-it-for.md` | Persona cards with icons |
| `about.md` | Inline TOC pills |
| `posts.data.ts` | Reading time calculation |
| `BlogIndex.vue` | Display reading time |
| `BlogByline.vue` | Author initials fallback |

## Verification

1. Schemas page has 2 visual schema type cards
2. Learn pages have at least 1 visual callout pattern each
3. About page has inline TOC that links to all sections
4. Blog cards show reading time
5. Blog posts show author initials when no avatar
