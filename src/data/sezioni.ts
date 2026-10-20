/**
 * Sezioni della pagina principale: unica fonte per gli id delle ancore,
 * le etichette del menu e i titoli delle sezioni.
 */
export interface Sezione {
  id: string;
  /** Testo nel menu. */
  etichetta: string;
  /** Titolo della sezione, se diverso dall'etichetta. */
  titolo?: string;
}

export const sezioni = {
  chiSono: { id: 'chi-sono', etichetta: 'Chi sono' },
  servizi: { id: 'servizi', etichetta: 'Servizi', titolo: 'Cosa posso fare per te' },
  comeLavoro: { id: 'come-lavoro', etichetta: 'Come lavoro' },
  perche: { id: 'perche', etichetta: 'Perché lavorare con me' },
  lavori: { id: 'lavori', etichetta: 'Lavori realizzati' },
  domande: { id: 'domande', etichetta: 'Domande', titolo: 'Domande frequenti' },
  contatti: { id: 'contatti', etichetta: 'Contatti' },
} as const satisfies Record<string, Sezione>;

/** Voci del menu nell'intestazione, nell'ordine della pagina. */
export const menu: readonly Sezione[] = [
  sezioni.chiSono,
  sezioni.servizi,
  sezioni.comeLavoro,
  sezioni.domande,
  sezioni.contatti,
];

/** Link a una sezione della home, valido anche dalle altre pagine. */
export const linkSezione = (sezione: Sezione) => `/#${sezione.id}`;

export const titoloSezione = (sezione: Sezione) => sezione.titolo ?? sezione.etichetta;
