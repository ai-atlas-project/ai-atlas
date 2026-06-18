# Review Process

AI Atlas reviews should be systematic, repository-grounded, and easy to repeat.

The goal is not to let agents make final decisions automatically. The goal is to use documented reviewer roles to produce clearer human decisions and smaller repository changes.

## Source of truth

Use the current repository state as the source of truth.

Core files include:

- `taxonomy/ai-taxonomy-l1-l2.json`
- `taxonomy/ai-taxonomy-l1-l2.md`
- `taxonomy/ai-taxonomy-principles.md`
- `taxonomy/concept-types.md`
- `taxonomy/visual-grammar.md`
- `docs/project-notes.md`
- `README.md`
- generated Obsidian, Markmap, and Mermaid views when consistency matters

## Standard review sequence

1. Run John — Senior AI Reviewer.
2. Run Taxonomy Architect.
3. Run Concept Type Auditor.
4. Run Ontology and Knowledge Graph Reviewer.
5. Run Repo Consistency QA.
6. Run Documentation and Community Editor.
7. Run Consolidated Reviewer to merge the findings.
8. Decide which recommendations to accept.
9. Apply accepted changes in small, focused patches.
10. Re-run consistency checks after changes.

## Review stages

### Stage 1 — Read-only review

Use agents to inspect the repository without modifying files.

Recommended Codex prompt:

```text
Use the current repository state as the source of truth.

Read docs/review-agents/*.md and run the standard AI Atlas review sequence from docs/review-process.md.

Do not modify files.

Produce a consolidated review report with:
- Executive Summary
- Agreements Across Reviewers
- Disagreements or Trade-offs
- Prioritized Action Plan
- Suggested Patch Plan
- Final Recommendation
```

### Stage 2 — Human decision

Decide which items are accepted, rejected, postponed, or need more review.

Use the standard categories:

- Must fix
- Should fix soon
- Can wait
- Too early / deeper-level work
- Optional future expansion

### Stage 3 — Focused patch

Apply only accepted changes.

Recommended Codex prompt:

```text
Apply only the accepted changes from the latest consolidated AI Atlas review.

Keep the patch small and focused.
Do not introduce Level 3 concepts unless explicitly required.
Update JSON and Markdown consistently.
Update generated views only if the repository already has scripts or documented generation steps.
Run available validation or tests if present.
Show a concise summary of changed files.
```

### Stage 4 — Consistency QA

After every focused patch, run Repo Consistency QA.

Check:

- JSON and Markdown taxonomy alignment,
- generated views,
- links,
- naming consistency,
- concept type consistency,
- roadmap/status consistency.

## When to use focused reviews

Use a single reviewer role when the question is narrow.

Examples:

- Use Taxonomy Architect for hierarchy placement questions.
- Use Concept Type Auditor for hierarchy/type confusion.
- Use Repo Consistency QA for generated files, links, and validation.
- Use Documentation and Community Editor for README, contribution, and public-facing clarity.

Use the full multi-agent sequence before major milestones such as:

- adding Level 3,
- publishing a public preview,
- changing the concept type model,
- changing visual grammar,
- introducing contribution or governance process.

## Repository change rules

- Do not modify the repository during read-only review.
- Keep commits small and focused.
- Separate taxonomy changes from documentation changes when practical.
- Separate canonical taxonomy changes from generated view updates when practical.
- Prefer stable, academically recognizable, technically useful names.
- Do not add specific products, company names, temporary marketing labels, or concrete model versions unless explicitly in scope.
- Preserve AI Atlas as an open, community-reviewed taxonomy and knowledge map.