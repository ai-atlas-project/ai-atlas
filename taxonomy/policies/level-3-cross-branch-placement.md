# Level 3 Cross-Branch Placement

Status: draft policy / under review / not canonical

Source issue: [#17 — Define cross-branch file placement policy for Level 3 drafts](https://github.com/ai-atlas-project/ai-atlas/issues/17)

## Purpose

Define how relation-heavy Level 3 concepts should be placed and stored during draft review.

## Draft proposal

- Each structured concept should have one proposed `primary_parent`.
- Other meaningful placements should be represented through explicit relations.
- Multiple plausible parents should be recorded as review uncertainty, not duplicate hierarchy placement.
- Private Level 3 draft nodes should remain in standalone files during early review.
- The private Level 3 index should remain the current status and navigation layer.
- Future canonical files may consolidate approved nodes by branch after promotion policy and schema decisions are complete.

## Current examples

- `Retrieval-Augmented Generation`: primary under `Text Generation`; related to `Large Language Models` and `Information Retrieval`.
- `Tool Use`: primary under `Autonomous Agents`; related to `Large Language Models` and `AI Assistants`.
- `Transformers`: primary under `Deep Learning`; related to `Large Language Models`.
- `Surface Realization`: primary under `Natural Language Generation`; related to `Text Generation`.

These examples document current draft handling. They do not canonically promote the concepts or settle future placement.

## File placement guidance

- Early private review: one standalone structured node file or one clearly bounded branch draft file.
- Cross-branch discovery: use the private index and relation metadata.
- Public draft proposal: summarize proposed placement without exposing private workflow details.
- Canonical promotion: decide consolidation and file layout as part of the promotion change.

Existing files should not be moved until this policy is approved.

## Open questions

- When should standalone files be consolidated into branch files?
- How should a public draft reference private cross-branch evidence?
- Should alternative parents use relations or dedicated review metadata?
- How should cross-branch nodes appear in future generated views?
