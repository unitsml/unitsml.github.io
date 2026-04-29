---
title: Incorporating UnitsML into Markup Languages
description: How to incorporate UnitsML models into XML and other markup languages — referencing, importing, including, and redefining
---

# Incorporating UnitsML into Markup Languages

One of the core design principles of UnitsML is that it is **meant to be incorporated into other markup languages**, not used as a standalone format. This page explains the four methods for incorporating UnitsML into your own schemas and documents.

## Why incorporate UnitsML?

When you incorporate UnitsML into your markup language, you gain:

- **Ready-made markup** for units of measure, quantities, and dimensions — no need to design your own
- **Interoperability** with other markup languages that use UnitsML — units defined in one language can be understood by any system that processes UnitsML
- **Dimensional analysis** built into your data model
- **Conversion factors** between units, enabling automated unit conversion

## Four methods of incorporation

UnitsML can be incorporated into other XML-based markup languages through four standard XML Schema mechanisms, and the underlying data model is generalizable to JSON, YAML, and other formats:

### 1. Referencing the schema

The simplest approach. Your document references the UnitsML schema via `xsi:schemaLocation` and uses UnitsML elements alongside your own domain elements:

```xml
<MyDataDocument
  xmlns="https://example.org/my-data"
  xmlns:unitsml="https://schema.unitsml.org/unitsml/1.0"
  xsi:schemaLocation="
    https://schema.unitsml.org/unitsml/1.0
      https://schema.unitsml.org/unitsml/unitsml-v1.0.xsd">

  <unitsml:UnitSet>
    <unitsml:Unit xml:id="m" dimensionURL="#dim_L">
      <unitsml:UnitName>metre</unitsml:UnitName>
      <unitsml:UnitSymbol typeface="ASCII">m</unitsml:UnitSymbol>
    </unitsml:Unit>
  </unitsml:UnitSet>

  <Measurement>
    <Value unitsml:unit="#m">9.81</Value>
    <Description>Gravitational acceleration</Description>
  </Measurement>
</MyDataDocument>
```

**When to use:** When you want to use UnitsML elements as-is, without any modifications to the schema.

**How it works:**
- The UnitsML namespace is declared with a prefix (e.g., `unitsml:`)
- All UnitsML elements are qualified with the prefix
- The schema validator fetches and validates against the UnitsML XSD
- Your host schema and the UnitsML schema coexist without conflicts

### 2. Importing the schema

Use XSD `<import>` to bring in UnitsML types and elements into your own schema definition:

```xml
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:unitsml="https://schema.unitsml.org/unitsml/1.0"
  targetNamespace="https://example.org/my-data">

  <xs:import namespace="https://schema.unitsml.org/unitsml/1.0"
    schemaLocation="https://schema.unitsml.org/unitsml/unitsml-v1.0.xsd"/>

  <xs:element name="Measurement">
    <xs:complexType>
      <xs:sequence>
        <xs:element ref="unitsml:UnitSet" minOccurs="0"/>
        <xs:element name="Value" type="xs:double"/>
        <xs:element name="Description" type="xs:string"/>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
</xs:schema>
```

**When to use:** When you're designing a schema that needs to reference UnitsML types and elements as part of its type definitions.

**How it works:**
- `xs:import` brings in the UnitsML namespace
- Your schema can reference UnitsML elements (`ref="unitsml:UnitSet"`) and types
- The two schemas are separate but can use each other's components

### 3. Including the schema

Use XSD `<include>` to embed UnitsML definitions directly into your schema:

```xml
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
  targetNamespace="https://schema.unitsml.org/unitsml/1.0">

  <xs:include schemaLocation="https://schema.unitsml.org/unitsml/unitsml-v1.0.xsd"/>

  <!-- Your additional type definitions -->
  <xs:element name="Measurement" type="MeasurementType"/>
</xs:schema>
```

**When to use:** When you want UnitsML components to be part of your target namespace, effectively merging the two schemas.

**How it works:**
- `xs:include` copies the UnitsML definitions into your schema
- The included definitions become part of your target namespace
- Both your and UnitsML elements are in the same namespace

::: warning Note
`xs:include` requires that the included schema has the same target namespace as the including schema (or no target namespace). This method is less commonly used with UnitsML.
:::

### 4. Redefining schema elements

Use XSD `<redefine>` to customize UnitsML elements for your domain:

```xml
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
  targetNamespace="https://schema.unitsml.org/unitsml/1.0">

  <xs:redefine schemaLocation="https://schema.unitsml.org/unitsml/unitsml-v1.0.xsd">
    <!-- Restrict UnitType to require UnitDefinition -->
    <xs:complexType name="UnitType">
      <xs:complexContent>
        <xs:restriction base="UnitType">
          <xs:sequence>
            <xs:element ref="UnitSystem" minOccurs="0" maxOccurs="unbounded"/>
            <xs:element ref="UnitName" maxOccurs="unbounded"/>
            <xs:element ref="UnitSymbol" minOccurs="0" maxOccurs="unbounded"/>
            <xs:element ref="UnitDefinition" minOccurs="1" maxOccurs="unbounded"/>
          </xs:sequence>
        </xs:restriction>
      </xs:complexContent>
    </xs:complexType>
  </xs:redefine>
</xs:schema>
```

**When to use:** When you need to constrain or extend UnitsML definitions for your specific domain requirements.

