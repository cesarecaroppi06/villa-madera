#!/usr/bin/env python3
"""Scarica le foto dell'annuncio elencate in data/photos.json.

Per ogni foto considera l'URL senza parametri (1200 px), ?im_w=1920 e
?im_w=2560, e tiene la più grande che contiene davvero più dettaglio della
misura immediatamente inferiore: se l'energia dei contorni non supera in
modo misurabile quella della misura inferiore ingrandita alla stessa
larghezza, la versione grande è un semplice ingrandimento e non si tiene.

Idempotente: se il file esiste e il checksum coincide con il manifest, la foto
viene saltata. Attende 1-2 secondi tra le richieste. Aggiorna il manifest con
dimensioni reali, sorgente scelta e SHA-256.

Uso: python3 scripts/download_photos.py [--force]
"""

from __future__ import annotations

import hashlib
import io
import json
import random
import sys
import time
from pathlib import Path

import httpx
from PIL import Image, ImageFilter, ImageStat

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "data" / "photos.json"
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"
VARIANTS = ["?im_w=2560", "?im_w=1920", ""]
# Guadagno minimo di dettaglio perché una versione grande valga la pena
DETAIL_GAIN = 1.10


def pause() -> None:
    time.sleep(1 + random.random())


def fetch(client: httpx.Client, url: str) -> bytes | None:
    try:
        r = client.get(url)
    except httpx.HTTPError as e:
        print(f"  ! {url}: {e}")
        return None
    finally:
        pause()
    if r.status_code != 200:
        print(f"  ! {url}: HTTP {r.status_code}")
        return None
    return r.content


def open_valid(data: bytes) -> Image.Image | None:
    try:
        Image.open(io.BytesIO(data)).verify()
        img = Image.open(io.BytesIO(data))
        img.load()
        return img.convert("RGB")
    except Exception as e:  # noqa: BLE001
        print(f"  ! immagine non valida: {e}")
        return None


def sharpness(img: Image.Image) -> float:
    g = img.convert("L").filter(ImageFilter.FIND_EDGES)
    return ImageStat.Stat(g).var[0]


def detail_ratio(big: Image.Image, base: Image.Image) -> float:
    """Dettaglio della versione grande rispetto alla base ingrandita.

    Alla risoluzione della versione grande confronta l'energia dei contorni
    della grande con quella della base ingrandita (che per costruzione non
    aggiunge dettaglio): se la grande è solo un ingrandimento, il rapporto
    resta vicino a 1.
    """
    base_up = base.resize(big.size, Image.LANCZOS)
    return sharpness(big) / max(sharpness(base_up), 1e-6)


def main() -> int:
    force = "--force" in sys.argv
    photos = json.loads(MANIFEST.read_text(encoding="utf-8"))
    (ROOT / "assets" / "originals").mkdir(parents=True, exist_ok=True)

    with httpx.Client(headers={"User-Agent": UA}, timeout=60, follow_redirects=True) as client:
        for p in photos:
            dest = ROOT / p["file"]
            if not force and dest.exists() and p.get("sha256"):
                if hashlib.sha256(dest.read_bytes()).hexdigest() == p["sha256"]:
                    print(f"{p['id']:02d} già presente, salto")
                    continue

            print(f"{p['id']:02d} {p['uuid'][:8]} {p['ambiente']}")
            base_bytes = fetch(client, p["url"])
            base = open_valid(base_bytes) if base_bytes else None
            if base is None:
                print("  ! versione base non disponibile: interrompo")
                return 1

            # Risale dalla base: ogni misura più grande deve aggiungere dettaglio
            # rispetto alla misura tenuta finora, altrimenti ci si ferma.
            chosen, chosen_bytes, chosen_variant, ratio_log = base, base_bytes, "", {}
            for v in reversed(VARIANTS[:-1]):
                data = fetch(client, p["url"] + v)
                img = open_valid(data) if data else None
                if img is None or img.width <= chosen.width:
                    ratio_log[v] = None if img is None else "non più grande"
                    break
                ratio = detail_ratio(img, chosen)
                ratio_log[v] = round(ratio, 3)
                if ratio < DETAIL_GAIN:
                    break  # solo un ingrandimento della misura precedente
                chosen, chosen_bytes, chosen_variant = img, data, v

            dest.write_bytes(chosen_bytes)
            p.update(
                {
                    "larghezza": chosen.width,
                    "altezza": chosen.height,
                    "sorgente": p["url"] + chosen_variant,
                    "confrontoDettaglio": ratio_log,
                    "sha256": hashlib.sha256(chosen_bytes).hexdigest(),
                    "byte": len(chosen_bytes),
                }
            )
            print(f"  -> {chosen.width}x{chosen.height} {chosen_variant or 'base'} {ratio_log}")
            MANIFEST.write_text(json.dumps(photos, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"Fatto: {len(photos)} foto nel manifest")
    return 0


if __name__ == "__main__":
    sys.exit(main())
