<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import WappiMascot from './WappiMascot.vue'
import LiquidLogo from './LiquidLogo.vue'
import Logo3DWireframe from './Logo3DWireframe.vue'
import EcosystemDiagram from './EcosystemDiagram.vue'
// ── Steps ──
const steps = [
  {
    num: '01',
    title: 'Define units in XML',
    desc: 'Use UnitsML schemas to encode units of measure — SI base, derived, and non-SI — with dimensional analysis.',
    lang: 'XML',
    code: `<span class="xml-tag">&lt;UnitsML</span> <span class="xml-attr">xmlns</span>=<span class="xml-val">"https://schema.unitsml.org/unitsml/1.0"</span><span class="xml-tag">&gt;</span>
  <span class="xml-tag">&lt;UnitSet&gt;</span>
    <span class="xml-tag">&lt;Unit</span> <span class="xml-attr">xml:id</span>=<span class="xml-val">"m"</span> <span class="xml-attr">dimensionURL</span>=<span class="xml-val">"#L"</span><span class="xml-tag">&gt;</span>
      <span class="xml-tag">&lt;UnitName&gt;</span>metre<span class="xml-tag">&lt;/UnitName&gt;</span>
      <span class="xml-tag">&lt;UnitSymbol&gt;</span>SI<span class="xml-tag">&lt;/UnitSymbol&gt;</span>
    <span class="xml-tag">&lt;/Unit&gt;</span>
  <span class="xml-tag">&lt;/UnitSet&gt;</span>
<span class="xml-tag">&lt;/UnitsML&gt;</span>`,
  },
  {
    num: '02',
    title: 'Incorporate into your markup',
    desc: 'Embed UnitsML into other XML languages via namespace import, schema reference, or inclusion.',
    lang: 'XML',
    code: `<span class="xml-tag">&lt;Measurement</span>
  <span class="xml-attr">xmlns:unitsml</span>=<span class="xml-val">"…"</span><span class="xml-tag">&gt;</span>
  <span class="xml-tag">&lt;Value</span> <span class="xml-attr">unitURL</span>=<span class="xml-val">"#Pa"</span><span class="xml-tag">&gt;</span>101325<span class="xml-tag">&lt;/Value&gt;</span>
  <span class="xml-tag">&lt;Description&gt;</span>Atm pressure<span class="xml-tag">&lt;/Description&gt;</span>
<span class="xml-tag">&lt;/Measurement&gt;</span>`,
  },
  {
    num: '03',
    title: 'Validate & exchange data',
    desc: 'Documents validate for self-consistent usage of units, enabling reliable scientific data exchange across systems.',
    lang: 'Shell',
    code: `<span class="xml-comment">// Validate with standard tools</span>
<span class="xml-tag">xmllint</span> <span class="xml-attr">--schema</span> <span class="xml-val">unitsml-v1.0.xsd</span>
  <span class="xml-val">measurement.xml</span>

<span class="xml-comment">// Dimensional consistency</span>
  Pa → <span class="xml-val">L⁻¹·M·T⁻²</span>  ✓
  N  → <span class="xml-val">L·M·T⁻²</span>   ✓`,
  },
]

const activeStep = ref(0)
const stepCopied = ref(false)
const wappiRef = ref<InstanceType<typeof WappiMascot> | null>(null)

const adopters = [
  {
    name: 'OCX Consortium',
    url: 'https://3docx.org',
    logo: '/logos/ocx-logo.svg',
    description: 'The vessel-specific XML standard for model-based class approval, used by DNV, NAPA, and major shipbuilders. OCX encodes every physical quantity with UnitsML to keep hull measurements precise across CAD tools.',
  },
  {
    name: 'IEC CDD',
    url: 'https://cdd.iec.ch',
    logo: '/logos/iec-logo.svg',
    description: 'The IEC Common Data Dictionary is the central repository of standardized units for industrial automation. Through IEC/TS 62720 and ECLASS, its unit identifiers align 1:1 with UnitsML.',
  },
]

function onLogoClick() {
  wappiRef.value?.show()
}

function copyStepCode() {
  const el = document.createElement('div')
  el.innerHTML = steps[activeStep.value].code
  navigator.clipboard.writeText(el.textContent || '')
  stepCopied.value = true
  setTimeout(() => stepCopied.value = false, 2000)
}

// ── Preview units for CTA ──
const previewUnits = [
  { sym: 'm', name: 'metre', dim: 'L' },
  { sym: 'kg', name: 'kilogram', dim: 'M' },
  { sym: 'N', name: 'newton', dim: 'L·M·T⁻²' },
  { sym: 'Pa', name: 'pascal', dim: 'L⁻¹·M·T⁻²' },
  { sym: 'J', name: 'joule', dim: 'L²·M·T⁻²' },
  { sym: 'W', name: 'watt', dim: 'L²·M·T⁻³' },
]

// ── SI dimensional symbols floating in hero ──
const dimSymbols = [
  { char: 'L', x: '6%', y: '15%', size: 48, duration: '10s', delay: '0s', opacity: 0.05 },
  { char: 'M', x: '85%', y: '12%', size: 44, duration: '12s', delay: '1.5s', opacity: 0.04 },
  { char: 'T', x: '92%', y: '60%', size: 40, duration: '9s', delay: '3s', opacity: 0.05 },
  { char: 'I', x: '4%', y: '65%', size: 52, duration: '11s', delay: '0.5s', opacity: 0.04 },
  { char: 'Θ', x: '72%', y: '8%', size: 36, duration: '8s', delay: '2s', opacity: 0.045 },
  { char: 'N', x: '28%', y: '78%', size: 42, duration: '13s', delay: '4s', opacity: 0.04 },
  { char: 'J', x: '55%', y: '82%', size: 38, duration: '10.5s', delay: '1s', opacity: 0.045 },
]

