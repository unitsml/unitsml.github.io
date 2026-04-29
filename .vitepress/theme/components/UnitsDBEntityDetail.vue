<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useData, useRoute } from 'vitepress'

const { page } = useData()
const route = useRoute()

type EType = 'units' | 'quantities' | 'dimensions' | 'prefixes' | 'scales' | 'systems'

const TYPE_FILE: Record<string, string> = {
  units: 'units', quantities: 'quantities', dimensions: 'dimensions',
  prefixes: 'prefixes', scales: 'scales', systems: 'unit_systems',
}

const URL_TYPE: Record<string, string> = {
  units: 'units', quantities: 'quantities', dimensions: 'dimensions',
  prefixes: 'prefixes', scales: 'scales', systems: 'systems',
}

const TYPE_LABEL: Record<string, string> = {
  units: 'Unit', quantities: 'Quantity', dimensions: 'Dimension',
  prefixes: 'Prefix', scales: 'Scale', systems: 'Unit System',
}

const TYPE_PLURAL: Record<string, string> = {
  units: 'Units', quantities: 'Quantities', dimensions: 'Dimensions',
  prefixes: 'Prefixes', scales: 'Scales', systems: 'Unit Systems',
}

const AUTHORITY_LABEL: Record<string, string> = {
  'si-digital-framework': 'BIPM SI Digital Framework',
  ucum: 'UCUM',
  qudt: 'QUDT',
  nist: 'NIST',
}

const AUTHORITY_ICON: Record<string, string> = {
  'si-digital-framework': 'ⓢ',
  ucum: 'ⓤ',
  qudt: 'ⓠ',
  nist: 'Ⓝ',
}

const DISPLAY_SYMBOLS = ['unicode']
const CODE_SYMBOLS = ['latex', 'ascii', 'id']

const loading = ref(true)
const entity = ref<any>(null)
const entityType = ref<string>('')
const slug = ref<string>('')
const showJson = ref(false)
const copied = ref(false)

// Full data store
const store = ref<Record<string, any[]>>({})
const idMap = ref<Record<string, Record<string, any>>>({}) // type → {id: entity}

function slugify(uid: string): string {
  return uid.replace(/[^a-zA-Z0-9._-]/g, '_')
}

function entityLink(type: string, uid: string): string {
  return `/unitsdb/${URL_TYPE[type]}/${slugify(uid)}`
}

// Resolve a cross-reference (which may only have id, not unitsml_id) to a URL
function refUrl(type: string, ref: any): string {
  if (!ref) return '#'
  if (ref.unitsml_id) return entityLink(type, ref.unitsml_id)
  const found = idMap.value[type]?.[ref.id]
  if (found?.unitsml_id) return entityLink(type, found.unitsml_id)
  return entityLink(type, ref.id)
}

function symbol(e: any): string {
  if (e.symbols?.unicode) return e.symbols.unicode
  if (e.symbols?.ascii) return e.symbols.ascii
  if (e.symbol) return e.symbol
  return ''
}

function altNames(e: any): { value: string; lang: string }[] {
  if (!e.names?.length) return []
  return e.names.filter((n: any) => n.value !== e.name)
}

function getDisplaySymbols(symbols: Record<string, string>) {
  return DISPLAY_SYMBOLS.filter(k => symbols[k]).map(k => ({ label: k, value: symbols[k] }))
}

function getCodeSymbols(symbols: Record<string, string>) {
  return CODE_SYMBOLS.filter(k => symbols[k]).map(k => ({ label: k, value: symbols[k] }))
}

function firstSym(item: any): string {
  return item.symbols?.unicode || item.symbols?.ascii || item.symbol || ''
}

// ── Computed reverse references ──

// Units belonging to a system
const systemUnits = computed(() => {
  const units = store.value.units
  if (!units?.length || !entity.value) return []
  const sysId = entity.value.id
  return units.filter((u: any) => u.systems?.some((s: any) => s.id === sysId))
    .map((u: any) => ({ id: u.id, unitsml_id: u.unitsml_id, name: u.name, symbol: firstSym(u) }))
})

// Units with a given dimension
const dimensionUnits = computed(() => {
  const units = store.value.units
  if (!units?.length || !entity.value) return []
  const dimId = entity.value.id
  return units.filter((u: any) => u.dimension?.id === dimId)
    .map((u: any) => ({ id: u.id, unitsml_id: u.unitsml_id, name: u.name, symbol: firstSym(u) }))
})

// Units using a given scale
const scaleUnits = computed(() => {
  const units = store.value.units
  if (!units?.length || !entity.value) return []
  const scaleId = entity.value.id
  return units.filter((u: any) => u.scale?.id === scaleId)
    .map((u: any) => ({ id: u.id, unitsml_id: u.unitsml_id, name: u.name, symbol: firstSym(u) }))
})

