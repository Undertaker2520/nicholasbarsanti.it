/**
 * Sfondo decorativo: le macchie seguono leggermente il mouse.
 * Imposta --sfondo-x e --sfondo-y (da -1 a 1, 0 al centro dello schermo) su `.sfondo`;
 * ampiezza, direzione e ritardo del movimento sono nel CSS (src/styles/componenti/_sfondo.scss).
 * Le variabili sono scritte tramite CSSOM, che la CSP (style-src 'self') consente.
 */
import $ from 'jquery/slim';
import { perFotogramma, puntatorePreciso } from '../utilita.js';

/** Da coordinata in pixel a valore tra -1 e 1 rispetto al centro della finestra. */
const normalizza = (posizione, dimensione) => (posizione / dimensione) * 2 - 1;

export function avviaSfondo() {
  // Su touch non c'è un puntatore da seguire.
  if (!puntatorePreciso()) return;

  const $sfondo = $('.sfondo');
  if (!$sfondo.length) return;

  let x = 0;
  let y = 0;

  const applica = perFotogramma(() => {
    $sfondo.css({ '--sfondo-x': x.toFixed(3), '--sfondo-y': y.toFixed(3) });
  });

  $(document).on('mousemove', (evento) => {
    x = normalizza(evento.clientX, window.innerWidth);
    y = normalizza(evento.clientY, window.innerHeight);
    applica();
  });

  // Quando il mouse esce dalla finestra le macchie tornano a riposo.
  $(document.documentElement).on('mouseleave', () => {
    x = 0;
    y = 0;
    applica();
  });
}
