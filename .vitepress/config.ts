import { defineConfig } from 'vitepress'
import { asciidocPlugin } from './plugins/asciidoc'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const TYPE_FILE: Record<string, string> = {
  units: 'units', quantities: 'quantities', dimensions: 'dimensions',
  prefixes: 'prefixes', scales: 'scales', systems: 'unit_systems',
}
const TYPE_LABEL: Record<string, string> = {
  units: 'Unit', quantities: 'Quantity', dimensions: 'Dimension',
  prefixes: 'Prefix', scales: 'Scale', systems: 'Unit System',
}

// Build a lookup: slug → entity name, loaded once at build
const slugToName: Record<string, Record<string, string>> = {}
for (const [urlType, fileKey] of Object.entries(TYPE_FILE)) {
  const raw = readFileSync(resolve(root, `public/unitsdb/${fileKey}.json`), 'utf-8')
  const items: any[] = JSON.parse(raw)
  slugToName[urlType] = {}
  for (const item of items) {
    const slug = item.unitsml_id.replace(/[^a-zA-Z0-9._-]/g, '_')
    slugToName[urlType][slug] = item.name
  }
}

export default defineConfig({
  title: 'UnitsML',
  description: 'A set of models for unambiguously encoding and identifying scientific units of measure and quantities',
  lang: 'en-US',
  lastUpdated: true,
  srcExclude: ['CLAUDE.md'],

  transformPageData(pageData) {
    const params = (pageData as any).params
    if (params?.type && params?.id) {
      const label = TYPE_LABEL[params.type] || params.type
      const name = slugToName[params.type]?.[params.id] || params.id.replace(/_/g, ' ')
      pageData.title = `${name} — ${label}`
      pageData.description = `${label} ${name} in UnitsDB`
    }
  },

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png', sizes: '32x32' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['meta', { name: 'theme-color', content: '#2d2c69' }],
  ],

  vite: {
    plugins: [asciidocPlugin()]
  },

  themeConfig: {
    logo: { src: '/symbol.svg', height: 28 },
    siteTitle: 'UnitsML',

    nav: [
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
      { text: 'Software', link: '/software/' },
      { text: 'Blog', link: '/blog/' },
      { text: 'About', link: '/about' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/unitsml' }
    ],

    footer: {
      message: `<a href="/unitsdb/">UnitsDB</a> · <a href="/schemas.html">Schemas</a> · <a href="/learn/what-is-unitsml.html">Learn</a> · <a href="https://github.com/unitsml">GitHub</a>`,
      copyright: 'Copyright © 2026 UnitsML Group'
    },

    search: {
      provider: 'local'
    },

    sidebar: {
      '/learn/': [
        {
          text: 'Learn',
          items: [
            { text: 'What is UnitsML', link: '/learn/what-is-unitsml' },
            { text: 'Who is it for', link: '/learn/who-is-it-for' },
            { text: 'How it works', link: '/learn/how-it-works' },
            { text: 'Incorporating UnitsML', link: '/learn/incorporating-unitsml' },
            { text: 'Guide', link: '/learn/guide' },
          ]
        },
        {
          text: 'Resources',
          items: [
            { text: 'Get Started', link: '/get-started' },
            { text: 'Schemas', link: '/schemas' },
          ]
        }
      ],
      '/software/': [
        {
          text: 'Software',
          items: [
            { text: 'Overview', link: '/software/' },
            { text: 'unitsdb-ruby', link: '/software/unitsdb-ruby' },
            { text: 'unitsml-ruby', link: '/software/unitsml-ruby' },
          ]
        }
      ],
      '/schemas': [
        {
          text: 'Schemas',
          items: [
            { text: 'Overview', link: '/schemas' },
            { text: 'UnitsML XML Schemas', link: '/schemas#unitsml-xml-schemas' },
            { text: 'UnitsDB YAML Schemas', link: '/schemas#unitsdb-yaml-schemas' },
          ]
        }
      ],
      '/get-started': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Get Started', link: '/get-started' },
          ]
        }
      ],
      '/about': [
        {
          text: 'About',
          items: [
            { text: 'About UnitsML', link: '/about' },
            { text: 'Privacy Policy', link: '/privacy' },
            { text: 'Terms of Service', link: '/tos' },
          ]
        }
      ],
    },

    outline: {
      level: [2, 3]
    },

    editLink: {
      pattern: 'https://github.com/unitsml/unitsml.github.io/edit/main/:path',
      text: 'Edit this page on GitHub'
    }
  }
})
