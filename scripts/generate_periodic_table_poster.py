#!/usr/bin/env python3
"""Generate a draft periodic-table-style AI Atlas poster as SVG."""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import math
import textwrap
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_INPUT = ROOT / "taxonomy" / "ai-taxonomy-l1-l2.json"
DEFAULT_OUTPUT = ROOT / "build" / "print" / "ai-atlas-l1-l2-periodic-table.svg"

SIZES_MM = {
    "A1_LANDSCAPE": (841, 594),
    "A0_LANDSCAPE": (1189, 841),
    "SQUARE_LARGE": (841, 841),
}

ZONE_COLORS = [
    ("#E8F2FF", "#3978B8"),
    ("#EAF7EA", "#3E8750"),
    ("#FFF3DF", "#B87820"),
    ("#F4ECFF", "#7952A8"),
    ("#E9F7F7", "#33858A"),
    ("#FFF0F0", "#B85B5B"),
    ("#EEF0FF", "#596CB8"),
    ("#F8F8E8", "#8A8734"),
    ("#EAF1F6", "#4D7892"),
    ("#F1F5EA", "#71854C"),
    ("#F7EEF5", "#985C87"),
    ("#EFF6F0", "#4B805A"),
    ("#F3F3F3", "#666666"),
]


def esc(value: object) -> str:
    return html.escape(str(value), quote=True)


def load_taxonomy(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as source:
        data = json.load(source)
    if not isinstance(data, dict):
        raise ValueError("Taxonomy JSON must be an object.")
    if not isinstance(data.get("level_0"), dict):
        raise ValueError("Taxonomy JSON must contain a level_0 object.")
    if not isinstance(data.get("level_1"), list):
        raise ValueError("Taxonomy JSON must contain a level_1 list.")
    return data


def wrap_label(label: str, width: int, max_lines: int) -> list[str]:
    lines = textwrap.wrap(
        label,
        width=width,
        break_long_words=False,
        break_on_hyphens=False,
    ) or [label]
    if len(lines) <= max_lines:
        return lines
    kept = lines[:max_lines]
    kept[-1] = kept[-1].rstrip(".,;:") + "…"
    return kept


def text_element(
    x: float,
    y: float,
    lines: list[str],
    *,
    size: float,
    weight: int = 400,
    fill: str = "#171717",
    anchor: str = "start",
    line_gap: float = 1.18,
) -> str:
    tspans: list[str] = []
    for index, line in enumerate(lines):
        dy = 0 if index == 0 else size * line_gap
        tspans.append(f'<tspan x="{x:.2f}" dy="{dy:.2f}">{esc(line)}</tspan>')
    return (
        f'<text x="{x:.2f}" y="{y:.2f}" font-size="{size:.2f}" '
        f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}">'
        + "".join(tspans)
        + "</text>"
    )


def concept_code(name: str, used: set[str]) -> str:
    words = [word for word in name.replace("/", " ").replace("-", " ").split() if word]
    base = "".join(word[0] for word in words if word[0].isalnum()).upper()
    if len(base) < 2:
        base = "".join(character for character in name if character.isalnum()).upper()
    base = base[:4] or "AI"
    code = base
    if code in used:
        suffix = hashlib.sha1(name.encode("utf-8")).hexdigest()[:2].upper()
        code = (base[:2] + suffix)[:4]
    counter = 2
    while code in used:
        code = f"{base[:2]}{counter}"[:4]
        counter += 1
    used.add(code)
    return code


def draw_cell(
    node: dict[str, Any],
    *,
    code: str,
    x: float,
    y: float,
    width: float,
    height: float,
    fill: str,
    stroke: str,
    scale: float,
) -> str:
    name = str(node.get("name", "Untitled"))
    concept_type = str(node.get("concept_type", "Concept"))
    stability = str(node.get("stability", ""))
    name_lines = wrap_label(name, width=25, max_lines=2)
    name_size = (1.82 if len(name) > 32 else 2.05) * scale
    marker = {"stable": "●", "emerging": "◆", "speculative": "◇"}.get(stability, "·")
    return (
        f'<g data-level="2" data-name="{esc(name)}">'
        f'<rect x="{x:.2f}" y="{y:.2f}" width="{width:.2f}" height="{height:.2f}" '
        f'rx="{1.8 * scale:.2f}" fill="#FFFFFF" stroke="{stroke}" stroke-width="{0.45 * scale:.2f}" />'
        f'<rect x="{x:.2f}" y="{y:.2f}" width="{width:.2f}" height="{5.8 * scale:.2f}" '
        f'rx="{1.8 * scale:.2f}" fill="{fill}" />'
        + text_element(
            x + 2.0 * scale,
            y + 4.2 * scale,
            [code],
            size=2.7 * scale,
            weight=800,
            fill=stroke,
        )
        + text_element(
            x + width - 2.0 * scale,
            y + 4.1 * scale,
            [marker],
            size=2.1 * scale,
            weight=700,
            fill=stroke,
            anchor="end",
        )
        + text_element(
            x + 2.0 * scale,
            y + 10.0 * scale,
            name_lines,
            size=name_size,
            weight=650,
        )
        + text_element(
            x + 2.0 * scale,
            y + height - 2.0 * scale,
            [concept_type],
            size=1.55 * scale,
            fill="#555555",
        )
        + "</g>"
    )


