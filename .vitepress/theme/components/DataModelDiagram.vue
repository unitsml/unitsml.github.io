<script setup lang="ts">
import { ref } from 'vue'

interface ModelBox {
  id: string
  label: string
  sublabel: string
  items: string[]
  x: number
  y: number
  color: string
  textColor: string
}

const boxes: ModelBox[] = [
  {
    id: 'unit',
    label: 'UnitSet',
    sublabel: 'Units of measure',
    items: ['metre, kilogram, second…', 'pascal, newton, joule…', 'inch, foot, pound…'],
    x: 20, y: 60, color: '#2d2c69', textColor: '#fff',
  },
  {
    id: 'quantity',
    label: 'QuantitySet',
    sublabel: 'Measurable properties',
    items: ['length, mass, time…', 'force, pressure, energy…'],
    x: 300, y: 20, color: '#14b8a6', textColor: '#fff',
  },
  {
    id: 'dimension',
    label: 'DimensionSet',
    sublabel: 'SI base dimensions',
    items: ['L (length)', 'M (mass)', 'T (time)…', '7 base quantities'],
    x: 300, y: 200, color: '#57a0fe', textColor: '#fff',
  },
  {
    id: 'prefix',
    label: 'PrefixSet',
    sublabel: 'SI & binary prefixes',
    items: ['kilo (10³), milli (10⁻³)', 'mebi (2²⁰), gibi (2³⁰)'],
    x: 20, y: 280, color: '#8b5cf6', textColor: '#fff',
  },
  {
    id: 'counted',
    label: 'CountedItemSet',
    sublabel: 'Counted things',
    items: ['electron, particle…', 'combined with units'],
    x: 20, y: 180, color: '#6b7280', textColor: '#fff',
  },
]

const connections = [
  { from: 'unit', to: 'quantity', label: 'has', fromSide: 'right', toSide: 'left' },
  { from: 'unit', to: 'dimension', label: 'has', fromSide: 'right', toSide: 'left' },
  { from: 'unit', to: 'prefix', label: 'uses', fromSide: 'bottom', toSide: 'left' },
  { from: 'quantity', to: 'dimension', label: 'has', fromSide: 'bottom', toSide: 'top' },
  { from: 'unit', to: 'counted', label: 'combines with', fromSide: 'bottom', toSide: 'right' },
]

const hoveredBox = ref<string | null>(null)
</script>

<template>
  <div class="model-diagram">
    <svg viewBox="0 0 580 380" xmlns="http://www.w3.org/2000/svg" class="model-svg" role="img" aria-label="UnitsML data model showing five interconnected containers">
      <defs>
        <marker id="dm-arrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill="#6b7280" opacity="0.5"/>
        </marker>
        <marker id="dm-arrow-active" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill="#2d2c69" opacity="0.8"/>
        </marker>
        <filter id="dm-shadow" x="-5%" y="-5%" width="110%" height="115%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.06"/>
        </filter>
      </defs>

      <!-- Unit → Quantity -->
      <line x1="260" y1="100" x2="298" y2="80" stroke="#6b7280" stroke-width="1.2" stroke-dasharray="4,3" marker-end="url(#dm-arrow)" opacity="0.4"/>
      <text x="275" y="82" text-anchor="middle" font-size="7.5" fill="#6b7280" font-family="Inter, sans-serif" opacity="0.7">has</text>

      <!-- Unit → Dimension -->
      <line x1="260" y1="140" x2="298" y2="240" stroke="#6b7280" stroke-width="1.2" stroke-dasharray="4,3" marker-end="url(#dm-arrow)" opacity="0.4"/>
      <text x="270" y="195" text-anchor="middle" font-size="7.5" fill="#6b7280" font-family="Inter, sans-serif" opacity="0.7" transform="rotate(60, 270, 195)">has</text>

      <!-- Quantity → Dimension -->
      <line x1="440" y1="130" x2="440" y2="198" stroke="#6b7280" stroke-width="1.2" stroke-dasharray="4,3" marker-end="url(#dm-arrow)" opacity="0.4"/>
      <text x="455" y="168" font-size="7.5" fill="#6b7280" font-family="Inter, sans-serif" opacity="0.7">has</text>

      <!-- Unit → Prefix -->
      <path d="M 140 170 Q 90 240 120 298" fill="none" stroke="#6b7280" stroke-width="1.2" stroke-dasharray="4,3" marker-end="url(#dm-arrow)" opacity="0.4"/>
      <text x="82" y="245" font-size="7.5" fill="#6b7280" font-family="Inter, sans-serif" opacity="0.7" transform="rotate(-60, 82, 245)">uses</text>

      <!-- Unit → CountedItem -->
      <line x1="140" y1="170" x2="120" y2="198" stroke="#6b7280" stroke-width="1.2" stroke-dasharray="4,3" marker-end="url(#dm-arrow)" opacity="0.3"/>
      <text x="108" y="190" font-size="7" fill="#6b7280" font-family="Inter, sans-serif" opacity="0.6">combines</text>

      <!-- Boxes -->
      <g v-for="box in boxes" :key="box.id"
        @mouseenter="hoveredBox = box.id"
        @mouseleave="hoveredBox = null"
      >
        <rect
          :x="box.x" :y="box.y"
          width="240" height="110" rx="10"
          :fill="box.color"
          :opacity="hoveredBox && hoveredBox !== box.id ? 0.4 : 1"
          filter="url(#dm-shadow)"
          style="transition: opacity 0.3s ease"
        />
        <text
          :x="box.x + 16" :y="box.y + 24"
          :fill="box.textColor" font-weight="700" font-size="14"
          font-family="Inter, sans-serif" :opacity="hoveredBox && hoveredBox !== box.id ? 0.5 : 0.95"
          style="transition: opacity 0.3s ease"
        >{{ box.label }}</text>
        <text
          :x="box.x + 16" :y="box.y + 40"
          :fill="box.textColor" font-size="10"
          font-family="Inter, sans-serif" :opacity="hoveredBox && hoveredBox !== box.id ? 0.3 : 0.6"
          style="transition: opacity 0.3s ease"
        >{{ box.sublabel }}</text>
        <text
          v-for="(item, i) in box.items"
          :key="i"
          :x="box.x + 20" :y="box.y + 60 + i * 14"
          :fill="box.textColor" font-size="9"
          font-family="Inter, sans-serif" :opacity="hoveredBox && hoveredBox !== box.id ? 0.25 : 0.5"
          style="transition: opacity 0.3s ease"
        >• {{ item }}</text>
      </g>
    </svg>

    <div class="diagram-caption">
      The five containers in the UnitsML data model. <strong>Unit</strong> is the central element — it links to quantities, dimensions, and prefixes. All containers are optional and modular.
    </div>
  </div>
</template>

<style scoped>
.model-diagram {
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
}

.model-svg {
  width: 100%;
  height: auto;
  max-width: 580px;
  margin: 0 auto;
  display: block;
}

.diagram-caption {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  text-align: center;
}

@media (max-width: 640px) {
  .model-diagram {
    padding: 1rem;
  }
}
</style>
