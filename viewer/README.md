# AI Atlas website and classic viewer

The main website uses the Fieldguide interface: concept exploration, four pathways, comparisons, and a browser-local notebook. The original D3 explorer remains at `classic.html`. Existing document pages and their assets are preserved.

Editorial explanations and relationships remain proposals, separate from the canonical taxonomy. No Level 3 promotion is included. Notebook data does not move automatically from the private preview domain: export its JSON backup and import it on the public site.

## Fieldguide maintenance

Serve the repository root and open `/viewer/`. No build or dependencies are required. Validate with:

```sh
node scripts/fieldguide-generate-data.mjs
node scripts/fieldguide-validate.mjs
node --test tests/fieldguide.test.mjs
```

The bundled taxonomy must match `taxonomy/ai-taxonomy-l1-l2.json` byte-for-byte; CI checks this. When a reviewed canonical update is adopted, refresh the copy and its source commit in `fieldguide/core.mjs`, then regenerate provenance. The editorial export is generated from `fieldguide/content.mjs`.

Rollback: revert the website adoption commit. The classic map also remains accessible without a rollback.

## Classic viewer

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

## Files

- `index.html` — main Fieldguide website.
- `fieldguide/` — static modules, styles, and separately labeled editorial data.
- `classic.html` — preserved original D3 taxonomy viewer.
- `app.js` — D3 graph, filters, map controls, concept card, and feedback-link behavior.
- `styles.css` — shared desktop/mobile styling for the viewer and document pages.
- `mobile-controls.css` — mobile-specific controls drawer and zoom-control layout.
- `doc.html` — rendered Markdown and formatted JSON document view.

## Features

- Visual D3 graph for Level 0–2.
- Search by concept text.
- Filter by concept type.
- Filter by status/stability.
- Expand all Level 2 nodes.
- Collapse back to the Level 1 overview.
- Collapse to Level 0 only from the selected root concept.
- Expand or collapse the selected Level 1 area from the floating concept card.
- Re-center the map on Artificial Intelligence.
- Pan by dragging the map background.
- Zoom with visible `+` / `−` controls.
- Zoom with pinch or supported trackpad gestures.
- Use keyboard `+` / `-` / `0` when the map is focused.
- Inspect concepts in a floating desktop card or mobile bottom sheet.
- Open prefilled GitHub feedback for the selected concept.
- Render selected Markdown documents through `viewer/doc.html` instead of showing raw Markdown text in the browser.
- Render the taxonomy JSON through a formatted, collapsible JSON view.
- Provide public footer links for GitHub, LinkedIn, review guide, formatted JSON, and feedback.

## Helper pages

```text
http://localhost:8000/viewer/doc.html?doc=taxonomy
http://localhost:8000/viewer/doc.html?doc=review
http://localhost:8000/viewer/doc.html?doc=release
http://localhost:8000/viewer/doc.html?doc=json
```

The `doc=json` view is a formatted helper view. The raw JSON file remains available at:

```text
http://localhost:8000/taxonomy/ai-taxonomy-l1-l2.json
```

## Local use

Because the viewer fetches JSON and Markdown files, open it through a local static server rather than directly from the filesystem:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/viewer/
```

## Public hosting

The viewer is intended to work as a static GitHub Pages-compatible page when the repository is served from the repository root.

## Non-goals

- No taxonomy source changes.
- No canonical Level 3 content.
- No backend.
- No CMS.
- No account system.
- No full relation graph implementation.
