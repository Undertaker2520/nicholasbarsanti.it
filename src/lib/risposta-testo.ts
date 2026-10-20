/** Risposta in testo semplice UTF-8, una riga per elemento, per gli endpoint .txt. */
export const rispostaTesto = (righe: readonly string[]) =>
  new Response(righe.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
