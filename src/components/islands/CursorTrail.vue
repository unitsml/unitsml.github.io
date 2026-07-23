<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

const POOL = ['m', 'kg', 's', 'A', 'K', 'mol', 'cd', 'N', 'J', 'W', 'Pa', 'Hz', 'V', 'Ω', 'C', 'F', 'S', 'Wb', 'T', 'H', 'lm', 'lx']

// Official BIPM SI Brochure colors for the 7 SI base units (si-circle-units_*.svg)
const SI_COLORS: Record<string, string> = {
  m:   '#ff671d', // metre (L)
  kg:  '#ce0e2d', // kilogram (M)
  s:   '#f5a800', // second (T)
  A:   '#61a60e', // ampere (I)
  K:   '#005cb9', // kelvin (Θ)
  mol: '#c017a2', // mole (N)
  cd:  '#410099', // candela (J)
}
const FALLBACK_COLORS = ['#2d2c69', '#30dfc0', '#57a0fe', '#6e6dba']

function colorFor(sym: string): string {
  return SI_COLORS[sym] ?? FALLBACK_COLORS[Math.floor(Math.random() * FALLBACK_COLORS.length)]
}

let lastSpawn = 0
let container: HTMLElement | null = null

function spawn(x: number, y: number) {
  if (!container) return
  const sym = POOL[Math.floor(Math.random() * POOL.length)]
  const color = colorFor(sym)
  const size = 12 + Math.random() * 8
  const drift = (Math.random() - 0.5) * 36
  const lift = -(28 + Math.random() * 32)
  const spin = (Math.random() - 0.5) * 90

  const el = document.createElement('span')
  el.textContent = sym
  el.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    font-family: 'JetBrains Mono', 'SF Mono', ui-monospace, monospace;
    font-size: ${size}px;
    font-weight: 700;
    color: ${color};
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    will-change: transform, opacity;
    text-shadow: 0 1px 2px rgba(255,255,255,0.6), 0 0 6px ${color}33;
    user-select: none;
  `
  container.appendChild(el)

  const anim = el.animate(
    [
      { transform: `translate(-50%, -50%) translate(0, 0) rotate(0deg) scale(0.4)`, opacity: 0 },
      { transform: `translate(-50%, -50%) translate(${drift * 0.3}px, ${lift * 0.3}px) rotate(${spin * 0.3}deg) scale(1.1)`, opacity: 0.95, offset: 0.25 },
      { transform: `translate(-50%, -50%) translate(${drift}px, ${lift}px) rotate(${spin}deg) scale(0.85)`, opacity: 0 },
    ],
    {
      duration: 1100 + Math.random() * 400,
      easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      fill: 'forwards',
    }
  )
  anim.onfinish = () => el.remove()
}

function shouldTrail(target: HTMLElement | null): boolean {
  if (!target) return true
  // Don't trail over chrome / interactive surfaces — they have their own effects
  if (target.closest('.liquid-logo, .nav, .footer, button, a, input, textarea, .ee-toast')) return false
  return true
}

function onMove(e: MouseEvent) {
  const now = performance.now()
  if (now - lastSpawn < 70) return
  if (!shouldTrail(e.target as HTMLElement | null)) return
  lastSpawn = now
  spawn(e.clientX, e.clientY)
}

function onDown(e: MouseEvent) {
  if (!shouldTrail(e.target as HTMLElement | null)) return
  for (let i = 0; i < 5; i++) {
    setTimeout(() => spawn(e.clientX, e.clientY), i * 35)
  }
}

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

onMounted(() => {
  if (prefersReduced()) return
  if (window.matchMedia('(pointer: coarse)').matches) return

  container = document.createElement('div')
  container.id = 'cursor-trail-layer'
  container.setAttribute('aria-hidden', 'true')
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9998;'
  document.body.appendChild(container)

  window.addEventListener('mousemove', onMove, { passive: true })
  window.addEventListener('mousedown', onDown, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mousedown', onDown)
  container?.remove()
  container = null
})
</script>

<template>
  <!-- No DOM output; this component only attaches global listeners -->
</template>

