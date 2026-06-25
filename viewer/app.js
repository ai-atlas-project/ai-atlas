const DATA_URL = "../taxonomy/ai-taxonomy-l1-l2.json";
const FEEDBACK_URL = "https://github.com/ai-atlas-project/ai-atlas/issues/new";

const state = {
  taxonomy: null,
  selectedId: "ai:artificial-intelligence",
  expanded: new Set(),
  query: "",
  conceptType: "",
  status: "",
  mapTransform: d3.zoomIdentity,
};

const svg = d3.select("#map");
const searchInput = document.querySelector("#search");
const typeFilter = document.querySelector("#type-filter");
const statusFilter = document.querySelector("#status-filter");
const expandAllButton = document.querySelector("#expand-all");
const collapseAllButton = document.querySelector("#collapse-all");
const recenterMapButton = document.querySelector("#recenter-map");
const toggleSelectedButton = document.querySelector("#toggle-selected");
const conceptCard = document.querySelector("#concept-card");
const closeCardButton = document.querySelector("#close-card");

const detailsTitle = document.querySelector("#details-title");
const nodeLevel = document.querySelector("#node-level");
const nodeType = document.querySelector("#node-type");
const nodeStatus = document.querySelector("#node-status");
const nodeDescription = document.querySelector("#node-description");
const feedbackLink = document.querySelector("#feedback-link");

let simulation;
let zoomBehavior;
let viewportLayer;

