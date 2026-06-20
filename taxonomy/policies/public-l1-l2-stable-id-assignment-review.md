# Public L1/L2 Stable ID Assignment Review

Status: implementation review / canonical JSON identity metadata change

## Summary

Stable semantic IDs were added directly to every canonical Level 0, Level 1, and Level 2 node in `taxonomy/ai-taxonomy-l1-l2.json`.

The change adds identity metadata only. It does not change taxonomy names, hierarchy, ordering, concept types, descriptions, Level 3 status, relation targets, or generated views.

IDs use the agreed assignment format:

```text
ai:<slug>
```

Each `id` appears immediately before its node's `name`.

## Files changed

- `taxonomy/ai-taxonomy-l1-l2.json`
- `taxonomy/policies/public-l1-l2-stable-id-assignment-review.md`

## Counts

- Level 0 IDs added: 1
- Level 1 IDs added: 13
- Level 2 IDs added: 111
- Total IDs added: 125
- Duplicate IDs: 0

## Validation results

- JSON parses successfully.
- Every canonical Level 0, Level 1, and Level 2 node has an ID.
- Every ID is unique.
- Every ID starts with `ai:`.
- Every ID equals the deterministic semantic slug derived from its unchanged canonical name.
- IDs do not encode hierarchy level.
- IDs do not encode concept type.
- IDs do not encode parent placement.
- IDs are located immediately before `name`.
- Removing the newly added `id` fields produces a structure identical to the pre-change JSON.
- No relation target migration occurred.

## Confirmed unchanged

- Names: unchanged
- Parents: unchanged
- Children: unchanged
- Ordering: unchanged
- Hierarchy levels: unchanged
- Hierarchy level names: unchanged
- Concept types: unchanged
- Descriptions: unchanged
- Level 3 drafts: unchanged
- Relation targets: unchanged
- Generated views: unchanged

## Vera review

Only the canonical JSON and this implementation review note changed.

The JSON is valid, all 125 expected nodes have IDs, every ID is unique, and no generated view changed.

The before/after structural comparison confirms that taxonomy meaning and all pre-existing fields remain unchanged.

Vera approves the implementation scope.

## Mira review

The assigned IDs are semantic identity keys derived from canonical names.

They do not encode:

- hierarchy level;
- concept type;
- parent placement.

Identity therefore remains separate from hierarchy and concept type. Moving a node or changing its type would not require changing its ID.

Mira approves the identity model used by this assignment.

## John verdict

Approve the public Level 0–Level 2 stable ID assignment.

Approval is limited to canonical identity metadata:

- no taxonomy meaning changed;
- no Level 3 content was promoted;
- no relation target was migrated;
- no generated view was changed.

Further identity metadata, relation migration, Markdown display, and generated-view handling require separate review.

## Remaining follow-up

- Update #15 with assigned public L1/L2 IDs.
- Update #16 because `canonical_pending_id` can now start migrating toward `canonical`.
- Decide whether Markdown and generated views should display IDs.
