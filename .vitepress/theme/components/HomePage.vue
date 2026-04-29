<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { projects } from '../../data/projects'

// ── Animated counter ──
const statsVisible = ref(false)
const statsRef = ref<HTMLElement | null>(null)

const stats = [
  { value: 25, suffix: '+', label: 'Years of development', icon: 'calendar' },
  { value: 10, suffix: '+', label: 'Organizations involved', icon: 'org' },
  { value: 7, suffix: '', label: 'SI base quantities covered', icon: 'measure' },
  { value: 380, suffix: '+', label: 'Units in the database', icon: 'units' },
]

const displayValues = ref(stats.map(() => 0))

function animateCounters() {
  stats.forEach((stat, i) => {
    const target = stat.value
    const duration = 1600
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      displayValues.value[i] = Math.round(eased * target)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  })
}

let statsObserver: IntersectionObserver | null = null

onMounted(() => {
  statsObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !statsVisible.value) {
        statsVisible.value = true
        nextTick(animateCounters)
      }
    },
    { threshold: 0.3 }
  )
  if (statsRef.value) statsObserver.observe(statsRef.value)
})

onUnmounted(() => {
  statsObserver?.disconnect()
})

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

// ── Preview units for CTA ──
const previewUnits = [
  { sym: 'm', name: 'metre', dim: 'L' },
  { sym: 'kg', name: 'kilogram', dim: 'M' },
  { sym: 'N', name: 'newton', dim: 'L·M·T⁻²' },
  { sym: 'Pa', name: 'pascal', dim: 'L⁻¹·M·T⁻²' },
  { sym: 'J', name: 'joule', dim: 'L²·M·T⁻²' },
  { sym: 'W', name: 'watt', dim: 'L²·M·T⁻³' },
]

// ── Floating shapes for hero ──
const shapes = [
  { type: 'circle', size: 80, x: '8%', y: '12%', duration: '6s', delay: '0s', opacity: 0.12 },
  { type: 'square', size: 50, x: '82%', y: '18%', duration: '8s', delay: '1s', opacity: 0.08 },
  { type: 'circle', size: 30, x: '90%', y: '65%', duration: '7s', delay: '2s', opacity: 0.10 },
  { type: 'diamond', size: 45, x: '5%', y: '70%', duration: '9s', delay: '0.5s', opacity: 0.07 },
  { type: 'circle', size: 20, x: '70%', y: '8%', duration: '5s', delay: '1.5s', opacity: 0.09 },
  { type: 'square', size: 35, x: '25%', y: '80%', duration: '7.5s', delay: '3s', opacity: 0.06 },
]

// ── Scrolling unit ticker for hero ──
const tickerUnits = [
  { sym: 'm', name: 'metre' },
  { sym: 'kg', name: 'kilogram' },
  { sym: 's', name: 'second' },
  { sym: 'A', name: 'ampere' },
  { sym: 'K', name: 'kelvin' },
  { sym: 'mol', name: 'mole' },
  { sym: 'cd', name: 'candela' },
  { sym: 'N', name: 'newton' },
  { sym: 'J', name: 'joule' },
  { sym: 'W', name: 'watt' },
  { sym: 'Pa', name: 'pascal' },
  { sym: 'Hz', name: 'hertz' },
  { sym: 'V', name: 'volt' },
  { sym: 'Ω', name: 'ohm' },
  { sym: 'C', name: 'coulomb' },
  { sym: 'F', name: 'farad' },
  { sym: 'H', name: 'henry' },
  { sym: 'T', name: 'tesla' },
  { sym: 'Wb', name: 'weber' },
  { sym: 'lm', name: 'lumen' },
  { sym: 'lx', name: 'lux' },
  { sym: 'Bq', name: 'becquerel' },
  { sym: 'Gy', name: 'gray' },
  { sym: 'Sv', name: 'sievert' },
  { sym: 'kat', name: 'katal' },
]
</script>

