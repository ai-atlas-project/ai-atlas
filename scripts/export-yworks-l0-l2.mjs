#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const taxonomyPath = path.join(
  repositoryRoot,
  "taxonomy",
  "ai-taxonomy-l1-l2.json",
);
const outputPath = path.join(
  repositoryRoot,
  "exports",
  "yworks",
  "ai-atlas-v0.1-l0-l2-yfiles.json",
);

const nodePresentationByLevel = {
  0: {
    display_level: "Level 0",
    node_role: "Root",
  },
  1: {
    display_level: "Level 1",
    node_role: "Major Area",
  },
  2: {
    display_level: "Level 2",
    node_role: "Main Subarea",
  },
};

function toNode(concept) {
  const presentation = nodePresentationByLevel[concept.hierarchy_level];

  if (!presentation) {
    throw new Error(
      `Unsupported hierarchy level ${concept.hierarchy_level} for "${concept.name}".`,
    );
  }

  return {
    id: concept.id,
    label: concept.name,
    name: concept.name,
    ...presentation,
    hierarchy_level: concept.hierarchy_level,
    hierarchy_level_name: concept.hierarchy_level_name,
    concept_type: concept.concept_type,
    stability: concept.stability,
    parent: concept.parent ?? null,
    description: concept.description,
  };
}

function toEdge(parent, child) {
  return {
    source: parent.id,
    target: child.id,
    label: "contains",
    type: "parent-child",
  };
}

async function main() {
  const taxonomy = JSON.parse(await readFile(taxonomyPath, "utf8"));
  const root = taxonomy.level_0;
  const level1 = taxonomy.level_1;

  if (!root || !Array.isArray(level1)) {
    throw new Error("Canonical taxonomy must contain level_0 and level_1.");
  }

  const level2 = level1.flatMap((concept) => {
    if (!Array.isArray(concept.level_2)) {
      throw new Error(`Level 1 concept "${concept.name}" has no level_2 array.`);
    }

    return concept.level_2;
  });
  const concepts = [root, ...level1, ...level2];

  if (concepts.some((concept) => concept.hierarchy_level > 2)) {
    throw new Error("yWorks export must not contain concepts above Level 2.");
  }

  const nodeList = concepts.map(toNode);
  const edgeList = [
    ...level1.map((concept) => toEdge(root, concept)),
    ...level1.flatMap((parent) =>
      parent.level_2.map((child) => toEdge(parent, child)),
    ),
  ];

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(
    outputPath,
    `${JSON.stringify({ nodeList, edgeList }, null, 2)}\n`,
  );

  console.log(
    `Generated yWorks export: ${nodeList.length} nodes, ${edgeList.length} edges.`,
  );
}

main().catch((error) => {
  console.error(`yWorks export failed: ${error.message}`);
  process.exitCode = 1;
});
