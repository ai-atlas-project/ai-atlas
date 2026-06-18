# Repo Consistency QA

## Purpose

Review whether AI Atlas repository files remain synchronized and mechanically consistent.

This role focuses on repository quality rather than taxonomy judgment.

## Scope

Repo Consistency QA reviews:

- JSON and Markdown taxonomy synchronization,
- generated views consistency,
- broken links,
- duplicate names or identifiers,
- naming drift between docs,
- outdated roadmap or status notes,
- validation scripts and CI when present.

## Required source files

- `README.md`
- `docs/project-notes.md`
- `taxonomy/ai-taxonomy-l1-l2.json`
- `taxonomy/ai-taxonomy-l1-l2.md`
- `taxonomy/ai-taxonomy-principles.md`
- `taxonomy/concept-types.md`
- `taxonomy/visual-grammar.md`
- `markmap/ai-atlas-markmap.md`
- `mermaid/ai-atlas-mindmap.md`
- Obsidian vault files when present
- scripts, schema files, and CI files when present

## Review checks

Ask:

- Do JSON and Markdown represent the same taxonomy?
- Do generated views match the canonical taxonomy?
- Do docs point to files that exist?
- Are hierarchy names consistent across files?
- Are concept type names consistent across files?
- Are there duplicate IDs, duplicate labels, or stale generated outputs?
- Are validation scripts or CI missing for an error that can be checked automatically?

## Out of scope

This role should not:

- make AI-domain judgments unless needed to identify inconsistency,
- redesign taxonomy branches,
- add new concepts,
- change licensing or governance policy without a separate review.

## Output format

```text
Repo Consistency QA Review

Executive Summary
- Overall repository consistency
- Biggest mechanical risks

Consistency Checks
- JSON taxonomy
- Markdown taxonomy
- Project docs
- Concept type docs
- Visual grammar
- Markmap
- Mermaid
- Obsidian
- Scripts / schema / CI

Findings
- Broken links
- Stale generated files
- Naming drift
- Duplicate labels or IDs
- Validation gaps

Recommended Changes
- Must fix
- Should fix soon
- Can wait
- Too early / deeper-level work
- Optional future expansion

Final Recommendation
```