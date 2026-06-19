# Relations

AI Atlas uses a primary navigational hierarchy plus a typed concept graph.

The hierarchy gives each concept a readable place in the public taxonomy. Relations add non-tree connections between concepts when a strict tree would hide important structure, create duplicates, or force misleading placements.

This document defines the first public relation model for AI Atlas. It does not add Level 3 taxonomy nodes.

## Core rule

A canonical taxonomy node should normally have one primary parent in the hierarchy.

Relations do not replace the primary parent. They record additional structure around a concept: related areas, alternative placements, implementation links, part-whole links, application links, or evaluation links.

Cross-links should not be used to hide unresolved hierarchy problems. If a concept has no defensible primary parent yet, keep it in draft review instead of forcing it into the canonical tree.

## Relation direction

Some relations are directional:

- `broader-than` / `narrower-than`
- `part-of` / `has-part`
- `uses` / `used-by`
- `implemented-by`
- `applies-to`
- `evaluates`
- `alternative-parent`

`related-to` is symmetric and should be used sparingly when a more precise relation does not fit.

## Allowed relation types

### `related-to`

Definition: A general non-hierarchical association between two concepts.

Use when two concepts are meaningfully connected but the relationship is not clearly part-whole, use, application, evaluation, implementation, or parentage.

Do not use when a more precise relation type is available.

Examples:

- `Representation Learning` related-to `Embeddings`.
- `Human-AI Interaction` related-to `AI Safety, Alignment and Governance`.

### `broader-than`

Definition: The source concept is more general than the target concept.

Use when recording a general-to-specific relationship outside the main parent-child hierarchy, especially in draft or graph views.

Do not use as a substitute for the canonical `children` list when the relationship is already represented by the primary hierarchy.

Examples:

- `Machine Learning` broader-than `Supervised Learning`.
- `Computer Vision and Perception` broader-than `Object Detection` in a future draft context.

### `narrower-than`

Definition: The source concept is more specific than the target concept.

Use as the inverse of `broader-than` when a concept is a more specific form of another concept.

Do not use to create duplicate hierarchy branches.

Examples:

- `Supervised Learning` narrower-than `Machine Learning`.
- `Object Detection` narrower-than `Computer Vision and Perception` in a future draft context.

### `part-of`

Definition: The source concept is a component, phase, or substructure of the target concept.

Use when the source is structurally or procedurally part of a larger concept.

Do not use for loose topical association.

Examples:

- `Retriever` part-of `Retrieval-Augmented Generation` in a future draft context.
- `Reward Model` part-of `RLHF / Preference Learning` in a future draft context.

### `has-part`

Definition: The source concept contains the target concept as a component, phase, or substructure.

Use as the inverse of `part-of`.

Do not use when the relationship is merely that one method uses another method.

Examples:

- `Retrieval-Augmented Generation` has-part `Retriever` in a future draft context.
- `AI Agent` has-part `Planning Component` in a future draft context.

### `uses`

Definition: The source concept makes use of the target concept as a method, technique, component, representation, or resource.

Use when one concept depends on, applies, or incorporates another concept without being structurally identical to it.

Do not use when the relationship is part-whole; use `part-of` or `has-part` instead.

Examples:

- `Retrieval-Augmented Generation` uses `Information Retrieval` in a future draft context.
- `Large Language Models` uses `Self-Supervised Learning` in a future draft context.

### `used-by`

Definition: The source concept is used by the target concept.

Use as the inverse of `uses`.

Do not use when a more precise relation such as `implemented-by` or `evaluates` is intended.

Examples:

- `Information Retrieval` used-by `Retrieval-Augmented Generation` in a future draft context.
- `Embeddings` used-by `Semantic Search` in a future draft context.

### `applies-to`

Definition: The source concept is applied to, or is relevant for, the target concept or domain.

Use for methods, techniques, evaluation approaches, safety concepts, or governance concepts that apply across multiple areas.

Do not use for product-market positioning or vague relevance.

Examples:

- `Robustness` applies-to `Computer Vision and Perception`.
- `Evaluation, Measurement and Benchmarking` applies-to `Foundation Models and General-Purpose AI`.

### `evaluates`

Definition: The source concept measures, tests, benchmarks, interprets, or audits the target concept.

Use when a concept is specifically about evaluation or assessment of another concept.

Do not use for general comparison or commentary.

Examples:

- `Evaluation, Measurement and Benchmarking` evaluates `Foundation Models and General-Purpose AI`.
- `Interpretability` evaluates `Deep Learning`.

### `implemented-by`

Definition: The source concept may be implemented by, instantiated through, or realized using the target concept.

Use when connecting abstract methods, architectures, system patterns, or components to lower-level mechanisms or concrete implementations.

Do not use for specific commercial products or concrete model versions at levels where those are out of scope.

Examples:

- `Sequence Modeling` implemented-by `Transformers` in a future draft context.
- `Neural Machine Translation` implemented-by `Encoder-Decoder Architectures` in a future draft context.

### `alternative-parent`

Definition: The target concept is a plausible non-primary parent for the source concept.

Use when a concept has a chosen primary parent but also has other plausible placements that should be documented for review.

Do not use to duplicate the same canonical concept under multiple parents.

Examples:

- `Transformers` alternative-parent `Foundation Models and General-Purpose AI` if its primary parent is under `Deep Learning` in a future draft context.
- `Embeddings` alternative-parent `Natural Language and Speech` if its primary parent is under `Representation Learning` in a future draft context.

## Primary parent vs relations

Use the primary hierarchy for the main navigational answer to the question: where should a reader first look for this concept?

Use relations for secondary questions:

- What else is this concept related to?
- What does it use?
- What is it part of?
- What applies to it?
- What evaluates it?
- What other parent might reviewers reasonably consider?

A relation should make the graph clearer. If it makes the taxonomy harder to understand, it should stay out of the canonical public model until reviewed.

## Duplicate concept rule

Do not create multiple canonical nodes for the same concept just because it touches several branches.

Prefer:

1. one canonical node,
2. one primary parent,
3. documented aliases when needed,
4. documented relations or alternative parents when needed.

Duplicates may be allowed only when the terms look similar but represent genuinely different concepts, or when a deliberate exception is documented during review.

## Draft and canonical use

During draft work, relations may be used to record uncertainty and review notes.

In canonical public taxonomy, relations should be stable, intentional, and useful for readers or generated views.

Relations should not be treated as a way to promote immature concepts into the public taxonomy.
