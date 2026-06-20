# Public L1/L2 Stable ID Assignment Plan

Status: draft implementation plan / under review / not canonical

Source issues:

- [#22 — Formalize canonical taxonomy JSON](https://github.com/ai-atlas-project/ai-atlas/issues/22)
- [#15 — Define stable ID convention for taxonomy nodes](https://github.com/ai-atlas-project/ai-atlas/issues/15)
- [#16 — Define relation target typing for structured taxonomy nodes](https://github.com/ai-atlas-project/ai-atlas/issues/16)

Related policy drafts:

- `taxonomy/policies/public-l1-l2-stable-id-storage.md`
- `taxonomy/policies/stable-id-convention.md`
- `taxonomy/policies/relation-target-typing.md`

## Purpose

Prepare the first explicit public Level 1 / Level 2 stable ID assignment PR.

This plan does not assign IDs by itself. It defines the exact constraints, validation requirements, review expectations, and safe execution procedure for the next PR that modifies `taxonomy/ai-taxonomy-l1-l2.json`.

## Current decision checkpoint

The current recommended storage model is:

- store stable IDs directly in `taxonomy/ai-taxonomy-l1-l2.json`;
- assign them in a separate explicit PR;
- do not use a long-lived sidecar registry unless reviewers reverse this decision;
- do not rely on generated IDs as canonical identity.

## Scope of the actual assignment PR

The actual assignment PR should modify only:

```text
taxonomy/ai-taxonomy-l1-l2.json
```

Optional, only if explicitly needed:

```text
taxonomy/policies/public-l1-l2-stable-id-assignment-review.md
```

Do not modify:

- `taxonomy/ai-taxonomy-l1-l2.md` unless generated-view synchronization is explicitly included;
- generated Markmap, Mermaid, Obsidian, or other view files;
- Level 3 drafts;
- private repository files;
- relation targets;
- concept type files.

## Hard constraints for the actual assignment PR

The actual assignment PR must:

- add an `id` field to the Field, Level 1, and Level 2 canonical nodes;
- preserve every existing `name` exactly;
- preserve every existing `parent` exactly;
- preserve every existing `children` list exactly;
- preserve every existing ordering exactly;
- preserve every existing `hierarchy_level` exactly;
- preserve every existing `hierarchy_level_name` exactly;
- preserve every existing `concept_type` exactly;
- preserve every existing `stability` exactly;
- preserve every existing `description` exactly;
- not add, remove, rename, merge, split, or move taxonomy concepts;
- not change taxonomy meaning;
- not migrate relation targets;
- not promote Level 3;
- not close #15 or #16 automatically.

## ID format

Use the current preferred draft format:

```text
ai:<slug>
```

Slug rules:

- lowercase;
- ASCII where possible;
- words separated by hyphens;
- remove punctuation that is not semantically needed;
- preserve meaningful domain terms such as `ai`, `agi`, `llm` only when part of the canonical name;
- do not encode hierarchy level;
- do not encode parent placement;
- do not encode concept type.

Examples:

```text
Artificial Intelligence -> ai:artificial-intelligence
Natural Language and Speech -> ai:natural-language-and-speech
Natural Language Processing -> ai:natural-language-processing
Text Generation -> ai:text-generation
Evaluation, Measurement and Benchmarking -> ai:evaluation-measurement-and-benchmarking
AI Safety, Alignment and Governance -> ai:ai-safety-alignment-and-governance
AGI and Future AI -> ai:agi-and-future-ai
```

## Required validation

The actual assignment PR must include validation evidence that:

- JSON parses successfully;
- every canonical node at levels 0, 1, and 2 has an `id`;
- every `id` is unique;
- every `id` starts with `ai:`;
- no `id` encodes hierarchy level, parent placement, or concept type;
- all pre-existing names are unchanged;
- all pre-existing parents are unchanged;
- all pre-existing children arrays are unchanged;
- all pre-existing concept types are unchanged;
- all pre-existing descriptions are unchanged;
- no Level 3 draft files changed;
- no relation target migration occurred.

## Suggested implementation procedure

1. Read `taxonomy/ai-taxonomy-l1-l2.json` from current `main`.
2. Traverse:
   - `level_0`;
   - every object in `level_1`;
   - every object in each `level_1[].level_2` array.
3. For each node, generate an `id` from the canonical `name`.
4. Insert `id` immediately before `name` for readability.
5. Write JSON with existing indentation style.
6. Validate JSON.
7. Compare semantic fields before and after.
8. Produce a summary of counts:
   - number of Level 0 IDs added;
   - number of Level 1 IDs added;
   - number of Level 2 IDs added;
   - total IDs added;
   - duplicate ID count.

## Review expectations

### Vera review

Vera should confirm:

- only the intended file changed;
- JSON is valid;
- all IDs are unique;
- generated views were not changed unless explicitly authorized;
- taxonomy meaning did not change.

### Mira review

Mira should confirm:

- IDs do not encode hierarchy level;
- IDs do not encode concept type;
- IDs do not encode parent placement;
- identity remains separate from hierarchy and concept type.

### John verdict

John may approve the actual assignment PR only if:

- all validation evidence is present;
- no taxonomy meaning changes are included;
- no Level 3 promotion is included;
- no relation migration is included.

## Important caution

Do not manually rewrite the full canonical JSON from partial or truncated output. Use a complete local checkout or a tool that reads and writes the full file safely.

The canonical taxonomy file is large enough that partial-output editing is unsafe.

## Next step

After this plan is reviewed, create the actual assignment branch and PR.

Suggested future branch:

```text
taxonomy/add-public-l1-l2-stable-ids
```

Suggested future commit message:

```text
Add stable IDs to public L1 and L2 taxonomy
```

The future PR should explicitly say:

- branch was pushed to remote;
- commit SHA;
- changed files;
- validation results;
- whether generated views were intentionally excluded;
- issues that remain open.
