# Contribution Guidelines

AI Atlas is an open, community-reviewed taxonomy and knowledge map of modern Artificial Intelligence.

The goal is to keep the taxonomy stable, technically useful, and easy to review before expanding it into deeper levels, richer generated views, or public presentation formats.

## Core principles

When proposing taxonomy changes, follow these principles:

- Level means hierarchy depth, not concept type.
- Concept type is separate from hierarchy level.
- Prefer stable, academically recognizable, technically useful names.
- Avoid specific products, company names, temporary marketing labels, and concrete model versions unless they are explicitly in scope.
- Keep taxonomy changes small and focused.
- Preserve AI Atlas as an open, community-reviewed taxonomy and knowledge map.

## Hierarchy level vs. concept type

Every taxonomy node may have two different kinds of metadata:

1. **Hierarchy level** — where the concept appears in the tree.
2. **Concept type** — what kind of concept it is.

For example:

- `Machine Learning` is a Level 1 node and has concept type `Major Area`.
- `Deep Learning` is a Level 2 node and has concept type `Subfield`.
- `Reinforcement Learning` is a Level 2 node and has concept type `Paradigm`.
- A future `Transformers` node may be Level 3 and have concept type `Architecture`.

Do not rename concept types just because a hierarchy level name changes. For example, Level 2 is named `Main Subarea`, but `concept_type: "Subfield"` remains valid for concepts that are subfields.

## Taxonomy source files

Treat the current repository state as the source of truth.

Important taxonomy and consistency files include:

- `taxonomy/ai-taxonomy-l1-l2.json`
- `taxonomy/ai-taxonomy-l1-l2.md`
- `taxonomy/ai-taxonomy-principles.md`
- `taxonomy/concept-types.md`
- `taxonomy/visual-grammar.md`
- `docs/project-notes.md`
- generated Markmap, Mermaid, and Obsidian views

If a taxonomy change affects canonical names or hierarchy structure, keep JSON, Markdown, generated views, and Obsidian views synchronized.

## Before submitting taxonomy changes

Before opening a pull request that changes taxonomy content:

1. Confirm that the concept belongs at the proposed hierarchy level.
2. Confirm that the concept type is appropriate.
3. Check for duplicate or overlapping concepts.
4. Prefer stable terminology over temporary market language.
5. Update generated views when names or hierarchy structure change.
6. Run validation:

```bash
python3 scripts/validate_taxonomy.py
```

## Level 3 and deeper concepts

Do not add Level 3 or deeper concepts unless the pull request explicitly targets deeper-level expansion.

Level 3 work should be treated as a draft expansion or encyclopedia draft until it has passed review.

Good Level 3 candidates should usually be stable technical concepts such as methods, architectures, model families, system patterns, or well-established techniques.

Avoid adding concrete products, company-specific systems, model versions, or temporary marketing terms unless they are explicitly in scope for that review.

## Review expectations

A good taxonomy pull request should make it easy for reviewers to answer:

- What changed?
- Which hierarchy level changed?
- Which concept type changed or was added?
- Why does this concept belong here?
- Is this terminology stable?
- Are there duplicates or overlaps?
- Were generated views updated?
- Did validation pass?

Small, focused pull requests are preferred over broad rewrites.
