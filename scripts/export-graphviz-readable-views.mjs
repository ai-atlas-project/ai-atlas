#!/usr/bin/env node

import { execFileSync, spawnSync } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const taxonomyPath = path.join(
  repositoryRoot,
  "taxonomy",
  "ai-taxonomy-l1-l2.json",
);
const graphvizDirectory = path.join(repositoryRoot, "exports", "graphviz");
const overviewDotPath = path.join(
  graphvizDirectory,
  "ai-atlas-v0.1-l0-l1-overview.dot",
);
const overviewSvgPath = path.join(
  graphvizDirectory,
  "ai-atlas-v0.1-l0-l1-overview.svg",
);
const sectionsDirectory = path.join(graphvizDirectory, "sections");

const levelStyles = {
  root: {
    fillcolor: "#0F766E",
    color: "#115E59",
    fontcolor: "#FFFFFF",
    fontsize: "20",
    penwidth: "2.6",
    margin: "0.22,0.16",
  },
  majorArea: {
    fillcolor: "#CCFBF1",
    color: "#0F766E",
    fontcolor: "#134E4A",
    fontsize: "13",
    penwidth: "1.8",
    margin: "0.16,0.11",
  },
  subarea: {
    fillcolor: "#F0FDFA",
    color: "#5EEAD4",
    fontcolor: "#134E4A",
    fontsize: "11",
    penwidth: "1.1",
    margin: "0.13,0.09",
  },
};

function escapeDotString(value) {
  return String(value)
    .replaceAll("\\", "\\\\")
    .replaceAll('"', '\\"')
    .replaceAll("\r", "\\r")
    .replaceAll("\n", "\\n");
}

function quoteDotString(value) {
  return `"${escapeDotString(value)}"`;
}

function formatAttributes(attributes) {
  return Object.entries(attributes)
    .map(([key, value]) => `${key}=${quoteDotString(value)}`)
    .join(", ");
}

function wrapLabel(label, maximumLineLength = 28) {
  const words = label.split(" ");
  const lines = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;

    if (line && candidate.length > maximumLineLength) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }

  if (line) {
    lines.push(line);
  }

  return lines.join("\n");
}

function toNodeStatement(concept, style, maximumLineLength) {
  return `  ${quoteDotString(concept.id)} [${formatAttributes({
    label: wrapLabel(concept.name, maximumLineLength),
    ...style,
  })}];`;
}

function toEdgeStatement(parent, child) {
  return `  ${quoteDotString(parent.id)} -> ${quoteDotString(child.id)};`;
}

function sectionSlug(concept) {
  const prefix = "ai:";

  if (!concept.id.startsWith(prefix) || concept.id.length === prefix.length) {
    throw new Error(`Cannot derive section filename from ID "${concept.id}".`);
  }

  return concept.id.slice(prefix.length);
}

function validateCanonicalSource(root, level1) {
  if (!root || root.hierarchy_level !== 0 || !Array.isArray(level1)) {
    throw new Error(
      "Canonical taxonomy must contain a Level 0 root and a level_1 array.",
    );
  }

  const concepts = [root];
  const expectedRootChildren = [];

  for (const parent of level1) {
    if (
      parent.hierarchy_level !== 1 ||
      parent.parent !== root.name ||
      !Array.isArray(parent.level_2)
    ) {
      throw new Error(
        `Invalid Level 1 hierarchy for "${parent.name ?? "unnamed concept"}".`,
      );
    }

    expectedRootChildren.push(parent.name);
    concepts.push(parent);
    const expectedLevel2Children = [];

    for (const child of parent.level_2) {
      if (child.hierarchy_level !== 2 || child.parent !== parent.name) {
        throw new Error(
          `Invalid Level 2 hierarchy for "${child.name ?? "unnamed concept"}".`,
        );
      }

      expectedLevel2Children.push(child.name);
      concepts.push(child);
    }

    if (
      JSON.stringify(parent.children) !==
      JSON.stringify(expectedLevel2Children)
    ) {
      throw new Error(
        `Level 1 children do not match level_2 entries for "${parent.name}".`,
      );
    }
  }

  if (JSON.stringify(root.children) !== JSON.stringify(expectedRootChildren)) {
    throw new Error("Level 0 children do not match level_1 entries.");
  }

  const ids = concepts.map((concept) => concept.id);

  if (
    ids.some((id) => typeof id !== "string" || id.length === 0) ||
    new Set(ids).size !== ids.length
  ) {
    throw new Error("Canonical concepts must have unique, non-empty IDs.");
  }

  if (concepts.some((concept) => concept.hierarchy_level > 2)) {
    throw new Error(
      "Readable Graphviz exports must not contain concepts above Level 2.",
    );
  }
}

