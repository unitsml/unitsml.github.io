<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()

interface Identifier { type: string; id: string }
interface QtyRef { id: string; name: string; type: string }
interface SystemRef { id: string; name: string; short: string; acceptable: boolean | null }
interface PrefixRef { id: string; name: string; symbol: string }
interface RootUnitEntry { power: number; unit: { id: string; name: string; symbol: string }; prefix: PrefixRef | null }
interface UnitEntry {
  id: string; unitsml_id: string; name: string; short: string; symbols: any; identifiers: Identifier[]
  root: boolean; composite: boolean; quantities: QtyRef[]; dimension: any; scale: any; systems: SystemRef[]; root_units: RootUnitEntry[] | null
}
interface QuantityEntry {
  id: string; unitsml_id: string; name: string; short: string; type: string; dimension: any; units: any[]; unit_count: number; identifiers: Identifier[]
}

type EType = 'units' | 'quantities' | 'dimensions' | 'prefixes' | 'scales' | 'unit_systems'

const TABS: { key: EType; label: string }[] = [
  { key: 'units',        label: 'Units' },
  { key: 'quantities',   label: 'Quantities' },
  { key: 'dimensions',   label: 'Dimensions' },
  { key: 'prefixes',     label: 'Prefixes' },
  { key: 'scales',       label: 'Scales' },
  { key: 'unit_systems', label: 'Systems' },
]

const URL_TYPE: Record<EType, string> = {
  units: 'units', quantities: 'quantities', dimensions: 'dimensions',
  prefixes: 'prefixes', scales: 'scales', unit_systems: 'systems',
}

const db         = ref<any>(null)
const stats      = ref<Record<string, number>>({})
const meta       = ref<any>(null)
const loading    = ref(true)
const tabLoading = ref(false)
const loadError  = ref('')
const activeTab  = ref<EType>('units')
const activeUnitFilter = ref('all')
const q          = ref('')
const pageSize   = 100
const page       = ref(1)
const typeCache  = new Map<EType, any[]>()
const typeCacheRaw = ref<Record<EType, any[] | null>>({
  units: null, quantities: null, dimensions: null,
  prefixes: null, scales: null, unit_systems: null,
})
const searchInput = ref<HTMLInputElement | null>(null)

function slugify(uid: string): string {
  return uid.replace(/[^a-zA-Z0-9._-]/g, '_')
}
function entityLink(type: EType, uid: string): string {
  return `/unitsdb/${URL_TYPE[type]}/${slugify(uid)}`
}
function firstSym(item: any): string {
  return item.symbols?.unicode || item.symbols?.ascii || item.symbol || ''
}
function rowClick(e: MouseEvent, type: EType, uid: string) {
  if ((e.target as HTMLElement).closest('a')) return
  router.go(entityLink(type, uid))
}
function altNames(item: any): string {
  if (!item.names?.length) return ''
  const alts = item.names
    .filter((n: any) => n.value !== item.name)
    .map((n: any) => n.value)
  return alts.length ? alts.slice(0, 2).join(', ') : ''
}

async function loadType(key: EType) {
  if (typeCache.has(key)) return typeCache.get(key)!
  tabLoading.value = true
  try {
    const r = await fetch(`/unitsdb/${key}.json`)
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const data = await r.json()
    typeCache.set(key, data)
    typeCacheRaw.value = { ...typeCacheRaw.value, [key]: data }
    return data
  } finally { tabLoading.value = false }
}

function buildDb(): any | null {
  return {
    meta: meta.value, stats: stats.value,
    units: typeCache.get('units') ?? [],
    quantities: typeCache.get('quantities') ?? [],
    dimensions: typeCache.get('dimensions') ?? [],
    prefixes: typeCache.get('prefixes') ?? [],
    scales: typeCache.get('scales') ?? [],
    unit_systems: typeCache.get('unit_systems') ?? [],
  }
}

onMounted(async () => {
  try {
    const sr = await fetch('/unitsdb/stats.json')
    if (!sr.ok) throw new Error(`HTTP ${sr.status}`)
    const sd = await sr.json()
    stats.value = sd.stats; meta.value = sd.meta; loading.value = false
    const pathTab = detectTabFromPath()
    activeTab.value = pathTab
    await loadType(pathTab)
    db.value = buildDb()
  } catch (e: any) { loadError.value = e.message; loading.value = false }

  window.addEventListener('popstate', onPopState)
})

