// Configurazione centrale del sito: contatti, dati legali, valutazione, Airbnb.
// Ogni valore non ancora confermato è marcato TODO ed elencato in docs/report.md.

export const site = {
  name: 'Villa Madera – Porto San Giorgio',
  shortName: 'Villa Madera',
  domain: 'https://villamadera.com',
  locales: ['it', 'en', 'de'] as const,
  defaultLocale: 'it' as const,

  host: {
    firstName: 'Silvia',
    languages: ['it', 'en'] as const,
    responseTime: { it: 'di solito entro un’ora', en: 'usually within an hour', de: 'meist innerhalb einer Stunde' },
  },

  contacts: {
    // Numero comunicato come «34768 22003»: letto come 347 682 2003.
    // TODO(host): confermare il numero e che sia attivo anche su WhatsApp.
    phoneDisplay: '+39 347 682 2003',
    phoneE164: '+393476822003',
    whatsapp: '393476822003',
    // TODO(host): confermare che questa email possa essere pubblicata come contatto dello sportello.
    email: 'silviabonfigli@libero.it',
    hours: { from: '08:00', to: '21:00' },
  },

  address: {
    // Pubblicazione autorizzata dall'host.
    // TODO(host): confermare che coincida con l'indirizzo dell'alloggio e il CAP.
    street: 'Viale della Vittoria 199',
    postalCode: '63822',
    city: 'Porto San Giorgio',
    province: 'FM',
    region: 'Marche',
    country: 'IT',
    // Coordinate offuscate da Airbnb: usate solo per la mappa di zona e il JSON-LD.
    approxGeo: { lat: 43.18558, lng: 13.79606 },
  },

  legal: {
    controller: {
      name: 'Silvia Bonfigli',
      address: 'Viale della Vittoria 199, 63822 Porto San Giorgio (FM)',
      email: 'silviabonfigli@libero.it',
    },
    cin: 'IT109033C2ASAMXFDF',
    policiesUpdated: '2026-10-08',
  },

  airbnb: {
    listingUrl: 'https://www.airbnb.it/rooms/1504104379816112982',
    reviewsUrl: 'https://www.airbnb.it/rooms/1504104379816112982/reviews',
    rating: 4.94,
    reviewCount: 17,
    superhost: true,
    ratingCheckedOn: '2026-10-08',
    // Nessuna autorizzazione scritta di Airbnb: il logo non compare.
    logoAuthorized: false,
    logoFile: null as string | null,
  },

  // Cose da non pubblicare finché l'host non le conferma.
  pending: {
    // L'annuncio segna «Acqua calda» tra le voci non disponibili: quasi certamente una svista.
    hotWater: 'TODO(host): confermare la presenza di acqua calda',
  },

  // Nessuno strumento non tecnico: il banner cookie non compare.
  analytics: null as null | { provider: string },
} as const;

export type Locale = (typeof site.locales)[number];
