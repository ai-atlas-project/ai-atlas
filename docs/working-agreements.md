# Working Agreements

This file contains practical shorthand and collaboration rules for working on AI Atlas.

## Project shorthand

When the user mentions `реао`, interpret it as referring to the `ai-atlas` project/repository.

This shorthand is used to avoid typing the full project name every time.

Equivalent meanings:

- `реао`
- `ai-atlas`
- `AI Atlas`
- `elvistudio/ai-atlas`

## Collaboration model

AI Atlas is developed through a practical workflow:

- ChatGPT helps with taxonomy design, review, naming, prompts, and conceptual decisions.
- Codex applies changes to the repository, updates files, validates structure, and commits changes.
- GitHub is the shared source of truth for committed project files.

## Current taxonomy scope

The project currently contains:

- Level 0 — Field
- Level 1 — Major Areas
- Level 2 — Subfields

Level 3 should not be added until the Level 0–2 model and concept typing are stable.

## Preferred change style

For taxonomy changes, prefer small focused commits:

- one conceptual change per commit,
- clear commit messages,
- no model versions unless explicitly working on a concrete examples layer,
- keep the canonical JSON and human-readable Markdown aligned.
