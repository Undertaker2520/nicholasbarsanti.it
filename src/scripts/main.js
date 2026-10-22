/**
 * JavaScript del sito: solo miglioramenti progressivi.
 * Senza JavaScript la pagina è completa; con prefers-reduced-motion niente animazioni.
 * Incluso dal layout: Astro lo raccoglie in un file esterno (CSP: script-src 'self').
 */
import $ from 'jquery/slim';
import { avviaCaroselli } from './moduli/carosello.js';
import { avviaComparsa } from './moduli/comparsa.js';
import { avviaIntestazione } from './moduli/intestazione.js';
import { avviaMenu } from './moduli/menu.js';
import { avviaModulo } from './moduli/modulo.js';
import { avviaSfondo } from './moduli/sfondo.js';
import { movimentoRidotto } from './utilita.js';

$(() => {
  avviaIntestazione();
  avviaMenu();
  avviaCaroselli();
  avviaModulo();

  if (!movimentoRidotto()) {
    avviaComparsa();
    avviaSfondo();
  }
});
