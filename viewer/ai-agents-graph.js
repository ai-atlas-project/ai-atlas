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

const TREE_GROUPS = [
  {
    id: "core-parts",
    title: "Core parts / has-part",
    relationHint: "AI Agent has-part",
    children: [
      conceptNode("goals", "has-part"),
      conceptNode("environment", "has-part"),
      conceptNode("planning", "has-part"),
      conceptNode("reasoning", "has-part"),
      conceptNode("memory", "has-part"),
      conceptNode("action-execution", "has-part")
    ]
  },
  {
    id: "uses",
    title: "Uses",
    relationHint: "AI Agent uses",
    children: [
      conceptNode("tool-use", "uses", [
        conceptNode("function-calling", "uses")
      ])
    ]
  },
  {
    id: "evaluated-by",
    title: "Evaluated by",
    relationHint: "evaluates AI Agent",
    children: [
      conceptNode("evaluation", "evaluates"),
      conceptNode("monitoring", "evaluates")
    ]
  },
  {
    id: "governance",
    title: "Governance / applies-to",
    relationHint: "applies-to AI Agent",
    children: [
      conceptNode("guardrails", "applies-to"),
      conceptNode("human-oversight", "applies-to")
    ]
  },
  {
    id: "agent-family-context",
    title: "Agent family / context",
    relationHint: "agent family and multi-agent context",
    children: [
      conceptNode("autonomous-agents", "narrower-than"),
      conceptNode("multi-agent-systems", "related-to", [
        conceptNode("agent-communication", "applies-to"),
        conceptNode("coordination-and-negotiation", "applies-to")
      ])
    ]
  }
];

const state = {
  graph: null,
  nodeById: new Map(),
  selectedId: "ai-agent",
  collapsedGroups: new Set()
};

const treeRoot = document.querySelector("#relationship-tree");
const legend = document.querySelector("#relation-legend");
const detailsTitle = document.querySelector("#details-title");
const nodeType = document.querySelector("#node-type");
const nodeStatus = document.querySelector("#node-status");
const nodeDescription = document.querySelector("#node-description");
const feedbackLink = document.querySelector("#feedback-link");
const expandAllButton = document.querySelector("#expand-all");
const collapseAllButton = document.querySelector("#collapse-all");

renderLegend();

expandAllButton.addEventListener("click", () => {
  state.collapsedGroups.clear();
  renderRelationshipTree();
});

collapseAllButton.addEventListener("click", () => {
  state.collapsedGroups = new Set(TREE_GROUPS.map((group) => group.id));
  renderRelationshipTree();
});

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
    renderRelationshipTree();
    updateDetails(state.nodeById.get(state.selectedId) || graph.nodes[0]);
  })
  .catch((error) => {
    showLoadError(error);
  });

function conceptNode(id, relation, children = []) {
  return { id, relation, children };
}

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
    console.warn(`Duplicate node id in AI Agents relationship tree: ${id}`);
  }

  for (const edge of graph.edges || []) {
    if (!seen.has(edge.source)) {
      console.warn(`AI Agents relationship tree edge references missing source node: ${edge.source}`);
    }
    if (!seen.has(edge.target)) {
      console.warn(`AI Agents relationship tree edge references missing target node: ${edge.target}`);
    }
    if (!ALLOWED_RELATIONS.includes(edge.type)) {
      console.warn(`AI Agents relationship tree edge has unsupported relation type: ${edge.type}`);
    }
  }
}

function renderRelationshipTree() {
  const rootList = document.createElement("div");
  rootList.className = "tree-list";
  rootList.append(renderConceptRow("ai-agent", { depth: 0, root: true }));

  const groupsList = document.createElement("div");
  groupsList.className = "tree-children root-children";

  for (const group of TREE_GROUPS) {
    groupsList.append(renderGroup(group));
  }

  rootList.append(groupsList);
  treeRoot.replaceChildren(rootList);
}

function renderGroup(group) {
  const isCollapsed = state.collapsedGroups.has(group.id);
  const groupEl = document.createElement("section");
  groupEl.className = "tree-group";
  groupEl.dataset.groupId = group.id;

  const header = document.createElement("button");
  header.type = "button";
  header.className = "tree-row group-row";
  header.setAttribute("aria-expanded", String(!isCollapsed));
  header.style.setProperty("--depth", 1);
  header.addEventListener("click", () => {
    toggleGroup(group.id);
  });

  const toggle = document.createElement("span");
  toggle.className = "tree-toggle";
  toggle.textContent = isCollapsed ? "+" : "-";

  const label = document.createElement("span");
  label.className = "tree-label";
  label.textContent = group.title;

  const hint = document.createElement("span");
  hint.className = "tree-hint";
  hint.textContent = group.relationHint;

  header.append(toggle, label, hint);
  groupEl.append(header);

  if (!isCollapsed) {
    const children = document.createElement("div");
    children.className = "tree-children";
    for (const child of group.children) {
      children.append(renderTreeNode(child, 2));
    }
    groupEl.append(children);
  }

  return groupEl;
}

function renderTreeNode(treeNode, depth) {
  const wrapper = document.createElement("div");
  wrapper.className = "tree-node";
  wrapper.append(renderConceptRow(treeNode.id, { depth, relation: treeNode.relation }));

  if (treeNode.children.length) {
    const children = document.createElement("div");
    children.className = "tree-children";
    for (const child of treeNode.children) {
      children.append(renderTreeNode(child, depth + 1));
    }
    wrapper.append(children);
  }

  return wrapper;
}

function renderConceptRow(nodeId, options = {}) {
  const node = state.nodeById.get(nodeId);
  const row = document.createElement("button");
  row.type = "button";
  row.className = "tree-row concept-row";
  if (options.root) row.classList.add("root-row");
  if (nodeId === state.selectedId) row.classList.add("selected");
  row.dataset.nodeId = nodeId;
  row.style.setProperty("--depth", options.depth || 0);

  const spacer = document.createElement("span");
  spacer.className = "tree-spacer";

  const label = document.createElement("span");
  label.className = "tree-label";
  label.textContent = node?.label || nodeId;

  row.append(spacer, label);

  if (options.relation) {
    const chip = document.createElement("span");
    chip.className = "relation-chip";
    chip.textContent = options.relation;
    row.append(chip);
  }

  const meta = document.createElement("span");
  meta.className = "tree-meta";
  meta.textContent = node?.type || "missing concept";
  row.append(meta);

  row.addEventListener("click", () => {
    if (!node) return;
    state.selectedId = node.id;
    updateDetails(node);
    refreshSelectedRows();
  });

  return row;
}

function toggleGroup(groupId) {
  if (state.collapsedGroups.has(groupId)) {
    state.collapsedGroups.delete(groupId);
  } else {
    state.collapsedGroups.add(groupId);
  }
  renderRelationshipTree();
}

function refreshSelectedRows() {
  for (const row of document.querySelectorAll(".concept-row")) {
    row.classList.toggle("selected", row.dataset.nodeId === state.selectedId);
  }
}

function updateDetails(node) {
  if (!node) return;

  detailsTitle.textContent = node.label;
  nodeType.textContent = node.type;
  nodeStatus.textContent = node.status;
  nodeDescription.textContent = node.description;
  feedbackLink.href = `${FEEDBACK_URL}?title=${encodeURIComponent(`AI Agents relationship tree feedback: ${node.label}`)}`;
}

function showLoadError(error) {
  console.error(error);
  detailsTitle.textContent = "Relationship tree failed to load";
  nodeType.textContent = "error";
  nodeStatus.textContent = "unavailable";
  nodeDescription.textContent = error.message;
}