// Units using a given prefix (via root_units)
const prefixUnits = computed(() => {
  const units = store.value.units
  if (!units?.length || !entity.value) return []
  const prefixId = entity.value.id
  return units.filter((u: any) => u.root_units?.some((ru: any) =>
    ru.prefix?.id === prefixId || ru.prefix === entity.value.symbol
  )).map((u: any) => ({ id: u.id, unitsml_id: u.unitsml_id, name: u.name, symbol: firstSym(u) }))
})

// Dimensions that have quantities of a given type
// Quantities that reference a given dimension (beyond what the entity already has)
const dimensionQuantities = computed(() => {
  const quantities = store.value.quantities
  if (!quantities?.length || !entity.value) return []
  const dimId = entity.value.id
  // Quantities where dimension.id matches
  return quantities.filter((q: any) => q.dimension?.id === dimId)
    .map((q: any) => ({ id: q.id, unitsml_id: q.unitsml_id, name: q.name, type: q.type }))
})

// Units that measure a given quantity (reverse from quantity→units)
const quantityUnits = computed(() => {
  const units = store.value.units
  if (!units?.length || !entity.value) return []
  const qtyId = entity.value.id
  return units.filter((u: any) => u.quantities?.some((q: any) => q.id === qtyId))
    .map((u: any) => ({ id: u.id, unitsml_id: u.unitsml_id, name: u.name, symbol: firstSym(u) }))
})

async function loadAllData() {
  const types = Object.keys(TYPE_FILE)
  const results = await Promise.all(
    types.map(async (type) => {
      const fileKey = TYPE_FILE[type]
      try {
        const resp = await fetch(`/unitsdb/${fileKey}.json`)
        if (!resp.ok) return [type, []]
        return [type, await resp.json()]
      } catch { return [type, []] }
    })
  )
  const s: Record<string, any[]> = {}
  const m: Record<string, Record<string, any>> = {}
  for (const [type, items] of results) {
    s[type] = items as any[]
    m[type] = {}
    for (const item of items as any[]) {
      m[type][item.id] = item
    }
  }
  store.value = s
  idMap.value = m
}

async function loadEntity() {
  const params = (page.value as any).params
  if (!params?.type || !params?.id) {
    const parts = route.path.replace(/\.html$/, '').split('/').filter(Boolean)
    if (parts.length < 3 || parts[0] !== 'unitsdb') { loading.value = false; return }
    entityType.value = parts[1]
    slug.value = parts[2]
  } else {
    entityType.value = params.type
    slug.value = params.id
  }

  if (!TYPE_FILE[entityType.value]) { loading.value = false; return }

  await loadAllData()

  const items = store.value[entityType.value] ?? []
  entity.value = items.find((item: any) => {
    const itemSlug = slugify(item.unitsml_id)
    return itemSlug === slug.value
  })

  if (!entity.value) {
    // Try matching by NIST id slugified
    entity.value = items.find((item: any) => slugify(item.id) === slug.value)
  }
  if (!entity.value) {
    // Try matching by name with underscores replaced
    const nameMatch = slug.value.replace(/_/g, ' ')
    entity.value = items.find((item: any) => item.name === nameMatch)
  }

  loading.value = false
}

onMounted(loadEntity)
watch(() => route.path, loadEntity)

function formatFactor(factor: string): string {
  if (!factor) return ''
  return factor.replace(/\^(\d+)/g, '<sup>$1</sup>')
}

