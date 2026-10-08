import { site, type Locale } from './config/site';
import { t } from './content/i18n';
import { pathFor, routes, type Route } from './routes';
import listing from '../data/listing.json';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export interface HeadData {
  title: string;
  description: string;
  noindex: boolean;
}

export function headData(route: Route): HeadData {
  const d = t(route.locale);
  switch (route.page) {
    case 'home':
      return { title: d.meta.homeTitle, description: d.meta.homeDescription, noindex: false };
    case 'styleguide':
      return { title: 'Sistema di design – Villa Madera', description: 'Pagina interna.', noindex: true };
    case 'privacy':
      return { title: `Privacy – ${site.shortName}`, description: d.meta.homeDescription, noindex: false };
    case 'cookie':
      return { title: `Cookie – ${site.shortName}`, description: d.meta.homeDescription, noindex: false };
    default:
      return { title: `404 – ${site.shortName}`, description: d.meta.homeDescription, noindex: true };
  }
}

function jsonLd(locale: Locale) {
  const d = t(locale);
  const data = {
    '@context': 'https://schema.org',
    '@type': 'VacationRental',
    '@id': `${site.domain}/#villa-madera`,
    name: site.name,
    description: d.meta.homeDescription,
    url: `${site.domain}${pathFor(locale, 'home')}`,
    identifier: site.legal.cin,
    image: [17, 22, 3, 1, 4, 18].map((n) => `${site.domain}/img/${String(n).padStart(2, '0')}-1080.jpg`),
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressRegion: site.address.province,
      addressCountry: site.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.address.approxGeo.lat, longitude: site.address.approxGeo.lng },
    containsPlace: {
      '@type': 'Accommodation',
      additionalType: 'EntirePlace',
      occupancy: { '@type': 'QuantitativeValue', value: listing.capienza.ospiti },
      numberOfBedrooms: listing.capienza.camere,
      numberOfBathroomsTotal: listing.capienza.bagni,
      amenityFeature: listing.comfort.categorie
        .flatMap((c) => c.voci)
        .map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
    },
    checkinTime: 'flexible',
    checkoutTime: '12:00',
    petsAllowed: listing.regole.animali,
  };
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/** Contenuto di <head> per una pagina prerenderizzata. */
export function renderHead(route: Route): string {
  const h = headData(route);
  const d = t(route.locale);
  const url = `${site.domain}${route.path}`;
  const tags = [
    `<title>${esc(h.title)}</title>`,
    `<meta name="description" content="${esc(h.description)}">`,
  ];
  if (h.noindex) {
    tags.push('<meta name="robots" content="noindex, nofollow">');
  } else {
    tags.push(`<link rel="canonical" href="${url}">`);
    const page = route.page as 'home' | 'privacy' | 'cookie';
    for (const l of site.locales) {
      tags.push(`<link rel="alternate" hreflang="${l}" href="${site.domain}${pathFor(l, page)}">`);
    }
    tags.push(`<link rel="alternate" hreflang="x-default" href="${site.domain}${pathFor('it', page)}">`);
    tags.push(
      `<meta property="og:type" content="website">`,
      `<meta property="og:site_name" content="${esc(site.name)}">`,
      `<meta property="og:title" content="${esc(h.title)}">`,
      `<meta property="og:description" content="${esc(h.description)}">`,
      `<meta property="og:url" content="${url}">`,
      `<meta property="og:locale" content="${d.meta.ogLocale}">`,
      `<meta property="og:image" content="${site.domain}/og/og.jpg">`,
      `<meta property="og:image:width" content="1200">`,
      `<meta property="og:image:height" content="630">`,
      `<meta property="og:image:alt" content="${esc(d.hero.imageAlt)}">`,
      `<meta name="twitter:card" content="summary_large_image">`,
    );
  }
  if (route.page === 'home') {
    tags.push(`<script type="application/ld+json">${jsonLd(route.locale)}</script>`);
    // L'immagine di apertura è l'elemento LCP: la si annuncia subito
    tags.push(
      `<link rel="preload" as="image" type="image/avif" imagesrcset="${[480, 768, 1080]
        .map((w) => `/img/17-${w}.avif ${w}w`)
        .join(', ')}" imagesizes="(min-width: 1024px) min(40vw, 480px), min(calc(100vw - 2rem), 44vh)" fetchpriority="high">`,
    );
  }
  return tags.join('\n    ');
}

export const allRoutes = routes;
