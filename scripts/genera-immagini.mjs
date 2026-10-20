/**
 * Genera in public/ favicon (SVG, ICO), apple-touch-icon e immagine di anteprima (Open Graph).
 * Uso: npm run immagini — poi verificare il risultato e fare commit dei file generati.
 *
 * Colori da src/styles/_variabili.scss, testi e percorsi da src/config.ts:
 * nessun valore è ripetuto qui.
 * Usa sharp, già installato con Astro per l'ottimizzazione delle immagini.
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import * as sass from 'sass';
import sharp from 'sharp';
import { sito, immagini } from '../src/config.ts';

const radice = new URL('../', import.meta.url);
const inPublic = (percorso) => new URL(`public${percorso}`, radice);

/** Palette chiara dal file delle variabili SCSS, come oggetto { chiave: colore }. */
function leggiColori() {
  const { css } = sass.compileString(
    '@use "variabili" as v; :root { @each $k, $c in v.$colori-chiaro { --#{$k}: #{$c}; } }',
    { loadPaths: [fileURLToPath(new URL('src/styles', radice))] },
  );
  return Object.fromEntries([...css.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2]]));
}

const escapeXml = (testo) =>
  testo.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** Iniziali "NB" disegnate come tracciati: identiche ovunque, senza dipendere dai font. */
const svgIniziali = ({ sfondo, tratto, raggio }) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
  `<rect width="64" height="64" rx="${raggio}" fill="${sfondo}"/>` +
  `<path d="M13.5 44V20l14 24V20M36.5 44V20h7a6 6 0 0 1 0 12h-7h8a6 6 0 0 1 0 12z" ` +
  `fill="none" stroke="${tratto}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>` +
  `</svg>\n`;

/** Anteprima per la condivisione: nome e ruolo su sfondo a tinta unita. */
const svgAnteprima = ({ sfondo, testo }) => {
  const { larghezza, altezza } = immagini.anteprima;
  const font = `font-family="Segoe UI, Helvetica Neue, Arial, sans-serif"`;
  const dominio = new URL(sito.url).host;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${larghezza}" height="${altezza}">` +
    `<rect width="100%" height="100%" fill="${sfondo}"/>` +
    `<text x="96" y="290" ${font} font-size="92" font-weight="700" fill="${testo}">${escapeXml(sito.nome)}</text>` +
    `<text x="96" y="370" ${font} font-size="46" fill="${testo}" fill-opacity="0.9">${escapeXml(sito.ruolo)}</text>` +
    `<text x="96" y="540" ${font} font-size="32" fill="${testo}" fill-opacity="0.75">${escapeXml(dominio)}</text>` +
    `</svg>`
  );
};

const png = (svg, lato) =>
  sharp(Buffer.from(svg), { density: 600 })
    .resize(lato, lato)
    .png({ compressionLevel: 9 })
    .toBuffer();

/** File .ico con immagini PNG incorporate (formato supportato da tutti i browser attuali). */
function ico(immaginiPng) {
  const intestazione = Buffer.alloc(6);
  intestazione.writeUInt16LE(0, 0); // riservato
  intestazione.writeUInt16LE(1, 2); // tipo: icona
  intestazione.writeUInt16LE(immaginiPng.length, 4);

  let posizione = 6 + 16 * immaginiPng.length;
  const voci = immaginiPng.map(({ lato, dati }) => {
    const voce = Buffer.alloc(16);
    voce.writeUInt8(lato % 256, 0); // 0 significa 256
    voce.writeUInt8(lato % 256, 1);
    voce.writeUInt16LE(1, 4); // piani di colore
    voce.writeUInt16LE(32, 6); // bit per pixel
    voce.writeUInt32LE(dati.length, 8);
    voce.writeUInt32LE(posizione, 12);
    posizione += dati.length;
    return voce;
  });

  return Buffer.concat([intestazione, ...voci, ...immaginiPng.map((i) => i.dati)]);
}

const colori = leggiColori();
const marchio = { sfondo: colori.accento, tratto: colori['su-accento'] };

// Favicon SVG con angoli arrotondati; apple-touch-icon a pieno riquadro (iOS arrotonda da sé).
const faviconSvg = svgIniziali({ ...marchio, raggio: 14 });
const iconaQuadrata = svgIniziali({ ...marchio, raggio: 0 });

const latiIco = [16, 32, 48];
const pngIco = await Promise.all(latiIco.map(async (lato) => ({ lato, dati: await png(faviconSvg, lato) })));

const anteprima = await sharp(Buffer.from(svgAnteprima({ sfondo: colori.accento, testo: colori['su-accento'] })))
  .png({ compressionLevel: 9, palette: true })
  .toBuffer();

const file = [
  [immagini.faviconSvg, faviconSvg],
  [immagini.faviconIco, ico(pngIco)],
  [immagini.appleTouchIcon, await png(iconaQuadrata, 180)],
  [immagini.anteprima.percorso, anteprima],
];

for (const [percorso, contenuto] of file) {
  await writeFile(inPublic(percorso), contenuto);
  console.log(`public${percorso}  ${(contenuto.length / 1024).toFixed(1)} KB`);
}
