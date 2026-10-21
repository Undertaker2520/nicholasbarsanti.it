/**
 * Carosello (src/components/Carosello.astro): mostra i pallini, evidenzia quello della
 * scheda visibile, porta alla scheda scelta e fa scorrere le schede da solo.
 * Lo scorrimento e l'aggancio (una scheda per gesto) sono CSS (scroll-snap): qui solo la navigazione.
 *
 * Scorrimento automatico: parte a ogni caricamento della pagina e si ferma per sempre appena
 * la persona interagisce con le schede, cioè le sposta (scorrimento orizzontale non fatto dal
 * codice) o usa un pallino; toccare il carosello per scorrere la pagina non lo ferma.
 * Si sospende con il mouse sopra (solo con un mouse vero), con il focus dentro, quando è
 * fuori schermo o la scheda del browser è nascosta; con prefers-reduced-motion non parte.
 * Nessun pulsante pausa (scelta di Nicholas): per WCAG 2.2.2 il modo di fermarlo è
 * l'interazione con le schede, più le sospensioni con mouse e focus.
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
const INTERVALLO_MS = 3000; // ogni quanto passa alla scheda successiva (scelta di Nicholas)
// Oltre questo tempo uno scorrimento avviato dal codice si considera concluso anche senza
// l'evento scrollend (browser che non lo supportano).
const DURATA_MAX_SCORRIMENTO_MS = 900;
const TOLLERANZA_FINE_PX = 2;
// Spostamento minimo del dito per considerare un trascinamento orizzontale delle schede.
const SOGLIA_TRASCINAMENTO_PX = 10;

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
    // Dopo l'ultima scheda si riparte dalla prima.
    successiva: () => vaiA((indiceCorrente() + 1) % voci.length),
  });

  ascoltaInterazioni(elenco, () => {
    fineScorrimentoDelCodice();
    automatico.fermaPerSempre();
  });

  // Rete di sicurezza: qualsiasi scorrimento delle schede non avviato dal codice.
  $(elenco).on('scroll', () => {
    if (!scorrimentoDelCodice) automatico.fermaPerSempre();
  });

  $pallini.on('click', function () {
    automatico.fermaPerSempre();
    vaiA(Number($(this).data('indice')));
  });
}

/**
 * Chiama `alInteragire` quando la persona sposta le schede: dito trascinato in orizzontale
 * (non verticale: quello è lo scorrimento della pagina), rotella o trackpad in orizzontale,
 * tasti premuti dentro il carosello. Ascoltatori passivi: non rallentano lo scorrimento.
 */
function ascoltaInterazioni(elenco, alInteragire) {
  const passivo = { passive: true };
  let inizioTocco = null;

  elenco.addEventListener(
    'touchstart',
    (evento) => {
      const tocco = evento.touches[0];
      inizioTocco = { x: tocco.clientX, y: tocco.clientY };
    },
    passivo,
  );

  elenco.addEventListener(
    'touchmove',
    (evento) => {
      if (!inizioTocco) return;
      const tocco = evento.touches[0];
      const dx = Math.abs(tocco.clientX - inizioTocco.x);
      const dy = Math.abs(tocco.clientY - inizioTocco.y);
      if (dx > SOGLIA_TRASCINAMENTO_PX && dx > dy) {
        inizioTocco = null;
        alInteragire();
      }
    },
    passivo,
  );

  elenco.addEventListener(
    'wheel',
    (evento) => {
      if (Math.abs(evento.deltaX) > Math.abs(evento.deltaY)) alInteragire();
    },
    passivo,
  );

  elenco.addEventListener('keydown', alInteragire);
}

function avviaScorrimentoAutomatico({ $carosello, elenco, successiva }) {
  const nessuno = { fermaPerSempre: () => {} };
  if (movimentoRidotto()) return nessuno;

  let fermato = false; // la persona ha interagito con le schede: fino al prossimo caricamento
  const sospensioni = new Set(); // motivi temporanei: 'mouse', 'focus', 'fuori-schermo', 'nascosta'
  let timer = null;

  // Solo dove le schede scorrono davvero (sotto `largo`).
  const scorribile = () => elenco.scrollWidth > elenco.clientWidth + TOLLERANZA_FINE_PX;

  const aggiorna = () => {
    const attivo = !fermato && sospensioni.size === 0 && scorribile();
    if (attivo && !timer) timer = window.setInterval(successiva, INTERVALLO_MS);
    if (!attivo && timer) {
      window.clearInterval(timer);
      timer = null;
    }
  };

  const sospendi = (motivo, attiva) => {
    if (attiva) sospensioni.add(motivo);
    else sospensioni.delete(motivo);
    aggiorna();
  };

  const fermaPerSempre = () => {
    if (fermato) return;
    fermato = true;
    aggiorna();
  };

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
