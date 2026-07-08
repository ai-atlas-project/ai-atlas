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
const RELATION_COLORS = {
  "has-part": "#f4f1ea",
  "part-of": "#d6d0c4",
  uses: "#9cc9ff",
  "applies-to": "#c6d982",
  evaluates: "#ffbf7a",
  "related-to": "#b7a5ff",
  "narrower-than": "#f08fb5"
};

const state = {
  graph: null,
  selectedId: null,
  activeRelations: new Set(ALLOWED_RELATIONS),
  transform: d3.zoomIdentity
};

const svg = d3.select("#agents-map");
const filterContainer = document.querySelector("#relation-filters");
const legend = document.querySelector("#relation-legend");
const detailsTitle = document.querySelector("#details-title");
const nodeType = document.querySelector("#node-type");
const nodeStatus = document.querySelector("#node-status");
const nodeDescription = document.querySelector("#node-description");
const feedbackLink = document.querySelector("#feedback-link");

let viewportLayer;
let simulation;
let zoomBehavior;

renderFilterControls();
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
    state.selectedId = graph.nodes[0]?.id || null;
    render();
  })
  .catch((error) => {
    showLoadError(error);
  });

window.addEventListener("resize", () => {
  if (state.graph) {
    render();
  }
});

function renderFilterControls() {
  for (const relation of ALLOWED_RELATIONS) {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = relation;
    input.checked = true;
    input.addEventListener("change", () => {
      if (input.checked) {
        state.activeRelations.add(relation);
      } else {
        state.activeRelations.delete(relation);
      }
      updateFilteredState();
    });

    label.append(input, document.createTextNode(relation));
    filterContainer.append(label);
  }
}

function renderLegend() {
  for (const relation of ALLOWED_RELATIONS) {
    const term = document.createElement("dt");
    const swatch = document.createElement("span");
    swatch.className = "legend-swatch";
    swatch.style.setProperty("--relation-color", RELATION_COLORS[relation]);
    term.append(swatch, relation);

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
    console.warn(`Duplicate node id in AI Agents graph: ${id}`);
  }

  for (const edge of graph.edges || []) {
    if (!seen.has(edge.source)) {
      console.warn(`AI Agents graph edge references missing source node: ${edge.source}`);
    }
    if (!seen.has(edge.target)) {
      console.warn(`AI Agents graph edge references missing target node: ${edge.target}`);
    }
    if (!ALLOWED_RELATIONS.includes(edge.type)) {
      console.warn(`AI Agents graph edge has unsupported relation type: ${edge.type}`);
    }
  }
}

function render() {
  const width = svg.node().clientWidth || 900;
  const height = svg.node().clientHeight || 620;
  const nodes = state.graph.nodes.map((node) => ({ ...node }));
  const links = state.graph.edges.map((edge) => ({ ...edge }));
  const nodeById = new Map(nodes.map((node) => [node.id, node]));

  svg.selectAll("*").remove();
  svg.attr("viewBox", [-width / 2, -height / 2, width, height]);

  const defs = svg.append("defs");
  defs
    .append("marker")
    .attr("id", "arrow-default")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 17)
    .attr("refY", 0)
    .attr("markerWidth", 7)
    .attr("markerHeight", 7)
    .attr("orient", "auto")
    .append("path")
    .attr("fill", "rgba(244, 241, 234, 0.72)")
    .attr("d", "M0,-5L10,0L0,5");

  viewportLayer = svg.append("g").attr("class", "agents-viewport");
  const linkLayer = viewportLayer.append("g").attr("class", "agent-links");
  const labelLayer = viewportLayer.append("g").attr("class", "agent-labels");
  const nodeLayer = viewportLayer.append("g").attr("class", "agent-nodes");

  const linkSelection = linkLayer
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("class", "agent-link")
    .attr("stroke", (edge) => RELATION_COLORS[edge.type] || "var(--line-strong)");

  linkSelection.append("title").text((edge) => `${labelFor(nodeById, edge.source)} ${edge.type} ${labelFor(nodeById, edge.target)}`);

  const labelSelection = labelLayer
    .selectAll("text")
    .data(links)
    .join("text")
    .attr("class", "agent-link-label")
    .text((edge) => edge.type);

  const nodeSelection = nodeLayer
    .selectAll("g")
    .data(nodes, (node) => node.id)
    .join("g")
    .attr("class", (node) => nodeClass(node, links))
    .call(
      d3
        .drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded)
    )
    .on("click", (_event, node) => {
      state.selectedId = node.id;
      updateDetails(node);
      nodeLayer.selectAll("g").attr("class", (item) => nodeClass(item, links));
    });

  nodeSelection.append("circle").attr("r", (node) => radiusFor(node));
  nodeSelection
    .append("text")
    .attr("x", (node) => radiusFor(node) + 8)
    .attr("y", "0.32em")
    .text((node) => node.label);
  nodeSelection.append("title").text((node) => node.description);

  setupZoom(width, height);

  simulation?.stop();
  simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((node) => node.id)
        .distance((edge) => (edge.source.id === "ai-agent" || edge.target.id === "ai-agent" ? 150 : 120))
        .strength(0.62)
    )
    .force("charge", d3.forceManyBody().strength(-520))
    .force("center", d3.forceCenter(0, 0))
    .force("collision", d3.forceCollide().radius((node) => radiusFor(node) + 46))
    .force("x", d3.forceX((node) => (node.id === "ai-agent" ? 0 : 0)).strength((node) => (node.id === "ai-agent" ? 0.18 : 0.035)))
    .force("y", d3.forceY((node) => (node.id === "ai-agent" ? 0 : 0)).strength((node) => (node.id === "ai-agent" ? 0.18 : 0.035)))
    .alphaDecay(0.055)
    .velocityDecay(0.58)
    .on("tick", () => {
      linkSelection
        .attr("x1", (edge) => edge.source.x)
        .attr("y1", (edge) => edge.source.y)
        .attr("x2", (edge) => edge.target.x)
        .attr("y2", (edge) => edge.target.y);

      labelSelection
        .attr("x", (edge) => (edge.source.x + edge.target.x) / 2)
        .attr("y", (edge) => (edge.source.y + edge.target.y) / 2);

      nodeSelection.attr("transform", (node) => `translate(${node.x},${node.y})`);
    });

  updateFilteredState();
  updateDetails(nodeById.get(state.selectedId) || nodes[0]);
}

