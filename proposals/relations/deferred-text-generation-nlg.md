# Deferred review: Text Generation and Natural Language Generation

**Status: deferred candidate `rel-pilot-004`; not an active relation, alias decision, or canonical change.**

The earlier candidate connected `ai:text-generation` to `ai:natural-language-generation` with symmetric `related-to`, describing an intersection rather than equivalence. It has been removed from [the active pilot](l0-l2-pilot.json). Keep its ID reserved so that review history remains traceable.

Text generation and natural language generation are often used as overlapping or synonymous terms. The current AI Atlas concepts require an explicit boundary or alias review before this edge can be accepted; this note does not establish that they are distinct concepts.

## Current repository content

Snapshot: canonical taxonomy SHA-256 `d10262e96f76c7b2b822f4f46c1ff758ea2d546aa753f4fab84d6193a3cda63a`, as pinned by the pilot.

| Existing concept | Canonical placement | Existing Fieldguide definition |
| --- | --- | --- |
| `ai:text-generation` — Text Generation | Level 2, Application Area; parent Generative AI | Producing text computationally, often conditioned on a prompt or other context. |
| `ai:natural-language-generation` — Natural Language Generation | Level 2, Application Area; parent Natural Language and Speech | Producing human-language expressions from data, meaning representations, or other inputs. |

Placement and types come from [canonical JSON](../../taxonomy/ai-taxonomy-l1-l2.json). The quoted definitions come from [Fieldguide editorial content](../../viewer/fieldguide/content.mjs); they are not canonical definitions. The canonical descriptions currently restate each concept's level, type, and parent. Different parents alone do not establish a semantic distinction.

## Literature evidence and review interpretation

| Primary source | Passage to review | Relevance to this candidate |
| --- | --- | --- |
| [Li et al., *Pretrained Language Models for Text Generation: A Survey*, 2022 preprint](https://arxiv.org/html/2201.05273v4) | Section 1, first paragraph: "Text generation, also known as natural language generation" | The authors use the terms synonymously. This challenges the earlier assertion that the two labels necessarily identify distinct concepts. |
| [Gatt and Krahmer, *Survey of the State of the Art in Natural Language Generation*, 2018 revision](https://arxiv.org/html/1703.09902v4) | Section 1.1; section 8.2, "Does NLG Include Text-to-Text?" | The survey includes text-to-text and data-to-text within NLG, while focusing much of its own coverage on data-to-text. That coverage choice does not establish a universal boundary between AI Atlas's two labels. |

Our review conclusion is to defer the edge, not to infer automatic equivalence. Planning, grounding, or possible spoken output do not by themselves justify the previous claim of two distinct concepts with only an intersection. The sources inform AI Atlas's review; they do not decide its canonical structure.

## Separate review needed before reconsideration

1. Define each concept's intended scope independently of its parent. Give examples and counterexamples that demonstrate a useful, literature-supported distinction, if one exists.
2. Decide whether the labels represent distinct concepts, alternate names for one concept, or an unresolved boundary. Record contrary evidence as well as supporting evidence.
3. Only after that decision, determine whether a relationship is useful and which existing type accurately expresses it. Do not add a vague `related-to` edge to work around an unresolved concept boundary.
4. Propose any alias, rename, merge, hierarchy, or definition changes in a separate explicitly approved review. This note authorizes none of them and does not create a new synonym or overlap policy.

Both existing IDs, their canonical placement, and the live site's editorial content remain unchanged by this pilot revision. See the [pilot review and display contract](README.md) for the four remaining candidates.
