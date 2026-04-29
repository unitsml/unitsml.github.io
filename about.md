# About UnitsML

<div class="about-lead">
  <p class="lead-text">
    UnitsML is a set of models for <strong>unambiguously encoding and identifying scientific units
    of measure and quantities</strong>, usable in XML and other markup languages. Developed under
    <a href="https://www.calconnect.org">CalConnect TC UNITS</a>, it enables reliable scientific
    data exchange across systems and disciplines.
  </p>
</div>

::: info
UnitsML is under active development and its documentation may change frequently.
:::

## The UnitsML Ecosystem

UnitsML consists of interconnected components that together form a complete system for encoding, storing, and accessing scientific units:

<EcosystemDiagram />

<div class="ecosystem-details">
  <div class="ecosystem-item">
    <h4>UnitsML XML Schemas</h4>
    <p>Authoritative XML schemas for encoding scientific units of measure — SI base units, derived units, and non-SI units. Designed to be incorporated into other markup languages.</p>
    <a href="/schemas">Learn more &rarr;</a>
  </div>
  <div class="ecosystem-item">
    <h4>UnitsDB</h4>
    <p>A comprehensive database of scientific units with detailed dimensionality information, unique identifiers, symbols, language-specific names, and conversion factors.</p>
    <a href="/unitsdb/">Learn more &rarr;</a>
  </div>
  <div class="ecosystem-item">
    <h4>unitsml-ruby</h4>
    <p>A Ruby gem providing programmatic access to UnitsDB, enabling developers to integrate units data into their applications.</p>
    <a href="/software/unitsml-ruby">Learn more &rarr;</a>
  </div>
</div>

## Vision

- A set of models for incorporating UnitsML into any markup language or data format
- Extensive repository of schemas and information on units, quantities, and prefixes
- Designed for unit information processing — validation, conversion, and manipulation

## Governance

UnitsML is developed through an open standards process:

<div class="governance-grid">
  <div class="gov-card">
    <div class="gov-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    </div>
    <h4>CalConnect TC UNITS</h4>
    <p>The current home of UnitsML standardization, created in 2022.</p>
    <span class="gov-era">2022–present</span>
  </div>
  <div class="gov-card">
    <div class="gov-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg>
    </div>
    <h4>OASIS TC UnitsML</h4>
    <p>Original standards body. TC formed in 2006, completed its mandate in 2016.</p>
    <span class="gov-era">2006–2016</span>
  </div>
  <div class="gov-card">
    <div class="gov-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M5 21V7l8-4v18M13 21V3l6 4v14M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/></svg>
    </div>
    <h4>NIST</h4>
    <p>Originator and long-term sponsor of UnitsML, through the Physics and MEL laboratories.</p>
    <span class="gov-era">1998–present</span>
  </div>
</div>

## History

A journey spanning over 25 years of standards development:

<TimelineSection />

## People

UnitsML has been shaped by contributors across government, academia, and industry:

<PeopleGrid />

## Participating Organizations

<div class="orgs-grid">
  <a href="https://www.nist.gov" class="org-card" target="_blank" rel="noopener">
    <div class="org-logo">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M5 21V7l8-4v18M13 21V3l6 4v14"/></svg>
    </div>
    <span class="org-name">NIST</span>
    <span class="org-desc">National Institute of Standards and Technology</span>
  </a>
  <a href="https://www.calconnect.org" class="org-card" target="_blank" rel="noopener">
    <div class="org-logo">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
    </div>
    <span class="org-name">CalConnect</span>
    <span class="org-desc">Calendaring and Scheduling Consortium</span>
  </a>
  <a href="https://www.lbl.gov" class="org-card" target="_blank" rel="noopener">
    <div class="org-logo">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    </div>
    <span class="org-name">LBNL</span>
    <span class="org-desc">Lawrence Berkeley National Laboratory</span>
  </a>
  <a href="https://www.ribose.com" class="org-card" target="_blank" rel="noopener">
    <div class="org-logo">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/></svg>
    </div>
    <span class="org-name">Ribose</span>
    <span class="org-desc">Open standards and security</span>
  </a>
  <a href="https://www.ibm.com" class="org-card" target="_blank" rel="noopener">
    <div class="org-logo">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
    </div>
    <span class="org-name">IBM</span>
    <span class="org-desc">OASIS TC participant</span>
  </a>
  <a href="http://www.xml-cml.org" class="org-card" target="_blank" rel="noopener">
    <div class="org-logo">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
    </div>
    <span class="org-name">CML</span>
    <span class="org-desc">Chemical Markup Language</span>
  </a>
</div>

<style scoped>
.about-lead {
  margin-bottom: 2rem;
}

.lead-text {
  font-size: 1.125rem;
  line-height: 1.75;
  color: var(--vp-c-text-2);
  max-width: 640px;
}

.lead-text strong {
  color: var(--vp-c-text-1);
}

/* Ecosystem details */
.ecosystem-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin: 3rem 0;
}

.ecosystem-item {
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  transition: all 0.25s ease;
}

.ecosystem-item:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 16px rgba(45, 44, 105, 0.06);
}

.ecosystem-item h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
}

.ecosystem-item p {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.65;
  margin-bottom: 0.75rem;
}

.ecosystem-item a {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.ecosystem-item a:hover {
  text-decoration: underline;
}

/* Governance */
.governance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.gov-card {
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  text-align: center;
  transition: all 0.25s ease;
}

.gov-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 16px rgba(45, 44, 105, 0.06);
}

.gov-icon {
  color: var(--vp-c-brand-1);
  margin-bottom: 0.75rem;
  display: flex;
  justify-content: center;
}

.gov-card h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.375rem;
}

.gov-card p {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.gov-era {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  font-weight: 500;
}

/* Organizations */
.orgs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.org-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.25rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  text-align: center;
  transition: all 0.25s ease;
}

.org-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 16px rgba(45, 44, 105, 0.06);
  transform: translateY(-1px);
}

.org-logo {
  color: var(--vp-c-brand-1);
  display: flex;
}

.org-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.org-desc {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  line-height: 1.4;
}

@media (max-width: 640px) {
  .ecosystem-details,
  .governance-grid {
    grid-template-columns: 1fr;
  }

  .orgs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

## Frequently Asked Questions

<FAQAccordion />
