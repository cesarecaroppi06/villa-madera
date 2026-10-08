# Villa Madera – Porto San Giorgio · Piano di progetto

Stato: bozza per il checkpoint 1 (8 ottobre 2026). Le decisioni aperte sono in fondo, nella sezione «Decisioni da prendere».

## 1. Obiettivi e misure di riuscita

Il sito ha tre compiti, in quest'ordine:

1. Dare alla casa un'immagine riconoscibile.
2. Far trovare in pochi secondi ciò che serve per decidere un soggiorno.
3. Portare l'ospite a Silvia (sportello) o all'annuncio Airbnb (disponibilità e prenotazione).

Ogni scelta qui sotto si misura su questi tre compiti. Soglie tecniche:

- Lighthouse mobile ≥ 95 in tutte le categorie.
- LCP < 2,0 s su 4G simulata; CLS < 0,05.
- JavaScript della home < 80 KB compressi.
- Immagine di apertura < 180 KB in AVIF.
- WCAG 2.2 AA.

Chi visita il sito: famiglie e piccoli gruppi, metà stranieri (tra le 17 recensioni: 8 in italiano, 5 in inglese, 3 in tedesco, 1 in olandese), spesso da telefono. Ne seguono tre conseguenze:

- si progetta da 360 px;
- il tedesco è un'esigenza reale;
- l'azione principale su mobile deve restare sempre a portata di pollice.

## 2. Architettura dei contenuti

Una home lunga a sezioni, perché chi valuta un soggiorno vuole scorrere tutto senza perdere il filo. Le pagine di servizio sono separate.

| Percorso | Contenuto |
|---|---|
| `/` · `/en/` · `/de/` | Home a sezioni |
| `/privacy` · `/en/privacy` · `/de/privacy` | Informativa art. 13 GDPR |
| `/cookie` · `/en/cookie` · `/de/cookie` | Cookie policy |
| `/404` | Pagina non trovata, con link alle tre lingue |
| `/styleguide` | Sistema di design (`noindex`, esclusa dalla sitemap) |

Ordine della home, motivato:

1. **Apertura**: la facciata con il portale (foto 17) è ciò che distingue la casa da qualsiasi appartamento al mare. I dati essenziali stanno subito sotto il titolo, perché sono la prima cosa che si cerca.
2. **La casa**: il «perché qui» in 150 parole, con sei caratteristiche verificate.
3. **Gli spazi**: il giro della casa ambiente per ambiente, per immaginare la disposizione.
4. **Galleria**: tutte le 29 foto, per chi vuole controllare ogni dettaglio.
5. **Servizi**: 10 in evidenza, poi tutti.
6. **Posizione**: mare, centro, come arrivare.
7. **Recensioni**: la prova sociale, dopo che l'ospite si è fatto un'idea propria.
8. **La tua host**.
9. **Da sapere**: regole e domande frequenti, comprese le informazioni scomode (doccia condivisa, ferrovia).
10. **Sportello ospiti**.
11. **Su Airbnb**.
12. **Footer**.

## 3. Sistema di design (sintesi; dettagli nella Fase 2)

- **Palette**: gli otto token del brief come variabili CSS in `src/styles/tokens.css`. Vanno ricampionati dagli originali scaricati. Dalle foto, le pareti risultano un grigio caldo appena più freddo del tortora proposto (`#bab5a9` è coerente): nella Fase 2 verifico se `--tortora` va spostato di poco, senza cambiare ruoli né contrasti.
- **Tipografia**: Marcellus per i titoli, Hanken Grotesk variabile per testi e interfaccia, entrambi via `@fontsource`. Sottoinsieme latino con `latin-ext` per il tedesco (ä, ö, ü, ß sono nel latino base; `latin-ext` serve solo se compaiono nomi con altri diacritici). Si precarica solo Marcellus.
- **Firme**: l'arco (logo e apertura) e la tenda (animazioni delle immagini). Il resto è squadrato, con raggio di 2 px.
- **Componenti**:
  - pulsante primario, secondario e link testuale;
  - campo, select, data, radio e casella di consenso;
  - pannello a comparsa (`<details>` stilizzato);
  - galleria, visore, barra mobile delle azioni, selettore di lingua a tre voci.
- **Movimento**: un'apertura orchestrata e la «tenda» sulle immagini (`clip-path` + `scale`) con `IntersectionObserver`. Con `prefers-reduced-motion: reduce` resta solo una dissolvenza di 150 ms.

## 4. Immagini

Esito dell'acquisizione:

- Il CDN restituisce dettaglio reale fino a 2560 px sul lato lungo: 2560×1920 per le orizzontali e 1920×2560 per le verticali. Per le verticali la versione da 2560 px di larghezza è un ingrandimento della 1920 e lo script la scarta.
- Le foto restano comunque scatti da smartphone, morbidi e con poca luce negli interni.
- Regola di dimensionamento del brief: larghezza mostrata ≤ larghezza del file ÷ 1,5. Quindi al massimo 1706 px CSS×DPR per le orizzontali e 1280 per le verticali. In pratica nessun riquadro supera i 720 px CSS su desktop: a DPR 2 servono fino a 1440 px reali, entro il limite.

