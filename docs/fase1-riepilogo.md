# Fase 1 · Riepilogo dell'acquisizione (8 ottobre 2026)

## Come sono stati raccolti i dati

Claude in Chrome non è disponibile in questa sessione cloud. Al suo posto ho usato Playwright con il Chromium del container, alle stesse regole del brief:

- solo questo annuncio, una pagina per volta, con pause di 1–2 secondi;
- cookie «Solo quelli necessari»;
- nessun login, CAPTCHA o blocco incontrato.

Viste lette:

- annuncio;
- `/amenities`, `/house-rules`, `/reviews`, `/location`, `/safety`;
- tour fotografico.

I dati del tour fotografico (ordine, ambiente, orientamento) li ho letti dai dati strutturati della pagina, che sono più affidabili dello scorrimento del dialog.

| File | Contenuto |
|---|---|
| `data/listing.json` | Tutti i fatti dell'annuncio, con note sulle fonti |
| `data/reviews.json` | 17 recensioni: nome di battesimo, mese, lingua, voto, testo originale, traduzione Airbnb |
| `data/photos.json` | 29 foto: UUID, ambiente, dimensioni reali, SHA-256, colore dominante, punto focale, testi alternativi IT/EN/DE, uso consigliato, filtro della galleria |
| `assets/originals/NN-ambiente.jpg` | Le 29 foto alla massima risoluzione con dettaglio reale |
| `docs/contact-sheet.jpg` | Contact sheet numerato |
| `scripts/download_photos.py` | Download idempotente con confronto di nitidezza |
| `scripts/contact_sheet.py` | Contact sheet, verifica del numero di foto e dei checksum, colore dominante |
| `src/content/schema.ts` | Schemi Zod; i tre file JSON li rispettano |

## Dati confermati (uguali al brief)

- Nome, tipo, capienza (6 ospiti, 3 camere, 3 letti, 2 bagni) e disposizione dei letti.
- Doccia unica tra i due bagni, giardino esclusivo, lavanderia, soffitti a 3,60 m.
- Posizione: spiaggia a pochi metri, centro a 5 minuti a piedi, parcheggio libero, nessuna ZTL. La ferrovia è vicina, con buon isolamento acustico.
- Valutazione 4,94 su 17 recensioni, «Amato dagli ospiti». Silvia è Superhost da 4 anni, con risposta al 100% entro un'ora.
- Regole e orari:
  - check-in flessibile con smart lock;
  - check-out entro le 12:00;
  - silenzio 23–07;
  - niente feste e niente fumo;
  - niente fotografia pubblicitaria;
  - animali ammessi.
- CIN `IT109033C2ASAMXFDF` e coordinate approssimative 43.18558, 13.79606.

## Differenze rispetto al brief

1. **Risoluzione delle foto, migliore del previsto.** Il CDN restituisce dettaglio reale fino a 2560×1920 per le orizzontali e 1920×2560 per le verticali. Il brief parlava di 1200–1920 px di larghezza. La versione verticale a 2560 px di larghezza è solo un ingrandimento della 1920 e lo script la scarta: la misura del dettaglio è nel manifest, campo `confrontoDettaglio`.
2. **Ordine delle foto 20–24.** Sulla pagina l'ordine è:
   - 20 tavolo sotto il gazebo (`f59211ed`, orizzontale);
   - 21 variante del giardino (`8aee3bf7`);
   - 22 portale;
   - 23 scalinata e giardino fiorito (`ef833dec`);
   - 24 cancello (`44c11246`).
   
   Vale l'ordine della pagina. Le foto che il brief cita per numero (3, 17, 22) non cambiano.
3. **«Altre» si chiama «Foto aggiuntive»** su Airbnb. Nel manifest ho mantenuto il codice `altre`.
4. **La foto 3 mostra anche la cucina.** Oltre al tavolo tondo si vedono i mobili bianchi, il piano cottura e il forno. Quindi la cucina è documentata, anche se non in una vista frontale.
5. **Foto 1: il divano è grigio con cuscini rosa** e la vista del soggiorno è abbastanza ampia (credenza, TV, tavolo). Resta una foto scura.
6. **Foto 22: il «rosso scuro» è l'intradosso del portale**, non una porta: la porta non si distingue.
7. **Comfort: 37 voci elencate**, mentre Airbnb dichiara «38». Probabilmente conta Smart Lock come voce a parte. Sul sito userò il conteggio reale, senza citare il numero di Airbnb.
8. **Aria condizionata.** Il tour fotografico la elenca solo per le camere 1 e 2, non per la camera 3. Sul sito non la attribuisco alla camera 3.
9. **Gazebo.** Non è nel testo dell'annuncio ma si vede nelle foto 18, 20 e 21: lo cito come visibile nelle foto.
10. **Profilo dell'host.** 56 recensioni complessive con media 4,95; nel profilo compaiono studi a Milano e lavoro da insegnante liceale. Non li pubblico, come previsto.
11. **Muoversi in zona.** Il traffico è libero a qualsiasi ora, salvo eventi (maratona, corse ciclistiche). È un dato nuovo, utile per le domande frequenti.
12. **Sicurezza.** Rilevatore di monossido, estintore e kit di primo soccorso presenti; nessun rilevatore di fumo (confermato da te).
13. **Recensioni.**
    - Una recensione (Caitlin, marzo 2026) cita una «lavasciuga»: tu confermi che non c'è asciugatrice, quindi sul sito parlo solo di lavatrice e non userò quell'estratto.
    - Un'altra (Pedro, gennaio 2026) dice che la casa è ideale per una famiglia di quattro «se non vi dispiace condividere la doccia»: conferma che la doccia condivisa va spiegata con chiarezza.
    - Elfriede (maggio 2026) ha dato 4 stelle, tutte le altre 5.
    - Un account si chiama «Enjoy Rentals» (un'agenzia): non è un nome di persona, quindi non lo uso negli estratti.
14. **Colore delle pareti.** Dal vivo le pareti tendono a un grigio caldo, appena più freddo del «tortora» proposto. Lo verifico ricampionando la palette nella Fase 2.

## Punti ancora aperti

- «Acqua calda» risulta tra le voci non disponibili: quasi certamente è una svista, ma va confermata. Fino ad allora non ne scrivo.
- Le altre domande sono in `docs/piano.md`, sezione 13: stack e pubblicazione, modulo, telefono, indirizzo, email.

## Foto da rifare o aggiungere (prima lista)

- **Cucina**: una vista frontale e luminosa.
- **Soggiorno**: con luce naturale e da un angolo più ampio. La foto 1 è scura.
- **Lavanderia (16)**: in ordine, senza oggetti appesi né secchi.
- **Bagno 1**: una vista d'insieme. Le foto 12 e 13 sono scorci.
- **Camera 1 con il balcone**, visto da fuori o dalla portafinestra aperta.
- **La spiaggia e il percorso a piedi** dalla casa al mare: il dato «a pochi metri» è il più forte e non ha immagini.
- **Una foto orizzontale della facciata** (oltre alla verticale 17), utile per l'immagine di condivisione.
