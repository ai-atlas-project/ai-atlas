# AI Atlas Project Notes

This file records public project status and high-level taxonomy decisions for AI Atlas.

It is intentionally clean public documentation. It must not contain private prompts, raw internal reviews, private agent notes, unpublished links, or private workflow material.

## Current public status

AI Atlas is currently at:

- version: `v0.1`
- public taxonomy scope: Level 0, Level 1, Level 2
- canonical public taxonomy location: `taxonomy/`
- Level 3 status: draft/review work only, not yet promoted to the public canonical taxonomy

## Current canonical files

The current public taxonomy source files are:

- `taxonomy/ai-taxonomy-l1-l2.json`
- `taxonomy/ai-taxonomy-l1-l2.md`

Supporting taxonomy documentation:

- `taxonomy/ai-taxonomy-principles.md`
- `taxonomy/concept-types.md`
- `taxonomy/visual-grammar.md`
- `taxonomy/level-3-draft-policy.md`

Generated public views:

- `markmap/`
- `mermaid/`
- `obsidian/`

These public generated views should remain aligned with the current canonical taxonomy scope. Until Level 3 is promoted, canonical public generated views should remain Level 1–Level 2 only. Draft Level 3 views, if generated, should live separately and be clearly marked as draft.

## Current hierarchy policy

Level means hierarchy depth, not concept type.

Current hierarchy levels:

- Level 0 — Field
- Level 1 — Major Area
- Level 2 — Main Subarea

Concept type is tracked separately from hierarchy level.

For example, a Level 2 node may have concept type `Subfield`, but the hierarchy level itself is still `Main Subarea`.

## Level 3 policy status

Level 3 has not yet been promoted to the public canonical taxonomy.

Early Level 3 material should be treated as draft/review work until it is explicitly:

1. drafted,
2. reviewed,
3. cleaned,
4. validated,
5. promoted into the public canonical taxonomy.

See: `taxonomy/level-3-draft-policy.md`.

Level 3 should prefer stable, academically recognizable, technically useful concepts.

Level 3 should not include specific products, company names, temporary marketing labels, or concrete model versions unless AI Atlas explicitly decides to include such concrete examples at a deeper level later.

## Public/private separation

The public repository contains public outputs only.

Internal workflows, reusable review agents, raw draft notes, private links, and prompt materials are kept outside this public repository unless they are cleaned and explicitly approved for public release.

## Open public decisions

The following decisions are still open before canonical Level 3 promotion:

- where the first public Level 3 draft should live,
- how validation should distinguish canonical taxonomy files from draft files,
- how cross-links should be represented beyond parent-child hierarchy,
- when Level 3 is mature enough to become part of the public canonical taxonomy.

## Recent public decisions

- The public taxonomy currently remains Level 1 and Level 2 only.
- Level 3 is explicitly draft/review work until promoted.
- Public Level 3 draft policy lives at `taxonomy/level-3-draft-policy.md`.
- Canonical public generated views remain Level 1–Level 2 only until Level 3 is promoted; draft Level 3 views must be separate and clearly marked.
- Obsidian hierarchy terminology uses `Level 2 — Main Subarea`.
- Concept type `Subfield` remains valid as a concept type, separate from hierarchy level name.
