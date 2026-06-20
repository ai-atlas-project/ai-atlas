# Relation Target Typing

Status: draft policy / under review / not canonical

Source issue: [#16 — Define relation target typing for structured taxonomy nodes](https://github.com/elvistudio/ai-atlas/issues/16)

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
- `private_draft`: include when the private target has an assigned provisional or approved ID; omission should produce a review warning;
- `public_draft`: include when the public draft has an assigned ID; omission should produce a review warning;
- `future_candidate`: optional because the target may not have an ID;
- `external_reference`: normally omitted unless the external resource has a separately defined identifier field in a future policy;
- `unresolved`: omitted until identity is resolved.

`target_name` remains required even when `target_id` is present so reviews and diffs remain readable.

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

Migration must wait until the stable ID convention is approved. Otherwise relation targets could be migrated twice or linked to IDs that later change.

Existing structured draft JSON files and their plain relation targets remain provisional. This policy draft does not authorize mass updates.

## Open questions

- Should private and canonical relations use one schema?
- Should external targets use `target_uri` or another dedicated field?
- When should missing IDs on private or public draft targets become errors rather than warnings?
- How should renamed, aliased, deprecated, or successor IDs resolve?
- Should unresolved targets be allowed in public draft proposals?