fetch(DATA_URL)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to load ${DATA_URL}: ${response.status}`);
    }
    return response.json();
  })
  .then((taxonomy) => {
    state.taxonomy = taxonomy;
    populateFilters(taxonomy);
    render();
  })
  .catch((error) => {
    showLoadError(error);
  });

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value.trim().toLowerCase();
  render();
});

typeFilter.addEventListener("change", (event) => {
  state.conceptType = event.target.value;
  expandParentsForActiveFilters();
  render();
});

statusFilter.addEventListener("change", (event) => {
  state.status = event.target.value;
  expandParentsForActiveFilters();
  render();
});

expandAllButton.addEventListener("click", () => {
  for (const area of state.taxonomy.level_1) {
    state.expanded.add(area.id);
  }
  render();
});

collapseAllButton.addEventListener("click", () => {
  state.expanded.clear();
  state.selectedId = "ai:artificial-intelligence";
  state.query = "";
  state.conceptType = "";
  state.status = "";
  state.mapTransform = d3.zoomIdentity;
  searchInput.value = "";
  typeFilter.value = "";
  statusFilter.value = "";
  showConceptCard();
  render();
});

recenterMapButton.addEventListener("click", () => {
  recenterMap();
});

toggleSelectedButton.addEventListener("click", () => {
  const selected = findNodeById(state.selectedId);
  if (!selected || selected.hierarchy_level !== 1) return;

  if (state.expanded.has(selected.id)) {
    state.expanded.delete(selected.id);
  } else {
    state.expanded.add(selected.id);
  }

  render();
});

closeCardButton.addEventListener("click", () => {
  hideConceptCard();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    hideConceptCard();
  }
});

function render() {
  if (!state.taxonomy) return;

  const width = svg.node().clientWidth || 1000;
  const height = svg.node().clientHeight || 680;
  const graph = buildGraph(state.taxonomy);
  const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));

  if (!nodeById.has(state.selectedId)) {
    state.selectedId = "ai:artificial-intelligence";
  }

  svg.selectAll("*").remove();
  svg.attr("viewBox", [-width / 2, -height / 2, width, height]);

  viewportLayer = svg.append("g").attr("class", "map-viewport");
  const linkLayer = viewportLayer.append("g").attr("class", "links");
  const nodeLayer = viewportLayer.append("g").attr("class", "nodes");

  const links = linkLayer
    .selectAll("line")
    .data(graph.links)
    .join("line")
    .attr("class", "link")
    .classed("dimmed", (link) => !passesActiveFilters(link.target));

  const nodes = nodeLayer
    .selectAll("g")
    .data(graph.nodes, (node) => node.id)
    .join("g")
    .attr("class", (node) => nodeClass(node))
    .call(
      d3
        .drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded),
    )
    .on("click", (_event, node) => {
      state.selectedId = node.id;
      updateDetails(node);
      showConceptCard();
      nodeLayer.selectAll("g").attr("class", (item) => nodeClass(item));
    });

  nodes
    .append("circle")
    .attr("r", (node) => radiusFor(node));

  nodes
    .append("text")
    .attr("x", (node) => radiusFor(node) + 7)
    .attr("y", "0.32em")
    .text((node) => node.name);

  setupMapNavigation(width, height);

  simulation = d3
    .forceSimulation(graph.nodes)
    .force(
      "link",
      d3
        .forceLink(graph.links)
        .id((node) => node.id)
        .distance((link) => linkDistance(link)),
    )
    .force("charge", d3.forceManyBody().strength((node) => chargeFor(node)))
    .force("center", d3.forceCenter(0, 0))
    .force("collision", d3.forceCollide().radius((node) => radiusFor(node) + labelPaddingFor(node)))
    .force("x", d3.forceX((node) => xFor(node, width)).strength((node) => (node.hierarchy_level === 0 ? 0.2 : 0.03)))
    .force("y", d3.forceY((node) => yFor(node, height)).strength((node) => (node.hierarchy_level === 0 ? 0.2 : 0.03)))
    .alphaDecay(0.075)
    .velocityDecay(0.68)
    .on("tick", () => {
      links
        .attr("x1", (link) => link.source.x)
        .attr("y1", (link) => link.source.y)
        .attr("x2", (link) => link.target.x)
        .attr("y2", (link) => link.target.y);

      nodes.attr("transform", (node) => `translate(${node.x},${node.y})`);
    });

  updateDetails(nodeById.get(state.selectedId));
}

function setupMapNavigation(width, height) {
  zoomBehavior = d3
    .zoom()
    .scaleExtent([0.45, 3])
    .translateExtent([
      [-width * 2.4, -height * 2.4],
      [width * 2.4, height * 2.4],
    ])
    .filter((event) => {
      if (event.type === "wheel") {
        return event.ctrlKey || event.metaKey;
      }

      return !event.button && !event.target.closest(".node");
    })
    .on("zoom", (event) => {
      state.mapTransform = event.transform;
      viewportLayer.attr("transform", state.mapTransform);
    });

  svg
    .call(zoomBehavior)
    .call(zoomBehavior.transform, state.mapTransform)
    .on("dblclick.zoom", null)
    .on("wheel.map-pan", handleWheelPan, { passive: false });
}

function handleWheelPan(event) {
  if (event.ctrlKey || event.metaKey) {
    return;
  }

  event.preventDefault();
  const current = d3.zoomTransform(svg.node());
  const next = current.translate(-event.deltaX / current.k, -event.deltaY / current.k);
  svg.call(zoomBehavior.transform, next);
}

function recenterMap() {
  state.selectedId = "ai:artificial-intelligence";
  state.mapTransform = d3.zoomIdentity;
  showConceptCard();

  const selected = findNodeById(state.selectedId);
  if (selected) {
    updateDetails(selected);
  }

  svg.selectAll(".nodes g").attr("class", (node) => nodeClass(node));

  if (!zoomBehavior) return;

  svg
    .transition()
    .duration(220)
    .call(zoomBehavior.transform, state.mapTransform);
}

function buildGraph(taxonomy) {
  const nodes = [];
  const links = [];
  const root = taxonomy.level_0;

  nodes.push({ ...root, depth: 0 });

  for (const [index, area] of taxonomy.level_1.entries()) {
    const areaNode = { ...area, depth: 1, angleIndex: index, siblingCount: taxonomy.level_1.length };
    nodes.push(areaNode);
    links.push({ source: root.id, target: area.id });

    const isExpanded = state.expanded.has(area.id) || activeFiltersRequireExpansion(area);
    if (isExpanded) {
      for (const [childIndex, child] of (area.level_2 || []).entries()) {
        nodes.push({
          ...child,
          depth: 2,
          parentId: area.id,
          angleIndex: index,
          childIndex,
          siblingCount: taxonomy.level_1.length,
          childCount: area.level_2.length,
        });
        links.push({ source: area.id, target: child.id });
      }
    }
  }

  return { nodes, links };
}

function populateFilters(taxonomy) {
  const nodes = flattenTaxonomy(taxonomy);
  const conceptTypes = uniqueSorted(nodes.map((node) => node.concept_type).filter(Boolean));
  const statuses = uniqueSorted(nodes.map((node) => node.stability).filter(Boolean));

  for (const type of conceptTypes) {
    typeFilter.append(new Option(type, type));
  }

  for (const status of statuses) {
    statusFilter.append(new Option(status, status));
  }
}

function flattenTaxonomy(taxonomy) {
  return [
    taxonomy.level_0,
    ...taxonomy.level_1,
    ...taxonomy.level_1.flatMap((area) => area.level_2 || []),
  ];
}

function uniqueSorted(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function expandParentsForActiveFilters() {
  if (!hasActiveFilters()) return;

  for (const area of state.taxonomy.level_1) {
    if (activeFiltersRequireExpansion(area)) {
      state.expanded.add(area.id);
    }
  }
}

function activeFiltersRequireExpansion(area) {
  if (!hasActiveFilters()) return false;
  return passesActiveFilters(area) || (area.level_2 || []).some((child) => passesActiveFilters(child));
}

function hasActiveFilters() {
  return Boolean(state.query || state.conceptType || state.status);
}

function passesActiveFilters(node) {
  if (state.query && !matches(node, state.query)) return false;
  if (state.conceptType && node.concept_type !== state.conceptType) return false;
  if (state.status && node.stability !== state.status) return false;
  return true;
}

function nodeClass(node) {
  const classes = [`node`, `level-${node.hierarchy_level}`];

  if (node.id === state.selectedId) classes.push("selected");
  if (hasActiveFilters() && passesActiveFilters(node)) classes.push("matched");
  if (hasActiveFilters() && !passesActiveFilters(node)) classes.push("dimmed");

  return classes.join(" ");
}

function matches(node, query) {
  const haystack = [node.name, node.description, node.concept_type, node.hierarchy_level_name, node.stability]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function radiusFor(node) {
  if (node.hierarchy_level === 0) return 17;
  if (node.hierarchy_level === 1) return 10;
  return 5.8;
}

function labelPaddingFor(node) {
  if (node.hierarchy_level === 0) return 125;
  if (node.hierarchy_level === 1) return 92;
  return 58;
}

function linkDistance(link) {
  return link.source.hierarchy_level === 0 ? 150 : 108;
}

function chargeFor(node) {
  if (node.hierarchy_level === 0) return -720;
  if (node.hierarchy_level === 1) return -320;
  return -105;
}

function xFor(node, width) {
  if (node.hierarchy_level === 0) return -width * 0.06;
  const angle = angleFor(node);
  const radius = node.hierarchy_level === 1 ? width * 0.27 : width * 0.42;
  return Math.cos(angle) * radius;
}

function yFor(node, height) {
  if (node.hierarchy_level === 0) return 0;
  const angle = angleFor(node);
  const radius = node.hierarchy_level === 1 ? height * 0.28 : height * 0.42;
  return Math.sin(angle) * radius;
}

function angleFor(node) {
  const count = Math.max(node.siblingCount || 1, 1);
  const base = (-Math.PI / 2) + ((2 * Math.PI * (node.angleIndex || 0)) / count);

  if (node.hierarchy_level !== 2) {
    return base;
  }

  const childCount = Math.max(node.childCount || 1, 1);
  const spread = Math.min(Math.PI / 4, childCount * 0.035);
  const offset = childCount === 1 ? 0 : ((node.childIndex / (childCount - 1)) - 0.5) * spread;
  return base + offset;
}

function updateDetails(node) {
  if (!node) return;

  detailsTitle.textContent = node.name;
  nodeLevel.textContent = `Level ${node.hierarchy_level} - ${node.hierarchy_level_name}`;
  nodeType.textContent = node.concept_type || "Not specified";
  nodeStatus.textContent = node.stability || "Not specified";
  nodeDescription.textContent = node.description || "No description yet.";

  if (node.hierarchy_level === 1) {
    toggleSelectedButton.hidden = false;
    toggleSelectedButton.textContent = state.expanded.has(node.id) ? "Collapse this area" : "Expand this area";
  } else {
    toggleSelectedButton.hidden = true;
  }

  const params = new URLSearchParams({
    title: `Feedback on ${node.name}`,
    body: `Concept: ${node.name}\n\nFeedback:\n`,
  });
  feedbackLink.href = `${FEEDBACK_URL}?${params.toString()}`;
}

function showConceptCard() {
  conceptCard.hidden = false;
}

function hideConceptCard() {
  conceptCard.hidden = true;
}

function findNodeById(id) {
  return flattenTaxonomy(state.taxonomy).find((node) => node.id === id);
}

function dragStarted(event) {
  if (!event.active) simulation.alphaTarget(0.14).restart();
  event.subject.fx = event.subject.x;
  event.subject.fy = event.subject.y;
}

function dragged(event) {
  event.subject.fx = event.x;
  event.subject.fy = event.y;
}

function dragEnded(event) {
  if (!event.active) simulation.alphaTarget(0);
  event.subject.fx = null;
  event.subject.fy = null;
}

function showLoadError(error) {
  document.querySelector(".map-wrap").innerHTML = `
    <div class="load-error">
      <h2>Could not load the taxonomy data.</h2>
      <p>${escapeHtml(error.message)}</p>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
