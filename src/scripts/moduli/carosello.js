/**
 * Carosello (src/components/Carosello.astro): mostra pallini e pulsante pausa, evidenzia il
 * pallino della scheda visibile, porta alla scheda scelta e fa scorrere le schede da solo.
 * Lo scorrimento e l'aggancio sono CSS (scroll-snap): qui solo la navigazione.
 *
 * Scorrimento automatico (WCAG 2.2.2): c'è sempre il pulsante per fermarlo; si ferma per
 * sempre appena la persona sposta le schede (scorrimento orizzontale non fatto dal codice)
 * o usa un pallino; toccare il carosello per scorrere la pagina non lo ferma. Si sospende
 * con il mouse sopra (solo con un mouse vero), con il focus dentro, quando è fuori schermo
 * o la scheda del browser è nascosta; con prefers-reduced-motion non parte.
 */
import $ from 'jquery/slim';
import {
  movimentoRidotto,
  osservazioneDisponibile,
  perFotogramma,
  puntatorePreciso,
} from '../utilita.js';

const CLASSE_ATTIVO = 'carosello--attivo';
const CLASSE_PALLINO_ATTIVO = 'carosello__pallino--attivo';
const CLASSE_PAUSA_FERMA = 'carosello__pausa--ferma';
const INTERVALLO_MS = 1000; // ogni quanto passa alla scheda successiva (scelta di Nicholas)
// Oltre questo tempo uno scorrimento avviato dal codice si considera concluso anche senza
// l'evento scrollend (browser che non lo supportano).
const DURATA_MAX_SCORRIMENTO_MS = 900;
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
  $carosello.find('.carosello__controlli').prop('hidden', false);

  // Distanza di ogni scheda dall'inizio della fila, come valore di scrollLeft.
  const posizione = (voce) => voce.offsetLeft - voci[0].offsetLeft;

  const indiceCorrente = () => {
    const fine = elenco.scrollLeft >= elenco.scrollWidth - elenco.clientWidth - TOLLERANZA_FINE_PX;
    if (fine) return voci.length - 1;
    const distanze = voci.map((voce) => Math.abs(posizione(voce) - elenco.scrollLeft));
    return distanze.indexOf(Math.min(...distanze));
  };

  // Distingue gli scorrimenti fatti dal codice (scorrimento automatico, pallini) da quelli
  // fatti dalla persona: solo questi ultimi fermano lo scorrimento automatico.
  let scorrimentoDelCodice = false;
  let timerFineScorrimento = null;
  const fineScorrimentoDelCodice = () => {
    window.clearTimeout(timerFineScorrimento);
    scorrimentoDelCodice = false;
  };

  const vaiA = (indice) => {
    scorrimentoDelCodice = true;
    window.clearTimeout(timerFineScorrimento);
    timerFineScorrimento = window.setTimeout(fineScorrimentoDelCodice, DURATA_MAX_SCORRIMENTO_MS);
    elenco.scrollTo({ left: posizione(voci[indice]), behavior: movimentoRidotto() ? 'auto' : 'smooth' });
  };

  $(elenco).on('scrollend', fineScorrimentoDelCodice);

  const aggiornaPallini = () => {
    $pallini.removeClass(CLASSE_PALLINO_ATTIVO).removeAttr('aria-current');
    $pallini.eq(indiceCorrente()).addClass(CLASSE_PALLINO_ATTIVO).attr('aria-current', 'true');
  };

  $(elenco).on('scroll', perFotogramma(aggiornaPallini));
  $(window).on('resize', perFotogramma(aggiornaPallini));
  aggiornaPallini();

  const automatico = avviaScorrimentoAutomatico({
    $carosello,
    elenco,
    $pulsante: $carosello.find('.carosello__pausa'),
    // Dopo l'ultima scheda si riparte dalla prima.
    successiva: () => vaiA((indiceCorrente() + 1) % voci.length),
  });

  // La persona sposta le schede con il dito, il trackpad o la tastiera: prende il controllo.
  $(elenco).on('scroll', () => {
    if (!scorrimentoDelCodice) automatico.fermaPerSempre();
  });

  $pallini.on('click', function () {
    automatico.fermaPerSempre();
    vaiA(Number($(this).data('indice')));
  });
}

function avviaScorrimentoAutomatico({ $carosello, elenco, $pulsante, successiva }) {
  const nessuno = { fermaPerSempre: () => {} };
  if (movimentoRidotto()) return nessuno;

  let inPausa = false; // scelta della persona: pulsante o interazione diretta
  const sospensioni = new Set(); // motivi temporanei: 'mouse', 'focus', 'fuori-schermo', 'nascosta'
  let timer = null;

  // Solo dove le schede scorrono davvero (sotto `largo`).
  const scorribile = () => elenco.scrollWidth > elenco.clientWidth + TOLLERANZA_FINE_PX;

  const aggiorna = () => {
    const attivo = !inPausa && sospensioni.size === 0 && scorribile();
    if (attivo && !timer) timer = window.setInterval(successiva, INTERVALLO_MS);
    if (!attivo && timer) {
      window.clearInterval(timer);
      timer = null;
    }

    $pulsante
      .prop('hidden', !scorribile())
      .toggleClass(CLASSE_PAUSA_FERMA, inPausa)
      .attr('aria-label', $pulsante.data(inPausa ? 'testo-riprendi' : 'testo-pausa'));
  };

  const sospendi = (motivo, attiva) => {
    if (attiva) sospensioni.add(motivo);
    else sospensioni.delete(motivo);
    aggiorna();
  };

  const fermaPerSempre = () => {
    if (inPausa) return;
    inPausa = true;
    aggiorna();
  };

  $pulsante.on('click', () => {
    inPausa = !inPausa;
    aggiorna();
  });

  // Pausa al passaggio del mouse solo con un mouse vero: sul touch il "passaggio" simulato
  // dopo un tocco non finisce mai e terrebbe il carosello fermo.
  if (puntatorePreciso()) {
    $carosello
      .on('mouseenter', () => sospendi('mouse', true))
      .on('mouseleave', () => sospendi('mouse', false));
  }

  $carosello
    .on('focusin', () => sospendi('focus', true))
    .on('focusout', (evento) => {
      if (!$carosello[0].contains(evento.relatedTarget)) sospendi('focus', false);
    });

  $(document).on('visibilitychange', () => sospendi('nascosta', document.hidden));
  $(window).on('resize', perFotogramma(aggiorna));

  if (osservazioneDisponibile()) {
    new IntersectionObserver(([voce]) => sospendi('fuori-schermo', !voce.isIntersecting)).observe($carosello[0]);
  }

  aggiorna();
  return { fermaPerSempre };
}