// ── Static unit pills ──
const unitPills = ['m', 'kg', 's', 'A', 'K', 'mol', 'cd', 'N', 'J', 'W', 'Pa', 'Hz', 'V', 'Ω']

// ── Official BIPM SI Brochure colors for the 7 SI base quantities ──
// Source: BIPM SI Brochure "SI wheel" aspect diagrams
// (metanorma-bipm si-aspect/si-circle-units_*.svg)
const SI_COLORS: Record<string, string> = {
  L:  '#ff671d', // metre, length
  M:  '#ce0e2d', // kilogram, mass
  T:  '#f5a800', // second, time
  I:  '#61a60e', // ampere, electric current
  'Θ': '#005cb9', // kelvin, thermodynamic temperature
  N:  '#c017a2', // mole, amount of substance
  J:  '#410099', // candela, luminous intensity
}

// ── Hero dim-symbol collection game ──
// Seven SI base quantities: Length, Mass, Time, Electric current,
// Thermodynamic temperature, Amount of substance, Luminous intensity.
const DIM_NAMES: Record<string, string> = {
  L: 'Length',
  M: 'Mass',
  T: 'Time',
  I: 'Electric current',
  'Θ': 'Thermodynamic temperature',
  N: 'Amount of substance',
  J: 'Luminous intensity',
}
const collected = ref<Set<string>>(new Set())
const dimHint = ref('')

function loadCollected() {
  try {
    const stored = JSON.parse(localStorage.getItem('unitsml:dims-collected') || '[]')
    collected.value = new Set(stored)
  } catch { /* ignore */ }
}
function saveCollected() {
  try {
    localStorage.setItem('unitsml:dims-collected', JSON.stringify([...collected.value]))
  } catch { /* ignore */ }
}
function onDimClick(d: { char: string }, e: MouseEvent) {
  const ch = d.char
  collected.value.add(ch)
  collected.value = new Set(collected.value)
  saveCollected()
  const name = DIM_NAMES[ch] || ch
  dimHint.value = `${ch}  ·  ${name}  ·  ${collected.value.size}/7 collected`
  window.unitsmlEE?.burst?.(e.clientX, e.clientY, 8, [ch, ch, ch])
  window.unitsmlEE?.toast?.(`Collected: ${name}`, `${collected.value.size} of 7 SI base dimensions`)
  if (collected.value.size === 7) {
    setTimeout(() => {
      window.unitsmlEE?.cascade?.(1.3)
      window.unitsmlEE?.mark?.('si-master', 'Master of Dimensions', 'You collected all seven SI base quantities.')
    }, 350)
  }
}

// ── String legend (shown under the wireframe logo) ──
// Each entry maps a wireframe string to its SI Brochure color, its SI base
// unit/quantity, and its musical frequency in hertz (the SI derived unit of
// frequency, Hz = s⁻¹).
const STRING_LEGEND = [
  { note: 'C5', freq: 523.25, color: '#f5a800', symbol: 's',   name: 'second',          qty: 'Time' },
  { note: 'A4', freq: 440.00, color: '#ff671d', symbol: 'm',   name: 'metre',            qty: 'Length' },
  { note: 'G4', freq: 392.00, color: '#ce0e2d', symbol: 'kg',  name: 'kilogram',         qty: 'Mass' },
  { note: 'F4', freq: 349.23, color: '#c017a2', symbol: 'mol', name: 'mole',             qty: 'Amount of substance' },
  { note: 'E4', freq: 329.63, color: '#410099', symbol: 'cd',  name: 'candela',          qty: 'Luminous intensity' },
  { note: 'D4', freq: 293.66, color: '#005cb9', symbol: 'K',   name: 'kelvin',           qty: 'Thermodynamic temperature' },
  { note: 'C4', freq: 261.63, color: '#61a60e', symbol: 'A',   name: 'ampere',           qty: 'Electric current' },
]

// Speed of sound at 20 °C in dry air — used for wavelength calculations.
const SPEED_OF_SOUND_M_S = 343

type LiveReadout = {
  noteName: string
  freqHz: number
  periodMs: number
  wavelengthCm: number
  midi: number
  color: string
  symbol: string
  qty: string
  siName: string
}

const live = ref<LiveReadout | null>(null)

function noteFreqByName(name: string): number | null {
  const item = STRING_LEGEND.find(s => s.note === name)
  return item ? item.freq : null
}

function midiForFreq(freq: number): number {
  return Math.round(69 + 12 * Math.log2(freq / 440))
}

function showReadoutForIndex(idx: number) {
  if (idx < 0 || idx >= STRING_LEGEND.length) return
  const item = STRING_LEGEND[idx]
  const freqHz = item.freq
  live.value = {
    noteName: item.note,
    freqHz,
    periodMs: 1000 / freqHz,
    wavelengthCm: (SPEED_OF_SOUND_M_S / freqHz) * 100,
    midi: midiForFreq(freqHz),
    color: item.color,
    symbol: item.symbol,
    qty: item.qty,
    siName: item.name,
  }
}

function onStrumEvent(e: Event) {
  const ce = e as CustomEvent<{ idx: number }>
  const idx = ce.detail?.idx
  if (typeof idx === 'number') showReadoutForIndex(idx)
}

