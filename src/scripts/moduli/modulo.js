/**
 * Modulo di contatto: i pulsanti con `data-servizio` (schede dei servizi) preselezionano
 * il servizio nel modulo prima di portarci la persona. Senza JavaScript il link porta
 * comunque al modulo, con "Non lo so ancora" selezionato.
 */
import $ from 'jquery/slim';

export function avviaModulo() {
  const $servizio = $('#modulo-servizio');
  if (!$servizio.length) return;

  $(document).on('click', '[data-servizio]', function () {
    const scelta = $(this).attr('data-servizio');
    const esiste = $servizio.find('option').toArray().some((opzione) => opzione.value === scelta);
    if (esiste) $servizio.val(scelta);
  });
}
