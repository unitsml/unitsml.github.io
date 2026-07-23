<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

// UnitsML mark polygon — from public/symbol.svg, deduplicated.
// The shape traces the perimeter of the geometric mark (with its
// L-shaped cutout at top-left and U-notch at top-right).
const RAW_POLY: [number, number][] = [
  [18.21, 0],
  [0, 0],
  [0, 18.2],
  [0, 107.26],
  [92.83, 107.26],
  [92.83, 89.05],
  [18.21, 89.05],
  [18.21, 18.2],
  [37.45, 18.2],
  [37.45, 71.43],
  [55.66, 71.43],
  [55.66, 18.2],
  [74.9, 18.2],
  [74.9, 71.38],
  [93.11, 71.38],
  [93.11, 0],
]
const W = 93.11
const H = 107.26
const CX = W / 2
const CY = H / 2
const DEPTH = 34 // 3D extrusion depth (model units)

type V3 = [number, number, number]

// Build centered 3D vertices: top face at z=+DEPTH/2, bottom at z=-DEPTH/2.
// SVG y grows downward, so we flip y for a standard right-handed 3D space.
const topVerts: V3[] = RAW_POLY.map(([x, y]) => [x - CX, -(y - CY), DEPTH / 2])
const botVerts: V3[] = RAW_POLY.map(([x, y]) => [x - CX, -(y - CY), -DEPTH / 2])

// All vertices in one array, indexed.
const vertices: V3[] = [...topVerts, ...botVerts]
const TOP = 0
const BOT = topVerts.length

// Official BIPM SI Brochure colors — vertical gradient stops.
// Top of model → bottom of model maps across all 7 SI base-unit colors.
const SI_STOPS: Array<[number, [number, number, number]]> = [
  [0.00, [245, 168, 0]],   // s — gold
  [0.18, [255, 103, 29]],  // m — orange-red
  [0.34, [206, 14, 45]],   // kg — red
  [0.50, [192, 23, 162]],  // mol — magenta
  [0.66, [65, 0, 153]],    // cd — deep purple
  [0.82, [0, 92, 185]],    // K — blue
  [1.00, [97, 166, 14]],   // A — green
]

function siColor(yNorm: number): string {
  const y = Math.max(0, Math.min(1, yNorm))
  for (let i = 1; i < SI_STOPS.length; i++) {
    if (y <= SI_STOPS[i][0]) {
      const [y0, c0] = SI_STOPS[i - 1]
      const [y1, c1] = SI_STOPS[i]
      const t = (y - y0) / (y1 - y0)
      const r = Math.round(c0[0] + (c1[0] - c0[0]) * t)
      const g = Math.round(c0[1] + (c1[1] - c0[1]) * t)
      const b = Math.round(c0[2] + (c1[2] - c0[2]) * t)
      return `rgb(${r},${g},${b})`
    }
  }
  return 'rgb(97,166,14)'
}

// Color an edge based on the original SVG-y midpoint (0 = top of mark, H = bottom).
// yAvg is in centered 3D coords (flipped), so we convert back to SVG-y first.
function colorFor(a: V3, b: V3): string {
  const ySvgAvg = (-((a[1] + b[1]) / 2)) + CY // back to SVG space
  return siColor(ySvgAvg / H)
}

type Edge = { a: number; b: number; color: string }

function buildEdges(): Edge[] {
  const out: Edge[] = []
  // Top-face outline
  for (let i = 0; i < topVerts.length; i++) {
    const ai = TOP + i
    const bi = TOP + ((i + 1) % topVerts.length)
    out.push({ a: ai, b: bi, color: colorFor(vertices[ai], vertices[bi]) })
  }
  // Bottom-face outline
  for (let i = 0; i < botVerts.length; i++) {
    const ai = BOT + i
    const bi = BOT + ((i + 1) % botVerts.length)
    out.push({ a: ai, b: bi, color: colorFor(vertices[ai], vertices[bi]) })
  }
  // Vertical side edges (each top vertex → its bottom counterpart).
  // These are the only edges a real extruded-polygon wireframe would have —
  // no interior mesh lines that would cut across the mark's silhouette.
  for (let i = 0; i < topVerts.length; i++) {
    const ai = TOP + i
    const bi = BOT + i
    out.push({ a: ai, b: bi, color: colorFor(vertices[ai], vertices[bi]) })
  }
  return out
}

