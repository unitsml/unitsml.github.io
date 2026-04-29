---
title: Who is UnitsML for
description: Target audiences, use cases, and real-world applications of UnitsML
---

# Who is UnitsML for?

UnitsML is relevant to anyone who creates, exchanges, or processes scientific and engineering data that involves units of measure and quantities. This spans a wide range of disciplines and roles.

## Target audiences

### Standards developers and markup language designers

If you're designing a markup language or data format for a scientific or engineering domain, UnitsML provides **ready-made markup for units of measure**. Instead of inventing your own unit representation, you can incorporate UnitsML elements directly into your schema.

**Benefits:**
- Avoid reinventing unit representation for each domain
- Gain interoperability with other markup languages that use UnitsML
- Leverage existing unit definitions, conversions, and dimensional analysis

**Examples:** MatML (materials data), CML (chemical markup), AnIML (analytical chemistry), GML (geography), domain-specific engineering formats.

### Data exchange architects

If you're building systems that exchange scientific data between organizations or disciplines, UnitsML provides a **common language for units** that eliminates ambiguity.

**Benefits:**
- Unambiguous unit identification across systems
- Machine-readable conversion factors between unit systems
- Dimensional validation to catch data errors before they propagate

**Examples:** Supply chain data exchange, laboratory information management systems, cross-disciplinary research data portals, emergency response data integration.

### Database and software developers

If you're building software that handles scientific measurements, UnitsML provides a **structured data model** for units that goes beyond simple string labels.

**Benefits:**
- Precise unit definitions with symbols in 6 representations (ASCII, Unicode, HTML, LaTeX, MathML, id)
- Built-in conversion algorithms via linear equation factors
- Integration with [UnitsDB](/unitsdb/) for comprehensive unit data
- Programmatic access via the [unitsml-ruby](/software/unitsml-ruby) gem

**Examples:** Scientific computing libraries, measurement instrument software, data validation tools, laboratory automation systems.

### Scientific data managers

If you manage scientific data repositories or archives, UnitsML enables **self-describing datasets** where units are explicitly defined rather than assumed from context.

Modern laboratories generate vast quantities of measurement data from instruments using different unit conventions. When digitized analytical data is separated from metadata about how samples were collected and analyzed, the connection between scientific metadata and the data itself can be lost, rendering the data useless.

**Benefits:**
- Datasets remain interpretable long after their original context is lost
- Automated unit validation and conversion
- Consistent metadata across heterogeneous data sources

**Examples:** Government science agencies, research data repositories, environmental monitoring databases.

### Standards bodies and regulatory organizations

If your organization publishes standards involving scientific measurements, UnitsML provides an **authoritative mechanism** for encoding units in machine-readable form.

**Benefits:**
- Normative reference for unit definitions
- Alignment with SI and NIST standards
- Machine-processable specifications

**Examples:** NIST, ISO committees, CalConnect, industry consortia, national metrology institutes.

## Real-world use cases

### Emergency response data integration

During emergencies, scientific data from disparate sources must be rapidly combined and interpreted. A radiation reading in "mSv/h" from one system must be correctly understood alongside a reading in "rem/h" from another. UnitsML provides the unambiguous definitions and conversion factors needed for reliable data fusion in time-critical situations.

### Manufacturing supply chain specifications

Technical specifications that accompany products through the manufacturing supply chain include physical properties — dimensions, tolerances, material properties — expressed in various units. When a supplier specifies a tolerance as "±0.005 in" and the buyer's system works in millimetres, UnitsML enables automatic, precise conversion without loss of accuracy.

### Multi-disciplinary research collaboration

Research projects spanning physics, chemistry, engineering, and biology encounter a bewildering variety of units. A chemistry dataset might use angstroms and electronvolts while an engineering dataset uses nanometres and joules. UnitsML provides a common framework that makes all units explicitly defined and convertible.

### Laboratory data management

Modern laboratories generate vast quantities of measurement data from instruments using different unit conventions. UnitsML enables:
- Automatic unit validation when importing data
- Consistent unit display across user interfaces
- Reliable data aggregation from multiple instruments and vendors
- Long-term data integrity through self-describing unit definitions

### Geographic and environmental information systems

