# 04 — UnitsDB Browser UX

## Problem

The UnitsDB browser is functional but lacks polish that would make it feel like a professional data explorer. Specific friction points: search has no affordances, table rows are informationally dense but visually flat, and the stats bar doesn't convey the richness of the dataset.

## Current State

- Top: stats bar showing entity type counts + search box
- Tabs: Units | Quantities | Dimensions | Prefixes | Scales | Systems
- Content: scrollable data tables with sortable-looking (but not sortable) columns
- Each row links to an entity detail page

## Plan

### Step 1: Search UX improvements

**File**: `UnitsDBBrowser.vue`

1. **Add a clear button** (×) inside the search input when it has a value:

```html
<div class="search-box">
  <svg search-icon />
  <input v-model="search" placeholder="Search units, quantities..." />
  <button v-if="search" class="search-clear" @click="search = ''">×</button>
</div>
```

```css
.search-clear {
  position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer;
  color: var(--vp-c-text-3); font-size: 1rem; padding: 0 4px;
}
.search-clear:hover { color: var(--vp-c-text-1); }
```

2. **Add keyboard shortcut hint** — show `⌘K` / `Ctrl+K` placeholder text:
   ```
   placeholder="Search units, quantities… (⌘K)"
   ```

3. **Add keyboard listener** — `Cmd/Ctrl+K` focuses the search box:
```ts
onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      searchInputRef.value?.focus()
    }
  })
})
```

### Step 2: Table row hover preview tooltip

**File**: `UnitsDBBrowser.vue`

On hover over a table row, show a subtle tooltip with the entity's dimension formula (for units) or description snippet:

```html
<tr v-for="item in filteredItems" :key="item.id" class="dtbl-row"
    :title="item.expression || item.description || ''">
```

This is a zero-JS enhancement — just the native `title` attribute. For richer tooltips, use the existing `.tooltip::after` CSS pattern from `custom.css`.

### Step 3: Inline dimension formula rendering in Units table

**File**: `UnitsDBBrowser.vue`

The units table currently shows: Symbol | Name | ID | Type

Add a "Dimension" column that shows the expression (e.g., `L·M·T⁻²`) inline. This is the most useful piece of information for units — it tells you at a glance what physical quantity the unit measures.

The expression data is already in the JSON (from `dimensions.json` via the dimension reference). Need to resolve the cross-reference at render time:

```ts
const dimensionMap = computed(() => {
  const dims = store.value.dimensions ?? []
  const map: Record<string, string> = {}
  for (const d of dims) map[d.id] = d.expression
  return map
})
```

Then in the units table template, add a column:
```html
<td class="dtbl-cell">{{ dimensionMap[item.dimension?.id] || '—' }}</td>
```

### Step 4: Visual differentiation for entity types

**File**: `UnitsDBBrowser.vue`

The 6 tab buttons look identical. Add a subtle color accent per type:
- Units: teal
- Quantities: blue
- Dimensions: navy
- Prefixes: purple
- Scales: orange
- Systems: gray

Apply via a class per tab:
```css
.tab-btn[data-type="units"] { --tab-accent: var(--unitsml-teal); }
.tab-btn[data-type="quantities"] { --tab-accent: var(--unitsml-blue); }
.tab-btn[data-type="dimensions"] { --tab-accent: var(--unitsml-navy); }
/* etc. */
.tab-btn.active { border-bottom-color: var(--tab-accent); color: var(--tab-accent); }
```

### Step 5: Results count indicator

**File**: `UnitsDBBrowser.vue`

Show "Showing X of Y units" below the search box when a search is active:
```html
<div v-if="search" class="search-results-count">
  Showing {{ filteredItems.length }} of {{ items.length }} {{ tabLabel }}
</div>
```

```css
.search-results-count {
  font-size: 0.75rem; color: var(--vp-c-text-3);
  margin-top: 0.5rem; text-align: center;
}
```

### Step 6: Empty state for search

**File**: `UnitsDBBrowser.vue`

When search yields no results, show a friendly empty state:
```html
<div v-if="filteredItems.length === 0 && search" class="empty-state">
  <p>No {{ tabLabel.toLowerCase() }} matching "<strong>{{ search }}</strong>"</p>
  <button class="btn btn-outline" @click="search = ''">Clear search</button>
</div>
```

## Files Modified

| File | Change |
|------|--------|
| `UnitsDBBrowser.vue` | Search clear button, keyboard shortcut, dimension column, type colors, results count, empty state |

## Verification

1. `⌘K` / `Ctrl+K` focuses search
2. Search clear button appears when text is entered
3. Units table shows dimension expression column
4. Tab buttons have per-type color accents
5. "Showing X of Y" appears during search
6. Empty state shows when no results match
7. Mobile: all features work with touch
