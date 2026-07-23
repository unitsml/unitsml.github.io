<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

const POOL = ['m', 'kg', 's', 'A', 'K', 'mol', 'cd', 'N', 'J', 'W', 'Pa', 'Hz', 'V', 'Ω', 'C', 'F', 'S', 'Wb', 'T', 'H', 'lm', 'lx', 'L', 'M', 'T', 'I', 'Θ', 'N', 'J']

// Official BIPM SI Brochure colors for the 7 SI base units/quantities
// (si-circle-units_*.svg from metanorma-bipm)
const SI_COLORS: Record<string, string> = {
  m:   '#ff671d', // metre (L)
  kg:  '#ce0e2d', // kilogram (M)
  s:   '#f5a800', // second (T)
  A:   '#61a60e', // ampere (I)
  K:   '#005cb9', // kelvin (Θ)
  mol: '#c017a2', // mole (N)
  cd:  '#410099', // candela (J)
  L:   '#ff671d',
  M:   '#ce0e2d',
  T:   '#f5a800',
  I:   '#61a60e',
  'Θ': '#005cb9',
  N:   '#c017a2',
  J:   '#410099',
}
const FALLBACK_COLORS = ['#2d2c69', '#30dfc0', '#57a0fe', '#14b8a6', '#5eead4', '#6e6dba', '#83cee8']

function colorFor(sym: string): string {
  return SI_COLORS[sym] ?? FALLBACK_COLORS[Math.floor(Math.random() * FALLBACK_COLORS.length)]
}

type SiUnitFact = {
  id: string
  word: string
  symbol: string
  name: string
  quantity: string
  dimension: string
  color: string
  definition: string
  constantSym: string
  constantName: string
  constantValue: string
}

const SI_UNITS: SiUnitFact[] = [
  {
    id: 'meter',
    word: 'meter',
    symbol: 'm',
    name: 'metre',
    quantity: 'Length',
    dimension: 'L',
    color: '#ff671d',
    definition: 'The metre is the length of the path travelled by light in vacuum during a time interval of 1/299,792,458 of a second.',
    constantSym: 'c',
    constantName: 'speed of light in vacuum',
    constantValue: '299 792 458 m s⁻¹',
  },
  {
    id: 'kilogram',
    word: 'kilogram',
    symbol: 'kg',
    name: 'kilogram',
    quantity: 'Mass',
    dimension: 'M',
    color: '#ce0e2d',
    definition: 'The kilogram is defined by taking the fixed numerical value of the Planck constant h to be 6.626 070 15 × 10⁻³⁴ when expressed in the unit J s.',
    constantSym: 'h',
    constantName: 'Planck constant',
    constantValue: '6.626 070 15 × 10⁻³⁴ J s',
  },
  {
    id: 'second',
    word: 'second',
    symbol: 's',
    name: 'second',
    quantity: 'Time',
    dimension: 'T',
    color: '#f5a800',
    definition: 'The second is defined by taking the fixed numerical value of the caesium frequency ΔνCs — the unperturbed ground-state hyperfine transition frequency of the caesium-133 atom.',
    constantSym: 'ΔνCs',
    constantName: 'caesium-133 hyperfine frequency',
    constantValue: '9 192 631 770 Hz',
  },
  {
    id: 'ampere',
    word: 'ampere',
    symbol: 'A',
    name: 'ampere',
    quantity: 'Electric current',
    dimension: 'I',
    color: '#61a60e',
    definition: 'The ampere is defined by taking the fixed numerical value of the elementary charge e to be 1.602 176 634 × 10⁻¹⁹ when expressed in the unit C.',
    constantSym: 'e',
    constantName: 'elementary charge',
    constantValue: '1.602 176 634 × 10⁻¹⁹ C',
  },
  {
    id: 'kelvin',
    word: 'kelvin',
    symbol: 'K',
    name: 'kelvin',
    quantity: 'Thermodynamic temperature',
    dimension: 'Θ',
    color: '#005cb9',
    definition: 'The kelvin is defined by taking the fixed numerical value of the Boltzmann constant k to be 1.380 649 × 10⁻²³ when expressed in the unit J K⁻¹.',
    constantSym: 'k',
    constantName: 'Boltzmann constant',
    constantValue: '1.380 649 × 10⁻²³ J K⁻¹',
  },
  {
    id: 'mole',
    word: 'mole',
    symbol: 'mol',
    name: 'mole',
    quantity: 'Amount of substance',
    dimension: 'N',
    color: '#c017a2',
    definition: 'The mole contains exactly 6.022 140 76 × 10²³ elementary entities — the fixed numerical value of the Avogadro constant N_A.',
    constantSym: 'N_A',
    constantName: 'Avogadro constant',
    constantValue: '6.022 140 76 × 10²³ mol⁻¹',
  },
  {
    id: 'candela',
    word: 'candela',
    symbol: 'cd',
    name: 'candela',
    quantity: 'Luminous intensity',
    dimension: 'J',
    color: '#410099',
    definition: 'The candela is defined by taking the fixed numerical value of the luminous efficacy of monochromatic radiation of frequency 540 × 10¹² Hz, K_cd.',
    constantSym: 'K_cd',
    constantName: 'luminous efficacy (540 THz)',
    constantValue: '683 lm W⁻¹',
  },
]

type OrgFact = {
  id: string
  name: string
  logo: string
  tag: string
  quote: string
  body: string
  color: string
}

