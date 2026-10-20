/**
 * Dati del sito: unica fonte per URL, contatti e metadati.
 * Li usano la configurazione di Astro, il layout, il JSON-LD, gli endpoint
 * (robots.txt, security.txt) e lo script che genera icone e anteprima.
 */
const nome = 'Nicholas Barsanti';
const ruolo = 'Siti web e sicurezza WordPress a Lucca';

export const sito = {
  url: 'https://nicholasbarsanti.it',
  lingua: 'it',
  locale: 'it_IT',
  nome,
  ruolo,
  titolo: `${nome} · ${ruolo}`,
  descrizione:
    'Siti web curati, veloci e sicuri per attività e professionisti di Lucca e dintorni. Sito vetrina e messa in sicurezza di siti WordPress.',
  email: 'info@nicholasbarsanti.it',
  localita: 'Capannori',
  provincia: 'LU',
  paese: 'IT',
  areaServita: 'Lucca e provincia',

  /** Attiva la sezione "Lavori realizzati" solo quando c'è almeno un lavoro vero. */
  mostraLavori: false,
} as const;

export const mailto = `mailto:${sito.email}`;

/** File generati da `npm run immagini` in public/ (percorsi pubblici). */
export const immagini = {
  faviconSvg: '/favicon.svg',
  faviconIco: '/favicon.ico',
  appleTouchIcon: '/apple-touch-icon.png',
  anteprima: {
    percorso: '/og-image.png',
    larghezza: 1200,
    altezza: 630,
    alt: `${nome} · ${ruolo}`,
  },
} as const;