const showReadout = ref(false)
const READOUT_KEY = 'unitsml:sound-readout-open'

function loadReadoutPref() {
  try {
    showReadout.value = localStorage.getItem(READOUT_KEY) === '1'
  } catch { /* ignore */ }
}
function saveReadoutPref() {
  try {
    localStorage.setItem(READOUT_KEY, showReadout.value ? '1' : '0')
  } catch { /* ignore */ }
}
function toggleReadout() {
  showReadout.value = !showReadout.value
  saveReadoutPref()
}

function onLegendClick(i: number, item: { note: string; freq: number; color: string; symbol: string; name: string; qty: string }, e: MouseEvent) {
  showReadoutForIndex(i)
  // Open the readout panel when a legend item is clicked
  if (!showReadout.value) {
    showReadout.value = true
    saveReadoutPref()
  }
  try {
    window.unitsmlEE?.burst?.(e.clientX, e.clientY, 8, [item.symbol, item.symbol, item.note])
  } catch { /* ignore */ }
}


// ── Units Song melody picker ──
const MELODY_META = ref<Array<{ id: string; name: string; technique: string; voice: string }>>([])
const playing = ref<string>('')
let pickerLoaded = false
function loadMelodies() {
  if (pickerLoaded) return
  pickerLoaded = true
  const list = window.unitsmlEE?.melodies?.()
  if (list) MELODY_META.value = list
}
function playSong(id: string) {
  loadMelodies()
  window.unitsmlEE?.playMelody?.(id)
  playing.value = id
  const m = MELODY_META.value.find(x => x.id === id)
  if (m) window.unitsmlEE?.mark?.(`song-${id}-btn`, m.name, m.technique)
  setTimeout(() => { if (playing.value === id) playing.value = '' }, 3000)
}


// ── UnitsDB stat counters (WAAPI count-up on scroll into view) ──
const statRefs = ref<HTMLElement[]>([])
const setStatRef = (el: Element | unknown, _index: number) => {
  if (el && el instanceof HTMLElement) statRefs.value.push(el)
}
let statObserver: IntersectionObserver | null = null
let statsAnimated = false

function animateCount(el: HTMLElement, target: number, duration = 1400) {
  const start = performance.now()
  const ease = (t: number) => 1 - Math.pow(1 - t, 3) // ease-out-cubic
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration)
    const v = Math.round(target * ease(t))
    el.textContent = String(v)
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

onMounted(() => {
  if (statsAnimated) return
  loadCollected()
  loadMelodies()
  loadReadoutPref()
  window.addEventListener('unitsml:strum', onStrumEvent as EventListener)
  nextTick(() => {
    if (typeof IntersectionObserver === 'undefined') return
    statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true
          statRefs.value.forEach(el => {
            const target = parseInt(el.dataset.count || '0', 10)
            if (target > 0) animateCount(el, target, 1400)
          })
          statObserver?.disconnect()
        }
      })
    }, { threshold: 0.4 })
    statRefs.value.forEach(el => statObserver?.observe(el))
  })
})

onUnmounted(() => {
  statObserver?.disconnect()
  window.removeEventListener('unitsml:strum', onStrumEvent as EventListener)
})

</script>