const ORGS: Record<string, OrgFact> = {
  nist: {
    id: 'nist',
    name: 'NIST',
    logo: '/logos/nist-logo.svg',
    tag: 'National Institute of Standards and Technology',
    quote: 'UnitsML was born at NIST — the U.S. authority on the SI.',
    body: 'NIST originated the UnitsML project in 1998 through its Physics Laboratory, building the initial schema and UnitsDB to encode scientific units for manufacturing data exchange.',
    color: '#2d2c69',
  },
  oasis: {
    id: 'oasis',
    name: 'OASIS',
    logo: '/logos/oasis-logo.svg',
    tag: 'Organization for the Advancement of Structured Information Standards',
    quote: 'OASIS hosted the UnitsML Technical Committee from 2006 to 2016.',
    body: 'The OASIS TC produced the UnitsML 1.0 Committee Specification Drafts (CSD01–CSD04), refining the schema with light-time units and Avoirdupois prefixes.',
    color: '#57a0fe',
  },
  calconnect: {
    id: 'calconnect',
    name: 'CalConnect',
    logo: '/logos/calconnect-logo.svg',
    tag: 'The Calendaring and Scheduling Consortium',
    quote: 'CalConnect TC UNITS is the current home of UnitsML — since 2022.',
    body: 'TC UNITS maintains the UnitsML specification, oversees UnitsDB development, and pursues international alignment with ISO, IEC, and BIPM toward a globally interoperable Digital SI.',
    color: '#30dfc0',
  },
  bipm: {
    id: 'bipm',
    name: 'BIPM',
    logo: '/logos/bipm-logo.svg',
    tag: 'Bureau International des Poids et Mesures',
    quote: 'The SI Brochure is the foundation UnitsML is built on.',
    body: 'UnitsML cross-references the BIPM SI Digital Framework — the authoritative machine-readable form of the International System of Units maintained by the BIPM.',
    color: '#14b8a6',
  },
  iec: {
    id: 'iec',
    name: 'IEC CDD',
    logo: '/logos/iec-logo.svg',
    tag: 'International Electrotechnical Commission · Common Data Dictionary',
    quote: 'IEC/TS 62720 unit identifiers align 1:1 with UnitsML.',
    body: 'The IEC Common Data Dictionary is the central repository of standardized units for industrial automation, mapped directly to UnitsML through ECLASS.',
    color: '#5eead4',
  },
  ocx: {
    id: 'ocx',
    name: 'OCX',
    logo: '/logos/ocx-logo.svg',
    tag: 'Open Class 3D Exchange',
    quote: 'OCX encodes every hull quantity with UnitsML.',
    body: 'The vessel-specific XML standard for model-based class approval — used by DNV, NAPA, and major shipbuilders to keep hull measurements precise across CAD tools.',
    color: '#6e6dba',
  },
}

const toast = ref<{ visible: boolean; text: string; sub: string }>({ visible: false, text: '', sub: '' })
const orgCard = ref<{ visible: boolean; org: OrgFact | null }>({ visible: false, org: null })
const siCard = ref<{ visible: boolean; unit: SiUnitFact | null }>({ visible: false, unit: null })
let toastTimer: ReturnType<typeof setTimeout> | null = null

let wordBuffer = ''
let wordStart = 0
let wordTimer: ReturnType<typeof setTimeout> | null = null
let layer: HTMLElement | null = null
const discovered = new Set<string>()

function showToast(text: string, sub = '') {
  toast.value = { visible: true, text, sub }
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.value.visible = false
  }, 3200)
}

function showOrgCard(id: string) {
  const org = ORGS[id]
  if (!org) return
  siCard.value.visible = false
  orgCard.value = { visible: true, org }
}

function closeOrgCard() {
  orgCard.value.visible = false
}

function showSiCard(unit: SiUnitFact) {
  orgCard.value.visible = false
  siCard.value = { visible: true, unit }
}

function closeSiCard() {
  siCard.value.visible = false
}

function markDiscovered(id: string, label: string, sub = '') {
  if (discovered.has(id)) return false
  discovered.add(id)
  try {
    const stored = JSON.parse(localStorage.getItem('unitsml:easter-eggs') || '[]')
    if (!stored.includes(id)) {
      stored.push(id)
      localStorage.setItem('unitsml:easter-eggs', JSON.stringify(stored))
    }
  } catch { /* ignore */ }
  showToast(label, sub)
  return true
}

