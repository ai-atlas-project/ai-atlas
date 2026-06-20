# Level 3 Structured Draft Schema

Status: draft policy / under review / not canonical

Source issue: [#18 — Normalize structured draft schema for Level 3 nodes](https://github.com/ai-atlas-project/ai-atlas/issues/18)

## Purpose

Define a consistent private schema for structured Level 3 draft node files while stable ID and relation policies remain under review.

This is a prose policy draft, not a formal JSON Schema.

## File-level fields

| Field | Draft requirement | Guidance |
| --- | --- | --- |
| `project` | Required | Non-empty project name. |
| `status` | Required | Must clearly identify private draft or review status. |
| `canonical_promotion_status` | Required | Must state that the file is not promoted unless a later explicit promotion occurs. |
| `draft_only` | Required | Boolean; must remain `true` during draft review. |
| `source_plan` | Conditionally required | Repository-relative path. At least one of `source_plan` or `source_review` must be non-null. May be `null` when no plan exists. |
| `source_review` | Conditionally required | Repository-relative path. At least one of `source_plan` or `source_review` must be non-null. May be `null` before review exists. |
| `target_branch` | Required | Non-empty branch metadata identifying the proposed Level 1 and Level 2 context. |
| `nodes` | Required | Array containing at least one structured draft node. |
| `promotion_blockers` | Required, may be empty | Array of unresolved blockers. An empty array means no blockers are currently recorded; it does not promote the file. |

Additional file-level metadata is optional when it serves a documented review need.

## Node-level fields

| Field | Draft requirement | Guidance |
| --- | --- | --- |
| `id` | Required | Non-empty. Existing private IDs remain provisional until the stable-ID policy is approved. |
| `name` | Required | Non-empty proposed canonical display name. |
| `aliases` | Required, may be empty | Array of alternate or former names. |
| `hierarchy_level` | Required | Integer; Level 3 drafts normally use `3`. |
| `hierarchy_level_name` | Required | Human-readable level label; separate from concept type. |
| `concept_type` | Required | Current proposed type; does not determine hierarchy placement. |
| `primary_parent` | Required | Current parent identifier; may remain provisional during draft review. |
| `primary_parent_name` | Required | Readable parent name. |
| `children` | Required, may be empty | Array; normally empty during initial Level 3 drafting. |
| `relations` | Required, may be empty | Array of relation objects. Existing plain target representations remain provisional. |
| `stability` | Required | Current terminology or concept stability assessment. |
| `status` | Required | Must remain draft until explicit promotion. |
| `draft_only` | Required | Boolean; must remain `true` during draft review. |
| `learner_order` | Required, nullable | May be `null` until branch-level ordering is reviewed. |
| `type_uncertainty` | Required | Controlled value describing concept-type uncertainty. |
| `review_notes` | Required, may be empty | String or agreed structured value recording review context. |
| `description` | Required | Non-empty concise concept description. |

Additional node-level metadata is optional when it does not conflict with required fields.

## Type uncertainty

Recommended values:

- `low`
- `low-medium`
- `medium`
- `medium-high`
- `high`

`type_uncertainty` records uncertainty about concept type. It must not substitute for hierarchy-placement review, stability review, or promotion blockers.

## Promotion blockers

Every structured draft file should eventually include `promotion_blockers`.

Blockers should:

- identify unresolved policy, placement, naming, validation, or review work;
- use concise statements that can be resolved or explicitly accepted;
- remain separate from general review notes;
- be reviewed before any public or canonical promotion.

An empty `promotion_blockers` array does not imply approval. Promotion still requires the separate review and promotion process.

## Source references

- Source references should use repository-relative paths.
- At least one of `source_plan` or `source_review` must be present and non-null.
- Both should be present when both artifacts exist.
- Missing review artifacts may be represented with `null` during early drafting.
- A future policy may replace path strings with metadata objects, but no migration is authorized yet.

## ID and relation transition

- IDs should eventually use stable semantic IDs after the stable-ID policy is approved.
- Current private IDs remain provisional and should not be interpreted as canonical.
- Relations should eventually use typed target objects after the relation-target policy and stable-ID policy are approved.
- Existing relation arrays and plain target representations remain valid provisional draft data during review.

No existing JSON files should be migrated until the relevant policies and a migration plan are approved.

## Open questions

- Should `learner_order` remain required and nullable, or become optional?
- Should source references become metadata objects?
- Should `review_notes` remain a string or allow structured entries?
- Should private and future canonical schemas share one formal JSON Schema?
- Which promotion blockers can be validated mechanically?
- When should typed relation targets become mandatory for new private drafts?
