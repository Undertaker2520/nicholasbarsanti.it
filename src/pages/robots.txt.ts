/** robots.txt generato in build: tutto indicizzabile, con l'indirizzo della sitemap. */
import type { APIRoute } from 'astro';
import { rispostaTesto } from '../lib/risposta-testo';
import { urlAssoluto } from '../lib/url';

export const GET: APIRoute = () =>
  rispostaTesto(['User-agent: *', 'Allow: /', '', `Sitemap: ${urlAssoluto('/sitemap-index.xml')}`]);
