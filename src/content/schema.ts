// Schemi dei dati acquisiti dall'annuncio (data/*.json).
// Indipendenti dal framework: Zod li valida in fase di build.
import { z } from 'zod';

const isoMonth = z.string().regex(/^\d{4}-\d{2}$/);
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const hex = z.string().regex(/^#[0-9a-f]{6}$/i);

export const ambienti = [
  'soggiorno',
  'cucina',
  'zona-pranzo',
  'camera-1',
  'camera-2',
  'camera-3',
  'bagno-1',
  'bagno-2',
  'lavanderia',
  'esterni',
  'altre',
] as const;

export const filtriGalleria = ['soggiorno', 'camere', 'bagni', 'giardino'] as const;

const testoMultilingue = z.object({ it: z.string().min(1), en: z.string().min(1), de: z.string().min(1) });

export const photoSchema = z.object({
  id: z.number().int().min(1),
  uuid: z.string().uuid(),
  airbnbImageId: z.string(),
  ambiente: z.enum(ambienti),
  ambienteAirbnb: z.string(),
  orientamento: z.enum(['orizzontale', 'verticale']),
  url: z.string().url(),
  file: z.string().regex(/^assets\/originals\/\d{2}-[a-z0-9-]+\.jpg$/),
  larghezza: z.number().int().positive(),
  altezza: z.number().int().positive(),
  sorgente: z.string().url(),
  confrontoDettaglio: z.record(z.string(), z.union([z.number(), z.string(), z.null()])),
  sha256: z.string().regex(/^[0-9a-f]{64}$/),
  byte: z.number().int().positive(),
  coloreDominante: hex,
  alt: testoMultilingue,
  usoConsigliato: z.array(z.string()),
  puntoFocale: z.string().regex(/^\d{1,3}% \d{1,3}%$/),
  filtroGalleria: z.enum(filtriGalleria),
});
export const photosSchema = z.array(photoSchema).length(29);
export type Photo = z.infer<typeof photoSchema>;

export const reviewSchema = z.object({
  nome: z.string().min(1),
  mese: isoMonth,
  lingua: z.string().length(2),
  valutazione: z.number().int().min(1).max(5),
  testo: z.string().min(1),
  traduzioneAirbnbIt: z.string().nullable(),
});
export const reviewsSchema = z.object({
  fonte: z.string().url(),
  rilevatoIl: isoDate,
  nota: z.string(),
  recensioni: z.array(reviewSchema),
});
export type Review = z.infer<typeof reviewSchema>;

const categoriaComfort = z.object({ nome: z.string(), voci: z.array(z.string()).min(1) });

export const listingSchema = z.object({
  fonte: z.object({ url: z.string().url(), rilevatoIl: isoDate, metodo: z.string() }),
  annuncio: z.object({
    id: z.string(),
    nome: z.string(),
    tipo: z.string(),
    localita: z.string(),
    provincia: z.string(),
    cin: z.string().regex(/^IT\d{6}[A-Z][A-Z0-9]{9}$/),
  }),
  capienza: z.object({ ospiti: z.number(), camere: z.number(), letti: z.number(), bagni: z.number() }),
  camere: z.array(
    z.object({
      id: z.string(),
      nome: z.string(),
      letto: z.string(),
      note: z.array(z.string()),
      dotazioni: z.array(z.string()),
    }),
  ),
  bagni: z.object({ numero: z.number(), nota: z.string() }),
  ambienti: z.array(z.string()),
  esterni: z.object({ giardino: z.string(), arredi: z.array(z.string()), notaGazebo: z.string() }),
  cucina: z.object({ dotazioni: z.array(z.string()) }),
  lavanderia: z.array(z.string()),
  particolarita: z.array(z.string()),
  posizione: z.object({
    spiaggia: z.string(),
    centro: z.string(),
    parcheggio: z.string(),
    ztl: z.boolean(),
    traffico: z.string(),
    coordinateAirbnb: z.object({ lat: z.number(), lng: z.number(), nota: z.string() }),
    indirizzo: z.string(),
    indirizzoNota: z.string(),
  }),
  daSapere: z.record(z.string(), z.string()),
  valutazione: z.object({
    media: z.number().min(0).max(5),
    recensioni: z.number().int(),
    badge: z.string(),
    dettaglio: z.record(z.string(), z.number()),
    distribuzione: z.record(z.string(), z.string()),
    rilevataIl: isoDate,
  }),
  host: z.object({
    nome: z.string(),
    superhost: z.boolean(),
    anniDaHost: z.number(),
    recensioniTotaliHost: z.number(),
    valutazioneMediaHost: z.number(),
    tassoRisposta: z.string(),
    tempoRisposta: z.string(),
    lingue: z.array(z.string()),
    linguePerFonte: z.string(),
    datiPersonaliAnnuncio: z.object({ studi: z.string(), lavoro: z.string(), pubblicabili: z.boolean() }),
  }),
  regole: z.object({
    checkIn: z.string(),
    checkOut: z.string(),
    maxOspiti: z.number(),
    animali: z.boolean(),
    silenzio: z.string(),
    festeEventi: z.boolean(),
    fumo: z.boolean(),
    fotografiaPubblicitaria: z.boolean(),
    primaDellaPartenza: z.array(z.string()),
  }),
  sicurezza: z.object({
    rilevatoreMonossido: z.boolean(),
    estintore: z.boolean(),
    kitPrimoSoccorso: z.boolean(),
    rilevatoreFumo: z.boolean(),
    notaFumo: z.string(),
  }),
  comfort: z.object({
    etichettaAirbnb: z.string(),
    conteggioVoci: z.number().int(),
    notaConteggio: z.string(),
    categorie: z.array(categoriaComfort),
    nonDisponibili: z.array(z.string()),
    notaNonDisponibili: z.string(),
  }),
});
export type Listing = z.infer<typeof listingSchema>;
