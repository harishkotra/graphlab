import type { GraphData, Step } from './types';

// U = Transmitters, V = Channels
const U = ['T1', 'T2', 'T3', 'T4'];
const V = ['C1', 'C2', 'C3'];
const possibleAssignments = [
    ['T1', 'C1'], ['T1', 'C2'],
    ['T2', 'C2'],
    ['T3', 'C1'], ['T3', 'C3'],
    ['T4', 'C2'], ['T4', 'C3'],
];

export const graphData: GraphData = {
  nodes: [
    { id: 'S', x: 50, y: 200 },
    ...U.map((u, i) => ({ id: u, x: 200, y: 80 + i * 80 })),
    ...V.map((v, i) => ({ id: v, x: 400, y: 100 + i * 100 })),
    { id: 'T', x: 550, y: 200 },
  ],
  adj: {},
  edges: [],
  directed: true,
};

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
    possibleAssignments.forEach(([u, v]) => {
        adj[u].push(v);
        edges.push({ from: u, to: v, weight: 1 });
    });
    graphData.adj = adj;
    graphData.edges = edges;
};
buildFlowNetwork();

export const dataStructureName = 'Assignments Made';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Channel Assignment Problem</h3>
  <p>
    Consider a scenario where we have several broadcast transmitters and a limited number of available channels. Each transmitter can only operate on specific channels due to hardware or licensing constraints. The goal is to assign a unique channel to as many transmitters as possible.
  </p>
  <p>
    This is an assignment problem that can be modeled as <strong>Maximum Bipartite Matching</strong>. Transmitters form one set of vertices, and channels form another. An edge exists if a transmitter can use a channel. By finding the maximum matching, we find the maximum number of transmitters that can be simultaneously active.
  </p>
  <p>The animation shows this modeled as a max-flow problem, with the final highlighted edges representing the optimal channel assignments.</p>
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
    const matchingEdges: string[] = [];
    possibleAssignments.forEach(([u,v]) => {
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

  createStep("Model as a flow network. Find augmenting paths to make assignments.");

  while (totalFlow < Math.min(U.length, V.length)) {
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
          parent[v] = u; visited.add(v); queue.push(v);
          if (v === endNode) { pathFound = true; break; }
        }
      }
      if(pathFound) break;
    }
    
    if (!pathFound) break;

    const path: string[] = [];
    let curr = endNode;
    while(curr !== startNode) { path.unshift(curr); curr = parent[curr]; }
    path.unshift(startNode);
    
    for (let i = 0; i < path.length - 1; i++) {
        const u = path[i]; const v = path[i+1];
        flows[getDirectedEdgeKey(u, v)] += 1;
        flows[getDirectedEdgeKey(v, u)] -= 1;
    }
    totalFlow += 1;
    createStep(`Made new assignment. Total assignments: ${totalFlow}.`, path);
  }

  createStep(`No more assignments possible. Maximum assignments: ${totalFlow}.`);
  return steps;
};