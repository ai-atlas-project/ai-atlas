const DATA_URL = "../taxonomy/ai-taxonomy-l1-l2.json";
const FEEDBACK_URL = "https://github.com/ai-atlas-project/ai-atlas/issues/new";

const state = {
  taxonomy: null,
  selectedId: "ai:artificial-intelligence",
  expanded: new Set(),
  query: "",
};

const svg = d3.select("#map");
const searchInput = document.querySelector("#search");
const resetButton = document.querySelector("#reset");

const detailsTitle = document.querySelector("#details-title");
const nodeLevel = document.querySelector("#node-level");
const nodeType = document.querySelector("#node-type");
const nodeStatus = document.querySelector("#node-status");
const nodeDescription = document.querySelector("#node-description");
const feedbackLink = document.querySelector("#feedback-link");

let simulation;

fetch(DATA_URL)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to load ${DATA_URL}: ${response.status}`);
    }
    return response.json();
  })
  .then((taxonomy) => {
    state.taxonomy = taxonomy;
    render();
  })
  .catch((error) => {
    showLoadError(error);
  });

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value.trim().toLowerCase();

  if (state.query) {
    for (const area of state.taxonomy.level_1) {
      const areaMatches = matches(area, state.query);
      const childMatches = area.level_2?.some((child) => matches(child, state.query));

      if (areaMatches || childMatches) {
        state.expanded.add(area.id);
      }
    }
  }

  render();
});

resetButton.addEventListener("click", () => {
  state.selectedId = "ai:artificial-intelligence";
  state.expanded.clear();
  state.query = "";
  searchInput.value = "";
  render();
});

function render() {
  if (!state.taxonomy) return;

  const width = svg.node().clientWidth || 900;
  const height = svg.node().clientHeight || 560;
  const graph = buildGraph(state.taxonomy);
  const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));

  if (!nodeById.has(state.selectedId)) {
    state.selectedId = "ai:artificial-intelligence";
  }

  svg.selectAll("*").remove();
  svg.attr("viewBox", [-width / 2, -height / 2, width, height]);

  const linkLayer = svg.append("g").attr("class", "links");
  const nodeLayer = svg.append("g").attr("class", "nodes");

  const links = linkLayer
    .selectAll("line")
    .data(graph.links)
    .join("line")
    .attr("class", "link");

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

      if (node.hierarchy_level === 1) {
        if (state.expanded.has(node.id)) {
          state.expanded.delete(node.id);
        } else {
          state.expanded.add(node.id);
        }
      }

      render();
    });

  nodes
    .append("circle")
    .attr("r", (node) => radiusFor(node));

  nodes
    .append("text")
    .attr("x", (node) => radiusFor(node) + 7)
    .attr("y", "0.32em")
    .text((node) => node.name);

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
    .force("x", d3.forceX((node) => xFor(node, width)).strength((node) => (node.hierarchy_level === 0 ? 0.22 : 0.035)))
    .force("y", d3.forceY((node) => yFor(node, height)).strength((node) => (node.hierarchy_level === 0 ? 0.22 : 0.035)))
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

function buildGraph(taxonomy) {
  const nodes = [];
  const links = [];
  const root = taxonomy.level_0;

  nodes.push({ ...root, depth: 0 });

  for (const [index, area] of taxonomy.level_1.entries()) {
    const areaNode = { ...area, depth: 1, angleIndex: index, siblingCount: taxonomy.level_1.length };
    nodes.push(areaNode);
    links.push({ source: root.id, target: area.id });

    const isExpanded = state.expanded.has(area.id) || state.query;
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

function nodeClass(node) {
  const classes = [`node`, `level-${node.hierarchy_level}`];

  if (node.id === state.selectedId) classes.push("selected");
  if (state.query && matches(node, state.query)) classes.push("matched");

  return classes.join(" ");
}

function matches(node, query) {
  const haystack = [node.name, node.description, node.concept_type, node.hierarchy_level_name]
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
  return link.source.hierarchy_level === 0 ? 138 : 96;
}

function chargeFor(node) {
  if (node.hierarchy_level === 0) return -650;
  if (node.hierarchy_level === 1) return -280;
  return -95;
}

function xFor(node, width) {
  if (node.hierarchy_level === 0) return -width * 0.08;
  const angle = angleFor(node);
  const radius = node.hierarchy_level === 1 ? width * 0.26 : width * 0.38;
  return Math.cos(angle) * radius;
}

function yFor(node, height) {
  if (node.hierarchy_level === 0) return 0;
  const angle = angleFor(node);
  const radius = node.hierarchy_level === 1 ? height * 0.28 : height * 0.41;
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
  nodeLevel.textContent = `Level ${node.hierarchy_level} · ${node.hierarchy_level_name}`;
  nodeType.textContent = node.concept_type || "Not specified";
  nodeStatus.textContent = node.stability || "Not specified";
  nodeDescription.textContent = node.description || "No description yet.";

  const params = new URLSearchParams({
    title: `Feedback on ${node.name}`,
    body: `Concept: ${node.name}\n\nFeedback:\n`,
  });
  feedbackLink.href = `${FEEDBACK_URL}?${params.toString()}`;
}

function dragStarted(event) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
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
