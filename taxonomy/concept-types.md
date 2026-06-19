# Concept Types

AI Atlas is not only a hierarchy. It is a typed knowledge map.

Each node has two different properties:

1. Hierarchy level — where it sits in the tree.
2. Concept type — what kind of thing it is.

## Why this matters

Some AI concepts are fields.
Some are major areas.
Some are subfields.
Some are paradigms.
Some are methods.
Some are architectures.
Some are model families.
Some are techniques.
Some are components.
Some are systems or products.
Some are cross-cutting concerns.

A clean AI map should not force all concepts to behave as if they are the same kind of entity.

## Governance rule

Level means hierarchy depth, not concept type.

A concept type describes what a node is. A hierarchy level describes where the node sits in the primary taxonomy tree.

Nodes at the same level may have different concept types when that makes the taxonomy more accurate and readable.

Do not promote a concept to a higher level just because it is important, popular, or commercially visible.

Do not demote a concept only because its concept type looks more specific. Placement should be based on the primary hierarchy, not the label alone.

## Concept type list

### Field

The root field.

Example:

- Artificial Intelligence

Typical hierarchy use:

- Level 0: normally allowed.
- Level 1: normally not used.
- Level 2: normally not used.
- Future Level 3: not used.

### Major Area

A large, relatively stable area of AI.

Examples:

- Machine Learning
- Symbolic AI
- Robotics and Embodied AI

Typical hierarchy use:

- Level 1: normally allowed.
- Level 2: use with caution only if a branch is being reorganized.
- Future Level 3: normally not used.

### Cross-Cutting Area

An area that cuts across multiple branches of AI.

Examples:

- Generative AI
- AI Safety, Alignment and Governance

Typical hierarchy use:

- Level 1: allowed when the area is important enough to be a major public branch.
- Level 2: allowed with caution when the cross-cutting concern is local to a parent branch.
- Future Level 3: allowed only when the concept is still broad enough and not better represented as a relation.

### Future Area

A future-facing or speculative area of AI.

Examples:

- AGI and Future AI

Typical hierarchy use:

- Level 1: allowed when intentionally marked future-facing.
- Level 2: allowed with caution inside future-facing branches.
- Future Level 3: allowed with caution and clear status/stability labels.

### Subfield

A major subdivision inside a larger AI area.

Examples:

- Deep Learning
- Natural Language Processing
- Computer Vision

Typical hierarchy use:

- Level 1: normally too specific unless it is being used as a major area by design.
- Level 2: normally allowed.
- Future Level 3: allowed when it is a deeper subfield under a broad Level 2 parent.

### Paradigm

A broad way of approaching learning, reasoning, or system design.

Examples:

- Supervised Learning
- Self-Supervised Learning
- Reinforcement Learning

Typical hierarchy use:

- Level 1: normally not used unless it is large enough to function as a major area.
- Level 2: allowed.
- Future Level 3: allowed when it is a more specific paradigm inside a Level 2 area.

### Method

A specific approach or family of approaches.

Future examples:

- Retrieval-Augmented Generation
- Policy Optimization
- Constraint Satisfaction

Typical hierarchy use:

- Level 1: normally not allowed.
- Level 2: allowed only when the method is broad enough to serve as a main subarea.
- Future Level 3: normally allowed.

### Architecture

A structural design for models or systems.

Future examples:

- Transformers
- Convolutional Neural Networks
- Recurrent Neural Networks

Typical hierarchy use:

- Level 1: not allowed by default.
- Level 2: allowed only with strong justification.
- Future Level 3: normally allowed.

### Model Family

A family of models with shared purpose or architecture.

Examples:

- Large Language Models
- Vision Foundation Models
- Multimodal Foundation Models

Typical hierarchy use:

- Level 1: normally not used unless the model family defines a major public area by design.
- Level 2: allowed when broad and stable.
- Future Level 3: normally allowed.

### Technique

A more specific technical mechanism.

Future examples:

- Self-Attention
- Fine-Tuning
- Embeddings
- Reward Modeling

Typical hierarchy use:

- Level 1: not allowed.
- Level 2: normally too specific.
- Future Level 3: allowed only when broad and stable enough; otherwise consider Level 4 later.

