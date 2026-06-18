# Obsidian Vault Generation

AI Atlas Obsidian notes should keep the local graph focused on taxonomy structure.

## Graph rule

Taxonomy concept notes should expose only semantic taxonomy links in the note body:

- parent links,
- child links.

Do not add project tags or level tags to generated concept notes.

Do not link every concept note to documentation pages such as Concept Types, Taxonomy Principles, or Visual Grammar. Those references are useful as metadata or documentation, but they pollute the Obsidian graph when someone selects a concept node.

## Metadata rule

Store concept metadata in YAML frontmatter instead of body tags or documentation links.

Example:

```yaml
---
project: "AI Atlas"
hierarchy_level: 2
hierarchy_level_name: "Main Subarea"
concept_type: "Future Concept"
stability: "speculative"
parent: "AGI and Future AI"
children: []
---
```

## Body rule

The visible body of a generated concept note should contain only taxonomy-neighborhood links:

```md
Parent: [[AGI and Future AI]]

Children:
- none
```

This keeps Obsidian local graph behavior aligned with the AI Atlas model: hierarchy is shown through parent-child structure, while metadata remains searchable without becoming graph noise.
