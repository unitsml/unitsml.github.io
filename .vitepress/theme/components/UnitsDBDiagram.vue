<script setup lang="ts">
import { ref, computed } from 'vue'

type FType = 'arr' | 'ref' | 'bool' | 'int' | 'str' | 'enum'

interface Field {
  name: string
  type: FType
  required: boolean
  note?: string
  targets?: string[]
}

interface Entity {
  id: string
  label: string
  schema: string
  color: string
  desc: string
  example: string
  fields: Field[]
}

const entities: Entity[] = [
  {
    id: 'unit',
    label: 'Unit',
    schema: 'units-schema.yaml',
    color: '#2d2c69',
    desc: 'Measurement units — SI base, derived, and non-SI',
    example: 'NISTu1 · metre (m)',
    fields: [
      { name: 'identifiers[]', type: 'arr', required: true, note: 'nist · unitsml · ucum · si-df' },
      { name: 'names[]', type: 'arr', required: true, note: 'multilingual' },
      { name: 'symbols[]', type: 'arr', required: true, note: '6 formats' },
      { name: 'scale_reference', type: 'ref', required: true, targets: ['scale'] },
      { name: 'unit_system_reference[]', type: 'ref', required: true, targets: ['unit_system'] },
      { name: 'root', type: 'bool', required: true },
      { name: 'short', type: 'str', required: true },
      { name: 'root_units[]', type: 'ref', required: false, targets: ['unit', 'prefix'], note: 'derived only' },
      { name: 'quantity_reference', type: 'ref', required: false, targets: ['quantity'] },
      { name: 'references[]', type: 'arr', required: false, note: 'informative · normative' },
    ],
  },
  {
    id: 'quantity',
    label: 'Quantity',
    schema: 'quantities-schema.yaml',
    color: '#14b8a6',
    desc: 'Measurable properties',
    example: 'NISTq1 · length',
    fields: [
      { name: 'identifiers[]', type: 'arr', required: true },
      { name: 'names[]', type: 'arr', required: true },
      { name: 'dimension_reference', type: 'ref', required: true, targets: ['dimension'] },
      { name: 'quantity_type', type: 'enum', required: true, note: 'base | derived' },
      { name: 'short', type: 'str', required: true },
    ],
  },
  {
    id: 'dimension',
    label: 'Dimension',
    schema: 'dimensions-schema.yaml',
    color: '#57a0fe',
    desc: 'SI base quantity dimensional powers',
    example: 'NISTd1 · L¹',
    fields: [
      { name: 'identifiers[]', type: 'arr', required: true },
      { name: 'names[]', type: 'arr', required: true },
      { name: '8 components', type: 'arr', required: false, note: 'power + symbol each' },
      { name: 'dimensionless', type: 'bool', required: false },
    ],
  },
  {
    id: 'prefix',
    label: 'Prefix',
    schema: 'prefixes-schema.yaml',
    color: '#8b5cf6',
    desc: 'SI decimal/binary scaling factors',
    example: 'NISTp10_ · kilo (k, 10³)',
    fields: [
      { name: 'identifiers[]', type: 'arr', required: true },
      { name: 'names[]', type: 'arr', required: true },
      { name: 'symbols[]', type: 'arr', required: true, note: '6 formats' },
      { name: 'base', type: 'int', required: true, note: '10 | 2' },
      { name: 'power', type: 'int', required: true },
    ],
  },
  {
    id: 'scale',
    label: 'Scale',
    schema: 'scales-schema.yaml',
    color: '#f59e0b',
    desc: 'Measurement scale properties',
    example: 'continuous ratio',
    fields: [
      { name: 'identifiers[]', type: 'arr', required: true },
      { name: 'names[]', type: 'arr', required: true },
      { name: 'properties', type: 'arr', required: true, note: '5 boolean flags' },
    ],
  },
  {
    id: 'unit_system',
    label: 'Unit System',
    schema: 'unit_systems-schema.yaml',
    color: '#6b7280',
    desc: 'Systems of measurement',
    example: 'SI base units',
    fields: [
      { name: 'identifiers[]', type: 'arr', required: true },
      { name: 'names[]', type: 'arr', required: true },
      { name: 'base_units[]', type: 'ref', required: false, targets: ['unit', 'quantity'], note: 'unit + quantity refs' },
    ],
  },
]

