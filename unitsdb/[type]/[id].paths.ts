import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const TYPE_FILE: Record<string, string> = {
  units: 'units',
  quantities: 'quantities',
  dimensions: 'dimensions',
  prefixes: 'prefixes',
  scales: 'scales',
  systems: 'unit_systems',
}

function slugify(uid: string): string {
  return uid.replace(/[^a-zA-Z0-9._-]/g, '_')
}

export default {
  watch: ['../../public/unitsdb/*.json'],

  paths() {
    const root = resolve(__dirname, '..', '..')
    const result: { params: { type: string; id: string } }[] = []

    for (const [urlType, fileKey] of Object.entries(TYPE_FILE)) {
      const raw = readFileSync(resolve(root, `public/unitsdb/${fileKey}.json`), 'utf-8')
      const items: any[] = JSON.parse(raw)
      for (const item of items) {
        result.push({
          params: { type: urlType, id: slugify(item.unitsml_id) }
        })
      }
    }

    return result
  }
}
