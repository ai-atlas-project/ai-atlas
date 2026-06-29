const DATA_URL = "../taxonomy/ai-taxonomy-l1-l2.json";
const FEEDBACK_URL = "https://github.com/ai-atlas-project/ai-atlas/issues/new";
const ROOT_ID = "ai:artificial-intelligence";

const state = {
  taxonomy: null,
  selectedId: ROOT_ID,
  expanded: new Set(),
  query: "",
  conceptType: "",
  status: "",
  rootOnly: false,
  mapTransform: d3.zoomIdentity,
  controlsCollapsed: false,
};

const svg = d3.select("#map");
const mapCard = document.querySelector(".map-card");
const mapWrap = document.querySelector(".map-wrap");
const controlsToggleButton = document.querySelector("#controls-toggle");
const searchInput = document.querySelector("#search");
const typeFilter = document.querySelector("#type-filter");
const statusFilter = document.querySelector("#status-filter");
const expandAllButton = document.querySelector("#expand-all");
const collapseAllButton = document.querySelector("#collapse-all");
const recenterMapButton = document.querySelector("#recenter-map");
const zoomInButton = document.querySelector("#zoom-in");
const zoomOutButton = document.querySelector("#zoom-out");
const toggleSelectedButton = document.querySelector("#toggle-selected");
const conceptCard = document.querySelector("#concept-card");
const closeCardButton = document.querySelector("#close-card");
const copyConceptLinkButton = document.querySelector("#copy-concept-link");
const copyLinkStatus = document.querySelector("#copy-link-status");

const detailsTitle = document.querySelector("#details-title");
const nodeLevel = document.querySelector("#node-level");
const nodeType = document.querySelector("#node-type");
const nodeStatus = document.querySelector("#node-status");
const nodeDescription = document.querySelector("#node-description");
const feedbackLink = document.querySelector("#feedback-link");

let simulation;
let zoomBehavior;
let viewportLayer;
let focusTimeout;
let copyStatusTimeout;

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

    const initialConceptId = parseConceptHash();
    const initialConcept = initialConceptId ? findNodeById(initialConceptId) : null;
    if (initialConcept) {
      applySelectedConcept(initialConcept, { revealCard: true });
    }

    render();
    if (initialConcept) {
      showConceptCard();
      scheduleFocusOnNode(initialConcept.id);
    } else {
      setInitialConceptCardVisibility();
    }
    setControlsCollapsed(false);
  })
  .catch((error) => {
    showLoadError(error);
  });

searchInput.addEventListener("input", (event) => {
  state.rootOnly = false;
  state.query = event.target.value.trim().toLowerCase();
  render();
});

typeFilter.addEventListener("change", (event) => {
  state.rootOnly = false;
  state.conceptType = event.target.value;
  expandParentsForActiveFilters();
  render();
});

statusFilter.addEventListener("change", (event) => {
  state.rootOnly = false;
  state.status = event.target.value;
  expandParentsForActiveFilters();
  render();
});

expandAllButton.addEventListener("click", () => {
  state.rootOnly = false;
  for (const area of state.taxonomy.level_1) {
    state.expanded.add(area.id);
  }
  render();
});