function detectTabFromPath(): EType {
  const path = location.pathname.replace(/\.html$/, '').replace(/\/$/, '')
  // Match paths like /unitsdb/units, /unitsdb/quantities, etc.
  const match = path.match(/\/unitsdb\/([a-z_]+)$/)
  if (match) {
    const key = match[1]
    // Map URL segment to EType key
    const urlToKey: Record<string, EType> = {
      units: 'units', quantities: 'quantities', dimensions: 'dimensions',
      prefixes: 'prefixes', scales: 'scales', systems: 'unit_systems',
    }
    if (urlToKey[key]) return urlToKey[key]
  }
  return 'units'
}

function onPopState() {
  const key = detectTabFromPath()
  if (key !== activeTab.value) {
    activeTab.value = key
    activeUnitFilter.value = 'all'
    q.value = ''
    if (!typeCache.has(key)) {
      tabLoading.value = true
      loadType(key).then(() => { db.value = buildDb() })
    }
  }
}

function cnt(key: EType) { return stats.value[key] ?? typeCacheRaw.value[key]?.length ?? 0 }

const filtered = computed(() => {
  const list: any[] = [...(typeCacheRaw.value[activeTab.value] ?? [])]
  if (!list.length) return []
  if (activeTab.value === 'units') {
    if (activeUnitFilter.value === 'root') return list.filter(u => u.root)
    if (activeUnitFilter.value === 'composite') return list.filter(u => u.composite)
    if (activeUnitFilter.value === 'prefixed') return list.filter(u => u.root_units?.some((ru: RootUnitEntry) => ru.prefix !== null))
  }
  const term = q.value.toLowerCase().trim()
  if (!term) return list
  return list.filter((item: any) => {
    const blob = [
      item.name, item.id, item.unitsml_id, item.short, item.type,
      item.expression, item.factor, item.symbol,
      item.symbols?.unicode, item.symbols?.ascii, item.symbols?.html,
      ...(item.identifiers || []).map((i: Identifier) => `${i.type}:${i.id}`),
      ...(item.quantities || []).map((r: QtyRef) => r.name),
      ...(item.systems || []).map((r: SystemRef) => r.name),
    ].filter(Boolean).join(' ').toLowerCase()
    return blob.includes(term)
  })
})

const prefixedCount = computed(() => {
  const units = typeCacheRaw.value.units
  if (!units) return 0
  return (units as UnitEntry[]).filter(u => u.root_units?.some(ru => ru.prefix)).length
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))
const paged = computed(() => {
  const start = (page.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})

async function switchTab(key: EType) {
  q.value = ''
  page.value = 1
  const newPath = `/unitsdb/${URL_TYPE[key]}`
  router.go(newPath)
  if (!typeCache.has(key)) tabLoading.value = true
  activeTab.value = key; activeUnitFilter.value = 'all'
  if (!typeCache.has(key)) { await loadType(key); db.value = buildDb() }
}

async function dlDataset() {
  for (const tab of TABS) { if (!typeCache.has(tab.key)) await loadType(tab.key) }
  const full = buildDb(); if (!full) return
  const b = new Blob([JSON.stringify(full, null, 2)], { type: 'application/json' })
  const u = URL.createObjectURL(b)
  const a = document.createElement('a'); a.href = u; a.download = 'unitsdb-index.json'; a.click()
  URL.revokeObjectURL(u)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') { e.preventDefault(); searchInput.value?.focus() }
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); searchInput.value?.focus() }
  if (e.key === 'Escape' && q.value) { q.value = ''; searchInput.value?.blur() }
}
onMounted(() => window.addEventListener('keydown', onKeydown))
watch(q, () => { page.value = 1 })
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('popstate', onPopState)
})
</script>

