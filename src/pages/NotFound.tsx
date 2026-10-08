import type { Locale } from '@/config/site';
import { pathFor } from '@/routes';

const copy = {
  it: { title: 'Questa pagina non c’è', text: 'Il link potrebbe essere sbagliato o la pagina è stata spostata.', back: 'Torna alla pagina iniziale' },
  en: { title: 'This page doesn’t exist', text: 'The link may be wrong, or the page has moved.', back: 'Back to the home page' },
  de: { title: 'Diese Seite gibt es nicht', text: 'Der Link ist vielleicht falsch oder die Seite wurde verschoben.', back: 'Zur Startseite' },
};

export function NotFound({ locale }: { locale: Locale }) {
  return (
    <section className="container-site pb-section pt-[160px] text-center">
      <h1 className="font-display text-display">{copy[locale].title}</h1>
      <p className="mx-auto mt-6 max-w-prose text-lg text-tortora-profondo">{copy[locale].text}</p>
      <ul className="mt-10 flex flex-wrap justify-center gap-6">
        {(['it', 'en', 'de'] as const).map((l) => (
          <li key={l}>
            <a href={pathFor(l, 'home')} lang={l} className={l === locale ? 'btn btn-primary' : 'link inline-flex min-h-[48px] items-center'}>
              {copy[l].back}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
