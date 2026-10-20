/**
 * Intestazioni HTTP del sito: unica fonte.
 * - In build, l'integrazione `intestazioni()` scrive `dist/_headers` per Netlify.
 * - In `astro preview` le stesse intestazioni sono applicate al server locale,
 *   così la CSP si verifica prima della pubblicazione.
 */
import { writeFile } from 'node:fs/promises';
import type { AstroIntegration } from 'astro';

type Intestazioni = Record<string, string>;

const SOLO_SE_STESSO = "'self'";
const NESSUNO = "'none'";

/** Content Security Policy: tutto dal proprio dominio, niente inline, niente terze parti. */
const csp: Record<string, string[]> = {
  'default-src': [SOLO_SE_STESSO],
  'img-src': [SOLO_SE_STESSO, 'data:'],
  'style-src': [SOLO_SE_STESSO],
  'script-src': [SOLO_SE_STESSO],
  'font-src': [SOLO_SE_STESSO],
  'connect-src': [NESSUNO],
  'frame-ancestors': [NESSUNO],
  'base-uri': [SOLO_SE_STESSO],
  'form-action': [NESSUNO],
  'upgrade-insecure-requests': [],
};

/**
 * Funzionalità del browser disattivate: il sito non ne usa nessuna.
 * Solo nomi riconosciuti da Chrome: quelli sconosciuti (per esempio `web-share`)
 * producono avvisi in console a ogni pagina.
 */
const funzionalitaDisattivate = [
  'accelerometer',
  'autoplay',
  'browsing-topics',
  'camera',
  'display-capture',
  'encrypted-media',
  'fullscreen',
  'geolocation',
  'gyroscope',
  'magnetometer',
  'microphone',
  'midi',
  'payment',
  'picture-in-picture',
  'publickey-credentials-get',
  'screen-wake-lock',
  'sync-xhr',
  'usb',
  'xr-spatial-tracking',
];

const serializzaCsp = (direttive: Record<string, string[]>) =>
  Object.entries(direttive)
    .map(([nome, valori]) => [nome, ...valori].join(' '))
    .join('; ');

/** Intestazioni applicate a ogni risposta. */
export const intestazioniGlobali: Intestazioni = {
  'Content-Security-Policy': serializzaCsp(csp),
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': funzionalitaDisattivate.map((f) => `${f}=()`).join(', '),
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

/** Intestazioni aggiuntive per percorsi specifici (sintassi dei percorsi di Netlify). */
const intestazioniPerPercorso: Record<string, Intestazioni> = {
  '/*': intestazioniGlobali,
  // File con hash nel nome: il contenuto non cambia mai, cache di un anno.
  '/_astro/*': { 'Cache-Control': 'public, max-age=31536000, immutable' },
};

/** Contenuto del file `_headers` di Netlify. */
export const fileHeadersNetlify = () =>
  Object.entries(intestazioniPerPercorso)
    .map(([percorso, intestazioni]) =>
      [percorso, ...Object.entries(intestazioni).map(([nome, valore]) => `  ${nome}: ${valore}`)].join(
        '\n',
      ),
    )
    .join('\n\n') + '\n';

/** Integrazione Astro: a fine build scrive `dist/_headers`. */
export const intestazioni = (): AstroIntegration => ({
  name: 'intestazioni-sicurezza',
  hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      await writeFile(new URL('_headers', dir), fileHeadersNetlify(), 'utf-8');
      logger.info('_headers scritto per Netlify');
    },
  },
});
