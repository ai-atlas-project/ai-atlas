#!/usr/bin/env python3
"""Generate a draft printable AI Atlas poster as SVG.

The generator intentionally uses only the Python standard library so it can run
locally or in CI without installing project dependencies.

Default output:
    build/print/ai-atlas-l1-l2-modular-grid.svg

The first layout is a modular grid prototype: one panel per Level 1 area, with
Level 2 concepts listed inside each panel. It is intended as a review prototype,
not a final public poster.
"""

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
DEFAULT_OUTPUT = ROOT / "build" / "print" / "ai-atlas-l1-l2-modular-grid.svg"

SIZES_MM = {
    "A2_LANDSCAPE": (594, 420),
    "A1_LANDSCAPE": (841, 594),
    "A0_LANDSCAPE": (1189, 841),
}

LEVEL_1_COLORS = [
    "#E8F2FF",
    "#EAF7EA",
    "#FFF3DF",
    "#F4ECFF",
    "#E9F7F7",
    "#FFF0F0",
    "#EEF0FF",
    "#F8F8E8",
    "#EAF1F6",
    "#F1F5EA",
    "#F7EEF5",
    "#EFF6F0",
    "#F3F3F3",
]

STABILITY_STYLES = {
    "stable": "#2D7D46",
    "emerging": "#B36B00",
    "speculative": "#7A4EB3",
}


def load_taxonomy(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    if not isinstance(data, dict):
        raise ValueError("Taxonomy JSON must be an object.")
    if "level_0" not in data or "level_1" not in data:
        raise ValueError("Taxonomy JSON must contain level_0 and level_1.")
    if not isinstance(data["level_1"], list):
        raise ValueError("Taxonomy JSON level_1 must be a list.")

    return data


def esc(value: object) -> str:
    return html.escape(str(value), quote=True)


def wrap_label(label: str, max_chars: int) -> list[str]:
    if len(label) <= max_chars:
        return [label]
    return textwrap.wrap(
        label,
        width=max_chars,
        break_long_words=False,
        break_on_hyphens=False,
    ) or [label]


def text_element(
    x: float,
    y: float,
    lines: list[str],
    *,
    size: float,
    weight: int | str = 400,
    fill: str = "#111111",
    anchor: str = "start",
    line_gap: float = 1.25,
) -> str:
    tspans: list[str] = []
    for index, line in enumerate(lines):
        dy = 0 if index == 0 else size * line_gap
        tspans.append(
            f'<tspan x="{x:.2f}" dy="{dy:.2f}">{esc(line)}</tspan>'
        )
    return (
        f'<text x="{x:.2f}" y="{y:.2f}" font-size="{size:.2f}" '
        f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}">'
        + "".join(tspans)
        + "</text>"
    )


def panel_node_map(branch: dict[str, Any]) -> dict[str, dict[str, Any]]:
    nodes = branch.get("level_2", [])
    result: dict[str, dict[str, Any]] = {}
    if isinstance(nodes, list):
        for node in nodes:
            if isinstance(node, dict) and isinstance(node.get("name"), str):
                result[node["name"]] = node
    return result


def draw_badge(x: float, y: float, text: str, *, fill: str = "#F4F4F4") -> str:
    label = esc(text)
    width = max(17.0, min(42.0, 5.0 + len(text) * 1.55))
    return (
        f'<rect x="{x:.2f}" y="{y - 3.4:.2f}" width="{width:.2f}" height="5.2" '
        f'rx="2.2" fill="{fill}" stroke="#D0D0D0" stroke-width="0.25" />'
        f'<text x="{x + 2.4:.2f}" y="{y:.2f}" font-size="2.25" fill="#333333">{label}</text>'
    )


