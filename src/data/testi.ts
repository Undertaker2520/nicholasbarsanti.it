/**
 * Testi della pagina principale, presi dal brief (CLAUDE.md).
 * I componenti li ricevono da qui: per cambiare un testo si modifica solo questo file.
 */

/** Voce con titolo in grassetto seguito da una frase (passi, punti di forza). */
export interface Punto {
  titolo: string;
  testo: string;
}

export interface Servizio {
  titolo: string;
  /** Prezzo di partenza in euro; se assente il servizio è su preventivo. */
  prezzoDa?: number;
  descrizione: string;
  tempi?: string;
  evidenziato?: boolean;
}

export interface Lavoro {
  titolo: string;
  descrizione: string;
  url?: string;
}

export const apertura = {
  titolo: 'Siti web curati e sicuri per attività e professionisti',
  sottotitolo:
    "Realizzo siti veloci, facili da aggiornare e protetti, per chi lavora a Lucca e dintorni. Parli direttamente con chi li costruisce, dall'inizio alla consegna.",
  pulsante: 'Scrivimi',
  altFoto: 'Nicholas Barsanti, sorridente, in camicia grigia e a braccia conserte',
};

export const chiSono: readonly string[] = [
  "Sono Nicholas, sviluppatore con oltre cinque anni di esperienza e responsabile del reparto informatico di un'azienda, dove seguo software, server e sicurezza. In parallelo realizzo siti per attività e professionisti della zona.",
  'Mi sono formato in sicurezza informatica, e si vede nel modo in cui lavoro: ogni sito che consegno nasce già protetto.',
];

export const servizi: readonly Servizio[] = [
  {
    titolo: 'Sito vetrina',
    prezzoDa: 900,
    descrizione:
      'Il sito completo per presentare la tua attività: fino a 5 pagine, perfetto da telefono, con contatti, mappa e WhatsApp. Ti insegno a modificare testi e foto da solo.',
    tempi: '3–4 settimane',
    evidenziato: true,
  },
  {
    titolo: 'Controllo e messa in sicurezza del sito WordPress',
    prezzoDa: 290,
    descrizione:
      'Hai un sito che nessuno aggiorna da tempo? Lo controllo, lo aggiorno e lo proteggo, e ti consegno un rapporto chiaro su cosa ho trovato e cosa ho sistemato.',
    tempi: 'circa una settimana',
  },
  {
    titolo: 'Progetti più strutturati',
    descrizione: 'Associazioni ed enti con molti contenuti, siti in più lingue, aree riservate.',
  },
];

/** Testo del prezzo; spazio indivisibile tra cifra ed euro, così non va a capo. */
export const etichettaPrezzo = (servizio: Servizio) =>
  servizio.prezzoDa === undefined ? 'su preventivo' : `da ${servizio.prezzoDa} €`;

export const comeLavoro: readonly Punto[] = [
  {
    titolo: 'Ci sentiamo.',
    testo: 'Mi racconti cosa ti serve. La prima chiacchierata è gratuita e senza impegno.',
  },
  {
    titolo: 'Preventivo scritto.',
    testo: 'Cosa è incluso, cosa no, tempi e prezzo. Nessuna sorpresa.',
  },
  {
    titolo: 'Realizzazione.',
    testo: 'Ti mostro il lavoro man mano, con due giri di revisioni inclusi.',
  },
  {
    titolo: 'Consegna.',
    testo:
      'Il sito è tuo: dominio e hosting a tuo nome, una guida per gestirlo e 30 giorni di garanzia.',
  },
];

export const perche: readonly Punto[] = [
  {
    titolo: 'Sicurezza di serie.',
    testo: 'Aggiornamenti, backup e protezioni sono inclusi fin dal primo giorno.',
  },
  {
    titolo: 'Il sito resta tuo.',
    testo:
      'Niente abbonamenti obbligatori né vincoli: se un giorno vuoi cambiare, porti via tutto.',
  },
  {
    titolo: 'Un solo interlocutore.',
    testo: 'Parli con chi scrive il codice, non con un call center.',
  },
];

/** Solo lavori veri. La sezione compare se `sito.mostraLavori` è true e l'elenco non è vuoto. */
export const lavori: readonly Lavoro[] = [];

export const contatti = {
  invito: 'Raccontami il tuo progetto: rispondo entro la giornata.',
};