**How it works:**
- `xs:redefine` allows you to restrict or extend existing type definitions
- The redefined types replace the originals throughout the schema
- This is the most powerful but also most complex approach

## Choosing the right method

| Method | Complexity | Flexibility | Use case |
|--------|-----------|-------------|----------|
| Reference | Low | Use as-is | Quick integration, no schema modifications |
| Import | Medium | Selective use | Schema design with UnitsML components |
| Include | Medium | Full integration | Single-namespace merge |
| Redefine | High | Custom constraints | Domain-specific customization |

For most use cases, **referencing** or **importing** is the recommended approach.

## Practical patterns

### Pattern: Unit references in data elements

The most common pattern is to define units in a `UnitSet` container and reference them from data elements using `unitURL` attributes:

```xml
<unitsml:UnitSet>
  <unitsml:Unit xml:id="m" dimensionURL="#dim_L">
    <unitsml:UnitName>metre</unitsml:UnitName>
    <unitsml:UnitSymbol typeface="ASCII">m</unitsml:UnitSymbol>
  </unitsml:Unit>
  <unitsml:Unit xml:id="ft" dimensionURL="#dim_L">
    <unitsml:UnitName>foot</unitsml:UnitName>
    <unitsml:UnitSymbol typeface="ASCII">ft</unitsml:UnitSymbol>
  </unitsml:Unit>
</unitsml:UnitSet>

<Length unitURL="#m">1.83</Length>
<Height unitURL="#ft">6.00</Height>
```

### Pattern: Dimensional validation

Define dimensions and link them to both units and data elements for dimensional checking:

```xml
<unitsml:DimensionSet>
  <unitsml:Dimension xml:id="dim_L">
    <unitsml:Length symbol="L" powerNumerator="1"/>
  </unitsml:Dimension>
  <unitsml:Dimension xml:id="dim_LT-1">
    <unitsml:Length symbol="L" powerNumerator="1"/>
    <unitsml:Time symbol="T" powerNumerator="-1"/>
  </unitsml:Dimension>
</unitsml:DimensionSet>

<!-- Dimensionally consistent -->
<Distance dimensionURL="#dim_L">100</Distance>
<Speed dimensionURL="#dim_LT-1">299792458</Speed>
```

### Pattern: Inline unit definitions

For simple cases, you can embed unit definitions directly within your data elements:

```xml
<Measurement>
  <unitsml:Unit xml:id="Pa">
    <unitsml:UnitName>pascal</unitsml:UnitName>
    <unitsml:UnitSymbol typeface="ASCII">Pa</unitsml:UnitSymbol>
  </unitsml:Unit>
  <Value unitURL="#Pa">101325</Value>
</Measurement>
```

### Pattern: Conversion alongside data

Include conversion information so that consumers can automatically convert between unit systems:

```xml
<Unit xml:id="inHg" dimensionURL="#dim_L-1MT-2">
  <UnitName>conventional inch of mercury</UnitName>
  <UnitSymbol typeface="ASCII">inHg</UnitSymbol>
  <Conversions>
    <Float64ConversionFrom xml:id="conv_Pa_to_inHg"
      initialUnit="#Pa"
      multiplicand="0.0002953"
      exact="false"
      multiplicandDigits="4"/>
  </Conversions>
</Unit>
```

## Beyond XML

While UnitsML is defined as an XML Schema, its data model — units, quantities, dimensions, prefixes, and conversion factors — is generalizable to other representation formats:

- **JSON** — The UnitsML data model can be serialized as JSON for web APIs and modern applications. UnitsDB provides a complete JSON index at [`/unitsdb/index.json`](/unitsdb/index.json).
- **YAML** — UnitsDB uses YAML as its native data format, aligned with the UnitsML data model. Each entity type has a dedicated [YAML schema](/schemas) for validation.
- **JSON-LD** — UnitsDB provides linked data exports with `@context`, `@id`, and `@type` for semantic web applications. Download per-type collections or the complete dataset from the [UnitsDB browser](/unitsdb/).
- **Databases** — UnitsDB implements the UnitsML data model in a queryable database, accessible via the [unitsml-ruby](/software/unitsml-ruby) gem.

The key concepts (unit identification, dimensional analysis, conversion factors, quantity-unit relationships) are independent of the XML serialization format.

## Real-world example: AnIML

The Analytical Information Markup Language (AnIML) is a concrete example of incorporating UnitsML into a domain-specific format. Developed by ASTM Subcommittee E13.15, AnIML is an XML-based format for analytical chemistry data (spectroscopy, chromatography).

AnIML uses UnitsML for all unit information in its core schema, separating unit concerns from the analytical data structure. The incorporation was done using the **import** method, allowing AnIML to reference UnitsML's `UnitSet` and `Unit` elements without duplicating unit definitions.

This demonstrates how UnitsML serves as a reusable building block — any domain-specific markup language that needs unit information can incorporate UnitsML rather than designing its own unit representation from scratch.

## Next steps

- [How UnitsML Works](/learn/how-it-works) — detailed technical architecture
- [UnitsML Guide](/learn/guide) — comprehensive usage guide
- [Get started](/get-started) — practical quick-start instructions
- [UnitsDB](/unitsdb/) — browse the complete units database
- [Software](/software/) — tools and libraries for working with UnitsML
