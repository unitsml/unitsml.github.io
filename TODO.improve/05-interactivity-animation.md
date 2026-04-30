# 05 — Interactivity & Animation

## Problem

The site has some animation but lacks consistency. Steps swap without transitions, ecosystem diagram has no pointer feedback, and content pages feel static. Motion should guide attention, not decorate.

## Plan

### Step 1: Fade transition on How It Works code panel

**File**: `HomePage.vue`

The step code panel swaps instantly when tabs change. Add a Vue `<Transition>` with a 200ms fade:

```html
<Transition name="step-fade" mode="out-in">
  <div class="step-code" :key="activeStep">
    <div class="code-header">...</div>
    <pre><code><span v-html="steps[activeStep].code"></span></code></pre>
  </div>
</Transition>
```

```css
.step-fade-enter-active,
.step-fade-leave-active { transition: opacity 0.2s ease; }
.step-fade-enter-from,
.step-fade-leave-to { opacity: 0; }
```

Also animate the tab indicator — the large step number text should have a subtle scale pulse when selected:
```css
.step-tab.active .step-tab-num {
  animation: step-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes step-pop {
  0% { transform: scale(0.9); }
  100% { transform: scale(1); }
}
```

### Step 2: EcosystemDiagram pointer cursor + tooltip

**File**: `EcosystemDiagram.vue`

1. Add `cursor: pointer` to clickable nodes:

In the SVG node rendering, add a conditional class:
```html
<g class="node" :class="{ clickable: node.link }"
   @click="navigate(node)"
   @mouseenter="hoveredNode = node.id"
   @mouseleave="hoveredNode = null">
```

```css
.node.clickable { cursor: pointer; }
```

2. Add a tooltip on hover showing the description:

```html
<g v-if="hoveredNode === node.id" class="node-tooltip">
  <rect :x="node.x + 60" :y="node.y - 10" width="120" height="40" rx="4" />
  <text :x="node.x + 120" :y="node.y + 5" text-anchor="middle">{{ node.desc }}</text>
</g>
```

Style the tooltip rect with a subtle shadow and the text with small font.

### Step 3: Scroll-reveal on content pages

**File**: `custom.css`

Add a universal scroll-reveal animation class that can be applied to sections on content pages:

```css
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

Then add an IntersectionObserver in a `NavScrollHandler.vue` or directly in the VitePress theme's `index.ts` that activates `.reveal` elements as they enter the viewport.

### Step 4: Stat cards — add a subtle pulse on hover

**File**: `custom.css`

The stat cards already animate in. Add a hover state:
```css
.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(45, 44, 105, 0.12);
}
```

The card already has `transition: all 0.4s ease;` so this works without adding a new transition.

### Step 5: Ecosystem diagram — animate connection lines on hover

**File**: `EcosystemDiagram.vue`

The connection paths already use SVG stroke-dasharray. Animate the stroke when a node is hovered:

```css
.connection path {
  stroke-dasharray: 6;
  animation: dash-flow 1s linear infinite;
  animation-play-state: paused;
}
.connection.active path {
  animation-play-state: running;
}
```

When `hoveredNode` is set, mark connected paths as active:
```ts
function isPathActive(from: string, to: string): boolean {
  return !!(hoveredNode.value && (hoveredNode.value === from || hoveredNode.value === to))
}
```

### Step 6: Code blocks — add copy button

**File**: VitePress handles this via its built-in `:construct` code blocks. But custom code blocks in Vue templates (like the How It Works step panel) need a copy button added manually.

In the step code panel header:
```html
<button class="code-copy" @click="copyCode" :class="{ copied }">
  {{ copied ? 'Copied!' : 'Copy' }}
</button>
```

```ts
const copied = ref(false)
function copyCode() {
  navigator.clipboard.writeText(steps[activeStep].code.replace(/<[^>]+>/g, ''))
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
```

## Files Modified

| File | Change |
|------|--------|
| `HomePage.vue` | Step code fade transition, step number pop animation, copy button |
| `EcosystemDiagram.vue` | Pointer cursor, tooltip, animated connection paths |
| `custom.css` | Scroll-reveal class, stat card hover lift |
| `index.ts` (theme) | Global scroll-reveal observer |

## Verification

1. Step code panel fades between tabs
2. Clickable diagram nodes show pointer cursor and tooltip on hover
3. Connection lines animate when node is hovered
4. Content page sections fade in on scroll
5. Copy button on code panel works
6. All animations respect `prefers-reduced-motion`
