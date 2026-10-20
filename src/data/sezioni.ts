/**
 * Sezioni della pagina principale: unica fonte per gli id delle ancore
 * e per le etichette del menu.
 */
export interface Sezione {
  id: string;
  etichetta: string;
}

export const sezioni = {
  chiSono: { id: 'chi-sono', etichetta: 'Chi sono' },
  servizi: { id: 'servizi', etichetta: 'Servizi' },
  comeLavoro: { id: 'come-lavoro', etichetta: 'Come lavoro' },
  perche: { id: 'perche', etichetta: 'Perché lavorare con me' },
  lavori: { id: 'lavori', etichetta: 'Lavori realizzati' },
  contatti: { id: 'contatti', etichetta: 'Contatti' },
} as const satisfies Record<string, Sezione>;

/** Voci del menu nell'intestazione, nell'ordine del brief. */
export const menu: readonly Sezione[] = [
  sezioni.chiSono,
  sezioni.servizi,
  sezioni.comeLavoro,
  sezioni.contatti,
];

/** Link a una sezione della home, valido anche dalle altre pagine. */
export const linkSezione = (sezione: Sezione) => `/#${sezione.id}`;