const edges = buildEdges()

// Pre-allocate projected buffers
const projected: V3[] = vertices.map(() => [0, 0, 0])

function rotate(p: V3, rx: number, ry: number, out: V3) {
  const cosY = Math.cos(ry), sinY = Math.sin(ry)
  const cosX = Math.cos(rx), sinX = Math.sin(rx)
  const x = p[0], y = p[1], z = p[2]
  // Rotate around Y axis
  const x1 = x * cosY + z * sinY
  const z1 = -x * sinY + z * cosY
  // Rotate around X axis
  const y2 = y * cosX - z1 * sinX
  const z2 = y * sinX + z1 * cosX
  out[0] = x1
  out[1] = y2
  out[2] = z2
}

const root = ref<HTMLElement | null>(null)
const svgEl = ref<SVGSVGElement | null>(null)
const lineEls = ref<SVGLineElement[]>([])
const hitEls = ref<SVGLineElement[]>([])
const vertEls = ref<SVGCircleElement[]>([])

let targetX = -0.20 // ≈ -11° default tilt (away from logo)
let targetY = 0
let currentX = -0.20
let currentY = 0
let raf = 0
let lastMove = 0
let running = true
let hovering = false

function setLineRef(el: Element | unknown, idx: number) {
  if (el && el instanceof SVGLineElement) lineEls.value[idx] = el
}
function setHitRef(el: Element | unknown, idx: number) {
  if (el && el instanceof SVGLineElement) hitEls.value[idx] = el
}
function setVertRef(el: Element | unknown, idx: number) {
  if (el && el instanceof SVGCircleElement) vertEls.value[idx] = el
}

// ── Strummable strings ──
// Each edge behaves like a guitar string. Y position maps to a pitch in a
// one-octave-plus-treble C major scale, sized so recognizable melodies fit.
//
// SCALE mirrors the 7 SI Brochure base-unit colors top-to-bottom:
//   gold (s) C5 · orange-red (m) A4 · red (kg) G4 · magenta (mol) F4
//   purple (cd) E4 · blue (K) D4 · green (A) C4
const SCALE = [523.25, 440.00, 392.00, 349.23, 329.63, 293.66, 261.63]
const NOTE_NAMES = ['C5', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4']
const SI_SYMBOLS = ['s', 'm', 'kg', 'mol', 'cd', 'K', 'A']
const SI_COLORS_LEGEND = ['#f5a800', '#ff671d', '#ce0e2d', '#c017a2', '#410099', '#005cb9', '#61a60e']

let audioCtx: AudioContext | null = null
let masterGain: GainNode | null = null
function ensureAudio(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    try {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      audioCtx = new Ctor()
      masterGain = audioCtx.createGain()
      masterGain.gain.value = 0.6
      masterGain.connect(audioCtx.destination)
    } catch { audioCtx = null }
  }
  if (audioCtx && audioCtx.state === 'suspended') void audioCtx.resume()
  return audioCtx
}

function freqForEdge(edge: Edge): number {
  const a = vertices[edge.a]
  const b = vertices[edge.b]
  const ySvgAvg = -((a[1] + b[1]) / 2) + CY
  const yNorm = Math.max(0, Math.min(0.9999, ySvgAvg / H))
  return SCALE[Math.floor(yNorm * SCALE.length)]
}

