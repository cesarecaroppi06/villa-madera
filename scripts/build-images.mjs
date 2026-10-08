// Genera le versioni web delle foto da assets/originals/ (manifest data/photos.json).
// AVIF e WebP alle larghezze 480, 768, 1080, 1440, 1920 (mai oltre l'originale),
// più un JPEG di ripiego a 1080. Scrive src/content/images.generated.json con
// dimensioni, colore dominante e punto focale per i componenti.
// Idempotente: salta i file già presenti e più recenti dell'originale.
// Uso: npm run images
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'public', 'img');
const WIDTHS = [480, 768, 1080, 1440, 1920];
const FALLBACK = 1080;
const photos = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'photos.json'), 'utf8'));
fs.mkdirSync(OUT, { recursive: true });

const fresh = (file, src) => fs.existsSync(file) && fs.statSync(file).mtimeMs >= fs.statSync(src).mtimeMs;

const manifest = [];
for (const p of photos) {
  const src = path.join(ROOT, p.file);
  const id = String(p.id).padStart(2, '0');
  const widths = WIDTHS.filter((w) => w <= p.larghezza);
  for (const w of widths) {
    const base = sharp(src).rotate().resize({ width: w });
    const avif = path.join(OUT, `${id}-${w}.avif`);
    const webp = path.join(OUT, `${id}-${w}.webp`);
    if (!fresh(avif, src)) await base.clone().avif({ quality: 52, effort: 3 }).toFile(avif);
    if (!fresh(webp, src)) await base.clone().webp({ quality: 74 }).toFile(webp);
    if (w === FALLBACK) {
      const jpg = path.join(OUT, `${id}-${w}.jpg`);
      if (!fresh(jpg, src)) await base.clone().jpeg({ quality: 78, mozjpeg: true }).toFile(jpg);
    }
  }
  manifest.push({
    id: p.id,
    ambiente: p.ambiente,
    filtro: p.filtroGalleria,
    width: p.larghezza,
    height: p.altezza,
    widths,
    fallback: FALLBACK,
    color: p.coloreDominante,
    focal: p.puntoFocale,
    alt: p.alt,
  });
  process.stdout.write(`${id} `);
}
fs.writeFileSync(
  path.join(ROOT, 'src', 'content', 'images.generated.json'),
  JSON.stringify(manifest, null, 2) + '\n',
);
console.log(`\n${manifest.length} foto pronte in public/img/`);
