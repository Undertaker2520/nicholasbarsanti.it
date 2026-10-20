import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { sito } from './src/config.ts';

export default defineConfig({
  site: sito.url,
  output: 'static',
  // URL senza barra finale: /privacy → privacy.html, coerente con canonical e sitemap.
  trailingSlash: 'never',
  build: {
    format: 'file',
    // Niente CSS inline: la Content Security Policy non deve richiedere 'unsafe-inline'.
    inlineStylesheets: 'never',
  },
  integrations: [sitemap()],
});
