/**
 * security.txt (RFC 9116), generato in build dai dati in src/config.ts.
 * La scadenza è un anno dopo la build: ogni pubblicazione la rinnova.
 */
import type { APIRoute } from 'astro';
import { sito } from '../../config';

const UN_ANNO_MS = 365 * 24 * 60 * 60 * 1000;

// Formato RFC 3339 senza millisecondi, per esempio 2027-10-20T08:00:00Z.
const dataRfc3339 = (data: Date) => data.toISOString().replace(/\.\d{3}Z$/, 'Z');

export const GET: APIRoute = ({ url }) => {
  const righe = [
    `Contact: mailto:${sito.email}`,
    `Expires: ${dataRfc3339(new Date(Date.now() + UN_ANNO_MS))}`,
    'Preferred-Languages: it, en',
    `Canonical: ${new URL(url.pathname, sito.url)}`,
  ];

  return new Response(righe.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
