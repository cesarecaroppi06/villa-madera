#!/usr/bin/env python3
"""Genera docs/contact-sheet.jpg dagli originali in data/photos.json.

Ogni cella riporta numero, ambiente, orientamento e dimensioni reali; lo script
verifica che le foto siano 29 e che ogni file corrisponda al checksum del
manifest. Calcola anche il colore dominante di ogni foto (usato come segnaposto)
e lo salva nel manifest.

Uso: python3 scripts/contact_sheet.py
"""

from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "data" / "photos.json"
OUT = ROOT / "docs" / "contact-sheet.jpg"
EXPECTED = 29
COLS, CELL, PAD, LABEL = 6, 300, 16, 44
BG, INK, MUTED = (250, 248, 244), (37, 34, 27), (95, 89, 76)


def font(size: int) -> ImageFont.ImageFont:
    for name in ("DejaVuSans.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def dominant(img: Image.Image) -> str:
    small = img.convert("RGB").resize((64, 64))
    q = small.quantize(colors=5, method=Image.Quantize.MEDIANCUT)
    palette = q.getpalette()
    count, idx = max(q.getcolors())
    r, g, b = palette[idx * 3 : idx * 3 + 3]
    return f"#{r:02x}{g:02x}{b:02x}"


def main() -> int:
    photos = json.loads(MANIFEST.read_text(encoding="utf-8"))
    errors = []
    if len(photos) != EXPECTED:
        errors.append(f"attese {EXPECTED} foto, trovate {len(photos)}")

    rows = -(-len(photos) // COLS)
    sheet = Image.new("RGB", (PAD + COLS * (CELL + PAD), PAD + rows * (CELL + LABEL + PAD)), BG)
    draw = ImageDraw.Draw(sheet)
    f_big, f_small = font(16), font(12)

    for i, p in enumerate(photos):
        path = ROOT / p["file"]
        if not path.exists():
            errors.append(f"{p['id']:02d}: file mancante")
            continue
        data = path.read_bytes()
        if p.get("sha256") and hashlib.sha256(data).hexdigest() != p["sha256"]:
            errors.append(f"{p['id']:02d}: checksum diverso dal manifest")
        img = Image.open(path)
        img.load()
        p["coloreDominante"] = dominant(img)

        thumb = img.convert("RGB")
        thumb.thumbnail((CELL, CELL))
        x = PAD + (i % COLS) * (CELL + PAD)
        y = PAD + (i // COLS) * (CELL + LABEL + PAD)
        sheet.paste(thumb, (x + (CELL - thumb.width) // 2, y + (CELL - thumb.height) // 2))
        draw.text((x, y + CELL + 6), f"{p['id']:02d}  {p['ambiente']}", fill=INK, font=f_big)
        draw.text(
            (x, y + CELL + 26),
            f"{p['orientamento']} · {img.width}×{img.height} · {p['uuid'][:8]}",
            fill=MUTED,
            font=f_small,
        )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(OUT, quality=85)
    MANIFEST.write_text(json.dumps(photos, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    if errors:
        print("Problemi:\n  " + "\n  ".join(errors))
        return 1
    print(f"OK: {len(photos)} foto, contact sheet in {OUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