<template>
  <!-- ═══════════════════════════════════════════════════════
       HERO
       ═══════════════════════════════════════════════════════ -->
  <div class="home-hero">
    <div class="hero-grid-bg"></div>
    <div class="hero-glow"></div>
    <div class="hero-glow-2"></div>

    <!-- Floating SI dimensional symbols — click to collect all seven -->
    <div class="hero-dims">
      <span
        v-for="d in dimSymbols"
        :key="d.char"
        class="hero-dim"
        :class="{ 'is-collected': collected.has(d.char) }"
        :style="{
          left: d.x,
          top: d.y,
          fontSize: d.size + 'px',
          animationDuration: d.duration,
          animationDelay: d.delay,
          color: SI_COLORS[d.char],
          opacity: collected.has(d.char) ? 0.22 : (d.opacity ? d.opacity * 1.4 : 0.7),
        }"
        :title="`${d.char} — ${DIM_NAMES[d.char] || ''}`"
        tabindex="0"
        role="button"
        :aria-label="`Collect ${DIM_NAMES[d.char] || d.char}`"
        @click="onDimClick(d, $event)"
        @keydown.enter="onDimClick(d, $event)"
      >{{ d.char }}</span>
    </div>
    <div v-if="collected.size > 0" class="hero-dim-counter" aria-live="polite">
      <span class="counter-pill">
        <span class="counter-dots" aria-hidden="true">
          <span
            v-for="(ch, i) in ['L', 'M', 'T', 'I', 'Θ', 'N', 'J']"
            :key="i"
            class="counter-dot"
            :class="{ 'is-on': collected.has(ch) }"
            :style="{ background: collected.has(ch) ? SI_COLORS[ch] : 'transparent', borderColor: SI_COLORS[ch] }"
          >{{ ch }}</span>
        </span>
        <span class="counter-count">{{ collected.size }}<span class="counter-of">/7</span></span>
        <span class="counter-label">SI dimensions</span>
      </span>
      <span v-if="dimHint" class="counter-hint">{{ dimHint }}</span>
    </div>

    <div
      class="home-hero-logo-wrap"
      @click="onLogoClick"
    >
      <Logo3DWireframe client:load />
    </div>

    <!-- String legend + Units Song players -->
    <div class="string-legend" aria-label="Wireframe string pitches">
      <span class="legend-eyebrow">Each wireframe edge is a string — frequency in hertz (Hz = s⁻¹)</span>
      <div class="legend-items">
        <button
          v-for="(item, i) in STRING_LEGEND"
          :key="i"
          type="button"
          class="legend-item"
          :class="{ 'is-active': live?.noteName === item.note }"
          :title="`${item.note}  ·  ${item.freq.toFixed(2)} Hz  ·  ${item.symbol}  ·  ${item.name}`"
          @click="onLegendClick(i, item, $event)"
        >
          <span class="legend-swatch" :style="{ background: item.color, boxShadow: `0 0 8px ${item.color}` }"></span>
          <span class="legend-note">{{ item.note }}</span>
          <span class="legend-freq">{{ item.freq.toFixed(2) }} Hz</span>
          <span class="legend-symbol">{{ item.symbol }}</span>
        </button>
      </div>

      <!-- Sounds-have-units educational readout (toggled by 🎵 emoji) -->
      <div class="readout-toggle-row">
        <button
          type="button"
          class="readout-toggle"
          :class="{ 'is-open': showReadout }"
          :aria-expanded="showReadout"
          aria-controls="sound-readout-panel"
          @click="toggleReadout"
          title="Show / hide the sound-units readout"
        >
          <span class="readout-toggle-icon" aria-hidden="true">{{ showReadout ? '🎼' : '🎵' }}</span>
          <span class="readout-toggle-text">{{ showReadout ? 'Hide sound units' : 'Sounds have units — show me' }}</span>
        </button>
      </div>

      <transition name="readout-collapse">
        <div v-show="showReadout" id="sound-readout-panel" class="sound-readout" :class="{ 'is-live': !!live }">
          <div class="readout-banner">
            <span class="readout-eyebrow">🎵 Sounds have units too</span>
            <p>Every pitch is a <strong>frequency</strong> in <strong>hertz (Hz = s⁻¹)</strong>. The same sound also has a <strong>wavelength</strong> in metres, a <strong>period</strong> in seconds, and a <strong>pressure</strong> in pascals (Pa = kg·m⁻¹·s⁻²). Strum a string to see its physics.</p>
          </div>

          <div v-if="live" class="readout-body">
            <div class="readout-headline">
              <span class="readout-note" :style="{ color: live.color }">{{ live.noteName }}</span>
              <span class="readout-paren">
                mapped to <code>{{ live.symbol }}</code> · {{ live.qty }} · SI: {{ live.siName }}
              </span>
            </div>
            <div class="readout-grid">
              <div class="readout-cell">
                <span class="cell-value">{{ live.freqHz.toFixed(2) }}</span>
                <span class="cell-unit">Hz</span>
                <span class="cell-label">Frequency · s⁻¹ (cycles per second)</span>
              </div>
              <div class="readout-cell">
                <span class="cell-value">{{ live.periodMs.toFixed(3) }}</span>
                <span class="cell-unit">ms</span>
                <span class="cell-label">Period (1/f) · 10⁻³ s</span>
              </div>
              <div class="readout-cell">
                <span class="cell-value">{{ live.wavelengthCm.toFixed(1) }}</span>
                <span class="cell-unit">cm</span>
                <span class="cell-label">Wavelength λ = c/f · 10⁻² m</span>
              </div>
              <div class="readout-cell">
                <span class="cell-value">{{ live.midi }}</span>
                <span class="cell-unit">MIDI</span>
                <span class="cell-label">MIDI note number (A4 = 69)</span>
              </div>
            </div>
            <div class="readout-footer">
              <span>Reference: <strong>c</strong> = 343 m·s⁻¹ (speed of sound, air at 20 °C) · <strong>A4 = 440 Hz</strong> is the international concert pitch (ISO 16:1975) · an octave doubles the frequency, a semitone multiplies by 2<sup>1/12</sup>.</span>
            </div>
          </div>
          <div v-else class="readout-empty">
            <span>Strum a string, click a legend item, or play a melody below — the readout updates live.</span>
          </div>
        </div>
      </transition>

      <div class="legend-buttons">
        <button
          v-for="m in MELODY_META"
          :key="m.id"
          type="button"
          class="song-btn"
          :class="['voice-' + m.voice, { 'is-playing': playing === m.id }]"
          @click="playSong(m.id)"
        >
          <span
            class="voice-dot"
            :class="'voice-dot-' + m.voice"
            :title="m.voice + ' voice'"
            aria-hidden="true"
          ></span>
          <span class="song-btn-name">{{ m.name }}</span>
          <span class="song-btn-tech">{{ m.technique }}</span>
        </button>
      </div>
    </div>

    <h1>
      Unambiguous models for
      <span class="accent">scientific units of measure</span>
    </h1>
    <p class="tagline">
      UnitsML provides a set of models for unambiguously encoding and identifying
      scientific units of measure and quantities — usable in XML and other markup languages,
      improving interoperability across information systems and scientific disciplines.
    </p>
    <div class="home-hero-actions">
      <a href="/learn/what-is-unitsml.html" class="btn btn-brand">
        Learn about UnitsML
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
      <a href="/unitsdb/" class="btn btn-teal">Explore UnitsDB</a>
    </div>

    <!-- Static unit pills -->
    <div class="hero-pills" aria-hidden="true">
      <code v-for="u in unitPills" :key="u" class="hero-pill">{{ u }}</code>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════
       ADOPTERS
       ═══════════════════════════════════════════════════════ -->
  <div class="section adopters-section">
    <div class="adopters-header">
      <span class="adopters-label">Trusted by leading standards</span>
      <h2 class="adopters-title">The authoritative unit standard in XML</h2>
      <p class="adopters-subtitle">UnitsML powers mission-critical measurement encoding across shipbuilding, industrial automation, and scientific data exchange.</p>
    </div>
    <div class="adopters-grid">
      <a
        v-for="adopter in adopters"
        :key="adopter.name"
        :href="adopter.url"
        target="_blank"
        rel="noopener"
        class="adopter-card"
      >
        <div class="adopter-logo">
          <img :src="adopter.logo" :alt="adopter.name" />
        </div>
        <div class="adopter-body">
          <h3>{{ adopter.name }}</h3>
          <p>{{ adopter.description }}</p>
          <span class="adopter-link">Learn more &rarr;</span>
        </div>
      </a>
    </div>
    <a href="/who-uses-unitsml.html" class="adopters-cta">See all adopters &rarr;</a>
  </div>

  <!-- ═══════════════════════════════════════════════════════
       UNITSDB CTA
       ═══════════════════════════════════════════════════════ -->
  <div class="section">
    <div class="unitsdb-cta-card">
      <div class="cta-text">
        <h2>Browse UnitsDB</h2>
        <p>Explore the complete database of <strong>380+ units</strong>, 199 quantities, 92 dimensions, and more — all with interactive search, cross-linking, and JSON-LD downloads.</p>
        <div class="cta-types">
          <span class="cta-type-chip"><strong :ref="(el) => setStatRef(el, 0)" data-count="380">0</strong> Units</span>
          <span class="cta-type-chip"><strong :ref="(el) => setStatRef(el, 1)" data-count="199">0</strong> Quantities</span>
          <span class="cta-type-chip"><strong :ref="(el) => setStatRef(el, 2)" data-count="92">0</strong> Dimensions</span>
          <span class="cta-type-chip"><strong :ref="(el) => setStatRef(el, 3)" data-count="33">0</strong> Prefixes</span>
          <span class="cta-type-chip"><strong :ref="(el) => setStatRef(el, 4)" data-count="7">0</strong> Systems</span>
        </div>
        <a href="/unitsdb/" class="btn btn-teal" style="margin-top: 1.25rem;">
          Open UnitsDB
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
      <div class="cta-preview">
        <div class="preview-window">
          <div class="preview-bar">
            <span></span><span></span><span></span>
          </div>
          <div class="preview-content">
            <div class="preview-row" v-for="u in previewUnits" :key="u.sym">
              <code class="preview-sym">{{ u.sym }}</code>
              <span class="preview-name">{{ u.name }}</span>
              <span class="preview-dim">{{ u.dim }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════
       ECOSYSTEM DIAGRAM
       ═══════════════════════════════════════════════════════ -->
  <div class="section">
    <div class="section-header">
      <h2>The UnitsML Ecosystem</h2>
      <p>An integrated suite of schemas, databases, and tools for encoding scientific units of measure.</p>
      <div class="section-divider"></div>
    </div>
    <EcosystemDiagram />
  </div>

  <!-- ═══════════════════════════════════════════════════════
       HOW UNITSML WORKS
       ═══════════════════════════════════════════════════════ -->
  <div class="section">
    <div class="section-header">
      <h2>How UnitsML Works</h2>
      <p>Three steps to unambiguous unit encoding in scientific data.</p>
      <div class="section-divider"></div>
    </div>
    <div class="steps-layout">
      <div class="steps-tabs">
        <button
          v-for="(step, i) in steps"
          :key="step.num"
          class="step-tab"
          :class="{ active: activeStep === i }"
          @click="activeStep = i"
        >
          <span class="step-tab-num">{{ step.num }}</span>
          <span class="step-tab-text">
            <strong>{{ step.title }}</strong>
            <span>{{ step.desc }}</span>
          </span>
        </button>
      </div>
      <div class="steps-code-panel">
        <Transition name="step-fade" mode="out-in">
          <div class="step-code" :key="activeStep">
            <div class="code-header">
              <span class="code-lang">{{ steps[activeStep].lang || 'XML' }}</span>
              <div class="code-actions">
                <button class="code-copy-btn" @click="copyStepCode" :title="stepCopied ? 'Copied!' : 'Copy code'">
                  <svg v-if="!stepCopied" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                  <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
                </button>
                <div class="code-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
            <pre><code><span v-html="steps[activeStep].code"></span></code></pre>
          </div>
        </Transition>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════
       CTA STRIP
       ═══════════════════════════════════════════════════════ -->
  <div class="section">
    <div class="cta-strip">
      <a href="/schemas.html" class="cta-strip-card">
        <div class="cta-strip-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        </div>
        <h4>Schemas</h4>
        <p>UnitsML XML Schemas (XSD) and UnitsDB YAML schemas for encoding units of measure.</p>
        <span class="cta-strip-link">Browse schemas →</span>
      </a>
      <a href="/software/" class="cta-strip-card">
        <div class="cta-strip-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        </div>
        <h4>Software</h4>
        <p>Ruby gems and libraries for programmatic access to UnitsDB and UnitsML data.</p>
        <span class="cta-strip-link">View software →</span>
      </a>
      <a href="/learn/what-is-unitsml.html" class="cta-strip-card">
        <div class="cta-strip-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
        </div>
        <h4>Learn</h4>
        <p>Understand what UnitsML is, how it works, and how to incorporate it into your projects.</p>
        <span class="cta-strip-link">Start learning →</span>
      </a>
    </div>
  </div>

  <WappiMascot ref="wappiRef" />
</template>

<style scoped>
/* ── Hero ── */
.hero-grid-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(45,44,105,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(45,44,105,0.06) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent);
}

