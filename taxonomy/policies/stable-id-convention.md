# Stable Taxonomy Node ID Convention

Status: draft policy / under review / not canonical

Source issue: [#15 — Define stable ID convention for taxonomy nodes](https://github.com/elvistudio/ai-atlas/issues/15)

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

1. inventory current canonical and provisional IDs;
2. assign approved stable IDs;
3. record old-to-new aliases or successor mappings;
4. update relation targets only after relation-target typing is approved;
5. validate that no ID was changed solely because of level, parent, or concept type.

This draft does not authorize that migration.

## Open questions

- Should the namespace delimiter be `:` or `.`?
- Do private drafts need a separate namespace?
- How should multilingual aliases resolve to one canonical ID?
- How should deprecated IDs redirect in files, APIs, and generated views?
- Should canonical slugs be generated only from English canonical names?
- What exact alias and successor metadata fields are required?

No canonical IDs, relation targets, or structured draft files are changed by this proposal.
