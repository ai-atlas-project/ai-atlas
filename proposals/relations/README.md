# L0–L2 relation pilot for review

**Status: proposed design and evidence-backed candidates; not adopted policy or canonical relations.**

Tracks [#52](https://github.com/ai-atlas-project/ai-atlas/issues/52). All four active assertions have `review_status: "pending"`. One earlier candidate is [deferred for concept-boundary review](deferred-text-generation-nlg.md). Passing validation or opening this PR does not approve them. This proposal does not change canonical concepts, hierarchy, IDs, types, definitions, Level 3 status, or the live site's existing editorial connections.

## Proposed storage and identity

The review dataset is [l0-l2-pilot.json](l0-l2-pilot.json), outside `taxonomy/`. It pins the current canonical JSON by SHA-256 so a source change requires an explicit reference/scope review rather than a silent refresh. Relation IDs are independent of concept names and should remain stable through wording-only edits.

If separately approved, the proposed eventual location for accepted assertions is `taxonomy/relations/l0-l2.json`. That file does not exist in this pilot. It would be a sidecar keyed by existing concept IDs, not embedded hierarchy children and not another source of concept definitions. Promotion needs an explicit reviewed PR and an approved-data validator; toggling a flag in this pilot is deliberately rejected.

`source_id` and `target_id` must resolve to existing L0–L2 canonical IDs. The corresponding names must match exactly and exist only to make review readable. `target_status: "canonical"` describes the referenced concept, **not** the relation's approval status. Papers, books, repositories, products, and model releases are evidence, not graph targets. There are no private, unresolved, name-only, external, or invented Level 3 targets in the pilot.

This is a narrowly scoped sidecar proposal. It does not approve the broader draft [relation-target typing policy](../../taxonomy/policies/relation-target-typing.md) or migrate private structured drafts.

## Initial vocabulary and direction

Reuse a small subset of the existing [relation semantics](../../taxonomy/relations.md); do not introduce the underscore spellings suggested in the original issue.

| Type | Direction | Reading and scope |
| --- | --- | --- |
| `uses` | Source → target | The source uses the target as a method in the explicitly stated setup; not an assertion that every implementation must do so |
| `applies-to` | Source → target | The source method or concern applies to the target in the specified setting |
| `related-to` | Symmetric | A specifically explained association when the existing more precise types do not fit; never an unexplained catch-all |

Store a symmetric edge once. The validator rejects its reversed duplicate. Consumers may derive inverse labels for navigation but must not persist a second assertion. The pilot excludes `alternative-parent`, broader/narrower links, inverse duplicates, and proposed new types such as `overlaps_with` or `uses_methods_from`. They need separate decisions if later required.

`related-to` remains supported by the proposed validator, but has no active candidate after deferring `rel-pilot-004`. Its duplicate checks use synthetic test data rather than treating that deferred edge as accepted evidence.

## Four candidate assertions

These are technical pre-review conclusions, not community acceptance. Each row is independently rejectable or revisable; acceptance is not all-or-nothing. Full scope, rationale, source URL, and evidence locator are in the JSON.

| ID | Proposed connection | Boundary checked | Evidence | Remaining review question |
| --- | --- | --- | --- | --- |
| `rel-pilot-001` | Autoregressive Large Language Models **can use** Self-Supervised Learning **during pretraining** | Predict the next token from preceding tokens, with targets supplied by the text; not every training/adaptation stage | [Brown et al., sections 2 and 5](https://arxiv.org/abs/2005.14165) | Is this training-stage scope sufficiently clear at model-family level? |
| `rel-pilot-002` | Generative AI **can use** Deep Learning **in deep neural implementations** | A GAN is an implementation example; not a universal dependency or subtype claim | [Goodfellow et al., abstract and section 3](https://arxiv.org/abs/1406.2661) | Is this scoped implementation option useful at the existing concept level? |
| `rel-pilot-003` | Robot Learning **can use** Reinforcement Learning **as one approach** | Reward-objective learning; learning from demonstrations and other approaches need not use RL | [Kober et al., abstract and survey](https://publications.ri.cmu.edu/reinforcement-learning-in-robotics-a-survey); [Argall et al., abstract](https://publications.ri.cmu.edu/a-survey-of-robot-learning-from-demonstration) | Is the stated scope sufficient to avoid equating these fields? |
| `rel-pilot-005` | Bias and Fairness **applies to** Machine Learning **in a specified social context** | Analysis across data, models, and deployment; criteria depend on the setting and no metric is universal | [Barocas et al., introduction](https://fairmlbook.org/introduction.html) | Is the connection useful enough at this broad target level? |

The papers establish examples or scope. Mapping those observations into AI Atlas relation assertions is our proposed interpretation. The readable wording above preserves qualifiers; the stored relation types remain `uses` and `applies-to`.

`rel-pilot-004` (Text Generation / Natural Language Generation) is absent from the active JSON. Literature uses the terms with overlapping or synonymous meanings, so a `related-to` edge would prematurely imply a settled boundary between distinct concepts. The [deferred review note](deferred-text-generation-nlg.md) records the evidence and the questions to resolve. Its ID remains reserved; `rel-pilot-005` is not renumbered. Deferral neither merges the concepts nor approves an alias or a new relation type.

## Validation contract

Run with Node.js 20 or later:

```sh
node scripts/validate-canonical-l1-l2-json.mjs
node scripts/validate-relation-proposal.mjs
node --test tests/relation-proposal.test.mjs
```

The proposed CI steps validate the dataset and run negative tests. Checks reject:

- unknown or extra fields, unsupported schema/type/status, or a changed taxonomy snapshot;
- missing/unknown IDs, mismatched names, private targets, or Level 3 endpoints;
- self-links, duplicate relation IDs, repeated edges, reversed symmetric duplicates, or direct hierarchy-edge duplicates;
- absent evidence, missing source references/locators/support, insecure source URLs, unused sources, or empty scope/rationale;
- canonical/approved flags that would bypass human review.

The pilot is bounded to 1–10 edges. A larger dataset requires revisiting this review scope. Structural validation does not establish scientific truth, check source availability over the network, or substitute for semantic review. Reviewers must read the cited passages and verify direction, claim strength, and limitations.

## Review and promotion decisions

Before any merge that adopts this design or any canonical promotion, the maintainer should explicitly decide:

1. Accept or revise the sidecar location, existing three-type subset, direction rules, and validation contract.
2. Accept, revise, or reject each candidate independently, recording the reviewer decision and rationale in the PR review. Pending or rejected assertions remain outside canonical data.
3. For any later canonical promotion, define accepted-record review metadata and the approved-data validator in that explicit PR. No script here makes that transition.

Keep #52 open while these decisions are pending. This draft PR provides an executable review package, not completion of the governed relation layer.

## Future display contract, subject to approval

The current website, Obsidian, Markmap, and Mermaid generators do not read this proposal. After approval, a separate implementation should:

- treat `scope` as part of the assertion: show its complete text alongside the relationship, with its type, source references, and review status; a tooltip alone is insufficient;
- preserve qualifiers such as "can use", "during pretraining", and "one approach" in shortened labels; an unqualified `A uses B` label is not a complete statement of these candidates;
- preserve the complete `scope` with every relation in Markdown, Obsidian, diagram, and structured exports; a diagram that cannot display it must include an adjacent keyed scope table or omit the relationship;
- present symmetric associations without implying an arrow direction;
- keep hierarchy and relation views independently selectable; never move nodes or infer new parents from an edge;
- put any approved Obsidian connections in a separate typed section, leaving Parent/Children unchanged;
- show evidence and limits alongside each relationship rather than reducing it to an unqualified arrow;
- avoid merging the experimental D3 overlay or Fieldguide editorial links automatically into canonical data.

Any future consumer must include a rendering/export check that scope survives display and export. The current validator requires substantive `scope` text, but cannot verify a renderer that does not yet exist. These requirements do not enable any current consumer or promote the deferred candidate.

No transitive closure is implied: `A uses B` and `B uses C` do not automatically justify `A uses C`. The familiar AI → ML → Deep Learning → Generative AI chain must not be rendered as one homogeneous containment chain: the first hierarchy links and the final scoped method-use link have different meanings and directions.
