import type { GraphData, Step } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 100, y: 200 },
    { id: 'B', x: 250, y: 100 },
    { id: 'C', x: 250, y: 300 },
    { id: 'D', x: 400, y: 200 },
  ],
  adj: { 'A': ['B', 'C'], 'B': ['D'], 'C': [], 'D': [] },
  edges: [
    {from: 'A', to: 'B', weight: 1},
    {from: 'A', to: 'C', weight: 1},
    {from: 'B', to: 'D', weight: 1},
  ],
  directed: true,
};

export const dataStructureName = 'Topological Order';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Maximum Edges to Add to a DAG</h3>
  <p>
    Given a Directed Acyclic Graph (DAG), what is the maximum number of edges we can add to it such that it remains a DAG (i.e., no cycles are created)?
  </p>
  <p>
    This problem can be solved efficiently using a <strong>topological sort</strong>. An edge can be added from vertex <code>u</code> to vertex <code>v</code> without creating a cycle if and only if <code>u</code> appears before <code>v</code> in at least one topological ordering of the graph.
  </p>
  <p>The algorithm is as follows:</p>
  <ol class="list-decimal list-inside space-y-1 my-2">
    <li>Find a topological sort of the graph's vertices.</li>
    <li>Iterate through all pairs of vertices <code>(u, v)</code>.</li>
    <li>If <code>u</code> comes before <code>v</code> in the sorted order and there is no existing edge from <code>u</code> to <code>v</code>, add a new edge.</li>
  </ol>
  <p>The animation shows this process, with the newly added edges appearing as dashed green lines.</p>
`;

export const generateSteps = (graph: GraphData): Step[] => {
  const steps: Step[] = [];
  
  // 1. Topological Sort (using Kahn's algorithm)
  const inDegree: Record<string, number> = {};
  graph.nodes.forEach(n => inDegree[n.id] = 0);
  graph.edges!.forEach(e => inDegree[e.to]++);
  const queue = graph.nodes.filter(n => inDegree[n.id] === 0).map(n => n.id);
  const topoSorted: string[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    topoSorted.push(u);
    (graph.adj[u] || []).forEach(v => {
      inDegree[v]--;
      if (inDegree[v] === 0) queue.push(v);
    });
  }
  
  steps.push({
    description: "Phase 1: First, find a topological sort of the graph.",
    currentNode: null,
    dataStructure: topoSorted,
    visited: new Set(topoSorted),
  });

  // 2. Add edges
  const existingEdges = new Set(graph.edges!.map(e => `${e.from}->${e.to}`));
  const addedEdges = new Set<string>();

  steps.push({
    description: "Phase 2: Iterate through sorted nodes and add all valid edges.",
    currentNode: null,
    dataStructure: topoSorted,
    visited: new Set(topoSorted),
    addedEdges: new Set(addedEdges),
  });

  for (let i = 0; i < topoSorted.length; i++) {
    const u = topoSorted[i];
    steps.push({
      description: `Considering outgoing edges from ${u}.`,
      currentNode: u,
      dataStructure: topoSorted,
      visited: new Set(topoSorted),
      addedEdges: new Set(addedEdges),
    });
    for (let j = i + 1; j < topoSorted.length; j++) {
      const v = topoSorted[j];
      const edgeKey = `${u}->${v}`;
      if (!existingEdges.has(edgeKey)) {
        addedEdges.add(edgeKey);
        steps.push({
          description: `Adding new edge from ${u} to ${v} as ${u} comes before ${v}.`,
          currentNode: u,
          neighbor: v,
          dataStructure: topoSorted,
          visited: new Set(topoSorted),
          addedEdges: new Set(addedEdges),
        });
      }
    }
  }
  
  steps.push({
    description: "Complete. All possible non-cyclic edges have been added.",
    currentNode: null,
    dataStructure: topoSorted,
    visited: new Set(topoSorted),
    addedEdges: new Set(addedEdges),
  });

  return steps;
};