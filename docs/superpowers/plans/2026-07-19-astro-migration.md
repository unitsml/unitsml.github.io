# Astro Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate UnitsML.org from VitePress to Astro 7 with Vite 8 and Vue islands, preserving all content, components, and dynamic UnitsDB functionality.

**Architecture:** Fresh Astro project in `astro/` directory alongside existing VitePress site. Content collections for markdown, Vue islands for interactive components, Astro static routes for pages, `getStaticPaths()` for UnitsDB dynamic routes. Cut over after full verification.

**Tech Stack:** Astro 7, Vite 8, Vue 3, TypeScript, MDX (optional), Pagefind (search)

## Global Constraints
- Astro 7.x, Vite 8.x, Vue 3.x
- All 35+ pages must render correctly
- All 13 Vue components must work as islands
- UnitsDB browser and dynamic routes must be fully functional
- Dark mode, search, and navigation must work
- Build must pass with zero errors
- No VitePress dependencies in final output

---

### Phase 1: Scaffold & Foundation

#### Task 1: Create Astro project skeleton

**Files:**
- Create: `astro/package.json`
- Create: `astro/astro.config.mjs`
- Create: `astro/tsconfig.json`
- Create: `astro/src/env.d.ts`

**Interfaces:**
- Produces: Astro project root with config and TypeScript setup

- [ ] **Step 1: Create astro/package.json**

```json
{
  "name": "unitsml-org-astro",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/vue": "^5.0.0",
    "@astrojs/mdx": "^4.0.0",
    "vue": "^3.5.0",
    "typescript": "^5.6.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0"
  }
}
```

- [ ] **Step 2: Create astro/astro.config.mjs**

```js
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [vue(), mdx()],
  site: 'https://unitsml.org',
  base: '/',
  outDir: './dist',
  publicDir: './public',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  }
});
```

- [ ] **Step 3: Create astro/tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@data/*": ["src/data/*"]
    }
  }
}
```

- [ ] **Step 4: Create astro/src/env.d.ts**

```ts
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
```

- [ ] **Step 5: Install dependencies**

```bash
cd astro && npm install
```

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add astro/
git commit -m "chore: scaffold Astro project"
```

---

#### Task 2: Migrate global styles and static assets

**Files:**
- Create: `astro/public/` (copy from root `public/`)
- Create: `astro/src/styles/global.css`
- Modify: `astro/astro.config.mjs` (add global CSS)

**Interfaces:**
- Consumes: Existing `public/` assets and `.vitepress/theme/custom.css`
- Produces: Global styles and static assets available in Astro

- [ ] **Step 1: Copy public assets**

```bash
cp -r public/* astro/public/
```

- [ ] **Step 2: Create astro/src/styles/global.css**

Copy the entire contents of `.vitepress/theme/custom.css` to `astro/src/styles/global.css`. Add these Astro-specific overrides at the end:

```css
/* Astro-specific overrides */
html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: var(--vp-font-family-base);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.dark body {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
```

- [ ] **Step 3: Update astro/astro.config.mjs to include global CSS**

```js
export default defineConfig({
  integrations: [vue(), mdx()],
  site: 'https://unitsml.org',
  base: '/',
  outDir: './dist',
  publicDir: './public',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  },
  vite: {
    css: {
      preprocessorOptions: {}
    }
  }
});
```

- [ ] **Step 4: Commit**

```bash
git add astro/public astro/src/styles astro/astro.config.mjs
git commit -m "feat: migrate global styles and static assets"
```

---

#### Task 3: Create BaseLayout with nav and footer

**Files:**
- Create: `astro/src/layouts/BaseLayout.astro`
- Create: `astro/src/components/Nav.astro`
- Create: `astro/src/components/Footer.astro`

**Interfaces:**
- Produces: Base layout used by all pages

- [ ] **Step 1: Create astro/src/layouts/BaseLayout.astro**

```astro
---
import Nav from '@components/Nav.astro';
import Footer from '@components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  {description && <meta name="description" content={description} />}
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <meta name="theme-color" content="#2d2c69" />
</head>
<body>
  <Nav />
  <main>
    <slot />
  </main>
  <Footer />
