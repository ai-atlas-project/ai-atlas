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
- Continual Learning belongs under Machine Learning, not under future AI.
- Autonomous Agents belong under Agentic and Multi-Agent Systems, not only under future AI.
- Transformers should appear later under Deep Learning or Foundation Models, not at Level 1.
- Large Language Models belong under Foundation Models and General-Purpose AI.

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
- Generative AI is Level 1 and concept type `Cross-Cutting Area`.
- Deep Learning is Level 2 and concept type `Subfield`.
- Reinforcement Learning is Level 2 and concept type `Paradigm`.
- Transformers will probably be Level 3 and concept type `Architecture`.
- ChatGPT would be a later Level 5 node and concept type `Product / Concrete System`.

This separation helps prevent the taxonomy from becoming confused when deeper levels are added.

## 7. Level means hierarchy depth, not concept type

The word `Level` describes hierarchy depth only.

It does not describe what kind of concept a node is.

This means that nodes in the same level can have different concept types.

Examples:

- A Level 1 node can be a `Major Area`, `Cross-Cutting Area`, or `Future Area`.
- A Level 2 node can be a `Subfield`, `Paradigm`, `Model Family`, `Application Area`, `Safety Concept`, `Evaluation Concept`, or another appropriate concept type.
- Future Level 3 nodes may include methods, architectures, model families, system patterns, techniques, or other deeper concepts.

Folder names such as `Level 1`, `Level 2`, and future `Level 3` represent hierarchy depth for navigation and generation. They should not be treated as folders for concept types.

## 8. Resolve duplicates before expanding depth

Before adding Level 3, exact duplicate Level 2 names should be resolved or intentionally documented as cross-cutting concepts.

Current cleanup decisions:

- `Knowledge Representation` is canonical under `Knowledge and Reasoning`.
- The Symbolic AI branch uses `Symbolic Knowledge Representation` to avoid an exact duplicate.
- `Text Generation` is kept under `Generative AI`.
- The language branch uses `Natural Language Generation` to avoid an exact duplicate.
