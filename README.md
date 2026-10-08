# Villa Madera – Porto San Giorgio

Sito vetrina dell'appartamento «In Villa Madera» a Porto San Giorgio (FM).

Stato: Fase 1 completata (acquisizione di dati e foto). Il piano è in `docs/piano.md`, il riepilogo della Fase 1 in `docs/fase1-riepilogo.md`.

## Dati e foto

```bash
pip install httpx pillow
python3 scripts/download_photos.py   # scarica/verifica le 29 foto in assets/originals/
python3 scripts/contact_sheet.py     # rigenera docs/contact-sheet.jpg e controlla i checksum
```
