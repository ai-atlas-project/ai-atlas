# Relation Target Typing

Status: draft policy / under review / not canonical

Source issue: [#16 — Define relation target typing for structured taxonomy nodes](https://github.com/ai-atlas-project/ai-atlas/issues/16)

## Purpose

Define typed relation targets that support validation, stable cross-branch links, and future graph generation.

Relation typing describes the target of a relation. It does not select a primary parent or change hierarchy placement.

## Proposed target object

Structured relations should eventually move from plain string targets to typed target objects.

Fields:

- `type`
- `target_id`
- `target_name`
- `target_status`
- optional `target_concept_type`
- optional `target_hierarchy_level`
- optional `note`

Proposed `target_status` values:

- `canonical`
- `canonical_pending_id`
- `private_draft`
- `public_draft`
- `future_candidate`
- `external_reference`
- `unresolved`

## Required fields

Every typed relation target should include:

- `type`;
- `target_name`;
- `target_status`.

`target_id` requirements depend on target status:

- `canonical`: required and must resolve to an approved stable ID;
- `canonical_pending_id`: omitted; `note` is required and must explain that the public canonical target is awaiting stable ID assignment;
- `private_draft`: include when the private target has an assigned provisional or approved ID; omission should produce a review warning;
- `public_draft`: include when the public draft has an assigned ID; omission should produce a review warning;
- `future_candidate`: optional because the target may not have an ID;
- `external_reference`: normally omitted unless the external resource has a separately defined identifier field in a future policy;
- `unresolved`: omitted until identity is resolved.

`target_name` remains required even when `target_id` is present so reviews and diffs remain readable.

## Canonical targets before approved stable IDs

`target_status: "canonical"` should eventually and consistently require `target_id`.

During the transition, do not use `target_status: "canonical"` without `target_id`. Use:

```text
canonical_pending_id
```

This status means:

- the target is a public canonical taxonomy concept by name;
- the target does not yet have an approved stable ID;
- the relation is usable for private migration review but is not fully resolvable for canonical graph generation.

Required fields for `canonical`:

- `type`
- `target_id`
- `target_name`
- `target_status`

Required fields for `canonical_pending_id`:

- `type`
- `target_name`
- `target_status`
- `note`

`target_id` must be omitted for `canonical_pending_id`.

Example:

```json
{
  "type": "related-to",
  "target_name": "Text Generation",
  "target_status": "canonical_pending_id",
  "note": "Public canonical Level 2 concept; stable ID assignment is pending."
}
```

The private Surface Realization pilot used `canonical` without `target_id` as a limited pilot exception. That exception identified this policy gap and should not become the general pattern. A future private cleanup may adopt `canonical_pending_id`, but this policy refinement does not modify the pilot or any structured JSON.

## Optional descriptive fields

- `target_concept_type` describes the target's current concept type.
- `target_hierarchy_level` describes the target's current hierarchy depth.
- `note` records uncertainty, future status, external context, or resolution work.

Concept type and hierarchy level are descriptive only. They must not be used to infer primary hierarchy placement, and their later change should not change `target_id`.

## Examples

Stable canonical target:

```json
{
  "type": "related-to",
  "target_id": "ai:text-generation",
  "target_name": "Text Generation",
  "target_status": "canonical"
}
```

Future target without an approved ID:

```json
{
  "type": "related-to",
  "target_name": "Language Model Adaptation",
  "target_status": "future_candidate",
  "note": "Target branch not yet drafted."
}
```

## Validation guidance

Validators should eventually:

- reject a canonical target without `target_id`;
- reject a canonical `target_id` that does not resolve;
- require `target_name` and `target_status` for every relation;
- allow `canonical_pending_id` only during migration or policy review;
- require `note` and reject `target_id` for `canonical_pending_id`;
- warn when `canonical_pending_id` remains after stable IDs have been assigned;
- warn when a private or public draft target has no ID;
- allow future and unresolved targets without IDs when their status is explicit;
- require a useful `note` for unresolved targets;
- avoid treating future or unresolved targets as canonical graph nodes;
- verify optional concept type and hierarchy level against the referenced target when available.

Loose labels must be reviewed rather than silently resolved. For example, `Evaluation` should be checked against the canonical name `Evaluation, Measurement and Benchmarking`. If reviewers cannot confirm equivalence, the target should remain `unresolved`.

## External references

External references should use `target_status: "external_reference"`, retain a readable `target_name`, and include explanatory context in `note`.

Whether external URIs require a dedicated field remains an open question.

## Migration dependency

Broad migration must wait until:

- the stable ID convention is approved;
- public L1/L2 stable IDs are assigned, or transitional target-status handling is explicitly approved;
- validator behavior for `canonical_pending_id` is defined.

Otherwise relation targets could be migrated twice or linked to IDs that later change.

Existing structured draft JSON files and their plain or pilot target representations remain provisional. This policy draft does not authorize mass updates.

## Open questions

- Should private and canonical relations use one schema?
- Should external targets use `target_uri` or another dedicated field?
- When should missing IDs on private or public draft targets become errors rather than warnings?
- How should renamed, aliased, deprecated, or successor IDs resolve?
- Should unresolved targets be allowed in public draft proposals?
- Should `canonical_pending_id` be permitted in public draft proposals or private migration work only?
- When must transitional `canonical_pending_id` relations be upgraded to `canonical`?
