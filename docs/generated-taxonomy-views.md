# Generated taxonomy views

`taxonomy/ai-taxonomy-l1-l2.json` is the source of truth for L0–L2 hierarchy, display names, IDs, types, stability, and descriptions. The generator does not modify it or promote Level 3. Level remains hierarchy depth, independent of concept type.

## Generated outputs

| Output | Contract |
| --- | --- |
| `taxonomy/ai-taxonomy-l1-l2.md` | Human-readable hierarchy; generated, never independently maintained |
| `markmap/ai-atlas-markmap.md` | Same root, L1 order, and L2 children |
| `mermaid/ai-atlas-mermaid.md` | Hierarchy edges only, with deterministic identifiers derived from stable IDs |
| `obsidian/AI Atlas Vault/00 Artificial Intelligence.md` | Root metadata and branch links |
| `obsidian/AI Atlas Vault/Level 1/*.md` | Exactly one note per L1 concept |
| `obsidian/AI Atlas Vault/Level 2/*.md` | Exactly one note per L2 concept |
| `viewer/fieldguide/data/taxonomy.json` | Byte-for-byte copy of canonical JSON; the classic viewer reads canonical JSON directly |

The generator uses the `level_1` and nested `level_2` array order consistently. It checks that `children` contain the same concepts. It does not infer ordering from alphabetical sorting or regenerate stable IDs from names.

## Update and verify

After an explicitly reviewed canonical change, run from the repository root with Node.js 20 or later:

```sh
node scripts/validate-canonical-l1-l2-json.mjs
node scripts/generate-taxonomy-views.mjs --write
node scripts/generate-taxonomy-views.mjs --check
node --test tests/generated-views.test.mjs
node scripts/fieldguide-validate.mjs
```

Review and commit the generated diff with the source change. Check mode never writes files and exits nonzero on stale, missing, or obsolete outputs. CI runs the canonical validator, view drift check, generator tests, and existing Fieldguide checks. No timestamps are generated; a second write makes no changes.

When the taxonomy itself changes, also review the Fieldguide snapshot metadata in `viewer/fieldguide/core.mjs` (`SOURCE_COMMIT` and `SNAPSHOT_DATE`) and run `node scripts/fieldguide-generate-data.mjs` to update provenance. Use a real commit containing the canonical source; do not invent a commit or automatically treat an uncommitted draft as reviewed. The existing Fieldguide validator checks snapshot equality and its provenance digest. Editorial explanations remain a separate, non-canonical layer and are not generated from taxonomy descriptions.

## Renamed and obsolete notes

Generated Obsidian notes retain the canonical ID in frontmatter. A reviewed display-name change updates the filename and hierarchy links while preserving that ID. Old notes carrying this generator's marker are removed by `--write`. `--check` reports every extra Markdown file under Level 1/Level 2, including nested directories.

Unknown extra notes block write mode before it changes files: review and move personal notes outside the managed directories instead of silently deleting them. Existing supporting notes (`START HERE.md`, `Boundary Notes.md`, and others outside the managed concept paths) are preserved. The root note keeps its existing `00 Artificial Intelligence.md` path for vault navigation. Filename collisions and unsafe filenames fail before generation.

## Scope

This workflow covers the paths listed above. Graphviz SVGs, Kumu/yWorks exports, experimental relation projections, and manually authored supporting documents retain their separate export/review workflows. No relation edge is inferred from the hierarchy or added to generated hierarchy views.