def draw_panel(
    branch: dict[str, Any],
    *,
    index: int,
    x: float,
    y: float,
    width: float,
    height: float,
) -> str:
    name = str(branch.get("name", "Untitled"))
    concept_type = str(branch.get("concept_type", ""))
    stability = str(branch.get("stability", ""))
    children = branch.get("children", [])
    if not isinstance(children, list):
        children = []

    level_2_by_name = panel_node_map(branch)
    fill = LEVEL_1_COLORS[index % len(LEVEL_1_COLORS)]
    border = STABILITY_STYLES.get(stability, "#777777")

    parts = [
        f'<rect x="{x:.2f}" y="{y:.2f}" width="{width:.2f}" height="{height:.2f}" '
        f'rx="4" fill="{fill}" stroke="{border}" stroke-width="0.8" />'
    ]

    title_max_chars = max(18, int(width / 3.0))
    title_lines = wrap_label(name, title_max_chars)[:2]
    parts.append(
        text_element(
            x + 5,
            y + 8,
            title_lines,
            size=4.4,
            weight=700,
            fill="#111111",
        )
    )

    badge_y = y + 8
    badge_x = x + width - 47
    if concept_type:
        parts.append(draw_badge(badge_x, badge_y, concept_type, fill="#FFFFFF"))

    item_top = y + 20 + (len(title_lines) - 1) * 4.2
    item_left = x + 5
    item_width = width - 10
    max_chars = max(22, int(item_width / 2.2))
    item_size = 2.75
    line_height = 4.2
    cursor_y = item_top
    bottom = y + height - 6

    for child in children:
        child_name = str(child)
        node = level_2_by_name.get(child_name, {})
        child_type = str(node.get("concept_type", "")) if isinstance(node, dict) else ""
        label = child_name if not child_type else f"{child_name} — {child_type}"
        lines = wrap_label(label, max_chars)[:2]
        needed = line_height * len(lines)
        if cursor_y + needed > bottom:
            remaining = len(children) - children.index(child)
            parts.append(
                text_element(
                    item_left,
                    cursor_y,
                    [f"+ {remaining} more…"],
                    size=item_size,
                    fill="#555555",
                )
            )
            break
        parts.append(
            f'<circle cx="{item_left + 1.0:.2f}" cy="{cursor_y - 0.8:.2f}" r="0.7" fill="#333333" />'
        )
        parts.append(
            text_element(
                item_left + 3.0,
                cursor_y,
                lines,
                size=item_size,
                fill="#222222",
                line_gap=1.2,
            )
        )
        cursor_y += needed + 1.5

    return "\n".join(parts)


def generate_svg(data: dict[str, Any], *, size_name: str) -> str:
    width, height = SIZES_MM[size_name]
    level_0 = data["level_0"]
    branches = data["level_1"]

    margin = 18.0
    title_y = 18.0
    subtitle_y = 27.0
    legend_y = height - 15.0
    grid_top = 40.0
    grid_bottom = height - 26.0
    grid_height = grid_bottom - grid_top
    grid_width = width - 2 * margin

    count = len(branches)
    columns = 4 if count <= 16 else math.ceil(math.sqrt(count))
    rows = math.ceil(count / columns)
    gutter = 6.0
    panel_w = (grid_width - gutter * (columns - 1)) / columns
    panel_h = (grid_height - gutter * (rows - 1)) / rows

    project = esc(data.get("project", "AI Atlas"))
    version = esc(data.get("version", ""))
    status = esc(data.get("status", ""))
    root_name = esc(level_0.get("name", "Artificial Intelligence"))

    parts = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}mm" height="{height}mm" viewBox="0 0 {width} {height}">',
        f'<rect x="0" y="0" width="{width}" height="{height}" fill="#FFFFFF" />',
        '<style>text { font-family: Inter, Arial, Helvetica, sans-serif; }</style>',
        f'<text x="{margin:.2f}" y="{title_y:.2f}" font-size="9.5" font-weight="800" fill="#111111">{project}: {root_name}</text>',
        f'<text x="{margin:.2f}" y="{subtitle_y:.2f}" font-size="3.6" fill="#444444">Draft printable prototype · Full L1-L2 modular grid · version {version} · {status}</text>',
    ]

    for index, branch in enumerate(branches):
        row = index // columns
        col = index % columns
        x = margin + col * (panel_w + gutter)
        y = grid_top + row * (panel_h + gutter)
        parts.append(
            draw_panel(
                branch,
                index=index,
                x=x,
                y=y,
                width=panel_w,
                height=panel_h,
            )
        )

    legend = (
        "Legend: large panels = Level 1 areas; listed entries = Level 2 main subareas; "
        "badges = concept type; border color hints stability. Draft, not final poster."
    )
    parts.append(
        text_element(
            margin,
            legend_y,
            wrap_label(legend, 180),
            size=3.0,
            fill="#444444",
        )
    )
    parts.append("</svg>")
    return "\n".join(parts) + "\n"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate a draft AI Atlas printable modular-grid SVG poster."
    )
    parser.add_argument(
        "--input",
        type=Path,
        default=DEFAULT_INPUT,
        help=f"Taxonomy JSON input path. Default: {DEFAULT_INPUT.relative_to(ROOT)}",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
        help=f"SVG output path. Default: {DEFAULT_OUTPUT.relative_to(ROOT)}",
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

    data = load_taxonomy(input_path)
    svg = generate_svg(data, size_name=args.size)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(svg, encoding="utf-8")

    print(f"Generated {output_path.relative_to(ROOT)}")
    print("To create a PDF, open the SVG in a browser, Inkscape, Illustrator, Affinity, or Figma and export/print to PDF.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
