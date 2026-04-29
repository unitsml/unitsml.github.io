---
title: Software
description: Software libraries for working with UnitsML
---

# Software

Libraries and tools for working with UnitsML and UnitsDB programmatically.

## How the pieces fit together

<EcosystemDiagram />

<script setup>
import { projects } from '../.vitepress/data/projects'
</script>

## Libraries

<div class="projects-grid" style="margin-top: 2rem;">
  <div v-for="project in projects" :key="project.name" class="project-card featured">
    <div class="card-icon">{{ project.icon }}</div>
    <h3>
      {{ project.name }}
      <span v-if="project.version" class="version">{{ project.version }}</span>
    </h3>
    <p class="description">{{ project.description }}</p>
    <div class="links">
      <a :href="project.github" class="primary" target="_blank" rel="noopener">GitHub</a>
      <a v-if="project.docs" :href="project.docs" class="secondary" target="_blank" rel="noopener">Docs</a>
    </div>
  </div>
</div>

## Related resources

- [UnitsDB](/unitsdb/) — browse the complete database with 716 entities
- [Schemas](/schemas) — UnitsML XML Schemas and UnitsDB YAML Schemas
- [unitsdb-ruby](/software/unitsdb-ruby) — Ruby library for accessing UnitsDB data
- [unitsml-ruby](/software/unitsml-ruby) — Ruby library for working with UnitsML expressions