async function copyLink() {
  if (!entity.value) return
  try {
    await navigator.clipboard.writeText(`${location.origin}${route.path}`)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch {}
}
</script>

<template>
  <div class="ep">
    <nav class="ep-bc">
      <a href="/unitsdb/">UnitsDB</a>
      <span class="ep-bc-sep">›</span>
      <a :href="`/unitsdb/${entityType}`">{{ TYPE_PLURAL[entityType] || entityType }}</a>
      <span class="ep-bc-sep">›</span>
      <span class="ep-bc-current">{{ entity?.name || slug }}</span>
    </nav>

    <div v-if="loading" class="ep-loading">
      <div class="ep-spin"></div>
      <span>Loading…</span>
    </div>

    <div v-else-if="!entity" class="ep-empty">
      <h2>Entity not found</h2>
      <p>No {{ entityType }} matching "<code>{{ slug }}</code>" was found.</p>
      <a href="/unitsdb/" class="ep-btn-primary">Back to UnitsDB</a>
    </div>

    <template v-else>
      <!-- Compact header -->
      <div class="ep-header">
        <div class="ep-header-left">
          <div class="ep-header-row1">
            <span class="ep-badge">{{ TYPE_LABEL[entityType] }}</span>
            <span v-if="symbol(entity)" class="ep-sym-lg">{{ symbol(entity) }}</span>
            <h1 class="ep-name">{{ entity.name }}</h1>
          </div>
          <div v-if="altNames(entity).length" class="ep-i18n">
            <span v-for="n in altNames(entity)" :key="n.value + n.lang" class="ep-i18n-chip">{{ n.value }}<small>{{ n.lang }}</small></span>
          </div>
        </div>
        <button class="ep-copy-btn" @click="copyLink" :title="copied ? 'Copied!' : 'Copy page link'">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
          <span>{{ copied ? 'Copied!' : 'Copy link' }}</span>
        </button>
      </div>

      <div class="ep-body">
        <!-- Left column: identity -->
        <div class="ep-col-left">
          <!-- Identifiers -->
          <section class="ep-sec">
            <h3 class="ep-sec-title">Identifiers</h3>
            <div class="ep-id-table">
              <div class="ep-id-row">
                <span class="ep-id-type">unitsml</span>
                <code class="ep-id-val">{{ entity.unitsml_id }}</code>
              </div>
              <div class="ep-id-row">
                <span class="ep-id-type">nist</span>
                <code class="ep-id-val">{{ entity.id }}</code>
              </div>
              <div v-for="id in entity.identifiers?.filter((i: any) => i.type !== 'unitsml' && i.type !== 'nist') || []" :key="id.type + id.id" class="ep-id-row">
                <span class="ep-id-type">{{ id.type }}</span>
                <code class="ep-id-val">{{ id.id }}</code>
              </div>
            </div>
          </section>

          <!-- Symbol & Representations -->
          <section v-if="(entity.symbols && typeof entity.symbols === 'object') || (entity.symbol && typeof entity.symbol === 'string')" class="ep-sec">
            <h3 class="ep-sec-title">Symbol</h3>
            <div v-if="entity.symbols && typeof entity.symbols === 'object' && getDisplaySymbols(entity.symbols).length" class="ep-sym-display">
              <span v-for="s in getDisplaySymbols(entity.symbols)" :key="s.label" class="ep-sym-rendered">{{ s.value }}</span>
            </div>
            <div v-else-if="entity.symbol && typeof entity.symbol === 'string' && !entity.symbols" class="ep-sym-display">
              <span class="ep-sym-rendered">{{ entity.symbol }}</span>
            </div>
            <div v-if="entity.symbols && typeof entity.symbols === 'object' && getCodeSymbols(entity.symbols).length" class="ep-code-list">
              <div v-for="s in getCodeSymbols(entity.symbols)" :key="s.label" class="ep-code-row">
                <span class="ep-code-label">{{ s.label }}</span>
                <code class="ep-code-val">{{ s.value }}</code>
                <button class="ep-copy-sm" @click="navigator.clipboard.writeText(s.value)" title="Copy">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                </button>
              </div>
            </div>
          </section>

          <!-- Dimension expression -->
          <section v-if="entity.expression" class="ep-sec">
            <h3 class="ep-sec-title">Dimension</h3>
            <code class="ep-big-code">{{ entity.expression }}</code>
            <div v-if="entity.components?.length" class="ep-dim-bars">
              <div v-for="c in entity.components" :key="c.key" class="ep-dim-row">
                <span class="ep-dim-sym">{{ c.symbol }}</span>
                <div class="ep-dim-track">
                  <div class="ep-dim-fill" :style="{ width: Math.min(Math.abs(c.power) * 25, 100) + '%', background: c.power > 0 ? 'linear-gradient(90deg, #14b8a6, #57a0fe)' : '#f56c6c' }"></div>
                </div>
                <span class="ep-dim-pwr">{{ c.power > 0 ? '+' : '' }}{{ c.power }}</span>
                <span class="ep-dim-key">{{ c.key }}</span>
              </div>
            </div>
          </section>

          <!-- Root units -->
          <section v-if="entity.root_units?.length && entityType === 'units'" class="ep-sec">
            <h3 class="ep-sec-title">Root Units</h3>
            <div class="ep-formula">
              <template v-for="(ru, i) in entity.root_units" :key="i">
                <span v-if="i > 0" class="ep-formula-sep">·</span>
                <span class="ep-formula-unit">
                  <a :href="entityLink('units', ru.unit.id)" class="ep-ref-inline">
                    <span v-if="ru.prefix" class="ep-formula-prefix">{{ ru.prefix.symbol }}</span>{{ ru.unit.symbol }}
                  </a>
                  <sup v-if="ru.power && ru.power !== 1">{{ ru.power }}</sup>
                </span>
              </template>
            </div>
          </section>

          <!-- Description -->
          <section v-if="entity.description && (Array.isArray(entity.description) ? entity.description.length : entity.description)" class="ep-sec">
            <h3 class="ep-sec-title">Description</h3>
            <p class="ep-desc">{{ Array.isArray(entity.description) ? entity.description.join(' ') : entity.description }}</p>
          </section>
        </div>

        <!-- Right column: properties & relations -->
        <div class="ep-col-right">
          <!-- Properties grid (merged from all scalar fields) -->
          <section class="ep-sec">
            <h3 class="ep-sec-title">Properties</h3>
            <div class="ep-prop-grid">
              <div v-if="entity.root !== undefined" class="ep-prop-item" :class="{ 'ep-prop-on': entity.root }">
                <span class="ep-prop-k">Classification</span>
                <span class="ep-prop-v">{{ entity.root ? 'Base unit' : entity.composite ? 'Composite' : 'Derived' }}</span>
              </div>
              <div v-if="entity.type" class="ep-prop-item" :class="{ 'ep-prop-on': entity.type === 'base' }">
                <span class="ep-prop-k">Type</span>
                <span class="ep-prop-v">{{ entity.type }}</span>
              </div>
              <div v-if="entity.dimensionless !== undefined" class="ep-prop-item" :class="{ 'ep-prop-on': entity.dimensionless }">
                <span class="ep-prop-k">Dimensionless</span>
                <span class="ep-prop-v">{{ entity.dimensionless ? 'Yes' : 'No' }}</span>
              </div>
              <div v-if="entity.acceptable !== undefined && entityType === 'systems'" class="ep-prop-item" :class="{ 'ep-prop-on': entity.acceptable }">
                <span class="ep-prop-k">Acceptable</span>
                <span class="ep-prop-v">{{ entity.acceptable ? 'Yes' : 'No' }}</span>
              </div>
              <div v-if="entity.factor" class="ep-prop-item">
                <span class="ep-prop-k">Factor</span>
                <span class="ep-prop-v" v-html="formatFactor(entity.factor)"></span>
              </div>
              <div v-if="entity.value !== undefined && entityType === 'prefixes'" class="ep-prop-item">
                <span class="ep-prop-k">Value</span>
                <span class="ep-prop-v">{{ entity.value }}</span>
              </div>
              <div v-if="entity.base !== undefined && entityType === 'prefixes'" class="ep-prop-item">
                <span class="ep-prop-k">Base</span>
                <span class="ep-prop-v">{{ entity.base }}</span>
              </div>
              <div v-if="entity.power !== undefined && entityType === 'prefixes'" class="ep-prop-item">
                <span class="ep-prop-k">Power</span>
                <span class="ep-prop-v">{{ entity.power }}</span>
              </div>
              <div v-if="entity.short" class="ep-prop-item">
                <span class="ep-prop-k">Short</span>
                <span class="ep-prop-v"><code>{{ entity.short }}</code></span>
              </div>
              <div v-if="entity.unit_count !== undefined" class="ep-prop-item">
                <span class="ep-prop-k">Unit Count</span>
                <span class="ep-prop-v">{{ entity.unit_count }}</span>
              </div>
              <div v-if="entity.scale && entityType === 'units'" class="ep-prop-item ep-prop-on">
                <span class="ep-prop-k">Scale</span>
                <a :href="refUrl('scales', entity.scale)" class="ep-prop-v ep-prop-link">{{ entity.scale.name }}</a>
              </div>
              <div v-if="entity.dimension && (entityType === 'units' || entityType === 'quantities')" class="ep-prop-item ep-prop-on">
                <span class="ep-prop-k">Dimension</span>
                <a :href="refUrl('dimensions', entity.dimension)" class="ep-prop-v ep-prop-link">
                  <code>{{ entity.dimension.expression }}</code> {{ entity.dimension.name }}
                </a>
              </div>
              <!-- Scale properties -->
              <template v-if="entity.properties">
                <div v-for="(val, key) in entity.properties" :key="key" class="ep-prop-item" :class="{ 'ep-prop-on': val }">
                  <span class="ep-prop-k">{{ key }}</span>
                  <span class="ep-prop-v">{{ val ? '✓' : '—' }}</span>
                </div>
              </template>
            </div>
          </section>

          <!-- Cross-references: Systems -->
          <section v-if="entity.systems?.length && entityType === 'units'" class="ep-sec">
            <h3 class="ep-sec-title">Systems <span class="ep-count">{{ entity.systems.length }}</span></h3>
            <div class="ep-ref-list">
              <a v-for="s in entity.systems" :key="s.id" :href="refUrl('systems', s)" class="ep-ref-row">
                <span class="ep-ref-name">{{ s.name }}</span>
                <span v-if="s.short" class="ep-ref-sub">{{ s.short }}</span>
              </a>
            </div>
          </section>

          <!-- Cross-references: Quantities (forward) -->
          <section v-if="entity.quantities?.length && (entityType === 'units' || entityType === 'dimensions')" class="ep-sec">
            <h3 class="ep-sec-title">Quantities <span class="ep-count">{{ entity.quantities.length }}</span></h3>
            <div class="ep-ref-list">
              <a v-for="q in entity.quantities" :key="q.id" :href="refUrl('quantities', q)" class="ep-ref-row">
                <span class="ep-ref-name">{{ q.name }}</span>
                <span v-if="q.type" class="ep-ref-sub">{{ q.type }}</span>
              </a>
            </div>
          </section>

          <!-- Reverse: Units for quantity/dimension/system/scale/prefix -->
          <section v-if="entityType === 'quantities' && quantityUnits.length" class="ep-sec">
            <h3 class="ep-sec-title">Units <span class="ep-count">{{ quantityUnits.length }}</span></h3>
            <div class="ep-ref-list">
              <a v-for="u in quantityUnits" :key="u.id" :href="refUrl('units', u)" class="ep-ref-row">
                <code v-if="u.symbol" class="ep-ref-sym">{{ u.symbol }}</code>
                <span class="ep-ref-name">{{ u.name }}</span>
              </a>
            </div>
          </section>

          <section v-if="entityType === 'dimensions' && dimensionUnits.length" class="ep-sec">
            <h3 class="ep-sec-title">Units <span class="ep-count">{{ dimensionUnits.length }}</span></h3>
            <div class="ep-ref-list">
              <a v-for="u in dimensionUnits" :key="u.id" :href="refUrl('units', u)" class="ep-ref-row">
                <code v-if="u.symbol" class="ep-ref-sym">{{ u.symbol }}</code>
                <span class="ep-ref-name">{{ u.name }}</span>
              </a>
            </div>
          </section>

          <section v-if="entityType === 'dimensions' && dimensionQuantities.length" class="ep-sec">
            <h3 class="ep-sec-title">Quantities <span class="ep-count">{{ dimensionQuantities.length }}</span></h3>
            <div class="ep-ref-list">
              <a v-for="q in dimensionQuantities" :key="q.id" :href="refUrl('quantities', q)" class="ep-ref-row">
                <span class="ep-ref-name">{{ q.name }}</span>
                <span v-if="q.type" class="ep-ref-sub">{{ q.type }}</span>
              </a>
            </div>
          </section>

          <section v-if="entityType === 'systems' && systemUnits.length" class="ep-sec">
            <h3 class="ep-sec-title">Units <span class="ep-count">{{ systemUnits.length }}</span></h3>
            <div class="ep-ref-list">
              <a v-for="u in systemUnits" :key="u.id" :href="refUrl('units', u)" class="ep-ref-row">
                <code v-if="u.symbol" class="ep-ref-sym">{{ u.symbol }}</code>
                <span class="ep-ref-name">{{ u.name }}</span>
              </a>
            </div>
          </section>

          <section v-if="entityType === 'systems' && entity.base_units?.length" class="ep-sec">
            <h3 class="ep-sec-title">Base Units <span class="ep-count">{{ entity.base_units.length }}</span></h3>
            <div class="ep-ref-list">
              <a v-for="u in entity.base_units" :key="u.id" :href="refUrl('units', u)" class="ep-ref-row">
                <code v-if="u.symbol" class="ep-ref-sym">{{ u.symbol }}</code>
                <span class="ep-ref-name">{{ u.name }}</span>
              </a>
            </div>
          </section>

          <section v-if="entityType === 'scales' && scaleUnits.length" class="ep-sec">
            <h3 class="ep-sec-title">Units <span class="ep-count">{{ scaleUnits.length }}</span></h3>
            <div class="ep-ref-list">
              <a v-for="u in scaleUnits" :key="u.id" :href="refUrl('units', u)" class="ep-ref-row">
                <code v-if="u.symbol" class="ep-ref-sym">{{ u.symbol }}</code>
                <span class="ep-ref-name">{{ u.name }}</span>
              </a>
            </div>
          </section>

          <section v-if="entityType === 'prefixes' && prefixUnits.length" class="ep-sec">
            <h3 class="ep-sec-title">Prefixed Units <span class="ep-count">{{ prefixUnits.length }}</span></h3>
            <div class="ep-ref-list">
              <a v-for="u in prefixUnits" :key="u.id" :href="refUrl('units', u)" class="ep-ref-row">
                <code v-if="u.symbol" class="ep-ref-sym">{{ u.symbol }}</code>
                <span class="ep-ref-name">{{ u.name }}</span>
              </a>
            </div>
          </section>

          <!-- External References -->
          <section v-if="entity.references?.length" class="ep-sec">
            <h3 class="ep-sec-title">External References <span class="ep-count">{{ entity.references.length }}</span></h3>
            <div class="ep-ref-list">
              <a v-for="ref in entity.references" :key="ref.authority + ref.uri"
                :href="ref.uri.startsWith('http') ? ref.uri : undefined"
                target="_blank" rel="noopener"
                class="ep-ref-row ep-extref">
                <span class="ep-auth-badge" :class="'ep-auth-' + ref.authority">{{ AUTHORITY_ICON[ref.authority] || '◆' }}</span>
                <span class="ep-extref-body">
                  <span class="ep-auth-label">{{ AUTHORITY_LABEL[ref.authority] || ref.authority }}</span>
                  <code class="ep-extref-uri">{{ ref.uri }}</code>
                </span>
                <span class="ep-ref-sub">{{ ref.type }}</span>
              </a>
            </div>
          </section>

          <!-- Alternative names -->
          <section v-if="entity.names?.length > 1" class="ep-sec">
            <h3 class="ep-sec-title">Alternative Names</h3>
            <div class="ep-names-list">
              <span v-for="n in entity.names" :key="n.value + n.lang" class="ep-name-chip">
                {{ n.value }}<small>{{ n.lang }}</small>
              </span>
            </div>
          </section>
        </div>
      </div>

        <!-- Raw JSON toggle -->
        <div class="ep-json-area">
          <button class="ep-json-toggle" @click="showJson = !showJson">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            {{ showJson ? 'Hide' : 'View' }} Raw JSON
          </button>
          <div v-if="showJson" class="ep-json-view">
            <pre><code>{{ JSON.stringify(entity, null, 2) }}</code></pre>
          </div>
        </div>
    </template>
  </div>
</template>

<style scoped>
/* ── Mobile-first defaults ── */

.ep {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1rem 1rem 3rem;
  font-size: 0.9375rem;
  min-height: 70vh;
}

/* Breadcrumb */
.ep-bc {
  display: flex; align-items: center; gap: 0.4rem;
  font-size: 0.8125rem; margin-bottom: 1rem; color: var(--vp-c-text-3);
  overflow-x: auto; -webkit-overflow-scrolling: touch;
  white-space: nowrap;
}
.ep-bc a { color: var(--vp-c-text-3); text-decoration: none; }
.ep-bc a:hover { color: var(--vp-c-brand-1); }
.ep-bc-sep { color: var(--vp-c-divider); }
.ep-bc-current { color: var(--vp-c-text-1); font-weight: 500; }

/* Loading / Empty */
.ep-loading { display: flex; align-items: center; gap: 0.75rem; padding: 6rem 0; justify-content: center; color: var(--vp-c-text-3); }
.ep-spin { width: 20px; height: 20px; border: 2px solid var(--vp-c-divider); border-top-color: var(--vp-c-brand-1); border-radius: 50%; animation: spin 0.6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.ep-empty { text-align: center; padding: 5rem 0; }
.ep-empty h2 { margin-bottom: 0.5rem; }
.ep-empty p { color: var(--vp-c-text-2); margin-bottom: 1.5rem; }
.ep-btn-primary {
  display: inline-block; padding: 0.5rem 1.25rem; border-radius: 8px;
  background: var(--vp-c-brand-1); color: #fff; text-decoration: none;
  font-weight: 500; font-size: 0.875rem; transition: background 0.2s;
}
.ep-btn-primary:hover { background: var(--vp-c-brand-2); }

/* Header: stack vertically on mobile */
.ep-header {
  display: flex; flex-direction: column; gap: 0.75rem;
  margin-bottom: 1.25rem; padding-bottom: 1rem; border-bottom: 1px solid var(--vp-c-divider);
}
.ep-header-left { flex: 1; min-width: 0; }
.ep-header-row1 { display: flex; align-items: baseline; gap: 0.5rem; flex-wrap: wrap; }
.ep-badge {
  display: inline-block; padding: 0.125rem 0.5rem; border-radius: 4px;
  font-size: 0.625rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
  background: var(--vp-c-brand-1); color: #fff;
}
.ep-name {
  font-size: 1.25rem; font-weight: 800; letter-spacing: -0.02em;
  line-height: 1.2; margin: 0; color: var(--vp-c-text-1);
}
.ep-sym-lg { font-size: 1.5rem; font-weight: 300; color: var(--vp-c-text-3); font-family: inherit; }
.ep-i18n { display: flex; gap: 0.3rem; flex-wrap: wrap; margin-top: 0.35rem; }
.ep-i18n-chip {
  font-size: 0.75rem; padding: 0.1rem 0.5rem; border-radius: 4px;
  background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); color: var(--vp-c-text-2);
}
.ep-i18n-chip small { margin-left: 0.2rem; font-size: 0.625rem; text-transform: uppercase; color: var(--vp-c-text-3); }
.ep-copy-btn {
  display: inline-flex; align-items: center; gap: 0.3rem;
  padding: 0.3rem 0.6rem; border-radius: 6px;
  border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg);
  color: var(--vp-c-text-2); font-size: 0.75rem; font-weight: 500;
  cursor: pointer; transition: all 0.2s; font-family: inherit;
  flex-shrink: 0; align-self: flex-start;
}
.ep-copy-btn:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }

