---
title: IEC Common Data Dictionary
description: How IEC CDD and IEC/TS 62720 use UnitsML for unit representation
---

<div class="adopter-hero">
  <div class="adopter-hero-logo">
    <img src="/logos/iec-logo.svg" alt="IEC" />
  </div>
  <div class="adopter-hero-text">
    <h1>IEC Common Data Dictionary (CDD)</h1>
    <p class="adopter-tagline">The IEC's machine-readable dictionary of units, quantities, and product properties for industrial automation.</p>
    <div class="adopter-hero-links">
      <a href="https://cdd.iec.ch" target="_blank" rel="noopener">cdd.iec.ch</a>
      <a href="https://webstore.iec.ch/en/publication/31044" target="_blank" rel="noopener">IEC/TS 62720</a>
    </div>
  </div>
</div>

## How IEC CDD uses UnitsML

The IEC Common Data Dictionary (CDD) is the IEC's central repository of standardized
product ontologies, quantities, and units. Its units are defined by
**IEC/TS 62720** — *Identification of units of measurement for computer-based
processing* — which assigns stable, machine-readable identifiers to every unit used
in electrotechnical and industrial standards.

UnitsML provides the semantic foundation for that representation. In the industrial
automation ecosystem, ECLASS provides IRDIs (International Registration Data
Identifiers) based on UnitsML. These ECLASS unit identifiers have a **1:1
relationship** with the units defined in IEC/TS 62720 and published in the IEC CDD.
In practice, this means that a unit referenced in an ECLASS product description can
be resolved to the same concept in the IEC CDD, and vice versa.

The OPC Foundation's **OPC UA** standard demonstrates this in practice. OPC UA maps
IEC/TS 62720 units to its own `EUInformation` structure, using the IEC CDD as the
authoritative source. Because UnitsML aligns with IEC/TS 62720 through the ECLASS
mapping, OPC UA systems can exchange unit information with UnitsML-based systems
without loss of meaning.

## What UnitsML gives IEC CDD

- **Semantic grounding** — UnitsML's dimensions, quantities, and systems provide the
  formal model that underlies IEC/TS 62720's unit identifiers.
- **ECLASS harmonization** — the 1:1 mapping between UnitsML-based ECLASS IRDIs and
  IEC CDD units enables cross-vocabulary data exchange.
- **SI alignment** — UnitsML's basis in the BIPM SI Brochure and Digital SI Framework
  keeps IEC CDD units anchored to the international measurement system.
- **Machine readability** — XML-based definitions let automation systems validate
  and convert units programmatically.
- **Standards credibility** — IEC CDD can reference a mature, NIST/OASIS/CalConnect
  standard rather than maintaining a parallel, proprietary unit model.

## Learn more

- [IEC CDD](https://cdd.iec.ch) — browse the Common Data Dictionary
- [IEC/TS 62720](https://webstore.iec.ch/en/publication/31044) — the units identification standard
- [OPC UA Part 8](https://reference.opcfoundation.org/specs/OPC-10000-8/5.6.4.5) — IEC 62720 mapping example
- [Who uses UnitsML](/who-uses-unitsml) — other standards and products