function playTone(freq: number, velocity = 1) {
  const ctx = ensureAudio()
  if (!ctx || !masterGain) return
  const now = ctx.currentTime

  const osc1 = ctx.createOscillator()
  const osc2 = ctx.createOscillator()
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()

  osc1.type = 'triangle'
  osc1.frequency.value = freq
  osc2.type = 'sine'
  osc2.frequency.value = freq * 2.003 // slight detune for chorus shimmer

  filter.type = 'lowpass'
  filter.frequency.value = 2600
  filter.Q.value = 1.1

  const peak = 0.22 * velocity
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(peak, now + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.0008, now + 1.6)

  const sub2Gain = ctx.createGain()
  sub2Gain.gain.value = 0.28

  osc1.connect(filter)
  osc2.connect(sub2Gain)
  sub2Gain.connect(filter)
  filter.connect(gain)
  gain.connect(masterGain)

  osc1.start(now)
  osc2.start(now)
  osc1.stop(now + 1.7)
  osc2.stop(now + 1.7)
}

function strum(idx: number, velocity = 1) {
  const edge = edges[idx]
  if (!edge) return
  const line = lineEls.value[idx]
  if (!line) return
  playTone(freqForEdge(edge), velocity)

  // Vibrate visually — pulse stroke-width + colored glow that decays
  const color = edge.color
  const baseWidth = 1.6
  line.animate(
    [
      { strokeWidth: baseWidth + 'px', filter: `drop-shadow(0 0 3px ${color})` },
      { strokeWidth: '4.5px',          filter: `drop-shadow(0 0 18px ${color}) brightness(1.5)`, offset: 0.12 },
      { strokeWidth: '3px',            filter: `drop-shadow(0 0 10px ${color}) brightness(1.25)`, offset: 0.45 },
      { strokeWidth: baseWidth + 'px', filter: `drop-shadow(0 0 3px ${color})` },
    ],
    { duration: 900, easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)', fill: 'forwards' }
  )
}

// Drag-to-strum: hold pointer down + sweep across multiple edges
let dragging = false
let lastStrumIdx = -1
function onSvgPointerDown() {
  dragging = true
}
function onSvgPointerUp() {
  dragging = false
  lastStrumIdx = -1
}
function onEdgePointerEnter(idx: number) {
  if (!dragging) return
  if (idx === lastStrumIdx) return
  lastStrumIdx = idx
  strum(idx, 0.7)
}
function onEdgeClick(idx: number, e: MouseEvent) {
  e.stopPropagation()
  ensureAudio()
  strum(idx, 1)
  window.unitsmlEE?.mark?.('string-strum', 'Strummed a string', 'Click (or drag across) the wireframe edges.')
}

function onMouseMove(e: MouseEvent) {
  if (!root.value) return
  lastMove = performance.now()
  const r = root.value.getBoundingClientRect()
  const cx = r.left + r.width / 2
  const cy = r.top + r.height / 2
  const nx = (e.clientX - cx) / (window.innerWidth * 0.5)
  const ny = (e.clientY - cy) / (window.innerHeight * 0.5)
  if (hovering) {
    // When cursor is over the logo: cursor at center → facing viewer straight.
    // No fixed offset; rotation is purely a function of cursor displacement.
    const boost = 1.8
    targetY = Math.max(-0.75, Math.min(0.75, nx * 0.45 * boost))
    targetX = Math.max(-0.55, Math.min(0.55, -ny * 0.28 * boost))
  } else {
    // Away from the logo: keep a gentle default 3D tilt for depth perception.
    targetY = Math.max(-0.45, Math.min(0.45, nx * 0.30))
    targetX = Math.max(-0.35, Math.min(0.35, -ny * 0.20 - 0.20))
  }
}

