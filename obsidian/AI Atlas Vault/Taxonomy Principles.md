# Taxonomy Principles

## 1. Prefer stable categories

Level 1 should contain relatively stable AI areas, not fast-changing products, model versions, or company-specific names.

Good Level 1 candidates:

- [[Level 1/Machine Learning|Machine Learning]]
- [[Level 1/Symbolic AI|Symbolic AI]]
- [[Level 1/Robotics and Embodied AI|Robotics and Embodied AI]]
- [[Level 1/Knowledge and Reasoning|Knowledge and Reasoning]]

Bad Level 1 candidates:

- GPT-5
- Claude
- ChatGPT
- specific model versions
- temporary market categories

## 2. Avoid mixing levels where possible

If something is clearly inside another branch, it should not be promoted to Level 1.

Examples:

- [[Level 2/Deep Learning|Deep Learning]] belongs under [[Level 1/Machine Learning|Machine Learning]].
- [[Level 2/Reinforcement Learning|Reinforcement Learning]] belongs under [[Level 1/Machine Learning|Machine Learning]].
- Transformers should appear later under Deep Learning or Foundation Models, not at Level 1.
- [[Level 2/Large Language Models|Large Language Models]] belong under [[Level 1/Foundation and General-Purpose Models|Foundation and General-Purpose Models]].

## 3. Allow cross-cutting branches when necessary

Some areas are not clean subtrees, but are important enough to appear as major branches.

Examples:

- [[Level 1/AI Safety, Alignment and Governance|AI Safety, Alignment and Governance]]
- [[Level 1/Human-AI Interaction|Human-AI Interaction]]
- [[Level 1/Generative AI|Generative AI]]

## 4. Stop at Level 2 for now

Do not add Level 3 yet.

The first goal is to review and stabilize Level 1 and Level 2.

## 5. Make the model reviewable

The taxonomy should be easy for colleagues to critique.

Each branch should be clear enough that a reviewer can say:

- this belongs here,
- this should move,
- this is missing,
- this is too broad,
- this is too narrow.

## 6. Separate hierarchy depth from concept type

A node has both:

- hierarchy level — where it appears in the tree,
- concept type — what kind of concept it is.

Examples:

- [[Level 1/Machine Learning|Machine Learning]] is Level 1 and concept type `Major Area`.
- [[Level 2/Deep Learning|Deep Learning]] is Level 2 and concept type `Subfield`.
- [[Level 2/Reinforcement Learning|Reinforcement Learning]] is Level 2 and concept type `Paradigm`.
- Transformers will probably be Level 3 and concept type `Architecture`.
- ChatGPT would be a later Level 5 node and concept type `Product / Concrete System`.

This separation helps prevent the taxonomy from becoming confused when deeper levels are added.

## Related

- [[Concept Types]]
- [[Visual Grammar]]
