/**
 * Dati strutturati JSON-LD (schema.org) per la pagina principale.
 * Solo informazioni vere, dai dati del sito: nessun indirizzo stradale né telefono.
 */
import { sito, immagini } from '../config';
import { servizi } from '../data/testi';
import { urlAssoluto } from './url';

const persona = {
  '@type': 'Person',
  name: sito.nome,
  jobTitle: 'Sviluppatore web',
  email: sito.email,
};

const offerte = servizi.map((servizio) => ({
  '@type': 'Offer',
  itemOffered: {
    '@type': 'Service',
    name: servizio.titolo,
    description: servizio.descrizione,
  },
  ...(servizio.prezzoDa !== undefined && {
    priceSpecification: {
      '@type': 'PriceSpecification',
      minPrice: servizio.prezzoDa,
      priceCurrency: 'EUR',
    },
  }),
}));

export const datiStrutturati = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${sito.url}/#attivita`,
  name: sito.nome,
  description: sito.descrizione,
  url: sito.url,
  email: sito.email,
  image: urlAssoluto(immagini.anteprima.percorso),
  address: {
    '@type': 'PostalAddress',
    addressLocality: sito.localita,
    addressRegion: sito.provincia,
    addressCountry: sito.paese,
  },
  areaServed: { '@type': 'AdministrativeArea', name: sito.areaServita },
  founder: persona,
  makesOffer: offerte,
};

/**
 * Serializza per un blocco <script type="application/ld+json">.
 * `<` diventa <: nessun testo può chiudere il tag script in anticipo.
 */
export const serializzaJsonLd = (dati: object) => JSON.stringify(dati).replace(/</g, '\\u003c');