<template>
  <div class="udb">
    <header class="udb-header">
      <div class="udb-header-inner">
        <div class="udb-title-area">
          <h1 class="udb-title">UnitsDB</h1>
          <p class="udb-subtitle">The authoritative database of scientific units of measure</p>
        </div>
        <a href="https://github.com/unitsml/unitsdb" target="_blank" rel="noopener" class="udb-action-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
          GitHub
        </a>
      </div>
    </header>

    <div class="udb-content">
      <div v-if="!loading" class="stats-bar">
        <div class="stat-group" role="tablist" aria-label="Entity types">
          <button v-for="tab in TABS" :key="tab.key" class="stat-pill" :class="{ active: activeTab === tab.key }" :data-type="tab.key" role="tab" :aria-selected="activeTab === tab.key" @click="switchTab(tab.key)">
            <span class="sp-val">{{ cnt(tab.key) }}</span>
            <span class="sp-lbl">{{ tab.label }}</span>
          </button>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-dl-group">
          <button class="dl-btn" @click="dlDataset" title="Download full dataset as JSON">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            JSON
          </button>
          <a class="dl-btn" href="/unitsdb/unitsdb.jsonld" download title="Download JSON-LD">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
            JSON-LD
          </a>
          <a class="dl-btn" :href="meta?.schema_site ?? 'https://schema.unitsml.org'" target="_blank" rel="noopener" title="Schemas">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            Schemas
          </a>
        </div>
      </div>

      <div v-if="activeTab === 'units' && !loading" class="sub-filters">
        <button class="sub-filter-btn" :class="{ active: activeUnitFilter === 'all' }" @click="activeUnitFilter = 'all'">All <span class="sf-count">{{ stats.units }}</span></button>
        <button class="sub-filter-btn" :class="{ active: activeUnitFilter === 'root' }" @click="activeUnitFilter = 'root'">Base <span class="sf-count">{{ stats.units_root }}</span></button>
        <button class="sub-filter-btn" :class="{ active: activeUnitFilter === 'composite' }" @click="activeUnitFilter = 'composite'">Derived <span class="sf-count">{{ stats.units_composite }}</span></button>
        <button class="sub-filter-btn" :class="{ active: activeUnitFilter === 'prefixed' }" @click="activeUnitFilter = 'prefixed'">Prefixed <span class="sf-count">{{ prefixedCount }}</span></button>
      </div>

      <div class="search-row">
        <div class="search-box">
          <svg class="si" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input ref="searchInput" v-model="q" type="text" class="si-input" placeholder="Search by name, symbol, ID… (⌘K)" aria-label="Search units and quantities" />
          <button v-if="q" class="si-clear" @click="q = ''">&times;</button>
        </div>
        <span class="res-n">{{ filtered.length }} result{{ filtered.length !== 1 ? 's' : '' }}</span>
      </div>

      <!-- Loading / Error / Empty -->
      <div v-if="loading" class="skeleton-wrapper">
        <div class="skeleton-row" v-for="n in 8" :key="n">
          <div class="skeleton-cell" :style="{ width: (20 + Math.random() * 30) + '%' }"></div>
          <div class="skeleton-cell" :style="{ width: (15 + Math.random() * 20) + '%' }"></div>
          <div class="skeleton-cell" :style="{ width: (10 + Math.random() * 15) + '%' }"></div>
        </div>
      </div>
      <div v-else-if="tabLoading" class="skeleton-wrapper">
        <div class="skeleton-row" v-for="n in 6" :key="n">
          <div class="skeleton-cell" :style="{ width: (20 + Math.random() * 30) + '%' }"></div>
          <div class="skeleton-cell" :style="{ width: (15 + Math.random() * 20) + '%' }"></div>
        </div>
      </div>
      <div v-else-if="loadError" class="state-msg err">Failed: {{ loadError }}</div>
      <div v-else-if="!filtered.length" class="state-msg empty-state">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <span>No results match your search.</span>
        <button v-if="q" class="clear-search-btn" @click="q = ''">Clear search</button>
      </div>

      <!-- ── Units ── -->
      <div v-else-if="activeTab === 'units'" class="dtbl-wrap" role="tabpanel" aria-label="Units listing">
      <table class="dtbl">
        <thead><tr><th class="c-sym">Symbol</th><th class="c-name">Name</th><th class="c-uid">UnitsML ID</th><th class="c-dim">Dimension</th><th class="c-tag">Type</th><th class="c-qty">Quantity</th></tr></thead>
        <tbody>
          <tr v-for="item in paged" :key="item.id" @click="rowClick($event, 'units', item.unitsml_id)">
            <td class="c-sym"><code>{{ firstSym(item) }}</code></td>
            <td class="c-name"><a :href="entityLink('units', item.unitsml_id)">{{ item.name }}</a><span v-if="altNames(item)" class="c-alt">{{ altNames(item) }}</span></td>
            <td class="c-uid"><code>{{ item.unitsml_id }}</code></td>
            <td class="c-dim">{{ item.dimension?.expression || '—' }}</td>
            <td class="c-tag"><span class="badge" :class="item.root ? 'badge-base' : item.composite ? 'badge-derived' : ''">{{ item.root ? 'Base' : item.composite ? 'Derived' : 'Other' }}</span></td>
            <td class="c-qty">{{ item.quantities?.[0]?.name || '—' }}<span v-if="(item.quantities?.length ?? 0) > 1" class="more"> +{{ (item.quantities?.length ?? 0) - 1 }}</span></td>
          </tr>
        </tbody>
      </table>
      </div>

      <!-- ── Quantities ── -->
      <div v-else-if="activeTab === 'quantities'" class="dtbl-wrap" role="tabpanel" aria-label="Quantities listing">
      <table class="dtbl">
        <thead><tr><th class="c-name">Name</th><th class="c-uid">UnitsML ID</th><th class="c-tag">Type</th><th class="c-dim">Dimension</th><th class="c-cnt">Units</th></tr></thead>
        <tbody>
          <tr v-for="item in paged" :key="item.id" @click="rowClick($event, 'quantities', item.unitsml_id)">
            <td class="c-name"><a :href="entityLink('quantities', item.unitsml_id)">{{ item.name }}</a><span v-if="altNames(item)" class="c-alt">{{ altNames(item) }}</span></td>
            <td class="c-uid"><code>{{ item.unitsml_id }}</code></td>
            <td class="c-tag"><span class="badge" :class="item.type === 'base' ? 'badge-base' : 'badge-derived'">{{ item.type }}</span></td>
            <td class="c-dim">{{ item.dimension?.expression || '—' }}</td>
            <td class="c-cnt">{{ item.unit_count ?? item.units?.length ?? '—' }}</td>
          </tr>
        </tbody>
      </table>
      </div>

      <!-- ── Dimensions ── -->
      <div v-else-if="activeTab === 'dimensions'" class="dtbl-wrap" role="tabpanel" aria-label="Dimensions listing">
      <table class="dtbl">
        <thead><tr><th class="c-name">Name</th><th class="c-uid">UnitsML ID</th><th class="c-dim">Expression</th><th class="c-cnt">Quantities</th><th class="c-tag">Dim-less</th></tr></thead>
        <tbody>
          <tr v-for="item in paged" :key="item.id" @click="rowClick($event, 'dimensions', item.unitsml_id)">
            <td class="c-name"><a :href="entityLink('dimensions', item.unitsml_id)">{{ item.name }}</a><span v-if="altNames(item)" class="c-alt">{{ altNames(item) }}</span></td>
            <td class="c-uid"><code>{{ item.unitsml_id }}</code></td>
            <td class="c-dim"><code>{{ item.expression }}</code></td>
            <td class="c-cnt">{{ item.quantities?.length ?? '—' }}</td>
            <td class="c-tag">{{ item.dimensionless ? '✓' : '—' }}</td>
          </tr>
        </tbody>
      </table>
      </div>

      <!-- ── Prefixes ── -->
      <div v-else-if="activeTab === 'prefixes'" class="dtbl-wrap" role="tabpanel" aria-label="Prefixes listing">
      <table class="dtbl">
        <thead><tr><th class="c-sym">Symbol</th><th class="c-name">Name</th><th class="c-uid">UnitsML ID</th><th class="c-fact">Factor</th><th class="c-cnt">Value</th></tr></thead>
        <tbody>
          <tr v-for="item in paged" :key="item.id" @click="rowClick($event, 'prefixes', item.unitsml_id)">
            <td class="c-sym"><code>{{ item.symbol }}</code></td>
            <td class="c-name"><a :href="entityLink('prefixes', item.unitsml_id)">{{ item.name }}</a><span v-if="altNames(item)" class="c-alt">{{ altNames(item) }}</span></td>
            <td class="c-uid"><code>{{ item.unitsml_id }}</code></td>
            <td class="c-fact">{{ item.factor }}</td>
            <td class="c-cnt">{{ item.value }}</td>
          </tr>
        </tbody>
      </table>
      </div>

      <!-- ── Scales ── -->
      <div v-else-if="activeTab === 'scales'" class="dtbl-wrap" role="tabpanel" aria-label="Scales listing">
      <table class="dtbl">
        <thead><tr><th class="c-name">Name</th><th class="c-uid">UnitsML ID</th><th class="c-props">Properties</th></tr></thead>
        <tbody>
          <tr v-for="item in paged" :key="item.id" @click="rowClick($event, 'scales', item.unitsml_id)">
            <td class="c-name"><a :href="entityLink('scales', item.unitsml_id)">{{ item.name }}</a><span v-if="altNames(item)" class="c-alt">{{ altNames(item) }}</span></td>
            <td class="c-uid"><code>{{ item.unitsml_id }}</code></td>
            <td class="c-props">{{ Object.entries(item.properties || {}).filter(([,v]) => v).map(([k]) => k).join(', ') }}</td>
          </tr>
        </tbody>
      </table>
      </div>

      <!-- ── Systems ── -->
      <div v-else-if="activeTab === 'unit_systems'" class="dtbl-wrap" role="tabpanel" aria-label="Systems listing">
      <table class="dtbl">
        <thead><tr><th class="c-name">Name</th><th class="c-uid">UnitsML ID</th><th class="c-sym">Short</th><th class="c-cnt">Units</th><th class="c-tag">Acceptable</th></tr></thead>
        <tbody>
          <tr v-for="item in paged" :key="item.id" @click="rowClick($event, 'unit_systems', item.unitsml_id)">
            <td class="c-name"><a :href="entityLink('unit_systems', item.unitsml_id)">{{ item.name }}</a><span v-if="altNames(item)" class="c-alt">{{ altNames(item) }}</span></td>
            <td class="c-uid"><code>{{ item.unitsml_id }}</code></td>
            <td class="c-sym"><code>{{ item.short }}</code></td>
            <td class="c-cnt">{{ item.unit_count ?? '—' }}</td>
            <td class="c-tag">{{ item.acceptable ? '✓' : item.acceptable === false ? '✗' : '—' }}</td>
          </tr>
        </tbody>
      </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pager">
        <button class="pager-btn" :disabled="page <= 1" @click="page--">&larr; Prev</button>
        <span class="pager-info">Page {{ page }} of {{ totalPages }}</span>
        <button class="pager-btn" :disabled="page >= totalPages" @click="page++">Next &rarr;</button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.udb { font-size: 0.875rem; }