/* Body: single column on mobile */
.ep-body { display: grid; grid-template-columns: 1fr; gap: 1.5rem; align-items: start; }

/* Sections */
.ep-sec { margin-bottom: 1.25rem; }
.ep-sec:last-child { margin-bottom: 0; }
.ep-sec-title {
  font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--vp-c-text-3); margin: 0 0 0.5rem; display: flex; align-items: center; gap: 0.4rem;
}
.ep-count {
  font-size: 0.625rem; font-weight: 600;
  background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider);
  padding: 0.05rem 0.35rem; border-radius: 10px; color: var(--vp-c-text-3);
}

/* Identifier table */
.ep-id-table { border: 1px solid var(--vp-c-divider); border-radius: 6px; overflow: hidden; }
.ep-id-row { display: grid; grid-template-columns: auto 1fr; border-bottom: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); }
.ep-id-row:last-child { border-bottom: none; }
.ep-id-type {
  padding: 0.3rem 0.6rem; font-size: 0.625rem; font-weight: 600;
  text-transform: uppercase; color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft); border-right: 1px solid var(--vp-c-divider);
  white-space: nowrap;
}
.ep-id-val { padding: 0.3rem 0.6rem; font-size: 0.8125rem; word-break: break-all; }

/* Symbol display */
.ep-sym-display { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
.ep-sym-rendered {
  font-size: 1.5rem; font-weight: 300; padding: 0.4rem 0.75rem;
  background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider);
  border-radius: 6px; line-height: 1;
}

