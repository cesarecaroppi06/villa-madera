import { site, type Locale } from '@/config/site';
import { t, fill, formatNumber } from '@/content/i18n';
import listing from '../../data/listing.json';
import { Picture } from './Picture';

/** Apertura: testo a sinistra (7/12), facciata nella sagoma dell'arco a destra (5/12). */
export function Hero({ locale }: { locale: Locale }) {
  const d = t(locale);
  const h = d.hero;
  const { ospiti, camere, bagni } = listing.capienza;
  const stats = [fill(h.guests, { n: ospiti }), fill(h.bedrooms, { n: camere }), fill(h.bathrooms, { n: bagni }), h.garden];

  return (
    <section aria-labelledby="hero-title" className="hero-reveal pt-[72px]">
      <div className="container-site grid items-center gap-y-8 pb-section pt-6 lg:min-h-[min(860px,calc(100svh-72px))] lg:grid-cols-12 lg:gap-x-8 lg:pt-10">
        <div className="order-1 flex justify-center lg:order-2 lg:col-span-5 lg:justify-end">
          <div className="hero-arch aspect-[4/5] w-[min(100%,44svh)] bg-lino lg:w-full lg:max-w-[480px]">
            <Picture
              id={17}
              locale={locale}
              alt={h.imageAlt}
              sizes="(min-width: 1024px) min(40vw, 480px), min(calc(100vw - 2rem), 44vh)"
              cover
              priority
              maxWidth={1080}
            />
          </div>
        </div>

        <div className="order-2 lg:order-1 lg:col-span-7 lg:pr-8">
          <h1 id="hero-title" className="font-display text-display text-inchiostro">
            <span className="hero-line" style={{ ['--i' as string]: 0 }}>
              {h.title}
            </span>
          </h1>
          <p
            className="hero-line mt-5 max-w-[36ch] text-lg leading-[1.45] text-tortora-profondo"
            style={{ ['--i' as string]: 1 }}
          >
            {h.lead}
          </p>

          <div className="hero-late">
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href="#sportello" className="btn btn-primary">
                {d.cta.write}
              </a>
              <a
                href={site.airbnb.listingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link inline-flex min-h-[44px] items-center font-medium"
                aria-label={`${d.cta.airbnbShort} (${d.a11y.newTab})`}
              >
                {d.cta.airbnbShort}
              </a>
            </div>

            <hr className="rule mt-10" />
            <ul aria-label={h.statsLabel} className="mt-5 flex flex-wrap gap-y-2 font-medium text-inchiostro tabular">
              {stats.map((s, i) => (
                <li
                  key={s}
                  className={i > 0 ? 'border-l border-[color-mix(in_srgb,var(--tortora)_55%,transparent)] px-4' : 'pr-4'}
                >
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-tortora-profondo tabular">
              {fill(h.trust, {
                rating: formatNumber(locale, site.airbnb.rating),
                count: site.airbnb.reviewCount,
              })}{' '}
              <a href="#recensioni" className="link ml-1 inline-flex min-h-[44px] items-center">
                {h.trustLink}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
