/**
 * Variabili del JavaScript: unico punto in cui si definiscono classi, tempi e soglie.
 * I moduli in src/scripts/moduli/ le importano e non ridefiniscono valori
 * (come src/styles/_variabili.scss per gli stili). Le classi CSS devono corrispondere
 * a quelle usate negli stili indicati accanto.
 */

/** Media query delle preferenze di sistema (src/scripts/utilita.js). */
export const MEDIA = {
  movimentoRidotto: '(prefers-reduced-motion: reduce)',
  puntatorePreciso: '(pointer: fine)',
};

/** Carosello delle schede (src/styles/componenti/_carosello.scss). */
export const CAROSELLO = {
  classeAttivo: 'carosello--attivo',
  classePallinoAttivo: 'carosello__pallino--attivo',
  intervalloMs: 3000, // ogni quanto passa alla scheda successiva (scelta di Nicholas)
  // Oltre questo tempo uno scorrimento avviato dal codice si considera concluso anche senza
  // l'evento scrollend (browser che non lo supportano).
  durataMaxScorrimentoMs: 900,
  tolleranzaFinePx: 2,
  // Spostamento minimo del dito per considerare un trascinamento orizzontale delle schede.
  sogliaTrascinamentoPx: 10,
};

/** Comparsa durante lo scorrimento (src/styles/componenti/_comparsa.scss). */
export const COMPARSA = {
  selettore: '[data-comparsa], [data-comparsa-gruppo] > *',
  classeAttesa: 'in-attesa',
  sogliaVisibilita: 0.1, // compare quando ne è visibile il 10%
};

/** Intestazione (src/styles/componenti/_intestazione.scss). */
export const INTESTAZIONE = {
  classeStaccata: 'intestazione--staccata',
  classeLinkAttivo: 'menu__link--attivo',
  // Una sezione diventa "corrente" quando il suo inizio supera questa frazione dello schermo.
  lineaLettura: 0.3,
  tolleranzaFondoPx: 2,
};

/** Modulo di contatto (src/components/ModuloContatto.astro). */
export const MODULO = {
  selettoreServizio: '#modulo-servizio',
  // Pulsante di invio: l'attributo contiene il testo da mostrare mentre il messaggio parte.
  attributoTestoInvio: 'data-testo-invio',
};

/** Menu a hamburger su mobile (src/styles/componenti/_intestazione.scss). */
export const MENU = {
  classeCompatta: 'intestazione--compatta',
  classeAperta: 'intestazione--aperta',
};
