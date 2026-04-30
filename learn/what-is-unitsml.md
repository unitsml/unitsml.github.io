---
title: What is UnitsML
description: An overview of UnitsML — models for unambiguously encoding and identifying scientific units of measure and quantities
---

# What is UnitsML?

UnitsML is a set of models for **unambiguously encoding and identifying scientific units of measure and quantities**, usable in XML and other markup languages. It provides structured schemas that allow different markup languages, information systems, and scientific disciplines to exchange data with clear, machine-readable unit definitions.

## The problem UnitsML solves

### Units are everywhere — and they're not easy

In our physical world, units surround us. We compare distances, time, and weight effortlessly using an internal system of scales and references. "The grocery store is further away than the workplace." "The road bike is lighter than the mountain bike."

But communicating units of measure is not as trivial as it appears. Consider these pitfalls:

- **Code lists** contain an arbitrary set of units with fixed codes. They are typically static — only a selection of units is represented, and the format is rigid.
- **Symbols** are lightweight but become ambiguous outside SI. Consider `nm`: nanometers or nautical miles?
- **Names** are descriptive but not always standardized. Is a "pound" a US pound (~453.6 g), a metric pound (500 g), a troy pound, or an avoirdupois pound?

### When units go wrong, the consequences are real

<div class="callout-grid">
  <div class="callout-card callout-danger">
    <div class="callout-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
    </div>
    <h4>Mars Climate Orbiter (1999)</h4>
    <p>NASA lost the $125 million Mars Climate Orbiter because one engineering team used English units (pound-seconds) while another used metric units (newton-seconds) for thruster firings. The spacecraft entered Mars' atmosphere at the wrong trajectory and was destroyed.</p>
  </div>
  <div class="callout-card callout-warning">
    <div class="callout-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
    </div>
    <h4>Space Shuttle Discovery (1985)</h4>
    <p>During a Strategic Defense Initiative test, the shuttle Discovery flew upside-down over Maui because a guidance system expected units in nautical miles but received feet — 10,023 feet was interpreted as 10,023 nautical miles, pointing the mirror upward instead of down.</p>
  </div>
</div>

These are not isolated incidents. In scientific data exchange, units are often:

- **Implicit** — assumed from context but never stated
- **Ambiguous** — "lb" could mean pound-mass or pound-force
- **Inconsistent** — different databases use different code lists for the same unit
- **Lost in translation** — converting between systems introduces errors

UnitsML addresses these problems by providing a **standard vocabulary** for defining units, quantities, dimensions, and their relationships — so that scientific data can be exchanged reliably between any systems that understand UnitsML.

## What UnitsML provides

### Unit definitions

UnitsML can define any scientific unit of measure — SI base units, SI derived units, and non-SI units. Each unit includes:

- A unique identifier (`xml:id`)
- One or more names and symbols (ASCII, Unicode, HTML, LaTeX, MathML representations)
- The unit system it belongs to (SI, CGS, inch-pound, etc.)
- Dimensional references for dimensional analysis
- Conversion factors to other units

```xml
<Unit xml:id="m" dimensionURL="#dim_L">
  <UnitName>metre</UnitName>
  <UnitSymbol typeface="ASCII">m</UnitSymbol>
  <UnitDefinition>
    The metre is the length of the path travelled by light in vacuum
    during a time interval of 1/299 792 458 of a second.
  </UnitDefinition>
</Unit>
```

### Dimensional analysis

UnitsML links units to their **dimensional representations** in terms of the seven SI base quantities. This enables dimensional checking — verifying that unit conversions and calculations are physically meaningful.

The seven SI base quantities and their corresponding units:

| Base quantity | Unit name | Symbol |
|--------------|-----------|--------|
| length | metre | m |
| mass | kilogram | kg |
| time | second | s |
| electric current | ampere | A |
| thermodynamic temperature | kelvin | K |
| amount of substance | mole | mol |
| luminous intensity | candela | cd |

For example, the dimension of force is **L·M·T⁻²** — length to the first power, mass to the first power, time to the negative second power. This is expressed in UnitsML as:

```xml
<Dimension xml:id="dim_LMT-2">
  <Length symbol="L" powerNumerator="1"/>
  <Mass symbol="M" powerNumerator="1"/>
  <Time symbol="T" powerNumerator="-2"/>
</Dimension>
```

### Conversion factors

UnitsML provides **built-in conversion information** between units using a linear equation:

**y = d + ((b / c) × (x + a))**

This covers the vast majority of unit conversions:

```xml
<Float64ConversionFrom xml:id="conv_m_to_km"
  initialUnit="#m"
  multiplicand="0.001"
  exact="true"/>
```

For non-linear conversions, UnitsML supports special conversion definitions and external service references.

### Quantity definitions

UnitsML defines quantities — measurable properties like length, mass, force, energy — and links them to the units that can express them:

```xml
<Quantity xml:id="q_length">
  <QuantityName>length</QuantityName>
  <QuantitySymbol>l</QuantitySymbol>
</Quantity>
```

### Prefix support

All 20 SI prefixes (yotta through yocto) plus binary prefixes (kibi through exbi) are supported, allowing derived units like kilometers, milligrams, and megahertz to be precisely defined:

```xml
<EnumeratedRootUnit unit="meter" prefix="k" powerNumerator="1"/>
```

### Counted items

UnitsML includes support for **counted items** — things that are counted and combined with scientific units (e.g., "electrons per second", "particles per cubic meter"). A counted item is not itself a unit, but a dimensionless entity that can be combined with units.

## The UnitsML schema

