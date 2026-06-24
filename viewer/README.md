# AI Atlas v0.1 Viewer

This directory contains a small static D3 explorer for the AI Atlas v0.1 public preview.

The viewer is designed as a public-facing entry point for people who want to explore AI Atlas without reading raw JSON.

## Scope

The viewer currently shows:

- Level 0 — Artificial Intelligence,
- Level 1 — major AI areas,
- Level 2 — main subareas.

It does not include canonical Level 3 content. Level 3 remains draft/review work only.

## Source of truth

The viewer loads data from:

```text
../taxonomy/ai-taxonomy-l1-l2.json
```

The viewer is a visual aid only. The GitHub repository and canonical taxonomy files remain the source of truth.

## Local use

Because the viewer fetches a JSON file, open it through a local static server rather than directly from the filesystem:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/viewer/
```

## Public hosting

The viewer is intended to work as a static GitHub Pages-compatible page when the repository is served from the repository root.
