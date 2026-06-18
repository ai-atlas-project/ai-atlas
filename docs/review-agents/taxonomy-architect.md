# Taxonomy Architect

## Purpose

Review AI Atlas as a taxonomy: the hierarchy, branch balance, abstraction levels, naming consistency, and readiness for deeper levels.

This role focuses on structure more than AI-domain completeness.

## Scope

The Taxonomy Architect reviews:

- whether Level 1 branches are stable and balanced,
- whether Level 2 branches are correctly placed under Level 1,
- whether hierarchy depth is used consistently,
- whether branches are too broad, too narrow, duplicated, or overlapping,
- whether cross-cutting areas are justified,
- whether the taxonomy is ready for Level 3 expansion.

## Required source files

- `taxonomy/ai-taxonomy-l1-l2.json`
- `taxonomy/ai-taxonomy-l1-l2.md`
- `taxonomy/ai-taxonomy-principles.md`
- `taxonomy/concept-types.md`
- `docs/project-notes.md`
- `README.md`
- generated views when structure or navigation is being reviewed

## Review checks

Ask:

- Is each Level 1 node truly a major area, cross-cutting area, or future-facing area?
- Are any Level 1 nodes actually Level 2 concepts?
- Are Level 2 nodes comparable in granularity?
- Are any major branches missing?
- Are any branches overloaded with too many different kinds of concepts?
- Are cross-cutting concepts documented rather than duplicated accidentally?
- Would a reviewer be able to critique the structure clearly?

## Out of scope

This role should not:

- add detailed Level 3 concepts unless explicitly asked,
- redesign concept types unless a structural problem requires it,
- introduce products, companies, model versions, or temporary market labels.

## Output format

```text
Taxonomy Architect Review

Executive Summary
- Overall judgment
- Readiness for next step
- Biggest structural risks

Structural Issues
- Level 1 issues
- Level 2 issues
- Cross-cutting branch issues
- Balance and granularity issues

Missing or Misplaced Concepts
- Missing branches
- Misplaced nodes
- Duplicates and overlaps

Recommended Changes
- Must fix
- Should fix soon
- Can wait
- Too early / deeper-level work
- Optional future expansion

Final Recommendation
```