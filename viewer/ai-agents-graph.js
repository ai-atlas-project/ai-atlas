const DATA_URL = "../taxonomy/graphs/ai-agents.json";
const FEEDBACK_URL = "https://github.com/ai-atlas-project/ai-atlas/issues/new";
const ALLOWED_RELATIONS = ["has-part", "part-of", "uses", "applies-to", "evaluates", "related-to", "narrower-than"];
const RELATION_DETAILS = {
  "has-part": "Source contains the target as a component, phase, or substructure.",
  "part-of": "Source is a component, phase, or substructure of the target.",
  uses: "Source makes use of the target as a method, component, or resource.",
  "applies-to": "Source is applied to or relevant for the target concept.",
  evaluates: "Source measures, tests, benchmarks, interprets, or audits the target.",
  "related-to": "A general non-hierarchical association used when a more precise relation does not fit.",
  "narrower-than": "Source is a more specific form of the target concept."
};

const GROUPS = [
  {
    id: "core-parts",
    title: "Core parts",
    relationLabel: "AI Agent has-part",
    note: "Components and capabilities represented as parts of the draft agent concept.",
    edges: [
      ["ai-agent", "goals", "has-part"],
      ["ai-agent", "environment", "has-part"],
      ["ai-agent", "planning", "has-part"],
      ["ai-agent", "reasoning", "has-part"],
      ["ai-agent", "memory", "has-part"],
      ["ai-agent", "action-execution", "has-part"]
    ]
  },
  {
    id: "uses",
    title: "Uses",
    relationLabel: "AI Agent uses",
    note: "Tool relationships remain typed as uses rather than hierarchy.",
    edges: [["ai-agent", "tool-use", "uses"]],
    children: {
      "tool-use": [["tool-use", "function-calling", "uses"]]
    }
  },
  {
    id: "evaluated-by",
    title: "Evaluated by",
    relationLabel: "evaluates AI Agent",
    note: "Assessment concepts point toward the agent concept.",
    edges: [
      ["evaluation", "ai-agent", "evaluates"],
      ["monitoring", "ai-agent", "evaluates"]
    ]
  },
  {
    id: "governance-oversight",
    title: "Governance / oversight",
    relationLabel: "applies-to AI Agent",
    note: "Oversight and control concepts apply to the draft agent concept.",
    edges: [
      ["guardrails", "ai-agent", "applies-to"],
      ["human-oversight", "ai-agent", "applies-to"]
    ]
  },
  {
    id: "agent-family-context",
    title: "Agent family / context",
    relationLabel: "family and multi-agent context",
    note: "Adjacent agent concepts and multi-agent coordination context.",
    edges: [
      ["autonomous-agents", "ai-agent", "narrower-than"],
      ["multi-agent-systems", "ai-agent", "related-to"],
      ["agent-communication", "multi-agent-systems", "applies-to"],
      ["coordination-and-negotiation", "multi-agent-systems", "applies-to"]
    ]
  }
];

const state = {
  graph: null,
  nodeById: new Map(),
  selectedId: "ai-agent"
};

const centralConcept = document.querySelector("#central-concept");
const relationshipGroups = document.querySelector("#relationship-groups");
const legend = document.querySelector("#relation-legend");
const detailsTitle = document.querySelector("#details-title");
const nodeType = document.querySelector("#node-type");
const nodeStatus = document.querySelector("#node-status");
const nodeDescription = document.querySelector("#node-description");
const feedbackLink = document.querySelector("#feedback-link");

renderLegend();

