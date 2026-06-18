# Review Agents

AI Atlas uses documented review-agent roles to make taxonomy review more systematic and repeatable.

These agents are reviewer personas and checklists, not autonomous maintainers. They help humans and coding assistants review the current repository state from different perspectives.

## Source of truth

Review agents must use the repository as the source of truth, especially:

- `taxonomy/ai-taxonomy-l1-l2.json`
- `taxonomy/ai-taxonomy-l1-l2.md`
- `taxonomy/ai-taxonomy-principles.md`
- `taxonomy/concept-types.md`
- `taxonomy/visual-grammar.md`
- `docs/project-notes.md`
- `README.md`
- generated Obsidian, Markmap, and Mermaid views when consistency matters

## Core review agents

- [John — Senior AI Reviewer](john-senior-ai-reviewer.md)
- [Taxonomy Architect](taxonomy-architect.md)
- [Concept Type Auditor](concept-type-auditor.md)
- [Ontology and Knowledge Graph Reviewer](ontology-knowledge-graph-reviewer.md)
- [Repo Consistency QA](repo-consistency-qa.md)
- [Documentation and Community Editor](documentation-community-editor.md)
- [Iris — Visual Map and Print Design Reviewer](visual-map-print-designer.md)
- [Consolidated Reviewer](consolidated-reviewer.md)

## Shared review principles

All review agents must respect the AI Atlas model:

- Level means hierarchy depth, not concept type.
- Concept type is separate from hierarchy level.
- Prefer stable, academically recognizable, technically useful names.
- Avoid mixing research fields, methods, architectures, applications, products, and model versions without clearly identifying their concept types.
- Avoid adding specific products, company names, temporary marketing labels, or concrete model versions unless they are explicitly in scope.
- Preserve AI Atlas as an open, community-reviewed taxonomy and knowledge map.

## Standard recommendation categories

Every review should separate findings into:

- Must fix
- Should fix soon
- Can wait
- Too early / deeper-level work
- Optional future expansion

## Using these roles with Codex

A recommended Codex prompt pattern:

```text
Use the current repository state as the source of truth.

Read docs/review-agents/<agent-file>.md and apply that reviewer role to the AI Atlas taxonomy.

Do not modify files unless explicitly asked.

Return findings using the required output format from the agent file.
```

For direct changes, keep patches small and focused.
