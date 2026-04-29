export interface Project {
  name: string
  version: string
  description: string
  github: string
  docs?: string
  browse?: string
  icon: string
  category: string
}

export const projects: Project[] = [
  {
    name: 'unitsdb-ruby',
    version: '',
    description: 'A Ruby library for accessing and manipulating UnitsDB content — ships with bundled YAML data files.',
    github: 'https://github.com/unitsml/unitsdb-ruby',
    icon: '💎',
    category: 'Library'
  },
  {
    name: 'unitsml-ruby',
    version: '',
    description: 'Library to work with UnitsML in Ruby — parse unit expressions, generate MathML, and handle dimensional analysis.',
    github: 'https://github.com/unitsml/unitsml-ruby',
    icon: '💎',
    category: 'Library'
  }
]
