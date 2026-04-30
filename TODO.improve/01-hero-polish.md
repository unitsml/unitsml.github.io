# 01 — Hero Polish

## Problem

The hero has visual noise that breaks reading flow and dilutes the primary message.

### Issues

1. **Ticker above headline breaks reading flow** — The scrolling unit ticker sits *between* the logo and the `<h1>`, so the natural scan path (logo → headline → tagline → CTA) is interrupted by a peripheral animation competing for attention. It adds motion without adding comprehension.

2. **Three CTAs dilute the primary action** — "Explore UnitsDB", "View Schemas", "Learn about UnitsML". Three equal-weight buttons give no clear next step. The user's primary question is "what is this?" — not "take me to the database".

3. **Floating shapes are generic noise** — Circles, squares, and diamonds don't connect to UnitsML's domain (scientific units). They add animation for animation's sake and make the hero feel like a generic SaaS template.

4. **Grid background is too subtle to notice** — The 48px grid lines at 4% opacity are nearly invisible. Either commit to the grid aesthetic or remove it.

## Plan

### Step 1: Restructure hero visual hierarchy

Reorder: logo → headline → tagline → CTAs → ambient decoration. The ticker moves below CTAs as a subtle "pills" strip (not scrolling — static chips showing `m kg s A K mol cd N J W Pa`).

**File**: `HomePage.vue` lines ~146–201 (template), ~440–475 (ticker CSS)

- Remove `hero-ticker` scrolling ticker from between logo and `<h1>`
- Replace with a static "SI unit pills" strip *below* the CTAs:
  ```
  m · kg · s · A · K · mol · cd · N · J · W · Pa · Hz · V · Ω
  ```
  Rendered as small inline `<code>` chips, horizontally centered, subtle opacity (0.5), no animation. This communicates "we deal with scientific units" without breaking flow.

### Step 2: Reduce CTAs to 2

**File**: `HomePage.vue` lines ~193–200

Replace:
```html
<a href="/unitsdb/" class="btn btn-brand">Explore UnitsDB</a>
<a href="/schemas.html" class="btn btn-teal">View Schemas</a>
<a href="/learn/what-is-unitsml.html" class="btn btn-outline">Learn about UnitsML</a>
```

With:
```html
<a href="/learn/what-is-unitsml.html" class="btn btn-brand">
  Learn about UnitsML
  <svg arrow icon />
</a>
<a href="/unitsdb/" class="btn btn-teal">Explore UnitsDB</a>
```

Rationale: First-time visitors need context before they explore a database. "Learn about UnitsML" is the natural first step; "Explore UnitsDB" is the secondary action for returning users or the curious. "View Schemas" is reachable from Learn dropdown and from the Schema Browser CTA at the bottom.

### Step 3: Replace floating shapes with domain-specific ambient decoration

**File**: `HomePage.vue` lines ~107–114 (shapes data), ~477–502 (shapes CSS)

Replace the 6 generic geometric shapes with 7 subtle SI base quantity symbols floating at low opacity:

```
L  M  T  I  Θ  N  J
```

These are the actual dimensional symbols (Length, Mass, Time, Electric current, Temperature, Amount, Luminous intensity) — they're meaningful to the domain and signal "this is about scientific dimensions" even before the user reads a single word.

- Render as large, thin, serif text (font: Georgia or similar, weight 300, size ~40px)
- Very low opacity (0.04–0.08)
- Gentle float animation (existing `float` keyframes, slower — 8–12s)
- No border, just text

### Step 4: Strengthen or remove grid background

**File**: `HomePage.vue` lines ~408–417

Option A (strengthen): Increase grid opacity from 0.04 → 0.06, add a subtle radial gradient overlay that creates a "blueprint paper" feel.

Option B (remove): Delete the grid entirely. The glow effects + dimensional symbols provide enough visual interest.

Recommendation: Option A — the grid subtly reinforces "precision/standards" messaging.

### Step 5: Add gradient text animation to headline accent

**File**: `HomePage.vue` or `custom.css`

Add a slow gradient shift on `.home-hero h1 .accent`:

```css
.home-hero h1 .accent {
  background: linear-gradient(135deg, var(--unitsml-navy) 0%, var(--unitsml-teal-dark) 50%, var(--unitsml-blue) 100%);
  background-size: 200% 200%;
  animation: gradient-shift 8s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

This adds a subtle, living quality to the hero without being distracting. The gradient shifts between navy → teal → blue, reinforcing the brand palette.

## Files Modified

| File | Change |
|------|--------|
| `HomePage.vue` | Remove ticker, add static pills, reduce CTAs, replace shapes with dimensional symbols |
| `custom.css` | Add `gradient-shift` keyframe animation for hero accent text |

## Verification

1. Hero loads cleanly: logo → headline (with animated gradient accent) → tagline → 2 CTAs → unit pills
2. No scrolling animation above the fold
3. Floating dimensional symbols visible at very low opacity
4. Both CTAs are clearly differentiated (brand primary + teal secondary)
5. Mobile: unit pills wrap, CTAs stack vertically (already handled)