fetch(DATA_URL)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to load ${DATA_URL}: ${response.status}`);
    }
    return response.json();
  })
  .then((graph) => {
    validateGraph(graph);
    state.graph = graph;
    state.nodeById = new Map(graph.nodes.map((node) => [node.id, node]));
    renderRelationshipMap();
    updateDetails(state.nodeById.get(state.selectedId) || graph.nodes[0]);
  })
  .catch((error) => {
    showLoadError(error);
  });

function renderLegend() {
  for (const relation of ALLOWED_RELATIONS) {
    const term = document.createElement("dt");
    term.textContent = relation;

    const description = document.createElement("dd");
    description.textContent = RELATION_DETAILS[relation];

    legend.append(term, description);
  }
}

function validateGraph(graph) {
  const seen = new Set();
  const duplicateIds = new Set();

  for (const node of graph.nodes || []) {
    if (seen.has(node.id)) {
      duplicateIds.add(node.id);
    }
    seen.add(node.id);
  }

  for (const id of duplicateIds) {
    console.warn(`Duplicate node id in AI Agents relationship map: ${id}`);
  }

  for (const edge of graph.edges || []) {
    if (!seen.has(edge.source)) {
      console.warn(`AI Agents relationship map edge references missing source node: ${edge.source}`);
    }
    if (!seen.has(edge.target)) {
      console.warn(`AI Agents relationship map edge references missing target node: ${edge.target}`);
    }
    if (!ALLOWED_RELATIONS.includes(edge.type)) {
      console.warn(`AI Agents relationship map edge has unsupported relation type: ${edge.type}`);
    }
  }
}

function renderRelationshipMap() {
  centralConcept.replaceChildren(renderConceptCard("ai-agent", { central: true }));
  relationshipGroups.replaceChildren(...GROUPS.map((group) => renderGroup(group)));
}

function renderGroup(group) {
  const section = document.createElement("section");
  section.className = "relationship-group";
  section.setAttribute("aria-labelledby", `${group.id}-title`);

  const header = document.createElement("div");
  header.className = "relationship-group-header";

  const titleBlock = document.createElement("div");
  const eyebrow = document.createElement("p");
  eyebrow.className = "relationship-type";
  eyebrow.textContent = group.relationLabel;
  const title = document.createElement("h3");
  title.id = `${group.id}-title`;
  title.textContent = group.title;
  titleBlock.append(eyebrow, title);

  const note = document.createElement("p");
  note.textContent = group.note;
  header.append(titleBlock, note);

  const list = document.createElement("div");
  list.className = "relationship-card-list";

  const topLevelTargets = new Set();
  for (const [source, target] of group.edges) {
    if (source === "ai-agent") {
      topLevelTargets.add(target);
    } else if (target === "ai-agent") {
      topLevelTargets.add(source);
    } else if (!isChildEdge(group, source, target)) {
      topLevelTargets.add(source);
    }
  }

  for (const nodeId of topLevelTargets) {
    const item = renderRelationshipItem(group, nodeId);
    if (item) list.append(item);
  }

  section.append(header, list);
  return section;
}

function renderRelationshipItem(group, nodeId) {
  const node = state.nodeById.get(nodeId);
  if (!node) return null;

  const wrapper = document.createElement("div");
  wrapper.className = "relationship-item";
  wrapper.append(renderConceptCard(nodeId));

  const childEdges = group.children?.[nodeId] || [];
  if (childEdges.length) {
    const childList = document.createElement("div");
    childList.className = "nested-relationships";

    for (const [source, target, type] of childEdges) {
      const relation = document.createElement("span");
      relation.className = "nested-relation";
      relation.textContent = `${type} ->`;
      const child = renderConceptCard(source === nodeId ? target : source, { compact: true });
      childList.append(relation, child);
    }

    wrapper.append(childList);
  }

  const relationBadges = relationsFor(nodeId, group).map((edge) => renderRelationBadge(edge, nodeId));
  if (relationBadges.length) {
    const badges = document.createElement("div");
    badges.className = "relation-badges";
    badges.append(...relationBadges);
    wrapper.append(badges);
  }

  return wrapper;
}

function renderConceptCard(nodeId, options = {}) {
  const node = state.nodeById.get(nodeId);
  const button = document.createElement("button");
  button.type = "button";
  button.className = "concept-chip";
  if (options.central) button.classList.add("central");
  if (options.compact) button.classList.add("compact");
  if (nodeId === state.selectedId) button.classList.add("selected");
  button.dataset.nodeId = nodeId;

  if (!node) {
    button.textContent = nodeId;
    button.disabled = true;
    return button;
  }

  const label = document.createElement("span");
  label.className = "concept-label";
  label.textContent = node.label;

  const meta = document.createElement("span");
  meta.className = "concept-meta";
  meta.textContent = node.type;

  button.append(label, meta);
  button.addEventListener("click", () => {
    state.selectedId = node.id;
    updateDetails(node);
    refreshSelectedCards();
  });

  return button;
}

function renderRelationBadge(edge, nodeId) {
  const badge = document.createElement("span");
  badge.className = "relation-badge";

  if (edge.source === nodeId && edge.target !== "ai-agent") {
    badge.textContent = `${edge.type} -> ${labelFor(edge.target)}`;
  } else if (edge.source === nodeId) {
    badge.textContent = `${edge.type} -> AI Agent`;
  } else if (edge.target === nodeId) {
    badge.textContent = `${labelFor(edge.source)} -> ${edge.type}`;
  } else {
    badge.textContent = edge.type;
  }

  return badge;
}

function relationsFor(nodeId, group) {
  return group.edges
    .map(([source, target, type]) => ({ source, target, type }))
    .filter((edge) => edge.source === nodeId || edge.target === nodeId);
}

function isChildEdge(group, source, target) {
  return Object.values(group.children || {}).some((edges) =>
    edges.some(([childSource, childTarget]) => childSource === source && childTarget === target)
  );
}

function refreshSelectedCards() {
  for (const card of document.querySelectorAll(".concept-chip")) {
    card.classList.toggle("selected", card.dataset.nodeId === state.selectedId);
  }
}

function updateDetails(node) {
  if (!node) return;

  detailsTitle.textContent = node.label;
  nodeType.textContent = node.type;
  nodeStatus.textContent = node.status;
  nodeDescription.textContent = node.description;
  feedbackLink.href = `${FEEDBACK_URL}?title=${encodeURIComponent(`AI Agents relationship map feedback: ${node.label}`)}`;
}

function labelFor(nodeId) {
  return state.nodeById.get(nodeId)?.label || nodeId;
}

function showLoadError(error) {
  console.error(error);
  detailsTitle.textContent = "Relationship map failed to load";
  nodeType.textContent = "error";
  nodeStatus.textContent = "unavailable";
  nodeDescription.textContent = error.message;
}
