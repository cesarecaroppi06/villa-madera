import images from '@/content/images.generated.json';
import type { Locale } from '@/config/site';
import { cx } from '@/lib/cx';

export type ImageEntry = (typeof images)[number];
const byId = new Map<number, ImageEntry>(images.map((i) => [i.id, i]));

export function getImage(id: number): ImageEntry {
  const img = byId.get(id);
  if (!img) throw new Error(`Foto ${id} non trovata in images.generated.json`);
  return img;
}

export const srcset = (img: ImageEntry, ext: 'avif' | 'webp', max = Infinity) =>
  img.widths
    .filter((w) => w <= max)
    .map((w) => `/img/${String(img.id).padStart(2, '0')}-${w}.${ext} ${w}w`).join(', ');

interface Props {
  id: number;
  locale: Locale;
  /** Attributo sizes scritto per il riquadro in cui la foto compare. */
  sizes: string;
  alt?: string;
  className?: string;
  /** Riquadro con proporzione fissa: la foto lo riempie usando il punto focale. */
  cover?: boolean;
  priority?: boolean;
  /** Larghezza massima offerta nel srcset (per tenere leggera l'immagine LCP). */
  maxWidth?: number;
}

/** Foto della casa in AVIF/WebP con ripiego JPEG e colore dominante come segnaposto. */
export function Picture({ id, locale, sizes, alt, className, cover, priority, maxWidth }: Props) {
  const img = getImage(id);
  const nn = String(img.id).padStart(2, '0');
  return (
    <picture>
      <source type="image/avif" srcSet={srcset(img, 'avif', maxWidth)} sizes={sizes} />
      <source type="image/webp" srcSet={srcset(img, 'webp', maxWidth)} sizes={sizes} />
      <img
        src={`/img/${nn}-${img.fallback}.jpg`}
        width={img.width}
        height={img.height}
        alt={alt ?? img.alt[locale]}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        // React 18 non conosce fetchPriority in camelCase: passa l'attributo HTML
        {...(priority ? { fetchpriority: 'high' } : {})}
        className={cx('block', cover && 'h-full w-full object-cover', className)}
        style={{ backgroundColor: img.color, objectPosition: cover ? img.focal : undefined }}
      />
    </picture>
  );
}
