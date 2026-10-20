# nicholasbarsanti.it

Sito personale di Nicholas Barsanti: pagina unica statica realizzata con [Astro](https://astro.build), pubblicata su Netlify.

Nessun cookie, nessuna risorsa di terze parti. Il JavaScript (jQuery slim, incluso nel bundle, mai da CDN né inline) aggiunge solo animazioni: senza JavaScript il sito è completo.

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
  config.ts        dati del sito (URL, contatti, profili come LinkedIn, flag delle sezioni)
  data/sezioni.ts  id delle ancore, voci di menu, titoli delle sezioni
  data/testi.ts    TUTTI i testi della pagina (modificare solo qui)
  assets/          foto facoltativa nicholas.jpg (se manca: segnaposto "NB")
  assets/fonts/    Inter variabile (sottoinsieme latin, licenza OFL)
  components/      componenti Astro riusabili
  layouts/         struttura HTML comune
  pages/           pagine del sito (anche .well-known/security.txt, generato)
  sicurezza/       intestazioni HTTP (CSP, HSTS, ...): unica fonte
  lib/             funzioni comuni (URL, JSON-LD, email precompilate, risposte di testo)
  scripts/
    main.js          punto di ingresso del JavaScript (incluso dal layout)
    moduli/          carosello, comparsa allo scorrimento, intestazione, sfondo
    utilita.js       controlli comuni (movimento ridotto, puntatore, un aggiornamento per fotogramma)
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

- **Foto**: salvare un ritratto (meglio quadrato, almeno 400×400 px) come `src/assets/nicholas.jpg`. Astro lo converte in AVIF/WebP/JPEG fino a 400 px (qualità 80) e rimuove i metadati EXIF. Senza file compare il cerchio con le iniziali.
- **Lavori realizzati**: aggiungere i lavori in `lavori` dentro `src/data/testi.ts` e impostare `mostraLavori: true` in `src/config.ts`. La sezione compare solo se entrambe le condizioni sono vere.

## Schede dei servizi

Ogni scheda ha in fondo il pulsante "Chiedi informazioni" (stesso componente `Pulsante` di "Scrivimi"), esteso a tutta la scheda: apre il programma di posta con oggetto e testo già scritti per quel servizio. I testi del messaggio sono in `richiestaServizio` (`src/data/testi.ts`); il link è costruito da `mailtoPrecompilato` (`src/lib/email.ts`). Le schede sono uguali: sfondo tenue e bordo petrolio compaiono su ognuna solo al passaggio del mouse. Da 1024 px titolo, prezzo, descrizione e fondo sono allineati tra schede affiancate con CSS subgrid (righe in `$scheda-righe`, `_variabili.scss`).

Sotto i 1024 px le schede diventano un **carosello** (`src/components/Carosello.astro`): una per volta, intere e centrate, con aggancio CSS (`scroll-snap`). Pallini e pulsante pausa sono nell'HTML ma nascosti; `src/scripts/moduli/carosello.js` li mostra, evidenzia il pallino della scheda visibile, porta alla scheda scelta e fa **scorrere le schede da sole ogni 6 secondi**. Lo scorrimento automatico rispetta WCAG 2.2.2: pulsante pausa/riprendi sempre visibile, arresto definitivo appena la persona tocca, trascina o usa un pallino, sospensione con mouse o focus sul carosello, fuori schermo o con la scheda del browser nascosta, nessun movimento con `prefers-reduced-motion`. Senza JavaScript si scorre comunque con il dito o la barra di scorrimento. Nessuna libreria esterna (Owl Carousel scartato: non mantenuto dal 2018, incompatibile con jQuery 4 e con i pallini senza nome accessibile). Il pulsante è la variante `dimensione="piccolo"` (a pillola, testo non in grassetto).

## Animazioni e JavaScript

- **Comparsa allo scorrimento**: `data-comparsa` su un elemento, `data-comparsa-gruppo` su un elenco (i figli compaiono uno dopo l'altro). Il JavaScript nasconde solo gli elementi ancora fuori dallo schermo e li mostra quando entrano.
- **Intestazione** (da 640 px): resta in alto, prende un'ombra quando la pagina scorre ed evidenzia la voce della sezione che si sta leggendo.
- **Al passaggio del mouse** (solo CSS, solo con mouse): schede che si sollevano, pulsante, sottolineatura animata nel menu.
- **Sfondo di pagina** (`src/components/Sfondo.astro`, mappa `$macchie` in `_variabili.scss`): nebulose petrolio sfumate fisse rispetto allo schermo (restano in alto a destra e in basso a sinistra della parte di pagina visualizzata), con una deriva continua e, solo con il mouse, un leggero spostamento che segue il puntatore (le due macchie in direzioni opposte). Fascia petrolio in "Perché lavorare con me".
- Con `prefers-reduced-motion: reduce` niente si muove e il JavaScript non nasconde nulla. Durate, distanze e intensità sono in `src/styles/_variabili.scss`.

## Pagine

- `/` pagina principale; `/privacy` informativa; `/404` pagina di errore (`noindex`, esclusa dalla sitemap), servita da Netlify per ogni indirizzo inesistente.
- **L'informativa privacy (`src/pages/privacy.astro`) è una bozza**: va fatta verificare da un consulente prima della pubblicazione. Aggiornare la data in fondo a ogni modifica.

## Sicurezza

Le intestazioni HTTP sono definite **solo** in `src/sicurezza/intestazioni.ts`:

- `npm run build` le scrive in `dist/_headers`, il file che Netlify applica a ogni risposta;
- `npm run preview` le applica al server locale, quindi la CSP si verifica prima di pubblicare
  (console del browser: nessun errore "Refused to load…"). `npm run dev` non le applica, perché
  il server di sviluppo usa script inline per il ricaricamento automatico.

Regole che rendono possibile una CSP senza `unsafe-inline`:

- nessun `<script>` eseguibile né `<style>` inline e nessun attributo `style=` nell'HTML generato
  (ammessi solo il JSON-LD, che il browser non esegue, e gli script esterni con `src`);
- CSS sempre in file esterni (`build.inlineStylesheets: 'never'`);
- nessuna risorsa da domini esterni (font, immagini, script: tutto self-hosted).

Controllo rapido dopo la build (non deve stampare nulla):

```bash
LC_ALL=C.UTF-8 grep -l -P '<script(?![^>]*\bsrc=)(?! type="application/ld\+json")|<style|style=' dist/*.html
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

## Pubblicazione su Netlify

Il repository è `github.com/Undertaker2520/nicholasbarsanti.it` (privato). Ogni push su `main` viene pubblicato automaticamente.

1. Accedere a <https://app.netlify.com> (piano gratuito) con l'account GitHub **Undertaker2520**.
2. **Add new project → Import an existing project → GitHub**, autorizzare Netlify **solo** sul repository `nicholasbarsanti.it` (opzione "Only select repositories").
3. Impostazioni di build: vengono lette da `netlify.toml` (comando `npm run build`, cartella `dist`); la versione di Node da `.nvmrc`. Non serve altro.
4. **Deploy**. Al termine il sito è raggiungibile su un indirizzo tipo `nome-casuale.netlify.app`: annotarlo, serve per il DNS. Conviene rinominarlo in **Project configuration → Change project name** (per esempio `nicholasbarsanti`).
5. Su `nome.netlify.app` controllare che tutto funzioni e che le intestazioni ci siano (vedi checklist) **prima** di toccare il DNS.

### Dominio

1. **Domain management → Add a domain** → `nicholasbarsanti.it` (senza `www`). Netlify aggiunge da solo anche `www.nicholasbarsanti.it` e lo reindirizza al dominio principale.
2. Netlify chiede se usare Netlify DNS: **no**, il DNS resta su OVH ("Configure external DNS").

> Nota: con DNS esterno Netlify consiglia `www` come dominio principale, perché il dominio senza `www` può puntare solo a un indirizzo IP e non sfrutta appieno la CDN. Il brief sceglie il dominio senza `www`: per un sito statico così leggero la differenza è trascurabile.

### Record DNS su OVH

In **OVHcloud → Web Cloud → Nomi di dominio → nicholasbarsanti.it → Zona DNS**:

| Azione | Sottodominio | Tipo | Destinazione |
|---|---|---|---|
| modificare (o creare) | *(vuoto)* | `A` | `75.2.60.5` |
| **eliminare** | *(vuoto)* | `AAAA` | indirizzo IPv6 di OVH, se presente |
| eliminare | `www` | `A` / `AAAA` | indirizzi OVH, se presenti |
| creare | `www` | `CNAME` | `nome.netlify.app.` (con il punto finale) |

- `75.2.60.5` è il load balancer di Netlify per i DNS esterni (documentazione: *Configure external DNS*; ricontrollarlo prima di modificare la zona).
- Il record `AAAA` del dominio principale va tolto: Netlify con DNS esterno non risponde su IPv6 e chi ha IPv6 finirebbe sulla vecchia pagina di OVH.
- **Non toccare**: record `MX`, `TXT` di SPF (`v=spf1…`) e DMARC (`_dmarc`), record DKIM (`…_domainkey`), `autodiscover`/`autoconfig`, eventuali `SRV`, i server DNS (`NS`) e **DNSSEC**, che resta attivo: OVH firma da sola i nuovi record.
- Se esiste un record `CAA`, deve consentire `letsencrypt.org`, altrimenti Netlify non può ottenere il certificato.

La propagazione richiede da pochi minuti a 24 ore. Poi, in Netlify, **Domain management → HTTPS → Verify DNS configuration**: il certificato Let's Encrypt viene emesso e rinnovato automaticamente.

### Dopo il collegamento

- Il sito resta raggiungibile anche su `nome.netlify.app`: il canonical punta a `nicholasbarsanti.it`, quindi per i motori di ricerca non è un duplicato.
- HSTS ha `includeSubDomains`: una volta visitato il sito, i browser useranno solo HTTPS anche per tutti i sottodomini. Ogni sottodominio web futuro dovrà avere un certificato valido (la posta non è interessata).

## Checklist di verifica finale

Prima della pubblicazione (in locale):

- [ ] `npm run build` senza errori né avvisi
- [ ] controllo inline (sezione Sicurezza) senza risultati
- [ ] `npm run preview`: console del browser senza errori né avvisi, in tema chiaro e scuro
- [ ] HTML valido su <https://validator.w3.org/nu/> (index, privacy, 404)
- [ ] navigazione completa da tastiera, focus sempre visibile, "Vai al contenuto" al primo Tab
- [ ] con "riduci animazioni" attivo nel sistema nessun elemento si muove e tutto è visibile
- [ ] con JavaScript disattivato (DevTools → Ctrl+Shift+P → "Disable JavaScript") tutto il contenuto è visibile
- [ ] leggibile a 320 px senza scroll orizzontale
- [ ] informativa privacy verificata da un consulente

Dopo la pubblicazione (su `https://nicholasbarsanti.it`):

- [ ] Lighthouse 100/100/100/100 su mobile e desktop (Chrome DevTools → Lighthouse, finestra in incognito)
- [ ] <https://securityheaders.com>: A+
- [ ] <https://developer.mozilla.org/observatory>: A+
- [ ] scheda Rete del browser: nessuna richiesta verso domini esterni
- [ ] `https://www.nicholasbarsanti.it` e `http://nicholasbarsanti.it` reindirizzano a `https://nicholasbarsanti.it`
- [ ] raggiungibili: `/.well-known/security.txt`, `/robots.txt`, `/sitemap-index.xml`, `/privacy`; un indirizzo inventato restituisce la pagina 404 con codice 404
- [ ] `/_headers` **non** raggiungibile (deve dare 404)
- [ ] intestazioni presenti e non duplicate:

```bash
curl -sI https://nicholasbarsanti.it/
```

- [ ] JSON-LD valido: <https://search.google.com/test/rich-results> e <https://validator.schema.org>
- [ ] anteprima corretta condividendo il link su WhatsApp (in caso di cache vecchia: <https://developers.facebook.com/tools/debug/>)
- [ ] record email intatti: SPF, DKIM e DMARC ancora validi (per esempio con <https://mxtoolbox.com>)
