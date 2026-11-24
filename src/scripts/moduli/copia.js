/**
 * Pulsante "Copia" accanto all'email: copia l'indirizzo negli appunti e conferma con "Copiata",
 * annunciato anche ai lettori di schermo (l'elemento role="status" subito dopo il pulsante).
 * Il pulsante è nascosto nell'HTML e compare solo se il browser permette di copiare:
 * senza JavaScript resta il normale link all'email.
 */
import $ from 'jquery/slim';
import { COPIA } from '../variabili.js';

export function avviaCopia() {
  const $pulsanti = $(`[${COPIA.attributo}]`);
  if (!$pulsanti.length || !navigator.clipboard?.writeText) return;

  $pulsanti.prop('hidden', false).each(function () {
    const $pulsante = $(this);
    const $stato = $pulsante.next('[role="status"]');
    const testoOriginale = $pulsante.text();
    let attesa;

    $pulsante.on('click', async () => {
      try {
        await navigator.clipboard.writeText($pulsante.attr(COPIA.attributo));
      } catch {
        return; // permesso negato: resta il link all'email
      }

      $pulsante.text($pulsante.attr(COPIA.attributoTestoCopiato));
      $stato.text($pulsante.attr(COPIA.attributoAnnuncio));
      window.clearTimeout(attesa);
      attesa = window.setTimeout(() => {
        $pulsante.text(testoOriginale);
        $stato.text('');
      }, COPIA.ritornoMs);
    });
  });
}