const active = ref<string | null>(null)

function toggle(id: string) {
  active.value = active.value === id ? null : id
}

function clear() {
  active.value = null
}

function entityState(id: string): string {
  if (!active.value) return ''
  if (active.value === id) return 'active'
  const source = entities.find(e => e.id === active.value)!
  const target = entities.find(e => e.id === id)
  if (source.fields.some(f => f.targets?.includes(id))) return 'connected'
  if (target?.fields.some(f => f.targets?.includes(active.value!))) return 'connected'
  return 'dimmed'
}

function getEntity(id: string) {
  return entities.find(e => e.id === id)
}

const unit = computed(() => entities[0])
const others = computed(() => entities.slice(1))
</script>

<template>
  <div class="schema-explorer">
    <!-- Shared structures -->
    <div class="shared-bar">
      <div class="shared-col">
        <span class="shared-label">Shared across all entities</span>
        <div class="shared-chips">
          <span class="chip"><code>identifiers[]</code> { type, id }</span>
          <span class="chip"><code>names[]</code> { value, lang }</span>
          <span class="chip"><code>references[]</code> informative · normative</span>
        </div>
      </div>
      <div class="shared-sep"></div>
      <div class="shared-col">
        <span class="shared-label">Symbol formats (Unit, Prefix, Dimension)</span>
        <div class="shared-chips">
          <span class="fmt">LaTeX</span>
          <span class="fmt">Unicode</span>
          <span class="fmt">ASCII</span>
          <span class="fmt">HTML</span>
          <span class="fmt">MathML</span>
          <span class="fmt">id</span>
        </div>
      </div>
    </div>

    <!-- Central Unit card -->
    <div
      class="e-card e-card-unit"
      :class="entityState('unit')"
      @click.stop="toggle('unit')"
    >
      <div class="card-accent-bar" style="background: linear-gradient(90deg, #2d2c69, #14b8a6)"></div>
      <div class="card-body">
        <div class="unit-head">
          <div class="unit-head-left">
            <span class="entity-title" style="color: #2d2c69">Unit</span>
            <span class="central-tag">Central entity</span>
          </div>
          <div class="unit-head-right">
            <code class="schema-fn">{{ unit.schema }}</code>
            <span class="sep-dot">·</span>
            <span class="example-text">{{ unit.example }}</span>
          </div>
        </div>
        <p class="entity-desc">{{ unit.desc }}</p>
        <div class="unit-fields">
          <div
            v-for="field in unit.fields"
            :key="field.name"
            class="f-row"
            :class="{ 'f-ref': field.type === 'ref', 'f-opt': !field.required }"
          >
            <div class="f-left">
              <code class="f-name">{{ field.name }}</code>
              <span class="f-type" :class="'t-' + field.type">
                {{ field.type === 'arr' ? '[]' : field.type === 'ref' ? '→' : field.type === 'bool' ? 'T/F' : field.type === 'int' ? '#' : field.type === 'enum' ? '∈' : 'Aa' }}
              </span>
              <span class="f-dot" :class="{ required: field.required }"></span>
            </div>
            <div class="f-right">
              <span v-if="field.targets" class="f-targets">
                <span
                  v-for="tid in field.targets"
                  :key="tid"
                  class="f-target"
                  :style="{ '--tc': getEntity(tid)?.color }"
                >{{ getEntity(tid)?.label }}</span>
              </span>
              <span v-if="field.note" class="f-note">{{ field.note }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Other entities -->
    <div class="others-row">
      <div
        v-for="entity in others"
        :key="entity.id"
        class="e-card e-card-sm"
        :class="entityState(entity.id)"
        @click.stop="toggle(entity.id)"
      >
        <div class="card-accent-bar" :style="{ background: entity.color }"></div>
        <div class="card-body">
          <div class="sm-head">
            <span class="sm-title" :style="{ color: entity.color }">{{ entity.label }}</span>
            <code class="sm-schema">{{ entity.schema.replace('-schema.yaml', '') }}</code>
          </div>
          <span class="sm-example">{{ entity.example }}</span>
          <div class="sm-fields">
            <div
              v-for="field in entity.fields"
              :key="field.name"
              class="sf-row"
              :class="{ 'sf-ref': field.type === 'ref', 'sf-opt': !field.required }"
            >
              <code class="sf-name">{{ field.name }}</code>
              <span class="sf-type" :class="'t-' + field.type">
                {{ field.type === 'arr' ? '[]' : field.type === 'ref' ? '→' : field.type === 'bool' ? 'T/F' : field.type === 'int' ? '#' : field.type === 'enum' ? '∈' : 'Aa' }}
              </span>
              <span v-if="field.targets" class="sf-dots">
                <span
                  v-for="tid in field.targets"
                  :key="tid"
                  class="sf-dot"
                  :style="{ background: getEntity(tid)?.color }"
                ></span>
              </span>
              <span v-if="field.note" class="sf-note">{{ field.note }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Caption -->
    <div class="caption">
      Click any entity to highlight its relationships.
      <strong>Unit</strong> is the central entity — it references scales, unit systems, quantities, dimensions, and prefixes.
      Composite units are built through <code>root_units[]</code> with power exponents and optional prefix references.
    </div>
  </div>
</template>

<style scoped>
.schema-explorer {
  margin: 2rem 0;
}

/* ── Shared structures bar ── */

.shared-bar {
  display: flex;
  gap: 1.5rem;
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  flex-wrap: wrap;
}

.shared-col {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.shared-label {
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-3);
}

.shared-chips {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
  align-items: center;
}

.chip {
  font-size: 0.6875rem;
  font-family: inherit;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  color: var(--vp-c-text-2);
}

.chip code {
  font-size: 0.6875rem;
  color: var(--vp-c-text-1);
}

.fmt {
  font-size: 0.625rem;
  font-weight: 500;
  font-family: 'JetBrains Mono', 'SF Mono', monospace;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.shared-sep {
  width: 1px;
  align-self: stretch;
  background: var(--vp-c-divider);
}

/* ── Card base ── */

.e-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.e-card.active {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 20px rgba(45, 44, 105, 0.10);
  transform: translateY(-2px);
}

.e-card.connected {
  border-color: rgba(45, 44, 105, 0.2);
  background: rgba(45, 44, 105, 0.015);
}

.e-card.dimmed {
  opacity: 0.18;
  transform: scale(0.97);
  pointer-events: none;
}

.card-accent-bar {
  height: 3px;
}

.e-card-unit .card-accent-bar {
  height: 4px;
}

.card-body {
  padding: 0.875rem 1rem;
}

/* ── Unit card (central) ── */

.e-card-unit {
  margin-top: 1rem;
}

.unit-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.unit-head-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.entity-title {
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.central-tag {
  font-size: 0.5625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.15em 0.5em;
  border-radius: 4px;
  background: rgba(45, 44, 105, 0.08);
  color: var(--vp-c-text-2);
}

.unit-head-right {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
}

.schema-fn {
  font-size: 0.6875rem;
  color: var(--vp-c-text-3);
}

.sep-dot {
  color: var(--vp-c-divider);
  font-size: 0.75rem;
}

.example-text {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  font-style: italic;
}

.entity-desc {
  font-size: 0.8125rem;
  color: var(--vp-c-text-3);
  margin: 0.25rem 0 0.75rem;
  line-height: 1.5;
}

/* ── Unit field grid ── */

.unit-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 1.5rem;
}

.f-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.225rem 0;
}

.f-row.f-ref {
  padding-left: 0.375rem;
  background: rgba(20, 184, 166, 0.03);
  border-radius: 3px;
}

.f-row.f-opt {
  opacity: 0.65;
}

.f-left {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-shrink: 0;
}

.f-name {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

/* ── Type badges ── */

.f-type {
  font-size: 0.5625rem;
  font-weight: 600;
  padding: 0.05em 0.3em;
  border-radius: 3px;
  font-family: 'JetBrains Mono', 'SF Mono', monospace;
  line-height: 1;
}

.t-arr  { background: rgba(59, 130, 246, 0.12); color: #3b82f6; }
.t-ref  { background: rgba(20, 184, 166, 0.12); color: #14b8a6; }
.t-bool { background: rgba(245, 158, 11, 0.12); color: #f59e0b; }
.t-int  { background: rgba(139, 92, 246, 0.12); color: #8b5cf6; }
.t-str  { background: rgba(107, 114, 128, 0.12); color: #6b7280; }
.t-enum { background: rgba(236, 72, 153, 0.12); color: #ec4899; }

html.dark .t-arr  { color: #60a5fa; }
html.dark .t-ref  { color: #2dd4bf; }
html.dark .t-bool { color: #fbbf24; }
html.dark .t-int  { color: #a78bfa; }
html.dark .t-str  { color: #9ca3af; }
html.dark .t-enum { color: #f472b6; }

/* ── Required dot ── */

.f-dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  border: 1.5px solid var(--vp-c-text-3);
}

.f-dot.required {
  background: var(--vp-c-text-3);
  border-color: var(--vp-c-text-3);
}

/* ── Field right side (targets + notes) ── */

.f-right {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  justify-content: flex-end;
}

.f-targets {
  display: flex;
  gap: 0.25rem;
}

.f-target {
  font-size: 0.625rem;
  font-weight: 500;
  padding: 0.1em 0.4em;
  border-radius: 3px;
  border-left: 2px solid var(--tc);
  color: var(--tc);
  background: var(--vp-c-bg-soft);
  white-space: nowrap;
}

.f-note {
  font-size: 0.6875rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}

/* ── Other entity cards ── */

.others-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.e-card-sm {
  flex: 1 1 calc(33.333% - 0.5rem);
  min-width: 180px;
}

.sm-head {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.125rem;
}

.sm-title {
  font-size: 0.875rem;
  font-weight: 700;
}

.sm-schema {
  font-size: 0.625rem;
  color: var(--vp-c-text-3);
}

.sm-example {
  font-size: 0.6875rem;
  color: var(--vp-c-text-3);
  font-style: italic;
}

.sm-fields {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.sf-row {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.1rem 0;
}

.sf-row.sf-ref {
  padding-left: 0.25rem;
  background: rgba(20, 184, 166, 0.03);
  border-radius: 2px;
}

.sf-row.sf-opt {
  opacity: 0.65;
}

.sf-name {
  font-size: 0.6875rem;
  color: var(--vp-c-text-2);
}

.sf-type {
  font-size: 0.5rem;
  font-weight: 600;
  padding: 0.05em 0.2em;
  border-radius: 2px;
  font-family: 'JetBrains Mono', 'SF Mono', monospace;
  line-height: 1;
}

.sf-dots {
  display: flex;
  gap: 0.125rem;
}

.sf-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.sf-note {
  font-size: 0.625rem;
  color: var(--vp-c-text-3);
  margin-left: auto;
  white-space: nowrap;
}

/* ── Caption ── */

.caption {
  margin-top: 1.25rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  text-align: center;
  line-height: 1.6;
}

.caption code {
  font-size: 0.8rem;
  background: var(--vp-c-default-soft);
  padding: 0.1em 0.4em;
  border-radius: 3px;
}

/* ── Responsive ── */

@media (max-width: 768px) {
  .unit-fields {
    grid-template-columns: 1fr;
  }

  .e-card-sm {
    flex: 1 1 calc(50% - 0.375rem);
  }

  .f-row {
    flex-wrap: wrap;
  }

  .f-right {
    justify-content: flex-start;
    padding-left: 0.375rem;
  }

  .f-note {
    white-space: normal;
  }
}

@media (max-width: 480px) {
  .e-card-sm {
    flex: 1 1 100%;
  }

  .shared-bar {
    flex-direction: column;
    gap: 0.75rem;
  }

  .shared-sep {
    width: 100%;
    height: 1px;
  }
}
</style>
