/**
 * Modulo di contatto:
 * - i pulsanti con `data-servizio` (schede dei servizi) preselezionano il servizio nel modulo
 *   prima di portarci la persona; senza JavaScript il link porta comunque al modulo, con
 *   "Non lo so ancora" selezionato;
 * - all'invio (solo se il browser ha già validato i campi) il pulsante mostra "Invio in corso…"
 *   e si disattiva, così un secondo clic non manda il messaggio due volte.
 */
import $ from 'jquery/slim';
import { MODULO } from '../variabili.js';

export function avviaModulo() {
  const $servizio = $(MODULO.selettoreServizio);
  if (!$servizio.length) return;

  $(document).on('click', '[data-servizio]', function () {
    const scelta = $(this).attr('data-servizio');
    const esiste = $servizio.find('option').toArray().some((opzione) => opzione.value === scelta);
    if (esiste) $servizio.val(scelta);
  });

  const $invio = $servizio.closest('form').find(`[${MODULO.attributoTestoInvio}]`);
  const testoOriginale = $invio.text();

  $servizio.closest('form').on('submit', () => {
    $invio.prop('disabled', true).text($invio.attr(MODULO.attributoTestoInvio));
  });

  // Tornando indietro alla pagina dalla cache del browser il pulsante deve essere di nuovo usabile.
  $(window).on('pageshow', (evento) => {
    if (evento.originalEvent.persisted) $invio.prop('disabled', false).text(testoOriginale);
  });
}
