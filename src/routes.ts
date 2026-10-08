import type { Locale } from './config/site';

export type PageKey = 'home' | 'privacy' | 'cookie' | 'styleguide' | 'notFound';

export interface Route {
  path: string;
  locale: Locale;
  page: PageKey;
}

const prefix: Record<Locale, string> = { it: '', en: '/en', de: '/de' };

export function pathFor(locale: Locale, page: Exclude<PageKey, 'notFound'>): string {
  const p = prefix[locale];
  if (page === 'home') return `${p}/`;
  return `${p}/${page}`;
}

/** Tutte le pagine generate in fase di build. */
export const routes: Route[] = [
  ...(['it', 'en', 'de'] as const).flatMap((locale) =>
    (['home', 'privacy', 'cookie'] as const).map((page) => ({ path: pathFor(locale, page), locale, page })),
  ),
  { path: '/styleguide', locale: 'it', page: 'styleguide' },
];

export function resolve(url: string): Route {
  const path = url.split(/[?#]/)[0]!.replace(/\/index\.html$/, '/').replace(/(.)\/$/, '$1');
  const found = routes.find((r) => r.path.replace(/(.)\/$/, '$1') === path);
  if (found) return found;
  const locale: Locale = path.startsWith('/en') ? 'en' : path.startsWith('/de') ? 'de' : 'it';
  return { path, locale, page: 'notFound' };
}
