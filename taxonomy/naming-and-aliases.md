# Naming and Aliases

This document defines how AI Atlas handles canonical names, aliases, acronyms, synonyms, deprecated names, and naming exclusions.

It does not add new taxonomy nodes.

## Canonical name

A canonical name is the main display name for a concept.

A good canonical name should be:

- stable,
- academically or technically recognizable,
- readable by non-specialist technical readers,
- not vendor-specific unless the taxonomy explicitly includes concrete products at a later level,
- not a temporary marketing label.

Examples:

- `Machine Learning`
- `Deep Learning`
- `Knowledge Graphs`
- `Evaluation, Measurement and Benchmarking`

## Alias

An alias is an alternative name for the same concept.

Aliases may include:

- acronyms,
- spelling variants,
- older names,
- expanded forms,
- short forms,
- common community names.

An alias does not create a separate node.

Examples:

```json
{
  "name": "Large Language Models",
  "aliases": ["LLMs"]
}
```

```json
{
  "name": "Retrieval-Augmented Generation",
  "aliases": ["RAG"]
}
```

## Acronyms

Use the expanded form as the canonical name when it is clearer and stable.

Use the acronym as an alias when the acronym is widely used.

Examples:

- Canonical: `Large Language Models`; alias: `LLMs`.
- Canonical: `Retrieval-Augmented Generation`; alias: `RAG`.
- Canonical: `Reinforcement Learning from Human Feedback`; alias: `RLHF`.
- Canonical: `Explainable AI`; alias: `XAI`.

Acronyms may be canonical only when the expanded form is rarely used or less recognizable.

## Synonyms

Two names are synonyms when they refer to the same concept in normal AI usage.

If two names are true synonyms:

- keep one canonical node,
- choose one canonical name,
- record the other names as aliases.

If two names overlap but are not identical, do not collapse them automatically.

Examples of overlap that may require review rather than automatic aliasing:

- `Explainable AI` and `Interpretability`.
- `Foundation Models` and `Large Language Models`.
- `Agents` and `Agentic Systems`.

## Deprecated names

Deprecated names are old names that should no longer be preferred.

Use deprecated names as aliases only when they help readers connect older terminology to current terminology.

Do not use a deprecated name as the canonical name unless there is no stable replacement.

If a deprecated name points to a replaced concept, use lifecycle metadata such as `deprecated` and `deprecated_by` when schema support exists.

## Marketing-heavy labels

AI Atlas should avoid turning temporary market language into stable taxonomy structure.

A marketing-heavy term may be recorded as an alias or review note only if:

- it clearly maps to a stable technical concept,
- it is useful for readers,
- it does not distort the canonical hierarchy.

Do not promote a marketing term into Level 1, Level 2, or Level 3 by default.

## Product, company, and model-version exclusions

The following are excluded from Level 1, Level 2, and Level 3 by default:

- products,
- companies,
- concrete commercial systems,
- concrete model versions,
- temporary marketing labels,
- vendor-specific features.

Examples excluded from early canonical taxonomy levels:

- `ChatGPT`
- `GPT-5`
- `Claude`
- `Gemini`
- `Copilot`
- `Perplexity`

These may be considered at deeper levels only if AI Atlas explicitly decides to include concrete systems, products, or examples.

Product examples are not the same as stable technical concepts.

For example:

- `Large Language Models` may be a stable technical concept.
- `ChatGPT` is a concrete product and should not be a Level 1, Level 2, or Level 3 taxonomy node by default.

## True alias vs separate concept

Treat names as aliases only when the concepts are substantially the same.

Keep them separate when they differ by:

- abstraction level,
- technical mechanism,
- application domain,
- concept type,
- historical meaning,
- research community usage.

When unsure, keep the candidate in draft review and document the uncertainty instead of creating duplicate canonical nodes.

## Naming review checklist

Before promoting a name, ask:

- Is this name stable?
- Is it academically or technically recognizable?
- Is it too vendor-specific?
- Is it a product, company, or model version?
- Is it a temporary hype term?
- Is there a better canonical name with this term as an alias?
- Does it duplicate an existing concept?
- Does it need a relation or alternative parent instead of a new node?
