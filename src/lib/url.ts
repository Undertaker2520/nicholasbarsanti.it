import { sito } from '../config';

/** URL assoluto sul dominio del sito. */
export const urlAssoluto = (percorso: string) => new URL(percorso, sito.url).href;

/**
 * URL pubblico di una pagina. Con `build.format: 'file'` in build il percorso è quello
 * del file (/index.html, /privacy.html): qui diventa / e /privacy, come su Netlify.
 */
export const urlPagina = (percorso: string) =>
  urlAssoluto(percorso.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, ''));