function setupZoom(width, height) {
  zoomBehavior = d3
    .zoom()
    .scaleExtent([0.45, 3])
    .translateExtent([
      [-width * 2, -height * 2],
      [width * 2, height * 2]
    ])
    .filter((event) => !event.button && !event.target.closest(".agent-node"))
    .on("zoom", (event) => {
      state.transform = event.transform;
      viewportLayer.attr("transform", state.transform);
    });

  svg.call(zoomBehavior).call(zoomBehavior.transform, state.transform).on("dblclick.zoom", null);
}

function updateFilteredState() {
  if (!state.graph) return;

  const activeNodeIds = new Set();
  for (const edge of state.graph.edges) {
    if (state.activeRelations.has(edge.type)) {
      activeNodeIds.add(edge.source);
      activeNodeIds.add(edge.target);
    }
  }

  svg
    .selectAll(".agent-link")
    .classed("filtered-out", (edge) => !state.activeRelations.has(edge.type))
    .attr("marker-end", (edge) => (state.activeRelations.has(edge.type) ? "url(#arrow-default)" : null));
  svg.selectAll(".agent-link-label").classed("filtered-out", (edge) => !state.activeRelations.has(edge.type));
  svg.selectAll(".agent-node").classed("filtered-out", (node) => !activeNodeIds.has(node.id));
}

function updateDetails(node) {
  if (!node) return;

  detailsTitle.textContent = node.label;
  nodeType.textContent = node.type;
  nodeStatus.textContent = node.status;
  nodeDescription.textContent = node.description;
  feedbackLink.href = `${FEEDBACK_URL}?title=${encodeURIComponent(`AI Agents graph feedback: ${node.label}`)}`;
}

function nodeClass(node) {
  const classes = ["agent-node"];
  if (node.id === state.selectedId) classes.push("selected");
  return classes.join(" ");
}

function labelFor(nodeById, endpoint) {
  const id = typeof endpoint === "string" ? endpoint : endpoint.id;
  return nodeById.get(id)?.label || id;
}

function radiusFor(node) {
  if (node.id === "ai-agent") return 16;
  if (node.type.includes("related concept")) return 11;
  return 8;
}

function dragStarted(event, node) {
  if (!event.active) simulation.alphaTarget(0.18).restart();
  node.fx = node.x;
  node.fy = node.y;
}

function dragged(event, node) {
  node.fx = event.x;
  node.fy = event.y;
}

function dragEnded(event, node) {
  if (!event.active) simulation.alphaTarget(0);
  node.fx = null;
  node.fy = null;
}

function showLoadError(error) {
  console.error(error);
  detailsTitle.textContent = "Graph failed to load";
  nodeType.textContent = "error";
  nodeStatus.textContent = "unavailable";
  nodeDescription.textContent = error.message;
}