</body>
</html>
```

- [ ] **Step 2: Create astro/src/components/Nav.astro**

```astro
---
const navItems = [
  { text: 'UnitsDB', link: '/unitsdb/' },
  { text: 'Schemas', link: '/schemas' },
  {
    text: 'Learn',
    items: [
      { text: 'What is UnitsML', link: '/learn/what-is-unitsml' },
      { text: 'Who is it for', link: '/learn/who-is-it-for' },
      { text: 'How it works', link: '/learn/how-it-works' },
      { text: 'Incorporating UnitsML', link: '/learn/incorporating-unitsml' },
      { text: 'Guide', link: '/learn/guide' },
      { text: 'Get Started', link: '/get-started' },
    ]
  },
  {
    text: 'Adopt',
    items: [
      { text: 'Who uses UnitsML', link: '/who-uses-unitsml' },
      { text: 'OCX Consortium', link: '/adopters/ocx' },
      { text: 'IEC CDD', link: '/adopters/iec-cdd' },
    ]
  },
  { text: 'Software', link: '/software/' },
  { text: 'Resources', link: '/resources' },
  { text: 'Blog', link: '/blog/' },
  { text: 'About', link: '/about' },
];
---

<header class="nav">
  <div class="nav-container">
    <a href="/" class="nav-logo">
      <img src="/symbol.svg" alt="UnitsML" width="28" height="32" />
      <span>UnitsML</span>
    </a>
    <nav class="nav-menu">
      {navItems.map(item => (
        item.items ? (
          <div class="nav-dropdown">
            <button class="nav-link">{item.text}</button>
            <div class="nav-dropdown-menu">
              {item.items.map(sub => (
                <a href={sub.link} class="nav-dropdown-link">{sub.text}</a>
              ))}
            </div>
          </div>
        ) : (
          <a href={item.link} class="nav-link">{item.text}</a>
        )
      ))}
    </nav>
    <a href="https://github.com/unitsml" target="_blank" rel="noopener" class="nav-github">
      GitHub
    </a>
  </div>
</header>

<style>
  .nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--vp-c-bg);
    border-bottom: 1px solid var(--vp-c-divider);
  }
  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }
  .nav-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: var(--vp-c-text-1);
    font-weight: 700;
  }
  .nav-menu {
    display: flex;
    gap: 1rem;
  }
  .nav-link {
    text-decoration: none;
    color: var(--vp-c-text-2);
    font-size: 0.875rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
  }
  .nav-link:hover {
    color: var(--vp-c-brand-1);
    background: var(--vp-c-bg-soft);
  }
  .nav-dropdown {
    position: relative;
  }
  .nav-dropdown-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    padding: 0.5rem;
    min-width: 200px;
  }
  .nav-dropdown:hover .nav-dropdown-menu {
    display: block;
  }
  .nav-dropdown-link {
    display: block;
    padding: 0.375rem 0.5rem;
    text-decoration: none;
    color: var(--vp-c-text-2);
    font-size: 0.875rem;
    border-radius: 4px;
  }
  .nav-dropdown-link:hover {
    background: var(--vp-c-bg-soft);
    color: var(--vp-c-brand-1);
  }
  @media (max-width: 768px) {
    .nav-menu {
      display: none;
    }
  }
</style>
```

- [ ] **Step 3: Create astro/src/components/Footer.astro**

```astro
<footer class="footer">
  <div class="footer-container">
    <div class="footer-links">
      <a href="/unitsdb/">UnitsDB</a>
      <a href="/schemas">Schemas</a>
      <a href="/learn/what-is-unitsml">Learn</a>
      <a href="/get-started">Get Started</a>
      <a href="/software/">Software</a>
      <a href="https://github.com/unitsml">GitHub</a>
    </div>
    <div class="footer-copyright">
      Copyright © 2026 UnitsML Group
    </div>
  </div>
</footer>

