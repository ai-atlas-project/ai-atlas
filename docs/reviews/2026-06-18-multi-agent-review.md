# Multi-Agent Review — 2026-06-18

## Scope

Read-only review of the current AI Atlas repository state after adding documented review-agent roles.

Primary source files:

- `README.md`
- `docs/project-notes.md`
- `taxonomy/ai-taxonomy-l1-l2.md`
- `taxonomy/ai-taxonomy-l1-l2.json`
- `taxonomy/ai-taxonomy-principles.md`
- `taxonomy/concept-types.md`

This report does not modify the taxonomy itself.

## Executive Summary

Overall recommendation: proceed after small cleanup.

The taxonomy direction is sound for a v0.1 Level 1 and Level 2 draft. The current structure is broad, stable enough for review, and aligned with the project goal of creating a clean hierarchy before Level 3 expansion.

The biggest immediate risk is repository consistency: a small number of naming and hierarchy-level terminology changes appear to have been applied in Markdown/project notes but not fully propagated into JSON.

## Agreements Across Reviewers

### John — Senior AI Reviewer

- The Level 1 direction is broadly correct for a modern AI map.
- The project should not rush into Level 3 until consistency issues are cleaned up.
- Cross-cutting branches such as `Generative AI`, `Human-AI Interaction`, and `AI Safety, Alignment and Governance` are defensible as major Level 1 areas if they remain explicitly typed as cross-cutting where appropriate.

### Taxonomy Architect

- The overall Level 1 structure is reviewable.
- Several Level 2 branches mix subfields, methods, model families, application areas, and system patterns. This is acceptable under the AI Atlas model only because concept type is tracked separately.
- The next structural step should be consistency cleanup, not taxonomy expansion.

### Concept Type Auditor

- The project correctly separates hierarchy depth from concept type in principle.
- The main risk is terminology drift: `Level 2` is described as `Subfield` in JSON while project notes refer to `Main Subarea`.
- Mixed Level 2 concept types are acceptable, but reviewers need clear documentation that this is intentional.

### Ontology and Knowledge Graph Reviewer

- The tree is a useful primary structure, but several areas will eventually need cross-links: foundation models, generative AI, agents, human feedback, evaluation, interpretability, and knowledge graphs.
- Relationship modeling should wait until after Level 1 and Level 2 consistency is clean.

### Repo Consistency QA

- Markdown and JSON are not fully synchronized.
- The most visible mismatch is `AI User Experience and Trust` in Markdown/project notes versus `AI UX and Trust` in JSON.
- The hierarchy level name for Level 2 appears inconsistent across project notes and JSON.

### Documentation and Community Editor

- The README is clear enough for an early project.
- Review-agent docs and review process now make the project easier to review systematically.
- A future contribution guide should explain how to propose taxonomy changes and how review-agent findings are used.

## Disagreements or Trade-offs

### Cross-cutting Level 1 branches

Some reviewers would prefer stricter tree purity, while others accept cross-cutting Level 1 branches because they are important for modern AI understanding.

Recommended resolution: keep cross-cutting Level 1 branches, but ensure concept type metadata and documentation make their status explicit.

### Level 2 naming

`Subfield` is academically familiar, but `Main Subarea` may better describe mixed Level 2 nodes that include methods, paradigms, model families, system patterns, and application areas.

Recommended resolution: use one terminology consistently across JSON, Markdown, README, project notes, generated views, and future schema.

## Prioritized Action Plan

### Must fix

1. Synchronize `AI User Experience and Trust` across JSON and Markdown.
   - Markdown currently uses `AI User Experience and Trust`.
   - Project notes say `AI UX and Trust` was renamed to `AI User Experience and Trust`.
   - JSON still contains `AI UX and Trust` in the Human-AI Interaction branch.

2. Resolve Level 2 hierarchy name drift.
   - Project notes describe Level 2 terminology as `Main Subarea`.
   - JSON still defines Level 2 hierarchy level name as `Subfield`.
   - Choose one canonical term and update all files consistently.

### Should fix soon

1. Add a short contributor/review guide explaining how to submit taxonomy changes.
2. Add a PR template that asks contributors to identify affected hierarchy level, concept type, stability, and generated views.
3. Add a lightweight validation script for duplicate names, JSON/Markdown drift, required fields, and allowed concept types.
4. Decide whether all generated views should be committed or regenerated only through scripts.

### Can wait

1. Add formal relationship metadata for cross-cutting concepts.
2. Add aliases or alternate names for common terminology variants.
3. Add a stable review report index under `docs/reviews/`.

### Too early / deeper-level work

1. Detailed Level 3 expansion.
2. Full ontology / graph schema.
3. Product, company, model-version, or benchmark-level taxonomy nodes.
4. Public website or interactive graph.

### Optional future expansion

1. Add role-specific Codex prompts under `docs/review-agents/prompts/`.
2. Add example reviews for common change types.
3. Add a taxonomy decision log.

## Suggested Patch Plan

### Patch 1 — Consistency cleanup

- Update JSON/Markdown/project notes so `AI User Experience and Trust` is consistent.
- Resolve canonical Level 2 hierarchy level name.
- Re-check generated Markmap and Mermaid views.

### Patch 2 — Review workflow support

- Add a PR template for taxonomy changes.
- Add a short `docs/contributing.md` or `docs/contribution-guidelines.md`.

### Patch 3 — Validation foundation

- Add a minimal validation script for required fields, duplicate labels, and JSON/Markdown synchronization.

## Final Recommendation

Proceed after small cleanup.

Do not expand to Level 3 until the two must-fix consistency issues are resolved and the generated views are checked.