The UnitsML XML Schema is maintained at [schema.unitsml.org](https://schema.unitsml.org) and defines five top-level containers:

| Element | Purpose |
|---------|---------|
| `UnitSet` | Container for unit definitions |
| `CountedItemSet` | Container for counted items |
| `QuantitySet` | Container for quantity definitions |
| `DimensionSet` | Container for dimensional representations |
| `PrefixSet` | Container for SI and binary prefixes |

Each container is independent — you can use `UnitSet` alone, or combine multiple containers as needed. This modular design makes it easy to incorporate just the parts of UnitsML your application requires.

The current schema version is **1.0**, with namespace `https://schema.unitsml.org/unitsml/1.0`.

## Designed for incorporation

UnitsML is **not a standalone document format** — it is designed to be incorporated into other markup languages and data formats. This is a key design principle. You don't write "UnitsML documents"; instead, you add UnitsML markup to your existing formats.

There are four ways to incorporate UnitsML into XML:

1. **Reference** — Point to the UnitsML schema via `xsi:schemaLocation` without modifying it
2. **Import** — Use XSD `<import>` to bring in UnitsML types and elements
3. **Include** — Use XSD `<include>` to embed UnitsML definitions directly
4. **Redefine** — Use XSD `<redefine>` to customize UnitsML elements for your domain

See [Incorporating UnitsML](/learn/incorporating-unitsml) for detailed guidance on each approach.

## UnitsDB — the units database

UnitsDB is a comprehensive database of scientific units of measure, originally developed at NIST. It contains:

- **SI base units** (metre, kilogram, second, ampere, kelvin, mole, candela)
- **SI derived units** with special names (newton, pascal, joule, watt, volt, etc.)
- **Non-SI units** acceptable for use with SI (litre, hour, day, electronvolt, etc.)
- **Non-SI units** from other systems (inch, foot, pound, BTU, etc.)
- **Prefixes** — all SI prefixes and binary prefixes
- **Quantities** — over 180 quantities with unit associations
- **Conversion factors** between units

Browse the full interactive database at [unitsml.org/unitsdb](/unitsdb/). The [unitsml-ruby](/software/unitsml-ruby) gem provides programmatic access.

## Relationship to the International System of Units (SI)

UnitsML has a close relationship with the **International System of Units (SI)**, which is the modern form of the metric system and the world's most widely used system of measurement:

- NIST is responsible for interpreting the SI for use in the United States (per NIST Special Publication 811)
- UnitsML's dimensional analysis is based on the seven SI base quantities
- UnitsML covers SI units, SI-acceptable non-SI units, and common non-SI units from other systems
- UnitsDB includes comprehensive SI unit definitions aligned with the *BIPM SI Brochure*

The availability of a markup language for units allows for the unambiguous storage, exchange, and processing of numerical data, thus facilitating the collaboration and sharing of information. It is anticipated that UnitsML will be used by the developers of other markup languages to address the needs of specific communities — mathematics, chemistry, materials science, business and commerce. Use of UnitsML in other markup languages reduces duplication of effort and improves compatibility among specifications that represent numerical data.

For authoritative guidance on SI usage, see [NIST SP 811](https://www.nist.gov/pml/special-publication-811) — *Guide for the Use of the International System of Units (SI)*.

## Standards governance

UnitsML has been developed through collaborative standardization:

- **1998–2006**: Initial development at NIST (National Institute of Standards and Technology), with support from the SIMA (Systems Integration for Manufacturing Applications) program
- **2006–2016**: Development continued through an OASIS Technical Committee, which produced Committee Specification Drafts including UnitsML 1.0-CSD04
- **2022–present**: Standards work continues under **CalConnect TC UNITS**, which maintains the schema, specifications, and related deliverables

The schema namespace and hosting transitioned from NIST to the independent `schema.unitsml.org` domain, reflecting the project's maturation into a community-maintained standard.

::: tip Historical note
UnitsML was originally hosted at `unitsml.nist.gov`. An OASIS Technical Committee was established in 2006 and completed its mandate in 2016. In 2022, governance transitioned to CalConnect TC UNITS. All OASIS-era working references have been updated to reflect current CalConnect stewardship.
:::

## Next steps

- [Who is UnitsML for?](/learn/who-is-it-for) — understand the target audiences and use cases
- [How UnitsML works](/learn/how-it-works) — dive into the technical architecture
- [Incorporating UnitsML](/learn/incorporating-unitsml) — learn how to add UnitsML to your XML formats
- [UnitsDB](/unitsdb/) — browse the complete interactive database
- [Get started](/get-started) — start using UnitsML in your projects

<style scoped>
.callout-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.25rem;
  margin: 2rem 0;
}

.callout-card {
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid;
}

.callout-card.callout-danger {
  background: rgba(239, 68, 68, 0.04);
  border-color: rgba(239, 68, 68, 0.15);
}

.callout-card.callout-warning {
  background: rgba(245, 158, 11, 0.04);
  border-color: rgba(245, 158, 11, 0.15);
}

.callout-card.callout-danger .callout-icon {
  color: #ef4444;
}

.callout-card.callout-warning .callout-icon {
  color: #f59e0b;
}

:global(.dark) .callout-card.callout-danger {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.25);
}

:global(.dark) .callout-card.callout-warning {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.25);
}

:global(.dark) .callout-card.callout-danger .callout-icon {
  color: #f87171;
}

:global(.dark) .callout-card.callout-warning .callout-icon {
  color: #fbbf24;
}

.callout-icon {
  margin-bottom: 0.75rem;
}

.callout-card h4 {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
}

.callout-card p {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.65;
  margin: 0;
}

@media (max-width: 640px) {
  .callout-grid {
    grid-template-columns: 1fr;
  }
}
</style>
