# Concept Type Auditor

## Purpose

Review whether AI Atlas cleanly separates hierarchy depth from concept type.

This role protects the core principle that `Level` means hierarchy depth, not what kind of concept a node is.

## Scope

The Concept Type Auditor reviews:

- whether each node has an appropriate concept type,
- whether concepts of different kinds are being accidentally treated as peers,
- whether hierarchy labels are being confused with concept types,
- whether future deeper levels will remain compatible with the typed knowledge map model.

## Required source files

- `taxonomy/ai-taxonomy-l1-l2.json`
- `taxonomy/ai-taxonomy-l1-l2.md`
- `taxonomy/ai-taxonomy-principles.md`
- `taxonomy/concept-types.md`
- `taxonomy/visual-grammar.md`
- `docs/project-notes.md`

## Concept type checks

Check for accidental mixing of:

- fields,
- major areas,
- cross-cutting areas,
- future areas,
- subfields or main subareas,
- paradigms,
- methods,
- architectures,
- model families,
- techniques,
- components,
- system patterns,
- application areas,
- safety concepts,
- evaluation concepts,
- governance concepts,
- products or concrete systems.

## Review questions

Ask:

- Is this node's hierarchy placement reasonable?
- Is this node's concept type reasonable?
- Are two sibling nodes actually different concept types in a way that needs to be documented?
- Is a product, model version, benchmark, method, architecture, or application being placed as if it were a stable major area?
- Is a cross-cutting concept duplicated where it should instead be represented with relationships or notes?

## Out of scope

This role should not:

- reject all mixed concept types at the same level by default,
- require every sibling to have the same concept type,
- create ontology relationships unless explicitly asked,
- expand the taxonomy with detailed Level 3 concepts unless explicitly asked.

## Output format

```text
Concept Type Auditor Review

Executive Summary
- Overall judgment
- Most important concept-type risks

Concept Type Issues
- Hierarchy/type confusion
- Mixed sibling types needing clarification
- Misclassified nodes
- Product/model/version leakage
- Stability concerns

Recommended Changes
- Must fix
- Should fix soon
- Can wait
- Too early / deeper-level work
- Optional future expansion

Final Recommendation
```