---
title: Get Started
description: Quick-start guide for using UnitsML
---

# Get Started

Everything you need to start using UnitsML in your projects — whether you're encoding units in XML, browsing schemas, or integrating the units database programmatically.

## Choose your path

<div class="paths-grid">
  <a href="#xml-encoding" class="path-card">
    <div class="path-icon path-xml">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
    </div>
    <h3>XML Encoding</h3>
    <p>Use UnitsML schemas to encode units in your XML documents.</p>
  </a>
  <a href="#browse-schemas" class="path-card">
    <div class="path-icon path-schema">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
    </div>
    <h3>Browse Schemas</h3>
    <p>Explore schema definitions interactively at schema.unitsml.org.</p>
  </a>
  <a href="#programmatic-access" class="path-card">
    <div class="path-icon path-ruby">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
    </div>
    <h3>Programmatic Access</h3>
    <p>Use the unitsml-ruby gem to query UnitsDB from your applications.</p>
  </a>
</div>

## XML Encoding {#xml-encoding}

The UnitsML XML Schema defines how to encode units of measure in XML documents. Here's how to get started:

### 1. Reference the schema

Add the UnitsML namespace to your XML document:

```xml
<YourDocument
  xmlns:unitsml="https://schema.unitsml.org/unitsml/1.0"
  xsi:schemaLocation="https://schema.unitsml.org/unitsml/1.0
    https://schema.unitsml.org/unitsml/unitsml-v1.0.xsd">
```

### 2. Define a unit

```xml
<unitsml:UnitSet>
  <unitsml:Unit xml:id="m" dimensionURL="#L">
    <unitsml:UnitName>metre</unitsml:UnitName>
    <unitsml:UnitSymbol>SI</unitsml:UnitSymbol>
  </unitsml:Unit>
</unitsml:UnitSet>
```

### 3. Use the unit in your data

```xml
<Measurement>
  <Value unitsml:unit="#m">9.81</Value>
  <Description>Gravitational acceleration</Description>
</Measurement>
```

::: tip
UnitsML is designed to be **incorporated into other markup languages**, not used standalone. The models work best when embedded in domain-specific formats like MatML, CML, or your own vocabulary — and can also be expressed in JSON, YAML, and other formats.
:::

## Browse Schemas {#browse-schemas}

The interactive schema browser provides documentation for all UnitsML schema components:

<div class="schema-cta">
  <div class="cta-content">
    <h4>schema.unitsml.org</h4>
    <p>Browse element definitions, type hierarchies, and schema documentation for all versions.</p>
  </div>
  <a href="https://schema.unitsml.org" target="_blank" rel="noopener" class="cta-button">
    Open browser
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
  </a>
</div>

## Programmatic Access {#programmatic-access}

Use the **unitsml-ruby** gem to query UnitsDB from Ruby applications:

### Install

```bash
gem install unitsml-ruby
```

### Query units

```ruby
require 'unitsml'

# Find a specific unit
unit = Unitsml::Units.find("m")
puts unit.name    # => "metre"
puts unit.symbol  # => "m"
```

See the [unitsml-ruby page](/software/unitsml-ruby) for full API documentation.

## Next steps

- Read the [UnitsML Guide](/learn/guide) for in-depth usage patterns
- Learn [how to incorporate UnitsML](/learn/incorporating-unitsml) into other markup languages
- Understand [what UnitsML is](/learn/what-is-unitsml) and the problems it solves
- Explore [UnitsDB](/unitsdb/) — the complete units database
