# nicholasbarsanti.it

Sito personale di Nicholas Barsanti: pagina unica statica realizzata con [Astro](https://astro.build), pubblicata su Netlify.

## Requisiti

- Node.js 24 (vedi `.nvmrc`; minimo 22.22)
- npm 11

## Avvio in locale

```bash
npm install
npm run dev
```

Il sito è su <http://localhost:4321>.

## Build e anteprima

```bash
npm run build
npm run preview
```

La build produce la cartella `dist/`, che è ciò che Netlify pubblica.

## Struttura delle cartelle

```
astro.config.mjs   configurazione di Astro (output statico, sitemap)
netlify.toml       impostazioni di build per Netlify
src/
  config.ts        dati del sito (URL, contatti, flag delle sezioni)
  data/            id delle sezioni, voci di menu
  assets/fonts/    Inter variabile (sottoinsieme latin, licenza OFL)
  components/      componenti Astro riusabili
  layouts/         struttura HTML comune
  pages/           pagine del sito
  styles/
    _variabili.scss  UNICO file con font, colori, misure e breakpoint
    _strumenti.scss  funzioni e mixin (temi, media query, focus)
    main.scss        punto di ingresso, importa tutto il resto
    componenti/      stili dei singoli componenti
```

Per cambiare colori o font si modifica solo `src/styles/_variabili.scss`.

<!-- Da completare: stili, componenti, intestazioni di sicurezza, pubblicazione su Netlify, DNS OVH, checklist finale. -->
