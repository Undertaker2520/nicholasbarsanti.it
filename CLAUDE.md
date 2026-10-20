# Progetto: nicholasbarsanti.it

Sito personale di presentazione di Nicholas Barsanti, sviluppatore che realizza siti web e servizi di messa in sicurezza WordPress per attività e professionisti della zona di Lucca. È una pagina unica, in italiano, pensata come biglietto da visita: chi riceve il link deve capire in 30 secondi chi sono, cosa offro e come contattarmi.

Il sito stesso è una dimostrazione di competenza: deve essere veloce, accessibile e configurato in modo esemplare dal punto di vista della sicurezza.

## Tecnologia

- **Astro** con output completamente statico (`output: 'static'`). Nessun framework UI (niente React, Vue, ecc.).
- **JavaScript solo come miglioramento progressivo**: senza JS la pagina è completa e funzionante (menu compreso). Oggi il JS gestisce la comparsa degli elementi durante lo scorrimento, l'intestazione (ombra, voce di menu attiva) e lo sfondo che segue il mouse.
- Quando serve JavaScript si usa **jQuery**, installato via npm e incluso nel bundle di Astro come file esterno: mai da CDN, mai script inline. Si usa la build **slim** (`jquery/slim`). Codice in `src/scripts/`, un modulo per funzione.
- Stili scritti a mano in **SCSS** (compilato da Vite con `sass`), in file separati, niente Tailwind. **Font, colori e altre variabili di design stanno in un unico file dedicato** (`src/styles/_variabili.scss`); gli altri file li usano, non ridefiniscono valori. Impostare `build.inlineStylesheets: 'never'` così la Content Security Policy non richiede `unsafe-inline`.
- Dipendenze ammesse: `astro`, `@astrojs/sitemap`, `sass` (sviluppo) e `jquery` (solo quando serve JS). Qualsiasi altra dipendenza va proposta e motivata prima di installarla.
- Font: uno solo, **self-hosted** in formato woff2 (per esempio Inter), oppure lo stack di sistema. **Mai** Google Fonts da CDN o altre risorse esterne: nessuna richiesta verso terze parti.
- Nessun cookie, nessun analytics, nessun tracciamento.

## Hosting e pubblicazione

