/**
 * Testi della pagina principale, presi dal brief (CLAUDE.md).
 * I componenti li ricevono da qui: per cambiare un testo si modifica solo questo file.
 */
import { linkSezione, sezioni } from './sezioni';

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
}

export interface Domanda {
  domanda: string;
  risposta: string;
  /** Pulsante facoltativo sotto la risposta. */
  azione?: { href: string; testo: string };
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
  "Sono Nicholas, programmo professionalmente dal 2021 e sono responsabile del reparto informatico di un'azienda, dove seguo software, server e sicurezza. In parallelo realizzo siti per attività e professionisti della zona.",
  'Mi sono formato in sicurezza informatica, e si vede nel modo in cui lavoro: ogni sito che consegno nasce già protetto.',
];

export const servizi: readonly Servizio[] = [
  {
    titolo: 'Sito vetrina',
    prezzoDa: 900,
    descrizione:
      'Il sito completo per presentare la tua attività: fino a 5 pagine, perfetto da telefono, con contatti, mappa e WhatsApp. Ti insegno a modificare testi e foto da solo.',
    tempi: '3–4 settimane',
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

/** Pulsante in fondo a ogni scheda dei servizi: porta al modulo con il servizio già scelto. */
export const richiestaServizio = {
  link: 'Chiedi informazioni',
};

/** Carosello delle schede su mobile: etichette di pallini e pulsante pausa per i lettori di schermo. */
export const carosello = {
  gruppo: 'Scegli il servizio da vedere',
  vaiA: (titolo: string) => `Mostra ${titolo}`,
  pausa: 'Metti in pausa lo scorrimento automatico',
  riprendi: 'Riprendi lo scorrimento automatico',
};

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
    testo: 'Aggiornamenti automatici, backup e protezioni configurati fin dal primo giorno.',
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

/** Testo del link al sito di un lavoro realizzato. */
export const linkLavoro = 'Visita il sito';

/**
 * Domande frequenti. Ogni risposta riprende solo fatti già scritti nel sito (prezzi,
 * preventivo, consegna, garanzia, contatti): niente promesse nuove.
 * La sezione compare solo se l'elenco non è vuoto.
 */
export const domande: readonly Domanda[] = [
  {
    domanda: 'Quanto costa davvero un sito vetrina?',
    risposta:
      'Si parte da 900 € per un sito fino a 5 pagine. Il prezzo finale dipende da quante pagine e funzioni ti servono: prima di iniziare ricevi un preventivo scritto con cosa è incluso e cosa no, così non ci sono sorprese.',
  },
  {
    domanda: 'Dominio e hosting sono compresi?',
    risposta:
      'Dominio e hosting sono intestati a te, così il sito resta tuo e non dipendi da me. Il loro costo annuale lo paghi direttamente al fornitore e lo trovi indicato nel preventivo.',
  },
  {
    domanda: 'Potrò aggiornare il sito da solo?',
    risposta:
      'Sì. Ti insegno a modificare testi e foto e alla consegna ricevi una guida scritta per gestire il sito in autonomia.',
  },
  {
    domanda: 'Cosa succede dopo la consegna?',
    risposta:
      'Hai 30 giorni di garanzia. Non ci sono abbonamenti obbligatori né vincoli: se un giorno vuoi cambiare, porti via tutto.',
  },
  {
    domanda: 'Come iniziamo?',
    risposta:
      'Scrivimi due righe su cosa ti serve: rispondo entro la giornata e fissiamo una prima chiacchierata, gratuita e senza impegno.',
    azione: { href: linkSezione(sezioni.contatti), testo: 'Scrivimi' },
  },
];

export const contatti = {
  invito: 'Raccontami il tuo progetto: rispondo entro la giornata.',
  /** Seguito dall'indirizzo email, sotto il modulo. */
  alternativa: "Preferisci l'email? Scrivimi a",
  /** Seguito dai link ai profili (config.ts → sito.profili). */
  profili: 'Mi trovi anche su',
};

/** Modulo di contatto (Netlify Forms) nella sezione Contatti. */
export const modulo = {
  nome: 'Nome e cognome',
  email: 'Email',
  servizio: 'Di cosa hai bisogno?',
  facoltativo: '(facoltativo)',
  servizioNonSo: 'Non lo so ancora',
  messaggio: 'Messaggio',
  privacy: 'Uso questi dati solo per risponderti.',
  linkPrivacy: 'Informativa privacy',
  invia: 'Invia il messaggio',
  /** Campo trappola per lo spam, nascosto: le persone non lo vedono, i bot sì. */
  trappola: 'Non compilare questo campo',
};

/** Pagina di conferma dopo l'invio del modulo. */
export const grazie = {
  titolo: 'Messaggio inviato',
  testo: 'Grazie, ho ricevuto il tuo messaggio: ti rispondo entro la giornata.',
  ritorno: 'Torna alla pagina principale',
};
