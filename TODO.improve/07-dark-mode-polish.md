# 07 — Dark Mode & Accessibility Polish

## Problem

Dark mode works but has inconsistencies. The UnitsDB components, entity detail badges, and custom cards need dark-mode testing. Accessibility is generally good (VitePress handles most of it) but the custom components have gaps.

## Plan

### Step 1: Dark mode — UnitsDB browser tabs

**File**: `UnitsDBBrowser.vue`

The tab buttons use inline color variables which generally work, but the active tab indicator (teal underline) can be too subtle in dark mode. Ensure the active tab has sufficient contrast:

```css
.dark .tab-btn.active {
  border-bottom-color: var(--unitsml-teal-light);
  color: var(--unitsml-teal-light);
}
```

### Step 2: Dark mode — entity detail authority badges

**File**: `UnitsDBEntityDetail.vue`

The authority badges have a white background (`#fff`). In dark mode, a white square badge on a dark page is jarring. Invert to use the dark-mode badge background:

```css
.dark .ep-auth-badge {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
}
```

The SVG logos inside (BIPM, UCUM, QUDT) have dark fills, so they should remain visible. Verify by testing.

### Step 3: Dark mode — homepage hero floating shapes

**File**: `custom.css` or `HomePage.vue`

The floating shapes use `border: 2px solid var(--unitsml-navy)`. In dark mode, `--unitsml-navy` becomes `#6e6dba`, which is lighter. This is fine, but verify the grid background is still visible:

```css
.dark .hero-grid-bg {
  background-image:
    linear-gradient(rgba(110, 109, 186, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(110, 109, 186, 0.05) 1px, transparent 1px);
}
```

### Step 4: Dark mode — preview windows

The UnitsDB CTA preview window and Schema Browser preview use a dark background regardless of theme. These are designed to look like terminal/code windows, so they should stay dark in both modes. No change needed.

### Step 5: Accessibility — ARIA labels on interactive elements

**File**: `UnitsDBBrowser.vue`, `UnitsDBEntityDetail.vue`

1. Search input needs `aria-label`:
```html
<input v-model="search" aria-label="Search units and quantities" />
```

2. Tab buttons need `role="tablist"` and `role="tab"`:
```html
<div class="stats-tabs" role="tablist">
  <button role="tab" :aria-selected="activeType === type" ...>
```

3. Tab panels need `role="tabpanel"`:
```html
<div role="tabpanel" :aria-label="TYPE_LABEL[activeType] + ' listing'">
```

4. The ecosystem diagram SVG needs `role="img"` (already present) and `aria-label` (already present).

### Step 6: Accessibility — focus indicators

Custom buttons (`.btn`, `.step-tab`, `.tab-btn`) should have visible focus indicators:

```css
.btn:focus-visible,
.step-tab:focus-visible,
.tab-btn:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
```

### Step 7: `prefers-reduced-motion` — disable animations

**File**: `custom.css`

Ensure the global reduced-motion media query covers all custom animations:

```css
@media (prefers-reduced-motion: reduce) {
  .hero-shape,
  .ticker-track,
  .stat-card,
  .feature-card,
  .project-card,
  .section[data-revealed] {
    animation: none !important;
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

## Files Modified

| File | Change |
|------|--------|
| `UnitsDBBrowser.vue` | Dark mode tab contrast, ARIA roles, focus indicator |
| `UnitsDBEntityDetail.vue` | Dark mode badge background, ARIA labels |
| `custom.css` | Dark mode hero fixes, focus indicators, reduced-motion |
| `HomePage.vue` | Dark mode grid background, reduced-motion |

## Verification

1. Toggle dark mode — all components render correctly
2. Authority badges in dark mode have appropriate background
3. Tab navigation is keyboard-accessible (Tab + Arrow keys)
4. Search input is labeled for screen readers
5. Focus rings visible on all interactive elements
6. With `prefers-reduced-motion: reduce` enabled, no animations play
