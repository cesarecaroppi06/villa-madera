import type { Locale } from '@/config/site';
import { Hero } from '@/components/Hero';

export function Home({ locale }: { locale: Locale }) {
  return (
    <>
      <Hero locale={locale} />
    </>
  );
}
