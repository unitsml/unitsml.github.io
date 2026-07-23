---
title: Schemas
description: Schema definitions for UnitsML and UnitsDB
---

# Schemas

UnitsML provides two complementary sets of schema definitions for encoding and validating scientific units of measure.

## UnitsML XML Schemas

<div class="page-links">
  <a href="https://github.com/unitsml/schemas" target="_blank" rel="noopener" class="link-card">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
    <span>View on GitHub</span>
  </a>
  <a href="https://schema.unitsml.org/" target="_blank" rel="noopener" class="link-card teal">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
    <span>Browse at schema.unitsml.org</span>
  </a>
</div>

Authoritative XML schemas (XSD) for encoding scientific units of measure in XML documents. UnitsML XML Schemas validate XML documents that use UnitsML markup, covering SI base units, derived units, and non-SI units.

The schema is designed to be used **in combination with other specific schemas** through XML namespaces — not as a standalone schema. Developers of other markup languages incorporate UnitsML to address the needs of specific communities such as mathematics, chemistry, and materials science.

### Supported unit types

<div class="unit-types">
  <div class="unit-type">
    <div class="unit-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/></svg>
    </div>
    <h4>SI Base & Special Derived</h4>
    <p>meter, second, joule, volt, kilogram, ampere, kelvin, mole, candela</p>
  </div>
  <div class="unit-type">
    <div class="unit-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/></svg>
    </div>
    <h4>SI Derived Units</h4>
    <p>square meter, meter per second, newton, pascal, watt, hertz, and more</p>
  </div>
  <div class="unit-type">
    <div class="unit-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
    </div>
    <h4>Non-SI Units</h4>
    <p>minute, angstrom, inch, pound, calorie, atmosphere, and others</p>
  </div>
</div>

### Schema versions

| Version | Status | Description |
|---------|--------|-------------|
| UnitsML 1.0 | **Current** | Latest stable release |
| UnitsML 1.0-CSD04 | Draft | Committee Specification Draft 04 |
| UnitsML 0.9.x | Historical | Earlier development versions |
| UnitsML-Lite | Deprecated | Simplified subset |

::: info Generated from UnitsDB
The enumerated lists in the UnitsML 1.0 XSD are **generated from UnitsDB** — the single source of truth for unit definitions. The root units of `EnumeratedRootUnit/@unit` (`meter`, `degree_Celsius`, `knot`, …) and the enumerated prefix symbols (`Y`–`y`, `Ki`–`Yi`) are built directly from UnitsDB's `units.yaml` and `prefixes.yaml` at schema build time. When UnitsDB is updated, the schema is regenerated from the database, so the XSD enumeration never drifts from the [UnitsDB unit entries](/unitsdb/units) it draws from.
:::

## UnitsDB YAML Schemas

<div class="page-links">
  <a href="https://github.com/unitsml/unitsdb/tree/main/schemas" target="_blank" rel="noopener" class="link-card">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
    <span>View schemas on GitHub</span>
  </a>
  <a href="/unitsdb/" class="link-card teal">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
    <span>Browse UnitsDB data</span>
  </a>
</div>

YAML schemas that define the structure and validation rules for UnitsDB — the authoritative database of scientific units. Each schema validates one of the six entity types:

| Schema | Entity | Defines |
|--------|--------|---------|
| `units-schema.yaml` | **Unit** | Measurement units with identifiers, symbols, scale/system references, dimensional composition |
| `quantities-schema.yaml` | **Quantity** | Measurable properties (length, mass, force) with dimension references |
| `dimensions-schema.yaml` | **Dimension** | SI base quantity dimensional powers (L, M, T, I, Θ, N, J) |
| `prefixes-schema.yaml` | **Prefix** | SI decimal (kilo, milli) and binary (kibi, mebi) scaling factors |
| `scales-schema.yaml` | **Scale** | Measurement scale properties (continuous, ordered, logarithmic, interval, ratio) |
| `unit_systems-schema.yaml` | **Unit System** | Systems of measurement (SI, CGS) with base unit definitions |

### Shared patterns

All entity schemas share common structures:

- **`identifiers[]`** — Cross-system IDs with `type` enum (nist, unitsml, ucum, si-digital-framework)
- **`names[]`** — Multilingual names with ISO language codes
- **`references[]`** — Informative and normative external references

Unit, Prefix, and Dimension schemas include **6-format symbol representations**: `latex`, `unicode`, `ascii`, `html`, `id`, `mathml`.

## Related resources

- [UnitsDB](/unitsdb/) — browse the complete database with 716 entities
- [How UnitsML Works](/learn/how-it-works) — technical architecture overview
- [UnitsML Guide](/learn/guide) — usage guide with examples
- [unitsml-ruby](/software/unitsml-ruby) — Ruby gem for programmatic access
