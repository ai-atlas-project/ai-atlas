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
- `canonical_pending_id`: optional and should usually be omitted until public ID acceptance and validator behavior are settled; `note` is required and must explain the transitional state;
- `private_draft`: include when the private target has an assigned provisional or approved ID; omission should produce a review warning;
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
- the target's existing public ID has not yet been validated and accepted as an approved stable ID;
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

`target_id` is optional for `canonical_pending_id` and should usually be omitted until public ID acceptance and validator behavior are settled.

Example:

```json
{
  "type": "related-to",
  "target_name": "Text Generation",
  "target_status": "canonical_pending_id",
  "note": "Public canonical Level 2 concept using the current ai:<slug> canonical ID format."
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
- require `note` for `canonical_pending_id` and allow an omitted `target_id`;
- warn when `canonical_pending_id` remains after stable IDs have been validated and accepted;
- warn when a private draft target has no ID;
- allow future and unresolved targets without IDs when their status is explicit;
- require a useful `note` for unresolved targets;
- avoid treating future or unresolved targets as canonical graph nodes;
- verify optional concept type and hierarchy level against the referenced target when available.

Loose labels must be reviewed rather than silently resolved. For example, `Evaluation` should be checked against the canonical name `Evaluation, Measurement and Benchmarking`. If reviewers cannot confirm equivalence, the target should remain `unresolved`.

## External references

External references should use `target_status: "external_reference"`, retain a readable `target_name`, and include explanatory context in `note`.

Whether external URIs require a dedicated field remains an open question.

## Review-derived migration guidance

A private relation-target status review found:

- 17 remaining plain relation targets in the private LLM branch package/context file;
- 5 existing typed provisional relations needing follow-up;
- 14 exact public L1/L2 name matches;
- 2 future Language Model Adaptation references;
- 1 ambiguous Evaluation reference.

Until public L1/L2 ID acceptance and validator behavior are finalized, exact public L1/L2 name matches should use `canonical_pending_id` during private migration planning, not `canonical`.

Use `canonical` only when:

- the public target ID is accepted;
- the ID is resolvable by validation;
- validator behavior for canonical targets is implemented or explicitly approved.

The accepted spelling is `private_draft`, not `private-draft`.

Use `future_candidate` for future branches or candidates that are not yet drafted or canonical, including Language Model Adaptation if it remains a future branch.

Use `unresolved` when equivalence is unclear.

`Evaluation` must remain `unresolved` unless reviewers explicitly decide that it maps to `Evaluation, Measurement and Benchmarking`.

The private LLM package/context file may be used as a first relation migration pilot only after package-vs-standalone source-of-truth handling is clear.

## Target status vocabulary and validation behavior

The accepted `target_status` values are:

- `canonical`
- `canonical_pending_id`
- `private_draft`
- `future_candidate`
- `unresolved`
- `external_reference`

### `canonical`

- Requires `target_id`.
- `target_id` must resolve to an accepted public canonical taxonomy concept.
- `target_name` should match or be an accepted display name for that target.
- Use only after public ID acceptance and validator behavior are approved.

### `canonical_pending_id`

- Transitional status for exact public L1/L2 name matches while public ID acceptance or validator behavior is still pending.
- `target_name` is required.
- `target_id` is optional and should usually be omitted until acceptance rules are settled.
- Must not be treated as a graph-ready canonical reference.

### `private_draft`

- For targets that are private Level 3 draft concepts.
- `target_name` is required.
- `target_id` may be present if it is a private draft ID.
- Must not imply public canonical status.

### `future_candidate`

- For future branches or candidates that are not yet drafted or canonical.
- `target_name` is required.
- `target_id` should be omitted.
- Must not invent branch IDs.

### `unresolved`

- For targets whose equivalence is unclear.
- `target_name` is required.
- A reviewer note is recommended.
- Must not be silently mapped to a broader or narrower canonical concept.

### `external_reference`

- For targets outside the AI Atlas taxonomy.
- `target_name` is required.
- External URI handling remains open unless covered by a later policy decision.

### Upgrade rules

- `canonical_pending_id` may become `canonical` only after:
  - the public target ID is accepted;
  - validators can resolve the ID;
  - the relation target meaning is unchanged.
- `future_candidate` may become `private_draft` only after the target draft exists.
- `private_draft` may become `canonical` only through the approved Level 3 review and promotion process.
- `unresolved` must remain unresolved until an explicit review decision.

### Ambiguous target rule

`Evaluation` must not be automatically mapped to `Evaluation, Measurement and Benchmarking`.

Any such mapping requires explicit review because it may change target meaning.

### Validator severity guidance

- `canonical` without a resolvable `target_id`: error.
- `canonical_pending_id` without `target_id`: allowed warning or informational result.
- `private_draft` pointing to a missing private draft ID: warning.
- `future_candidate` with an invented `target_id`: warning or error.
- `unresolved`: allowed during review but blocks promotion.
- Unknown `target_status`: error.

## Migration dependency

Current public L1/L2 IDs exist in canonical JSON using the `ai:<slug>` format. Before broad relation migration, validators should confirm that these IDs are unique and well-formed.

After that confirmation, relation targets pointing to public L1/L2 concepts should migrate from `canonical_pending_id` toward `canonical` with `target_id`.

Broad migration must wait until:

- the stable ID convention is approved;
- public L1/L2 stable IDs are validated, or transitional target-status handling is explicitly approved;
- validator behavior for `canonical_pending_id` is defined.

Otherwise relation targets could be migrated twice or linked to IDs that later change.

Existing structured draft JSON files and their plain or pilot target representations remain provisional. This policy draft does not authorize mass updates.

## Open questions

- Should private and canonical relations use one schema?
- Should external targets use `target_uri` or another dedicated field?
- When should missing IDs on `private_draft` targets become errors rather than warnings?
- How should renamed, aliased, deprecated, or successor IDs resolve?
- Should unresolved targets be allowed in public draft proposals?
- Should `canonical_pending_id` be permitted in public draft proposals or private migration work only?
- When must transitional `canonical_pending_id` relations be upgraded to `canonical`?
