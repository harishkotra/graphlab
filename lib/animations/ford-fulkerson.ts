import type { GraphData, Step } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'S', x: 100, y: 200 },
    { id: 'A', x: 275, y: 100 },
    { id: 'B', x: 275, y: 300 },
    { id: 'C', x: 450, y: 100 },
    { id: 'D', x: 450, y: 300 },
    { id: 'T', x: 600, y: 200 },
  ],
  adj: {
    'S': ['A', 'B'], 'A': ['C', 'D'], 'B': ['D'],
    'C': ['T'], 'D': ['T'], 'T': [],
  },
  edges: [
    { from: 'S', to: 'A', weight: 10 }, { from: 'S', to: 'B', weight: 10 },
    { from: 'A', to: 'C', weight: 8 }, { from: 'A', to: 'D', weight: 4 },
    { from: 'B', to: 'D', weight: 9 }, { from: 'C', to: 'T', weight: 10 },
    { from: 'D', to: 'T', weight: 10 },
  ],
  directed: true,
};

export const dataStructureName = 'Total Flow';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Ford-Fulkerson Algorithm</h3>
  <p>
    The Ford-Fulkerson method is a classic greedy algorithm for solving the maximum flow problem. It works by repeatedly finding an "augmenting path" – a path from the source to the sink with available capacity – and pushing as much flow as possible through it.
  </p>
  <p>
    The process continues until no more augmenting paths can be found. The search for a path is typically done with BFS or DFS on the <strong>residual graph</strong>, which represents the remaining available capacity. This animation uses BFS to find the shortest augmenting path (the Edmonds-Karp variant).
  </p>
`;

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
    steps.push({
      description: desc,
      currentNode: null,
      highlightedPath: path || undefined,
      flows: { ...flows },
      dataStructure: [`${totalFlow}`]
    });
  };

  createStep("Start Ford-Fulkerson. All flows are 0.");

  while (true) {
    // Find augmenting path using BFS
    const parent: Record<string, string> = {};
    const queue: string[] = [startNode];
    const visited = new Set<string>([startNode]);
    
    pathFinding:
    while (queue.length > 0) {
      const u = queue.shift()!;
      for (const v of [...(graph.adj[u] || []), ...Object.keys(graph.adj).filter(n => graph.adj[n].includes(u))]) {
        const capacity = capacities[getDirectedEdgeKey(u, v)] || 0;
        const flow = flows[getDirectedEdgeKey(u, v)] || 0;

        if (!visited.has(v) && capacity - flow > 0) {
          parent[v] = u;
          visited.add(v);
          queue.push(v);
          if (v === endNode) {
            break pathFinding;
          }
        }
      }
    }
    
    // If no path found
    if (!parent[endNode]) {
      createStep("No more augmenting paths can be found. The flow is maximized.");
      break;
    }

    // Reconstruct path
    const path: string[] = [];
    let curr = endNode;
    while(curr !== startNode) {
        path.unshift(curr);
        curr = parent[curr];
    }
    path.unshift(startNode);
    createStep(`Found augmenting path: ${path.join(' → ')} via BFS.`, path);

    // Find bottleneck
    let bottleneck = Infinity;
    for (let i = 0; i < path.length - 1; i++) {
        const u = path[i];
        const v = path[i+1];
        const key = getDirectedEdgeKey(u,v);
        bottleneck = Math.min(bottleneck, (capacities[key] || 0) - (flows[key] || 0));
    }
    
    createStep(`Path bottleneck is ${bottleneck}. Pushing flow.`, path);

    // Augment flow
    for (let i = 0; i < path.length - 1; i++) {
        const u = path[i];
        const v = path[i+1];
        flows[getDirectedEdgeKey(u, v)] += bottleneck;
        flows[getDirectedEdgeKey(v, u)] -= bottleneck; // For residual graph
    }

    totalFlow += bottleneck;
    createStep(`Flow augmented by ${bottleneck}. Total flow is now ${totalFlow}.`, path);
  }

  return steps;
};