.hero-glow {
  position: absolute;
  top: -20%;
  left: 50%;
  transform: translateX(-50%);
  width: 700px;
  height: 500px;
  background: radial-gradient(ellipse, rgba(48, 223, 192, 0.10) 0%, transparent 70%);
  pointer-events: none;
}

.hero-glow-2 {
  position: absolute;
  bottom: -10%;
  right: -5%;
  width: 500px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(87, 160, 254, 0.07) 0%, transparent 70%);
  pointer-events: none;
}

/* ── SI dimensional symbols ── */
.hero-dims {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.hero-dim {
  position: absolute;
  font-family: Georgia, 'Times New Roman', serif;
  font-weight: 600;
  line-height: 1;
  animation: float-dim 8s ease-in-out infinite;
  user-select: none;
  cursor: pointer;
  pointer-events: auto;
  transition: opacity 0.35s ease, color 0.25s ease, transform 0.25s ease, text-shadow 0.25s ease;
  padding: 0.25rem;
}
.hero-dim:hover,
.hero-dim:focus-visible {
  opacity: 1 !important;
  outline: none;
  transform: scale(1.25);
  text-shadow: 0 0 14px currentColor, 0 0 28px currentColor;
}
.hero-dim.is-collected {
  text-decoration: line-through;
  text-decoration-color: var(--unitsml-teal);
  text-decoration-thickness: 2px;
}

@keyframes float-dim {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* ── Static unit pills ── */
.hero-pills {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
  position: relative;
}

.hero-pill {
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-3);
  opacity: 0.5;
  transition: opacity 0.2s;
}

.hero-pill:hover {
  opacity: 0.8;
}

/* ── String legend ── */
.string-legend {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
  margin: 0 auto 1.5rem;
  padding: 0.75rem 1rem;
  position: relative;
  z-index: 5;
}
.legend-eyebrow {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--vp-c-text-3);
}
.legend-items {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem;
}
.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-family: 'JetBrains Mono', 'SF Mono', ui-monospace, monospace;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}
.legend-item:hover, .legend-item.is-active {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
  color: var(--vp-c-text-1);
}
.legend-item.is-active .legend-swatch {
  transform: scale(1.2);
}
.legend-swatch {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  transition: transform 0.2s ease;
}
.legend-note {
  font-weight: 700;
  color: var(--vp-c-text-1);
  font-family: 'JetBrains Mono', 'SF Mono', ui-monospace, monospace;
}
.legend-freq {
  color: var(--vp-c-text-3);
  font-family: 'JetBrains Mono', 'SF Mono', ui-monospace, monospace;
  font-size: 0.6875rem;
}
.legend-symbol {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

/* ── Sounds-have-units educational readout ── */
.readout-toggle-row {
  display: flex;
  justify-content: center;
  width: 100%;
}
.readout-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.875rem;
  font-size: 0.75rem;
  font-family: inherit;
  font-weight: 600;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.2s ease;
}
.readout-toggle:hover {
  transform: translateY(-1px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 14px rgba(45, 44, 105, 0.10);
}
.readout-toggle-icon {
  font-size: 1rem;
  line-height: 1;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.readout-toggle:hover .readout-toggle-icon {
  transform: rotate(-12deg) scale(1.15);
}
.readout-toggle.is-open {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.readout-toggle.is-open .readout-toggle-icon {
  animation: readout-wiggle 1.8s ease-in-out infinite;
}
@keyframes readout-wiggle {
  0%, 100% { transform: rotate(-4deg); }
  50%      { transform: rotate(4deg); }
}

.readout-collapse-enter-active, .readout-collapse-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease, max-height 0.35s ease, margin-top 0.3s ease;
  overflow: hidden;
  max-height: 800px;
}
.readout-collapse-enter-from, .readout-collapse-leave-to {
  opacity: 0;
  transform: translateY(-8px);
  max-height: 0;
  margin-top: -1px !important;
}

.sound-readout {
  width: 100%;
  max-width: 720px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
  transition: border-color 0.3s ease;
  margin-top: 0.625rem;
}
.sound-readout.is-live {
  border-color: rgba(48, 223, 192, 0.4);
}
.readout-banner {
  padding: 0.875rem 1rem;
  background: linear-gradient(135deg, rgba(245,168,0,0.06), rgba(87,160,254,0.06));
  border-bottom: 1px solid var(--vp-c-divider);
}
.readout-eyebrow {
  display: block;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--vp-c-brand-1);
  margin-bottom: 0.375rem;
}
.readout-banner p {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.55;
  color: var(--vp-c-text-2);
}
.readout-banner strong {
  color: var(--vp-c-text-1);
  font-weight: 700;
}
.readout-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}
.readout-headline {
  display: flex;
  align-items: baseline;
  gap: 0.625rem;
  flex-wrap: wrap;
}
.readout-note {
  font-family: 'JetBrains Mono', 'SF Mono', ui-monospace, monospace;
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1;
}
.readout-paren {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
}
.readout-paren code {
  font-family: 'JetBrains Mono', 'SF Mono', ui-monospace, monospace;
  padding: 0.0625rem 0.3125rem;
  border-radius: 4px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  font-size: 0.75rem;
  color: var(--vp-c-text-1);
}
.readout-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.625rem;
}
.readout-cell {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.625rem 0.75rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
}
.cell-value {
  font-family: 'JetBrains Mono', 'SF Mono', ui-monospace, monospace;
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1.1;
}
.cell-unit {
  font-family: 'JetBrains Mono', 'SF Mono', ui-monospace, monospace;
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  letter-spacing: 0.05em;
  margin-top: -0.25rem;
}
.cell-label {
  font-size: 0.6875rem;
  color: var(--vp-c-text-3);
  line-height: 1.4;
}
.readout-footer {
  font-size: 0.6875rem;
  color: var(--vp-c-text-3);
  line-height: 1.55;
  padding-top: 0.625rem;
  border-top: 1px solid var(--vp-c-divider);
}
.readout-footer strong {
  color: var(--vp-c-text-2);
  font-weight: 600;
}
.readout-empty {
  padding: 1rem;
  font-size: 0.8125rem;
  color: var(--vp-c-text-3);
  text-align: center;
  font-style: italic;
}
.legend-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
  width: 100%;
  max-width: 720px;
}
.song-btn {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas:
    "dot name"
    "dot tech";
  align-items: center;
  gap: 0 0.5rem;
  padding: 0.55rem 0.875rem;
  font-size: 0.75rem;
  font-family: inherit;
  text-align: left;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.2s ease;
}
.song-btn:hover {
  transform: translateY(-1px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 14px rgba(45, 44, 105, 0.10);
}
.song-btn.is-playing {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft), 0 4px 14px rgba(45, 44, 105, 0.14);
}
.voice-dot {
  grid-area: dot;
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  align-self: center;
  margin-top: 2px;
}
.voice-dot-piano { background: #f5a800; box-shadow: 0 0 6px #f5a800; }
.voice-dot-electronic { background: #57a0fe; box-shadow: 0 0 6px #57a0fe; }
.voice-dot-bell { background: #c017a2; box-shadow: 0 0 6px #c017a2; }
.song-btn-name {
  grid-area: name;
  font-weight: 700;
  letter-spacing: 0.005em;
}
.song-btn-tech {
  grid-area: tech;
  font-size: 0.6875rem;
  color: var(--vp-c-text-3);
  line-height: 1.35;
}

/* ── Hero dim collection counter ── */
.hero-dim-counter {
  position: relative;
  margin: 1.5rem auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  z-index: 5;
}
.counter-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.875rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  font-size: 0.8125rem;
  box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset, 0 2px 10px rgba(45,44,105,0.06);
}
.counter-dots {
  display: inline-flex;
  gap: 0.25rem;
  align-items: center;
}
.counter-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid currentColor;
  font-size: 0.5625rem;
  font-family: Georgia, 'Times New Roman', serif;
  font-weight: 600;
  color: var(--vp-c-text-3);
  background: transparent;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.counter-dot.is-on {
  color: white;
  box-shadow: 0 0 8px currentColor, 0 0 0 2px rgba(255,255,255,0.7) inset;
  transform: scale(1.1);
}
.counter-count {
  font-family: 'JetBrains Mono', 'SF Mono', ui-monospace, monospace;
  font-weight: 800;
  color: var(--unitsml-navy);
  font-size: 0.9375rem;
  letter-spacing: -0.02em;
}
.counter-of {
  color: var(--vp-c-text-3);
  font-weight: 500;
  margin-left: 1px;
}
.counter-label {
  color: var(--vp-c-text-2);
  font-weight: 500;
}
.counter-hint {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  font-family: 'JetBrains Mono', 'SF Mono', ui-monospace, monospace;
  letter-spacing: 0.02em;
}
@media (prefers-reduced-motion: reduce) {
  .hero-dim { animation: none !important; }
}

/* ── Hero accent gradient animation ── */
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

/* ── Hero logo wrapper & tooltip ── */
.home-hero-logo-wrap {
  position: relative;
  display: block;
  width: 100%;
  margin: 0 auto 2.5rem;
  cursor: pointer;
}

.home-hero-logo {
  transition: opacity 0.3s ease;
}

.home-hero-logo-wrap:hover .home-hero-logo {
  opacity: 0.95;
}

/* ── UnitsDB CTA ── */
.unitsdb-cta-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  padding: 3rem;
  background: var(--unitsml-navy-dark);
  border-radius: 20px;
  color: white;
  position: relative;
  overflow: hidden;
}
.unitsdb-cta-card::after {
  content: '';
  position: absolute;
  top: -30%;
  right: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(48, 223, 192, 0.10) 0%, transparent 70%);
  pointer-events: none;
}
.cta-text {
  position: relative;
  z-index: 1;
}
.cta-text h2 {
  color: white;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
}
.cta-text p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  line-height: 1.65;
  margin-bottom: 1rem;
}
.cta-text p strong {
  color: var(--unitsml-teal-light);
}
.cta-types {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.cta-type-chip {
  font-size: 0.8125rem;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.10);
  color: rgba(255, 255, 255, 0.7);
}
.cta-type-chip strong {
  color: white;
}
.cta-preview {
  position: relative;
  z-index: 1;
}
.preview-window {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
}
.preview-bar {
  display: flex;
  gap: 5px;
  padding: 0.625rem 0.875rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.preview-bar span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}
