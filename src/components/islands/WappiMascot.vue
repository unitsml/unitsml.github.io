<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
const factIndex = ref(0)
const mascotRef = ref<HTMLElement | null>(null)

const facts = [
  "UnitsML was born at Lawrence Berkeley National Laboratory in 1998, when Frank Olken and John McCarthy first encoded units in XML.",
  "The first public UnitsML presentation was at the Sixth Open Forum on Metadata Registries in Santa Fe, January 2003.",
  "UnitsML has been online since May 2003 — 23 strong years and counting.",
  "UnitsML's first OASIS Technical Committee teleconference was on July 12, 2006, convened by Simon Frechette.",
  "In 2011, the OASIS TC added 'light-time' units like light_second, light_minute, light_hour, and light_week.",
  "The 2011 CSD4 release also added the 'av_' prefix to Avoirdupois units to distinguish them from troy units.",
  "The 1985 Space Shuttle Discovery flew upside-down over Maui because 10,023 feet was read as 10,023 nautical miles.",
  "The Mars Climate Orbiter was lost in 1999 because pound-seconds were mistaken for newton-seconds.",
  "The metre was originally defined as one ten-millionth of the distance from the equator to the North Pole.",
  "A 'jiffy' is a real unit of time: about 3 × 10⁻²⁴ seconds in physics, or 10 milliseconds in computing.",
  "The kilogram was the last SI base unit defined by a physical artifact — until 2019, when it was redefined by the Planck constant.",
  "UnitsDB 2.0 (2025) introduced organization-neutral IDs like 'u:meter' and multilingual names from BIPM.",
  "UnitsML is used by the OCX shipbuilding standard to keep hull measurements precise across CAD tools.",
  "IEC/TS 62720 and ECLASS map their units in a 1:1 relationship with UnitsML.",
  "UnitsML cross-references BIPM's SI Digital Framework, UCUM, and QUDT — three major unit vocabularies.",
  "'What is empty provides utility.' — Lao Tze, on the UnitsML brand philosophy.",
]

let hideTimeout: ReturnType<typeof setTimeout> | null = null
let typed = ''

function show() {
  factIndex.value = Math.floor(Math.random() * facts.length)
  visible.value = true
  if (hideTimeout) clearTimeout(hideTimeout)
  hideTimeout = setTimeout(() => {
    visible.value = false
  }, 5000)
}

function hide() {
  visible.value = false
  if (hideTimeout) clearTimeout(hideTimeout)
}

function onKeydown(e: KeyboardEvent) {
  typed += e.key.toLowerCase()
  typed = typed.slice(-4)
  if (typed === 'unit') {
    show()
    typed = ''
  }
}

function onShowEvent() {
  show()
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('unitsml:show-wappi', onShowEvent)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('unitsml:show-wappi', onShowEvent)
  if (hideTimeout) clearTimeout(hideTimeout)
})

defineExpose({ show })
</script>

<template>
  <Transition name="wappi-pop">
    <div
      v-if="visible"
      ref="mascotRef"
      class="wappi-mascot"
      role="status"
      aria-live="polite"
      @click="hide"
    >
      <div class="wappi-bubble">
        <div class="wappi-fact">{{ facts[factIndex] }}</div>
        <span class="wappi-hint">Click to dismiss</span>
      </div>
      <div class="wappi-sprite" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" fill="var(--unitsml-navy)" />
          <circle cx="17" cy="20" r="3" fill="white" />
          <circle cx="31" cy="20" r="3" fill="white" />
          <circle cx="17" cy="20" r="1.5" fill="var(--unitsml-navy)" />
          <circle cx="31" cy="20" r="1.5" fill="var(--unitsml-navy)" />
          <path d="M18 30c2 3 10 3 12 0" stroke="white" stroke-width="2" stroke-linecap="round" />
          <text x="24" y="70" text-anchor="middle" fill="var(--unitsml-navy)" font-size="10" font-weight="700">WAPPI</text>
        </svg>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.wappi-mascot {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  cursor: pointer;
  pointer-events: auto;
}

.wappi-bubble {
  max-width: 260px;
  padding: 0.875rem 1rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px 16px 4px 16px;
  box-shadow: 0 8px 30px rgba(45, 44, 105, 0.12);
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}

.wappi-fact {
  margin-bottom: 0.375rem;
}

.wappi-hint {
  display: block;
  font-size: 0.6875rem;
  color: var(--vp-c-text-3);
}

.wappi-sprite {
  flex-shrink: 0;
  animation: wappi-bob 2s ease-in-out infinite;
}

@keyframes wappi-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.wappi-pop-enter-active,
.wappi-pop-leave-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.wappi-pop-enter-from,
.wappi-pop-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

@media (max-width: 480px) {
  .wappi-mascot {
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
  }

  .wappi-bubble {
    max-width: none;
    flex: 1;
  }
}
</style>