/* ── Layout (mobile-first) ── */

.udb-content {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0.75rem 0.75rem 2rem;
}

.udb-header {
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 0.75rem;
}
.udb-header-inner {
  max-width: 1440px; margin: 0 auto;
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 0.75rem; flex-wrap: wrap;
}
.udb-title { font-size: 1.25rem; font-weight: 700; margin: 0; letter-spacing: -0.02em; }
.udb-subtitle { font-size: 0.8125rem; color: var(--vp-c-text-3); margin: 0.25rem 0 0; }
.udb-action-btn {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.4rem 0.875rem; border-radius: 8px; font-size: 0.8125rem; font-weight: 500;
  border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); color: var(--vp-c-text-2);
  text-decoration: none; transition: all 0.2s;
}
.udb-action-btn:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }

/* ── Stats bar ── */

.stats-bar {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 0.75rem; background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider); border-radius: 10px; margin-bottom: 0.75rem;
  overflow-x: auto; -webkit-overflow-scrolling: touch;
}
.stat-group { display: flex; gap: 0.25rem; flex-shrink: 0; }
.stat-pill {
  display: flex; align-items: baseline; gap: 0.3rem;
  padding: 0.2rem 0.625rem; border-radius: 20px; cursor: pointer;
  border: 1px solid transparent; background: none; font-family: inherit;
  font-size: 0.75rem; color: var(--vp-c-text-3); transition: all 0.2s;
  white-space: nowrap;
}
.stat-pill:hover { background: var(--vp-c-bg); border-color: var(--vp-c-divider); color: var(--vp-c-text-2); }
.stat-pill.active { background: var(--vp-c-brand-1); color: #fff; border-color: var(--vp-c-brand-1); }
.stat-pill[data-type="units"].active { background: #14b8a6; border-color: #14b8a6; }
.stat-pill[data-type="quantities"].active { background: #57a0fe; border-color: #57a0fe; }
.stat-pill[data-type="dimensions"].active { background: #2d2c69; border-color: #2d2c69; }
.stat-pill[data-type="prefixes"].active { background: #8b5cf6; border-color: #8b5cf6; }
.stat-pill[data-type="scales"].active { background: #f59e0b; border-color: #f59e0b; color: #1f1e4a; }
.stat-pill[data-type="unit_systems"].active { background: #6b7280; border-color: #6b7280; }
.sp-val { font-weight: 700; font-size: 0.875rem; }
.sp-lbl { font-size: 0.6875rem; }
.stat-divider { display: none; width: 1px; height: 1.5rem; background: var(--vp-c-divider); flex-shrink: 0; }
.stat-dl-group { display: flex; gap: 0.3rem; flex-shrink: 0; }
.dl-btn {
  display: inline-flex; align-items: center; gap: 0.3rem;
  padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.6875rem; font-weight: 500;
  cursor: pointer; transition: all 0.2s; border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg); color: var(--vp-c-text-2); font-family: inherit; text-decoration: none;
  white-space: nowrap;
}
.dl-btn:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }

/* ── Sub-filters ── */

.sub-filters { display: flex; gap: 0.25rem; margin-bottom: 0.625rem; flex-wrap: wrap; }
.sub-filter-btn {
  display: flex; align-items: center; gap: 0.3rem;
  padding: 0.2rem 0.625rem; border-radius: 6px; cursor: pointer;
  border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg);
  font-size: 0.6875rem; font-weight: 500; color: var(--vp-c-text-3);
  font-family: inherit; transition: all 0.15s;
}
.sub-filter-btn:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-text-2); }
.sub-filter-btn.active { background: rgba(45,44,105,0.08); border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
.sf-count { font-weight: 600; }

/* ── Search ── */

.search-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; }
.search-box { flex: 1; position: relative; min-width: 0; }
.si { position: absolute; left: 0.625rem; top: 50%; transform: translateY(-50%); color: var(--vp-c-text-3); pointer-events: none; }
.si-input {
  width: 100%; padding: 0.5rem 2rem 0.5rem 2rem; border-radius: 8px;
  border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg);
  font-size: 0.8125rem; font-family: inherit; color: var(--vp-c-text-1); transition: border-color 0.2s;
  box-sizing: border-box;
}
.si-input:focus { outline: none; border-color: var(--vp-c-brand-1); }
.si-clear { position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--vp-c-text-3); cursor: pointer; font-size: 1rem; }
.res-n { font-size: 0.75rem; color: var(--vp-c-text-3); white-space: nowrap; flex-shrink: 0; }

