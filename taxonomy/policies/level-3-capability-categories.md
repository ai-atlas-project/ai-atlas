# Level 3 Capability Categories

Status: draft policy / under review / not canonical

Source issue: [#19 — Review capability-category policy for Level 3 drafts](https://github.com/ai-atlas-project/ai-atlas/issues/19)

## Purpose

Define how capability-oriented candidates should be reviewed before they become hierarchy nodes.

## Draft proposal

Capability-oriented concepts should not automatically become taxonomy hierarchy nodes.

First classify each candidate as one of:

- `Task`
- `Method`
- `Model Family`
- `System Pattern`
- `Evaluation Concept`
- facet or attribute
- deferred capability category

Hierarchy level and concept type remain separate decisions.

## Current examples

- `Long-Context Language Models`: deferred.
- `Controlled Text Generation`: deferred.

These candidates remain useful review concepts, but their boundaries and representation are not stable enough for structured node creation.

## Representation options

A capability-oriented concept may be represented as:

- a facet or attribute;
- a relation note;
- a Level 4 or deeper concept;
- a Level 3 node only when the concept is stable, clearly bounded, and structurally useful.

## Review criteria

Before proposing a Level 3 node, determine:

- whether the candidate describes what a system can do or what kind of thing it is;
- whether it has a stable academic or technical boundary;
- whether it overlaps multiple model families or methods;
- whether it is better expressed through evaluation or relation metadata;
- whether it is broad enough for Level 3 rather than an implementation detail.

No structured nodes should be created for deferred capability categories until this policy is approved.

## Open questions

- Should facets become first-class structured metadata?
- Can capability categories ever be primary hierarchy nodes?
- How should capabilities link to evaluation concepts?
- What criteria distinguish Level 3 capabilities from deeper variants?