collapseAllButton.addEventListener("click", () => {
  state.rootOnly = false;
  state.expanded.clear();
  state.selectedId = ROOT_ID;
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

zoomInButton.addEventListener("click", () => {
  zoomMap(1.22);
});

zoomOutButton.addEventListener("click", () => {
  zoomMap(1 / 1.22);
});

controlsToggleButton.addEventListener("click", () => {
  setControlsCollapsed(!state.controlsCollapsed);
});

mapWrap.addEventListener("pointerdown", (event) => {
  if (isMobileViewport() && !state.controlsCollapsed && !event.target.closest(".node")) {
    setControlsCollapsed(true);
  }
});

svg.node().addEventListener("keydown", (event) => {
  if (event.metaKey || event.ctrlKey || event.altKey) return;

  if (event.key === "+" || event.key === "=") {
    event.preventDefault();
    zoomMap(1.22);
  } else if (event.key === "-" || event.key === "_") {
    event.preventDefault();
    zoomMap(1 / 1.22);
  } else if (event.key === "0") {
    event.preventDefault();
    recenterMap();
  }
});

toggleSelectedButton.addEventListener("click", () => {
  const selected = findNodeById(state.selectedId);
  if (!selected) return;

  if (selected.hierarchy_level === 0) {
    toggleRootView();
    return;
  }

  if (selected.hierarchy_level !== 1 || !(selected.level_2 || []).length) {
    return;
  }

  state.rootOnly = false;
  if (state.expanded.has(selected.id)) {
    state.expanded.delete(selected.id);
  } else {
    state.expanded.add(selected.id);
  }

  render();
  scheduleFocusOnNode(selected.id);
});

closeCardButton.addEventListener("click", () => {
  hideConceptCard();
  svg.node().focus({ preventScroll: true });
});

copyConceptLinkButton.addEventListener("click", () => {
  copySelectedConceptLink();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    hideConceptCard();
  }
});

window.addEventListener("hashchange", handleConceptHashChange);
window.addEventListener("popstate", handleConceptHashChange);

function handleConceptHashChange() {
  if (!state.taxonomy) return;

  const conceptId = parseConceptHash();

  if (!conceptId) {
    state.selectedId = ROOT_ID;
    render();
    setInitialConceptCardVisibility();
    return;
  }

  if (!findNodeById(conceptId)) {
    state.selectedId = ROOT_ID;
    render();
    setInitialConceptCardVisibility();
    return;
  }

  selectConcept(conceptId, { renderMap: true, revealCard: true, focusNode: true });
}

function render() {
  if (!state.taxonomy) return;

  const width = svg.node().clientWidth || 1000;
  const height = svg.node().clientHeight || 680;
  const graph = buildGraph(state.taxonomy);
  const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));

  if (!nodeById.has(state.selectedId)) {
    state.selectedId = ROOT_ID;
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
      selectConcept(node.id, { updateHash: true, renderMap: false, revealCard: true });
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
    .scaleExtent([0.45, 3.4])
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

function zoomMap(factor) {
  if (!zoomBehavior) return;

  svg
    .transition()
    .duration(180)
    .call(zoomBehavior.scaleBy, factor);
}

function recenterMap() {
  applySelectedConcept(findNodeById(ROOT_ID), { revealCard: true });
  state.mapTransform = centeredRootTransform();
  updateConceptHash(ROOT_ID);

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

function setControlsCollapsed(collapsed) {
  state.controlsCollapsed = collapsed;
  mapCard.classList.toggle("controls-collapsed", collapsed);
  controlsToggleButton.setAttribute("aria-expanded", String(!collapsed));
}

function centeredRootTransform() {
  if (!isMobileViewport() || !svg.node()) {
    return d3.zoomIdentity;
  }

  const rootNode = svg
    .selectAll(".nodes g")
    .filter((node) => node.id === ROOT_ID)
    .datum();

  if (!rootNode) {
    return d3.zoomIdentity;
  }

  const width = svg.node().clientWidth || 1000;
  const height = svg.node().clientHeight || 680;
  const x = Number.isFinite(rootNode.x) ? rootNode.x : xFor(rootNode, width);
  const y = Number.isFinite(rootNode.y) ? rootNode.y : yFor(rootNode, height);
  const targetX = -width * 0.28;
  const targetY = -height * 0.32;

  return d3.zoomIdentity.translate(targetX - x, targetY - y);
}

function toggleRootView() {
  if (state.rootOnly) {
    state.rootOnly = false;
  } else {
    state.rootOnly = true;
    state.expanded.clear();
    state.query = "";
    state.conceptType = "";
    state.status = "";
    searchInput.value = "";
    typeFilter.value = "";
    statusFilter.value = "";
  }

  applySelectedConcept(findNodeById(ROOT_ID), { revealCard: true });
  state.mapTransform = d3.zoomIdentity;
  updateConceptHash(ROOT_ID);
  render();
}

function selectConcept(nodeId, options = {}) {
  const node = findNodeById(nodeId);
  if (!node) return false;

  applySelectedConcept(node, options);

  if (options.updateHash) {
    updateConceptHash(node.id);
  }

  if (options.renderMap) {
    render();
  } else {
    updateDetails(node);
  }

  if (options.focusNode) {
    scheduleFocusOnNode(node.id);
  }

  return true;
}

function applySelectedConcept(node, options = {}) {
  if (!node) return;

  state.rootOnly = false;
  state.selectedId = node.id;
  expandParentForNode(node);

  if (options.revealCard) {
    showConceptCard();
  }
}

function expandParentForNode(node) {
  if (node.hierarchy_level !== 2) return;

  const parent = findParentAreaForNode(node.id);
  if (parent) {
    state.expanded.add(parent.id);
  }
}

function findParentAreaForNode(nodeId) {
  return state.taxonomy.level_1.find((area) => (area.level_2 || []).some((child) => child.id === nodeId));
}

function parseConceptHash() {
  const hash = window.location.hash.slice(1);
  if (!hash) return null;

  const params = new URLSearchParams(hash);
  return params.get("concept");
}

function updateConceptHash(nodeId) {
  const nextUrl = `${window.location.pathname}${window.location.search}#concept=${formatConceptHashId(nodeId)}`;
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  if (currentUrl === nextUrl) {
    return;
  }

  window.history.pushState(null, "", nextUrl);
}

function conceptUrl(nodeId) {
  return `${window.location.origin}${window.location.pathname}${window.location.search}#concept=${formatConceptHashId(nodeId)}`;
}

function formatConceptHashId(nodeId) {
  return encodeURIComponent(nodeId).replaceAll("%3A", ":");
}

function copySelectedConceptLink() {
  const url = conceptUrl(state.selectedId);

  if (navigator.clipboard?.writeText) {
    navigator.clipboard
      .writeText(url)
      .then(() => showCopyStatus("Link copied."))
      .catch(() => fallbackCopyConceptLink(url));
    return;
  }

  fallbackCopyConceptLink(url);
}

function fallbackCopyConceptLink(url) {
  const input = document.createElement("input");
  input.value = url;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.top = "-1000px";
  document.body.append(input);
  input.select();

  try {
    document.execCommand("copy");
    showCopyStatus("Link copied.");
  } catch {
    showCopyStatus("Could not copy link.");
  } finally {
    input.remove();
  }
}

function showCopyStatus(message) {
  window.clearTimeout(copyStatusTimeout);
  copyLinkStatus.textContent = message;
  copyStatusTimeout = window.setTimeout(() => {
    copyLinkStatus.textContent = "";
  }, 2400);
}

function scheduleFocusOnNode(nodeId) {
  window.clearTimeout(focusTimeout);
  focusTimeout = window.setTimeout(() => focusRenderedNode(nodeId), 280);
}

function focusRenderedNode(nodeId) {
  if (!zoomBehavior) return;

  const node = svg
    .selectAll(".nodes g")
    .filter((item) => item.id === nodeId)
    .datum();

  if (!node || node.hierarchy_level === 0) {
    state.mapTransform = d3.zoomIdentity;
  } else {
    const x = Number.isFinite(node.x) ? node.x : xFor(node, svg.node().clientWidth || 1000);
    const y = Number.isFinite(node.y) ? node.y : yFor(node, svg.node().clientHeight || 680);
    state.mapTransform = d3.zoomIdentity.translate(-x, -y).scale(Math.max(state.mapTransform.k, 1));
  }

  svg
    .transition()
    .duration(260)
    .call(zoomBehavior.transform, state.mapTransform);
}

function buildGraph(taxonomy) {
  const nodes = [];
  const links = [];
  const root = taxonomy.level_0;

  nodes.push({ ...root, depth: 0 });

  if (state.rootOnly && !hasActiveFilters()) {
    return { nodes, links };
  }

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

  if (node.hierarchy_level === 0) {
    toggleSelectedButton.hidden = false;
    toggleSelectedButton.textContent = state.rootOnly ? "Show overview" : "Collapse to AI only";
  } else if (node.hierarchy_level === 1 && (node.level_2 || []).length) {
    toggleSelectedButton.hidden = false;
    toggleSelectedButton.textContent = state.expanded.has(node.id) ? "Collapse this area" : "Expand this area";
  } else {
    toggleSelectedButton.hidden = true;
  }

  const issueBody = [
    `Concept: ${node.name}`,
    `Concept ID: ${node.id}`,
    `Level: ${node.hierarchy_level} - ${node.hierarchy_level_name}`,
    `Concept type: ${node.concept_type || "Not specified"}`,
    `Status: ${node.stability || "Not specified"}`,
    "",
    "What kind of feedback is this?",
    "- [ ] Missing concept",
    "- [ ] Misplaced concept",
    "- [ ] Overlapping or unclear concept",
    "- [ ] Description/name improvement",
    "- [ ] Other",
    "",
    "Feedback:",
    "",
  ].join("\n");

  const params = new URLSearchParams({
    title: `Feedback on ${node.name}`,
    body: issueBody,
  });
  feedbackLink.href = `${FEEDBACK_URL}?${params.toString()}`;
}

function showConceptCard() {
  conceptCard.hidden = false;
}

function hideConceptCard() {
  conceptCard.hidden = true;
}

function setInitialConceptCardVisibility() {
  if (isMobileViewport()) {
    hideConceptCard();
  } else {
    showConceptCard();
  }
}

function isMobileViewport() {
  return window.matchMedia("(max-width: 700px)").matches;
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
