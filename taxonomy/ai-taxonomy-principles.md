# AI Taxonomy Principles

## 1. Prefer stable categories

Level 1 should contain relatively stable AI areas, not fast-changing products, model versions, or company-specific names.

Good Level 1 candidates:

- Machine Learning
- Symbolic AI
- Robotics and Embodied AI
- Knowledge and Reasoning

Bad Level 1 candidates:

- GPT-5
- Claude
- ChatGPT
- specific model versions
- temporary market categories

## 2. Avoid mixing levels where possible

If something is clearly inside another branch, it should not be promoted to Level 1.

Examples:

- Deep Learning belongs under Machine Learning.
- Reinforcement Learning belongs under Machine Learning.
- Transformers should appear later under Deep Learning or Foundation Models, not at Level 1.
- Large Language Models belong under Foundation and General-Purpose Models.

## 3. Allow cross-cutting branches when necessary

Some areas are not clean subtrees, but are important enough to appear as major branches.

Examples:

- AI Safety, Alignment and Governance
- Human-AI Interaction
- Generative AI

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

- Machine Learning is Level 1 and concept type `Major Area`.
- Deep Learning is Level 2 and concept type `Subfield`.
- Reinforcement Learning is Level 2 and concept type `Paradigm`.
- Transformers will probably be Level 3 and concept type `Architecture`.
- ChatGPT would be a later Level 5 node and concept type `Product / Concrete System`.

This separation helps prevent the taxonomy from becoming confused when deeper levels are added.
