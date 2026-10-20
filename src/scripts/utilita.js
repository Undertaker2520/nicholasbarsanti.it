/** True se l'utente ha chiesto al sistema di ridurre le animazioni. */
export const movimentoRidotto = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** True con un puntatore preciso (mouse, trackpad); false su touch. */
export const puntatorePreciso = () => window.matchMedia('(pointer: fine)').matches;

/** True se il browser supporta IntersectionObserver (tutti quelli attuali). */
export const osservazioneDisponibile = () => 'IntersectionObserver' in window;

/**
 * Restituisce una funzione che esegue `azione` al massimo una volta per fotogramma,
 * per gestori di eventi frequenti (scroll, mousemove).
 */
export function perFotogramma(azione) {
  let inCoda = false;

  return () => {
    if (inCoda) return;
    inCoda = true;
    window.requestAnimationFrame(() => {
      inCoda = false;
      azione();
    });
  };
}
