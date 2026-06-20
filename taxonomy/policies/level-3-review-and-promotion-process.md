# Level 3 Review and Promotion Process

Status: draft policy / under review / not canonical

Source issue: [#21 — Define public Level 3 review and promotion process](https://github.com/ai-atlas-project/ai-atlas/issues/21)

## Purpose

Define distinct review states and minimum requirements before Level 3 content can become canonical.

## Draft states

### Private draft

Private planning, placement review, structured node drafting, and validation work.

Requirements:

- clearly marked private draft and not canonical;
- one proposed primary parent;
- concept type and placement uncertainty recorded;
- products, companies, concrete model versions, and temporary vendor labels excluded by default;
- source plan, review evidence, and promotion blockers recorded;
- no canonical files or generated views changed.

### Public draft proposal

A public, reviewable proposal that summarizes candidate Level 3 content without promoting it.

Requirements:

- clearly marked public draft proposal and not canonical;
- target Level 1 and Level 2 branch identified;
- proposed direct children separated from cross-branch relations;
- deferred and rejected candidates documented;
- public review questions included;
- linked to the relevant issue and PR;
- canonical files and generated views unchanged.

### Canonical Level 3

Approved Level 3 taxonomy content incorporated through an explicit promotion change.

Requirements:

- all promotion blockers resolved or explicitly accepted;
- public feedback reviewed and decisions documented;
- canonical data change reviewed separately from draft preparation;
- validators and schemas ready for the promoted data;
- generated views updated only after canonical data changes.

## Required review sequence

1. Max — practical usefulness
2. Clara — naming and academic stability
3. Mira — hierarchy, concept type, and relations
4. Noah — learnability
5. Vera — repository and generated-view consistency
6. John — final promotion verdict

## Promotion checklist

- stable ID convention resolved;
- relation target typing resolved;
- structured schema resolved;
- cross-branch file placement resolved;
- public feedback considered;
- public issue and PR history linked;
- canonical change scope explicitly identified;
- generated views updated only after canonical data changes.

## Current restriction

Current Level 3 drafts must not be promoted yet.

This policy draft does not authorize canonical changes.

## Open questions

- What minimum public review period is required?
- Which files must change in a canonical promotion PR?
- Is community sign-off required beyond John’s verdict?
- Should promotion occur branch-by-branch or through a complete Level 3 release?
- What rollback or deprecation process applies after promotion?
