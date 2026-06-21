#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const taxonomyPath = path.join(
  repositoryRoot,
  "taxonomy",
  "ai-taxonomy-l1-l2.json",
);

const requiredFields = [
  "id",
  "name",
  "hierarchy_level",
  "hierarchy_level_name",
  "concept_type",
  "children",
  "stability",
  "description",
];
const idPattern = /^ai:[a-z0-9]+(?:-[a-z0-9]+)*$/;
const errors = [];

function addError(message) {
  errors.push(message);
}

function hasOwn(object, field) {
  return Object.prototype.hasOwnProperty.call(object, field);
}

function validateRequiredFields(concept, location, isRoot = false) {
  if (!concept || typeof concept !== "object" || Array.isArray(concept)) {
    addError(`${location} must be a concept object.`);
    return false;
  }

  for (const field of requiredFields) {
    if (!hasOwn(concept, field)) {
      addError(`${location} is missing required field "${field}".`);
    }
  }

  if (!isRoot && !hasOwn(concept, "parent")) {
    addError(`${location} is missing required field "parent".`);
  } else if (
    !isRoot &&
    (typeof concept.parent !== "string" || concept.parent.length === 0)
  ) {
    addError(`${location}.parent must be a non-empty string.`);
  }

  if (hasOwn(concept, "children") && !Array.isArray(concept.children)) {
    addError(`${location}.children must be an array.`);
  }

  return true;
}