GIS and environmental monitoring systems work with spatial units (metres, degrees, radians), temporal units (seconds, days, years), and derived units (m/s, kg/m³, W/m²). UnitsML provides a unified schema for all these unit types.

### Analytical chemistry and spectroscopy

The Analytical Information Markup Language (AnIML), developed by ASTM Subcommittee E13.15, is a real-world example of incorporating UnitsML into a domain-specific markup language for spectroscopy and chromatography data. AnIML uses UnitsML to handle all unit information, ensuring that analytical data remains self-describing and interchangeable across vendor platforms.

## How different users enter the UnitsML ecosystem

<div class="entry-paths">
  <div class="entry-path">
    <div class="entry-role">Standards developers</div>
    <div class="entry-arrow">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </div>
    <div class="entry-action">Incorporate UnitsML into your XML schema via reference, import, include, or redefine</div>
  </div>
  <div class="entry-path">
    <div class="entry-role">Software developers</div>
    <div class="entry-arrow">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </div>
    <div class="entry-action">Use the unitsml-ruby gem for programmatic access, or parse UnitsML XML with standard libraries</div>
  </div>
  <div class="entry-path">
    <div class="entry-role">Data managers</div>
    <div class="entry-arrow">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </div>
    <div class="entry-action">Add UnitsML markup to existing datasets; use UnitsDB for authoritative unit definitions</div>
  </div>
  <div class="entry-path">
    <div class="entry-role">End users & researchers</div>
    <div class="entry-arrow">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </div>
    <div class="entry-action">Browse units interactively at <a href="/unitsdb/">UnitsDB</a>; use software that supports UnitsML natively</div>
  </div>
</div>

## Domains that benefit from UnitsML

| Domain | Common units | Why UnitsML helps |
|--------|-------------|-------------------|
| Physics | m, kg, s, A, K, mol, cd, J, N, Pa | Base SI units and derived units with precise definitions |
| Chemistry | mol/L, eV, Å, Da, g/mol | Bridge between SI and domain-specific non-SI units |
| Engineering | MPa, kW, mm, µm, rpm | Mixed SI and non-SI units with conversion factors |
| Metrology | All SI + derived | Authoritative definitions aligned with BIPM |
| Environmental science | µg/m³, ppb, Bq/m³ | Complex derived units from multiple base quantities |
| Materials science | GPa, J/m², nm, K/s | Combined units with dimensional analysis |
| Aerospace | ft, in, lbf, psi, Mach | Mixed unit systems requiring precise conversion |
| Healthcare | mg/dL, mmHg, mSv | Medical units with non-trivial conversion factors |
| Analytical chemistry | µg/L, mAU, m/z | Instrument-specific units needing standardization |

## Adoption path

The use of UnitsML is **completely optional** — it's designed to add value where it's needed, not to force migration of existing systems. In many cases, existing systems have already developed domain-specific markup or codes for handling units, and it may not be practical to convert such systems to use UnitsML. However, the advantages — ready-made markup for units, improved interoperability — should provide a compelling case for new projects.

Many organizations adopt UnitsML incrementally:

1. **Reference** — Start by referencing UnitsML definitions for units in new data formats
2. **Integrate** — Add UnitsML elements to existing XML schemas
3. **Automate** — Use UnitsDB and conversion tools for automated processing
4. **Standardize** — Mandate UnitsML in data exchange agreements and specifications

## Next steps

- [What is UnitsML?](/learn/what-is-unitsml) — understand the core concepts
- [How UnitsML works](/learn/how-it-works) — see the technical architecture in detail
- [Incorporating UnitsML](/learn/incorporating-unitsml) — four methods of integration
- [UnitsDB](/unitsdb/) — browse the complete interactive database
- [Get started](/get-started) — begin using UnitsML in your projects

<style scoped>
.entry-paths {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;
}

.entry-path {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
}

.entry-role {
  font-weight: 600;
  color: var(--vp-c-text-1);
  font-size: 0.9375rem;
  min-width: 160px;
}

.entry-arrow {
  color: var(--vp-c-brand-1);
  flex-shrink: 0;
}

.entry-action {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.entry-action a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
}

.entry-action a:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .entry-path {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .entry-arrow {
    transform: rotate(90deg);
  }
}
</style>
