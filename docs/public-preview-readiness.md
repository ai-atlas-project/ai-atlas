# Public Preview Readiness

This document defines the minimum requirements and acceptance criteria for showing AI Atlas v0.1 to the public.

It is a release-readiness checklist for the first public preview. It does not promote Level 3, change taxonomy meaning, or replace the canonical taxonomy files.

## Release framing

AI Atlas v0.1 may be shown publicly as:

> AI Atlas v0.1 — public preview of the Level 1 and Level 2 taxonomy of modern Artificial Intelligence.

It must not be presented as:

- a complete map of all AI concepts,
- an authoritative final taxonomy,
- a canonical Level 3 taxonomy,
- a finished educational product,
- a commercial poster release,
- a complete website or searchable knowledge graph.

## Public preview scope

The public preview scope is:

- Level 0 — Artificial Intelligence,
- Level 1 — public major areas,
- Level 2 — public main subareas,
- public supporting documentation,
- public generated views that remain aligned with Level 1 and Level 2.

Level 3 may be mentioned only as draft/review work. Level 3 must not be described as canonical until it passes the promotion process.

## Requirements and acceptance criteria

### 1. Public scope is clear

Requirement:

The repository must clearly state that v0.1 covers Level 0, Level 1, and Level 2 only.

Acceptance criteria:

- README states the current public status.
- `docs/project-notes.md` states the current public status.
- `taxonomy/README.md` states the current canonical scope.
- Level 3 is described as draft/review work, not canonical.

### 2. Canonical source files are clear

Requirement:

The public canonical taxonomy source files must be easy to identify.

Acceptance criteria:

- `taxonomy/ai-taxonomy-l1-l2.json` is identified as a canonical source file.
- `taxonomy/ai-taxonomy-l1-l2.md` is identified as a canonical source file.
- Supporting policy files are clearly separate from canonical taxonomy data.
- Draft Level 3 files are not presented as canonical taxonomy sources.

### 3. Public/private separation is preserved

Requirement:

The public repository must contain public outputs only, while private workflows, raw reviews, prompts, and internal planning stay outside the public release unless cleaned and approved.

Acceptance criteria:

- Public README describes the public repository as containing public output files only.
- Private prompts, raw internal reviews, private links, and unpublished workflow material are not required for public readers.
- No private-only material is linked as required public reading.

### 4. Level 3 boundaries are explicit

Requirement:

Level 3 must remain draft/review work until explicitly reviewed and promoted.

Acceptance criteria:

- `taxonomy/level-3-draft-policy.md` exists.
- Public documentation says Level 3 is not yet canonical.
- Any public Level 3 draft is clearly marked as draft / not canonical.
- Public generated views do not silently mix draft Level 3 into canonical Level 1–Level 2 views.

### 5. Public review request is focused

Requirement:

The first public preview should ask reviewers for feedback on Level 1 and Level 2, not on unfinished deeper levels.

Acceptance criteria:

- Public review copy asks for feedback on missing Level 1 branches, misplaced Level 1 branches, overlapping branches, missing Level 2 areas, naming clarity, and hierarchy usefulness.
- Public review copy does not ask reviewers to treat Level 3 as complete.
- Public review copy explains that deeper concepts will be developed through later draft/review cycles.

### 6. Generated views are release-safe

Requirement:

Public generated views should not contradict the canonical taxonomy scope.

Acceptance criteria:

- Markmap, Mermaid, Obsidian, and poster/prototype views are either aligned with Level 1–Level 2 or clearly marked as draft/prototype.
- No generated public view presents draft Level 3 as canonical.
- Any visual metaphor is described as a visual aid, not as a dependency graph, learning path, or historical sequence unless explicitly designed as such.

### 7. Open issues are classified correctly

Requirement:

Open issues should not block the public preview unless they affect the correctness or honesty of the Level 1–Level 2 public preview.

Acceptance criteria:

- Level 3 schema, relation, ID, promotion, and graph issues are treated as next-phase work.
- Public-preview blockers are limited to scope clarity, public/private separation, canonical file clarity, and obvious generated-view drift.
- Future website, search, commercial product, poster polish, and full Level 3 promotion are not required for v0.1 public preview.

### 8. Release language avoids overclaiming

Requirement:

Public launch language must be honest about maturity and scope.

Acceptance criteria:

- Use terms such as `public preview`, `v0.1`, `draft`, `open for review`, and `Level 1–Level 2`.
- Avoid claiming that AI Atlas is final, complete, authoritative, exhaustive, or fully reviewed.
- Avoid implying that Level 3 is canonical.
- Avoid implying that products, companies, concrete model versions, or temporary marketing labels belong in the early canonical taxonomy.

### 9. Next-step path is visible

Requirement:

Public readers and contributors should understand what comes after v0.1.

Acceptance criteria:

- The next public work is framed as review and cleanup of Level 1–Level 2.
- Level 3 is framed as a later draft/review expansion.
- Canonical Level 3 promotion requires explicit review, validation, generated-view alignment, and approval.

## Public preview decision

AI Atlas v0.1 may be shown publicly when all must-pass criteria below are satisfied:

- [ ] Public scope is clear.
- [ ] Canonical source files are clear.
- [ ] Public/private separation is preserved.
- [ ] Level 3 boundaries are explicit.
- [ ] Public review request is focused.
- [ ] Generated views are release-safe.
- [ ] Release language avoids overclaiming.

The following are not required before the first public preview:

- canonical Level 3 promotion,
- full relation graph,
- public website and search,
- commercial poster launch,
- complete educational product packaging,
- Level 4 or Level 5 expansion.

## Suggested public review prompt

```text
AI Atlas v0.1 is open for public review.

This first public preview covers the stable top layers of the map: Level 1 major areas and Level 2 main subareas of modern Artificial Intelligence.

We are looking for feedback on:

- missing major AI areas,
- misplaced or overlapping Level 1 branches,
- missing important Level 2 subareas,
- unclear names,
- hierarchy usefulness for learning and discussion.

Level 3 is being developed separately as draft/review work and is not canonical yet.
```

## Out of scope for this checklist

This checklist does not define:

- the full Level 3 promotion process,
- stable ID migration details,
- relation graph implementation,
- generated-view automation,
- website architecture,
- poster design acceptance criteria,
- commercial release criteria.

Those should remain separate tasks or issues so the first public preview does not become blocked by later-stage work.