async function main() {
  let source;

  try {
    source = await readFile(taxonomyPath, "utf8");
  } catch (error) {
    console.error(`Validation failed: cannot read ${taxonomyPath}.`);
    console.error(error.message);
    process.exitCode = 1;
    return;
  }

  let taxonomy;

  try {
    taxonomy = JSON.parse(source);
  } catch (error) {
    console.error(`Validation failed: ${taxonomyPath} is not valid JSON.`);
    console.error(error.message);
    process.exitCode = 1;
    return;
  }

  const root = taxonomy.level_0;
  const level1 = taxonomy.level_1;

  if (!root || typeof root !== "object" || Array.isArray(root)) {
    addError('Top-level "level_0" root concept is missing or invalid.');
  }

  if (!Array.isArray(level1)) {
    addError('Top-level "level_1" must be an array.');
  }

  if (errors.length > 0) {
    report();
    return;
  }

  validateRequiredFields(root, "level_0", true);

  const concepts = [{ concept: root, location: "level_0", expectedLevel: 0 }];

  for (const [level1Index, level1Concept] of level1.entries()) {
    const level1Location = `level_1[${level1Index}]`;
    validateRequiredFields(level1Concept, level1Location);
    concepts.push({
      concept: level1Concept,
      location: level1Location,
      expectedLevel: 1,
    });

    if (!Array.isArray(level1Concept?.level_2)) {
      addError(`${level1Location}.level_2 must be an array.`);
      continue;
    }

    for (const [level2Index, level2Concept] of level1Concept.level_2.entries()) {
      const level2Location = `${level1Location}.level_2[${level2Index}]`;
      validateRequiredFields(level2Concept, level2Location);
      concepts.push({
        concept: level2Concept,
        location: level2Location,
        expectedLevel: 2,
      });
    }
  }

  const conceptsByName = new Map();
  const conceptsById = new Map();

  for (const { concept, location, expectedLevel } of concepts) {
    if (!concept || typeof concept !== "object" || Array.isArray(concept)) {
      continue;
    }

    if (typeof concept.name !== "string" || concept.name.length === 0) {
      addError(`${location}.name must be a non-empty string.`);
    } else if (conceptsByName.has(concept.name)) {
      addError(
        `${location}.name duplicates concept name "${concept.name}" at ${conceptsByName.get(concept.name).location}.`,
      );
    } else {
      conceptsByName.set(concept.name, { concept, location });
    }

    if (typeof concept.id !== "string" || concept.id.length === 0) {
      addError(`${location}.id must be a non-empty string.`);
    } else {
      if (!idPattern.test(concept.id)) {
        addError(
          `${location}.id "${concept.id}" must match ai:<slug> using lowercase letters, numbers, and hyphens.`,
        );
      }

      if (conceptsById.has(concept.id)) {
        addError(
          `${location}.id duplicates "${concept.id}" at ${conceptsById.get(concept.id)}.`,
        );
      } else {
        conceptsById.set(concept.id, location);
      }
    }

    if (!Number.isInteger(concept.hierarchy_level)) {
      addError(`${location}.hierarchy_level must be an integer.`);
    } else {
      if (concept.hierarchy_level > 2) {
        addError(
          `${location}.hierarchy_level is ${concept.hierarchy_level}; canonical L1/L2 JSON must not contain Level 3 concepts.`,
        );
      }

      if (concept.hierarchy_level !== expectedLevel) {
        addError(
          `${location}.hierarchy_level is ${concept.hierarchy_level}; expected ${expectedLevel}.`,
        );
      }
    }
  }

  if (root.hierarchy_level !== 0) {
    addError(`level_0.hierarchy_level must be 0.`);
  }

  for (const [level1Index, level1Concept] of level1.entries()) {
    const location = `level_1[${level1Index}]`;

    if (level1Concept?.parent !== root.name) {
      addError(
        `${location}.parent must point to root concept "${root.name}".`,
      );
    }

    if (!Array.isArray(level1Concept?.level_2)) {
      continue;
    }

    const storedLevel2Names = level1Concept.level_2
      .map((concept) => concept?.name)
      .filter((name) => typeof name === "string");
    const childNames = Array.isArray(level1Concept.children)
      ? level1Concept.children
      : [];

    const sortedStoredNames = [...storedLevel2Names].sort();
    const sortedChildNames = [...childNames].sort();

    if (
      sortedStoredNames.length !== sortedChildNames.length ||
      sortedStoredNames.some(
        (name, index) => name !== sortedChildNames[index],
      )
    ) {
      addError(
        `${location}.level_2 concept names must match ${location}.children.`,
      );
    }

    for (const [level2Index, level2Concept] of level1Concept.level_2.entries()) {
      if (level2Concept?.parent !== level1Concept.name) {
        addError(
          `${location}.level_2[${level2Index}].parent must point to Level 1 concept "${level1Concept.name}".`,
        );
      }
    }
  }

  for (const { concept, location, expectedLevel } of concepts) {
    if (!concept || typeof concept !== "object" || Array.isArray(concept)) {
      continue;
    }

    if (expectedLevel > 0 && typeof concept.parent === "string") {
      const parentEntry = conceptsByName.get(concept.parent);

      if (!parentEntry) {
        addError(
          `${location}.parent "${concept.parent}" does not resolve to an existing concept name.`,
        );
      } else if (
        !Array.isArray(parentEntry.concept.children) ||
        !parentEntry.concept.children.includes(concept.name)
      ) {
        addError(
          `${location}.parent "${concept.parent}" does not list "${concept.name}" in children.`,
        );
      }
    }

    if (!Array.isArray(concept.children)) {
      continue;
    }

    for (const childName of concept.children) {
      if (typeof childName !== "string" || childName.length === 0) {
        addError(`${location}.children contains an invalid concept name.`);
        continue;
      }

      const childEntry = conceptsByName.get(childName);

      if (!childEntry) {
        addError(
          `${location}.children reference "${childName}" does not resolve to an existing concept name.`,
        );
      } else if (childEntry.concept.parent !== concept.name) {
        addError(
          `${location}.children reference "${childName}" has parent "${childEntry.concept.parent}", expected "${concept.name}".`,
        );
      }
    }
  }

  report(concepts.length);
}

function report(nodeCount = 0) {
  if (errors.length === 0) {
    console.log(
      `Canonical L1/L2 taxonomy JSON validation passed: ${nodeCount} nodes checked.`,
    );
    return;
  }

  console.error(
    `Canonical L1/L2 taxonomy JSON validation failed with ${errors.length} error(s):`,
  );
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
}

await main();
