// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  // Enable React to support React JSX components.
  integrations: [react(), mdx()],

  vite: {
    plugins: [tailwindcss()],
  },
  // Enable content collections
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  }
});