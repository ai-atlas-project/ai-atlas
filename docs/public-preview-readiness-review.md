# Public Preview Readiness Review

Status: release-readiness review for AI Atlas v0.1 public preview  
Date: 2026-06-20  
Scope: public repository readiness for showing Level 1 and Level 2 publicly

This review checks the repository against `docs/public-preview-readiness.md`.

It does not review taxonomy correctness in full. It does not promote Level 3. It does not change canonical taxonomy data.

## Executive verdict

AI Atlas v0.1 is ready to be shown publicly as a scoped public preview of the Level 1 and Level 2 taxonomy, provided the launch language stays conservative.

Recommended public framing:

> AI Atlas v0.1 — public preview of the Level 1 and Level 2 taxonomy of modern Artificial Intelligence.

Do not present this release as a complete AI taxonomy, canonical Level 3 release, finished poster product, complete public website/search product, or commercial educational product.

## Checklist result

| Area | Status | Verdict |
| --- | --- | --- |
| Public scope is clear | Pass | README, project notes, and taxonomy README all define the current scope as Level 0–Level 2. |
| Canonical source files are clear | Pass | Public docs identify `taxonomy/ai-taxonomy-l1-l2.json` and `taxonomy/ai-taxonomy-l1-l2.md` as canonical source files. |
| Public/private separation is preserved | Pass | Public docs say the public repo contains reviewed public outputs, public validation/export scripts, and static viewer assets, while private workflows/prompts/reviews stay outside. |
| Level 3 boundaries are explicit | Pass | Level 3 is consistently described as draft/review work until reviewed and promoted. |
| Public review request is focused | Pass | `PUBLIC_REVIEW.md` gives reviewers a focused Level 1–Level 2 scope and feedback format. |
| Generated views and viewer assets are release-safe | Pass with caution | Public policy says generated views and static viewer assets must stay aligned with Level 1–Level 2. Draft/prototype visual work should not be framed as final product. |
| Open issues are classified correctly | Pass with caution | Current open issues mostly concern Level 3, IDs, relations, schema, generated-view automation, or future full website/search work; these are next-phase work, not v0.1 blockers. |
| Release language avoids overclaiming | Pass if launch copy follows the suggested wording | The repository wording is conservative; social posts and public announcements must remain conservative too. |
| Next-step path is visible | Pass | Public and private docs identify Level 3 as later draft/review work and not canonical promotion. |

## Must fix before public preview

None found in the current public documentation scope.

## Completed during public-preview preparation

1. Added `docs/public-preview-readiness.md`.
2. Added `docs/public-preview-readiness-review.md`.
3. Added `PUBLIC_REVIEW.md`.
4. Linked the public review guide from `README.md`.

## Should fix before or shortly after public preview

1. Add a public release note or GitHub release draft for `v0.1-public-preview`.
2. Make sure any public visual/poster prototype is labelled as a prototype unless it has passed design/export review.
3. Keep draft PRs out of the public release narrative unless they are merged and intentionally included.

## Can wait

The following items should not block the first public preview:

- canonical Level 3 promotion,
- full Level 3 branch coverage,
- stable ID migration beyond the current approved state,
- relation graph implementation,
- a complete public website/search product beyond the included static viewer,
- final poster design,
- commercial product packaging,
- Level 4 or Level 5 expansion.

## Evidence reviewed

Public documentation reviewed:

- `README.md`
- `PUBLIC_REVIEW.md`
- `docs/project-notes.md`
- `taxonomy/README.md`
- `taxonomy/level-3-draft-policy.md`
- `taxonomy/level-3-drafts/large-language-models.md`
- `docs/public-preview-readiness.md`

Issue and PR categories reviewed:

- Level 3 schema normalization
- canonical taxonomy JSON formalization
- relation target typing
- stable ID policy
- public Level 3 promotion process
- generated view synchronization
- public website/search exploration beyond the current static viewer
- open poster/readability prototype PR

## Public launch wording guardrail

Use:

```text
AI Atlas v0.1 is open for public review.

This first public preview covers the stable top layers of the map: Level 1 major areas and Level 2 main subareas of modern Artificial Intelligence.

We are looking for feedback on missing major AI areas, misplaced or overlapping Level 1 branches, missing important Level 2 subareas, unclear names, and hierarchy usefulness for learning and discussion.

Level 3 is being developed separately as draft/review work and is not canonical yet.
```

Avoid:

```text
The complete AI Atlas is ready.
AI Atlas is the authoritative taxonomy of AI.
Level 3 is now canonical.
The full AI knowledge graph is available.
The complete AI Atlas public website/search product is launched.
The AI Atlas poster product is launched.
```

## Recommended next step

Create a public release note or GitHub release draft for `v0.1-public-preview`.