function createOverviewDot(root, level1) {
  return [
    "digraph AIAtlasOverview {",
    `  graph [layout="twopi", root=${quoteDotString(root.id)}, overlap="false", splines="true", ranksep="2.25", pad="0.35", bgcolor="#FFFFFF"];`,
    '  node [shape="box", style="rounded,filled", fontname="Helvetica"];',
    '  edge [color="#94A3B8", penwidth="1.2", arrowsize="0.75"];',
    "",
    "  // Canonical Level 0 root",
    toNodeStatement(root, levelStyles.root, 30),
    "",
    "  // Canonical Level 1 major areas",
    ...level1.map((concept) =>
      toNodeStatement(concept, levelStyles.majorArea, 24),
    ),
    "",
    "  // Directed Level 0 to Level 1 edges",
    ...level1.map((concept) => toEdgeStatement(root, concept)),
    "}",
    "",
  ].join("\n");
}

function createSectionDot(parent) {
  const graphName = `AIAtlasSection_${sectionSlug(parent).replaceAll("-", "_")}`;

  return [
    `digraph ${graphName} {`,
    '  graph [rankdir="LR", splines="true", overlap="false", nodesep="0.38", ranksep="1.15", pad="0.25", bgcolor="#FFFFFF"];',
    '  node [shape="box", style="rounded,filled", fontname="Helvetica"];',
    '  edge [color="#94A3B8", penwidth="1.0", arrowsize="0.7"];',
    "",
    "  // Canonical Level 1 section root",
    toNodeStatement(parent, levelStyles.majorArea, 28),
    "",
    "  // Canonical Level 2 subareas",
    ...parent.level_2.map((concept) =>
      toNodeStatement(concept, levelStyles.subarea, 28),
    ),
    "",
    "  // Directed Level 1 to Level 2 edges",
    ...parent.level_2.map((concept) => toEdgeStatement(parent, concept)),
    "}",
    "",
  ].join("\n");
}

function graphvizIsAvailable() {
  return spawnSync("dot", ["-V"], { stdio: "ignore" }).status === 0;
}

function renderSvg(dotPath, svgPath, engine) {
  execFileSync("dot", [`-K${engine}`, "-Tsvg", dotPath, "-o", svgPath], {
    stdio: "inherit",
  });
}

async function main() {
  const taxonomy = JSON.parse(await readFile(taxonomyPath, "utf8"));
  const root = taxonomy.level_0;
  const level1 = taxonomy.level_1;

  validateCanonicalSource(root, level1);

  await mkdir(graphvizDirectory, { recursive: true });
  await rm(sectionsDirectory, { recursive: true, force: true });
  await mkdir(sectionsDirectory, { recursive: true });

  await writeFile(overviewDotPath, createOverviewDot(root, level1));

  const sectionOutputs = [];

  for (const parent of level1) {
    const slug = sectionSlug(parent);
    const dotPath = path.join(sectionsDirectory, `${slug}.dot`);
    const svgPath = path.join(sectionsDirectory, `${slug}.svg`);

    await writeFile(dotPath, createSectionDot(parent));
    sectionOutputs.push({ dotPath, svgPath });
  }

  const hasGraphviz = graphvizIsAvailable();

  if (hasGraphviz) {
    renderSvg(overviewDotPath, overviewSvgPath, "twopi");

    for (const { dotPath, svgPath } of sectionOutputs) {
      renderSvg(dotPath, svgPath, "dot");
    }
  } else {
    await rm(overviewSvgPath, { force: true });
  }

  const level2Count = level1.reduce(
    (total, parent) => total + parent.level_2.length,
    0,
  );

  console.log(
    `Generated readable Graphviz views: 1 overview, ${level1.length} sections, ${level2Count} Level 2 nodes${hasGraphviz ? ", with SVG renders" : ""}.`,
  );
}

main().catch((error) => {
  console.error(`Readable Graphviz export failed: ${error.message}`);
  process.exitCode = 1;
});
