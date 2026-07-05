# AI Atlas v0.1 Public Review Guide

AI Atlas v0.1 is open for public review.

This first public preview covers the stable top layers of the map:

- Level 0 — Artificial Intelligence
- Level 1 — major areas of AI
- Level 2 — main subareas inside each major area

Level 3 is being developed separately as draft/review work and is not canonical yet.

## What to review

Please review the current public Level 1 and Level 2 taxonomy:

- `taxonomy/ai-taxonomy-l1-l2.md` — human-readable taxonomy
- `taxonomy/ai-taxonomy-l1-l2.json` — machine-readable canonical source

Useful generated views:

- `viewer/`
- `markmap/`
- `obsidian/`

These generated views should remain aligned with the current Level 1–Level 2 canonical taxonomy.

## Review questions

When reviewing AI Atlas v0.1, please focus on these questions:

1. Are any major Level 1 AI areas missing?
2. Are any current Level 1 areas too narrow, too broad, or better treated as Level 2?
3. Are any Level 1 branches overlapping too much?
4. Are any important Level 2 subareas missing?
5. Are any Level 2 concepts placed under the wrong parent?
6. Are any names unclear, unstable, too commercial, or too implementation-specific?
7. Does the hierarchy help people understand how AI fits together?
8. Would this structure be useful for education, discussion, research orientation, or future expansion?

## What is out of scope for v0.1 review

Please do not treat these as part of the canonical v0.1 taxonomy:

- Level 3 drafts
- products or company-specific systems
- concrete model versions
- temporary market labels
- complete public website/search ideas beyond the included static viewer
- commercial poster/product packaging
- Level 4 or Level 5 expansion

These may be developed later, but they are not part of the current public canonical taxonomy.

## How to give feedback

Preferred feedback format:

```text
Area: <Level 1 or Level 2 branch>
Issue type: missing concept / misplaced concept / naming issue / overlap / unclear boundary / other
Current placement, if relevant: <where it is now>
Suggested change: <what you recommend>
Reason: <why this improves the taxonomy>
Confidence: high / medium / low
```

Example:

```text
Area: Machine Learning
Issue type: missing concept
Suggested change: Consider whether <concept> should appear as a Level 2 subarea or be deferred to Level 3.
Reason: It is a stable and widely recognized AI concept, but it may be too specific for Level 2.
Confidence: medium
```

## Review principles

AI Atlas tries to keep the map stable, readable, and technically useful.

Good review comments should consider:

- stable academic or technical naming,
- clear hierarchy placement,
- separation between hierarchy level and concept type,
- avoiding products, companies, and concrete model versions at early canonical levels,
- avoiding duplicates unless cross-cutting status is intentional,
- keeping Level 1 and Level 2 easy to critique before expanding deeper.

## Current release framing

Use this framing when sharing the project:

```text
AI Atlas v0.1 is a public preview of the Level 1 and Level 2 taxonomy of modern Artificial Intelligence. It is open for review and discussion. Level 3 is being developed separately and is not canonical yet.
```

Avoid saying that AI Atlas is complete, final, authoritative, exhaustive, or that Level 3 has already been promoted.