/* Code representations */
.ep-code-list { border: 1px solid var(--vp-c-divider); border-radius: 6px; overflow: hidden; }
.ep-code-row {
  display: grid; grid-template-columns: 64px 1fr 28px; align-items: center;
  border-bottom: 1px solid var(--vp-c-divider); background: var(--vp-c-bg);
}
.ep-code-row:last-child { border-bottom: none; }
.ep-code-label {
  padding: 0.3rem 0.6rem; font-size: 0.625rem; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.04em; color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft); border-right: 1px solid var(--vp-c-divider);
}
.ep-code-val {
  padding: 0.3rem 0.6rem; font-size: 0.8125rem;
  font-family: var(--vp-font-family-mono); word-break: break-all;
  white-space: pre-wrap; color: var(--vp-c-text-1); background: none;
}
.ep-copy-sm {
  background: none; border: none; cursor: pointer; padding: 0.3rem; color: var(--vp-c-text-3);
  transition: color 0.15s; border-left: 1px solid var(--vp-c-divider);
  display: flex; align-items: center; justify-content: center;
}
.ep-copy-sm:hover { color: var(--vp-c-brand-1); }

/* Big code */
.ep-big-code {
  font-size: 1rem; padding: 0.35rem 0.75rem; border-radius: 6px;
  background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); display: inline-block;
}