function spawnParticle(x: number, y: number, opts?: { size?: number; color?: string; vx?: number; vy?: number; spin?: number; symbol?: string; duration?: number }) {
  if (!layer) return null
  const sym = opts?.symbol ?? POOL[Math.floor(Math.random() * POOL.length)]
  const color = opts?.color ?? colorFor(sym)
  const size = opts?.size ?? 14 + Math.random() * 22
  const vx = opts?.vx ?? (Math.random() - 0.5) * 120
  const vy = opts?.vy ?? 60 + Math.random() * 140
  const spin = opts?.spin ?? (Math.random() - 0.5) * 720
  const duration = opts?.duration ?? 3200 + Math.random() * 1400

  const el = document.createElement('span')
  el.textContent = sym
  el.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    font-family: 'JetBrains Mono', 'SF Mono', ui-monospace, monospace;
    font-size: ${size}px;
    font-weight: 800;
    color: ${color};
    pointer-events: none;
    z-index: 99999;
    transform: translate(-50%, -50%);
    will-change: transform, opacity;
    text-shadow: 0 0 8px ${color}55, 0 1px 0 rgba(255,255,255,0.4);
    user-select: none;
  `
  layer.appendChild(el)

  const gravity = 380
  const endY = vy * (duration / 1000) + 0.5 * gravity * Math.pow(duration / 1000, 2)

  const anim = el.animate(
    [
      { transform: `translate(-50%, -50%) translate(0px, 0px) rotate(0deg) scale(0.4)`, opacity: 0 },
      { transform: `translate(-50%, -50%) translate(${vx * 0.15}px, ${endY * 0.15}px) rotate(${spin * 0.15}deg) scale(1.1)`, opacity: 1, offset: 0.12 },
      { transform: `translate(-50%, -50%) translate(${vx * 0.85}px, ${endY * 0.85}px) rotate(${spin * 0.85}deg) scale(1)`, opacity: 1, offset: 0.85 },
      { transform: `translate(-50%, -50%) translate(${vx}px, ${endY}px) rotate(${spin}deg) scale(0.6)`, opacity: 0 },
    ],
    { duration, easing: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)', fill: 'forwards' }
  )
  anim.onfinish = () => el.remove()
  return anim
}

function unitCascade(intensity = 1, originX?: number, originY?: number) {
  const count = Math.floor(70 * intensity)
  const w = window.innerWidth
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const x = originX ?? Math.random() * w
      const y = originY ?? -40 - Math.random() * 80
      spawnParticle(x, y, {
        size: 14 + Math.random() * 26,
        vx: (Math.random() - 0.5) * 200,
        vy: 40 + Math.random() * 160,
        spin: (Math.random() - 0.5) * 1080,
        duration: 3000 + Math.random() * 2000,
      })
    }, i * 35)
  }
}

function burst(x: number, y: number, count = 18, symbols?: string[]) {
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3
    const dist = 80 + Math.random() * 160
    spawnParticle(x, y, {
      symbol: symbols?.[i % symbols.length],
      size: 14 + Math.random() * 12,
      vx: Math.cos(angle) * dist,
      vy: Math.sin(angle) * dist - 40,
      spin: (Math.random() - 0.5) * 720,
      duration: 900 + Math.random() * 400,
    })
  }
}

type EE = {
  cascade: (intensity?: number, x?: number, y?: number) => void
  burst: (x: number, y: number, count?: number, symbols?: string[]) => void
  toast: (text: string, sub?: string) => void
  mark: (id: string, label: string, sub?: string) => boolean
  help: () => string
  playMelody: (id: string) => boolean
  melodies: () => Array<{ id: string; name: string; technique: string; voice: VoiceKind }>
}
declare global {
  interface Window {
    unitsmlEE?: EE
    help?: () => string
  }
}

const TRIGGERS: Record<string, () => void> = {}

// ── The Units Song — 3 recognizable melodies, all public-domain compositions ──
// Notes are indices into SCALE_FREQS
// (0=C5 top/gold/s  →  6=C4 bottom/green/A).
// Scale indices for C major: 0=C5, 1=A4, 2=G4, 3=F4, 4=E4, 5=D4, 6=C4.
type VoiceKind = 'piano' | 'electronic' | 'bell'
type Note = { idx: number; t: number; dur: number; vel?: number }
type Melody = {
  id: string
  name: string
  technique: string
  voice: VoiceKind
  notes: Note[]
}

const SCALE_FREQS = [523.25, 440.00, 392.00, 349.23, 329.63, 293.66, 261.63]

const MELODIES: Melody[] = [
  {
    id: 'ode',
    name: 'Ode to Joy',
    technique: 'Beethoven · Symphony No. 9 (1824, public domain)',
    voice: 'piano',
    notes: [
      // Theme from the fourth movement, in C major. Quarter = 0.5s, ~120 BPM.
      { idx: 4, t: 0.00, dur: 0.50 }, // E4
      { idx: 4, t: 0.50, dur: 0.50 },
      { idx: 3, t: 1.00, dur: 0.50 }, // F4
      { idx: 2, t: 1.50, dur: 0.50 }, // G4
      { idx: 2, t: 2.00, dur: 0.50 },
      { idx: 3, t: 2.50, dur: 0.50 },
      { idx: 4, t: 3.00, dur: 0.50 },
      { idx: 5, t: 3.50, dur: 0.50 }, // D4
      { idx: 6, t: 4.00, dur: 0.50 }, // C4
      { idx: 6, t: 4.50, dur: 0.50 },
      { idx: 5, t: 5.00, dur: 0.50 },
      { idx: 4, t: 5.50, dur: 0.50 },
      { idx: 4, t: 6.00, dur: 0.75 }, // dotted quarter
      { idx: 5, t: 6.75, dur: 0.25 }, // eighth
      { idx: 5, t: 7.00, dur: 1.00 }, // half — resolve
    ],
  },
  {
    id: 'grace',
    name: 'Amazing Grace',
    technique: 'John Newton, 1779 · traditional melody (public domain)',
    voice: 'bell',
    notes: [
      // Opening phrase, in C major. Slow 3/4, quarter = 0.6s.
      { idx: 2, t: 0.00, dur: 1.20 }, // G4 — "A-maz-"
      { idx: 4, t: 1.20, dur: 0.60 }, // E4 — "ing"
      { idx: 6, t: 1.80, dur: 0.60 }, // C4 — "grace,"
      { idx: 4, t: 2.40, dur: 0.60 }, // E4 — "how"
      { idx: 2, t: 3.00, dur: 1.20 }, // G4 — "sweet the"
      { idx: 1, t: 4.20, dur: 1.20 }, // A4 — "sound,"
      { idx: 2, t: 5.40, dur: 0.60 }, // G4 — "that"
      { idx: 4, t: 6.00, dur: 0.60 }, // E4 — "saved a"
      { idx: 4, t: 6.60, dur: 1.80 }, // E4 — "wretch like me" (whole)
      { idx: 5, t: 8.40, dur: 1.20 }, // D4 — pickup back
    ],
  },
  {
    id: 'twinkle',
    name: 'Twinkle, Twinkle Little Star',
    technique: 'Traditional French folk · Ah! vous dirai-je, maman (public domain)',
    voice: 'bell',
    notes: [
      // First phrase + B section. Quarter = 0.4s.
      // A section
      { idx: 6, t: 0.00, dur: 0.40 }, // C
      { idx: 6, t: 0.40, dur: 0.40 },
      { idx: 2, t: 0.80, dur: 0.40 }, // G
      { idx: 2, t: 1.20, dur: 0.40 },
      { idx: 1, t: 1.60, dur: 0.40 }, // A
      { idx: 1, t: 2.00, dur: 0.40 },
      { idx: 2, t: 2.40, dur: 0.80 }, // G (half) — "star"
      { idx: 3, t: 3.20, dur: 0.40 }, // F
      { idx: 3, t: 3.60, dur: 0.40 },
      { idx: 4, t: 4.00, dur: 0.40 }, // E
      { idx: 4, t: 4.40, dur: 0.40 },
      { idx: 5, t: 4.80, dur: 0.40 }, // D
      { idx: 5, t: 5.20, dur: 0.40 },
      { idx: 6, t: 5.60, dur: 0.80 }, // C (half) — "are"
      // B section — "Up above the world so high"
      { idx: 2, t: 6.40, dur: 0.40 },
      { idx: 2, t: 6.80, dur: 0.40 },
      { idx: 3, t: 7.20, dur: 0.40 },
      { idx: 3, t: 7.60, dur: 0.40 },
      { idx: 4, t: 8.00, dur: 0.40 },
      { idx: 4, t: 8.40, dur: 0.40 },
      { idx: 5, t: 8.80, dur: 0.80 },
      { idx: 2, t: 9.60, dur: 0.40 },
      { idx: 2, t: 10.00, dur: 0.40 },
      { idx: 3, t: 10.40, dur: 0.40 },
      { idx: 3, t: 10.80, dur: 0.40 },
      { idx: 4, t: 11.20, dur: 0.40 },
      { idx: 4, t: 11.60, dur: 0.40 },
      { idx: 5, t: 12.00, dur: 0.80 },
      // Return to A
      { idx: 6, t: 12.80, dur: 0.40 },
      { idx: 6, t: 13.20, dur: 0.40 },
      { idx: 2, t: 13.60, dur: 0.40 },
      { idx: 2, t: 14.00, dur: 0.40 },
      { idx: 1, t: 14.40, dur: 0.40 },
      { idx: 1, t: 14.80, dur: 0.40 },
      { idx: 2, t: 15.20, dur: 0.80 },
      { idx: 3, t: 16.00, dur: 0.40 },
      { idx: 3, t: 16.40, dur: 0.40 },
      { idx: 4, t: 16.80, dur: 0.40 },
      { idx: 4, t: 17.20, dur: 0.40 },
      { idx: 5, t: 17.60, dur: 0.40 },
      { idx: 5, t: 18.00, dur: 0.40 },
      { idx: 6, t: 18.40, dur: 1.20 },
    ],
  },
]

// Two synth voices — piano and electronic — that share the global AudioContext.
// The local AudioContext is owned here so melodies play even on pages without
// the wireframe logo.
let melodyAudio: AudioContext | null = null
let melodyMaster: GainNode | null = null

function ensureMelodyAudio(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!melodyAudio) {
    try {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      melodyAudio = new Ctor()
      melodyMaster = melodyAudio.createGain()
      melodyMaster.gain.value = 0.5
      melodyMaster.connect(melodyAudio.destination)
    } catch { melodyAudio = null }
  }
  if (melodyAudio && melodyAudio.state === 'suspended') void melodyAudio.resume()
  return melodyAudio
}

function pianoVoice(ctx: AudioContext, dest: AudioNode, freq: number, when: number, dur: number) {
  // Three sine partials (1×, 2×, 3×) with quick attack + long exponential decay
  const oscs: OscillatorNode[] = []
  const gains: GainNode[] = []
  const partials = [
    { mult: 1,    level: 0.55 },
    { mult: 2,    level: 0.22 },
    { mult: 3,    level: 0.10 },
    { mult: 4.01, level: 0.05 },
  ]
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 3200
  filter.Q.value = 0.7

  const amp = ctx.createGain()
  amp.gain.setValueAtTime(0, when)
  amp.gain.linearRampToValueAtTime(0.22, when + 0.006)
  amp.gain.exponentialRampToValueAtTime(0.0005, when + dur)

  for (const p of partials) {
    const o = ctx.createOscillator()
    o.type = 'sine'
    o.frequency.value = freq * p.mult
    const g = ctx.createGain()
    g.gain.value = p.level
    o.connect(g); g.connect(filter)
    o.start(when); o.stop(when + dur + 0.05)
    oscs.push(o); gains.push(g)
  }
  filter.connect(amp)
  amp.connect(dest)
}

function electronicVoice(ctx: AudioContext, dest: AudioNode, freq: number, when: number, dur: number) {
  // Square + sawtooth through a sweeping resonant lowpass — synthwave pad/pluck
  const o1 = ctx.createOscillator()
  const o2 = ctx.createOscillator()
  o1.type = 'square'
  o2.type = 'sawtooth'
  o1.frequency.value = freq
  o2.frequency.value = freq * 1.004

  const o2g = ctx.createGain(); o2g.gain.value = 0.45
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.Q.value = 7
  filter.frequency.setValueAtTime(7200, when)
  filter.frequency.exponentialRampToValueAtTime(900, when + dur)

  const amp = ctx.createGain()
  amp.gain.setValueAtTime(0, when)
  amp.gain.linearRampToValueAtTime(0.16, when + 0.004)
  amp.gain.exponentialRampToValueAtTime(0.001, when + dur)

  // Subtle stereo-style delay using a second delayed copy
  const delay = ctx.createDelay()
  delay.delayTime.value = 0.18
  const delayGain = ctx.createGain(); delayGain.gain.value = 0.28
  const feedback = ctx.createGain(); feedback.gain.value = 0.25

  o1.connect(filter)
  o2.connect(o2g); o2g.connect(filter)
  filter.connect(amp)
  amp.connect(dest)
  amp.connect(delay)
  delay.connect(feedback); feedback.connect(delay)
  delay.connect(delayGain); delayGain.connect(dest)

  o1.start(when); o2.start(when)
  o1.stop(when + dur + 0.05); o2.stop(when + dur + 0.05)
}

function bellVoice(ctx: AudioContext, dest: AudioNode, freq: number, when: number, dur: number) {
  // Inharmonic bell — sine fundamentals with characteristic stretched partials
  // and a long exponential decay. Reads as music box / vibraphone / crystal.
  const partials = [
    { mult: 1,    level: 0.70, decay: dur + 1.4 },
    { mult: 2.0,  level: 0.30, decay: dur + 1.0 },
    { mult: 2.97, level: 0.18, decay: dur + 0.7 }, // minor-third character
    { mult: 4.16, level: 0.10, decay: dur + 0.5 },
    { mult: 5.43, level: 0.05, decay: dur + 0.4 },
  ]
  const amp = ctx.createGain()
  amp.gain.setValueAtTime(0, when)
  amp.gain.linearRampToValueAtTime(0.20, when + 0.003)
  amp.gain.exponentialRampToValueAtTime(0.0001, when + dur + 1.4)
  amp.connect(dest)

  for (const p of partials) {
    const o = ctx.createOscillator()
    o.type = 'sine'
    o.frequency.value = freq * p.mult
    const g = ctx.createGain()
    g.gain.setValueAtTime(p.level, when)
    g.gain.exponentialRampToValueAtTime(0.0001, when + p.decay)
    o.connect(g); g.connect(amp)
    o.start(when)
    o.stop(when + p.decay + 0.05)
  }
}

let activeMelodyTimers: ReturnType<typeof setTimeout>[] = []
function stopMelody() {
  for (const t of activeMelodyTimers) clearTimeout(t)
  activeMelodyTimers = []
}

function getVoiceFn(kind: VoiceKind) {
  if (kind === 'electronic') return electronicVoice
  if (kind === 'bell') return bellVoice
  return pianoVoice
}

function playMelody(id: string): boolean {
  const melody = MELODIES.find(m => m.id === id)
  if (!melody) return false
  const ctx = ensureMelodyAudio()
  if (!ctx || !melodyMaster) return false
  stopMelody()
  const voice = getVoiceFn(melody.voice)
  const start = ctx.currentTime + 0.06
  for (const note of melody.notes) {
    const freq = SCALE_FREQS[note.idx]
    if (!freq) continue
    voice(ctx, melodyMaster, freq, start + note.t, note.dur)
    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('unitsml:strum', {
        detail: { idx: note.idx, velocity: note.vel ?? 0.7 },
      }))
    }, note.t * 1000)
    activeMelodyTimers.push(timer)
  }
  return true
}

function defineTriggers() {
  // The Units Song — 10 arrangements, each on its own word trigger
  for (const m of MELODIES) {
    TRIGGERS[m.id] = () => {
      playMelody(m.id)
      markDiscovered(`song-${m.id}`, `${m.name}`, m.technique)
    }
  }
  // Back-compat aliases — point at the closest recognizable melody
  TRIGGERS['classical'] = TRIGGERS['ode']
  TRIGGERS['piano'] = TRIGGERS['ode']
  TRIGGERS['digital'] = TRIGGERS['twinkle']
  TRIGGERS['electronic'] = TRIGGERS['twinkle']

  // Cascade triggers
  TRIGGERS['units'] = () => {
    unitCascade(1)
    markDiscovered('word-units', '"units"', 'A cascade of every unit we encode.')
  }
  TRIGGERS['unitsml'] = () => {
    unitCascade(1.1)
    markDiscovered('word-unitsml', '"unitsml"', 'Speaking the name summons a unit cascade.')
  }
  TRIGGERS['unitsdb'] = () => {
    unitCascade(0.8)
    markDiscovered('word-unitsdb', '"unitsdb"', '380+ units, 199 quantities, 92 dimensions.')
  }
  TRIGGERS['si'] = () => {
    unitCascade(0.8)
    markDiscovered('word-si', 'Système International', 'The seven SI base quantities: L M T I Θ N J.')
  }
  TRIGGERS['2003'] = () => {
    unitCascade(0.7)
    markDiscovered('word-2003', 'Since 2003', '23 strong years and counting.')
  }
  TRIGGERS['hello'] = () => {
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    burst(cx, cy, 24, ['👋', 'm', 'kg', 's', '👋', 'A'])
    markDiscovered('word-hello', 'Hello to you too.', 'A small wave from UnitsML.')
  }

  // Mascot
  TRIGGERS['wappi'] = () => {
    window.dispatchEvent(new CustomEvent('unitsml:show-wappi'))
    markDiscovered('word-wappi', 'Wappi summoned', 'The mascot answers when called by name.')
  }

  // Organization-themed cards
  for (const id of Object.keys(ORGS)) {
    TRIGGERS[id] = () => {
      showOrgCard(id)
      const org = ORGS[id]
      markDiscovered(`org-${id}`, `${org.name} card`, org.tag)
    }
  }

  // SI base unit definition cards — each one shows the formal 2019 definition
  // plus the defining constant and the unit's official SI Brochure color.
  for (const unit of SI_UNITS) {
    TRIGGERS[unit.word] = () => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 3
      // Big burst in the unit's SI color with the unit's symbol
      for (let i = 0; i < 18; i++) {
        const angle = (i / 18) * Math.PI * 2 + Math.random() * 0.3
        const dist = 100 + Math.random() * 180
        spawnParticle(cx, cy, {
          symbol: unit.symbol,
          color: unit.color,
          size: 18 + Math.random() * 14,
          vx: Math.cos(angle) * dist,
          vy: Math.sin(angle) * dist - 60,
          spin: (Math.random() - 0.5) * 720,
          duration: 1400 + Math.random() * 600,
        })
      }
      showSiCard(unit)
      markDiscovered(`si-${unit.id}`, `${unit.symbol}  ·  ${unit.name}`, `${unit.quantity} — dimension ${unit.dimension}`)
    }
  }
  // Alias triggers (alternative spellings)
  TRIGGERS['metre'] = TRIGGERS['meter']
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key.length !== 1) return
  if (/[a-zA-Z0-9]/.test(e.key)) {
    wordBuffer = (wordBuffer + e.key.toLowerCase()).slice(-64)
    if (wordTimer) clearTimeout(wordTimer)
    wordTimer = setTimeout(() => { wordBuffer = ''; wordStart = 0 }, 2200)
    // Sort triggers by length DESC so 'oasis' is checked before 'si'.
    // Then require the match to start at the beginning of the current word,
    // so 'oasi' doesn't trip 'si' on the way to 'oasis'.
    const triggers = Object.keys(TRIGGERS).sort((a, b) => b.length - a.length)
    for (const trigger of triggers) {
      if (wordBuffer.endsWith(trigger)) {
        const matchStart = wordBuffer.length - trigger.length
        if (matchStart === wordStart) {
          TRIGGERS[trigger]()
          wordBuffer = ''
          wordStart = 0
          break
        }
      }
    }
  } else {
    // Non-alphanumeric ends the current word
    wordBuffer = (wordBuffer + ' ').slice(-64)
    wordStart = wordBuffer.length
  }
}

function onKeydownEsc(e: KeyboardEvent) {
  if (e.key !== 'Escape') return
  if (orgCard.value.visible) closeOrgCard()
  if (siCard.value.visible) closeSiCard()
}

function printConsole() {
  const styles = [
    'color: #30dfc0; font-weight: 700; font-size: 14px;',
    'color: #57a0fe; font-weight: 500;',
    'color: #f5a800; font-weight: 700;',
  ]
  // eslint-disable-next-line no-console
  console.log(
    `%c
   ╔══════════════════════════════════════════════════╗
   ║                                                  ║
   ║   ╦╔╦╗╔═╗╔═╗╦╔╗╔  UnitsML                        ║
   ║   ║║║║╠═╝║ ║║║║║  Scientific units, encoded.    ║
   ║   ╩╝╚╝╩  ╚═╝╩╝╚╝  Since 2003 · 23 strong years. ║
   ║                                                  ║
   ╚══════════════════════════════════════════════════╝
`,
    styles[0]
  )
  // eslint-disable-next-line no-console
  console.log(
    `%cPsst — try typing a word anywhere on the site.\n%cType %chelp%c in the console for the full list of easter eggs.\n%cDiscoveries are saved to localStorage.`,
    styles[0], styles[1], styles[2], styles[1], styles[0]
  )
}

function printHelp(): string {
  const lines: string[] = []
  lines.push('%c🥚 UnitsML easter eggs — type any of these words anywhere on the page.', 'color:#30dfc0;font-weight:700;font-size:13px;')
  lines.push('%cThe Units Song — recognizable public-domain melodies. Type any:', 'color:#f5a800;font-weight:600;')
  lines.push('    ode  (Beethoven, 9th symphony)   ·   grace  (Amazing Grace)   ·   twinkle  (Twinkle Little Star)')
  lines.push('%c  Cascades & bursts', 'color:#57a0fe;font-weight:600;')
  lines.push('    units  ·  unitsml  ·  unitsdb  ·  si  ·  2003  ·  hello')
  lines.push('%c  SI base units (opens a definition card)', 'color:#57a0fe;font-weight:600;')
  lines.push('    meter  ·  kilogram  ·  second  ·  ampere  ·  kelvin  ·  mole  ·  candela')
  lines.push('%c  Organizations (opens a logo card)', 'color:#57a0fe;font-weight:600;')
  lines.push('    nist  ·  oasis  ·  calconnect  ·  bipm  ·  iec  ·  ocx')
  lines.push('%c  Mascot', 'color:#57a0fe;font-weight:600;')
  lines.push('    wappi')
  lines.push('')
  lines.push('%cOther interactions:', 'color:#f5a800;font-weight:600;')
  lines.push('  · The wireframe logo edges are strings — click or drag to strum')
  lines.push('  · 7 string pitches: A5 E5 D5 A4 G4 E4 C4  (top → bottom)')
  lines.push('  · Move your cursor — SI unit symbols trail behind it')
  lines.push('  · Click the chrome logo — particle burst (5x = combo)')
  lines.push('  · Click the floating L M T I Θ N J symbols in the hero — collect all 7')
  lines.push('')
  lines.push(`%cYou have discovered ${discovered.size} easter ${discovered.size === 1 ? 'egg' : 'eggs'} so far.`, 'color:#30dfc0;font-weight:600;')
  // eslint-disable-next-line no-console
  console.log(lines.join('\n'))
  return '🥚 Try: classical · digital · units · nist · meter · 2003 · wappi  |  wireframe edges are strings you can strum'
}

function loadDiscoveries() {
  try {
    const stored = JSON.parse(localStorage.getItem('unitsml:easter-eggs') || '[]')
    stored.forEach((id: string) => discovered.add(id))
  } catch { /* ignore */ }
}

onMounted(() => {
  loadDiscoveries()
  defineTriggers()

  layer = document.createElement('div')
  layer.id = 'easter-eggs-layer'
  layer.setAttribute('aria-hidden', 'true')
  layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:99998;'
  document.body.appendChild(layer)

  window.unitsmlEE = {
    cascade: (intensity, x, y) => unitCascade(intensity, x, y),
    burst,
    toast: (text, sub) => showToast(text, sub),
    mark: markDiscovered,
    help: printHelp,
    playMelody,
    melodies: () => MELODIES.map(m => ({ id: m.id, name: m.name, technique: m.technique, voice: m.voice })),
  }
  // Expose `help` directly in the console so users can type `help` and see the list.
  // Don't clobber a pre-existing help (some browsers ship one).
  if (typeof window.help === 'undefined') {
    window.help = printHelp
  }

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keydown', onKeydownEsc)
  printConsole()

  if (discovered.size > 0) {
    setTimeout(() => {
      showToast(`Welcome back — ${discovered.size} discovered`, 'Type any of: units · nist · meter · wappi · 2003')
    }, 1400)
  } else {
    setTimeout(() => {
      showToast('Type "units" or "nist" anywhere.', 'Try words like meter, wappi, calconnect, bipm...')
      markDiscovered('hint', 'First contact', 'You found the hint toast.')
    }, 2200)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keydown', onKeydownEsc)
  layer?.remove()
  layer = null
  stopMelody()
  if (window.help === printHelp) delete window.help
  delete window.unitsmlEE
})
</script>

<template>
  <Transition name="ee-toast">
    <div v-if="toast.visible" class="ee-toast" role="status" aria-live="polite">
      <div class="ee-toast-text">{{ toast.text }}</div>
      <div v-if="toast.sub" class="ee-toast-sub">{{ toast.sub }}</div>
    </div>
  </Transition>

  <Transition name="ee-card">
    <div
      v-if="orgCard.visible && orgCard.org"
      class="org-card-overlay"
      role="dialog"
      aria-modal="true"
      :aria-label="orgCard.org.name + ' card'"
      @click.self="closeOrgCard"
    >
      <div class="org-card" :style="{ '--org-color': orgCard.org.color }">
        <button class="org-card-close" aria-label="Close" @click="closeOrgCard">&times;</button>
        <div class="org-card-head">
          <div class="org-card-logo">
            <img :src="orgCard.org.logo" :alt="orgCard.org.name" />
          </div>
          <div class="org-card-titles">
            <h3>{{ orgCard.org.name }}</h3>
            <p class="org-card-tag">{{ orgCard.org.tag }}</p>
          </div>
        </div>
        <blockquote class="org-card-quote">"{{ orgCard.org.quote }}"</blockquote>
        <p class="org-card-body">{{ orgCard.org.body }}</p>
        <div class="org-card-foot">
          <span class="org-card-egg">Easter egg discovered</span>
          <span class="org-card-hint">Press Esc or click outside to close</span>
        </div>
      </div>
    </div>
  </Transition>
  <Transition name="ee-card">
    <div
      v-if="siCard.visible && siCard.unit"
      class="si-card-overlay"
      role="dialog"
      aria-modal="true"
      :aria-label="siCard.unit.name + ' definition'"
      @click.self="closeSiCard"
    >
      <div class="si-card" :style="{ '--unit-color': siCard.unit.color }">
        <button class="org-card-close" aria-label="Close" @click="closeSiCard">&times;</button>
        <div class="si-card-head">
          <div class="si-symbol" aria-hidden="true">{{ siCard.unit.symbol }}</div>
          <div class="si-titles">
            <div class="si-name-row">
              <h3>{{ siCard.unit.name }}</h3>
              <span class="si-dim">dimension {{ siCard.unit.dimension }}</span>
            </div>
            <p class="si-quantity">{{ siCard.unit.quantity }}</p>
          </div>
        </div>
        <div class="si-spectrum" aria-hidden="true">
          <span v-for="(u, i) in SI_UNITS" :key="u.id"
            class="si-spectrum-seg"
            :class="{ 'is-current': u.id === siCard.unit?.id }"
            :style="{ background: u.color }"
            :title="`${u.symbol} — ${u.name}`"
          >{{ u.symbol }}</span>
        </div>
        <blockquote class="org-card-quote">"{{ siCard.unit.definition }}"</blockquote>
        <div class="si-constant">
          <div class="si-constant-sym">{{ siCard.unit.constantSym }}</div>
          <div class="si-constant-body">
            <div class="si-constant-name">{{ siCard.unit.constantName }}</div>
            <code class="si-constant-value">{{ siCard.unit.constantValue }}</code>
          </div>
        </div>
        <div class="org-card-foot">
          <span class="org-card-egg">2019 SI definition</span>
          <span class="org-card-hint">Press Esc or click outside to close</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.ee-toast {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99997;
  background: var(--unitsml-navy-dark, #1f1e4a);
  color: white;
  padding: 0.875rem 1.25rem;
  border-radius: 12px;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.12) inset,
    0 12px 40px rgba(7, 7, 32, 0.45);
  border: 1px solid rgba(48, 223, 192, 0.35);
  max-width: min(440px, calc(100vw - 2rem));
  pointer-events: none;
  text-align: center;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.ee-toast-text {
  font-size: 0.9375rem;
  font-weight: 700;
}
.ee-toast-sub {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.75);
  margin-top: 0.25rem;
  font-weight: 400;
}
.ee-toast::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 13px;
  padding: 1px;
  background: linear-gradient(135deg, #30dfc0, #57a0fe, #30dfc0);
  background-size: 200% 200%;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: ee-ring 3s ease-in-out infinite;
  pointer-events: none;
}
@keyframes ee-ring {
  0%, 100% { background-position: 0% 50%; }
  50%      { background-position: 100% 50%; }
}
.ee-toast-enter-active, .ee-toast-leave-active {
  transition: transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.24s ease;
}
.ee-toast-enter-from, .ee-toast-leave-to {
  transform: translateX(-50%) translateY(20px);
  opacity: 0;
}

/* ── Org card overlay ── */
.org-card-overlay {
  position: fixed;
  inset: 0;
  z-index: 99996;
  background: rgba(7, 7, 32, 0.45);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.org-card {
  position: relative;
  max-width: 460px;
  width: 100%;
  background: var(--vp-c-bg, white);
  color: var(--vp-c-text-1, #21354a);
  border-radius: 20px;
  padding: 2rem 2rem 1.5rem;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.6) inset,
    0 30px 80px rgba(7, 7, 32, 0.4),
    0 0 0 1px var(--org-color, #2d2c69);
  border-top: 4px solid var(--org-color, #2d2c69);
  font-family: var(--vp-font-family-base, system-ui);
}
.org-card-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
}
.org-card-close:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}
.org-card-head {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}
.org-card-logo {
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  background: white;
  border: 1px solid var(--vp-c-divider, #e5e7eb);
  border-radius: 14px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.org-card-logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.org-card-titles h3 {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--org-color, var(--vp-c-text-1));
  margin: 0 0 0.25rem;
  letter-spacing: -0.02em;
}
.org-card-tag {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.4;
}
.org-card-quote {
  margin: 0 0 1rem;
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg-soft, #f6f7f9);
  border-left: 3px solid var(--org-color, #30dfc0);
  border-radius: 0 10px 10px 0;
  font-size: 0.9375rem;
  font-style: italic;
  color: var(--vp-c-text-1);
  line-height: 1.55;
}
.org-card-body {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.65;
  margin: 0 0 1.25rem;
}
.org-card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-top: 0.875rem;
  border-top: 1px solid var(--vp-c-divider, #e5e7eb);
  font-size: 0.6875rem;
  color: var(--vp-c-text-3);
}
.org-card-egg {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 600;
  color: var(--org-color, var(--vp-c-brand-1));
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.org-card-egg::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--org-color, #30dfc0);
  box-shadow: 0 0 6px var(--org-color, #30dfc0);
}

.ee-card-enter-active, .ee-card-leave-active {
  transition: opacity 0.25s ease;
}
.ee-card-enter-active .org-card, .ee-card-leave-active .org-card,
.ee-card-enter-active .si-card, .ee-card-leave-active .si-card {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}
.ee-card-enter-from, .ee-card-leave-to {
  opacity: 0;
}
.ee-card-enter-from .org-card, .ee-card-leave-to .org-card,
.ee-card-enter-from .si-card, .ee-card-leave-to .si-card {
  transform: scale(0.85) translateY(20px);
  opacity: 0;
}

/* ── SI unit definition card ── */
.si-card-overlay {
  position: fixed;
  inset: 0;
  z-index: 99996;
  background: rgba(7, 7, 32, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.si-card {
  position: relative;
  max-width: 480px;
  width: 100%;
  background: var(--vp-c-bg, white);
  color: var(--vp-c-text-1, #21354a);
  border-radius: 20px;
  padding: 1.75rem 2rem 1.5rem;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.6) inset,
    0 30px 80px rgba(7, 7, 32, 0.4),
    0 0 0 1px var(--unit-color, #2d2c69);
  border-top: 5px solid var(--unit-color, #2d2c69);
  font-family: var(--vp-font-family-base, system-ui);
  overflow: hidden;
}
.si-card::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -30%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, var(--unit-color, #2d2c69) 0%, transparent 60%);
  opacity: 0.10;
  pointer-events: none;
  z-index: 0;
}
.si-card > * { position: relative; z-index: 1; }

.si-card-head {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}
.si-symbol {
  font-family: 'JetBrains Mono', 'SF Mono', ui-monospace, monospace;
  font-size: 4rem;
  font-weight: 800;
  color: var(--unit-color);
  line-height: 1;
  letter-spacing: -0.04em;
  text-shadow: 0 0 24px var(--unit-color);
  flex-shrink: 0;
  width: 80px;
  text-align: center;
  animation: si-pulse 2.2s ease-in-out infinite;
}
@keyframes si-pulse {
  0%, 100% { text-shadow: 0 0 20px var(--unit-color); transform: scale(1); }
  50%      { text-shadow: 0 0 36px var(--unit-color), 0 0 56px var(--unit-color); transform: scale(1.04); }
}
.si-titles { min-width: 0; }
.si-name-row {
  display: flex;
  align-items: baseline;
  gap: 0.625rem;
  flex-wrap: wrap;
}
.si-name-row h3 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  color: var(--vp-c-text-1);
  letter-spacing: -0.02em;
}
.si-dim {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6875rem;
  font-weight: 700;
  color: white;
  background: var(--unit-color);
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.si-quantity {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin: 0.125rem 0 0;
  line-height: 1.4;
}

/* The full SI Brochure color spectrum — highlights the current unit */
.si-spectrum {
  display: flex;
  height: 32px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1.125rem;
  border: 1px solid var(--vp-c-divider, #e5e7eb);
}
.si-spectrum-seg {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6875rem;
  font-weight: 800;
  color: white;
  text-shadow: 0 1px 1px rgba(0,0,0,0.35);
  opacity: 0.55;
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.si-spectrum-seg.is-current {
  opacity: 1;
  transform: scaleY(1.08);
  box-shadow: 0 0 0 2px white inset, 0 4px 12px rgba(0,0,0,0.18);
}

.si-constant {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  background: var(--vp-c-bg-soft, #f6f7f9);
  border: 1px solid var(--vp-c-divider, #e5e7eb);
  border-left: 3px solid var(--unit-color);
  border-radius: 0 10px 10px 0;
  margin-bottom: 1.125rem;
}
.si-constant-sym {
  font-family: 'JetBrains Mono', 'SF Mono', ui-monospace, monospace;
  font-size: 1.5rem;
  font-weight: 800;
  font-style: italic;
  color: var(--unit-color);
  line-height: 1;
  flex-shrink: 0;
}
.si-constant-body { min-width: 0; }
.si-constant-name {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.125rem;
  line-height: 1.3;
}
.si-constant-value {
  display: block;
  font-family: 'JetBrains Mono', 'SF Mono', ui-monospace, monospace;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: 0.005em;
}
</style>
