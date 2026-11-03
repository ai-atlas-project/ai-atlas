# AI Atlas Taxonomy

This directory contains the public AI Atlas taxonomy files and supporting architecture policies.

## Current canonical scope

The current public canonical taxonomy is Level 0, Level 1, and Level 2 only.

Canonical structured source:

- `ai-taxonomy-l1-l2.json`

`ai-taxonomy-l1-l2.md` is the generated human-readable view, not an independently edited source. See [generation and drift checks](../docs/generated-taxonomy-views.md).

Level 3 is not part of the public canonical taxonomy until it is explicitly reviewed, cleaned, and promoted.

## Architecture and policy documents

- `ai-taxonomy-principles.md` — general taxonomy principles.
- `concept-types.md` — concept type definitions and governance rules.
- `level-3-draft-policy.md` — rules for draft Level 3 work before promotion.
- `architecture.md` — overview of the AI Atlas architecture.
- `relations.md` — relation model and primary-parent / cross-link policy.
- `node-schema.md` — node fields, stable IDs, and validation-facing expectations.
- `naming-and-aliases.md` — canonical names, aliases, synonyms, acronyms, and naming exclusions.
- `status-and-lifecycle.md` — concept status lifecycle, stability, promotion, rejection, and deprecation.

## Public generated views

Generated public views should remain aligned with the current canonical taxonomy scope unless a reviewed promotion explicitly changes that scope.

Until Level 3 is promoted, public canonical generated views should remain Level 1–Level 2 only.
