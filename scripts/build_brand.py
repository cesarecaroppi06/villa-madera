#!/usr/bin/env python3
"""Genera i file SVG del marchio in public/brand/.

Il simbolo (l'arco del portale) è disegnato a mano qui sotto come un unico
tracciato. Il logotipo usa i caratteri del sito convertiti in tracciati, così
il logo non dipende dal caricamento dei font: «Villa Madera» in Marcellus,
«Porto San Giorgio» in Hanken Grotesk 500 con spaziatura aperta. La
composizione del testo passa da HarfBuzz per rispettare la crenatura.

Uso: python3 scripts/build_brand.py   (poi `npm run brand` per i raster)
Richiede: fonttools, brotli, uharfbuzz e le dipendenze npm installate.
"""

from __future__ import annotations

import io
from pathlib import Path

import uharfbuzz as hb
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "brand"
NM = ROOT / "node_modules"
MARCELLUS = NM / "@fontsource/marcellus/files/marcellus-latin-400-normal.woff2"
HANKEN = NM / "@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2"

VERDE = "#2F4236"
INCHIOSTRO = "#25221B"
TORTORA_PROFONDO = "#5F594C"
CHIARO = "#FAF8F4"
LINO = "#ECE8DF"

# Il simbolo, in una griglia 24×24: gradino a sinistra, stipite, arco a tutto
# sesto, stipite, gradino a destra. Un solo tratto a spessore costante.
MARK_D = "M3.5 22H7V10.5A5 5 0 0 1 17 10.5V22H20.5"
MARK_STROKE = 1.75


def load(path: Path, wght: int | None = None) -> tuple[TTFont, bytes]:
    font = TTFont(io.BytesIO(path.read_bytes()))
    font.flavor = None
    if wght is not None and "fvar" in font:
        font = instantiateVariableFont(font, {"wght": wght})
    buf = io.BytesIO()
    font.save(buf)
    data = buf.getvalue()
    return TTFont(io.BytesIO(data)), data


def text_path(font: TTFont, data: bytes, text: str, size: float, x: float, baseline: float, tracking: float = 0) -> tuple[str, float]:
    """Restituisce il tracciato SVG del testo e la sua larghezza."""
    upem = font["head"].unitsPerEm
    scale = size / upem
    face = hb.Face(data)
    hbfont = hb.Font(face)
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(hbfont, buf, {"kern": True, "liga": True})
    glyphs = font.getGlyphSet()
    order = font.getGlyphOrder()
    pen = SVGPathPen(glyphs, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
    cursor = 0.0
    n = len(buf.glyph_infos)
    for i, (info, pos) in enumerate(zip(buf.glyph_infos, buf.glyph_positions)):
        name = order[info.codepoint]
        gx = x + (cursor + pos.x_offset) * scale
        tpen = TransformPen(pen, (scale, 0, 0, -scale, gx, baseline - pos.y_offset * scale))
        glyphs[name].draw(tpen)
        cursor += pos.x_advance
        if i < n - 1:
            cursor += tracking / scale
    return pen.getCommands(), cursor * scale


def mark_svg(color: str, size: int = 24, title: str = "Villa Madera") -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="{size}" height="{size}" role="img" aria-label="{title}">'
        f'<path d="{MARK_D}" fill="none" stroke="{color}" stroke-width="{MARK_STROKE}" stroke-linejoin="miter"/></svg>\n'
    )


def mark_group(color: str, x: float, y: float, h: float) -> str:
    s = h / 24
    return (
        f'<g transform="translate({x:.2f} {y:.2f}) scale({s:.4f})">'
        f'<path d="{MARK_D}" fill="none" stroke="{color}" stroke-width="{MARK_STROKE}"/></g>'
    )


def build() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    marc, marc_data = load(MARCELLUS)
    hank, hank_data = load(HANKEN, 500)

    # Orizzontale: simbolo alto quanto le due righe di testo.
    def horizontal(mark_c: str, ink: str, sub: str) -> str:
        mark_h = 44
        name_d, name_w = text_path(marc, marc_data, "Villa Madera", 27, 52, 24)
        place_d, place_w = text_path(hank, hank_data, "Porto San Giorgio", 10.5, 52.5, 41, tracking=10.5 * 0.12)
        w = 52 + max(name_w, place_w) + 1
        return (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.1f} 46" width="{w:.0f}" height="46" role="img" aria-label="Villa Madera – Porto San Giorgio">'
            f"{mark_group(mark_c, 0, 0, mark_h)}"
            f'<path d="{name_d}" fill="{ink}"/><path d="{place_d}" fill="{sub}"/></svg>\n'
        )

    # Impilata, centrata: per il footer e l'immagine di condivisione.
    def stacked(mark_c: str, ink: str, sub: str) -> str:
        name_d, name_w = text_path(marc, marc_data, "Villa Madera", 40, 0, 0)
        place_d, place_w = text_path(hank, hank_data, "Porto San Giorgio", 13, 0, 0, tracking=13 * 0.14)
        w = max(name_w, place_w) + 4
        mark_h = 64
        name_x = (w - name_w) / 2
        place_x = (w - place_w) / 2
        name_d, _ = text_path(marc, marc_data, "Villa Madera", 40, name_x, 108)
        place_d, _ = text_path(hank, hank_data, "Porto San Giorgio", 13, place_x, 134, tracking=13 * 0.14)
        return (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.1f} 140" width="{w:.0f}" height="140" role="img" aria-label="Villa Madera – Porto San Giorgio">'
            f"{mark_group(mark_c, (w - mark_h) / 2, 0, mark_h)}"
            f'<path d="{name_d}" fill="{ink}"/><path d="{place_d}" fill="{sub}"/></svg>\n'
        )

    files = {
        "logo.svg": horizontal(VERDE, INCHIOSTRO, TORTORA_PROFONDO),
        "logo-light.svg": horizontal(CHIARO, CHIARO, LINO),
        "logo-stacked.svg": stacked(VERDE, INCHIOSTRO, TORTORA_PROFONDO),
        "logo-stacked-light.svg": stacked(CHIARO, CHIARO, LINO),
        "mark.svg": mark_svg(VERDE),
        "mark-light.svg": mark_svg(CHIARO),
    }
    for name, svg in files.items():
        (OUT / name).write_text(svg, encoding="utf-8")

    # Favicon: simbolo su fondo bianco infisso, tratto più spesso per le piccole misure.
    fav = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">'
        f'<rect width="32" height="32" rx="2" fill="{CHIARO}"/>'
        f'<g transform="translate(-0.8 -1.6) scale(1.4)"><path d="{MARK_D}" fill="none" stroke="{VERDE}" stroke-width="1.9"/></g>'
        "</svg>\n"
    )
    (ROOT / "public" / "favicon.svg").write_text(fav, encoding="utf-8")
    print("SVG del marchio scritti in public/brand/ e public/favicon.svg")


if __name__ == "__main__":
    build()
