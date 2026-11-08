# Accepted L0–L2 relations

Canonical source: [l0-l2.json](l0-l2.json). Provenance: [decision](decision-2026-11-08.md).

This bounded release accepts four stable relation IDs and directed types `uses` and `applies-to`. Hierarchy remains separate. Every record requires accepted status, actual human reviewer, decision date, public decision URL, reviewed revision and rationale. Date precision is one day because the conversation does not supply an exact decision time.

The accepted validator reuses proposal structural checks and compares the complete semantic payload to the reviewed historical pilot. Semantic changes need renewed review and explicit baseline/validator updates. Validation cannot prove approval authenticity or scientific truth.

The proposal JSON is frozen historical evidence, not a second canonical source. Preserve its original taxonomy hash. Future taxonomy changes require explicit separation of historical validation from current-reference validation rather than silent hash refreshes.

Future consumers load accepted data only. Display full scope, evidence and review status alongside each relationship and preserve them in exports. Short labels retain pretraining, implementation-option, one-approach and social-context qualifiers. Diagrams require adjacent keyed scope tables when full text cannot fit. Do not infer parents, transitive links or import editorial links automatically.

Run `node scripts/validate-accepted-relations.mjs` and `node --test tests/accepted-relations.test.mjs`. The site and generators do not yet consume this dataset. Issue #52 remains open.