/* ── Table wrapper (scrollable on mobile) ── */

.dtbl-wrap {
  overflow-x: auto; -webkit-overflow-scrolling: touch;
  border: 1px solid var(--vp-c-divider); border-radius: 8px;
}

/* ── Data table ── */

.dtbl {
  width: 100%; border-collapse: collapse;
  font-size: 0.8125rem; min-width: 600px;
}
.dtbl thead { background: var(--vp-c-bg-soft); }
.dtbl th {
  padding: 0.5rem 0.75rem; font-size: 0.6875rem; font-weight: 600;
  color: var(--vp-c-text-3); text-transform: uppercase; letter-spacing: 0.04em;
  text-align: left; border-bottom: 1px solid var(--vp-c-divider); white-space: nowrap;
}
.dtbl td {
  padding: 0.45rem 0.75rem; border-bottom: 1px solid var(--vp-c-divider);
  vertical-align: middle; white-space: nowrap;
}
.dtbl tbody tr { transition: background 0.1s; cursor: pointer; }
.dtbl tbody tr:hover { background: var(--vp-c-bg-soft); }
.dtbl tbody tr:last-child td { border-bottom: none; }

/* Column widths */
.c-sym { width: 70px; }
.c-sym code { font-size: 0.8125rem; color: var(--vp-c-brand-1); background: rgba(45,44,105,0.05); padding: 0.05rem 0.4rem; border-radius: 3px; }
.c-name { min-width: 140px; white-space: normal !important; }
.c-name a { color: var(--vp-c-text-1); text-decoration: none; font-weight: 500; }
.c-name a:hover { color: var(--vp-c-brand-1); }
.c-alt { display: block; font-size: 0.6875rem; color: var(--vp-c-text-3); margin-top: 0.1rem; white-space: normal; }
.c-uid { min-width: 120px; }
.c-uid code { font-size: 0.75rem; color: var(--vp-c-text-3); background: none; padding: 0; }
.c-dim { width: 100px; }
.c-dim code { font-size: 0.8125rem; color: var(--vp-c-text-2); background: none; padding: 0; }
.c-tag { width: 80px; text-align: center; }
.c-cnt { width: 60px; text-align: right; }
.c-fact { width: 90px; font-variant-numeric: tabular-nums; }
.c-qty { min-width: 120px; }
.c-props { min-width: 200px; }

