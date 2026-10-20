/**
 * Carosello (src/components/Carosello.astro): mostra i pallini, evidenzia quello della
 * scheda visibile durante lo scorrimento e porta alla scheda scelta con un clic.
 * Lo scorrimento e l'aggancio sono CSS (scroll-snap): qui solo la navigazione.
 */
import $ from 'jquery/slim';
import { movimentoRidotto, perFotogramma } from '../utilita.js';

const CLASSE_ATTIVO = 'carosello--attivo';
const CLASSE_PALLINO_ATTIVO = 'carosello__pallino--attivo';
const TOLLERANZA_FINE_PX = 2;

export function avviaCaroselli() {
  $('[data-carosello]').each((_, carosello) => avviaCarosello($(carosello)));
}

function avviaCarosello($carosello) {
  const elenco = $carosello.children('ul, ol').get(0);
  const voci = $(elenco).children().toArray();
  const $pallini = $carosello.find('.carosello__pallino');
  if (!elenco || voci.length < 2 || $pallini.length !== voci.length) return;

  $carosello.addClass(CLASSE_ATTIVO);
  $carosello.find('.carosello__pallini').prop('hidden', false);

  // Distanza di ogni scheda dall'inizio della fila, come valore di scrollLeft.
  const posizione = (voce) => voce.offsetLeft - voci[0].offsetLeft;

  const indiceCorrente = () => {
    const fine = elenco.scrollLeft >= elenco.scrollWidth - elenco.clientWidth - TOLLERANZA_FINE_PX;
    if (fine) return voci.length - 1;
    const distanze = voci.map((voce) => Math.abs(posizione(voce) - elenco.scrollLeft));
    return distanze.indexOf(Math.min(...distanze));
  };

  const aggiorna = () => {
    const indice = indiceCorrente();
    $pallini.removeClass(CLASSE_PALLINO_ATTIVO).removeAttr('aria-current');
    $pallini.eq(indice).addClass(CLASSE_PALLINO_ATTIVO).attr('aria-current', 'true');
  };

  $(elenco).on('scroll', perFotogramma(aggiorna));
  $(window).on('resize', perFotogramma(aggiorna));

  $pallini.on('click', function () {
    const voce = voci[Number($(this).data('indice'))];
    elenco.scrollTo({ left: posizione(voce), behavior: movimentoRidotto() ? 'auto' : 'smooth' });
  });

  aggiorna();
}