<template>
  <!-- ═══════════════════════════════════════════════════════
       HERO
       ═══════════════════════════════════════════════════════ -->
  <div class="home-hero">
    <div class="hero-grid-bg"></div>
    <div class="hero-glow"></div>
    <div class="hero-glow-2"></div>

    <!-- Floating geometric shapes -->
    <div class="hero-shapes">
      <div
        v-for="(shape, i) in shapes"
        :key="i"
        class="hero-shape"
        :class="shape.type"
        :style="{
          width: shape.size + 'px',
          height: shape.size + 'px',
          left: shape.x,
          top: shape.y,
          animationDuration: shape.duration,
          animationDelay: shape.delay,
          opacity: shape.opacity,
        }"
      ></div>
    </div>

    <img src="/symbol.svg" alt="UnitsML" class="home-hero-logo" />

    <!-- Scrolling unit ticker -->
    <div class="hero-ticker">
      <div class="ticker-track">
        <span v-for="(u, i) in [...tickerUnits, ...tickerUnits]" :key="i" class="ticker-item">
          <code>{{ u.sym }}</code> {{ u.name }}
        </span>
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
      <a href="/unitsdb/" class="btn btn-brand">
        Explore UnitsDB
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
      <a href="/schemas.html" class="btn btn-teal">View Schemas</a>
      <a href="/learn/what-is-unitsml.html" class="btn btn-outline">Learn about UnitsML</a>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════
       STATS
       ═══════════════════════════════════════════════════════ -->
  <div class="section stats-section" ref="statsRef">
    <div class="stats-grid">
      <div v-for="(stat, i) in stats" :key="stat.label" class="stat-card" :class="{ visible: statsVisible }">
        <div class="stat-icon">
          <svg v-if="stat.icon === 'calendar'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <svg v-if="stat.icon === 'org'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <svg v-if="stat.icon === 'measure'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 12h20M12 2v20"/><circle cx="12" cy="12" r="3"/></svg>
          <svg v-if="stat.icon === 'units'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
        </div>
        <div class="stat-number">
          <span class="stat-value">{{ displayValues[i] }}</span><span class="stat-suffix">{{ stat.suffix }}</span>
        </div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>
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
          <span class="cta-type-chip"><strong>380</strong> Units</span>
          <span class="cta-type-chip"><strong>199</strong> Quantities</span>
          <span class="cta-type-chip"><strong>92</strong> Dimensions</span>
          <span class="cta-type-chip"><strong>33</strong> Prefixes</span>
          <span class="cta-type-chip"><strong>7</strong> Systems</span>
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
        <div class="step-code">
          <div class="code-header">
            <span class="code-lang">{{ steps[activeStep].lang || 'XML' }}</span>
            <div class="code-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
          <pre><code><span v-html="steps[activeStep].code"></span></code></pre>
        </div>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════
       SOFTWARE
       ═══════════════════════════════════════════════════════ -->
  <div class="section">
    <div class="section-header">
      <h2>Software</h2>
      <p>Core tools and libraries for working with UnitsML.</p>
      <div class="section-divider"></div>
    </div>
    <div class="projects-grid">
      <div v-for="project in projects" :key="project.name" class="project-card featured">
        <div class="card-icon">{{ project.icon }}</div>
        <h3>
          {{ project.name }}
          <span v-if="project.version" class="version">{{ project.version }}</span>
        </h3>
        <p class="description">{{ project.description }}</p>
        <div class="links">
          <a :href="project.github" class="primary" target="_blank" rel="noopener">GitHub</a>
          <a v-if="project.docs" :href="project.docs" class="secondary" target="_blank" rel="noopener">Docs</a>
          <a v-if="project.browse" :href="project.browse" class="teal-link" target="_blank" rel="noopener">Browse</a>
        </div>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════
       WHY UNITSML
       ═══════════════════════════════════════════════════════ -->
  <div class="section">
    <div class="section-header">
      <h2>Why UnitsML?</h2>
      <p>A standard designed for the scientific and engineering community.</p>
      <div class="section-divider"></div>
    </div>
    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <h4>Unambiguous Encoding</h4>
        <p>Eliminate ambiguity in scientific data exchange with standardized representations of units, quantities, and dimensions — expressible in XML, JSON, YAML, and more.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/></svg>
        </div>
        <h4>Composable</h4>
        <p>Designed to be incorporated into other markup languages — not standalone, but a building block for interoperable systems.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <h4>SI &amp; Non-SI Units</h4>
        <p>Covers SI base units, derived units, and common non-SI units — meters, joules, angstroms, and beyond.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        </div>
        <h4>Standards-Based</h4>
        <p>Developed under CalConnect TC UNITS with roots at NIST, following rigorous open standards processes since 1998.</p>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════
       SCHEMA BROWSER CTA
       ═══════════════════════════════════════════════════════ -->
  <div class="section">
    <div class="schema-card">
      <div class="schema-grid-bg"></div>
      <div class="schema-content">
        <div class="schema-badge">Live</div>
        <h3>Browse XML Schemas</h3>
        <p>
          Interactive documentation for all UnitsML schema versions —
          from the current 1.0 release back to the original 0.9 draft.
        </p>
        <div class="schema-url">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity:0.4"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
          <code>https://schema.unitsml.org</code>
        </div>
        <div style="margin-top: 1.5rem; position: relative; z-index: 1;">
          <a href="https://schema.unitsml.org" target="_blank" rel="noopener" class="btn btn-teal">
            Open schema browser
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Hero ── */
.hero-grid-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(45,44,105,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(45,44,105,0.04) 1px, transparent 1px);
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