/* Dimension bars */
.ep-dim-bars { display: flex; flex-direction: column; gap: 0.3rem; margin-top: 0.5rem; }
.ep-dim-row { display: grid; grid-template-columns: 20px 1fr 32px 70px; align-items: center; gap: 0.4rem; }
.ep-dim-sym { font-weight: 700; font-size: 0.8125rem; color: var(--vp-c-text-1); }
.ep-dim-track { height: 5px; background: var(--vp-c-bg-soft); border-radius: 3px; overflow: hidden; }
.ep-dim-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }
.ep-dim-pwr { font-size: 0.6875rem; font-weight: 600; color: var(--vp-c-text-3); text-align: right; }
.ep-dim-key { font-size: 0.6875rem; color: var(--vp-c-text-3); }

/* Formula */
.ep-formula {
  display: flex; flex-wrap: wrap; align-items: baseline; gap: 0 0.35rem;
  padding: 0.5rem 0.75rem; background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider); border-radius: 6px; font-size: 1.0625rem;
  line-height: 1.8;
}
.ep-formula-sep { color: var(--vp-c-text-3); }
.ep-formula-unit { white-space: nowrap; }
.ep-formula-unit sup { font-size: 0.7em; font-weight: 700; vertical-align: super; line-height: 0; }
.ep-formula-prefix { font-size: 0.7em; }

