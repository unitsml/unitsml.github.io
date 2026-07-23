<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const root = ref<HTMLElement | null>(null)
const scene = ref<HTMLElement | null>(null)
const emit = defineEmits<{ (e: 'burst', payload: { x: number; y: number }): void }>()

let targetX = -10
let targetY = 0
let currentX = -10
let currentY = 0
let raf = 0
let lastMove = 0
let running = true
let hovering = false

function onMouseMove(e: MouseEvent) {
  if (!root.value) return
  lastMove = performance.now()
  const r = root.value.getBoundingClientRect()
  const cx = r.left + r.width / 2
  const cy = r.top + r.height / 2
  const nx = (e.clientX - cx) / (window.innerWidth * 0.5)
  const ny = (e.clientY - cy) / (window.innerHeight * 0.5)
  // When hovering directly over the logo, parallax is dramatically stronger
  const boost = hovering ? 2.6 : 1
  targetY = Math.max(-38, Math.min(38, nx * 26 * boost))
  targetX = Math.max(-28, Math.min(28, (-ny * 16 - 8) * boost))
}

function onPointerEnter() {
  hovering = true
  if (scene.value) scene.value.classList.add('is-hovering')
}
function onPointerLeave() {
  hovering = false
  if (scene.value) scene.value.classList.remove('is-hovering')
  targetX = -10
  targetY = 0
}

