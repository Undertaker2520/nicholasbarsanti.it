import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { sito, paginaGrazie } from './src/config.ts';
import { intestazioni, intestazioniGlobali } from './src/sicurezza/intestazioni.ts';

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
  // Le intestazioni di sicurezza valgono anche in `astro preview`, non in `astro dev`
  // (il server di sviluppo usa script inline per il ricaricamento automatico).
  server: ({ command }) => (command === 'preview' ? { headers: intestazioniGlobali } : {}),
  // La pagina di conferma del modulo non va nella sitemap.
  integrations: [sitemap({ filter: (pagina) => !pagina.endsWith(paginaGrazie) }), intestazioni()],
});
