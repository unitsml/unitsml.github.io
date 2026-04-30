# 02 — Homepage Section Reduction

## Problem

The homepage has 8 sections, which creates scroll fatigue and buries important content. Users arriving at the homepage need a concise narrative arc, not an encyclopedic tour.

### Current sections (in order)

1. Hero (logo, ticker, headline, tagline, 3 CTAs)
2. Stats (4 animated counter cards)
3. UnitsDB CTA (dark card with preview window)
4. Ecosystem Diagram (interactive SVG)
5. How UnitsML Works (3-step tabbed interface)
6. Software (project cards — currently only unitsml-ruby)
7. Why UnitsML? (4 feature cards)
8. Schema Browser CTA (dark card linking to schema.unitsml.org)

### Issues

1. **Stats (#2) and UnitsDB CTA (#3) are redundant** — both prominently display unit counts (380+, 199, 92, etc.). The stats section exists only to show animated counters; the UnitsDB CTA already communicates the same information with more context.

2. **Software (#6) is anticlimactic** — showing a single card ("unitsml-ruby") in a dedicated "Software" section feels thin. This belongs on `/software/`.

3. **Why UnitsML? (#7) duplicates learn content** — the 4 feature cards restate content from `/learn/what-is-unitsml`. Homepage visitors don't need to read the same arguments twice.

4. **Schema Browser CTA (#8) is heavyweight for an external link** — the full-width dark card is visually on par with the UnitsDB CTA (#3), but it just links to schema.unitsml.org. It should be lighter.

5. **No clear narrative arc** — the sections don't build on each other. It reads like a collection of promotional blocks, not a guided story.

## Plan

### Target: 5 sections

1. **Hero** (cleaned up per TODO 01)
2. **UnitsDB CTA** (absorbs stats data)
3. **Ecosystem Diagram**
4. **How UnitsML Works**
5. **Closing CTA strip** (replaces Software, Why UnitsML, and Schema Browser)

### Step 1: Remove Stats section, absorb into UnitsDB CTA

**File**: `HomePage.vue`

- Delete the entire `<!-- STATS -->` section (lines ~206–221) and its CSS
- Remove `statsRef`, `statsVisible`, `displayValues`, `animateCounters`, `statsObserver` from script
- The UnitsDB CTA already has `cta-types` chips showing counts (380 Units, 199 Quantities, 92 Dimensions, 33 Prefixes, 7 Systems). No data loss.

### Step 2: Remove Software section

**File**: `HomePage.vue`

- Delete the `<!-- SOFTWARE -->` section (lines ~313–335)
- Remove `projects` import
- Software lives at `/software/` — accessible from nav bar. Homepage doesn't need to repeat it.

### Step 3: Remove Why UnitsML section

**File**: `HomePage.vue`

- Delete the `<!-- WHY UNITSML -->` section (lines ~340–376)
- The 4 feature card arguments (Unambiguous Encoding, Composable, SI & Non-SI, Standards-Based) are already in `/learn/what-is-unitsml.html`

### Step 4: Replace Schema Browser CTA with a compact closing CTA strip

**File**: `HomePage.vue`

Replace the full-width dark `schema-card` (lines ~381–403) with a lightweight 3-column CTA strip:

```
┌─────────────────┬─────────────────┬─────────────────┐
│  📄 Schemas      │  💎 Software     │  📖 Learn       │
│  Browse XML &    │  unitsml-ruby   │  What is UnitsML│
│  YAML schemas    │  and more       │  and more       │
│  [Open →]        │  [View →]       │  [Read →]       │
└─────────────────┴─────────────────┴─────────────────┘
```

- Light background (`var(--vp-c-bg-soft)`)
- 1px border, rounded corners
- Each column: icon + title + 1-line description + text link
- Columns link to: `/schemas.html`, `/software/`, `/learn/what-is-unitsml.html`
- This gives visitors 3 clear next steps at the bottom without heavy visual weight

### Step 5: Adjust section spacing

With fewer sections, increase spacing between remaining sections for breathing room:

- Change `.section { margin: 5rem 0; }` → `.section { margin: 6rem 0; }` in `custom.css`
- The homepage should feel spacious, not cramped

## Resulting homepage structure

```
┌─────────────────────────────────────┐
│  HERO                               │  ← Cleaned per TODO 01
│  Logo + headline + tagline + 2 CTAs │
│  Static unit pills strip            │
├─────────────────────────────────────┤
│  UNITSDB CTA                        │  ← Dark card with preview
│  380+ units, 199 quantities...      │     (stats absorbed here)
├─────────────────────────────────────┤
│  ECOSYSTEM DIAGRAM                  │  ← Unchanged
├─────────────────────────────────────┤
│  HOW UNITSML WORKS                  │  ← Unchanged (3-step tabs)
├─────────────────────────────────────┤
│  CTA STRIP                          │  ← NEW: Schemas | Software | Learn
└─────────────────────────────────────┘
```

## Files Modified

| File | Change |
|------|--------|
| `HomePage.vue` | Remove Stats, Software, Why UnitsML, Schema Browser sections; add CTA strip |
| `custom.css` | Adjust section spacing |

## Verification

1. Homepage has exactly 5 distinct sections
2. No duplicate information (stats vs UnitsDB counts)
3. Scroll depth is manageable (~3 viewport heights total)
4. Every section serves a distinct purpose in the narrative arc
5. CTA strip provides 3 clear navigation paths
6. Mobile: CTA strip stacks vertically
