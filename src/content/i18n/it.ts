// Testi italiani: lingua di riferimento. en.ts e de.ts devono avere le stesse chiavi.
export const it = {
  meta: {
    htmlLang: 'it',
    ogLocale: 'it_IT',
    langName: 'Italiano',
    homeTitle: 'Villa Madera – Appartamento con giardino a Porto San Giorgio',
    homeDescription:
      'Appartamento per 6 ospiti con giardino privato al piano rialzato di una villa d’epoca, a pochi passi dal mare e dal centro di Porto San Giorgio.',
  },
  a11y: {
    skip: 'Vai al contenuto',
    mainNav: 'Navigazione principale',
    menuOpen: 'Apri il menu',
    menuClose: 'Chiudi il menu',
    langSwitch: 'Lingua del sito',
    newTab: 'si apre in una nuova scheda, sito esterno',
    quickActions: 'Azioni rapide',
    home: 'Villa Madera, torna all’inizio',
  },
  nav: {
    casa: 'La casa',
    spazi: 'Gli spazi',
    galleria: 'Galleria',
    servizi: 'Servizi',
    posizione: 'Posizione',
    recensioni: 'Recensioni',
    contatti: 'Contatti',
  },
  cta: {
    write: 'Scrivi a Silvia',
    airbnbShort: 'Vedi su Airbnb',
    airbnb: 'Apri l’annuncio su Airbnb',
  },
  hero: {
    title: 'Villa Madera',
    lead: 'Un appartamento con giardino privato al piano rialzato di una villa d’epoca, a pochi passi dal mare di Porto San Giorgio.',
    statsLabel: 'In breve',
    guests: '{n} ospiti',
    bedrooms: '{n} camere',
    bathrooms: '{n} bagni',
    garden: 'Giardino privato',
    trust: '{rating} su 5 in {count} recensioni',
    trustLink: 'Leggi le recensioni',
    imageAlt: 'La facciata in mattoni della villa, con il portale ad arco, la scalinata bianca e il giardino',
  },
} as const;

type Widen<T> = T extends string ? string : { [K in keyof T]: Widen<T[K]> };
export type Dict = Widen<typeof it>;
