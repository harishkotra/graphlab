import type { GraphData, Step } from './types';

// U = Applicants, V = Jobs
const U = ['A1', 'A2', 'A3', 'A4'];
const V = ['J1', 'J2', 'J3', 'J4'];
const bipartiteEdges = [
    ['A1', 'J1'], ['A1', 'J2'],
    ['A2', 'J1'], ['A2', 'J3'],
    ['A3', 'J2'], ['A3', 'J4'],
    ['A4', 'J3']
];

export const graphData: GraphData = {
  nodes: [
    { id: 'S', x: 50, y: 200 },
    ...U.map((u, i) => ({ id: u, x: 200, y: 80 + i * 80 })),
    ...V.map((v, i) => ({ id: v, x: 400, y: 80 + i * 80 })),
    { id: 'T', x: 550, y: 200 },
  ],
  adj: {}, // Will be built
  edges: [], // Will be built
  directed: true,
};

// Build the flow network from the bipartite graph
const buildFlowNetwork = () => {
    const adj: Record<string, string[]> = { 'S': [...U], 'T': [] };
    const edges: GraphData['edges'] = [];
    U.forEach(u => {
        adj[u] = [];
        edges.push({ from: 'S', to: u, weight: 1 });
    });
    V.forEach(v => {
        adj[v] = ['T'];
        edges.push({ from: v, to: 'T', weight: 1 });
    });
    bipartiteEdges.forEach(([u, v]) => {
        adj[u].push(v);
        edges.push({ from: u, to: v, weight: 1 });
    });
    graphData.adj = adj;
    graphData.edges = edges;
};
buildFlowNetwork();


export const dataStructureName = 'Matching Size';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Maximum Bipartite Matching</h3>
  <p>
    A <strong>matching</strong> in a bipartite graph is a set of edges where no two edges share a common vertex. The goal of the Maximum Bipartite Matching problem is to find a matching with the maximum possible number of edges. This is useful for assignment problems, like matching applicants to jobs.
  </p>
  <p>
    This problem can be solved using a max-flow algorithm. We convert the bipartite graph into a flow network:
  </p>
  <ol class="list-decimal list-inside space-y-1 my-2">
    <li>Create a source 'S' and sink 'T'.</li>
    <li>Add an edge from S to every node in the left set (U).</li>
    <li>Add an edge from every node in the right set (V) to T.</li>
    <li>Set the capacity of <strong>all</strong> edges to 1.</li>
  </ol>
  <p>The max flow in this network is equal to the size of the maximum matching. The edges with flow are the ones in the matching.</p>
`;

// Re-using Ford-Fulkerson logic
const getDirectedEdgeKey = (from: string, to: string) => `${from}->${to}`;

export const generateSteps = (graph: GraphData, startNode: string = 'S', endNode: string = 'T'): Step[] => {
  const steps: Step[] = [];
  const flows: Record<string, number> = {};
  graph.edges!.forEach(e => {
      flows[getDirectedEdgeKey(e.from, e.to)] = 0;
      flows[getDirectedEdgeKey(e.to, e.from)] = 0;
  });

  const capacities: Record<string, number> = {};
  graph.edges!.forEach(e => capacities[getDirectedEdgeKey(e.from, e.to)] = e.weight);

  let totalFlow = 0;

  const createStep = (desc: string, path: string[] | null = null) => {
    // Highlight matching edges
    const matchingEdges: string[] = [];
    bipartiteEdges.forEach(([u,v]) => {
        if(flows[getDirectedEdgeKey(u,v)] === 1) {
            matchingEdges.push(u,v);
        }
    });

    steps.push({
      description: desc,
      currentNode: null,
      highlightedPath: path || matchingEdges,
      flows: { ...flows },
      dataStructure: [`${totalFlow}`]
    });
  };

  createStep("Start with the constructed flow network. Find augmenting paths.");

  while (true) {
    const parent: Record<string, string> = {};
    const queue: string[] = [startNode];
    const visited = new Set<string>([startNode]);
    let pathFound = false;
    
    while (queue.length > 0) {
      const u = queue.shift()!;
      const neighbors = new Set<string>();
      (graph.adj[u] || []).forEach(v => neighbors.add(v));
      Object.keys(graph.adj).forEach(n => { if (graph.adj[n].includes(u)) neighbors.add(n); });

      for (const v of neighbors) {
        if (!visited.has(v) && ((capacities[getDirectedEdgeKey(u, v)] || 0) - flows[getDirectedEdgeKey(u, v)] > 0)) {
          parent[v] = u;
          visited.add(v);
          queue.push(v);
          if (v === endNode) { pathFound = true; break; }
        }
      }
      if(pathFound) break;
    }
    
    if (!pathFound) {
      createStep(`No more augmenting paths. Max flow is ${totalFlow}, so matching size is ${totalFlow}.`);
      break;
    }

    const path: string[] = [];
    let curr = endNode;
    while(curr !== startNode) { path.unshift(curr); curr = parent[curr]; }
    path.unshift(startNode);
    
    for (let i = 0; i < path.length - 1; i++) {
        const u = path[i];
        const v = path[i+1];
        flows[getDirectedEdgeKey(u, v)] += 1;
        flows[getDirectedEdgeKey(v, u)] -= 1;
    }
    totalFlow += 1;
    createStep(`Found path, flow is now ${totalFlow}. The current matching is highlighted.`, path);
  }

  return steps;
};