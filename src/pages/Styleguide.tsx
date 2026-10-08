import type { ReactNode } from 'react';
import {
  AlertCircle,
  Bath,
  BedDouble,
  Car,
  Clock,
  Footprints,
  KeyRound,
  MapPin,
  MessageCircle,
  MoveVertical,
  PawPrint,
  Phone,
  Plane,
  Train,
  Trees,
  Users,
  Waves,
  Wifi,
} from 'lucide-react';
import { Picture } from '@/components/Picture';
import { cx } from '@/lib/cx';

// Pagina interna (noindex): il sistema di design documentato con i componenti veri.

const colors = [
  { token: '--bianco-infisso', hex: '#FAF8F4', from: 'Porte e infissi', role: 'Fondo della pagina', sample: '#f3f4ef' },
  { token: '--lino', hex: '#ECE8DF', from: 'Tende, intonaco chiaro', role: 'Superfici alternate, campi disattivati', sample: '#dfd9cc' },
  { token: '--tortora', hex: '#8C867A', from: 'Pareti interne', role: 'Bordi dei campi; testo solo sopra i 24 px', sample: '#868173' },
  { token: '--tortora-profondo', hex: '#5F594C', from: 'Ombre delle pareti', role: 'Testo secondario; fasce scure', sample: '#5a523e' },
  { token: '--inchiostro', hex: '#25221B', from: 'Ferro battuto, ombre', role: 'Testo principale', sample: '#1c1c14' },
  { token: '--verde-persiana', hex: '#2F4236', from: 'Persiane e cancello', role: 'Unico colore d’azione', sample: '#404d2d' },
  { token: '--rovere', hex: '#A98A5C', from: 'Parquet', role: 'Filetti, icone. Mai testo', sample: '#af8f5a' },
  { token: '--mattone', hex: '#8E462F', from: 'Pilastri del cancello', role: 'Voce attiva, errori (2–3 volte per pagina)', sample: '#823623' },
];

const contrasts: Array<[string, string, string, string]> = [
  ['Inchiostro su bianco infisso', '14,96', '#25221B', '#FAF8F4'],
  ['Inchiostro su lino', '12,98', '#25221B', '#ECE8DF'],
  ['Tortora profondo su bianco infisso', '6,56', '#5F594C', '#FAF8F4'],
  ['Bianco infisso su tortora profondo', '6,56', '#FAF8F4', '#5F594C'],
  ['Bianco infisso su verde persiana', '10,14', '#FAF8F4', '#2F4236'],
  ['Verde persiana su lino', '8,79', '#2F4236', '#ECE8DF'],
  ['Mattone su bianco infisso', '6,45', '#8E462F', '#FAF8F4'],
  ['Tortora su bianco infisso (solo componenti e testo ≥ 24 px)', '3,41', '#8C867A', '#FAF8F4'],
  ['Rovere su bianco infisso (solo elementi grafici)', '3,06', '#A98A5C', '#FAF8F4'],
];

const scale = [
  ['Display, titolo principale', 'text-display font-display', 'clamp(2.75rem, 6vw, 5.25rem)'],
  ['Titolo di sezione', 'text-3xl font-display', 'step 4'],
  ['Sottotitolo', 'text-2xl font-display', 'step 3'],
  ['Titolo minore', 'text-xl font-display', 'step 2'],
  ['Introduzione', 'text-lg', 'step 1'],
  ['Corpo', 'text-base', '17 px / 1,65'],
  ['Piccolo, etichette', 'text-sm', '14 px'],
];

const icons = [
  [Users, 'Ospiti'],
  [BedDouble, 'Camere'],
  [Bath, 'Bagni'],
  [Trees, 'Giardino'],
  [Waves, 'Mare'],
  [Footprints, 'A piedi'],
  [MoveVertical, 'Soffitti alti'],
  [KeyRound, 'Self check-in'],
  [PawPrint, 'Animali'],
  [Wifi, 'Wifi'],
  [Car, 'Parcheggio'],
  [Train, 'Treno'],
  [Plane, 'Aereo'],
  [MapPin, 'Zona'],
  [Clock, 'Orari'],
  [Phone, 'Telefono'],
  [MessageCircle, 'WhatsApp'],
  [AlertCircle, 'Errore'],
] as const;

