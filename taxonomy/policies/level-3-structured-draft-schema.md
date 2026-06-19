# Level 3 Structured Draft Schema

Status: draft policy / under review / not canonical

Source issue: [#18 — Normalize structured draft schema for Level 3 nodes](https://github.com/elvistudio/ai-atlas/issues/18)

## Purpose

Define a consistent private schema for structured Level 3 draft node files.

## Recommended file-level fields

- `project`
- `status`
- `canonical_promotion_status`
- `draft_only`
- `source_plan`
- `source_review`
- `target_branch`
- `nodes`
- `promotion_blockers`

Every structured draft file should eventually include `promotion_blockers`, even when the list is empty or the blockers are policy-level.

## Recommended node-level fields

- `id`
- `name`
- `aliases`
- `hierarchy_level`
- `hierarchy_level_name`
- `concept_type`
- `primary_parent`
- `primary_parent_name`
- `children`
- `relations`
- `stability`
- `status`
- `draft_only`
- `learner_order`
- `type_uncertainty`
- `review_notes`
- `description`

## Type uncertainty

Recommended values:

- `low`
- `low-medium`
- `medium`
- `medium-high`
- `high`

`type_uncertainty` records uncertainty about concept type. It must not be used as a substitute for hierarchy-placement review.

## Draft rules

- File and node status must clearly indicate private draft status.
- `draft_only` should remain `true` until explicit promotion.
- `hierarchy_level` and `concept_type` must remain separate fields.
- Source plans and reviews should be traceable.
- Relations should follow the relation-target policy after that policy is approved.
- IDs should follow the stable-ID policy after that policy is approved.

Existing private JSON files should not be migrated until this policy is approved.

## Open questions

- Is `learner_order` required or optional before a branch is complete?
- May a file use only `source_plan` or only `source_review`?
- Should source references become metadata objects?
- Should private and future canonical schemas share one JSON Schema?
- Which promotion blockers can be validated mechanically?
