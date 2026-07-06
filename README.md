# AI Atlas

AI Atlas is an open, community-reviewed knowledge map of Artificial Intelligence, built on a structured taxonomy.

It is built to make the AI landscape easier to navigate, review, and discuss.

## Mission

AI Atlas helps people understand AI by mapping stable concepts, their meanings, and their relationships.

## Vision

AI Atlas aims to become a trusted conceptual navigation layer for AI, helping engineers, researchers, educators, builders, and decision-makers see how AI concepts connect across fields, systems, architectures, tools, and real-world applications.

See also: [Mission and vision](docs/mission-and-vision.md).

## Why this exists

AI is no longer a single topic. A real-world system such as lane keeping in a car can involve computer vision, perception, planning, control, robotics, safety, and human-AI interaction at the same time.

AI Atlas exists to make this landscape easier to navigate: to show the main areas of modern AI, how they relate, and where specific concepts may belong.

## Current status

v0.1 — Clean hierarchy draft, Level 1 and Level 2 only.

Level 3 work has not been promoted to the public canonical taxonomy yet. Early Level 3 material should be treated as draft/review work until it is explicitly reviewed, cleaned, and promoted.

See also: [Level 3 draft policy](taxonomy/level-3-draft-policy.md).

See also: [Level 3 draft status and roadmap](docs/roadmap/level-3-draft-status.md).

## Start here

If you are new to AI Atlas, do not start with the JSON file.

Use one of these entry points:

- [Visual D3 viewer](viewer/) — explore the Level 1–Level 2 taxonomy without reading JSON.
- [Human-readable taxonomy](taxonomy/ai-taxonomy-l1-l2.md) — read the current public hierarchy.
- [Public review guide](PUBLIC_REVIEW.md) — see what kind of feedback is useful now.
- [Release notes](docs/releases/v0.1-public-preview.md) — understand v0.1 scope and boundaries.

The JSON file is the canonical structured source, mainly for validation, generation, and future tooling.

## Public review

AI Atlas v0.1 is open for focused review of the Level 1 and Level 2 taxonomy. See the [public review guide](PUBLIC_REVIEW.md) for review scope, questions, and feedback format.

## Public preview release

See the [AI Atlas v0.1 public preview release notes](docs/releases/v0.1-public-preview.md) for release scope, public announcement wording, and next steps.

## Public preview readiness

AI Atlas v0.1 may be shown publicly as a public preview of the Level 1 and Level 2 taxonomy when the release framing, scope boundaries, generated views, and review request satisfy the [public preview readiness criteria](docs/public-preview-readiness.md).

## What this is

AI Atlas is an open, community-reviewed knowledge map built on a structured AI taxonomy.

It is not intended to be an authoritative taxonomy yet. The goal is to create a useful, discussable, expandable mental model of AI that can be reviewed and improved by the community.

The public repository contains the current reviewed public outputs, public validation/export scripts, and static viewer assets needed to inspect the Level 1–Level 2 public preview. Private prompts, raw internal reviews, review-agent definitions, unpublished draft workflows, private links, and product planning remain outside this repository unless explicitly cleaned and approved for public release.

For now, the canonical source is the Level 1 and Level 2 taxonomy in `taxonomy/`.

## Public outputs

- [Visual D3 viewer](viewer/)
- [Taxonomy](taxonomy/)
- [Markmap view](markmap/)
- [Obsidian vault](obsidian/)
- Public validation/export scripts in [scripts](scripts/)

## Licensing

AI Atlas public content is licensed under Creative Commons Attribution-ShareAlike 4.0 International unless otherwise stated.

The AI Atlas name, logo, visual identity, and official paid print/PDF designs are not automatically licensed for commercial reuse unless explicitly stated.

See:

- [Licensing overview](LICENSES.md)
- [Content license](CONTENT_LICENSE)
- [Notice](NOTICE.md)

Recommended attribution for open content:

> AI Atlas by Alyaksandr Stzhalkouski, licensed under CC BY-SA 4.0.

## Review questions

- Are any Level 1 branches missing?
- Are any Level 1 branches actually Level 2?
- Are some branches overlapping too much?
- Are any important Level 2 areas missing?
- Is this hierarchy useful for explaining AI?
