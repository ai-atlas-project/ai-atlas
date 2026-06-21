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

## Package files and standalone files

Private Level 3 work may temporarily contain both branch package files and standalone node files.

Use these roles during review:

- Branch package files are branch-level context artifacts. They are useful for planning, reviewing candidate sets, preserving original grouping decisions, and explaining why candidates were included, deferred, or modeled elsewhere.
- Standalone node files are the preferred review and migration unit for structured node validation, stable-ID experiments, relation-target typing, and focused future edits.
- The private Level 3 index records which artifacts currently exist and how they relate. It must not imply that a standalone file automatically replaces a package file.
- A package file and standalone files must not both be treated as independent canonical sources for the same promoted concept.

Current private LLM Group 1 handling follows this transition pattern: the original LLM package remains a private package/context artifact, while all seven Group 1 nodes are also tracked as extracted standalone private draft files. This is bookkeeping for private review only; it does not promote Level 3 and does not authorize deleting or replacing the package file.

## Current examples

- `Retrieval-Augmented Generation`: primary under `Text Generation`; related to `Large Language Models` and `Information Retrieval`.
- `Tool Use`: primary under `Autonomous Agents`; related to `Large Language Models` and `AI Assistants`.
- `Transformers`: primary under `Deep Learning`; related to `Large Language Models`.
- `Surface Realization`: primary under `Natural Language Generation`; related to `Text Generation`.
- `Large Language Models` Group 1: original branch package retained as context; extracted standalone node files used for focused private draft review.

These examples document current draft handling. They do not canonically promote the concepts or settle future placement.

## File placement guidance

- Branch package review: use package files to review candidate sets, branch scope, and extraction decisions before treating individual nodes as independently reviewable.
- Standalone node review: prefer standalone files when a concept needs focused validation, relation typing, stable-ID testing, or future promotion preparation.
- Early private review: one standalone structured node file or one clearly bounded branch draft file.
- Cross-branch discovery: use the private index and relation metadata.
- Public draft proposal: summarize proposed placement without exposing private workflow details.
- Canonical promotion: decide consolidation and file layout as part of the promotion change.

Existing files should not be moved or deleted until this policy and a migration plan are approved.

## Migration guidance

Before consolidating package files or treating standalone files as the only source for a branch, prepare a focused migration review that checks:

1. whether every package node has an equivalent standalone file or a documented deferred/excluded status;
2. whether names, concept types, primary parents, descriptions, relation counts, relation types, learner order, and promotion blockers are preserved or intentionally changed;
3. whether public draft proposals need updates;
4. whether generated views remain unchanged until canonical promotion;
5. whether stale package content should be preserved as context, synchronized, archived, or removed.

Codex or local validation should be used for broad migrations, generated files, multi-file JSON edits, or exact field-order preservation.

## Open questions

- When should standalone files be consolidated into branch files?
- How should a public draft reference private cross-branch evidence?
- Should alternative parents use relations or dedicated review metadata?
- How should cross-branch nodes appear in future generated views?
- Should branch package files remain as permanent private review artifacts after extraction?
- How should divergence between a package file and extracted standalone files be detected?
