# Public L1/L2 Stable ID Storage Design

Status: draft policy / under review / not canonical

Source issue: [#22 — Formalize canonical taxonomy JSON](https://github.com/ai-atlas-project/ai-atlas/issues/22)

Related issues:

- [#15 — Define stable ID convention for taxonomy nodes](https://github.com/ai-atlas-project/ai-atlas/issues/15)
- [#16 — Define relation target typing for structured taxonomy nodes](https://github.com/ai-atlas-project/ai-atlas/issues/16)
- [#18 — Normalize structured draft schema for Level 3 nodes](https://github.com/ai-atlas-project/ai-atlas/issues/18)

## Purpose

Confirm where existing `ai:<slug>` IDs for public canonical Level 1 and Level 2 concepts should live before broad typed-relation migration or Level 3 promotion.

This draft does not assign IDs, modify canonical taxonomy files, update generated views, or authorize Level 3 promotion.

## Problem

The Surface Realization private pilot showed that relation targets need stable IDs for graph-readiness. Public canonical L1/L2 concepts now have `ai:<slug>` IDs in canonical JSON, and those IDs should be used as the current public canonical ID format before broad relation migration.

The project therefore needs a storage decision before it can safely:

- accept the existing public L1/L2 IDs as approved stable IDs;
- migrate private relation targets to typed relation objects;
- validate canonical relation targets;
- build a reliable relations graph;
- promote any Level 3 draft to canonical status.

## Requirements

The chosen storage model should:

- preserve the canonical taxonomy tree as the source of truth;
- keep IDs stable when hierarchy placement, hierarchy depth, or concept type changes;
- avoid mixing concept identity with parent placement;
- be easy to validate automatically;
- support readable diffs and expert review;
- support generated Markdown, Markmap, Obsidian, and future website/search views;
- support aliases, former names, provisional private IDs, deprecation, and successor mappings;
- avoid broad repository churn during ID validation or future identity metadata expansion.

## Options considered

### Option A — Store stable IDs directly in `taxonomy/ai-taxonomy-l1-l2.json`

Keep stable ID and identity metadata directly on each canonical L1/L2 node. The current canonical JSON already stores `id` on these nodes.

Possible fields:

```json
{
  "id": "ai:natural-language-processing",
  "name": "Natural Language Processing",
  "aliases": [],
  "former_ids": [],
  "provisional_ids": []
}
```

Advantages:

- canonical identity travels with the canonical node;
- easiest for validators and generated views;
- fewer files to synchronize;
- relation targets can resolve directly against canonical JSON;
- simplest long-term model for public machine-readable taxonomy.

Disadvantages:

- future corrections or identity metadata expansion modify the canonical taxonomy JSON;
- broad metadata expansion could create a large diff;
- requires careful review to avoid accidental taxonomy meaning changes;
- future identity metadata could make the canonical file heavier.

### Option B — Store stable IDs in a sidecar registry

Create a separate file, for example:

```text
taxonomy/stable-ids.json
```

The registry maps canonical names or paths to stable IDs and identity metadata.

Possible shape:

```json
{
  "nodes": [
    {
      "id": "ai:natural-language-processing",
      "canonical_name": "Natural Language Processing",
      "canonical_path": [
        "Natural Language and Speech",
        "Natural Language Processing"
      ],
      "aliases": [],
      "former_ids": [],
      "provisional_ids": []
    }
  ]
}
```

Advantages:

- avoids immediate edits to canonical taxonomy JSON;
- keeps identity metadata isolated and reviewable;
- can be introduced as an experimental bridge;
- can map private provisional IDs without changing taxonomy data.

Disadvantages:

- creates a second source that must be synchronized;
- validators must check cross-file consistency;
- canonical names and paths can drift from the registry;
- generated views must merge data from multiple files;
- harder for contributors to know where the canonical identity lives.

### Option C — Generate stable IDs as metadata only

Do not store stable IDs manually. Generate them from canonical names and paths during build or validation.

Advantages:

- no immediate canonical JSON changes;
- low maintenance if names never change;
- easy to prototype.

Disadvantages:

- generated IDs are not truly stable across renames;
- deprecation and successor mappings become difficult;
- aliases and provisional private IDs have no authoritative home;
- relation targets cannot safely reference generated IDs unless generation rules become canonical;
- weak fit for long-term graph and API use.

## Recommended draft direction

Use **Option A: store stable IDs directly in `taxonomy/ai-taxonomy-l1-l2.json`**. The current canonical JSON already follows this storage model with `ai:<slug>` IDs.

Reasoning:

- AI Atlas treats canonical taxonomy files as the source of truth.
- Stable identity is core taxonomy metadata, not merely generated output.
- Relation target validation should resolve against canonical taxonomy data directly.
- Generated views, graph exports, and future search should not need to infer or merge identity from an unstable sidecar.
- Sidecar registries are useful for transition planning, but they should not become the long-term source of canonical identity.

## Transitional model

Before correcting existing IDs or expanding identity metadata in canonical JSON, a temporary review artifact may be used to plan changes.

Recommended temporary file, if needed:

```text
taxonomy/policies/public-l1-l2-stable-id-assignment-draft.md
```

This file may list proposed corrections or metadata changes for review, but it must remain a policy draft and not a source of canonical IDs.

Avoid creating a long-lived `taxonomy/stable-ids.json` unless reviewers explicitly choose the sidecar model.

## Future ID correction or metadata expansion PR rules

A future L1/L2 ID correction or identity metadata expansion PR should:

- modify only `taxonomy/ai-taxonomy-l1-l2.json` and any directly derived views if explicitly authorized;
- correct IDs or add identity metadata without changing canonical names, hierarchy, ordering, concept type, or taxonomy meaning;
- include a machine validation check for ID uniqueness;
- include a review note mapping known private provisional IDs to proposed canonical IDs;
- not migrate private Level 3 JSON relations in the same PR;
- not promote any Level 3 draft;
- not close #15 or #16 automatically.

## Proposed minimal canonical fields

For L1/L2 nodes, start with the smallest stable identity surface:

```json
{
  "id": "ai:natural-language-processing",
  "name": "Natural Language Processing"
}
```

Additional identity metadata should be added only when needed:

```json
{
  "aliases": [],
  "former_ids": [],
  "provisional_ids": []
}
```

Do not add empty metadata arrays everywhere unless validators or generated views require uniform fields.

## Validator implications

For the current public L1/L2 IDs, validators should eventually:

- require unique IDs across canonical taxonomy nodes;
- reject duplicate IDs;
- reject malformed IDs;
- verify that typed relation targets with `target_status: "canonical"` resolve to canonical IDs;
- warn on `canonical_pending_id` targets that can now be upgraded to `canonical`;
- verify that Markdown and generated views remain synchronized with canonical JSON.

## Impact on current issues

### #22

This issue should confirm whether the existing direct storage in canonical JSON is the accepted model.

### #15

Stable ID convention can proceed using `ai:<slug>` as the current public canonical format. Further lifecycle handling for aliases, former IDs, successors, and deprecation still needs review.

### #16

`canonical_pending_id` remains valid until current public canonical IDs are validated and accepted. After confirmation, relation targets should migrate toward `target_status: "canonical"` with `target_id`.

### #18

Structured draft schema can continue using provisional private IDs until public IDs and relation target rules are stable enough for migration.

## Open questions

- Should empty `aliases`, `former_ids`, or `provisional_ids` fields be required on every canonical node, or only when non-empty?
- Should canonical Markdown views display IDs, hide them, or include them in comments/metadata blocks?
- Should generated Markmap and Obsidian outputs include stable IDs?
- Should private provisional ID mappings live in canonical JSON, a migration note, or private review files?
- Should the first ID validation review cover all public L1/L2 nodes or only the L1/L2 nodes referenced by current private pilots?

## Current main-state note

The current public canonical taxonomy JSON already stores `ai:<slug>` `id` fields directly on Level 0, Level 1, and Level 2 nodes. This matches the recommended Option A storage model.

The next policy step is not initial storage selection, but confirmation:

- validate uniqueness and format;
- decide whether these IDs are approved stable IDs;
- decide alias/deprecation metadata;
- decide generated-view handling;
- decide relation-target migration timing.

## Current recommendation

Proceed in this order:

1. Confirm that the existing canonical JSON IDs are the accepted stable ID storage model.
2. Add or run validation for ID uniqueness and format.
3. Update #15 and #16 based on the accepted ID state.
4. Migrate relation targets only after validator behavior is agreed.
5. Continue private structured schema normalization only after the ID and relation-target path is coherent.
