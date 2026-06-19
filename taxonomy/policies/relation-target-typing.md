# Relation Target Typing

Status: draft policy / under review / not canonical

Source issue: [#16 — Define relation target typing for structured taxonomy nodes](https://github.com/elvistudio/ai-atlas/issues/16)

## Purpose

Define typed relation targets that can support validation, stable cross-branch links, and future graph generation.

## Draft proposal

Structured relations should move from plain string targets to target objects.

Proposed fields:

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

## Draft rules

- `target_id` should be required when the target has an approved stable ID.
- `target_name` should remain present as a readable label.
- Future or unresolved targets may omit `target_id`.
- Optional concept type and hierarchy level fields describe the target; they do not determine relation meaning.
- Relation typing must remain separate from primary hierarchy placement.

## Migration dependency

Migration of existing relations should wait until the stable ID convention is approved.

Existing structured draft JSON files should not be mass-updated as part of this policy draft.

## Open questions

- Which fields are required for each target status?
- Should external references use URI fields?
- How should renamed or aliased targets resolve?
- Should private and canonical relations use one schema?
- How should validators handle unresolved targets?
