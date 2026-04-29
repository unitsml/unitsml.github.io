<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
const el = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | undefined

onMounted(() => {
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) visible.value = true
  }, { threshold: 0.2 })
  if (el.value) observer.observe(el.value)
})

onUnmounted(() => observer?.disconnect())

const rootUnits = [
  {
    type: 'unit',
    id: 'NISTu1',
    name: 'meter',
    symbol: 'm',
    power: -1,
    prefix: null,
  },
  {
    type: 'unit',
    id: 'NISTu8',
    name: 'gram',
    symbol: 'g',
    power: 1,
    prefix: { id: 'NISTp10_', name: 'kilo', symbol: 'k', base: 10, power: 3 },
  },
  {
    type: 'unit',
    id: 'NISTu5',
    name: 'second',
    symbol: 's',
    power: -2,
    prefix: null,
  },
]

function powerDisplay(p: number): string {
  const sup: Record<number, string> = {
    '-3': '⁻³', '-2': '⁻²', '-1': '⁻¹', '0': '⁰',
    '1': '¹', '2': '²', '3': '³',
  }
  return sup[String(p)] || String(p)
}
</script>

<template>
  <div ref="el" class="composite-viz" :class="{ visible }">
    <div class="composite-header">
      <div class="composite-title">
        <span class="title-label">Composite unit example:</span>
        <strong class="title-name">kilopascal</strong>
        <code class="title-symbol">kPa</code>
      </div>
      <div class="composite-dimension">
        dimension: L⁻¹·M·T⁻²
      </div>
    </div>

    <!-- Root unit cards -->
    <div class="parts-row">
      <template v-for="(ru, i) in rootUnits" :key="i">
        <div v-if="i > 0" class="multiply">×</div>
        <div class="part-card" :style="{ '--i': i }">
          <div class="part-badge" :class="{ 'has-prefix': ru.prefix }">
            <span v-if="ru.prefix" class="badge-prefix">Prefix + Unit</span>
            <span v-else>Unit</span>
          </div>
          <div class="part-body">
            <div class="part-symbol">
              <span v-if="ru.prefix" class="prefix-sym">{{ ru.prefix.symbol }}</span>{{ ru.symbol }}<sup class="part-power">{{ powerDisplay(ru.power) }}</sup>
            </div>
            <div class="part-name">
              <span v-if="ru.prefix">{{ ru.prefix.name }}·</span>{{ ru.name }}
            </div>
            <div class="part-meta">
              <code>{{ ru.id }}</code>
              <span v-if="ru.prefix" class="prefix-ref">+ <code>{{ ru.prefix.id }}</code> (10{{ powerDisplay(ru.prefix.power) }})</span>
            </div>
            <div class="part-power-label">power: {{ ru.power }}</div>
          </div>
        </div>
      </template>
    </div>

    <!-- Formula result -->
    <div class="composite-result">
      <span class="result-label">Result:</span>
      <code class="result-formula">10³ · m⁻¹ · kg · s⁻²</code>
      <span class="result-eq">=</span>
      <strong class="result-value">kPa</strong>
    </div>
  </div>
</template>

<style scoped>
.composite-viz {
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
}

/* ── Header ── */

.composite-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.title-label {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  margin-right: 0.375rem;
}

.title-name {
  font-size: 1rem;
  color: var(--vp-c-text-1);
}

.title-symbol {
  font-size: 0.8rem;
  background: var(--vp-c-default-soft);
  padding: 0.1em 0.4em;
  border-radius: 3px;
  margin-left: 0.375rem;
}

.composite-dimension {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  font-family: 'JetBrains Mono', 'SF Mono', monospace;
}

/* ── Parts row ── */

.parts-row {
  display: flex;
  align-items: stretch;
  gap: 0;
  flex-wrap: wrap;
  justify-content: center;
}

.multiply {
  display: flex;
  align-items: center;
  padding: 0 0.375rem;
  color: var(--vp-c-text-3);
  font-size: 1.125rem;
  font-weight: 300;
  opacity: 0.5;
}

.part-card {
  flex: 0 1 auto;
  min-width: 130px;
  max-width: 180px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.4s ease, transform 0.4s ease;
  transition-delay: calc(var(--i) * 0.1s);
}

.visible .part-card {
  opacity: 1;
  transform: translateY(0);
}

.part-badge {
  padding: 0.25rem 0.5rem;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #fff;
  background: var(--unitsml-navy);
}

.part-badge.has-prefix {
  background: linear-gradient(90deg, #8b5cf6, var(--unitsml-navy));
}

.part-body {
  padding: 0.5rem 0.625rem 0.625rem;
}

.part-symbol {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  font-family: 'JetBrains Mono', 'SF Mono', monospace;
  line-height: 1.3;
}

.prefix-sym {
  color: #8b5cf6;
}

.part-power {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
}

.part-name {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  margin-top: 0.125rem;
}

.part-meta {
  margin-top: 0.375rem;
  font-size: 0.65rem;
  color: var(--vp-c-text-3);
}

.part-meta code {
  font-size: 0.625rem;
  background: var(--vp-c-default-soft);
  padding: 0.05em 0.25em;
  border-radius: 2px;
}

.prefix-ref {
  font-size: 0.6rem;
}

.prefix-ref code {
  color: #8b5cf6;
}

.part-power-label {
  margin-top: 0.25rem;
  font-size: 0.65rem;
  font-family: 'JetBrains Mono', 'SF Mono', monospace;
  color: var(--vp-c-text-3);
  opacity: 0.7;
}

/* ── Result ── */

.composite-result {
  margin-top: 1.25rem;
  padding-top: 0.875rem;
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.result-label {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 600;
}

.result-formula {
  font-size: 0.8125rem;
  background: var(--vp-c-default-soft);
  padding: 0.1em 0.5em;
  border-radius: 3px;
}

.result-eq {
  color: var(--vp-c-text-3);
  font-size: 0.9rem;
}

.result-value {
  font-size: 1rem;
  color: var(--unitsml-navy);
}

@media (max-width: 640px) {
  .composite-viz {
    padding: 1rem;
  }

  .parts-row {
    flex-direction: column;
    align-items: center;
  }

  .multiply {
    transform: rotate(90deg);
    padding: 0.25rem 0;
  }

  .part-card {
    max-width: 100%;
    min-width: 200px;
  }
}
</style>
