/**
 * Intestazione: ombra quando la pagina scorre ed evidenza della voce di menu
 * corrispondente alla sezione che si sta leggendo.
 */
import $ from 'jquery/slim';
import { perFotogramma } from '../utilita.js';
import { INTESTAZIONE } from '../variabili.js';

export function avviaIntestazione() {
  const $intestazione = $('.intestazione');
  const $link = $('.menu__link');

  // id della sezione → link del menu che la raggiunge (/#chi-sono → chi-sono).
  const linkPerSezione = new Map($link.toArray().map((link) => [new URL(link.href).hash.slice(1), link]));
  // Tutte le sezioni, anche quelle senza voce di menu (apertura, "Perché"): lì nessuna voce è attiva.
  const sezioni = $('main > section').toArray();

  const aggiorna = () => {
    $intestazione.toggleClass(INTESTAZIONE.classeStaccata, window.scrollY > 0);

    const corrente = sezioneCorrente(sezioni);
    $link.removeClass(INTESTAZIONE.classeLinkAttivo);
    $(linkPerSezione.get(corrente?.id) ?? []).addClass(INTESTAZIONE.classeLinkAttivo);
  };

  $(window).on('scroll resize', perFotogramma(aggiorna));
  aggiorna();
}

function sezioneCorrente(sezioni) {
  // In fondo alla pagina l'ultima sezione può non raggiungere la linea: è comunque quella corrente.
  const inFondo =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - INTESTAZIONE.tolleranzaFondoPx;
  if (inFondo) return sezioni.at(-1);

  const linea = window.innerHeight * INTESTAZIONE.lineaLettura;
  return sezioni.filter((sezione) => sezione.getBoundingClientRect().top <= linea).at(-1);
}
