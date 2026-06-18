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