.preview-bar span:nth-child(1) { background: #ff5f57; }
.preview-bar span:nth-child(2) { background: #febc2e; }
.preview-bar span:nth-child(3) { background: #28c840; }
.preview-content {
  padding: 0.75rem 1rem;
}
.preview-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.4rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  font-size: 0.8125rem;
}
.preview-row:last-child { border-bottom: none; }
.preview-sym {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--unitsml-teal-light);
  background: rgba(48, 223, 192, 0.12);
  padding: 0.1em 0.4em;
  border-radius: 3px;
  min-width: 28px;
  text-align: center;
}
.preview-name {
  color: rgba(255, 255, 255, 0.8);
  flex: 1;
}
.preview-dim {
  font-size: 0.75rem;
  font-family: 'JetBrains Mono', 'SF Mono', monospace;
  color: rgba(255, 255, 255, 0.4);
}

@media (max-width: 768px) {
  .unitsdb-cta-card {
    grid-template-columns: 1fr;
    padding: 1.5rem;
    gap: 2rem;
  }
}

/* ── Steps ── */
.steps-layout {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 1.5rem;
  margin: 2rem 0;
  align-items: start;
}

.steps-tabs {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.step-tab {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  text-align: left;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  transition: all 0.3s ease;
}

.step-tab:hover {
  border-color: var(--unitsml-navy);
  box-shadow: 0 2px 12px rgba(45, 44, 105, 0.06);
}

.step-tab.active {
  border-color: var(--unitsml-teal);
  background: var(--vp-c-bg);
  box-shadow: 0 4px 16px rgba(48, 223, 192, 0.08);
}

.step-tab-num {
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(135deg, var(--unitsml-navy), rgba(45, 44, 105, 0.3));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.4s ease;
  flex-shrink: 0;
  width: 2.5rem;
}

.step-tab.active .step-tab-num {
  background: linear-gradient(135deg, var(--unitsml-teal), var(--unitsml-blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: step-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes step-pop {
  0% { transform: scale(0.9); }
  100% { transform: scale(1); }
}

.step-tab-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.step-tab-text strong {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.step-tab-text span {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.steps-code-panel {
  position: sticky;
  top: 80px;
}

.step-code {
  background: var(--unitsml-navy-dark);
  border-radius: 12px;
  overflow: hidden;
  min-height: 260px;
}

/* Step fade transition */
.step-fade-enter-active,
.step-fade-leave-active { transition: opacity 0.2s ease; }
.step-fade-enter-from,
.step-fade-leave-to { opacity: 0; }

.code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.code-lang {
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--unitsml-teal);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.code-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.code-copy-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  color: rgba(255,255,255,0.3);
  transition: color 0.15s;
}

.code-copy-btn:hover {
  color: rgba(255,255,255,0.7);
}

.code-dots {
  display: flex;
  gap: 5px;
}

.code-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
}

.code-dots span:nth-child(1) { background: #ff5f57; }
.code-dots span:nth-child(2) { background: #febc2e; }
.code-dots span:nth-child(3) { background: #28c840; }

.step-code pre {
  margin: 0;
  padding: 1rem;
  overflow-x: auto;
}

.step-code code {
  font-size: 0.75rem;
  line-height: 1.7;
  font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', Consolas, monospace;
}

.step-code :deep(.xml-tag) { color: #e06c75; }
.step-code :deep(.xml-attr) { color: #d19a66; }
.step-code :deep(.xml-val) { color: #98c379; }
.step-code :deep(.xml-comment) { color: #5c6370; font-style: italic; }

/* ── Adopters ── */
.adopters-section {
  text-align: center;
  padding: 3.5rem 2rem;
  background: linear-gradient(135deg, var(--vp-c-bg-soft) 0%, var(--vp-c-bg) 100%);
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  margin: 2rem auto;
}

.adopters-header {
  max-width: 640px;
  margin: 0 auto 2.5rem;
}

.adopters-label {
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--unitsml-teal-dark);
  margin-bottom: 0.75rem;
  display: block;
}

.adopters-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 0.75rem;
  letter-spacing: -0.02em;
}

.adopters-subtitle {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
}

.adopters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto 1.5rem;
}

.adopter-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.75rem 1.5rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.adopter-card:hover {
  border-color: var(--unitsml-navy);
  box-shadow: 0 12px 40px rgba(45, 44, 105, 0.12);
  transform: translateY(-3px);
}

.adopter-logo {
  width: 100px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.adopter-logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.adopter-body h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 0.5rem;
}

.adopter-body p {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0 0 0.75rem;
}

.adopter-link {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.adopter-card:hover .adopter-link {
  color: var(--unitsml-teal-dark);
}

.adopters-cta {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.adopters-cta:hover {
  color: var(--unitsml-teal-dark);
  text-decoration: underline;
}

@media (max-width: 640px) {
  .adopters-title {
    font-size: 1.5rem;
  }

  .adopters-grid {
    grid-template-columns: 1fr;
  }
}

/* ── CTA Strip ── */
.cta-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.cta-strip-card {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cta-strip-card:hover {
  border-color: var(--unitsml-navy);
  box-shadow: 0 8px 30px rgba(45, 44, 105, 0.10);
  transform: translateY(-2px);
}

.cta-strip-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, rgba(45, 44, 105, 0.08), rgba(87, 160, 254, 0.08));
  color: var(--unitsml-navy);
}

.cta-strip-card h4 {
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
}

.cta-strip-card p {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 1rem;
  flex: 1;
}

.cta-strip-link {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  transition: color 0.2s;
}

.cta-strip-card:hover .cta-strip-link {
  color: var(--unitsml-teal-dark);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .steps-layout {
    grid-template-columns: 1fr;
  }

  .steps-code-panel {
    position: static;
    overflow: hidden;
  }

  .cta-strip {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-dim { animation: none !important; }
  .home-hero h1 .accent { animation: none !important; }
  .step-tab.active .step-tab-num { animation: none !important; }
}
</style>
