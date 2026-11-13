/**
 * Portatile "Dal progetto al sito online" (src/components/Costruzione.astro).
 * La scena resta ferma (CSS sticky) mentre si scorre:
 * - mentre la scena entra nello schermo il coperchio si apre (--apertura da 0 a 1);
 * - mentre la scena è ferma la pagina sullo schermo si costruisce una fase per volta
 *   (`data-fase` da 1 al numero di fasi; 0 finché il coperchio non è aperto).
 * Avviato solo senza prefers-reduced-motion: altrimenti resta il risultato finale, statico.
 * Le variabili sono scritte tramite CSSOM, che la CSP (style-src 'self') consente.
 */
import $ from 'jquery/slim';
import { perFotogramma } from '../utilita.js';
import { COSTRUZIONE } from '../variabili.js';

const limita = (valore) => Math.min(1, Math.max(0, valore));

/** Fase da mostrare: 0 a coperchio non del tutto aperto, poi da 1 a `fasi` lungo la corsa. */
export const faseCorrente = (apertura, avanzamento, fasi) =>
  apertura < 1 ? 0 : Math.min(fasi, 1 + Math.floor(avanzamento * fasi));

export function avviaCostruzione() {
  const $costruzione = $(COSTRUZIONE.selettore);
  if (!$costruzione.length) return;

  const scena = $costruzione.find('.costruzione__scena')[0];
  const palco = $costruzione.find('.costruzione__palco')[0];
  const fasi = $costruzione.find('.costruzione__fase').length;

  $costruzione.addClass(COSTRUZIONE.classeAnimata);

  const aggiorna = () => {
    const rettScena = scena.getBoundingClientRect();
    const rettPalco = palco.getBoundingClientRect();
    // Dove si ferma il palco (sotto l'intestazione fissa, se c'è): letto dal CSS.
    const fermata = parseFloat(getComputedStyle(palco).top) || 0;

    // Coperchio: dal bordo inferiore dello schermo fino al punto in cui la scena si ferma.
    const apertura = limita((window.innerHeight - rettScena.top) / (window.innerHeight - fermata));
    // Fasi: lungo il tratto in cui il palco resta fermo dentro la scena.
    const corsa = rettScena.height - rettPalco.height;
    const avanzamento = corsa > 0 ? limita((rettPalco.top - rettScena.top) / corsa) : 1;

    $costruzione
      .css(COSTRUZIONE.proprietaApertura, apertura.toFixed(3))
      .attr(COSTRUZIONE.attributoFase, faseCorrente(apertura, avanzamento, fasi));
  };

  $(window).on('scroll resize', perFotogramma(aggiorna));
  aggiorna();
}
