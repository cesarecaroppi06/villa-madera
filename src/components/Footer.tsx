import { site, type Locale } from '@/config/site';
import { t } from '@/content/i18n';
import { pathFor } from '@/routes';

/** Footer provvisorio per il checkpoint 2: completato nella Fase 3. */
export function Footer({ locale }: { locale: Locale }) {
  const d = t(locale);
  return (
    <footer className="on-dark bg-tortora-profondo pb-28 pt-16 text-center text-bianco-infisso lg:pb-16">
      <div className="container-site">
        <img src="/brand/logo-stacked-light.svg" width={234} height={140} alt="Villa Madera – Porto San Giorgio" className="mx-auto h-24 w-auto" />
        <p className="mt-8 text-sm tabular">CIN {site.legal.cin}</p>
        <p className="mt-2 text-sm">
          <a className="link" href={pathFor(locale, 'privacy')}>Privacy</a>
          <span aria-hidden="true" className="mx-3">/</span>
          <a className="link" href={pathFor(locale, 'cookie')}>Cookie</a>
        </p>
        <p className="mt-6 text-sm">© 2026 {d.hero.title}</p>
      </div>
    </footer>
  );
}
