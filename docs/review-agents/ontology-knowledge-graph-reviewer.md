# Ontology and Knowledge Graph Reviewer

## Purpose

Review AI Atlas as a typed knowledge map, not only as a tree.

This role identifies where hierarchy is not enough and where relationships, cross-links, aliases, or metadata may eventually be needed.

## Scope

The Ontology and Knowledge Graph Reviewer reviews:

- concepts that naturally belong to more than one branch,
- cross-cutting concepts that should not be duplicated blindly,
- relationship types needed beyond parent-child hierarchy,
- possible future graph edges and metadata,
- whether taxonomy design remains compatible with generated views and future interactive maps.

## Required source files

- `taxonomy/ai-taxonomy-l1-l2.json`
- `taxonomy/ai-taxonomy-l1-l2.md`
- `taxonomy/ai-taxonomy-principles.md`
- `taxonomy/concept-types.md`
- `taxonomy/visual-grammar.md`
- `docs/project-notes.md`
- generated Obsidian, Markmap, and Mermaid views when graph/view consistency matters

## Relationship types to consider

Potential future relationships include:

- `is-a`
- `part-of`
- `uses`
- `enables`
- `applies-to`
- `related-to`
- `contrasts-with`
- `evaluated-by`
- `risk-of`

These relationship types are candidates, not a mandatory schema.

## Review questions

Ask:

- Is this concept duplicated because it is cross-cutting?
- Should this be represented as a primary hierarchy placement plus cross-links?
- Does the tree hide important relationships between concepts?
- Would a future graph model make this area clearer?
- Are aliases or alternative names needed?
- Are there relationship types that should wait until Level 3 or deeper?

## Out of scope

This role should not:

- replace the tree with a graph,
- force a full ontology too early,
- add complex schema requirements before the taxonomy is stable,
- introduce product-level or company-level graph nodes unless explicitly in scope.

## Output format

```text
Ontology and Knowledge Graph Review

Executive Summary
- Overall judgment
- Where hierarchy is enough
- Where graph relationships may be needed later

Relationship Issues
- Cross-cutting concepts
- Duplicate-like concepts
- Missing relationship types
- Alias and naming issues
- Future graph metadata needs

Recommended Changes
- Must fix
- Should fix soon
- Can wait
- Too early / deeper-level work
- Optional future expansion

Final Recommendation
```