### Component

A part of a larger system.

Future examples:

- Retriever
- Re-ranker
- Inference Engine
- Reward Model

Typical hierarchy use:

- Level 1: not allowed.
- Level 2: normally not allowed.
- Future Level 3: allowed only when it is a major reusable component; otherwise consider Level 4 later.

### System Pattern

A recurring pattern for building AI systems.

Future examples:

- AI Agent
- RAG Pipeline
- Human-in-the-Loop System

Typical hierarchy use:

- Level 1: normally not used.
- Level 2: allowed when broad enough to define a main subarea.
- Future Level 3: normally allowed.

### Application Area

A domain where AI is applied.

Examples:

- Autonomous Vehicles
- Decision Support Systems
- Speech Recognition

Typical hierarchy use:

- Level 1: allowed only if AI Atlas intentionally treats the domain as a major area.
- Level 2: allowed when it is a main subarea inside a broader branch.
- Future Level 3: allowed with caution only when genuinely technical and not just an industry/product category.

### Safety Concept

A concept related to making AI systems safer, more reliable, or more aligned.

Examples:

- AI Alignment
- Robustness
- Bias and Fairness

Typical hierarchy use:

- Level 1: normally not used as a single concept type, but may appear inside a Level 1 cross-cutting safety/governance area.
- Level 2: allowed under safety, alignment, evaluation, or governance branches.
- Future Level 3: allowed under relevant safety or evaluation parents.

### Evaluation Concept

A concept related to measuring, interpreting, or testing AI systems.

Examples:

- Evaluation, Measurement and Benchmarking
- Interpretability
- Explainable AI

Typical hierarchy use:

- Level 1: normally not used as a single concept type.
- Level 2: allowed under evaluation, safety, or relevant technical branches.
- Future Level 3: allowed under relevant evaluation-related parents.

### Governance Concept

A concept related to policy, regulation, or institutional control of AI.

Examples:

- Governance and Policy
- Misuse Prevention

Typical hierarchy use:

- Level 1: normally not used as a single concept type, but may appear inside a Level 1 safety/governance area.
- Level 2: allowed under governance, safety, or policy branches.
- Future Level 3: allowed under relevant governance parents.

### Future Concept

A speculative or future-facing AI concept.

Examples:

- Artificial General Intelligence
- Superintelligence
- Self-Improving Systems

Typical hierarchy use:

- Level 1: allowed only for explicitly future-facing major areas.
- Level 2: allowed inside future-facing branches.
- Future Level 3: allowed only with clear speculative status and careful review.

## Common error patterns

### Product as taxonomy area

Bad pattern:

- promoting a product, company, commercial system, or concrete model version into Level 1, Level 2, or Level 3.

Examples to avoid at early canonical levels:

- ChatGPT
- GPT-5
- Claude
- Gemini
- Copilot
- Perplexity

Use stable technical concepts instead when appropriate.

### Method promoted too high

Bad pattern:

- placing a method at Level 1 only because it is popular or widely used.

Example:

- `Transformers` should not be Level 1.

### Application mixed with architecture

Bad pattern:

- treating an application area as if it were an architecture, or treating an architecture as if it were an application domain.

Example:

- `Autonomous Vehicles` is an application area.
- `Transformers` is an architecture.

### Cross-cutting concern forced into one branch

Bad pattern:

- forcing a concept into one subtree when it should have a primary parent plus relations or alternative-parent notes.

Examples likely to need cross-link review in future drafts:

- Embeddings
- Evaluation
- Tool Use
- Multimodal Learning

### Model version treated as stable concept

Bad pattern:

- treating a concrete model release as a stable taxonomy concept.

A concrete model version may be useful as an example at a later level only if concrete systems are explicitly in scope.

## Placement checklist

Before assigning or changing a concept type, ask:

- What kind of thing is this concept?
- Is it a field, area, subfield, paradigm, method, architecture, model family, technique, component, system pattern, application area, safety concept, evaluation concept, governance concept, or future concept?
- Is its hierarchy level justified independently of its concept type?
- Is it too specific for Level 1 or Level 2?
- Is it a product, company, model version, or temporary marketing label?
- Does it need a relation or alternative parent instead of a new hierarchy position?
