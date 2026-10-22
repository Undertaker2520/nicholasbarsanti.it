/**
 * Menu su mobile (hamburger): mostra il pulsante, chiude il menu e lo apre/chiude al clic.
 * Senza JavaScript il pulsante resta nascosto e il menu sempre visibile.
 * Il menu si chiude toccando una voce, toccando fuori dall'intestazione, con Esc (il focus
 * torna al pulsante) e quando il pulsante non si vede più (finestra allargata).
 * Stili in src/styles/componenti/_intestazione.scss.
 */
import $ from 'jquery/slim';
import { perFotogramma } from '../utilita.js';

const CLASSE_COMPATTA = 'intestazione--compatta';
const CLASSE_APERTA = 'intestazione--aperta';

export function avviaMenu() {
  const $intestazione = $('[data-intestazione]');
  const $pulsante = $intestazione.find('.menu-pulsante');
  if (!$pulsante.length) return;

  const $nav = $(`#${$pulsante.attr('aria-controls')}`);
  const aperto = () => $pulsante.attr('aria-expanded') === 'true';
  // Il pulsante è nascosto dal CSS da `medio` in su: lì il menu è sempre visibile.
  const pulsanteVisibile = () => $pulsante.is(':visible');

  const imposta = (apri) => {
    $intestazione.toggleClass(CLASSE_APERTA, apri);
    $pulsante
      .attr('aria-expanded', String(apri))
      .attr('aria-label', $pulsante.data(apri ? 'testo-chiudi' : 'testo-apri'));
  };

  $intestazione.addClass(CLASSE_COMPATTA);
  $pulsante.prop('hidden', false);
  imposta(false);

  $pulsante.on('click', () => imposta(!aperto()));
  $nav.on('click', 'a', () => imposta(false));

  $(document).on('keydown', (evento) => {
    if (evento.key === 'Escape' && aperto()) {
      imposta(false);
      $pulsante.trigger('focus');
    }
  });

  $(document).on('click', (evento) => {
    if (aperto() && !$intestazione[0].contains(evento.target)) imposta(false);
  });

  $(window).on(
    'resize',
    perFotogramma(() => {
      if (aperto() && !pulsanteVisibile()) imposta(false);
    }),
  );
}
