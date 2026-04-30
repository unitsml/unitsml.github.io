<script setup lang="ts">
import { data as posts } from '../../posts.data'
import { ref } from 'vue'

const hoveredPost = ref<string | null>(null)

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatLastUpdated(timestamp: number | undefined): string {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatAuthors(authors: string[]): string {
  if (!authors || authors.length === 0) return ''
  if (authors.length === 1) return authors[0]
  if (authors.length === 2) return `${authors[0]} & ${authors[1]}`
  return authors.slice(0, -1).join(', ') + ' & ' + authors[authors.length - 1]
}
</script>

<template>
  <div v-if="posts.length === 0" class="blog-empty">
    <div class="empty-illustration">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="12" y="8" width="56" height="64" rx="8" stroke="currentColor" stroke-width="2" opacity="0.15"/>
        <line x1="22" y1="24" x2="50" y2="24" stroke="currentColor" stroke-width="2" opacity="0.1"/>
        <line x1="22" y1="34" x2="58" y2="34" stroke="currentColor" stroke-width="2" opacity="0.1"/>
        <line x1="22" y1="44" x2="44" y2="44" stroke="currentColor" stroke-width="2" opacity="0.1"/>
        <circle cx="56" cy="56" r="16" fill="currentColor" opacity="0.04"/>
        <path d="M50 54l4 4 8-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.3"/>
      </svg>
    </div>
    <h3 class="empty-title">Coming soon</h3>
    <p class="empty-desc">We're working on articles about UnitsML development, standards updates, and community insights.</p>
    <a href="https://github.com/unitsml/unitsml.github.io" target="_blank" rel="noopener" class="empty-cta">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
      View on GitHub
    </a>
  </div>
  <div v-else class="blog-index">
    <article
      v-for="post in posts"
      :key="post.url"
      class="blog-card"
      @mouseenter="hoveredPost = post.url"
      @mouseleave="hoveredPost = null"
      :class="{ 'is-hovered': hoveredPost === post.url }"
    >
      <a :href="post.url" class="card-link">
        <div class="card-content">
          <div class="card-header">
            <time class="post-date" :datetime="post.date">
              {{ formatDate(post.date) }}
            </time>
            <span v-if="post.lastUpdated" class="updated-badge">
              Updated {{ formatLastUpdated(post.lastUpdated) }}
            </span>
          </div>
          <h2 class="post-title">{{ post.title }}</h2>
          <p v-if="post.description" class="post-excerpt">
            {{ post.description }}
          </p>
          <div class="card-footer">
            <span class="post-authors">
              By {{ formatAuthors(post.authors) }}
            </span>
            <span class="post-meta">
              <span class="reading-time">{{ post.readingTime }} min read</span>
              <span class="read-more">
                Read article
                <svg class="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </span>
          </div>
        </div>
      </a>
    </article>
  </div>
</template>

<style scoped>
.blog-empty {
  text-align: center;
  padding: 5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.empty-illustration {
  color: var(--vp-c-brand-1);
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0;
}

.empty-desc {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  max-width: 420px;
  line-height: 1.6;
  margin: 0;
}

.empty-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.625rem 1.25rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  transition: all 0.25s ease;
}

.empty-cta:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 8px rgba(45, 44, 105, 0.08);
}

.blog-index {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
}

.blog-card {
  position: relative;
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
}

.blog-card:hover,
.blog-card.is-hovered {
  background: var(--vp-c-bg);
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(45, 44, 105, 0.08);
}

.card-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.card-content {
  padding: 2rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.post-date {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.updated-badge {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg);
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
}

.post-title {
  margin: 0 0 0.75rem 0;
  font-size: 1.375rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--vp-c-text-1);
  transition: color 0.2s ease;
}

.blog-card:hover .post-title {
  color: var(--vp-c-brand-1);
}

.post-excerpt {
  margin: 0 0 1.25rem 0;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.post-authors {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
}

.post-meta {
  display: flex; align-items: center; gap: 0.75rem;
}

.reading-time {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.read-more {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.3s ease;
}

.blog-card:hover .read-more {
  opacity: 1;
  transform: translateX(0);
}

.arrow-icon {
  transition: transform 0.3s ease;
}

.blog-card:hover .arrow-icon {
  transform: translateX(4px);
}

@media (max-width: 640px) {
  .card-content {
    padding: 1.25rem 1.5rem;
  }

  .post-title {
    font-size: 1.125rem;
  }

  .read-more {
    opacity: 1;
    transform: translateX(0);
  }

  .card-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