/* Description */
.ep-desc { color: var(--vp-c-text-2); line-height: 1.6; margin: 0; font-size: 0.875rem; }

/* Properties grid: single column on mobile */
.ep-prop-grid { display: grid; grid-template-columns: 1fr; gap: 2px; background: var(--vp-c-divider); border-radius: 6px; overflow: hidden; }
.ep-prop-item {
  padding: 0.4rem 0.6rem; background: var(--vp-c-bg);
  display: flex; flex-direction: column; gap: 0.1rem;
}
.ep-prop-on { background: rgba(20,184,166,0.04); }
.ep-prop-k { color: var(--vp-c-text-3); font-size: 0.625rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
.ep-prop-v { font-weight: 600; color: var(--vp-c-text-1); font-size: 0.8125rem; }
.ep-prop-v code { font-size: 0.75rem; }
.ep-prop-link { color: var(--vp-c-brand-1); text-decoration: none; font-weight: 500; }
.ep-prop-link:hover { text-decoration: underline; }
.ep-prop-link code { color: var(--vp-c-brand-1); background: rgba(45,44,105,0.06); padding: 0 0.2rem; border-radius: 2px; font-size: 0.75rem; }

/* Reference links (inline) */
.ep-ref-inline { color: var(--vp-c-brand-1); text-decoration: none; font-weight: 600; }
.ep-ref-inline:hover { text-decoration: underline; }

/* Reference list */
.ep-ref-list {
  display: flex; flex-direction: column; gap: 1px;
  border: 1px solid var(--vp-c-divider); border-radius: 6px; overflow: hidden;
}
.ep-ref-row {
  display: flex; align-items: center; gap: 0.4rem; padding: 0.3rem 0.6rem;
  text-decoration: none; color: var(--vp-c-text-1); font-size: 0.8125rem;
  background: var(--vp-c-bg); transition: background 0.1s;
}
.ep-ref-row:hover { background: var(--vp-c-bg-soft); color: var(--vp-c-brand-1); }
.ep-ref-sym {
  font-size: 0.75rem; color: var(--vp-c-brand-1); background: rgba(45,44,105,0.05);
  padding: 0.05rem 0.3rem; border-radius: 3px; font-weight: 600;
}
.ep-ref-name { font-weight: 500; }
.ep-ref-sub { font-size: 0.6875rem; color: var(--vp-c-text-3); margin-left: auto; }

/* External references */
.ep-extref { cursor: default; text-decoration: none; }
.ep-extref[href] { cursor: pointer; }
.ep-extref-body { display: flex; flex-direction: column; gap: 0.1rem; flex: 1; min-width: 0; }
.ep-extref-uri {
  font-size: 0.6875rem; color: var(--vp-c-text-3);
  word-break: break-all; background: none;
}
.ep-auth-badge {
  display: inline-flex; align-items: center; justify-content: center;
  width: 22px; height: 22px; border-radius: 5px;
  font-size: 0.5625rem; font-weight: 700; flex-shrink: 0;
  background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}
.ep-auth-si-digital-framework { background: rgba(20,184,166,0.1); border-color: rgba(20,184,166,0.3); color: #14b8a6; }
.ep-auth-ucum { background: rgba(87,160,254,0.1); border-color: rgba(87,160,254,0.3); color: #57a0fe; }
.ep-auth-qudt { background: rgba(139,92,246,0.1); border-color: rgba(139,92,246,0.3); color: #8b5cf6; }
.ep-auth-nist { background: rgba(45,44,105,0.1); border-color: rgba(45,44,105,0.3); color: #2d2c69; }
.ep-auth-label { font-size: 0.75rem; font-weight: 500; color: var(--vp-c-text-1); }

/* Names */
.ep-names-list { display: flex; gap: 0.3rem; flex-wrap: wrap; }
.ep-name-chip {
  padding: 0.2rem 0.6rem; border-radius: 4px;
  background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); font-size: 0.8125rem;
}
.ep-name-chip small { margin-left: 0.3rem; color: var(--vp-c-text-3); text-transform: uppercase; font-size: 0.625rem; }

/* JSON area */
.ep-json-area { margin-top: 1.5rem; }
.ep-json-toggle {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.4rem 0.75rem; border-radius: 6px;
  border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg);
  color: var(--vp-c-text-2); font-size: 0.8125rem; font-weight: 500;
  cursor: pointer; transition: all 0.2s; font-family: inherit;
}
.ep-json-toggle:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
.ep-json-view { margin-top: 0.5rem; border: 1px solid var(--vp-c-divider); border-radius: 6px; overflow: hidden; }
.ep-json-view pre { margin: 0; padding: 0.75rem; font-size: 0.6875rem; line-height: 1.5; overflow-x: auto; background: var(--vp-c-bg-soft); }

/* ── Desktop overrides ── */

@media (min-width: 640px) {
  .ep-prop-grid { grid-template-columns: 1fr 1fr; }
}

@media (min-width: 900px) {
  .ep { padding: 1.25rem 2rem 3rem; }

  .ep-bc { margin-bottom: 1.25rem; overflow-x: visible; white-space: normal; }

  .ep-header { flex-direction: row; justify-content: space-between; align-items: flex-start; gap: 1rem; }

  .ep-name { font-size: 1.5rem; }
  .ep-sym-lg { font-size: 1.75rem; }

  .ep-body { grid-template-columns: 1fr 380px; gap: 2rem; }

  .ep-sym-rendered { font-size: 1.75rem; padding: 0.5rem 1rem; }
}
</style>