.badge {
  display: inline-block; padding: 0.1rem 0.5rem; border-radius: 3px;
  font-size: 0.6875rem; font-weight: 500;
  background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); color: var(--vp-c-text-3);
}
.badge-base { background: rgba(20,184,166,0.08); border-color: rgba(20,184,166,0.25); color: #14b8a6; }
.badge-derived { background: rgba(87,160,254,0.08); border-color: rgba(87,160,254,0.25); color: #57a0fe; }
.more { font-size: 0.6875rem; color: var(--vp-c-text-3); margin-left: 0.2rem; }

/* ── State messages ── */

.state-msg { padding: 3rem 1rem; text-align: center; color: var(--vp-c-text-3); }
.state-msg.err { color: var(--vp-c-danger-1); }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
.clear-search-btn {
  margin-top: 0.5rem; padding: 0.3rem 0.75rem; border-radius: 6px;
  border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg);
  color: var(--vp-c-text-2); font-size: 0.8125rem; cursor: pointer; font-family: inherit;
}
.clear-search-btn:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }

/* ── Skeleton ── */

.skeleton-wrapper { padding: 1rem 0; }
.skeleton-row { display: flex; gap: 0.75rem; padding: 0.5rem 0; }
.skeleton-cell { height: 16px; background: var(--vp-c-bg-soft); border-radius: 4px; }

/* ── Pagination ── */

.pager {
  display: flex; align-items: center; justify-content: center; gap: 1rem;
  margin-top: 1rem; padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}
.pager-btn {
  padding: 0.35rem 0.875rem; border-radius: 6px; font-size: 0.8125rem; font-weight: 500;
  cursor: pointer; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg);
  color: var(--vp-c-text-2); font-family: inherit; transition: all 0.15s;
}
.pager-btn:hover:not(:disabled) { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
.pager-btn:disabled { opacity: 0.4; cursor: default; }
.pager-info { font-size: 0.8125rem; color: var(--vp-c-text-3); }

/* ── Desktop (≥ 768px) ── */

@media (min-width: 768px) {
  .udb-content { padding: 1.25rem 1.5rem 2rem; }
  .udb-header { padding: 1.25rem 1.5rem; }
  .udb-header-inner { align-items: center; }
  .udb-title { font-size: 1.5rem; }
  .stats-bar { overflow-x: visible; }
  .stat-divider { display: block; }
  .stat-dl-group { margin-left: auto; }
  .search-box { max-width: 400px; }
}
</style>
