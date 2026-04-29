# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UnitsML.org is the official website for the UnitsML project — an authoritative mechanism for encoding scientific units of measure. The site is built with **VitePress**, deployed to **GitHub Pages**.

Content is authored in **Markdown** (`.md` files). Blog posts can optionally use **AsciiDoc** by adding `asciidoc: true` to frontmatter (a Vite plugin converts the body via asciidoctor.js).

## Commands

```bash
# Install dependencies
npm install

# Local dev server (hot reload)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

## Architecture

- **VitePress** static site generator with custom theme extending the default VitePress theme.
- **Brand colors**: navy `#2d2c69`, teal `#30dfc0`, blue `#57a0fe` — defined in `.vitepress/theme/custom.css`.
- **Custom Vue components** in `.vitepress/theme/components/`:
  - `HomePage.vue` — landing page with hero, stats, ecosystem diagram, how-it-works steps, software cards, features, schema CTA
  - `EcosystemDiagram.vue` — interactive SVG diagram showing UnitsML components and relationships
  - `TimelineSection.vue` — collapsible history timeline (1998–2022) with people and organizations
  - `PeopleGrid.vue` — contributor cards with roles, affiliations, and eras
  - `FAQAccordion.vue` — grouped FAQ with collapsible accordion (General, Integration, UnitsDB)
  - `BlogIndex.vue` — blog listing with card layout
  - `BlogByline.vue` — author/date byline for blog posts
- **Data layer** in `.vitepress/data/projects.ts` — software project definitions used by HomePage and Software page.
- **Blog post loader** in `.vitepress/posts.data.ts` — uses VitePress `createContentLoader` to index `blog/*.md`.
- **AsciiDoc plugin** in `.vitepress/plugins/asciidoc.ts` — Vite plugin that converts `.md` files with `asciidoc: true` frontmatter through asciidoctor.js.
- **Public assets** in `public/` — favicons, logos (`symbol.svg`, `logo-text.svg`), `ref-docs/` (PDFs).

## CI/CD

- **`.github/workflows/build_deploy.yml`** — Node 24 + VitePress build, deploys to GitHub Pages on push to `main`.
- **`.github/workflows/links.yml`** — lychee link checker against the built site.
- `lychee.toml` — link checker configuration with exclusions.

## Content Structure

- `index.md` — Home page (uses `<HomePage />` component)
- `about.md` — Rich about page with ecosystem diagram, governance, timeline, people grid, organizations
- `faq.md` — FAQ with accordion component
- `privacy.md`, `tos.md` — standalone pages
- `software/index.md` — Software listing with ecosystem diagram and project cards
- `software/schemas.md`, `software/unitsdb.md`, `software/unitsml-ruby.md` — individual software pages
- `specs/guidelines.md` — specifications page
- `blog/index.md` — Blog listing (uses `<BlogIndex />` component)
- `blog/*.md` — individual blog posts (frontmatter: title, date, authors, description)
