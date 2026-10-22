# Progetto: nicholasbarsanti.it

Sito personale di presentazione di Nicholas Barsanti, sviluppatore che realizza siti web e servizi di messa in sicurezza WordPress per attività e professionisti della zona di Lucca. È una pagina unica, in italiano, pensata come biglietto da visita: chi riceve il link deve capire in 30 secondi chi sono, cosa offro e come contattarmi.

Il sito stesso è una dimostrazione di competenza: deve essere veloce, accessibile e configurato in modo esemplare dal punto di vista della sicurezza.

## Tecnologia

- **Astro** con output completamente statico (`output: 'static'`). Nessun framework UI (niente React, Vue, ecc.).
- **JavaScript solo come miglioramento progressivo**: senza JS la pagina è completa e funzionante (menu compreso). Oggi il JS gestisce il carosello delle schede su mobile (pallini e scorrimento automatico ogni 3 secondi che si ferma alla prima interazione con le schede; **nessun pulsante pausa, scelta di Nicholas**, consapevole del rischio WCAG 2.2.2; l'aggancio è CSS scroll-snap con una scheda per gesto), la comparsa degli elementi durante lo scorrimento, l'intestazione (ombra, voce di menu attiva) e lo sfondo che segue il mouse.
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

- `Content-Security-Policy`: `default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self'; connect-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests`. Verificare dopo la build che nulla venga bloccato (per esempio eventuali script o stili inline generati da Astro, o lo script JSON-LD).
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
- Animazioni sobrie: comparsa allo scorrimento, effetti al passaggio del mouse, sfondo (da 640 px; su mobile nessuna nebulosa) con nebulose petrolio sfumate fisse rispetto allo schermo (in alto a destra e in basso a sinistra della parte visualizzata) che derivano e seguono il mouse; intensità limitata dal contrasto del testo (vedi `$decorazione-intensita`), fascia petrolio in "Perché lavorare con me" e nel piè di pagina. Sempre disattivate con `prefers-reduced-motion`; durate e distanze in `_variabili.scss`. Niente immagini stock, niente icone generiche in eccesso.
- Tipografia leggibile: testo a 17–18 px su desktop, righe di massimo 70 caratteri circa.
- Un solo pulsante principale ("Scrivimi"), che porta al **modulo di contatto** nella sezione Contatti. Nella risposta "Come iniziamo?" delle domande frequenti un pulsante piccolo "Scrivimi" verso lo stesso modulo. Nelle schede dei servizi un pulsante "Chiedi informazioni" nella variante piccola a pillola (esteso a tutta la scheda) porta al modulo con il servizio già selezionato.
- Foto: `public/images/nicholas.jpg`. **Se il file non esiste**, mostrare un cerchio con le iniziali "NB" come segnaposto. Quando la foto c'è, servirla ottimizzata (Astro `<Image>`, formati moderni, dimensioni corrette, `alt` descrittivo).

## Struttura della pagina (ordine fisso)

1. **Intestazione**: a sinistra il logo (l'icona "NB" del favicon, con alt "Nicholas Barsanti", link alla home); a destra i link interni Chi sono, Servizi, Come lavoro, Domande, Contatti (ancore alla stessa pagina). Sotto i 640 px menu a hamburger (pulsante mostrato dal JavaScript; senza JavaScript il menu resta visibile).
2. **Apertura**: titolo, sottotitolo, pulsante "Scrivimi", foto.
3. **Chi sono**
4. **Cosa posso fare per te**: tre schede uguali; al passaggio del mouse ognuna si solleva, con sfondo tenue e bordo petrolio (scelta di Nicholas: nessuna scheda evidenziata di default).
5. **Come lavoro**: quattro passi numerati.
6. **Perché lavorare con me**: tre punti brevi.
7. **Lavori realizzati**: sezione predisposta ma **nascosta** finché non c'è almeno un lavoro vero (un flag in un file di configurazione la attiva). Non inventare progetti.
8. **Domande frequenti**: cinque domande con `<details>`/`<summary>`, senza JavaScript.
9. **Contatti**: invito, modulo di contatto (Netlify Forms) e, sotto, l'email e LinkedIn come alternativa.
10. **Piè di pagina**, con link alla pagina `/privacy`.

Pagina aggiuntiva `/privacy`: informativa breve e chiara (titolare Nicholas Barsanti, contatto info@nicholasbarsanti.it; il sito non usa cookie né analytics; l'hosting Netlify registra dati tecnici di accesso come l'indirizzo IP nei log del server; i dati inviati con il modulo (raccolti da Netlify Forms) o via email sono usati solo per rispondere). Da segnalare come bozza da far verificare.

## Testi (usare esattamente questi, segnalando eventuali correzioni invece di riscriverli)

Registro: si dà del **tu** al visitatore.

### Apertura
**Titolo:** Siti web curati e sicuri per attività e professionisti
**Sottotitolo:** Realizzo siti veloci, facili da aggiornare e protetti, per chi lavora a Lucca e dintorni. Parli direttamente con chi li costruisce, dall'inizio alla consegna.
**Pulsante:** Scrivimi

### Chi sono
Sono Nicholas, programmo professionalmente dal 2021 e sono responsabile del reparto informatico di un'azienda, dove seguo software, server e sicurezza. In parallelo realizzo siti per attività e professionisti della zona.

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
- **Sicurezza di serie.** Aggiornamenti automatici, backup e protezioni configurati fin dal primo giorno.
- **Il sito resta tuo.** Niente abbonamenti obbligatori né vincoli: se un giorno vuoi cambiare, porti via tutto.
- **Un solo interlocutore.** Parli con chi scrive il codice, non con un call center.

### Domande frequenti
Le risposte riprendono solo fatti già scritti nel sito.
- **Quanto costa davvero un sito vetrina?** Si parte da 900 € per un sito fino a 5 pagine. Il prezzo finale dipende da quante pagine e funzioni ti servono: prima di iniziare ricevi un preventivo scritto con cosa è incluso e cosa no, così non ci sono sorprese.
- **Dominio e hosting sono compresi?** Dominio e hosting sono intestati a te, così il sito resta tuo e non dipendi da me. Il loro costo annuale lo paghi direttamente al fornitore e lo trovi indicato nel preventivo.
- **Potrò aggiornare il sito da solo?** Sì. Ti insegno a modificare testi e foto e alla consegna ricevi una guida scritta per gestire il sito in autonomia.
- **Cosa succede dopo la consegna?** Hai 30 giorni di garanzia. Non ci sono abbonamenti obbligatori né vincoli: se un giorno vuoi cambiare, porti via tutto.
- **Come iniziamo?** Scrivimi due righe su cosa ti serve: rispondo entro la giornata e fissiamo una prima chiacchierata, gratuita e senza impegno. (Sotto la risposta, pulsante piccolo "Scrivimi".)

### Contatti
Raccontami il tuo progetto: rispondo entro la giornata.

Modulo: Nome e cognome · Email (sulla stessa riga da 640 px) · Di cosa hai bisogno? (facoltativo: Non lo so ancora o uno dei tre servizi) · Messaggio · "Uso questi dati solo per risponderti. Informativa privacy" · pulsante "Invia il messaggio". Pagina di conferma `/grazie`: "Messaggio inviato" · "Grazie, ho ricevuto il tuo messaggio: ti rispondo entro la giornata."

Preferisci l'email? Scrivimi a info@nicholasbarsanti.it.
Mi trovi anche su LinkedIn.

### Piè di pagina
Nicholas Barsanti · Capannori (LU) · info@nicholasbarsanti.it
Questo sito non usa cookie né sistemi di tracciamento. · Privacy

## Regole di lavoro

- **Non inventare** clienti, recensioni, numeri, loghi di aziende o certificazioni. Il sito contiene solo informazioni vere.
- Non nominare il datore di lavoro né il suo settore.
- Prima di modificare l'architettura o aggiungere dipendenze, chiedi conferma.
- Niente codice duplicato: astrazione e modularità. Testi e dati in file dedicati, componenti riusabili che li ricevono, mixin e funzioni SCSS per gli schemi ricorrenti.
- Il sito verrà sottoposto a **penetration testing** a lavoro finito: nessuna superficie d'attacco superflua (unico form: il modulo di contatto su Netlify Forms, con campo trappola e lunghezze massime, deciso da Nicholas; niente endpoint propri, niente file non necessari in `dist/`) e ogni intestazione di sicurezza verificata.
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
