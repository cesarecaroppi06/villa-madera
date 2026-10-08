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
    // Confermato dall'host l'8/10/2026, valido anche per WhatsApp.
    // Nessuna email pubblica: su richiesta dell'host l'indirizzo email non compare sul sito.
    phoneDisplay: '+39 347 682 2003',
    phoneE164: '+393476822003',
    whatsapp: '393476822003',
    hours: { from: '08:00', to: '21:00' },
  },

  address: {
    // Indirizzo dell'alloggio, pubblicazione autorizzata e confermata dall'host.
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
      // Contatto per l'esercizio dei diritti: telefono e WhatsApp (nessuna email pubblica).
      phone: '+39 347 682 2003',
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

  // Nessuno strumento non tecnico: il banner cookie non compare.
  analytics: null as null | { provider: string },
} as const;

export type Locale = (typeof site.locales)[number];