function tick(t: number) {
  if (!running) return
  // Ease toward target — snappier when hovering
  const ease = hovering ? 0.22 : 0.10
  currentX += (targetX - currentX) * ease
  currentY += (targetY - currentY) * ease
  // Idle wobble for organic life when the cursor is stale.
  // Skipped under prefers-reduced-motion — mouse-driven parallax still works.
  const reduced = prefersReducedMotion()
  const stale = !reduced && t - lastMove > 1400
  const idleAmp = hovering && !reduced ? 3.4 : (reduced ? 0 : 1.6)
  const idleX = stale ? Math.sin(t / 2300) * idleAmp : 0
  const idleY = stale ? Math.cos(t / 2900) * (idleAmp + 0.6) : 0
  if (scene.value) {
    scene.value.style.setProperty('--rx', (currentX + idleX).toFixed(2) + 'deg')
    scene.value.style.setProperty('--ry', (currentY + idleY).toFixed(2) + 'deg')
    // subtle scale-up while hovering for tactile feedback (skipped under reduced motion)
    const scale = hovering && !reduced ? 1.04 : 1
    scene.value.style.setProperty('--hover-scale', scale.toFixed(3))
  }
  raf = requestAnimationFrame(tick)
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

onMounted(() => {
  // Mouse-driven parallax is user-initiated, so we keep it even under
  // prefers-reduced-motion. The ambient idle wobble is gated by
  // `prefersReduced` inside tick() instead.
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  const el = root.value
  if (el) {
    el.addEventListener('pointerenter', onPointerEnter, { passive: true })
    el.addEventListener('pointerleave', onPointerLeave, { passive: true })
    el.addEventListener('mouseenter', onPointerEnter, { passive: true })
    el.addEventListener('mouseleave', onPointerLeave, { passive: true })
  }
  if (prefersReducedMotion() && scene.value) {
    scene.value.style.setProperty('--rx', '-10deg')
    scene.value.style.setProperty('--ry', '0deg')
  }
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
  cancelAnimationFrame(raf)
})

let clickCount = 0
let clickResetTimer: ReturnType<typeof setTimeout> | null = null
function onClick(e: MouseEvent) {
  // Particle burst via the global easter-eggs controller (WAAPI)
  const x = e.clientX
  const y = e.clientY
  if (window.unitsmlEE?.burst) {
    window.unitsmlEE.burst(x, y, 16, ['m', 'kg', 's', 'A', 'K', 'mol', 'cd'])
  }
  // 5-click combo unlocks a special cascade
  clickCount++
  if (clickResetTimer) clearTimeout(clickResetTimer)
  clickResetTimer = setTimeout(() => { clickCount = 0 }, 1800)
  if (clickCount >= 5) {
    clickCount = 0
    window.unitsmlEE?.cascade(0.7, x, y)
    window.unitsmlEE?.mark?.('logo-combo', 'Five-click combo!', 'You smashed the logo 5 times in a row.')
  } else if (clickCount === 1) {
    window.unitsmlEE?.mark?.('logo-burst', 'Logo burst', 'Click the chrome logo to set off a particle burst.')
  }
  emit('burst', { x, y })
}
</script>

<template>
  <div ref="root" class="liquid-logo" @click="onClick">
    <!-- Soft chrome pool / shadow on the floor -->
    <div class="liquid-pool" aria-hidden="true"></div>

    <div class="liquid-scene" ref="scene">
      <div class="logo-mark" role="img" aria-label="UnitsML">
        <!-- SVG chrome logo: polygon mark with specular-lit liquid metal surface -->
        <svg
          class="logo-svg"
          viewBox="0 0 93.11 107.26"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <!-- Original geometric mark as clip path -->
            <clipPath id="liquid-clip">
              <polygon points="18.21 0 0.01 0 0 0 0 18.2 0.01 18.2 0.01 107.26 92.83 107.26 92.83 89.05 18.21 89.05 18.21 18.2 37.45 18.2 37.45 71.43 55.66 71.43 55.66 18.2 74.9 18.2 74.9 71.38 93.1 71.38 93.11 0 18.21 0"/>
            </clipPath>

            <!-- Vertical chrome gradient — built from the 7 official BIPM SI Brochure
                 base-unit colors (si-circle-units_*.svg, metanorma-bipm). -->
            <linearGradient id="chrome-face" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stop-color="#ffffff"/>
              <stop offset="6%"  stop-color="#fff7e8"/>
              <stop offset="14%" stop-color="#f5a800"/> <!-- s — gold -->
              <stop offset="26%" stop-color="#ff671d"/> <!-- m — orange-red -->
              <stop offset="38%" stop-color="#ce0e2d"/> <!-- kg — red -->
              <stop offset="52%" stop-color="#c017a2"/> <!-- mol — magenta -->
              <stop offset="66%" stop-color="#410099"/> <!-- cd — deep purple -->
              <stop offset="80%" stop-color="#005cb9"/> <!-- K — blue -->
              <stop offset="92%" stop-color="#61a60e"/> <!-- A — green -->
              <stop offset="100%" stop-color="#1f1e4a"/>
            </linearGradient>

            <!-- Animated flow gradient — keeps the surface alive -->
            <linearGradient id="chrome-flow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stop-color="rgba(255,255,255,0)">
                <animate attributeName="offset" values="-0.2;0.05;-0.2" dur="9s" repeatCount="indefinite"/>
              </stop>
              <stop offset="50%"  stop-color="rgba(174,239,255,0.45)">
                <animate attributeName="offset" values="0.3;0.55;0.3" dur="9s" repeatCount="indefinite"/>
              </stop>
              <stop offset="100%" stop-color="rgba(255,255,255,0)">
                <animate attributeName="offset" values="0.8;1.05;0.8" dur="9s" repeatCount="indefinite"/>
              </stop>
            </linearGradient>

            <!-- Top meniscus rim -->
            <linearGradient id="chrome-rim" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stop-color="rgba(255,255,255,0.95)"/>
              <stop offset="40%" stop-color="rgba(255,255,255,0.25)"/>
              <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
            </linearGradient>

            <!-- Sweeping diagonal sheen -->
            <linearGradient id="chrome-sheen" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stop-color="rgba(255,255,255,0)"/>
              <stop offset="44%"  stop-color="rgba(255,255,255,0)"/>
              <stop offset="49%"  stop-color="rgba(255,255,255,0.85)"/>
              <stop offset="51%"  stop-color="rgba(255,255,255,0.85)"/>
              <stop offset="56%"  stop-color="rgba(255,255,255,0)"/>
              <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
            </linearGradient>

            <!-- Drop-shadow stack — extrudes the mark downward -->
            <filter id="chrome-shadow" x="-50%" y="-30%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0.6" stdDeviation="0" flood-color="#f5a800" flood-opacity="0.7"/>
              <feDropShadow dx="0" dy="1.4" stdDeviation="0.3" flood-color="#ff671d" flood-opacity="0.5"/>
              <feDropShadow dx="0" dy="3"   stdDeviation="1.5" flood-color="#0d0c2a" flood-opacity="0.55"/>
              <feDropShadow dx="0" dy="7"   stdDeviation="5"   flood-color="#070720" flood-opacity="0.5"/>
              <feDropShadow dx="0" dy="18"  stdDeviation="16"  flood-color="#070720" flood-opacity="0.4"/>
              <feDropShadow dx="0" dy="38"  stdDeviation="32"  flood-color="#070720" flood-opacity="0.28"/>
            </filter>
          </defs>

          <!-- Shadow-casting layer -->
          <g filter="url(#chrome-shadow)">
            <!-- Chrome face fill -->
            <g clip-path="url(#liquid-clip)">
              <rect width="93.11" height="107.26" fill="url(#chrome-face)"/>
              <!-- Animated chrome flow -->
              <rect width="93.11" height="107.26" fill="url(#chrome-flow)"/>
              <!-- Top rim highlight (meniscus) -->
              <rect width="93.11" height="40" fill="url(#chrome-rim)"/>
              <!-- Sweeping sheen -->
              <rect class="sheen-sweep" width="93.11" height="107.26" fill="url(#chrome-sheen)"/>
            </g>
            <!-- Crisp edge outline -->
            <polygon
              points="18.21 0 0.01 0 0 0 0 18.2 0.01 18.2 0.01 107.26 92.83 107.26 92.83 89.05 18.21 89.05 18.21 18.2 37.45 18.2 37.45 71.43 55.66 71.43 55.66 18.2 74.9 18.2 74.9 71.38 93.1 71.38 93.11 0 18.21 0"
              fill="none"
              stroke="rgba(255,255,255,0.45)"
              stroke-width="0.4"
            />
          </g>
        </svg>
      </div>
    </div>

    <!-- Floating chrome sparkles -->
    <div class="liquid-sparkles" aria-hidden="true">
      <span class="sparkle" style="--x:6%;--y:30%;--d:0s;--s:3px"></span>
      <span class="sparkle" style="--x:14%;--y:14%;--d:1.4s;--s:2px"></span>
      <span class="sparkle" style="--x:24%;--y:40%;--d:2.7s;--s:2.5px"></span>
      <span class="sparkle" style="--x:78%;--y:18%;--d:0.6s;--s:3px"></span>
      <span class="sparkle" style="--x:88%;--y:34%;--d:3.2s;--s:2px"></span>
      <span class="sparkle" style="--x:96%;--y:12%;--d:1.9s;--s:2.5px"></span>
      <span class="sparkle" style="--x:70%;--y:48%;--d:0.3s;--s:2px"></span>
      <span class="sparkle" style="--x:34%;--y:8%;--d:2.1s;--s:3px"></span>
    </div>
  </div>
</template>

<style scoped>
.liquid-logo {
  position: relative;
  perspective: 1200px;
  perspective-origin: 50% 38%;
  padding: 0.5rem 0 1rem;
  user-select: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: filter 0.35s ease;
}

.liquid-pool {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: min(360px, 60%);
  height: 60px;
  background:
    radial-gradient(ellipse at 50% 0%,
      rgba(245, 168, 0, 0.22) 0%,    /* s gold */
      rgba(255, 103, 29, 0.22) 18%,  /* m orange */
      rgba(206, 14, 45, 0.20) 32%,   /* kg red */
      rgba(192, 23, 162, 0.22) 50%,  /* mol magenta */
      rgba(65, 0, 153, 0.20) 65%,    /* cd purple */
      rgba(0, 92, 185, 0.22) 78%,    /* K blue */
      rgba(97, 166, 14, 0.22) 90%,   /* A green */
      transparent 100%);
  filter: blur(14px);
  pointer-events: none;
  z-index: -1;
}

.liquid-scene {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform-style: preserve-3d;
  transform:
    rotateX(var(--rx, -10deg))
    rotateY(var(--ry, 0deg))
    scale(var(--hover-scale, 1));
  transition: transform 0.08s linear, filter 0.4s ease;
  will-change: transform;
  filter: drop-shadow(0 30px 30px rgba(7, 7, 32, 0.18));
}
.liquid-scene.is-hovering {
  filter:
    drop-shadow(0 0 32px rgba(255, 103, 29, 0.45))
    drop-shadow(0 0 60px rgba(245, 168, 0, 0.25))
    drop-shadow(0 30px 40px rgba(7, 7, 32, 0.30));
}

.logo-mark {
  position: relative;
  width: clamp(180px, 22vw, 280px);
  height: auto;
  transform-style: preserve-3d;
  transform: translateZ(0);
  filter: drop-shadow(0 30px 30px rgba(7, 7, 32, 0.25));
}

.logo-svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}

