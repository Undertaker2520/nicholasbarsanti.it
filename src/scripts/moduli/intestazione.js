/**
 * Intestazione: ombra quando la pagina scorre ed evidenza della voce di menu
 * corrispondente alla sezione che si sta leggendo.
 */
import $ from 'jquery/slim';
import { perFotogramma } from '../utilita.js';

const CLASSE_STACCATA = 'intestazione--staccata';
const CLASSE_ATTIVO = 'menu__link--attivo';
// Una sezione diventa "corrente" quando il suo inizio supera questa frazione dello schermo.
const LINEA_LETTURA = 0.3;
const TOLLERANZA_FONDO_PX = 2;

export function avviaIntestazione() {
  const $intestazione = $('.intestazione');
  const $link = $('.menu__link');

  // id della sezione → link del menu che la raggiunge (/#chi-sono → chi-sono).
  const linkPerSezione = new Map($link.toArray().map((link) => [new URL(link.href).hash.slice(1), link]));
  // Tutte le sezioni, anche quelle senza voce di menu (apertura, "Perché"): lì nessuna voce è attiva.
  const sezioni = $('main > section').toArray();

  const aggiorna = () => {
    $intestazione.toggleClass(CLASSE_STACCATA, window.scrollY > 0);

    const corrente = sezioneCorrente(sezioni);
    $link.removeClass(CLASSE_ATTIVO);
    $(linkPerSezione.get(corrente?.id) ?? []).addClass(CLASSE_ATTIVO);
  };

  $(window).on('scroll resize', perFotogramma(aggiorna));
  aggiorna();
}

function sezioneCorrente(sezioni) {
  // In fondo alla pagina l'ultima sezione può non raggiungere la linea: è comunque quella corrente.
  const inFondo =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - TOLLERANZA_FONDO_PX;
  if (inFondo) return sezioni.at(-1);

  const linea = window.innerHeight * LINEA_LETTURA;
  return sezioni.filter((sezione) => sezione.getBoundingClientRect().top <= linea).at(-1);
}
