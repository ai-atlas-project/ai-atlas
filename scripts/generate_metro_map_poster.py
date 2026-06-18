#!/usr/bin/env python3
"""Generate a draft metro-map-style AI Atlas poster as SVG."""

from __future__ import annotations

import argparse
import html
import json
import math
import textwrap
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_INPUT = ROOT / "taxonomy" / "ai-taxonomy-l1-l2.json"
DEFAULT_OUTPUT = ROOT / "build" / "print" / "ai-atlas-l1-l2-metro-map.svg"

SIZES_MM = {
    "A1_LANDSCAPE": (841, 594),
    "A0_LANDSCAPE": (1189, 841),
    "SQUARE_LARGE": (841, 841),
}

LINE_COLORS = [
    "#2677C9",
    "#2F8A4B",
    "#C47A12",
    "#7747B5",
    "#238A90",
    "#C45151",
    "#5369C7",
    "#8B861B",
    "#447A99",
    "#6B8535",
    "#A24E86",
    "#3E8051",
    "#5D5D5D",
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
    anchor: str = "middle",
    line_gap: float = 1.15,
) -> str:
    first_y = y - (len(lines) - 1) * size * line_gap / 2
    tspans = []
    for index, line in enumerate(lines):
        dy = 0 if index == 0 else size * line_gap
        tspans.append(f'<tspan x="{x:.2f}" dy="{dy:.2f}">{esc(line)}</tspan>')
    return (
        f'<text x="{x:.2f}" y="{first_y:.2f}" font-size="{size:.2f}" '
        f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}">'
        + "".join(tspans)
        + "</text>"
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
    map_top = 43 * scale
    map_bottom = height - 27 * scale
    legend_y = height - 11 * scale
    line_label_width = 118 * scale
    station_start = margin + line_label_width + 16 * scale
    station_end = width - margin - 8 * scale
    row_height = (map_bottom - map_top) / len(branches)

    project = str(data.get("project", "AI Atlas"))
    root_name = str(data["level_0"].get("name", "Artificial Intelligence"))
    version = str(data.get("version", ""))

    parts = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}mm" height="{height}mm" viewBox="0 0 {width} {height}">',
        f'<rect x="0" y="0" width="{width}" height="{height}" fill="#FFFFFF" />',
        '<style>text { font-family: Inter, Arial, Helvetica, sans-serif; }</style>',
        f'<text x="{margin:.2f}" y="{title_y:.2f}" font-size="{8.8 * scale:.2f}" font-weight="800" fill="#111111">{esc(project)} · Metro Map</text>',
        f'<text x="{margin:.2f}" y="{subtitle_y:.2f}" font-size="{3.3 * scale:.2f}" fill="#444444">{esc(root_name)} · schematic visual metaphor · draft prototype · not final public poster</text>',
    ]

    for index, branch in enumerate(branches):
        color = LINE_COLORS[index % len(LINE_COLORS)]
        name = str(branch.get("name", "Untitled"))
        nodes = branch.get("level_2", [])
        if not isinstance(nodes, list):
            nodes = []
        line_y = map_top + (index + 0.5) * row_height
        label_height = min(25 * scale, row_height * 0.72)

        parts.extend(
            [
                f'<g data-level="1" data-name="{esc(name)}">',
                f'<rect x="{margin:.2f}" y="{line_y - label_height / 2:.2f}" '
                f'width="{line_label_width:.2f}" height="{label_height:.2f}" rx="{4 * scale:.2f}" '
                f'fill="#FFFFFF" stroke="{color}" stroke-width="{1.0 * scale:.2f}" />',
                f'<rect x="{margin:.2f}" y="{line_y - label_height / 2:.2f}" '
                f'width="{5.5 * scale:.2f}" height="{label_height:.2f}" rx="{2.5 * scale:.2f}" fill="{color}" />',
                text_element(
                    margin + line_label_width / 2 + 2 * scale,
                    line_y,
                    wrap_label(name, width=32, max_lines=2),
                    size=3.0 * scale,
                    weight=750,
                ),
                f'<path d="M {margin + line_label_width:.2f},{line_y:.2f} '
                f'L {station_end:.2f},{line_y:.2f}" fill="none" stroke="{color}" '
                f'stroke-width="{2.8 * scale:.2f}" stroke-linecap="round" />',
                "</g>",
            ]
        )

        count = len(nodes)
        if not count:
            continue
        station_span = station_end - station_start
        spacing = station_span / max(1, count - 1)
        label_width = min(43 * scale, spacing * 0.88)
        label_height = min(13.5 * scale, row_height * 0.36)

        for station_index, node in enumerate(nodes):
            if not isinstance(node, dict):
                continue
            station_name = str(node.get("name", "Untitled"))
            station_x = station_start + (station_span * station_index / max(1, count - 1))
            lane = station_index % 2
            direction = -1 if lane == 0 else 1
            label_y = line_y + direction * row_height * 0.28
            connector_y = label_y - direction * label_height / 2
            parts.append(
                f'<g data-level="2" data-name="{esc(station_name)}">'
                f'<line x1="{station_x:.2f}" y1="{line_y:.2f}" x2="{station_x:.2f}" '
                f'y2="{connector_y:.2f}" stroke="{color}" stroke-width="{0.55 * scale:.2f}" />'
                f'<circle cx="{station_x:.2f}" cy="{line_y:.2f}" r="{2.15 * scale:.2f}" '
                f'fill="#FFFFFF" stroke="{color}" stroke-width="{1.15 * scale:.2f}" />'
                f'<rect x="{station_x - label_width / 2:.2f}" y="{label_y - label_height / 2:.2f}" '
                f'width="{label_width:.2f}" height="{label_height:.2f}" rx="{1.8 * scale:.2f}" '
                f'fill="#FFFFFF" fill-opacity="0.96" stroke="{color}" stroke-width="{0.35 * scale:.2f}" />'
                + text_element(
                    station_x,
                    label_y,
                    wrap_label(station_name, width=20, max_lines=3),
                    size=(1.55 if len(station_name) > 32 else 1.75) * scale,
                    weight=550,
                )
                + "</g>"
            )

    legend = (
        "Legend: colored line = Level 1 area · station = Level 2 concept · parallel placement is a visual metaphor only; "
        "it does not imply sequence, dependency, route, or learning path · draft prototype, not final public poster"
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
        description="Generate a draft metro-map-style AI Atlas SVG poster."
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
    print("Draft metro map prototype; export the SVG from a browser or vector editor to create a PDF.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
