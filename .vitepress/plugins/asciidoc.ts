import Asciidoctor from '@asciidoctor/core'
import type { Plugin } from 'vite'

const asciidoctor = Asciidoctor()

export function asciidocPlugin(): Plugin {
  return {
    name: 'vite-plugin-asciidoc',
    transform(code, id) {
      if (!id.endsWith('.md')) return null
      if (!code.includes('asciidoc: true')) return null

      const match = code.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
      if (!match) return null

      const [, frontmatter, body] = match

      const html = asciidoctor.convert(body, {
        standalone: false,
        attributes: { showtitle: false }
      })

      return {
        code: `---\n${frontmatter}\n---\n\n${html}`,
        map: null
      }
    }
  }
}
