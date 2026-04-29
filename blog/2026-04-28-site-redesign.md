---
title: UnitsML.org gets a full redesign
date: 2026-04-28
authors:
  - UnitsML Team
description: We've rebuilt unitsml.org with an interactive UnitsDB browser, full-text search, dark mode, and a clearer information architecture.
---

# UnitsML.org gets a full redesign

We've completely rebuilt **unitsml.org** to better serve the scientific units community. The new site features a modern design, interactive data browsing, and a clearer structure for learning about UnitsML.

## What changed

### Interactive UnitsDB

The headline feature is the new [UnitsDB browser](/unitsdb/). Instead of downloading YAML files to explore the database, you can now search, filter, and browse all **716 entities** — units, quantities, dimensions, prefixes, scales, and unit systems — directly in your browser.

Every entity has its own page with cross-linked references. Click a unit's dimension to jump to that dimension, then see all units sharing it. The browser supports:

- **Full-text search** — find any entity by name, symbol, or identifier
- **Lazy-loaded data** — each entity type loads on demand, so the page stays fast
- **Cross-linked entities** — navigate between dimensions, quantities, units, and systems
- **Multilingual names** — entities display names in multiple languages where available

### Restructured content

We reorganized the site around how people actually use it:

- **[Learn](/learn/what-is-unitsml)** — guides for understanding what UnitsML is, how it works, and how to incorporate it into your work
- **[UnitsDB](/unitsdb/)** — the interactive database browser, now a top-level section
- **[Software](/software/)** — libraries like [unitsml-ruby](/software/unitsml-ruby) for programmatic access
- **[Schemas](/schemas)** — both the UnitsML XML Schemas and the UnitsDB YAML schemas, in a dedicated page

### Site features

- **Site-wide search** — full-text search across all pages, instantly accessible from any page
- **Dark mode** — proper dark theme support throughout the entire site
- **Mobile-friendly** — responsive layouts that work on phones and tablets
- **JSON API** — programmatic access to UnitsDB data at `/unitsdb/units.json`, `/unitsdb/quantities.json`, and other endpoints
- **JSON-LD downloads** — complete linked-data dataset at `/unitsdb/unitsdb.jsonld`

## What's next

This redesign is just the beginning. Here's what we're working on:

- **More software libraries** — expanding beyond Ruby with libraries for other languages
- **UnitsDB data expansion** — more units, quantities, and dimensions as the database grows
- **Community contributions** — opening up the database for community submissions
- **Enhanced schema tooling** — better validation and documentation for both XML and YAML schemas

## Get involved

UnitsML is developed under [CalConnect TC UNITS](https://www.calconnect.org). If you work with scientific data, measurement systems, or unit conversions, we'd love your input:

- Browse the database at [unitsml.org/unitsdb](/unitsdb/)
- Explore the code on [GitHub](https://github.com/unitsml)
- Join the discussion in [GitHub Discussions](https://github.com/unitsml/unitsml.org/discussions)
