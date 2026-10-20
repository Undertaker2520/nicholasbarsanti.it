import { mailto } from '../config';

/**
 * Link mailto con oggetto e testo già scritti.
 * Codifica secondo RFC 6068: spazi come %20 (non "+") e a capo come CRLF.
 */
export const mailtoPrecompilato = (oggetto: string, corpo: string) =>
  `${mailto}?subject=${encodeURIComponent(oggetto)}&body=${encodeURIComponent(corpo.replace(/\n/g, '\r\n'))}`;
