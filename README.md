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
  lib/             funzioni comuni (URL, JSON-LD, risposte di testo)
  styles/
    _variabili.scss  UNICO file con font, colori, misure e breakpoint
    _strumenti.scss  funzioni e mixin (temi, media query, focus)
    main.scss        punto di ingresso, importa tutto il resto
    componenti/      stili dei singoli componenti
scripts/
  genera-immagini.mjs  favicon, icone e anteprima Open Graph
public/            file generati da `npm run immagini` (da committare)
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

- nessun `<script>` eseguibile né `<style>` inline e nessun attributo `style=` nell'HTML generato
  (l'unico blocco ammesso è il JSON-LD, che il browser non esegue);
- CSS sempre in file esterni (`build.inlineStylesheets: 'never'`);
- nessuna risorsa da domini esterni (font, immagini, script: tutto self-hosted).

Controllo rapido dopo la build (non deve stampare nulla):

```bash
LC_ALL=C.UTF-8 grep -l -P '<script(?! type="application/ld\+json")|<style|style=' dist/*.html
```

`/.well-known/security.txt` (RFC 9116) è generato in build da `src/config.ts`; il campo `Expires` è fissato a un anno dalla build, quindi ogni pubblicazione lo rinnova.

## SEO e immagini

- `<title>`, description, canonical, Open Graph e Twitter card sono nel layout (`src/layouts/Base.astro`) e prendono i valori da `src/config.ts`.
- Dati strutturati JSON-LD `ProfessionalService` in `src/lib/dati-strutturati.ts`, generati da config e testi (offerte comprese). Nessun indirizzo stradale né telefono.
- `robots.txt` e `sitemap-index.xml` sono generati in build.
- Favicon (SVG e ICO), `apple-touch-icon.png` e `og-image.png` (1200×630) si rigenerano con:

```bash
npm run immagini
```

Lo script legge i colori da `_variabili.scss` e nome e ruolo da `config.ts`: va rilanciato dopo aver cambiato uno dei due. Il testo dell'anteprima usa un font di sistema (Segoe UI su Windows), quindi rigenerarla su un altro sistema operativo può cambiarne leggermente l'aspetto.

<!-- Da completare: pubblicazione su Netlify, DNS OVH, checklist finale. -->
