# Status and Lifecycle

This document defines lifecycle status, stability, promotion, deferral, rejection, and deprecation for AI Atlas concepts.

It does not promote Level 3 content.

## Status vs stability

`status` and `stability` are related but different.

`status` describes where a concept is in the AI Atlas review lifecycle.

`stability` describes how mature or settled the concept itself appears to be in AI research, practice, or public taxonomy design.

A concept can be technically stable but still have draft status in AI Atlas.

Example:

- `Transformers` may be technically stable as a concept.
- A future AI Atlas `Transformers` node may still be `draft` until reviewed and promoted.

## Allowed statuses

### `candidate`

A concept has been proposed but not yet placed or reviewed.

Use for rough inbox items, early suggestions, and unresolved concepts.

A candidate should not appear in canonical public taxonomy.

### `draft`

A concept has a proposed name, parent, concept type, and description, but has not passed full review.

Use for branch-scoped draft work, experimental files, and review material.

Draft content should be clearly marked and separated from canonical taxonomy.

### `reviewed`

A concept has passed one or more review steps but has not yet been promoted to stable canonical status.

Use when a concept is stronger than draft but still waiting for final approval, validation, or publication.

### `stable`

A concept has been reviewed, accepted, and promoted into the canonical public taxonomy.

Stable nodes should not change casually.

A stable node may still be improved, but changes should preserve meaning or pass the appropriate review process.

### `deferred`

A concept is not rejected, but should wait.

Use when a concept is potentially valid but:

- belongs at a deeper level,
- needs more evidence,
- needs relation support,
- depends on a parent decision,
- is too early for the current taxonomy scope.

### `rejected`

A concept should not be included in its proposed form.

Use when a candidate is:

- a product, company, or model version at a disallowed level,
- a temporary hype term,
- a duplicate of an existing concept,
- misleadingly placed,
- too vague to be useful.

Rejected concepts may be kept in review notes so the same decision does not need to be repeated.

### `deprecated`

A previously used concept or name should no longer be preferred.

Use when a concept has been renamed, replaced, merged, split, or retired.

Deprecated nodes or names should point to a replacement when possible.

## Allowed transitions

Typical transitions:

```text
candidate -> draft -> reviewed -> stable
candidate -> deferred
candidate -> rejected
draft -> deferred
draft -> rejected
draft -> reviewed
reviewed -> stable
stable -> deprecated
```

Avoid skipping directly from `candidate` to `stable` unless the concept is already part of the existing reviewed canonical taxonomy.

## Criteria for stable

A concept may become `stable` only when:

- its canonical name is stable and technically recognizable,
- its concept type is explicit,
- its primary parent is defensible,
- its description is clear,
- it does not duplicate an existing concept,
- aliases are documented when needed,
- cross-links or alternative parents are documented when needed,
- it does not violate naming or exclusion rules,
- it passes the relevant review process.

## Criteria for deferred

Use `deferred` when:

- the concept is probably useful but too early,
- it belongs better at Level 4 or Level 5,
- parent placement is unresolved,
- it needs cross-link support first,
- its name is not stable enough yet.

## Criteria for rejected

Use `rejected` when:

- the proposed concept is a product, company, or model version at a disallowed level,
- the term is mostly marketing language,
- it duplicates an existing node,
- it would force a misleading hierarchy,
- it is not meaningful as an AI Atlas concept.

## Criteria for deprecated

Use `deprecated` when:

- a canonical name is replaced by a better one,
- a concept is merged into another node,
- a concept is split into multiple clearer nodes,
- a concept should remain discoverable but no longer preferred.

When possible, document:

- `deprecated_by`,
- `replaces`,
- the reason for deprecation.

## Level 1 and Level 2 stability

Public canonical Level 1 and Level 2 should remain stable unless an explicit review approves a change.

Level 3 draft work must not casually rewrite Level 1 or Level 2.

If deeper work reveals a Level 1 or Level 2 issue, record it as a finding and review it separately.
