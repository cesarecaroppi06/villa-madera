// Prerender: trasforma l'app in pagine HTML statiche, una per percorso e lingua.
// Eseguito da `npm run build` dopo la build del client (dist/) e del server (dist-ssr/).
// Scrive anche 404.html, sitemap.xml e robots.txt.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIST = path.join(ROOT, 'dist');
const SSR = path.join(ROOT, 'dist-ssr', 'entry-server.js');
const DOMAIN = 'https://villamadera.com';

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const { render, allRoutes } = await import(pathToFileURL(SSR).href);

function page(url) {
  const { html, head, lang } = render(url);
  return template
    .replace('<html lang="it">', `<html lang="${lang}">`)
    .replace('<!--app-head-->', head)
    .replace('<div id="root"><!--app-html--></div>', `<div id="root" data-prerendered>${html}</div>`);
}

function write(rel, content) {
  const file = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

for (const r of allRoutes) {
  const html = page(r.path);
  if (r.path.endsWith('/')) {
    write(path.join(r.path, 'index.html'), html);
  } else {
    // Sia /privacy.html sia /privacy/index.html: funziona con o senza «clean URLs».
    write(`${r.path}.html`, html);
    write(path.join(r.path, 'index.html'), html);
  }
  console.log('  ', r.path);
}
write('404.html', page('/404'));

const today = new Date().toISOString().slice(0, 10);
const indexable = allRoutes.filter((r) => r.page !== 'styleguide');
const alt = (page) =>
  ['it', 'en', 'de']
    .map((l) => {
      const p = allRoutes.find((r) => r.locale === l && r.page === page);
      return `    <xhtml:link rel="alternate" hreflang="${l}" href="${DOMAIN}${p.path}"/>`;
    })
    .join('\n');
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${indexable
  .map(
    (r) => `  <url>
    <loc>${DOMAIN}${r.path}</loc>
    <lastmod>${today}</lastmod>
${alt(r.page)}
  </url>`,
  )
  .join('\n')}
</urlset>
`,
);
write('robots.txt', `User-agent: *\nDisallow: /styleguide\n\nSitemap: ${DOMAIN}/sitemap.xml\n`);
fs.rmSync(path.join(ROOT, 'dist-ssr'), { recursive: true, force: true });
console.log(`Prerender completato: ${allRoutes.length} pagine + 404, sitemap e robots.`);
