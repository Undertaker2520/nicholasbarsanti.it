/** True se l'utente ha chiesto al sistema di ridurre le animazioni. */
export const movimentoRidotto = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** True se il browser supporta IntersectionObserver (tutti quelli attuali). */
export const osservazioneDisponibile = () => 'IntersectionObserver' in window;