Pipeline:

- Formati e larghezze:
  - AVIF e WebP, con ripiego JPEG;
  - larghezze 480, 768, 1080, 1440 e 1920, mai oltre l'originale;
  - `srcset`/`sizes` scritti per ogni riquadro, non generici.
- Dati presi dal manifest `data/photos.json`:
  - colore dominante per il segnaposto (già calcolato);
  - `puntoFocale` per `object-position`;
  - testi alternativi in IT/EN/DE.
- Proporzioni ammesse: 4:5 per le verticali, 3:2 per le orizzontali, più le proporzioni reali in galleria.
- Nessun ritocco, ingrandimento o generazione con l'IA.

## 5. Stack tecnico (deciso al checkpoint 1: React per Lovable)

- **React 18 + Vite 5 + TypeScript rigoroso + Tailwind 3**, lo stesso stack di un progetto Lovable: Lovable può aprire e modificare il repository, e la sua anteprima (`npm run dev`, porta 8080) mostra il sito completo.
- **Pagine statiche prerenderizzate.** `npm run build` costruisce il client, poi un bundle server, e `scripts/prerender.mjs` scrive un file HTML completo per ogni pagina e lingua (10 pagine più la 404), insieme a `sitemap.xml` e `robots.txt`. I motori di ricerca e i link condivisi ricevono HTML vero, con `hreflang`, canonical, Open Graph e JSON-LD.
- **Isole.** Nel sito pubblicato il browser non ri-renderizza la pagina: idrata solo i componenti interattivi (`src/islands.ts`: intestazione, poi galleria, visore e modulo). I testi non finiscono nel JavaScript. Oggi la home carica 52 KB compressi (46,5 di React più 5,6 dell'intestazione).
- **Ripiego.** Se la piattaforma di pubblicazione esegue solo `vite build` senza prerender, `src/main.tsx` lo rileva e renderizza l'app intera nel browser: il sito funziona lo stesso, ma perde la SEO delle pagine statiche. Va quindi verificato, alla pubblicazione, che Lovable usi `npm run build`.
- **Immagini.** `npm run images` (sharp) genera AVIF e WebP in 480–1920 px e un JPEG di ripiego a 1080 in `public/img/`, più `src/content/images.generated.json`. I file generati sono nel repository, così la build non dipende da sharp.
- **Marchio.** `scripts/build_brand.py` produce gli SVG (lettere convertite in tracciati con HarfBuzz e fontTools), mentre `npm run brand` produce le icone raster e l'immagine di condivisione.
- **Font** serviti dal sito (`public/fonts/`, sottoinsieme latino), con precaricamento del solo Marcellus.
- Nessuna libreria di animazione: CSS e `IntersectionObserver`.

## 6. Sportello ospiti e invio delle richieste

Mi hai detto che le richieste devono arrivare al telefono personale di Silvia, e non c'è un account Resend. Propongo quindi un modulo che **non passa da nessun server**:

- L'ospite compila il modulo (nome, email facoltativa per una risposta scritta, date, numero di ospiti, animali, messaggio).
- La validazione è accessibile e i messaggi d'errore sono annunciati agli screen reader.
- «Invia la richiesta su WhatsApp» apre WhatsApp con un messaggio già composto e ordinato («Richiesta per Villa Madera – arrivo 12/06/2027, partenza 19/06/2027, 4 ospiti, con animali: no…»), indirizzato al numero di Silvia. L'ospite controlla il testo e preme invio.
- Nessuna email pubblica (decisione dell'host): chi non usa WhatsApp può chiamare o mandare un SMS allo stesso numero; il modulo offre «Copia il messaggio» per incollarlo dove si preferisce.
- Stati: verifica dei campi, conferma («Abbiamo preparato il messaggio: invialo da WhatsApp. Silvia ti risponde di solito entro un'ora.»), ripiego se WhatsApp non si apre (messaggio da copiare, numero da chiamare).

Vantaggi:

- nessuna chiave, nessun costo, nessun server;
- i dati passano direttamente dall'ospite a Silvia, quindi non c'è un responsabile del trattamento per l'invio e l'informativa privacy è più semplice;
- nessuno spam da gestire, perché il messaggio parte dal telefono dell'ospite.

Limite: la richiesta non arriva «da sola»; l'ospite deve confermare l'invio dalla propria app. Lo dico chiaramente nell'interfaccia.

Il campo trappola e il controllo sul tempo di compilazione non servono più, perché non c'è un endpoint da proteggere. Se in futuro si vorrà l'invio diretto via email, l'endpoint `/api/contatti` con Resend si aggiunge senza toccare il modulo: lo predispongo come estensione documentata, non attiva.

## 7. Lingue

- Italiano predefinito alla radice, inglese in `/en/`, tedesco in `/de/`, tutti completi. Hai chiesto il tedesco «a scelta con bottone dedicato»: lo traduco per intero, così il pulsante non porta a una pagina vuota.
- Il selettore mostra IT · EN · DE con il nome completo in `aria-label` e porta alla stessa sezione nella lingua scelta.
- Nessun reindirizzamento automatico in base al browser: rispetta la scelta e la SEO. Al massimo un suggerimento discreto, che valuto in Fase 3.
- Tutti i testi stanno in `src/content/i18n/{it,en,de}.ts`, con lo stesso schema tipizzato: se manca una chiave, la build fallisce.

## 8. Dati e fonti

| File | Contenuto |
|---|---|
| `data/listing.json` | Fatti dell'annuncio, rilevati l'8/10/2026 |
| `data/reviews.json` | 17 recensioni: nome di battesimo, mese, lingua, testo |
| `data/photos.json` | Manifest delle 29 foto: dimensioni, checksum, colore dominante, punto focale, testi alternativi in tre lingue, uso consigliato, filtro di galleria |
| `src/content/schema.ts` | Schemi Zod dei tre file; la build li valida |
| `src/config/site.ts` | Contatti, dati legali, valutazione con data, URL dell'annuncio, flag `airbnb.logoAuthorized`, `TODO` marcati |

## 9. Privacy, cookie, legge

- **Impostazione**: nessun cookie, nessun tracciamento, nessuna statistica, nessun font o script di terzi. Il banner cookie quindi non compare. Il link «Preferenze cookie» nel footer porta a una pagina che spiega che non ci sono cookie da scegliere. Se un giorno si aggiunge uno strumento non tecnico, il banner conforme alle linee guida del Garante del 10/6/2021 è predisposto e si attiva da configurazione.
- **Mappa**: un'immagine statica generata in fase di build da tile OpenStreetMap, con attribuzione. La mappa interattiva si carica solo al clic, dopo un avviso.
- **Informativa privacy (art. 13)**:
  - titolare: Silvia Bonfigli;
  - dati trattati: quelli che l'ospite invia via WhatsApp, SMS o telefono;
  - basi giuridiche: misure precontrattuali e obblighi di legge;
  - destinatari: WhatsApp/Meta (scelto dall'ospite stesso) e il fornitore dell'hosting;
  - tempi di conservazione, diritti dell'interessato, reclamo al Garante.
  
  È una bozza da far validare a un consulente.
- **CIN** `IT109033C2ASAMXFDF` nel footer di ogni pagina e nella sezione «Da sapere».

## 10. SEO

- Titolo e descrizione unici per pagina e per lingua.
- `hreflang` (it, en, de, x-default) e URL canonici su `https://villamadera.com`.
- `sitemap.xml` e `robots.txt`.
- Open Graph con un'immagine dedicata 1200×630.
- JSON-LD `VacationRental` senza `aggregateRating`. Le coordinate usate sono quelle offuscate di Airbnb. L'indirizzo esatto entra solo dopo che hai confermato che Viale della Vittoria 199 è l'indirizzo della casa.

## 11. Verifica

- Screenshot di ogni sezione a 390 e 1440 px con il Chromium del container, e controllo alle altre larghezze del brief.
- Lighthouse e axe-core eseguiti in locale, con i numeri reali nel report.
- Prove a mano con Playwright:
  - menu e tastiera;
  - visore con tastiera e gesti simulati;
  - tutti gli stati del modulo;
  - cambio lingua;
  - pagina 404;
  - movimento ridotto.
- Ogni dato pubblicato viene confrontato con `data/listing.json` tramite uno script che segnala cifre e fatti non presenti nella fonte.

## 12. Fasi e checkpoint

1. **Fase 1 (acquisizione).** Fatta. Checkpoint 1: riepilogo dei dati, contact sheet, differenze rispetto al brief, decisioni qui sotto.
2. **Fase 2 (sistema di design) e apertura della home.** Checkpoint 2: `/styleguide`, logo, screenshot dell'apertura a 390 e 1440 px.
3. **Fase 3 (resto del sito, verifica, report)**, senza interruzioni.

## 13. Decisioni prese al checkpoint 1

- Stack React per Lovable; modulo via WhatsApp approvato.
- Telefono +39 347 682 2003 (anche WhatsApp); indirizzo Viale della Vittoria 199, 63822 Porto San Giorgio confermato come indirizzo della casa.
- Nessuna email sul sito.
- «Acqua calda» non disponibile è un errore della scheda Airbnb.

### Domande originali

1. **Stack e pubblicazione**: A (Astro statico + Vercel/Netlify, dominio puntato lì), B (Lovable) o C (A con dominio gestito da Lovable)?
2. **Modulo**: va bene l'invio via WhatsApp/email composto dal browser, senza server?
3. **Telefono**: confermi +39 347 682 2003, valido anche per WhatsApp e per le chiamate dalle 8:00 alle 21:00?
4. **Indirizzo**: Viale della Vittoria 199 è l'indirizzo della casa, oltre che del titolare? CAP 63822?
5. **Email pubblica**: va bene silviabonfigli@libero.it anche come contatto pubblico dello sportello?