/* Sheen sweep — translates across the mark periodically */
.sheen-sweep {
  transform-origin: center;
  animation: sheen-sweep 6.5s ease-in-out infinite;
}

@keyframes sheen-sweep {
  0%, 100% { transform: translateX(-130%); opacity: 0; }
  35%      { opacity: 1; }
  65%      { opacity: 1; }
  85%      { transform: translateX(130%); opacity: 0; }
}

/* Reflection pool below — removed; .liquid-pool provides the floor shadow */

/* (reflection styles removed) */

/* Floating chrome sparkles — light catching droplets */
.liquid-sparkles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 7;
}

.sparkle {
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--s);
  height: var(--s);
  background: white;
  border-radius: 50%;
  box-shadow:
    0 0 6px 1px rgba(255, 255, 255, 0.85),
    0 0 14px 2px rgba(94, 234, 212, 0.45);
  animation: sparkle-twinkle 3.5s ease-in-out infinite;
  animation-delay: var(--d);
  opacity: 0;
}

@keyframes sparkle-twinkle {
  0%, 100% { opacity: 0; transform: scale(0.4); }
  50%      { opacity: 1; transform: scale(1.5); }
}

/* Reduced motion: kill ambient animation only — mouse parallax still works */
@media (prefers-reduced-motion: reduce) {
  .sheen-sweep, .sparkle { animation: none; }
  .sparkle { opacity: 0.5; }
}

/* Touch / coarse pointer */
@media (pointer: coarse) {
  .liquid-scene {
    transform: rotateX(-12deg) rotateY(0deg);
  }
}
</style>
