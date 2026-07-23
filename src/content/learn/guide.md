---
title: UnitsML Guide
description: Comprehensive guide for using UnitsML — encoding units, working with schemas, and integrating UnitsML into applications
---

# UnitsML Guide

This guide covers the practical aspects of using UnitsML: encoding units of measure in XML and other formats, working with the schema, querying unit data programmatically, and adopting UnitsML in your projects.

## Quick reference

| What you need | Where to go |
|---------------|------------|
| Use UnitsML in XML | [XML Encoding](#xml-encoding) below |
| Browse schema documentation | [schema.unitsml.org](https://schema.unitsml.org) |
| Query units programmatically | [Programmatic access](#programmatic-access) below |
| Add UnitsML to your schema | [Incorporating UnitsML](/learn/incorporating-unitsml) |
| Understand the data model | [How UnitsML Works](/learn/how-it-works) |

## XML Encoding

### Step 1: Declare the UnitsML namespace

Add the UnitsML namespace and schema location to your document:

```xml
<YourDocument
  xmlns="https://example.org/your-namespace"
  xmlns:unitsml="https://schema.unitsml.org/unitsml/1.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="
    https://schema.unitsml.org/unitsml/1.0
      https://schema.unitsml.org/unitsml/unitsml-v1.0.xsd">
```

### Step 2: Define the units you need

Create a `UnitSet` with the units referenced in your document:

```xml
<unitsml:UnitSet>
  <!-- SI base unit -->
  <unitsml:Unit xml:id="m" dimensionURL="#dim_L">
    <unitsml:UnitName>metre</unitsml:UnitName>
    <unitsml:UnitSymbol typeface="ASCII">m</unitsml:UnitSymbol>
  </unitsml:Unit>

  <!-- SI derived unit with decomposition -->
  <unitsml:Unit xml:id="Pa" dimensionURL="#dim_L-1MT-2">
    <unitsml:UnitName>pascal</unitsml:UnitName>
    <unitsml:UnitSymbol typeface="ASCII">Pa</unitsml:UnitSymbol>
    <unitsml:RootUnits>
      <unitsml:EnumeratedRootUnit unit="meter" powerNumerator="-1"/>
      <unitsml:EnumeratedRootUnit unit="gram" prefix="k" powerNumerator="1"/>
      <unitsml:EnumeratedRootUnit unit="second" powerNumerator="-2"/>
    </unitsml:RootUnits>
  </unitsml:Unit>

  <!-- Non-SI unit with conversion -->
  <unitsml:Unit xml:id="atm" dimensionURL="#dim_L-1MT-2">
    <unitsml:UnitName>standard atmosphere</unitsml:UnitName>
    <unitsml:UnitSymbol typeface="ASCII">atm</unitsml:UnitSymbol>
    <unitsml:Conversions>
      <unitsml:Float64ConversionFrom
        xml:id="conv_Pa_to_atm"
        initialUnit="#Pa"
        multiplicand="101325"
        exact="true"/>
    </unitsml:Conversions>
  </unitsml:Unit>
</unitsml:UnitSet>
```

### Step 3: Define dimensions (optional but recommended)

```xml
<unitsml:DimensionSet>
  <unitsml:Dimension xml:id="dim_L">
    <unitsml:Length symbol="L" powerNumerator="1"/>
  </unitsml:Dimension>
  <unitsml:Dimension xml:id="dim_L-1MT-2">
    <unitsml:Length symbol="L" powerNumerator="-1"/>
    <unitsml:Mass symbol="M" powerNumerator="1"/>
    <unitsml:Time symbol="T" powerNumerator="-2"/>
  </unitsml:Dimension>
</unitsml:DimensionSet>
```

### Step 4: Reference units from your data

Use `unitURL` attributes to link data values to their unit definitions:

```xml
<AtmosphericPressure>
  <StandardValue unitURL="#atm">1</StandardValue>
  <SIValue unitURL="#Pa">101325</SIValue>
</AtmosphericPressure>

<Distance>
  <Value unitURL="#m">100</Value>
  <Description>Length of the test track</Description>
</Distance>
```

## Common encoding patterns

### Composite units

Most real-world units are composite — built from base units via multiplication, division, and exponentiation. UnitsML represents these with `RootUnits` containing one or more `EnumeratedRootUnit` elements:

```xml
<!-- Newton: N = m · kg · s⁻² -->
<Unit xml:id="N" dimensionURL="#dim_LMT-2">
  <UnitName>newton</UnitName>
  <UnitSymbol typeface="ASCII">N</UnitSymbol>
  <RootUnits>
    <EnumeratedRootUnit unit="meter" powerNumerator="1"/>
    <EnumeratedRootUnit unit="gram" prefix="k" powerNumerator="1"/>
    <EnumeratedRootUnit unit="second" powerNumerator="-2"/>
  </RootUnits>
</Unit>
```

Key points about composite units:

- **Powers**: Use `powerNumerator` for positive/negative exponents (e.g., `-2` for s⁻²). Use `powerDenominator` for fractional powers.
- **Prefixes**: Apply prefixes to individual root units (e.g., `prefix="k"` on gram to represent kilogram).
- **Dimensions**: Every composite unit must link to a matching `Dimension` via `dimensionURL`.

See [How UnitsML Works — Composite units](/learn/how-it-works#composite-units-derived-unit-decomposition) for the full reference.

### Temperature with offset

Temperature conversions require both a multiplier and an offset:

```xml
<Unit xml:id="degC" dimensionURL="#dim_Θ">
  <UnitName>degree Celsius</UnitName>
  <UnitSymbol typeface="ASCII">degC</UnitSymbol>
  <Conversions>
    <Float64ConversionFrom xml:id="conv_K_to_C"
      initialUnit="#K"
      initialAddend="0"
      multiplicand="1"
      finalAddend="-273.15"
      exact="true"/>
  </Conversions>
</Unit>
```

### Understanding the conversion formula

UnitsML uses a general linear conversion equation: **y = d + ((b / c) × (x + a))**

Where:
- `x` is the value in the initial unit
- `y` is the value in the target unit
- `a` is the initial addend (offset applied to x before scaling)
- `b` is the numerator of the multiplicand
- `c` is the denominator of the multiplicand
- `d` is the final addend (offset applied after scaling)

For a simple scaling (e.g., metres to kilometres): only `b / c` is needed (`b="0.001"`, `c="1"`).
For a temperature offset (e.g., Kelvin to Celsius): use `a` and `d` in addition to the scaling factor.

### Counted items

Some measurements involve counted entities that are not themselves units — for example "electrons per second" or "particles per cubic metre". UnitsML handles these with `CountedItem`:

```xml
<CountedItemSet>
  <CountedItem xml:id="electron">
    <ItemName>electron</ItemName>
  </CountedItem>
</CountedItemSet>
```

The correct expression for "electron emission rate = 1.36 s⁻¹" uses a counted item reference, not a unit named "electron". Counted items can be combined with units using `ExternalRootUnit`.

### Derived units with prefixes

Combine prefixes with root units for scaled derived units:

```xml
<Unit xml:id="kPa" dimensionURL="#dim_L-1MT-2">
  <UnitName>kilopascal</UnitName>
  <UnitSymbol typeface="ASCII">kPa</UnitSymbol>
  <RootUnits>
    <EnumeratedRootUnit unit="meter" prefix="k" powerNumerator="-1"/>
    <EnumeratedRootUnit unit="gram" prefix="k" powerNumerator="1"/>
    <EnumeratedRootUnit unit="second" powerNumerator="-2"/>
  </RootUnits>
</Unit>
```

### Complex derived units

Express units like "joules per kilogram kelvin" (specific heat capacity):

```xml
<Unit xml:id="J_per_kg_K" dimensionURL="#dim_L2T-2Θ-1">
  <UnitName>joule per kilogram kelvin</UnitName>
  <UnitSymbol typeface="ASCII">J/(kg·K)</UnitSymbol>
  <RootUnits>
    <EnumeratedRootUnit unit="meter" powerNumerator="2"/>
    <EnumeratedRootUnit unit="second" powerNumerator="-2"/>
    <EnumeratedRootUnit unit="kelvin" powerNumerator="-1"/>
  </RootUnits>
</Unit>
```

### Multiple code list references

Link a unit to multiple external code systems:

```xml
<Unit xml:id="m">
  <UnitName>metre</UnitName>
  <CodeListValue
    unitCodeValue="MTR"
    codeListName="UN/ECE Recommendation 20"
    organizationName="UNECE"/>
  <CodeListValue
    unitCodeValue="m"
    codeListName="UCUM"
    codeListVersion="2.1"
    organizationName="Regenstrief Institute"/>
</Unit>
```

## Working with UnitsDB

UnitsDB provides authoritative definitions for over 380 units and 180 quantities — a comprehensive, schema-validated database of scientific units of measure. You can use UnitsDB data instead of defining units from scratch.

### Accessing UnitsDB

- **Interactive browser**: [UnitsDB](/unitsdb/) — search, browse, and download entities as JSON-LD
- **JSON index**: [`/unitsdb/index.json`](/unitsdb/index.json) — machine-readable index of all 716 entities
- **Programmatic**: [unitsml-ruby](/software/unitsml-ruby) — Ruby gem for querying UnitsDB
- **Raw data**: [GitHub](https://github.com/unitsml/unitsdb) — YAML source files and schemas

### Using UnitsDB definitions

UnitsDB entries use systematic IDs (e.g., `NISTu1` for meter). You can reference these directly:

```xml
<UnitSet>
  <Unit xml:id="NISTu1" dimensionURL="#NISTd1">
    <!-- UnitsDB: meter definition loaded from database -->
    <UnitName>meter</UnitName>
    <UnitSymbol typeface="ASCII">m</UnitSymbol>
  </Unit>
</UnitSet>
```

## Programmatic access

### Ruby (unitsml-ruby)

```ruby
require 'unitsml'

# Look up a unit by identifier
unit = Unitsml::Units.find("m")
puts unit.name        # => "metre"
puts unit.symbol      # => "m"

# Query units by quantity
length_units = Unitsml::Units.by_quantity("length")
length_units.map(&:symbol)
# => ["m", "km", "cm", "mm", "in", "ft", ...]

# Access conversion factors
unit = Unitsml::Units.find("km")
puts unit.conversion_to("m")  # => 1000
```

### XML processing (any language)

UnitsML XML can be processed with standard XML libraries in any language:

- **Python**: `lxml` or `xml.etree` — parse UnitsML elements via XPath
- **Java**: JAXB with XSD binding — generate Java classes from the UnitsML schema
- **JavaScript/Node.js**: `fast-xml-parser` or `xml2js` — parse UnitsML documents
- **.NET**: `XmlSerializer` with schema binding — strongly-typed UnitsML processing

## Validation

### XML Schema validation

Validate your documents against the UnitsML schema using standard tools:

```bash
# Using xmllint
xmllint --schema https://schema.unitsml.org/unitsml/unitsml-v1.0.xsd document.xml

# Using Java (JAXP)
java -jar jing.jar https://schema.unitsml.org/unitsml/unitsml-v1.0.xsd document.xml
```

### Dimensional consistency

While XML Schema validation checks structural correctness, **dimensional consistency** — ensuring that units match their declared dimensions and that conversions are dimensionally valid — requires application-level logic. This is where tools built on UnitsDB (like unitsml-ruby) add value.

## Best practices

### Unit identifiers

- Use meaningful, short IDs: `xml:id="m"` for meter, `xml:id="degC"` for degree Celsius
- For UnitsDB compatibility, use the NIST convention: `NISTu1`, `NISTu11`, etc.
- Keep IDs unique within your document

### Dimensions

- Always link units to dimensions via `dimensionURL` — this enables dimensional analysis
- Define dimensions in a `DimensionSet` container for clarity
- Reuse dimension definitions across multiple units with the same dimensionality

### Conversions

- Include conversion factors for non-SI units — this enables automatic unit conversion
- Use `exact="true"` when the conversion factor is exact (e.g., 1 ft = 0.3048 m exactly)
- Include `multiplicandDigits` to track significant digits for approximate conversions

### Symbols

- Provide symbols in multiple typefaces for maximum compatibility
- Always include an ASCII representation for systems that don't support Unicode
- Use the `typeface` attribute to distinguish representations

### Code lists

- Include code list references when your units need to map to external classification systems
- Common code lists include UN/ECE Recommendation 20, UCUM, and IEC 61360

## Schema documentation

The complete UnitsML 1.0 schema documentation is available interactively at:

<div class="schema-cta">
  <div class="cta-content">
    <h4>schema.unitsml.org</h4>
    <p>Browse element definitions, type hierarchies, and documentation for all schema components.</p>
  </div>
  <a href="https://schema.unitsml.org" target="_blank" rel="noopener" class="cta-button">
    Open browser
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
  </a>
</div>

## Related resources

- [What is UnitsML](/learn/what-is-unitsml) — conceptual overview
- [How UnitsML works](/learn/how-it-works) — technical architecture
- [Incorporating UnitsML](/learn/incorporating-unitsml) — integration methods
- [Software](/software/) — tools and libraries
- [FAQ](/about#frequently-asked-questions) — frequently asked questions
