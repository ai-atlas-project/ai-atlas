# Approval package: four L0–L2 relations

**Decision requested; not adopted policy, recorded approval, or canonical data.**

This package follows [PR #89](https://github.com/ai-atlas-project/ai-atlas/pull/89) and supports [issue #52](https://github.com/ai-atlas-project/ai-atlas/issues/52). Preparing or merging this document alone grants no approval. Existing proposal records remain pending.

## Exact review baseline

- Public repository commit: `6f89aa87832818e6fec2131c5bb4ae924651cb3c`.
- Proposal: [l0-l2-pilot.json](l0-l2-pilot.json), schema version 1.
- Canonical taxonomy SHA-256: `d10262e96f76c7b2b822f4f46c1ff758ea2d546aa753f4fab84d6193a3cda63a`.
- Four assertions: `rel-pilot-001`, `rel-pilot-002`, `rel-pilot-003`, `rel-pilot-005`; five evidence sources.
- The full English scope paragraphs below are copied without alteration from that baseline. They, not an abbreviated arrow label, are the statements offered for approval.

## Requested decisions

The maintainer may accept, revise, or reject each item independently. All decisions below are currently **pending**.

| Decision | Recommendation | Effect of explicit approval |
| --- | --- | --- |
| A — Assertion meaning | Accept the four exact scoped assertions below | Authorize preparation of their canonical promotion with recorded provenance |
| B — Storage and vocabulary | Separate file `taxonomy/relations/l0-l2.json`; stable existing concept and relation IDs; directed `uses` and `applies-to` for this release | Authorize the bounded storage and validation design below |
| C — Review evidence | Record the actual human reviewer, decision reference, rationale, date, and reviewed revision | Make later acceptance auditable; agent advice is supporting analysis, not human approval |
| D — Presentation | Require complete scope, evidence and status alongside relationships and in exports | Authorize implementation planning for qualified, traceable displays |
| E — Deferred pair | Keep `rel-pilot-004` excluded and its ID reserved | No alias, merge, rename or relationship decision for Text Generation / NLG |

The recommendation narrows the first accepted dataset to its two used types. The proposal validator may retain symmetric `related-to` testing; approval of this package would not authorize any canonical `related-to` edge. This is not adoption of the broader draft relation-target typing policy, private migrations, or new Level 3 concepts.

## Assertions offered for approval

### rel-pilot-001: Large Language Models → Self-Supervised Learning

- Stored type: `uses`.
- Endpoints: `ai:large-language-models` → `ai:self-supervised-learning`.
- Recommended decision: accept this exact scoped assertion for a separately reviewed promotion PR.
- Maintainer decision: **pending**.

Autoregressive large language models can be pretrained with a self-supervised objective that predicts the next token from preceding tokens, using the training text itself to supply the target. This relation concerns pretraining, not every subsequent adaptation stage or every language-model design.

Rationale: Connect a model-family concept to the learning paradigm used in this pretraining example; do not classify all language-model training as self-supervised.

Evidence:
- [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165) — Abstract; Section 2 (Approach); Section 5 (Limitations). The paper describes autoregressive pretraining and explicitly discusses self-supervised prediction and its limits. The model release is evidence for a scoped method-use relation, not a new taxonomy node.

### rel-pilot-002: Generative AI → Deep Learning

- Stored type: `uses`.
- Endpoints: `ai:generative-ai` → `ai:deep-learning`.
- Recommended decision: accept this exact scoped assertion for a separately reviewed promotion PR.
- Maintainer decision: **pending**.

Generative AI can use deep-learning methods in deep neural implementations, including the neural GAN example cited here. This is an implementation option, not a universal dependency or a claim that Generative AI is a subtype of Deep Learning.

Rationale: Provide a useful cross-branch route from generation to one implementation family while retaining Generative AI as its existing Level 1 area.

Evidence:
- [Generative Adversarial Networks](https://arxiv.org/abs/1406.2661) — Abstract; Section 3 (Adversarial nets). The paper describes a generative model and discriminator implemented with multilayer perceptrons and trained by backpropagation. This supports the stated implementation example, not a universal hierarchy.

### rel-pilot-003: Robot Learning → Reinforcement Learning

- Stored type: `uses`.
- Endpoints: `ai:robot-learning` → `ai:reinforcement-learning`.
- Recommended decision: accept this exact scoped assertion for a separately reviewed promotion PR.
- Maintainer decision: **pending**.

Robot learning can use reinforcement learning to improve behavior with respect to a reward objective. This is one approach within robot learning; learning from demonstrations and other learning approaches need not use reinforcement learning.

Rationale: Connect the robotics branch to a relevant learning paradigm without making the two concepts equivalent or changing either primary parent.

Evidence:
- [Reinforcement Learning in Robotics: A Survey](https://publications.ri.cmu.edu/reinforcement-learning-in-robotics-a-survey) — Abstract and survey discussion of behavior generation. The authors survey reinforcement learning for robot behavior, including policy search and value-based methods, along with practical limits and prior knowledge.
- [A Survey of Robot Learning from Demonstration](https://publications.ri.cmu.edu/a-survey-of-robot-learning-from-demonstration) — Abstract: policy learning from example state-to-action mappings and policy-derivation methods. The survey describes learning robot policies from demonstrations using methods including function approximation, dynamics models, and plans. This supports the scope limit: robot learning need not use reinforcement learning; demonstration learning and reinforcement learning can also be combined.

### rel-pilot-005: Bias and Fairness → Machine Learning

- Stored type: `applies-to`.
- Endpoints: `ai:bias-and-fairness` → `ai:machine-learning`.
- Recommended decision: accept this exact scoped assertion for a separately reviewed promotion PR.
- Maintainer decision: **pending**.

Bias and fairness analysis applies to the data, models, and deployment decisions of machine-learning systems in a specified social context. Appropriate criteria depend on the setting, and no single metric establishes fairness universally.

Rationale: Show a cross-cutting assessment concern without implying that fairness is a subclass of machine learning or that only machine-learning systems raise fairness concerns.

Evidence:
- [Fairness and Machine Learning: Limitations and Opportunities — Introduction](https://fairmlbook.org/introduction.html) — Chapter 1: Introduction, especially the machine-learning loop and limitations. The authors examine disparities across the machine-learning decision process and explain the limits of technical fairness interventions in their surrounding social context.

## Proposed accepted-data contract

This describes future implementation; the accepted file and its validator are not created here.

1. Keep canonical hierarchy and concept definitions in their current source. Store accepted relations in the separate file above. Preserve the original four relation IDs through promotion; do not renumber 005 or reuse 004.
2. Use a versioned schema with dataset status `accepted` and `canonical: true`. Retain the proposal's taxonomy path/hash, source registry, endpoint IDs/names, type, scope, rationale and evidence. Each accepted relation has `review_status: "accepted"` and a required `review` object.
3. Proposed review fields: `reviewer` (actual human maintainer identity), `reviewed_at` (ISO-8601 date/time of their decision), `decision_url` (public HTTPS PR review or committed decision record), `reviewed_commit` (full revision SHA containing the reviewed assertion), and `rationale` (why this scoped claim was accepted). A private chat approval may be faithfully summarized in a public decision record only within the authorized publication scope; never invent a GitHub approval review or imply independent/community consensus.
4. Review the complete assertion including its evidence at the recorded revision. Any semantic change to endpoints, type, scope or evidence after approval requires renewed review. CI can check structure and revision references; a maintainer still verifies decision authenticity and semantic equivalence.
5. Require exact existing L0–L2 IDs and matching names, unique relation IDs and edges, valid direction, no self-links or primary hierarchy duplicates, substantial scope/rationale, resolvable evidence with locators/support, public HTTPS source URLs, and no unused sources. Reject unsupported types/statuses, unknown fields, missing review metadata and changed taxonomy hashes until reviewed.
6. Keep the proposal validator strict: it must continue to reject promotion flags. Implement a separate accepted-data entry point with shared structural checks where appropriate; never make the existing proposal become accepted by toggling a flag.
7. On promotion, freeze and label the proposal as historical review evidence with a link to the accepted dataset. Consumers use only the accepted dataset. Preserve the proposal's historical taxonomy hash; if the taxonomy later changes, distinguish historical validation from checks against current canonical references instead of silently rewriting the review baseline.

## Proposed display and export acceptance criteria

- Show the complete scope and evidence with each relationship; tooltip-only qualification fails acceptance.
- Short labels preserve qualifications: pretraining for 001, a possible deep neural implementation for 002, one learning approach for 003, and specified social context for 005.
- Every relation export includes its ID, type, endpoints, full scope, evidence and review status. Diagrams use an adjacent keyed scope table if they cannot display full text; otherwise omit the edge.
- Hierarchy remains independently selectable. No new parents, containment claims or inferred transitive relations are introduced.
- Do not automatically import existing Fieldguide editorial links or the experimental graph into the accepted dataset.
- Tests must show that pending/deferred records are excluded, scope/evidence survive rendering and export, and hierarchy output is unchanged.

## Implementation sequence after explicit decisions

1. Record decisions A–E and any per-relation exceptions against this exact package revision. A partial approval promotes only the explicitly accepted subset.
2. Prepare a small promotion PR: accepted dataset, decision provenance, narrowly scoped policy documentation, accepted-data validator/tests, and CI integration. Keep site integration separate so data acceptance can be reviewed on its own.
3. Prepare site and export integration using the accepted dataset, with a reviewable preview and tests for qualifiers, evidence, accessibility, and unchanged hierarchy. Merge/deploy only within the authorized implementation scope.
4. Reconcile issue #52's acceptance checklist against actual adopted policy and implemented behavior. Keep the issue open while its agreed requirements remain incomplete.

Text Generation / NLG review proceeds independently using [the deferred note](deferred-text-generation-nlg.md). It is not a blocker for the other four assertions and is not approved by this package.

## Verification of this package

Preparation checks: four IDs/types/endpoints and full scope paragraphs match the pinned pilot; every cited evidence item comes from that pilot; local Markdown targets exist in the baseline repository. This document changes no executable code, data status, taxonomy, generated views, or live-site behavior. Existing CI remains useful regression coverage, not proof of scientific correctness or human acceptance.
