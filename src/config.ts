/**
 * Dati del sito: unica fonte per URL, contatti e metadati.
 * Li usano la configurazione di Astro, il layout, il JSON-LD e i componenti.
 */
export const sito = {
  url: 'https://nicholasbarsanti.it',
  lingua: 'it',
  nome: 'Nicholas Barsanti',
  titolo: 'Nicholas Barsanti · Siti web e sicurezza WordPress a Lucca',
  descrizione:
    'Siti web curati, veloci e sicuri per attività e professionisti di Lucca e dintorni. Sito vetrina e messa in sicurezza di siti WordPress.',
  email: 'info@nicholasbarsanti.it',
  localita: 'Capannori',
  provincia: 'LU',
  areaServita: 'Lucca e provincia',

  /** Attiva la sezione "Lavori realizzati" solo quando c'è almeno un lavoro vero. */
  mostraLavori: false,
} as const;

export const mailto = `mailto:${sito.email}`;
