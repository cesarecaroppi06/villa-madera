// Valida i dati acquisiti contro gli schemi di src/content/schema.ts.
// Uso: npm run check:data
import fs from 'node:fs';
import { listingSchema, photosSchema, reviewsSchema } from '../src/content/schema';

const read = (f: string) => JSON.parse(fs.readFileSync(new URL(`../data/${f}`, import.meta.url), 'utf8'));
let ok = true;
for (const [file, schema] of [
  ['listing.json', listingSchema],
  ['photos.json', photosSchema],
  ['reviews.json', reviewsSchema],
] as const) {
  const r = schema.safeParse(read(file));
  console.log(file, r.success ? 'OK' : r.error.issues);
  ok &&= r.success;
}
process.exit(ok ? 0 : 1);