function onPointerEnter() { hovering = true }
function onPointerLeave() {
  hovering = false
  targetX = -0.20
  targetY = 0
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function tick(t: number) {
  if (!running) return
  const ease = hovering ? 0.20 : 0.10
  currentX += (targetX - currentX) * ease
  currentY += (targetY - currentY) * ease
  // Idle wobble — only when not reduced-motion and cursor is stale
  const reduced = prefersReducedMotion()
  const stale = !reduced && t - lastMove > 1400
  const amp = hovering && !reduced ? 0.05 : (reduced ? 0 : 0.025)
  const idleX = stale ? Math.sin(t / 2300) * amp : 0
  const idleY = stale ? Math.cos(t / 2900) * amp : 0
  const rx = currentX + idleX
  const ry = currentY + idleY

  // Project all vertices once per frame
  for (let i = 0; i < vertices.length; i++) {
    rotate(vertices[i], rx, ry, projected[i])
  }

  // Update SVG lines + opacity based on average Z (depth fade)
  const lines = lineEls.value
  const hits = hitEls.value
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i]
    const a = projected[e.a]
    const b = projected[e.b]
    const x1 = a[0].toFixed(2)
    const y1 = (-a[1]).toFixed(2)
    const x2 = b[0].toFixed(2)
    const y2 = (-b[1]).toFixed(2)
    const zAvg = (a[2] + b[2]) / 2
    const depthNorm = (zAvg + DEPTH) / (DEPTH * 2)
    const op = (0.30 + depthNorm * 0.70).toFixed(2)
    const visible = lines[i]
    if (visible) {
      visible.setAttribute('x1', x1)
      visible.setAttribute('y1', y1)
      visible.setAttribute('x2', x2)
      visible.setAttribute('y2', y2)
      visible.style.opacity = op
    }
    const hit = hits[i]
    if (hit) {
      hit.setAttribute('x1', x1)
      hit.setAttribute('y1', y1)
      hit.setAttribute('x2', x2)
      hit.setAttribute('y2', y2)
      // Fade pointer target with depth so back-facing strings are less clickable
      hit.style.opacity = depthNorm > 0.4 ? '1' : '0.4'
    }
  }

  // Update vertex dots
  const verts = vertEls.value
  for (let i = 0; i < vertices.length; i++) {
    const v = projected[i]
    const dot = verts[i]
    if (!dot) continue
    dot.setAttribute('cx', v[0].toFixed(2))
    dot.setAttribute('cy', (-v[1]).toFixed(2))
    const depthNorm = (v[2] + DEPTH) / (DEPTH * 2)
    const op = 0.25 + depthNorm * 0.75
    dot.style.opacity = op.toFixed(2)
    dot.setAttribute('r', (1.2 + depthNorm * 1.0).toFixed(2))
  }

  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  const el = root.value
  if (el) {
    el.addEventListener('pointerenter', onPointerEnter, { passive: true })
    el.addEventListener('pointerleave', onPointerLeave, { passive: true })
    el.addEventListener('mouseenter', onPointerEnter, { passive: true })
    el.addEventListener('mouseleave', onPointerLeave, { passive: true })
  }
  // Listen for external strum events (e.g. from autoplaying melodies)
  window.addEventListener('unitsml:strum', onExternalStrum as EventListener)
  raf = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  running = false
  window.removeEventListener('mousemove', onMouseMove)
  const el = root.value
  if (el) {
    el.removeEventListener('pointerenter', onPointerEnter)
    el.removeEventListener('pointerleave', onPointerLeave)
    el.removeEventListener('mouseenter', onPointerEnter)
    el.removeEventListener('mouseleave', onPointerLeave)
  }
  window.removeEventListener('unitsml:strum', onExternalStrum as EventListener)
  cancelAnimationFrame(raf)
})

function onExternalStrum(e: CustomEvent<{ idx: number; velocity?: number }>) {
  const idx = e.detail?.idx
  const vel = e.detail?.velocity ?? 0.7
  if (typeof idx === 'number' && idx >= 0 && idx < edges.length) {
    // Map scale index (0-6) to any edge whose color matches that scale bucket.
    // Simpler: strum edges whose Y-normalised position matches idx.
    strumByScaleIdx(idx, vel)
  }
}

