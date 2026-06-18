# Print Poster Generation

Generate the draft Level 1-Level 2 modular-grid poster from the canonical JSON taxonomy:

```bash
python3 scripts/generate_print_poster.py
```

The default output is:

```text
build/print/ai-atlas-l1-l2-modular-grid.svg
```

The default page size is A1 landscape. Use `--size` to select another supported
size, or run the script with `--help` for all options.

To create a PDF, open the SVG in a browser or a vector editor such as Inkscape,
Illustrator, Affinity Designer, or Figma, then export or print it as PDF. Keep
the document dimensions unchanged to preserve the selected print size.

The generated poster is a draft prototype for review, not a final public AI
Atlas poster. Generated files under `build/` are intentionally not committed.

## Radial atlas prototype

Generate the experimental radial Level 1-Level 2 poster with:

```bash
python3 scripts/generate_radial_poster.py
```

The default A1 landscape output is:

```text
build/print/ai-atlas-l1-l2-radial-atlas.svg
```

The radial generator also supports A0 landscape and a large square format; run
it with `--help` for input, output, and size options. This output is a draft
visual-direction prototype, not a final public poster, and remains uncommitted
under `build/`.

## Periodic table prototype

Generate the Level 1 zones and individual Level 2 reference cells with:

```bash
python3 scripts/generate_periodic_table_poster.py
```

The default output is:

```text
build/print/ai-atlas-l1-l2-periodic-table.svg
```

This is a draft prototype, not a final public poster. Generated files remain
uncommitted under `build/`.

## Metro map prototype

Generate the schematic Level 1 lines and Level 2 stations with:

```bash
python3 scripts/generate_metro_map_poster.py
```

The default output is:

```text
build/print/ai-atlas-l1-l2-metro-map.svg
```

The line-and-station arrangement is a visual metaphor only and does not imply
sequence or dependency. This is a draft prototype, not a final public poster.
Generated files remain uncommitted under `build/`.
