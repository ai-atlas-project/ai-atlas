# Stable Taxonomy Node ID Convention

Status: draft policy / under review / not canonical

Source issue: [#15 — Define stable ID convention for taxonomy nodes](https://github.com/elvistudio/ai-atlas/issues/15)

## Purpose

Define stable, semantic identifiers for taxonomy nodes without coupling identity to mutable taxonomy structure.

## Draft proposal

Taxonomy node IDs should:

- be stable and semantic;
- remain unchanged when hierarchy placement changes;
- avoid encoding mutable hierarchy level;
- avoid encoding mutable parent placement;
- avoid encoding concept type, unless it is explicitly part of a temporary private draft namespace;
- use a normalized slug derived from the concept's canonical name.

Proposed canonical format:

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

Current private draft IDs such as `ai.task.text_summarization` and `ai.method.surface_realization` are provisional. They should not be migrated until this policy is reviewed and approved.

## Rename and movement principles

- Moving a node to another parent should not change its ID.
- Changing hierarchy level should not change its ID.
- Changing concept type should not change its ID.
- A renamed concept should normally retain its ID, with the former name recorded as an alias.
- A genuinely replaced or split concept may require new IDs and explicit successor relationships.

## Open questions

- Should the namespace delimiter be `:` or `.`?
- Should private drafts use a separate draft namespace?
- How should renamed, merged, split, and deprecated IDs be represented?
- Should IDs be generated only from English canonical names?
- Should aliases ever receive resolvable secondary IDs?
- What migration mapping is required for existing provisional private IDs?

No canonical IDs or structured draft files are changed by this proposal.