// Strum the first edge whose pitch bucket equals the given scale index,
// so melodies (which use scale indices 0-6) animate a representative edge.
function strumByScaleIdx(scaleIdx: number, velocity = 0.7) {
  const targetFreq = SCALE[scaleIdx]
  if (!targetFreq) return
  // Find an edge whose freqForEdge matches
  for (let i = 0; i < edges.length; i++) {
    if (Math.abs(freqForEdge(edges[i]) - targetFreq) < 1) {
      strum(i, velocity)
      return
    }
  }
  // Fallback: just strum a vertical edge near the right Y
  const yTarget = (scaleIdx + 0.5) / SCALE.length
  let bestIdx = 0
  let bestDist = Infinity
  for (let i = 0; i < edges.length; i++) {
    const a = vertices[edges[i].a]
    const b = vertices[edges[i].b]
    const ySvgAvg = -((a[1] + b[1]) / 2) + CY
    const yNorm = ySvgAvg / H
    const d = Math.abs(yNorm - yTarget)
    if (d < bestDist) { bestDist = d; bestIdx = i }
  }
  strum(bestIdx, velocity)
}

let clickCount = 0
let clickResetTimer: ReturnType<typeof setTimeout> | null = null
function onClick(e: MouseEvent) {
  window.unitsmlEE?.burst?.(e.clientX, e.clientY, 16, ['m', 'kg', 's', 'A', 'K', 'mol', 'cd'])
  clickCount++
  if (clickResetTimer) clearTimeout(clickResetTimer)
  clickResetTimer = setTimeout(() => { clickCount = 0 }, 1800)
  if (clickCount >= 5) {
    clickCount = 0
    window.unitsmlEE?.cascade?.(0.7, e.clientX, e.clientY)
    window.unitsmlEE?.mark?.('logo-combo', 'Five-click combo!', 'You smashed the logo 5 times in a row.')
  } else if (clickCount === 1) {
    window.unitsmlEE?.mark?.('logo-burst', 'Logo burst', 'Click the wireframe logo for a particle burst.')
  }
}
</script>

<template>
  <div ref="root" class="logo3d" @click="onClick">
    <svg
      ref="svgEl"
      class="logo3d-svg"
      viewBox="-80 -100 160 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="UnitsML"
      role="img"
      @pointerdown="onSvgPointerDown"
      @pointerup="onSvgPointerUp"
      @pointerleave="onSvgPointerUp"
    >
      <defs>
        <filter id="wf-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="0.6" result="b"/>
          <feMerge>
            <feMergeNode in="b"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <g class="wf-edges" filter="url(#wf-glow)">
        <g v-for="(edge, i) in edges" :key="i" class="wf-edge-group">
          <!-- Invisible wide hit-area line: the clickable "string" -->
          <line
            :ref="(el) => setHitRef(el, i)"
            class="wf-hit"
            stroke="transparent"
            stroke-width="14"
            stroke-linecap="round"
            fill="none"
            style="cursor: pointer;"
            @pointerenter="onEdgePointerEnter(i)"
            @click="onEdgeClick(i, $event)"
          />
          <!-- Visible thin wireframe line -->
          <line
            :ref="(el) => setLineRef(el, i)"
            class="wf-edge"
            :stroke="edge.color"
            stroke-width="1.6"
            stroke-linecap="round"
            fill="none"
            vector-effect="non-scaling-stroke"
            pointer-events="none"
          />
        </g>
      </g>
      <!-- Vertex dots — sell the "3D mesh" feel -->
      <g class="wf-verts">
        <circle
          v-for="(v, i) in vertices"
          :key="'v' + i"
          :ref="(el) => setVertRef(el, i)"
          class="wf-vert"
          cx="0"
          cy="0"
          r="1.6"
          fill="white"
          stroke="currentColor"
          stroke-width="0.4"
          pointer-events="none"
        />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.logo3d {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  padding: 0.5rem;
  width: 100%;
}
.logo3d-svg {
  width: clamp(280px, 30vw, 440px);
  height: auto;
  overflow: visible;
  display: block;
}
.wf-edge {
  transition: stroke-width 0.18s ease;
}
.wf-hit {
  cursor: pointer;
}
.wf-edge-group:hover .wf-edge {
  stroke-width: 2.6;
}
.wf-vert {
  opacity: 0.75;
  pointer-events: none;
  transition: opacity 0.25s ease, r 0.25s ease;
}
.logo3d:hover .wf-vert {
  opacity: 1;
}
</style>
