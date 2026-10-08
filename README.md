# Villa Madera – Porto San Giorgio

Sito vetrina dell'appartamento «In Villa Madera» a Porto San Giorgio (FM).
React 18 + Vite 5 + TypeScript + Tailwind 3 (stack compatibile con Lovable), pagine prerenderizzate in HTML statico in italiano, inglese e tedesco.

Documenti: `docs/piano.md` (architettura e scelte), `docs/fase1-riepilogo.md` (acquisizione dei dati).

## Avvio

```bash
npm install
npm run dev          # http://localhost:8080 (anche anteprima Lovable)
npm run build        # dist/: client + prerender di tutte le pagine, sitemap, robots
npm run preview      # serve dist/
npm run typecheck && npm run lint
```

## Dati, foto e marchio

```bash
pip install httpx pillow fonttools brotli uharfbuzz
python3 scripts/download_photos.py   # scarica/verifica le 29 foto in assets/originals/
python3 scripts/contact_sheet.py     # docs/contact-sheet.jpg, checksum, colore dominante
npm run images                       # versioni web in public/img/ + src/content/images.generated.json
python3 scripts/build_brand.py       # SVG del logo in public/brand/
npm run brand                        # icone, favicon.ico, manifest, public/og/og.jpg
npm run check:data                   # valida data/*.json
```

Contatti, valutazione Airbnb (con data di rilevazione) e dati legali si aggiornano in un punto solo: `src/config/site.ts`.
