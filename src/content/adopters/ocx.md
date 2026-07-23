---
title: OCX Consortium
description: How the Open Class 3D Exchange standard uses UnitsML for shipbuilding
---

<div class="adopter-hero">
  <div class="adopter-hero-logo">
    <img src="/logos/ocx-logo.svg" alt="OCX Consortium" />
  </div>
  <div class="adopter-hero-text">
    <h1>Open Class 3D Exchange (OCX)</h1>
    <p class="adopter-tagline">The vessel-specific XML standard for model-based class approval in shipbuilding.</p>
    <div class="adopter-hero-links">
      <a href="https://3docx.org" target="_blank" rel="noopener">3docx.org</a>
      <a href="https://github.com/OCXStandard/OCX_Schema" target="_blank" rel="noopener">GitHub</a>
    </div>
  </div>
</div>

## How OCX uses UnitsML

OCX is an XML-based format for exchanging ship structural and geometric data between
shipyards' design tools and classification societies' rule-checking platforms. Every
physical quantity in an OCX document — lengths, masses, centres of gravity, panel
thicknesses, tank volumes — must carry an unambiguous unit reference.

OCX encodes these quantities using UnitsML. In an OCX file, a numeric value is paired
with a unit attribute whose values are defined by the UnitsML schema:

```xml
<ocx:CenterOfGravity>
  <ocx:X numericvalue="376.1" unit="Um" />
  <ocx:Y numericvalue="0" unit="Um" />
  <ocx:Z numericvalue="16.7" unit="Um" />
</ocx:CenterOfGravity>
```

The `unit="Um"` references are UnitsML identifiers (here, the metre). This lets OCX
consumers — whether a CAD exporter or a class-society calculation engine — resolve
every measurement to a machine-readable definition rather than an ambiguous string.

OCX was developed through the APPROVED joint industry project (2016–2020) led by DNV,
with participation from Aveva, Hexagon, Siemens, NAPA, Kongsberg Maritime, Ulstein,
Chantiers de l'Atlantique, and Digitread. The OCX Consortium was founded in 2021 to
maintain and promote the standard, which is used today for 3D model-based class
approval by major classification societies and shipbuilders.

## What UnitsML gives OCX

- **Unambiguous units** — no risk of `mm` vs `m` vs `in` misinterpretation across tools.
- **Dimensional analysis** — UnitsML's dimensional references let OCX validate that
  a length is truly a length, a mass truly a mass.
- **SI alignment** — UnitsML's foundation in the SI system matches the maritime
  industry's metric standards.
- **Machine readability** — class-society engines can automatically convert and
  verify units without manual review.
- **Standards credibility** — using a NIST/OASIS/CalConnect-backed schema strengthens
  OCX's position as an authoritative exchange format.

## Learn more

- [OCX Consortium](https://3docx.org) — official website
- [OCX Schema on GitHub](https://github.com/OCXStandard/OCX_Schema) — XSD and tooling
- [Who uses UnitsML](/who-uses-unitsml) — other standards and products
