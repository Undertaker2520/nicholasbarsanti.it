/**
 * JavaScript del sito: solo miglioramenti progressivi.
 * Senza JavaScript la pagina è completa; con prefers-reduced-motion niente animazioni.
 * Incluso dal layout: Astro lo raccoglie in un file esterno (CSP: script-src 'self').
 */
import $ from 'jquery/slim';
import { avviaComparsa } from './moduli/comparsa.js';
import { avviaIntestazione } from './moduli/intestazione.js';
import { movimentoRidotto } from './utilita.js';

$(() => {
  avviaIntestazione();

  if (!movimentoRidotto()) {
    avviaComparsa();
  }
});
