import { useCallback, useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { site, type Locale } from '@/config/site';
import { t } from '@/content/i18n';
import { pathFor, type PageKey } from '@/routes';
import { cx } from '@/lib/cx';

export const SECTIONS = [
  ['casa', 'casa'],
  ['spazi', 'spazi'],
  ['galleria', 'galleria'],
  ['servizi', 'servizi'],
  ['posizione', 'posizione'],
  ['recensioni', 'recensioni'],
  ['contatti', 'sportello'],
] as const;

export interface HeaderProps {
  locale: Locale;
  page: Exclude<PageKey, 'notFound'> | 'notFound';
}

const LOCALES: Locale[] = ['it', 'en', 'de'];

/**
 * Barra di navigazione (isola). Alta 72 px, si compatta a 56 dopo 80 px di
 * scorrimento, si nasconde scendendo e riappare risalendo. Sotto i 1024 px:
 * menu a tutto schermo e barra fissa in basso con le due azioni principali.
 */
export default function Header({ locale, page }: HeaderProps) {
  const d = t(locale);
  const isHome = page === 'home';
  const homePath = pathFor(locale, 'home');
  const href = (id: string) => (isHome ? `#${id}` : `${homePath}#${id}`);

  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [contactVisible, setContactVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Compattazione e comparsa in base alla direzione dello scorrimento
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      setCompact(y > 80);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 240);
        last = y;
      }
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Voce attiva: la sezione che occupa la fascia centrale dello schermo
  useEffect(() => {
    if (!isHome) return;
    const els = SECTIONS.map(([, id]) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    const contact = document.getElementById('sportello');
    const io2 = new IntersectionObserver(([e]) => setContactVisible(!!e?.isIntersecting), { threshold: 0.05 });
    if (contact) io2.observe(contact);
    const top = () => window.scrollY < 200 && setActive(null);
    window.addEventListener('scroll', top, { passive: true });
    return () => {
      io.disconnect();
      io2.disconnect();
      window.removeEventListener('scroll', top);
    };
  }, [isHome]);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Menu mobile: focus intrappolato, Esc chiude, scorrimento della pagina bloccato
  useEffect(() => {
    if (!open) return;
    const root = menuRef.current;
    const focusables = () =>
      Array.from(root?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'Tab') {
        const f = focusables();
        const first = f[0];
        const last = f[f.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  // Il cambio lingua porta alla stessa sezione nella nuova lingua
  const keepHash = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.hash) e.currentTarget.href += window.location.hash;
  };

  const langPage = page === 'notFound' || page === 'styleguide' ? 'home' : page;

  const LangSwitch = ({ big }: { big?: boolean }) => (
    <nav aria-label={d.a11y.langSwitch}>
      <ul className={cx('flex', big ? 'gap-6' : 'gap-0')}>
        {LOCALES.map((l) => {
          const current = l === locale;
          return (
            <li key={l}>
              <a
                href={pathFor(l, langPage)}
                hrefLang={l}
                lang={l}
                onClick={keepHash}
                aria-current={current ? 'true' : undefined}
                aria-label={t(l).meta.langName}
                className={cx(
                  'inline-flex min-h-[44px] min-w-[36px] items-center justify-center rounded text-sm font-medium uppercase tabular',
                  current ? 'text-inchiostro' : 'text-tortora-profondo hover:text-inchiostro',
                )}
              >
                <span className={cx('border-b pb-0.5', current ? 'border-mattone' : 'border-transparent')}>{l}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      <header
        className={cx(
          'fixed inset-x-0 top-0 z-40 bg-bianco-infisso transition-[transform,height,border-color] duration-ui ease-tenda',
          compact ? 'h-[56px] border-b border-[color-mix(in_srgb,var(--tortora)_40%,transparent)]' : 'h-[72px] border-b border-transparent',
          hidden && !open && 'motion-safe:-translate-y-full',
        )}
      >
        <div className="container-site flex h-full items-center justify-between gap-4">
          <a href={homePath} className="flex shrink-0 items-center rounded" aria-label={d.a11y.home}>
            {/* Tra 1024 e 1279 px resta solo il simbolo, per far posto alle voci */}
            <img
              src="/brand/logo.svg"
              width={208}
              height={46}
              alt=""
              className={cx('w-auto transition-[height] duration-ui ease-tenda lg:hidden xl:block', compact ? 'h-9' : 'h-11')}
            />
            <img
              src="/brand/mark.svg"
              width={24}
              height={24}
              alt=""
              className={cx('hidden w-auto lg:block xl:hidden', compact ? 'h-9' : 'h-10')}
            />
          </a>

          <nav aria-label={d.a11y.mainNav} className="hidden lg:block">
            <ul className="flex items-center xl:gap-2">
              {SECTIONS.map(([key, id]) => {
                const current = active === id;
                return (
                  <li key={id}>
                    <a
                      href={href(id)}
                      aria-current={current ? 'location' : undefined}
                      className="relative inline-flex min-h-[44px] items-center whitespace-nowrap rounded px-2 text-[0.9375rem] lg:px-1.5 xl:px-2 font-medium text-inchiostro hover:text-verde-persiana"
                    >
                      {d.nav[key]}
                      <span
                        aria-hidden="true"
                        className={cx(
                          'absolute inset-x-1.5 bottom-2 h-px xl:inset-x-2 bg-mattone transition-transform duration-ui ease-tenda',
                          current ? 'scale-x-100' : 'scale-x-0',
                        )}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden items-center gap-2 lg:flex xl:gap-3">
            <LangSwitch />
            <a href={href('sportello')} className="btn btn-primary">
              {d.cta.write}
            </a>
          </div>

          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded text-inchiostro lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen(true)}
          >
            <Menu size={26} strokeWidth={1.5} aria-hidden="true" />
            <span className="sr-only">{d.a11y.menuOpen}</span>
          </button>
        </div>
      </header>

      {/* Menu a tutto schermo sotto i 1024 px */}
      <div
        id="menu-mobile"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label={d.a11y.mainNav}
        hidden={!open}
        className="fixed inset-0 z-50 overflow-y-auto bg-bianco-infisso lg:hidden"
      >
        <div className="container-site flex min-h-full flex-col pb-10">
          <div className="flex h-[72px] items-center justify-between">
            <img src="/brand/logo.svg" width={208} height={46} alt="" className="h-11 w-auto" />
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded"
              onClick={close}
            >
              <X size={26} strokeWidth={1.5} aria-hidden="true" />
              <span className="sr-only">{d.a11y.menuClose}</span>
            </button>
          </div>
          <nav aria-label={d.a11y.mainNav} className="mt-6">
            <ul className="space-y-1">
              {SECTIONS.map(([key, id]) => (
                <li key={id}>
                  <a
                    href={href(id)}
                    onClick={() => setOpen(false)}
                    className="block py-2 font-display text-2xl text-inchiostro"
                  >
                    {d.nav[key]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto space-y-6 pt-10">
            <LangSwitch big />
            <a href={href('sportello')} onClick={() => setOpen(false)} className="btn btn-primary w-full">
              {d.cta.write}
            </a>
          </div>
        </div>
      </div>

      {/* Barra delle azioni su mobile: scompare quando lo sportello è a schermo */}
      <div
        aria-label={d.a11y.quickActions}
        role="region"
        aria-hidden={contactVisible || open ? true : undefined}
        {...(contactVisible || open ? { inert: '' } : {})}
        className={cx(
          'fixed inset-x-0 bottom-0 z-30 border-t border-[color-mix(in_srgb,var(--tortora)_40%,transparent)] bg-bianco-infisso px-gutter pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 transition-transform duration-ui ease-tenda lg:hidden',
          contactVisible || open ? 'translate-y-full' : 'translate-y-0',
        )}
      >
        <div className="grid grid-cols-2 gap-3">
          <a href={href('sportello')} className="btn btn-primary px-3">
            {d.cta.write}
          </a>
          <a
            href={site.airbnb.listingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary px-3"
            aria-label={`${d.cta.airbnbShort} (${d.a11y.newTab})`}
          >
            {d.cta.airbnbShort}
          </a>
        </div>
      </div>
    </>
  );
}