def generate_svg(data: dict[str, Any], *, size_name: str) -> str:
    width, height = SIZES_MM[size_name]
    branches = data["level_1"]
    if not branches:
        raise ValueError("Taxonomy has no Level 1 areas.")

    scale = min(width / 841, height / 594)
    margin = 16 * scale
    title_y = 17 * scale
    subtitle_y = 26 * scale
    grid_top = 38 * scale
    legend_y = height - 11 * scale
    grid_bottom = height - 22 * scale
    columns = 4
    rows = math.ceil(len(branches) / columns)
    gutter = 5 * scale
    zone_width = (width - 2 * margin - gutter * (columns - 1)) / columns
    zone_height = (grid_bottom - grid_top - gutter * (rows - 1)) / rows
    used_codes: set[str] = set()

    project = str(data.get("project", "AI Atlas"))
    root_name = str(data["level_0"].get("name", "Artificial Intelligence"))
    version = str(data.get("version", ""))

    parts = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}mm" height="{height}mm" viewBox="0 0 {width} {height}">',
        f'<rect x="0" y="0" width="{width}" height="{height}" fill="#FFFFFF" />',
        '<style>text { font-family: Inter, Arial, Helvetica, sans-serif; }</style>',
        f'<text x="{margin:.2f}" y="{title_y:.2f}" font-size="{8.8 * scale:.2f}" font-weight="800" fill="#111111">{esc(project)} · Periodic Table</text>',
        f'<text x="{margin:.2f}" y="{subtitle_y:.2f}" font-size="{3.3 * scale:.2f}" fill="#444444">{esc(root_name)} · draft reference prototype · not final public poster</text>',
    ]

    for index, branch in enumerate(branches):
        row = index // columns
        column = index % columns
        x = margin + column * (zone_width + gutter)
        y = grid_top + row * (zone_height + gutter)
        fill, stroke = ZONE_COLORS[index % len(ZONE_COLORS)]
        name = str(branch.get("name", "Untitled"))
        nodes = branch.get("level_2", [])
        if not isinstance(nodes, list):
            nodes = []

        parts.extend(
            [
                f'<g data-level="1" data-name="{esc(name)}">',
                f'<rect x="{x:.2f}" y="{y:.2f}" width="{zone_width:.2f}" height="{zone_height:.2f}" '
                f'rx="{3.0 * scale:.2f}" fill="{fill}" fill-opacity="0.46" '
                f'stroke="{stroke}" stroke-width="{0.7 * scale:.2f}" />',
                text_element(
                    x + 4 * scale,
                    y + 7 * scale,
                    wrap_label(name, width=31, max_lines=2),
                    size=3.25 * scale,
                    weight=750,
                    fill=stroke,
                ),
                f'<text x="{x + zone_width - 4 * scale:.2f}" y="{y + 7 * scale:.2f}" '
                f'font-size="{2.0 * scale:.2f}" fill="{stroke}" text-anchor="end">LEVEL 1 · {len(nodes)} CELLS</text>',
                "</g>",
            ]
        )

        cell_columns = 5 if len(nodes) > 12 else 4
        cell_rows = math.ceil(len(nodes) / cell_columns)
        cell_gap = 2.0 * scale
        cells_top = y + 14 * scale
        cells_bottom = y + zone_height - 4 * scale
        cell_width = (zone_width - 8 * scale - cell_gap * (cell_columns - 1)) / cell_columns
        cell_height = (cells_bottom - cells_top - cell_gap * (cell_rows - 1)) / cell_rows

        for node_index, node in enumerate(nodes):
            if not isinstance(node, dict):
                continue
            cell_column = node_index % cell_columns
            cell_row = node_index // cell_columns
            cell_x = x + 4 * scale + cell_column * (cell_width + cell_gap)
            cell_y = cells_top + cell_row * (cell_height + cell_gap)
            code = concept_code(str(node.get("name", "")), used_codes)
            parts.append(
                draw_cell(
                    node,
                    code=code,
                    x=cell_x,
                    y=cell_y,
                    width=cell_width,
                    height=cell_height,
                    fill=fill,
                    stroke=stroke,
                    scale=scale,
                )
            )

    legend = (
        "Legend: zones = Level 1 areas · cells = Level 2 concepts · code = generated reference abbreviation · "
        "bottom label = concept type · marker hints stability · equal cell size does not imply importance · "
        "draft prototype, not final public poster"
    )
    parts.append(
        f'<text x="{margin:.2f}" y="{legend_y:.2f}" font-size="{2.45 * scale:.2f}" fill="#444444">{esc(legend)}</text>'
    )
    parts.append(
        f'<text x="{width - margin:.2f}" y="{legend_y:.2f}" font-size="{2.45 * scale:.2f}" '
        f'fill="#666666" text-anchor="end">AI Atlas v{esc(version)}</text>'
    )
    parts.append("</svg>")
    return "\n".join(parts) + "\n"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate a draft periodic-table-style AI Atlas SVG poster."
    )
    parser.add_argument(
        "--input",
        type=Path,
        default=DEFAULT_INPUT,
        help=f"Taxonomy JSON input. Default: {DEFAULT_INPUT.relative_to(ROOT)}",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
        help=f"SVG output. Default: {DEFAULT_OUTPUT.relative_to(ROOT)}",
    )
    parser.add_argument(
        "--size",
        choices=sorted(SIZES_MM),
        default="A1_LANDSCAPE",
        help="Printable target size. Default: A1_LANDSCAPE.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    input_path = args.input if args.input.is_absolute() else ROOT / args.input
    output_path = args.output if args.output.is_absolute() else ROOT / args.output
    svg = generate_svg(load_taxonomy(input_path), size_name=args.size)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(svg, encoding="utf-8")
    try:
        display_path = output_path.relative_to(ROOT)
    except ValueError:
        display_path = output_path
    print(f"Generated {display_path}")
    print("Draft periodic table prototype; export the SVG from a browser or vector editor to create a PDF.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