- Repository Git privato su GitHub (account personale).
- Pubblicazione su **Netlify** (piano gratuito), collegato al repository, con deploy automatico dal branch `main`.
- Il DNS resta su **OVH** (dove il dominio ha già DNSSEC e i record email SPF, DKIM e DMARC: non vanno toccati). Collegamento tramite record A per `nicholasbarsanti.it` verso il load balancer di Netlify e CNAME per `www`, seguendo la documentazione Netlify per i DNS esterni. `www` reindirizza al dominio principale.
- HTTPS automatico tramite Netlify (Let's Encrypt).

## Sicurezza (obiettivo: A+ su securityheaders.com e Mozilla Observatory)

Intestazioni definite in `src/sicurezza/intestazioni.ts` (unica fonte): in build generano `dist/_headers` per Netlify e valgono anche in `npm run preview`:

- `Content-Security-Policy`: `default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self'; connect-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'none'; upgrade-insecure-requests`. Verificare dopo la build che nulla venga bloccato (per esempio eventuali script o stili inline generati da Astro, o lo script JSON-LD).
- `Strict-Transport-Security: max-age=31536000; includeSubDomains` (niente `preload` per ora).
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` restrittiva (camera, microfono, geolocalizzazione, ecc. disabilitati).
- `Cross-Origin-Opener-Policy: same-origin`
- File `/.well-known/security.txt` conforme a RFC 9116, con contatto `mailto:info@nicholasbarsanti.it`, lingue `it, en` e campo `Expires` a un anno.

## Qualità

- Lighthouse 100 su Performance, Accessibilità, Best Practices e SEO, sia mobile sia desktop.
- Accessibilità WCAG 2.2 livello AA: contrasti verificati, focus visibile, navigazione da tastiera, gerarchia dei titoli corretta, testi alternativi, `lang="it"`, rispetto di `prefers-reduced-motion`.
- Mobile-first, nessuno scroll orizzontale da 320 px in su.
- HTML valido (validator.w3.org).
- Supporto a tema chiaro e scuro tramite `prefers-color-scheme`.

## SEO

- `<title>`: "Nicholas Barsanti · Siti web e sicurezza WordPress a Lucca"
- Meta description: "Siti web curati, veloci e sicuri per attività e professionisti di Lucca e dintorni. Sito vetrina e messa in sicurezza di siti WordPress."
- Open Graph e Twitter card, con un'immagine di anteprima 1200×630 generata in modo semplice (nome e sottotitolo su sfondo a tinta unita).
- Dati strutturati JSON-LD di tipo `ProfessionalService` (o `Person` più `Service`): nome, email, area servita "Lucca e provincia", località Capannori (LU). **Nessun indirizzo stradale e nessun numero di telefono.**
- `sitemap.xml`, `robots.txt`, URL canonico, favicon SVG con le iniziali "NB" più versioni PNG/ICO, pagina 404 coerente con il sito.

## Design

- Sobrio, professionale, molto spazio bianco. Un solo colore di accento (blu scuro o verde petrolio), il resto neutro.
- Animazioni sobrie: comparsa allo scorrimento, effetti al passaggio del mouse, sfondo di pagina con macchie petrolio sfumate (in alto a destra e in fondo a sinistra) che derivano lentamente e seguono il mouse, fascia petrolio in "Perché lavorare con me". Sempre disattivate con `prefers-reduced-motion`; durate e distanze in `_variabili.scss`. Niente immagini stock, niente icone generiche in eccesso.
- Tipografia leggibile: testo a 17–18 px su desktop, righe di massimo 70 caratteri circa.
- Un solo pulsante principale ("Scrivimi"), che apre `mailto:info@nicholasbarsanti.it`.
- Foto: `public/images/nicholas.jpg`. **Se il file non esiste**, mostrare un cerchio con le iniziali "NB" come segnaposto. Quando la foto c'è, servirla ottimizzata (Astro `<Image>`, formati moderni, dimensioni corrette, `alt` descrittivo).

## Struttura della pagina (ordine fisso)

1. **Intestazione**: nome a sinistra; a destra i link interni Chi sono, Servizi, Come lavoro, Contatti (ancore alla stessa pagina).
2. **Apertura**: titolo, sottotitolo, pulsante "Scrivimi", foto.
3. **Chi sono**
4. **Cosa posso fare per te**: tre schede, la prima (Sito vetrina) leggermente evidenziata.
5. **Come lavoro**: quattro passi numerati.
6. **Perché lavorare con me**: tre punti brevi.
7. **Lavori realizzati**: sezione predisposta ma **nascosta** finché non c'è almeno un lavoro vero (un flag in un file di configurazione la attiva). Non inventare progetti.
8. **Contatti**
9. **Piè di pagina**, con link alla pagina `/privacy`.

Pagina aggiuntiva `/privacy`: informativa breve e chiara (titolare Nicholas Barsanti, contatto info@nicholasbarsanti.it; il sito non usa cookie né analytics; l'hosting Netlify registra dati tecnici di accesso come l'indirizzo IP nei log del server; i dati inviati via email sono usati solo per rispondere). Da segnalare come bozza da far verificare.

## Testi (usare esattamente questi, segnalando eventuali correzioni invece di riscriverli)

Registro: si dà del **tu** al visitatore.

### Apertura
**Titolo:** Siti web curati e sicuri per attività e professionisti
**Sottotitolo:** Realizzo siti veloci, facili da aggiornare e protetti, per chi lavora a Lucca e dintorni. Parli direttamente con chi li costruisce, dall'inizio alla consegna.
**Pulsante:** Scrivimi

### Chi sono
Sono Nicholas, sviluppatore con oltre cinque anni di esperienza e responsabile del reparto informatico di un'azienda, dove seguo software, server e sicurezza. In parallelo realizzo siti per attività e professionisti della zona.

Mi sono formato in sicurezza informatica, e si vede nel modo in cui lavoro: ogni sito che consegno nasce già protetto.

### Cosa posso fare per te
**Sito vetrina** · da 900 €
Il sito completo per presentare la tua attività: fino a 5 pagine, perfetto da telefono, con contatti, mappa e WhatsApp. Ti insegno a modificare testi e foto da solo.
Tempi: 3–4 settimane.

**Controllo e messa in sicurezza del sito WordPress** · da 290 €
Hai un sito che nessuno aggiorna da tempo? Lo controllo, lo aggiorno e lo proteggo, e ti consegno un rapporto chiaro su cosa ho trovato e cosa ho sistemato.
Tempi: circa una settimana.

**Progetti più strutturati** · su preventivo
Associazioni ed enti con molti contenuti, siti in più lingue, aree riservate.

### Come lavoro
1. **Ci sentiamo.** Mi racconti cosa ti serve. La prima chiacchierata è gratuita e senza impegno.
2. **Preventivo scritto.** Cosa è incluso, cosa no, tempi e prezzo. Nessuna sorpresa.
3. **Realizzazione.** Ti mostro il lavoro man mano, con due giri di revisioni inclusi.
4. **Consegna.** Il sito è tuo: dominio e hosting a tuo nome, una guida per gestirlo e 30 giorni di garanzia.

### Perché lavorare con me
- **Sicurezza di serie.** Aggiornamenti, backup e protezioni sono inclusi fin dal primo giorno.
- **Il sito resta tuo.** Niente abbonamenti obbligatori né vincoli: se un giorno vuoi cambiare, porti via tutto.
- **Un solo interlocutore.** Parli con chi scrive il codice, non con un call center.

### Contatti
Raccontami il tuo progetto: rispondo entro la giornata.
info@nicholasbarsanti.it

### Piè di pagina
Nicholas Barsanti · Capannori (LU) · info@nicholasbarsanti.it
Questo sito non usa cookie né sistemi di tracciamento. · Privacy

## Regole di lavoro

- **Non inventare** clienti, recensioni, numeri, loghi di aziende o certificazioni. Il sito contiene solo informazioni vere.
- Non nominare il datore di lavoro né il suo settore.
- Prima di modificare l'architettura o aggiungere dipendenze, chiedi conferma.
- Niente codice duplicato: astrazione e modularità. Testi e dati in file dedicati, componenti riusabili che li ricevono, mixin e funzioni SCSS per gli schemi ricorrenti.
- Il sito verrà sottoposto a **penetration testing** a lavoro finito: nessuna superficie d'attacco superflua (niente form, niente endpoint, niente file non necessari in `dist/`) e ogni intestazione di sicurezza verificata.
- Commit piccoli e descrittivi, in italiano.
- Dopo ogni modifica significativa esegui `npm run build` e correggi errori e avvisi.
- Mantieni un `README.md` con: avvio in locale, build, struttura delle cartelle, procedura di pubblicazione su Netlify e collegamento del dominio OVH, checklist di verifica finale.

## Checklist di verifica finale

- [ ] `npm run build` senza errori né avvisi
- [ ] Lighthouse 100/100/100/100 su mobile e desktop
- [ ] securityheaders.com: A+
- [ ] Mozilla Observatory: A+
- [ ] Nessuna richiesta verso domini esterni (scheda Rete del browser)
- [ ] HTML valido su validator.w3.org
- [ ] Navigazione completa da tastiera, focus sempre visibile
- [ ] Leggibile a 320 px, tema chiaro e scuro
- [ ] `/.well-known/security.txt`, `/robots.txt`, `/sitemap-index.xml` raggiungibili
- [ ] Anteprima corretta quando il link viene condiviso su WhatsApp
