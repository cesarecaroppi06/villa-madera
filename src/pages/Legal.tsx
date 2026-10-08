import type { Locale } from '@/config/site';

/** Segnaposto: i testi di privacy e cookie arrivano nella Fase 3. */
export function Legal({ kind }: { locale: Locale; kind: 'privacy' | 'cookie' }) {
  return (
    <section className="container-site pb-section pt-[140px]">
      <h1 className="font-display text-3xl">{kind === 'privacy' ? 'Privacy' : 'Cookie'}</h1>
    </section>
  );
}
