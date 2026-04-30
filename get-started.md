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

<style scoped>
/* Paths grid */
.paths-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
  margin: 2rem 0 3rem;
}

.path-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem 1.5rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  text-align: center;
  transition: all 0.3s ease;
}

.path-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 8px 30px rgba(45, 44, 105, 0.08);
  transform: translateY(-2px);
}

.path-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.path-xml {
  background: rgba(45, 44, 105, 0.08);
  color: var(--unitsml-navy);
}

.path-schema {
  background: rgba(48, 223, 192, 0.1);
  color: var(--unitsml-teal-dark);
}

.path-ruby {
  background: rgba(87, 160, 254, 0.1);
  color: var(--unitsml-blue);
}

.path-card h3 {
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
}

.path-card p {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
}

/* Schema CTA */
.schema-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.5rem 2rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  margin: 1.5rem 0;
}

.cta-content h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.25rem;
}

.cta-content p {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin: 0;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1.25rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  background: var(--unitsml-navy);
  color: white;
  transition: all 0.25s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.cta-button:hover {
  background: var(--unitsml-navy-light);
}

@media (max-width: 640px) {
  .schema-cta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
