# AI Atlas v0.1 Viewer

This directory contains a small static D3 explorer for the AI Atlas v0.1 public preview.

The viewer is designed as a public-facing entry point for people who want to explore AI Atlas without reading raw JSON.

## Scope

The viewer currently shows:

- Level 0 — Artificial Intelligence,
- Level 1 — major AI areas,
- Level 2 — main subareas.

It does not include canonical Level 3 content. Level 3 remains draft/review work only.

## Features

- Visual D3 graph for Level 0–2.
- Click a node to select it without automatically changing expansion state.
- Expand all Level 2 nodes.
- Collapse back to Level 1 only.
- Expand or collapse the selected Level 1 area from the details panel.
- Search by concept text.
- Filter by concept type.
- Filter by status/stability.
- Render selected Markdown documents through `viewer/doc.html` instead of showing raw Markdown text in the browser.

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

Rendered Markdown helper pages:

```text
http://localhost:8000/viewer/doc.html?doc=taxonomy
http://localhost:8000/viewer/doc.html?doc=review
http://localhost:8000/viewer/doc.html?doc=release
```

## Public hosting

The viewer is intended to work as a static GitHub Pages-compatible page when the repository is served from the repository root.
