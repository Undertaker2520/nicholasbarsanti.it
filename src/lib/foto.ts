/**
 * Foto di Nicholas, facoltativa: se src/assets/nicholas.jpg non esiste è `undefined`
 * e i componenti mostrano un segnaposto (Foto.astro, Costruzione.astro).
 */
import type { ImageMetadata } from 'astro';

const trovate = import.meta.glob<{ default: ImageMetadata }>('../assets/nicholas.jpg', {
  eager: true,
});

export const foto: ImageMetadata | undefined = Object.values(trovate)[0]?.default;

/** Qualità più alta del predefinito (circa 50): capelli e tessuti restano definiti. */
export const QUALITA_FOTO = 80;
