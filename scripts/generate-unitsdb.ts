/**
 * Generate enriched UnitsDB index.json and JSON-LD files from YAML source.
 *
 * Usage: npx tsx scripts/generate-unitsdb.ts
 *
 * Reads from:  ../unitsdb/*.yaml
 * Writes to:   public/unitsdb/
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import * as yaml from 'js-yaml'

// ── Paths ──

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname)
const SITE_ROOT = path.resolve(SCRIPT_DIR, '..')
const DB_PATH = path.resolve(SITE_ROOT, '..', 'unitsdb')
const OUT_PATH = path.resolve(SITE_ROOT, 'public', 'unitsdb')

// ── YAML loader ──

function loadYaml<T>(name: string): T {
  const raw = fs.readFileSync(path.join(DB_PATH, `${name}.yaml`), 'utf-8')
  return yaml.load(raw) as T
}

// ── Helpers ──

function firstName(names: any[]): string {
  if (!names || !names.length) return '?'
  return names[0]?.value ?? '?'
}

interface SymMap { [fmt: string]: string }

function extractSymbols(symField: any): SymMap {
  const result: SymMap = {}
  if (!symField) return result
  if (Array.isArray(symField)) {
    for (const s of symField) {
      for (const fmt of ['unicode', 'ascii', 'html', 'latex', 'id', 'mathml']) {
        if (s[fmt] !== undefined && s[fmt] !== null) result[fmt] = s[fmt]
      }
    }
  } else if (typeof symField === 'object') {
    Object.assign(result, symField)
  }
  return result
}

function firstSym(sm: SymMap): string {
  return sm.unicode ?? sm.ascii ?? ''
}

function findUnitsmlId(identifiers: any[]): string {
  const found = identifiers?.find((i: any) => i.type === 'unitsml')
  return found?.id ?? identifiers?.[0]?.id ?? '?'
}

// ── Main ──

interface DimInfo {
  id: string
  name: string
  expression: string
  components: { key: string; symbol: string; power: number }[]
  dimensionless: boolean
}

interface QtyInfo {
  name: string
  type: string
  dimension: DimInfo | null
}

interface PrefixInfo {
  name: string
  symbol: string
  symbols: SymMap
  base: number
  power: number
  value: number
}

interface ScaleInfo {
  name: string
  properties: Record<string, boolean>
  description: string[]
}

interface SystemInfo {
  name: string
  short: string
  acceptable: boolean | null
  base_units: any[]
}

function main() {
  // ── Load all YAML data ──
  const unitsData: any = loadYaml('units')
  const quantitiesData: any = loadYaml('quantities')
  const dimensionsData: any = loadYaml('dimensions')
  const prefixesData: any = loadYaml('prefixes')
  const scalesData: any = loadYaml('scales')
  const systemsData: any = loadYaml('unit_systems')

  // ── Build prefix lookup ──
  const prefixMap: Record<string, PrefixInfo> = {}
  for (const p of prefixesData.prefixes) {
    const pid: string = p.identifiers[0].id
    const sym = extractSymbols(p.symbols)
    prefixMap[pid] = {
      name: firstName(p.names),
      symbol: firstSym(sym),
      symbols: sym,
      base: p.base ?? 10,
      power: p.power ?? 0,
      value: (p.base ?? 10) ** (p.power ?? 0),
    }
  }

  // ── Build dimension lookup ──
  const dimMap: Record<string, DimInfo> = {}
  const DIM_KEYS = [
    'length', 'mass', 'time', 'electric_current',
    'thermodynamic_temperature', 'amount_of_substance',
    'luminous_intensity', 'plane_angle',
  ]
  for (const d of dimensionsData.dimensions) {
    const did: string = d.identifiers[0].id
    const components: DimInfo['components'] = []
    for (const key of DIM_KEYS) {
      const comp = d[key]
      if (comp && (comp.power ?? 0) !== 0) {
        components.push({ key, symbol: comp.symbol ?? '', power: comp.power })
      }
    }
    const isDimensionless = d.dimensionless === true
    let expression: string
    if (isDimensionless) {
      expression = '1'
    } else {
      const parts = components.map(c =>
        c.power === 1 ? c.symbol : `${c.symbol}${c.power}`
      )
      expression = parts.length ? parts.join('·') : '—'
    }
    dimMap[did] = {
      id: did,
      name: firstName(d.names),
      expression,
      components,
      dimensionless: isDimensionless,
    }
  }

  // ── Build quantity lookup ──
  const qtyMap: Record<string, QtyInfo> = {}
  for (const q of quantitiesData.quantities) {
    const qid: string = q.identifiers[0].id
    const dimRef = q.dimension_reference
    const dimId = dimRef?.id ?? null
    const dimInfo = dimId ? dimMap[dimId] ?? null : null
    qtyMap[qid] = {
      name: firstName(q.names),
      type: q.quantity_type ?? 'derived',
      dimension: dimInfo,
    }
  }

  // ── Build scale lookup ──
  const scaleMap: Record<string, ScaleInfo> = {}
  for (const s of scalesData.scales) {
    const sid: string = s.identifiers[0].id
    const desc = (s.description ?? []).map((d: any) => d.value ?? '')
    scaleMap[sid] = {
      name: firstName(s.names),
      properties: s.properties ?? {},
      description: desc,
    }
  }

  // ── Build unit system lookup (indexed by ALL identifiers + short name) ──
  const systemMap: Record<string, SystemInfo> = {}
  const systemPrimaryId: Record<string, string> = {} // any id → primary NIST id
  for (const us of systemsData.unit_systems) {
    const primaryId: string = us.identifiers[0].id
    const info: SystemInfo = {
      name: firstName(us.names),
      short: us.short ?? primaryId,
      acceptable: us.acceptable ?? null,
      base_units: us.base_units ?? [],
    }
    for (const ident of us.identifiers) {
      systemMap[ident.id] = info
      systemPrimaryId[ident.id] = primaryId
    }
    // Also index by short name (units reference systems by short name)
    if (us.short) {
      systemMap[us.short] = info
      systemPrimaryId[us.short] = primaryId
    }
  }

  // ── Build unit lookup for root_units resolution ──
  const unitLookup: Record<string, { name: string; symbol: string }> = {}
  for (const u of unitsData.units) {
    const uid: string = u.identifiers[0].id
    const sym = extractSymbols(u.symbols)
    unitLookup[uid] = { name: firstName(u.names), symbol: firstSym(sym) }
  }

  // ── Process units ──
  const unitsOut: any[] = []
  for (const u of unitsData.units) {
    const uid: string = u.identifiers[0].id
    const sym = extractSymbols(u.symbols)
    const namesList = (u.names ?? []).map((n: any) => ({
      value: n.value ?? '', lang: n.lang ?? 'en',
    }))

    // Quantity references (handle singular/plural)
    let qtyRefs = u.quantity_references ?? u.quantity_reference ?? []
    if (qtyRefs && !Array.isArray(qtyRefs)) qtyRefs = [qtyRefs]
    const quantities = (qtyRefs ?? [])
      .map((qr: any) => {
        const qid = qr?.id
        if (!qid || !qtyMap[qid]) return null
        return { id: qid, name: qtyMap[qid].name, type: qtyMap[qid].type }
      })
      .filter(Boolean)

    // Dimension from first quantity
    let dimension: any = null
    if (quantities.length) {
      const qid = quantities[0].id
      if (qtyMap[qid]?.dimension) {
        dimension = qtyMap[qid].dimension
      }
    }

    // Scale
    const scaleRef = u.scale_reference
    const scaleId = scaleRef?.id ?? null
    const scaleInfo = (scaleId && scaleMap[scaleId])
      ? { id: scaleId, name: scaleMap[scaleId].name }
      : null

    // Systems (normalize to primary NIST ID, add parent system membership)
    let sysRefs = u.unit_system_reference ?? []
    if (sysRefs && !Array.isArray(sysRefs)) sysRefs = [sysRefs]
    const systems: { id: string; name: string; short: string; acceptable: boolean | null }[] = (sysRefs ?? [])
      .map((sr: any) => {
        const sid = sr?.id
        if (!sid || !systemMap[sid]) return null
        const sm = systemMap[sid]
        const normalizedId = systemPrimaryId[sid] ?? sid
        return { id: normalizedId, name: sm.name, short: sm.short, acceptable: sm.acceptable }
      })
      .filter(Boolean)

    // SI sub-system units are also members of SI_compatible
    const SI_PARENT = 'SI_compatible'
    const SI_SUBSYSTEMS = ['SI_base', 'SI_derived_special', 'SI_derived_non-special']
    const hasSI = systems.some(s => SI_SUBSYSTEMS.includes(s.id))
    if (hasSI && !systems.some(s => s.id === SI_PARENT) && systemMap[SI_PARENT]) {
      const parent = systemMap[SI_PARENT]
      systems.push({ id: SI_PARENT, name: parent.name, short: parent.short, acceptable: parent.acceptable })
    }

    // Root units (with prefix resolution!)
    // Handles both root_units and si_derived_bases
    const rootUnitsRaw = u.root_units ?? u.si_derived_bases
    let rootUnits: any[] | null = null
    if (rootUnitsRaw && rootUnitsRaw.length) {
      rootUnits = rootUnitsRaw.map((ru: any) => {
        // Unit reference
        const unitRef = ru.unit_reference
        const unitId = unitRef?.id ?? null
        const unitInfo = unitId && unitLookup[unitId]
          ? { id: unitId, ...unitLookup[unitId] }
          : { id: unitId ?? '?', name: unitId ?? '?', symbol: '?' }

        // Prefix reference
        const prefRef = ru.prefix_reference
        let prefixInfo = null
        if (prefRef?.id && prefixMap[prefRef.id]) {
          const pm = prefixMap[prefRef.id]
          prefixInfo = { id: prefRef.id, name: pm.name, symbol: pm.symbol }
        }

        return { power: ru.power ?? 1, unit: unitInfo, prefix: prefixInfo }
      })
    }

    // Identifiers
    const identifiers = (u.identifiers ?? []).map((i: any) => ({
      type: i.type ?? '', id: i.id ?? '',
    }))

    // External references (BIPM, UCUM, QUDT, etc.)
    const references = (u.references ?? []).map((r: any) => ({
      type: r.type ?? '', authority: r.authority ?? '', uri: r.uri ?? '',
    }))

    unitsOut.push({
      id: uid,
      unitsml_id: findUnitsmlId(identifiers),
      name: firstName(u.names),
      names: namesList,
      symbols: sym,
      identifiers,
      references,
      short: u.short ?? '',
      root: u.root ?? false,
      composite: rootUnits !== null,
      quantities,
      dimension,
      scale: scaleInfo,
      systems,
      root_units: rootUnits,
    })
  }

  // ── Process quantities ──
  const quantitiesOut: any[] = []
  for (const q of quantitiesData.quantities) {
    const qid: string = q.identifiers[0].id
    const dimRef = q.dimension_reference
    const dimId = dimRef?.id ?? null
    const dimInfo = dimId ? dimMap[dimId] ?? null : null

    // Find units that measure this quantity
    const relatedUnits: any[] = []
    for (const u of unitsOut) {
      if (u.quantities.some((q2: any) => q2.id === qid)) {
        relatedUnits.push({ id: u.id, name: u.name, symbol: firstSym(u.symbols) })
      }
    }

    const identifiers = (q.identifiers ?? []).map((i: any) => ({
      type: i.type ?? '', id: i.id ?? '',
    }))
    const references = (q.references ?? []).map((r: any) => ({
      type: r.type ?? '', authority: r.authority ?? '', uri: r.uri ?? '',
    }))

    quantitiesOut.push({
      id: qid,
      unitsml_id: findUnitsmlId(identifiers),
      name: firstName(q.names),
      names: (q.names ?? []).map((n: any) => ({ value: n.value ?? '', lang: n.lang ?? 'en' })),
      short: q.short ?? '',
      type: q.quantity_type ?? 'derived',
      dimension: dimInfo,
      units: relatedUnits,
      unit_count: relatedUnits.length,
      identifiers,
      references,
    })
  }

  // ── Process dimensions ──
  const dimensionsOut: any[] = []
  for (const d of dimensionsData.dimensions) {
    const did: string = d.identifiers[0].id
    const info = dimMap[did]
    const relatedQtys = quantitiesOut
      .filter(q => q.dimension?.id === did)
      .map(q => ({ id: q.id, name: q.name }))

    const identifiers = (d.identifiers ?? []).map((i: any) => ({
      type: i.type ?? '', id: i.id ?? '',
    }))

    dimensionsOut.push({
      id: did,
      unitsml_id: findUnitsmlId(identifiers),
      name: info.name,
      names: (d.names ?? []).map((n: any) => ({ value: n.value ?? '', lang: n.lang ?? 'en' })),
      expression: info.expression,
      dimensionless: info.dimensionless,
      components: info.components,
      quantities: relatedQtys,
      identifiers,
      references: (d.references ?? []).map((r: any) => ({
        type: r.type ?? '', authority: r.authority ?? '', uri: r.uri ?? '',
      })),
    })
  }

  // ── Process prefixes ──
  const prefixesOut: any[] = []
  for (const p of prefixesData.prefixes) {
    const pid: string = p.identifiers[0].id
    const info = prefixMap[pid]
    const relatedUnits: any[] = []
    for (const u of unitsOut) {
      if (u.root_units?.some((ru: any) => ru.prefix?.id === pid)) {
        relatedUnits.push({ id: u.id, name: u.name, symbol: firstSym(u.symbols) })
      }
    }

    const identifiers = (p.identifiers ?? []).map((i: any) => ({
      type: i.type ?? '', id: i.id ?? '',
    }))

    prefixesOut.push({
      id: pid,
      unitsml_id: findUnitsmlId(identifiers),
      name: info.name,
      symbol: info.symbol,
      symbols: info.symbols,
      factor: `${info.base}^${info.power}`,
      base: info.base,
      power: info.power,
      value: info.value,
      units: relatedUnits,
      identifiers,
      references: (p.references ?? []).map((r: any) => ({
        type: r.type ?? '', authority: r.authority ?? '', uri: r.uri ?? '',
      })),
    })
  }

  // ── Process scales ──
  const scalesOut: any[] = []
  for (const s of scalesData.scales) {
    const sid: string = s.identifiers[0].id
    const info = scaleMap[sid]
    const unitCount = unitsOut.filter(u => u.scale?.id === sid).length
    const identifiers = (s.identifiers ?? []).map((i: any) => ({
      type: i.type ?? '', id: i.id ?? '',
    }))

    scalesOut.push({
      id: sid,
      unitsml_id: findUnitsmlId(identifiers),
      name: info.name,
      properties: info.properties,
      description: info.description,
      unit_count: unitCount,
      identifiers,
    })
  }

  // ── Process unit systems ──
  const systemsOut: any[] = []
  for (const us of systemsData.unit_systems) {
    const usid: string = us.identifiers[0].id
    const info = systemMap[usid]
    const unitCount = unitsOut.filter(u => u.systems?.some((s: any) => s.id === usid)).length
    const identifiers = (us.identifiers ?? []).map((i: any) => ({
      type: i.type ?? '', id: i.id ?? '',
    }))

    systemsOut.push({
      id: usid,
      unitsml_id: findUnitsmlId(identifiers),
      name: info.name,
      short: info.short,
      acceptable: info.acceptable,
      unit_count: unitCount,
      identifiers,
      base_units: info.base_units,
    })
  }

  // ── Stats ──
  const stats = {
    units: unitsOut.length,
    quantities: quantitiesOut.length,
    dimensions: dimensionsOut.length,
    prefixes: prefixesOut.length,
    scales: scalesOut.length,
    unit_systems: systemsOut.length,
    total: unitsOut.length + quantitiesOut.length + dimensionsOut.length + prefixesOut.length + scalesOut.length + systemsOut.length,
    units_root: unitsOut.filter(u => u.root).length,
    units_composite: unitsOut.filter(u => u.composite).length,
    quantities_base: quantitiesOut.filter(q => q.type === 'base').length,
    quantities_derived: quantitiesOut.filter(q => q.type === 'derived').length,
    prefixes_decimal: prefixesOut.filter(p => p.base === 10).length,
    prefixes_binary: prefixesOut.filter(p => p.base === 2).length,
  }

  // ── Write index.json ──
  fs.mkdirSync(OUT_PATH, { recursive: true })
  const index = {
    meta: {
      source: 'https://github.com/unitsml/unitsdb',
      version: '2.0.0',
      schema_site: 'https://schema.unitsml.org',
      generated: new Date().toISOString().slice(0, 10),
    },
    stats,
    units: unitsOut,
    quantities: quantitiesOut,
    dimensions: dimensionsOut,
    prefixes: prefixesOut,
    scales: scalesOut,
    unit_systems: systemsOut,
  }

  // Full index (kept for backward compat / JSON API link)
  writeJson('index.json', index)

  // Lightweight stats file for instant page load
  writeJson('stats.json', { meta: index.meta, stats })

  // Per-type files for lazy loading
  const typeFiles: Record<string, any[]> = {
    units: unitsOut,
    quantities: quantitiesOut,
    dimensions: dimensionsOut,
    prefixes: prefixesOut,
    scales: scalesOut,
    unit_systems: systemsOut,
  }
  for (const [key, items] of Object.entries(typeFiles)) {
    writeJson(`${key}.json`, items)
  }

  console.log(`Stats: ${JSON.stringify(stats, null, 2)}`)

  // Verify prefix resolution
  let prefixCount = 0
  for (const u of unitsOut) {
    for (const ru of u.root_units ?? []) {
      if (ru.prefix) prefixCount++
    }
  }
  console.log(`Units with prefix in root_units: ${prefixCount}`)

  // ── Generate JSON-LD files ──
  const BASE = 'https://unitsml.org'
  const CTX = `${BASE}/unitsdb/context.jsonld`

  const pathSeg: Record<string, string> = {
    units: 'unit', quantities: 'quantity', dimensions: 'dimension',
    prefixes: 'prefix', scales: 'scale', unit_systems: 'unit-system',
  }
  const typeMap: Record<string, string> = {
    units: 'Unit', quantities: 'Quantity', dimensions: 'Dimension',
    prefixes: 'Prefix', scales: 'Scale', unit_systems: 'UnitSystem',
  }

  function toLd(key: string, e: any): any {
    const seg = pathSeg[key]
    const o: any = {
      '@context': CTX,
      '@id': `${BASE}/${seg}/${e.unitsml_id || e.id}`,
      '@type': typeMap[key],
      name: e.name,
      identifier: (e.identifiers ?? [{ type: 'nist', id: e.id }]).map((i: any) => ({
        '@type': 'PropertyValue', propertyID: i.type, value: i.id,
      })),
    }

    if (key === 'units') {
      if (e.symbols?.unicode) o.symbol = e.symbols.unicode
      o.rootUnit = e.root
      if (e.scale) o.scaleReference = { '@id': `${BASE}/scale/${e.scale.id}` }
      if (e.systems?.length) o.unitSystemReference = e.systems.map((s: any) => ({ '@id': `${BASE}/unit-system/${s.id}`, name: s.name }))
      if (e.quantities?.length) o.quantityReference = e.quantities.map((q: any) => ({ '@id': `${BASE}/quantity/${q.id}`, name: q.name }))
      if (e.dimension) o.dimensionReference = { '@id': `${BASE}/dimension/${e.dimension.id}`, expression: e.dimension.expression }
      if (e.root_units?.length) {
        o.rootUnits = e.root_units.map((ru: any) => {
          const entry: any = {
            power: ru.power,
            unitReference: { '@id': `${BASE}/unit/${ru.unit.id}`, name: ru.unit.name, symbol: ru.unit.symbol },
          }
          if (ru.prefix) {
            entry.prefixReference = { '@id': `${BASE}/prefix/${ru.prefix.id}`, name: ru.prefix.name, symbol: ru.prefix.symbol }
          }
          return entry
        })
      }
    } else if (key === 'quantities') {
      o.quantityType = e.type
      if (e.dimension) o.dimensionReference = { '@id': `${BASE}/dimension/${e.dimension.id}`, expression: e.dimension.expression }
      if (e.units?.length) o.measuredBy = e.units.map((u: any) => ({ '@id': `${BASE}/unit/${u.id}`, name: u.name }))
    } else if (key === 'dimensions') {
      o.expression = e.expression
      if (e.components?.length) o.dimensionalComposition = e.components.map((c: any) => ({ key: c.key, symbol: c.symbol, power: c.power }))
      if (e.dimensionless) o.dimensionless = true
    } else if (key === 'prefixes') {
      o.symbol = e.symbol; o.base = e.base; o.power = e.power; o.value = e.value
    } else if (key === 'scales') {
      o.properties = e.properties
    } else if (key === 'unit_systems') {
      o.short = e.short
    }
    return o
  }

  const collections: Record<string, any[]> = {
    units: unitsOut, quantities: quantitiesOut, dimensions: dimensionsOut,
    prefixes: prefixesOut, scales: scalesOut, unit_systems: systemsOut,
  }

  // Per-type JSON-LD
  for (const [key, items] of Object.entries(collections)) {
    const seg = pathSeg[key]
    const filename = key === 'unit_systems' ? 'unit-systems.jsonld' : `${seg}.jsonld`
    const graph = items.map(e => toLd(key, e))
    writeJson(filename, { '@context': CTX, '@graph': graph })
  }

  // Complete dataset
  const fullGraph: any[] = []
  for (const [key, items] of Object.entries(collections)) {
    for (const e of items) fullGraph.push(toLd(key, e))
  }
  writeJson('unitsdb.jsonld', { '@context': CTX, '@graph': fullGraph })
  console.log(`unitsdb.jsonld: ${fullGraph.length} entities`)

  // ── Helper ──
  function writeJson(filename: string, data: any) {
    const fp = path.join(OUT_PATH, filename)
    fs.writeFileSync(fp, JSON.stringify(data, null, 2), 'utf-8')
    const size = fs.statSync(fp).size
    console.log(`${filename}: ${(size / 1024).toFixed(1)} KB`)
  }
}

main()