/* ── Unit ticker ── */
.hero-ticker {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto 2rem;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, black 15%, black 85%, transparent);
  mask-image: linear-gradient(90deg, transparent, black 15%, black 85%, transparent);
}
.ticker-track {
  display: flex;
  gap: 1.5rem;
  animation: ticker-scroll 30s linear infinite;
  width: max-content;
}
.ticker-item {
  flex-shrink: 0;
  font-size: 0.8125rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  opacity: 0.6;
}
.ticker-item code {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--vp-c-text-2);
  background: var(--vp-c-default-soft);
  padding: 0.1em 0.35em;
  border-radius: 3px;
  margin-right: 0.25rem;
}
@keyframes ticker-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.hero-shapes {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.hero-shape {
  position: absolute;
  border: 2px solid var(--unitsml-navy);
  animation: float 6s ease-in-out infinite;
}

.hero-shape.circle {
  border-radius: 50%;
}

.hero-shape.square {
  border-radius: 4px;
  transform: rotate(45deg);
}

.hero-shape.diamond {
  border-radius: 4px;
  transform: rotate(45deg);
}

/* ── Stats section ── */
.stats-section {
  padding: 2rem 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.stat-card {
  text-align: center;
  padding: 2rem 1rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  transition: all 0.4s ease;
  opacity: 0;
  transform: translateY(16px);
}

.stat-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.stat-card:nth-child(2) { transition-delay: 80ms; }
.stat-card:nth-child(3) { transition-delay: 160ms; }
.stat-card:nth-child(4) { transition-delay: 240ms; }

.stat-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 20px rgba(45, 44, 105, 0.08);
}

.stat-icon {
  color: var(--vp-c-brand-1);
  margin-bottom: 0.75rem;
  display: flex;
  justify-content: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--unitsml-navy), var(--unitsml-teal-dark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-variant-numeric: tabular-nums;
}

.stat-suffix {
  font-size: 1.5rem;
  font-weight: 600;
}

.stat-label {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
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

/* ── Schema card ── */
.schema-card {
  position: relative;
  overflow: hidden;
}

.schema-grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
}

.schema-content {
  position: relative;
  z-index: 1;
}

.schema-badge {
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  background: rgba(48, 223, 192, 0.15);
  color: var(--unitsml-teal-light);
  margin-bottom: 1rem;
}

.schema-url {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .steps-layout {
    grid-template-columns: 1fr;
  }

  .steps-code-panel {
    position: static;
    overflow: hidden;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
