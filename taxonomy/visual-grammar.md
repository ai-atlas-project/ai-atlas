# Visual Grammar

AI Atlas should be visually readable.

The map should use visual cues to distinguish hierarchy depth and concept type.

## Hierarchy levels

| Level | Name | Meaning | Suggested color |
|---|---|---|---|
| 0 | Field | The whole domain | Black |
| 1 | Major Area | Large AI areas | Blue |
| 2 | Main Subarea | Primary concept areas | Green |
| 3 | Method / Architecture / Model Family | Deeper technical families | Orange |
| 4 | Technique / Component / Variant | Internal mechanisms | Red |
| 5 | System / Product / Concrete Model | Concrete systems or examples | Purple |

## Current scope

The current taxonomy contains only:

- Level 0
- Level 1
- Level 2

## Future use

In future visualizations:

- hierarchy level can control node size or depth,
- concept type can control color,
- stability can control border style,
- cross-cutting concepts can use dashed links.

## Obsidian graph view

For generated Obsidian taxonomy notes, the graph should prioritize the taxonomy neighborhood:

- parent links,
- child links.

Metadata should be stored in YAML frontmatter instead of graph-visible body links or tags.

Generated concept notes should not create graph noise by linking every node to project documentation pages such as Concept Types, Taxonomy Principles, or Visual Grammar.

## Important distinction

Hierarchy level is not always the same as concept type.

Examples:

- A concept can be Level 2 and have concept type `Paradigm`.
- A concept can be Level 2 and have concept type `Application Area`.
- A future Level 3 concept can have concept type `Architecture`.
- A future Level 5 concept can have concept type `Product / Concrete System`.
