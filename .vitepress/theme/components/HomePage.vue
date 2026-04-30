<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

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
</script>

<template>
  <!-- ═══════════════════════════════════════════════════════
       HERO
       ═══════════════════════════════════════════════════════ -->
  <div class="home-hero">
    <div class="hero-grid-bg"></div>
    <div class="hero-glow"></div>
    <div class="hero-glow-2"></div>

    <!-- Floating SI dimensional symbols -->
    <div class="hero-dims" aria-hidden="true">
      <span
        v-for="d in dimSymbols"
        :key="d.char"
        class="hero-dim"
        :style="{
          left: d.x,
          top: d.y,
          fontSize: d.size + 'px',
          animationDuration: d.duration,
          animationDelay: d.delay,
          opacity: d.opacity,
        }"
      >{{ d.char }}</span>
    </div>

    <img src="/symbol.svg" alt="UnitsML" class="home-hero-logo" />

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
  font-weight: 300;
  line-height: 1;
  color: var(--unitsml-navy);
  animation: float-dim 8s ease-in-out infinite;
  user-select: none;
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
