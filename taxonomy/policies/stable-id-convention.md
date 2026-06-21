# Stable Taxonomy Node ID Convention

Status: draft policy / under review / not canonical

Source issue: [#15 — Define stable ID convention for taxonomy nodes](https://github.com/ai-atlas-project/ai-atlas/issues/15)

## Purpose

Define stable, semantic identifiers for taxonomy nodes without coupling identity to mutable taxonomy structure.

## ID classes during review

### Proposed canonical IDs

The preferred draft direction is a stable semantic slug:

```text
ai:<slug>
```

Examples:

```text
ai:large-language-models
ai:text-generation
ai:retrieval-augmented-generation
ai:text-summarization
ai:surface-realization
```

This format is proposed, not approved. No existing identifier becomes canonical merely because it matches the example.

### Current private draft IDs

Private Level 3 files currently use provisional identifiers such as:

```text
ai.task.text_summarization
ai.method.surface_realization
ai.subarea.text_generation
```

These IDs remain valid references inside existing private review work, but they are not approved canonical IDs. They should not be migrated until this policy and a migration plan are approved.

If a separate draft namespace is adopted later, it must remain visibly non-canonical and must not imply that a draft concept has passed promotion review.

## Proposed canonical ID rules

Canonical IDs should:

- be stable and semantic;
- use a normalized slug associated with the concept's identity;
- remain unchanged when hierarchy placement changes;
- not encode hierarchy level;
- not encode mutable parent placement;
- not encode concept type;
- not change merely because concept type or review status changes.

Hierarchy level, primary parent, concept type, and status belong in separate metadata fields.

## Public L1/L2 stable ID assignment

Public canonical Level 1 and Level 2 concepts should receive approved stable IDs before broad typed-relation migration.

The preferred draft direction is:

- derive IDs from canonical English names;
- do not encode hierarchy level;
- do not encode concept type;
- do not encode parent placement;
- keep IDs stable when a node moves, changes concept type, or changes hierarchy depth.

Draft examples for current public concepts:

| Public canonical name | Proposed stable ID |
| --- | --- |
| Natural Language and Speech | `ai:natural-language-and-speech` |
| Natural Language Processing | `ai:natural-language-processing` |
| Natural Language Generation | `ai:natural-language-generation` |
| Language Understanding | `ai:language-understanding` |
| Text Generation | `ai:text-generation` |
| Deep Learning | `ai:deep-learning` |
| Autonomous Agents | `ai:autonomous-agents` |
| Information Retrieval | `ai:information-retrieval` |
| Evaluation, Measurement and Benchmarking | `ai:evaluation-measurement-and-benchmarking` |
| Large Language Models | `ai:large-language-models` |

These are draft proposals, not approved canonical IDs.

Any future ID correction or identity metadata expansion should occur in a separate explicit PR. That PR should update identity metadata without changing taxonomy meaning, hierarchy placement, concept type, names, or generated views unless those additional changes are separately authorized.

That PR should also include an alias and deprecation plan for existing private provisional IDs that refer to public concepts, such as `ai.subarea.text_generation`.

## Current public L1/L2 ID state

The current public canonical taxonomy JSON already contains `id` fields for Level 0, Level 1, and Level 2 nodes.

This policy should therefore treat the remaining work as review, validation, and lifecycle finalization rather than initial ID assignment.

Remaining work:

- confirm the `ai:<slug>` delimiter and slug rules;
- validate uniqueness and format across public canonical nodes;
- decide alias, former ID, and successor metadata;
- decide how IDs appear, or do not appear, in Markdown and generated views;
- document how renamed L1/L2 nodes preserve IDs.

Do not change taxonomy meaning, names, hierarchy placement, concept type, generated views, or Level 3 promotion status as part of this policy reconciliation.

## Lifecycle behavior

### Move

Moving a concept to another parent or hierarchy level should not change its ID.

### Rename

A terminology-only rename should normally retain the existing ID. The previous canonical name should be recorded as an alias or former name.

If a rename changes the concept's meaning rather than only its label, reviewers should decide whether it is a replacement requiring a new ID.

### Split

When one concept is split into multiple concepts:

- create a new ID for each successor concept;
- deprecate, but do not silently reuse, the original ID;
- record one-to-many successor metadata from the deprecated ID.

### Merge

When multiple concepts are merged:

- create or select one surviving ID for the merged concept;
- deprecate the replaced IDs;
- record each deprecated ID as redirecting or succeeding to the surviving ID.

### Deprecation

Deprecated IDs should remain resolvable. They should carry status and successor or replacement metadata rather than being deleted or reassigned to an unrelated concept.

## Migration direction

A future migration should:

1. inventory current public concepts and private provisional IDs;
2. approve the stable ID format;
3. validate and approve the existing public L1/L2 IDs, correcting them only through a separate explicit PR if needed;
4. record old-to-new aliases or successor mappings;
5. update relation targets only after relation-target typing is approved;
6. validate that no ID was changed solely because of level, parent, or concept type.

This draft does not authorize that migration.

## Open questions

- Should the namespace delimiter be `:` or `.`?
- Do private drafts need a separate namespace?
- How should multilingual aliases resolve to one canonical ID?
- How should deprecated IDs redirect in files, APIs, and generated views?
- Should canonical slugs be generated only from English canonical names?
- What exact alias and successor metadata fields are required?
- Should every public L1/L2 node receive a stable ID before any Level 3 promotion?
- Should stable IDs live in canonical JSON, a sidecar registry, or generated metadata?
- How should IDs be represented in Markdown taxonomy views?
- How should renamed L1/L2 nodes preserve old IDs?

No canonical IDs, relation targets, or structured draft files are changed by this proposal.
