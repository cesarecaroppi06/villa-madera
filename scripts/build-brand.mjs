// Raster del marchio a partire dagli SVG di public/brand/ (vedi build_brand.py):
// apple-touch-icon, icone del manifest, favicon.ico e immagine Open Graph 1200×630.
// Uso: npm run brand
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const PUB = path.join(ROOT, 'public');
const BIANCO = '#FAF8F4';
const markPath = fs.readFileSync(path.join(PUB, 'brand', 'mark.svg'), 'utf8').match(/d="([^"]+)"/)[1];

// Simbolo centrato su fondo pieno; `pad` è il margine in proporzione al lato.
const icon = (size, bg, fg, pad) => {
  const inner = size * (1 - 2 * pad);
  const s = inner / 17; // il tracciato occupa circa 17×17 unità
  const tx = (size - 24 * s) / 2;
  const ty = (size - 24 * s) / 2 - 0.5 * s;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="100%" height="100%" fill="${bg}"/>` +
      `<g transform="translate(${tx} ${ty}) scale(${s})"><path d="${markPath}" fill="none" stroke="${fg}" stroke-width="1.6"/></g></svg>`,
  );
};

await sharp(icon(180, BIANCO, '#2F4236', 0.2)).png().toFile(path.join(PUB, 'apple-touch-icon.png'));
await sharp(icon(192, BIANCO, '#2F4236', 0.2)).png().toFile(path.join(PUB, 'icon-192.png'));
await sharp(icon(512, BIANCO, '#2F4236', 0.2)).png().toFile(path.join(PUB, 'icon-512.png'));
await sharp(icon(512, '#2F4236', BIANCO, 0.28)).png().toFile(path.join(PUB, 'icon-maskable-512.png'));
for (const s of [16, 32, 48]) await sharp(icon(s, BIANCO, '#2F4236', 0.08)).png().toFile(path.join(PUB, `fav-${s}.png`));
execFileSync('python3', [
  '-c',
  `from PIL import Image; ims=[Image.open('${PUB}/fav-%d.png'%s) for s in (16,32,48)]; ims[2].save('${PUB}/favicon.ico', sizes=[(16,16),(32,32),(48,48)], append_images=ims[:2])`,
]);
for (const s of [16, 32, 48]) fs.rmSync(path.join(PUB, `fav-${s}.png`));

fs.writeFileSync(
  path.join(PUB, 'site.webmanifest'),
  JSON.stringify(
    {
      name: 'Villa Madera – Porto San Giorgio',
      short_name: 'Villa Madera',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
      theme_color: BIANCO,
      background_color: BIANCO,
      display: 'browser',
    },
    null,
    2,
  ) + '\n',
);

// Open Graph: logo impilato a sinistra, la facciata nella sagoma dell'arco a destra.
const W = 1200, H = 630;
const archW = 400, archH = 500, archX = 700, archY = (H - archH) / 2;
const archMask = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${archW}" height="${archH}"><path d="M0 ${archW / 2}A${archW / 2} ${archW / 2} 0 0 1 ${archW} ${archW / 2}V${archH}H0Z" fill="#000"/></svg>`,
);
const photo = await sharp(path.join(ROOT, 'assets', 'originals', '17-esterni.jpg'))
  .resize(archW, archH, { fit: 'cover', position: 'centre' })
  .composite([{ input: archMask, blend: 'dest-in' }])
  .png()
  .toBuffer();
const logo = await sharp(path.join(PUB, 'brand', 'logo-stacked.svg'), { density: 300 }).resize({ height: 230 }).png().toBuffer();
const logoMeta = await sharp(logo).metadata();
fs.mkdirSync(path.join(PUB, 'og'), { recursive: true });
await sharp({ create: { width: W, height: H, channels: 3, background: BIANCO } })
  .composite([
    { input: logo, left: Math.round(350 - logoMeta.width / 2), top: Math.round((H - logoMeta.height) / 2) },
    { input: photo, left: archX, top: archY },
  ])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(path.join(PUB, 'og', 'og.jpg'));
console.log('Icone, favicon.ico, manifest e og/og.jpg generati');
