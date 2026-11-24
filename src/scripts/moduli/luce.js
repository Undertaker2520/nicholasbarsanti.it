/**
 * Luce che segue il mouse: sugli elementi con `data-luce` (domande frequenti, modulo) scrive
 * la posizione del puntatore in --luce-x e --luce-y; il bordo e il riflesso li disegna il CSS
 * (mixin `luce-puntatore` in src/styles/_strumenti.scss). Variabili scritte tramite CSSOM,
 * che la CSP (style-src 'self') consente. Solo con mouse o trackpad.
 */
import $ from 'jquery/slim';
import { perFotogramma, puntatorePreciso } from '../utilita.js';
import { LUCE } from '../variabili.js';

export function avviaLuce() {
  if (!puntatorePreciso()) return;

  let elemento = null;
  let x = 0;
  let y = 0;

  const applica = perFotogramma(() => {
    $(elemento).css({ [LUCE.proprietaX]: `${x}px`, [LUCE.proprietaY]: `${y}px` });
  });

  $(document).on('mousemove', LUCE.selettore, function (evento) {
    const rettangolo = this.getBoundingClientRect();
    elemento = this;
    x = Math.round(evento.clientX - rettangolo.left);
    y = Math.round(evento.clientY - rettangolo.top);
    applica();
  });
}
