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
  data/sezioni.ts  id delle ancore, voci di menu, titoli delle sezioni
  data/testi.ts    TUTTI i testi della pagina (modificare solo qui)
  assets/          foto facoltativa nicholas.jpg (se manca: segnaposto "NB")
  assets/fonts/    Inter variabile (sottoinsieme latin, licenza OFL)
  components/      componenti Astro riusabili
  layouts/         struttura HTML comune
  pages/           pagine del sito (anche .well-known/security.txt, generato)
  sicurezza/       intestazioni HTTP (CSP, HSTS, ...): unica fonte
  styles/
    _variabili.scss  UNICO file con font, colori, misure e breakpoint
    _strumenti.scss  funzioni e mixin (temi, media query, focus)
    main.scss        punto di ingresso, importa tutto il resto
    componenti/      stili dei singoli componenti
```

Per cambiare colori o font si modifica solo `src/styles/_variabili.scss`.

## Foto e lavori realizzati

- **Foto**: salvare un ritratto (meglio quadrato, almeno 512×512 px) come `src/assets/nicholas.jpg`. Astro lo converte in AVIF/WebP/JPEG fino a 512 px e rimuove i metadati EXIF. Senza file compare il cerchio con le iniziali.
- **Lavori realizzati**: aggiungere i lavori in `lavori` dentro `src/data/testi.ts` e impostare `mostraLavori: true` in `src/config.ts`. La sezione compare solo se entrambe le condizioni sono vere.

## Sicurezza

Le intestazioni HTTP sono definite **solo** in `src/sicurezza/intestazioni.ts`:

- `npm run build` le scrive in `dist/_headers`, il file che Netlify applica a ogni risposta;
- `npm run preview` le applica al server locale, quindi la CSP si verifica prima di pubblicare
  (console del browser: nessun errore "Refused to load…"). `npm run dev` non le applica, perché
  il server di sviluppo usa script inline per il ricaricamento automatico.

Regole che rendono possibile una CSP senza `unsafe-inline`:

- nessun `<script>` né `<style>` inline e nessun attributo `style=` nell'HTML generato;
- CSS sempre in file esterni (`build.inlineStylesheets: 'never'`);
- nessuna risorsa da domini esterni (font, immagini, script: tutto self-hosted).

Controllo rapido dopo la build (non deve stampare nulla):

```bash
grep -l -E "style=|<style|<script" dist/*.html
```

`/.well-known/security.txt` (RFC 9116) è generato in build da `src/config.ts`; il campo `Expires` è fissato a un anno dalla build, quindi ogni pubblicazione lo rinnova.

<!-- Da completare: pubblicazione su Netlify, DNS OVH, checklist finale. -->
