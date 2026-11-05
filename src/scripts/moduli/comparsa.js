/**
 * Comparsa degli elementi durante lo scorrimento.
 * Marcatura: `data-comparsa` su un elemento, `data-comparsa-gruppo` su un elenco
 * (i figli compaiono uno dopo l'altro). Stili in src/styles/componenti/_comparsa.scss.
 */
import $ from 'jquery/slim';
import { osservazioneDisponibile } from '../utilita.js';
import { COMPARSA } from '../variabili.js';

const sottoLoSchermo = (elemento) => elemento.getBoundingClientRect().top > window.innerHeight;

export function avviaComparsa() {
  if (!osservazioneDisponibile()) return;

  // Gli elementi già visibili al caricamento non vengono toccati: nessuno sfarfallio.
  const $elementi = $(COMPARSA.selettore).filter((_, elemento) => sottoLoSchermo(elemento));
  if (!$elementi.length) return;

  const osservatore = new IntersectionObserver(
    (voci) => voci.filter((voce) => voce.isIntersecting).forEach((voce) => mostra(voce.target)),
    { threshold: COMPARSA.sogliaVisibilita },
  );

  function mostra(elemento) {
    $(elemento).removeClass(COMPARSA.classeAttesa);
    osservatore.unobserve(elemento);
  }

  $elementi
    .addClass(COMPARSA.classeAttesa)
    .each((_, elemento) => osservatore.observe(elemento))
    // Con la tastiera il focus può arrivare prima dello scorrimento: l'elemento compare subito.
    .on('focusin', function () {
      mostra(this);
    });
}
