---
title: Resources
description: Reference materials, presentations, publications, and archived documentation for UnitsML
---

# Resources

<div class="resources-intro">
  <p class="resources-lead">
    A collection of presentations, publications, and guidelines
    from the UnitsML project's 25-year history.
  </p>
</div>

<nav class="resources-toc">
  <a href="#scidatacon-2022">SciDataCon 2022</a>
  <a href="#presentations-talks">Presentations</a>
  <a href="#publications">Publications</a>
  <a href="#guidelines-rules">Guidelines &amp; Rules</a>
</nav>

## SciDataCon 2022 — Units Summit

At the **SciDataCon 2022** "Units Summit" session, a comprehensive introduction to UnitsML was presented, covering the project's history, architecture, and future direction under CalConnect TC UNITS.

<div class="video-embed">
  <div class="video-wrapper">
    <iframe
      width="560"
      height="315"
      src="https://www.youtube.com/embed/oJJIVVwoB34"
      title="UnitsML Introduction — SciDataCon 2022"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
</div>

The presentation covered:

- **The problem of ambiguous units** — why existing approaches (code lists, symbols, names) fail for reliable scientific data exchange
- **UnitsML's approach** — structured models for encoding units, quantities, and dimensions
- **UnitsDB** — the comprehensive database of scientific units, from SI base units to non-SI units
- **Standards governance** — the transition from NIST through OASIS to CalConnect TC UNITS
- **Future directions** — international alignment with ISO, IEC, and BIPM towards a "Digital SI"

## Presentations & Talks

<div class="resource-grid">
  <a href="/ref-docs/UnitsML-Santa-Fe-2003.ppt" class="resource-card">
    <div class="resource-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
    </div>
    <div class="resource-body">
      <h4>Sixth Open Forum on Metadata Registries</h4>
      <p>Early UnitsML presentation at the metadata registries forum in Santa Fe, NM — one of the first public introductions of the project.</p>
      <span class="resource-meta">January 2003 &middot; PPT</span>
    </div>
  </a>
</div>

## Publications

<div class="resource-grid">
  <a href="/ref-docs/Improving_Interoperability_by_Incorporating_UnitsM.pdf" class="resource-card">
    <div class="resource-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
    </div>
    <div class="resource-body">
      <h4>Improving Interoperability by Incorporating UnitsML into Markup Languages</h4>
      <p>Peer-reviewed paper in the <em>NIST Journal of Research</em> describing how UnitsML improves data exchange by embedding unambiguous unit definitions in markup languages.</p>
      <span class="resource-meta">January–February 2010 &middot; NIST JRES &middot; PDF</span>
    </div>
  </a>
</div>

## Guidelines & Rules

<div class="resource-grid">
  <a href="/ref-docs/UnitsML-Guide-v1.0-wd01.pdf" class="resource-card">
    <div class="resource-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    </div>
    <div class="resource-body">
      <h4>Guidelines for the Use of UnitsML</h4>
      <p>Official guidelines document covering how to use UnitsML in practice — writing valid markup, choosing appropriate elements, and incorporating UnitsML into other formats.</p>
      <span class="resource-meta">Version 1.0-wd01 &middot; PDF</span>
    </div>
  </a>

  <a href="/ref-docs/UnitsML_Guidelines_DraftVersion_0.4.doc" class="resource-card">
    <div class="resource-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    </div>
    <div class="resource-body">
      <h4>UnitsML Guidelines Draft v0.4.2</h4>
      <p>Early draft of the UnitsML usage guidelines, providing context on the design decisions and intended usage patterns.</p>
      <span class="resource-meta">Draft 0.4.2 &middot; DOC</span>
    </div>
  </a>
</div>

<style scoped>
.resources-intro {
  margin-bottom: 2rem;
}

.resources-lead {
  font-size: 1.125rem;
  line-height: 1.75;
  color: var(--vp-c-text-2);
  max-width: 640px;
}

.resources-toc {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 3rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.resources-toc a {
  font-size: 0.8125rem;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  text-decoration: none;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.2s ease;
}

.resources-toc a:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.25rem;
  margin: 1.5rem 0 3rem;
}

.resource-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: all 0.25s ease;
}

.resource-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 16px rgba(45, 44, 105, 0.06);
  transform: translateY(-1px);
}

.resource-icon {
  color: var(--vp-c-brand-1);
  flex-shrink: 0;
  display: flex;
  padding-top: 0.125rem;
}

.resource-body h4 {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.375rem;
  line-height: 1.4;
}

.resource-body p {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.resource-meta {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  font-weight: 500;
}

/* Video embed */
.video-embed {
  margin: 1.5rem 0 2rem;
}

.video-wrapper {
  position: relative;
  width: 100%;
  max-width: 720px;
  padding-bottom: 56.25%;
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

@media (max-width: 640px) {
  .resource-grid {
    grid-template-columns: 1fr;
  }
}
</style>
