import type { ReactNode } from 'react';
import type { Locale } from '@/config/site';
import type { PageKey } from '@/routes';
import { t } from '@/content/i18n';
import { Island } from '@/lib/island';
import Header from './Header';
import { Footer } from './Footer';

export function Layout({ locale, page, children }: { locale: Locale; page: PageKey; children: ReactNode }) {
  const d = t(locale);
  return (
    <>
      <a
        href="#contenuto"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-verde-persiana focus:px-4 focus:py-3 focus:text-bianco-infisso"
      >
        {d.a11y.skip}
      </a>
      <Island name="header" props={{ locale, page }}>
        <Header locale={locale} page={page} />
      </Island>
      <main id="contenuto" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <Footer locale={locale} />
    </>
  );
}
