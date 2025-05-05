// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: 'https://invisibletext.pro/',
  output: 'static',
  i18n: {
    locales: ["es", "en", "fr", "de"],
    defaultLocale: "en",
    routing: {
        prefixDefaultLocale: false
    }
  },
  // Enable React to support React JSX components.
  integrations: [react(), mdx(), sitemap(), icon()],

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