function Block({ id, title, children, note }: { id: string; title: string; note?: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-[color-mix(in_srgb,var(--tortora)_45%,transparent)] py-14">
      <h2 id={id} className="font-display text-2xl">
        {title}
      </h2>
      {note && <p className="mt-3 max-w-prose text-tortora-profondo">{note}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

function FieldDemo({
  label,
  state,
  value,
  hint,
  error,
}: {
  label: string;
  state: 'default' | 'focus' | 'error' | 'disabled' | 'filled';
  value?: string;
  hint?: string;
  error?: string;
}) {
  const id = `demo-${state}`;
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        id={id}
        className={cx('field', state === 'focus' && 'is-focus')}
        defaultValue={value}
        disabled={state === 'disabled'}
        aria-invalid={state === 'error' || undefined}
        aria-describedby={error || hint ? `${id}-msg` : undefined}
      />
      {error ? (
        <p id={`${id}-msg`} className="field-error">
          <AlertCircle size={16} strokeWidth={1.5} aria-hidden="true" className="mt-0.5 flex-none" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-msg`} className="field-hint">
          {hint}
        </p>
      ) : null}
      <p className="mt-2 text-sm text-tortora-profondo">Stato: {state}</p>
    </div>
  );
}

export function Styleguide() {
  return (
    <div className="container-site pb-section pt-[120px]">
      <h1 className="font-display text-display">Sistema di design</h1>
      <p className="mb-10 mt-5 max-w-prose text-lg text-tortora-profondo">
        Tutto viene da ciò che si vede nelle foto della casa. Due sole firme: l’arco del portale (logo e apertura) e la
        tenda di lino (il gesto delle immagini). Il resto è squadrato e silenzioso.
      </p>

      <Block
        id="sg-logo"
        title="Logo"
        note="Simbolo: l’arco del portale in un solo tratto continuo, con un cenno di gradino. Logotipo in Marcellus, località in Hanken Grotesk 500 con spaziatura aperta."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex min-h-[200px] items-center justify-center rounded border border-[color-mix(in_srgb,var(--tortora)_40%,transparent)] p-8">
            <img src="/brand/logo.svg" width={208} height={46} alt="Logo orizzontale" className="h-12 w-auto" />
          </div>
          <div className="flex min-h-[200px] items-center justify-center rounded bg-verde-persiana p-8">
            <img src="/brand/logo-light.svg" width={208} height={46} alt="Logo orizzontale, versione chiara" className="h-12 w-auto" />
          </div>
          <div className="flex min-h-[260px] items-center justify-center rounded bg-lino p-8">
            <img src="/brand/logo-stacked.svg" width={234} height={140} alt="Logo impilato" className="h-32 w-auto" />
          </div>
          <div className="flex min-h-[260px] items-center justify-center rounded bg-tortora-profondo p-8">
            <img src="/brand/logo-stacked-light.svg" width={234} height={140} alt="Logo impilato, versione chiara" className="h-32 w-auto" />
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-end gap-10">
          {[96, 48, 32, 24, 16].map((s) => (
            <figure key={s} className="text-center">
              <img src="/brand/mark.svg" width={s} height={s} alt="" style={{ width: s, height: s }} className="mx-auto" />
              <figcaption className="mt-2 text-sm text-tortora-profondo tabular">{s} px</figcaption>
            </figure>
          ))}
          <figure className="text-center">
            <img src="/favicon.svg" width={32} height={32} alt="" className="mx-auto h-8 w-8" />
            <figcaption className="mt-2 text-sm text-tortora-profondo">Favicon</figcaption>
          </figure>
          <figure className="text-center">
            <img src="/apple-touch-icon.png" width={60} height={60} alt="" className="mx-auto h-[60px] w-[60px]" />
            <figcaption className="mt-2 text-sm text-tortora-profondo">Icona app</figcaption>
          </figure>
        </div>
      </Block>

      <Block
        id="sg-colori"
        title="Colori"
        note="Ogni token accanto al campione preso dagli originali: i ruoli e i contrasti restano quelli del brief."
      >
        <ul className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {colors.map((c) => (
            <li key={c.token}>
              <div className="flex h-24 overflow-hidden rounded border border-[color-mix(in_srgb,var(--tortora)_35%,transparent)]">
                <div className="flex-[3]" style={{ background: c.hex }} />
                <div className="flex-1" style={{ background: c.sample }} title={`Campione dalle foto ${c.sample}`} />
              </div>
              <p className="mt-3 font-medium">{c.token}</p>
              <p className="text-sm text-tortora-profondo tabular">
                {c.hex}, campione {c.sample}
              </p>
              <p className="text-sm text-tortora-profondo">{c.from}</p>
              <p className="mt-1 text-sm">{c.role}</p>
            </li>
          ))}
        </ul>
        <h3 className="mt-12 font-display text-xl">Contrasti (WCAG)</h3>
        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {contrasts.map(([label, ratio, fg, bg]) => (
            <li key={label} className="flex items-center gap-4 rounded p-3" style={{ background: bg, color: fg }}>
              <span className="font-display text-xl">Aa</span>
              <span className="flex-1 text-sm">{label}</span>
              <span className="text-sm font-semibold tabular">{ratio}:1</span>
            </li>
          ))}
        </ul>
      </Block>

      <Block
        id="sg-tipo"
        title="Tipografia"
        note="Marcellus per i titoli, un solo peso, in minuscolo normale. Hanken Grotesk per testi e interfaccia (400, 500; 600 solo per pulsanti ed etichette). Scala 1,25 su mobile e 1,333 da 1024 px."
      >
        <div className="space-y-8">
          {scale.map(([name, cls, size]) => (
            <div key={name} className="grid gap-2 md:grid-cols-[220px_1fr] md:items-baseline">
              <p className="text-sm text-tortora-profondo">
                {name}
                <br />
                <span className="tabular">{size}</span>
              </p>
              <p className={cls}>Una villa d’epoca a pochi passi dal mare</p>
            </div>
          ))}
          <div className="grid gap-2 md:grid-cols-[220px_1fr]">
            <p className="text-sm text-tortora-profondo">Paragrafo, 55–72 caratteri per riga</p>
            <p className="max-w-[68ch]">
              Le stanze hanno soffitti alti tre metri e sessanta, pavimenti in rovere e finestre con tende di lino. Dal
              giardino si sente il mare, che è a pochi passi; il centro si raggiunge a piedi in cinque minuti.
            </p>
          </div>
          <div className="grid gap-2 md:grid-cols-[220px_1fr]">
            <p className="text-sm text-tortora-profondo">Numeri tabulari</p>
            <p className="tabular">6 ospiti | 3 camere | 2 bagni | check-out 12:00 | 4,94 su 5</p>
          </div>
        </div>
      </Block>

      <Block id="sg-pulsanti" title="Pulsanti e link" note="Alti 48 px, raggio 2 px, nessuna ombra. Il testo dice cosa succede.">
        <div className="space-y-6">
          {(['', 'is-hover', 'is-focus'] as const).map((s) => (
            <div key={s} className="flex flex-wrap items-center gap-6">
              <span className="w-24 text-sm text-tortora-profondo">{s ? s.replace('is-', '') : 'riposo'}</span>
              <button type="button" className={cx('btn btn-primary', s)}>
                Scrivi a Silvia
              </button>
              <button type="button" className={cx('btn btn-secondary', s)}>
                Apri l’annuncio su Airbnb
              </button>
              <a href="#sg-pulsanti" className={cx('link', s)}>
                Leggi le recensioni
              </a>
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-6">
            <span className="w-24 text-sm text-tortora-profondo">disattivato</span>
            <button type="button" className="btn btn-primary" disabled>
              Invia la richiesta
            </button>
          </div>
          <div className="on-dark flex flex-wrap items-center gap-6 rounded bg-tortora-profondo p-6 text-bianco-infisso">
            <span className="w-24 text-sm">su fondo scuro</span>
            <button type="button" className="btn btn-secondary">
              Leggi tutte le recensioni su Airbnb
            </button>
            <a href="#sg-pulsanti" className="link">
              Link testuale
            </a>
          </div>
        </div>
      </Block>

      <Block
        id="sg-campi"
        title="Campi del modulo"
        note="Etichetta sempre visibile sopra il campo; mai segnaposto al posto dell’etichetta. Campo alto 52 px, bordo tortora; in errore bordo mattone, icona e istruzione per correggere."
      >
        <div className="grid max-w-3xl gap-8 md:grid-cols-2">
          <FieldDemo label="Nome" state="default" hint="Come vuoi che Silvia ti chiami" />
          <FieldDemo label="Nome" state="focus" value="Giulia" />
          <FieldDemo label="Nome" state="filled" value="Giulia" />
          <FieldDemo label="Email" state="error" value="giulia@" error="Manca la parte dopo la @: scrivi l’indirizzo completo, per esempio nome@esempio.it." />
          <FieldDemo label="Telefono (facoltativo)" state="disabled" />
          <div>
            <label htmlFor="demo-date" className="field-label">
              Arrivo
            </label>
            <input id="demo-date" type="date" className="field" />
          </div>
          <div>
            <label htmlFor="demo-select" className="field-label">
              Ospiti
            </label>
            <select id="demo-select" className="field" defaultValue="4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </div>
          <fieldset>
            <legend className="field-label">Animali al seguito</legend>
            <div className="flex gap-6">
              <label className="choice">
                <input type="radio" name="demo-pets" defaultChecked /> No
              </label>
              <label className="choice">
                <input type="radio" name="demo-pets" /> Sì
              </label>
            </div>
          </fieldset>
          <div className="md:col-span-2">
            <label htmlFor="demo-msg" className="field-label">
              Messaggio
            </label>
            <textarea id="demo-msg" className="field" defaultValue="" />
          </div>
          <label className="choice md:col-span-2">
            <input type="checkbox" />
            <span>
              Ho letto l’<a className="link" href="/privacy">informativa privacy</a>
            </span>
          </label>
          <label className="choice md:col-span-2">
            <input type="checkbox" aria-invalid="true" />
            <span>Casella in errore</span>
          </label>
        </div>
      </Block>

      <Block id="sg-icone" title="Icone" note="Una sola famiglia (Lucide), tratto 1,5 px, colore rovere o inchiostro.">
        <ul className="grid grid-cols-3 gap-6 sm:grid-cols-6">
          {icons.map(([Icon, label]) => (
            <li key={label} className="flex flex-col items-center gap-2 text-center">
              <Icon size={28} strokeWidth={1.5} className="text-rovere" aria-hidden="true" />
              <span className="text-sm text-tortora-profondo">{label}</span>
            </li>
          ))}
        </ul>
      </Block>

      <Block
        id="sg-forme"
        title="Forme e movimento"
        note="Raggio 2 px ovunque; l’unica curva è l’arco. Le immagini si scoprono come una tenda (clip-path laterale, 700 ms, scala da 1,05 a 1). Con il movimento ridotto resta una dissolvenza di 150 ms."
      >
        <div className="grid gap-8 md:grid-cols-3">
          <figure>
            <div className="hero-arch aspect-[4/5] w-full bg-lino">
              <Picture id={22} locale="it" sizes="(min-width: 768px) 30vw, 100vw" cover />
            </div>
            <figcaption className="mt-3 text-sm text-tortora-profondo">L’arco: solo nel logo e nell’apertura</figcaption>
          </figure>
          <figure>
            <div className="tenda aspect-[4/5] rounded" data-tenda>
              <Picture id={19} locale="it" sizes="(min-width: 768px) 30vw, 100vw" cover />
            </div>
            <figcaption className="mt-3 text-sm text-tortora-profondo">La tenda: comparsa allo scorrimento (4:5)</figcaption>
          </figure>
          <figure>
            <div className="tenda aspect-[3/2] rounded" data-tenda>
              <Picture id={3} locale="it" sizes="(min-width: 768px) 30vw, 100vw" cover />
            </div>
            <figcaption className="mt-3 text-sm text-tortora-profondo">Orizzontale 3:2</figcaption>
          </figure>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded bg-bianco-infisso p-6 ring-1 ring-[color-mix(in_srgb,var(--tortora)_40%,transparent)]">Bianco infisso</div>
          <div className="rounded bg-lino p-6">Lino</div>
          <div className="on-dark rounded bg-tortora-profondo p-6 text-bianco-infisso">Fascia tortora profondo</div>
        </div>
      </Block>
    </div>
  );
}
