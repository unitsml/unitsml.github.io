import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

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
  legacy: {
    collectionsBackwardsCompat: true
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['fsevents']
    }
  }
});