<style>
  .footer {
    border-top: 1px solid var(--vp-c-divider);
    padding: 2rem 0;
    margin-top: 3rem;
  }
  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    text-align: center;
  }
  .footer-links {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }
  .footer-links a {
    color: var(--vp-c-text-2);
    text-decoration: none;
    font-size: 0.875rem;
  }
  .footer-links a:hover {
    color: var(--vp-c-brand-1);
  }
  .footer-copyright {
    font-size: 0.8125rem;
    color: var(--vp-c-text-3);
  }
</style>
```

- [ ] **Step 4: Commit**

```bash
git add astro/src/layouts astro/src/components
git commit -m "feat: add BaseLayout with nav and footer"
```

---

### Phase 2: Content Migration

#### Task 4: Set up content collections

**Files:**
- Create: `astro/src/content.config.ts`
- Create: `astro/src/content/pages/` (directory)

**Interfaces:**
- Produces: Content collection schema for pages

- [ ] **Step 1: Create astro/src/content.config.ts**

```ts
import { defineCollection, z } from 'astro:content';

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date(),
  }),
});

export const collections = { pages, blog };
```

- [ ] **Step 2: Create content directories**

```bash
mkdir -p astro/src/content/pages astro/src/content/blog astro/src/content/learn astro/src/content/software astro/src/content/adopters
```

- [ ] **Step 3: Commit**

```bash
git add astro/src/content.config.ts
git commit -m "feat: add content collections"
```

---

#### Task 5: Migrate static pages

**Files:**
- Create: `astro/src/content/pages/*.md`
- Create: `astro/src/pages/[...slug].astro`

**Interfaces:**
- Consumes: Existing markdown files from root
- Produces: Static pages rendered by Astro

- [ ] **Step 1: Migrate root markdown pages**

Copy these files to `astro/src/content/pages/`:
- `about.md`
- `history.md`
- `supporters.md`
- `resources.md`
- `faq.md`
- `privacy.md`
- `tos.md`
- `get-started.md`
- `schemas.md`
- `who-uses-unitsml.md`

- [ ] **Step 2: Migrate learn pages**

Copy `learn/*.md` to `astro/src/content/learn/`

- [ ] **Step 3: Migrate software pages**

Copy `software/*.md` to `astro/src/content/software/`

- [ ] **Step 4: Migrate adopter pages**

Copy `adopters/*.md` to `astro/src/content/adopters/`

- [ ] **Step 5: Create astro/src/pages/[...slug].astro**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '@layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const pages = await getCollection('pages');
  return pages.map(page => ({
    params: { slug: page.slug },
    props: { page },
  }));
}

const { page } = Astro.props;
const { Content } = await page.render();
---

<BaseLayout title={page.data.title} description={page.data.description}>
  <article class="content-page">
    <Content />
  </article>
</BaseLayout>

<style>
  .content-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
</style>
```

- [ ] **Step 6: Create catch-all page for nested routes**

Create `astro/src/pages/[...path].astro` for learn/, software/, adopters/:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '@layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const learn = await getCollection('learn');
  const software = await getCollection('software');
  const adopters = await getCollection('adopters');
  const all = [...learn, ...software, ...adopters];
  return all.map(page => ({
    params: { path: page.slug },
    props: { page },
  }));
}

const { page } = Astro.props;
const { Content } = await page.render();
---

<BaseLayout title={page.data.title} description={page.data.description}>
  <article class="content-page">
    <Content />
  </article>
</BaseLayout>
```

- [ ] **Step 7: Commit**

```bash
git add astro/src/content astro/src/pages
git commit -m "feat: migrate static pages to Astro content collections"
```

---

### Phase 3: Vue Islands

#### Task 6: Migrate Vue components as islands

**Files:**
- Create: `astro/src/components/islands/*.vue`

**Interfaces:**
- Consumes: Existing Vue components from `.vitepress/theme/components/`
- Produces: Vue components usable as Astro islands

- [ ] **Step 1: Create islands directory**

```bash
mkdir -p astro/src/components/islands
```

- [ ] **Step 2: Copy Vue components**

Copy these files from `.vitepress/theme/components/` to `astro/src/components/islands/`:
- `HomePage.vue`
- `TimelineSection.vue`
- `HistoryTimeline.vue`
- `PeopleGrid.vue`
- `FAQAccordion.vue`
- `WappiMascot.vue`
- `EcosystemDiagram.vue`
- `DataModelDiagram.vue`
- `UnitsDBDiagram.vue`
- `UnitsDBComposite.vue`
- `NavScrollHandler.vue`
- `BlogIndex.vue`
- `BlogByline.vue`

- [ ] **Step 3: Update component imports**

In each component, update any relative imports to use `@components/islands/` alias or relative paths that work in Astro.

- [ ] **Step 4: Create astro/src/pages/index.astro (homepage)**

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import HomePage from '@components/islands/HomePage.vue';
import WappiMascot from '@components/islands/WappiMascot.vue';
---

<BaseLayout title="UnitsML — Unambiguous models for scientific units of measure">
  <HomePage client:load />
  <WappiMascot client:idle />
</BaseLayout>
```

- [ ] **Step 5: Commit**

```bash
git add astro/src/components/islands astro/src/pages/index.astro
git commit -m "feat: migrate Vue components as islands"
```

---

### Phase 4: UnitsDB Browser

#### Task 7: Migrate UnitsDB data and browser

**Files:**
- Create: `astro/src/data/unitsdb/` (copy from `public/unitsdb/`)
- Create: `astro/src/pages/unitsdb/index.astro`
- Create: `astro/src/pages/unitsdb/[type]/index.astro`
- Create: `astro/src/pages/unitsdb/[type]/[id].astro`
- Create: `astro/src/components/islands/UnitsDBBrowser.vue`
- Create: `astro/src/components/islands/UnitsDBEntityDetail.vue`

**Interfaces:**
- Consumes: UnitsDB JSON from `public/unitsdb/`
- Produces: Fully functional UnitsDB browser with dynamic routes

- [ ] **Step 1: Copy UnitsDB data**

```bash
mkdir -p astro/src/data/unitsdb
cp public/unitsdb/*.json astro/src/data/unitsdb/
```

- [ ] **Step 2: Create UnitsDB index page**

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import UnitsDBBrowser from '@components/islands/UnitsDBBrowser.vue';
---

<BaseLayout title="UnitsDB" description="Browse the complete database of scientific units">
  <UnitsDBBrowser client:load />
</BaseLayout>
```

- [ ] **Step 3: Create entity type pages**

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import { readFileSync } from 'node:fs';

const { type } = Astro.params;
const data = JSON.parse(readFileSync(`src/data/unitsdb/${type}.json`, 'utf-8'));
---

<BaseLayout title={`${type} — UnitsDB`}>
  <h1>{type}</h1>
  <ul>
    {data.map(item => (
      <li><a href={`/unitsdb/${type}/${item.unitsml_id.replace(/[^a-zA-Z0-9._-]/g, '_')}/`}>{item.name}</a></li>
    ))}
  </ul>
</BaseLayout>
```

- [ ] **Step 4: Create entity detail pages**

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import UnitsDBEntityDetail from '@components/islands/UnitsDBEntityDetail.vue';
import { readFileSync } from 'node:fs';

export async function getStaticPaths() {
  const types = ['units', 'quantities', 'dimensions', 'prefixes', 'scales', 'systems'];
  const paths = [];
  for (const type of types) {
    const data = JSON.parse(readFileSync(`src/data/unitsdb/${type}.json`, 'utf-8'));
    for (const item of data) {
      const id = item.unitsml_id.replace(/[^a-zA-Z0-9._-]/g, '_');
      paths.push({
        params: { type, id },
        props: { item, type },
      });
    }
  }
  return paths;
}

const { item, type } = Astro.props;
---

<BaseLayout title={`${item.name} — ${type}`}>
  <UnitsDBEntityDetail client:load item={item} type={type} />
</BaseLayout>
```

- [ ] **Step 5: Migrate UnitsDBBrowser.vue and UnitsDBEntityDetail.vue**

Copy from `.vitepress/theme/components/` to `astro/src/components/islands/` and update imports.

- [ ] **Step 6: Commit**

```bash
git add astro/src/data astro/src/pages/unitsdb astro/src/components/islands
git commit -m "feat: migrate UnitsDB browser and dynamic routes"
```

---

### Phase 5: Blog & Search

#### Task 8: Migrate blog

**Files:**
- Create: `astro/src/content/blog/*.md`
- Create: `astro/src/pages/blog/index.astro`
- Create: `astro/src/pages/blog/[slug].astro`

- [ ] **Step 1: Copy blog posts**

```bash
cp blog/*.md astro/src/content/blog/
```

- [ ] **Step 2: Create blog index page**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '@layouts/BaseLayout.astro';
import BlogIndex from '@components/islands/BlogIndex.vue';

const posts = await getCollection('blog');
---

<BaseLayout title="Blog" description="UnitsML blog">
  <BlogIndex client:load posts={posts} />
</BaseLayout>
```

- [ ] **Step 3: Create blog post page**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '@layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<BaseLayout title={post.data.title} description={post.data.description}>
  <article class="blog-post">
    <h1>{post.data.title}</h1>
    <Content />
  </article>
</BaseLayout>
```

- [ ] **Step 4: Commit**

```bash
git add astro/src/content/blog astro/src/pages/blog
git commit -m "feat: migrate blog"
```

---

#### Task 9: Add search

**Files:**
- Create: `astro/src/pages/search.astro`
- Modify: `astro/src/components/Nav.astro`

- [ ] **Step 1: Add Pagefind**

```bash
cd astro && npm install -D pagefind
```

- [ ] **Step 2: Create search page**

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
---

<BaseLayout title="Search">
  <div id="search"></div>
  <script is:inline>
    new PagefindUI({ element: "#search" });
  </script>
</BaseLayout>
```

- [ ] **Step 3: Update Nav to include search link**

- [ ] **Step 4: Commit**

```bash
git add astro/src/pages/search.astro astro/src/components/Nav.astro
git commit -m "feat: add search with Pagefind"
```

---

### Phase 6: Cutover & Cleanup

#### Task 10: Verify all pages and remove VitePress

**Files:**
- Modify: `package.json`
- Delete: `.vitepress/` (after verification)

- [ ] **Step 1: Build and verify Astro site**

```bash
cd astro && npm run build
```

Expected: Zero errors.

- [ ] **Step 2: Test all routes**

Verify these routes render correctly:
- `/` (homepage)
- `/about`, `/history`, `/supporters`, `/resources`, `/faq`, `/privacy`, `/tos`, `/get-started`, `/schemas`, `/who-uses-unitsml`
- `/learn/what-is-unitsml`, `/learn/who-is-it-for`, `/learn/how-it-works`, `/learn/incorporating-unitsml`, `/learn/guide`
- `/software/`, `/software/unitsdb-ruby`, `/software/unitsml-ruby`
- `/adopters/ocx`, `/adopters/iec-cdd`
- `/blog/`, `/blog/*`
- `/unitsdb/`, `/unitsdb/units/`, `/unitsdb/units/u:meter/` (etc.)
- `/search`

- [ ] **Step 3: Update root package.json**

```json
{
  "name": "unitsml.org",
  "scripts": {
    "dev": "cd astro && npm run dev",
    "build": "cd astro && npm run build",
    "preview": "cd astro && npm run preview"
  }
}
```

- [ ] **Step 4: Remove VitePress artifacts**

```bash
rm -rf .vitepress
rm -f vite.config.ts
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: complete Astro migration"
```

---

## Self-Review Checklist

- [ ] All 35+ pages render correctly
- [ ] All 13 Vue components work as islands
- [ ] UnitsDB browser and entity detail pages fully functional
- [ ] Dark mode works
- [ ] Search works
- [ ] Navigation works
- [ ] Build passes with zero errors
- [ ] No VitePress dependencies remain
