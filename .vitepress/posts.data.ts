import { createContentLoader } from 'vitepress'

interface Post {
  title: string
  url: string
  date: string
  authors: string[]
  description: string
  lastUpdated: number | undefined
  readingTime: number
}

declare const data: Post[]
export { data }

export default createContentLoader('blog/*.md', {
  transform(raw): Post[] {
    return raw
      .filter((page) => !page.url.endsWith('/blog/'))
      .map((page) => {
        const wordCount = page.src ? page.src.split(/\s+/).length : 0
        return {
          title: page.frontmatter.title,
          url: page.url,
          date: page.frontmatter.date,
          authors: page.frontmatter.authors || [],
          description: page.frontmatter.description || '',
          lastUpdated: page.lastUpdated,
          readingTime: Math.max(1, Math.round(wordCount / 200)),
        }
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return dateB - dateA
      })
  },
})
