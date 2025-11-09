import type { GraphData, Step } from './types';

// A multistage graph where V is partitioned into k stages.
// Stage 1: A, Stage 2: B,C,D, Stage 3: E,F, Stage 4: G
export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 50, y: 200 }, // Stage 1
    { id: 'B', x: 200, y: 100 }, // Stage 2
    { id: 'C', x: 200, y: 200 },
    { id: 'D', x: 200, y: 300 },
    { id: 'E', x: 400, y: 150 }, // Stage 3
    { id: 'F', x: 400, y: 250 },
    { id: 'G', x: 550, y: 200 }, // Stage 4
  ],
  adj: {
    'A': ['B', 'C', 'D'],
    'B': ['E', 'F'],
    'C': ['F'],
    'D': ['E'],
    'E': ['G'],
    'F': ['G'],
    'G': [],
  },
  edges: [
    { from: 'A', to: 'B', weight: 2 },
    { from: 'A', to: 'C', weight: 3 },
    { from: 'A', to: 'D', weight: 4 },
    { from: 'B', to: 'E', weight: 5 },
    { from: 'B', to: 'F', weight: 3 },
    { from: 'C', to: 'F', weight: 6 },
    { from: 'D', to: 'E', weight: 7 },
    { from: 'E', to: 'G', weight: 8 },
    { from: 'F', to: 'G', weight: 9 },
  ],
  directed: true,
};

export const dataStructureName = 'Costs';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Shortest Path in a Multistage Graph</h3>
  <p>
    A multistage graph is a directed acyclic graph where vertices are partitioned into a set of stages, and edges only connect vertices in adjacent stages. The goal is to find the shortest path from a source in the first stage to a destination in the last stage.
  </p>
  <p>
    This problem is solved using <strong>dynamic programming</strong>. We calculate the minimum cost from each node to the final destination by working <strong>backwards</strong> from the last stage. The cost of a node is the minimum of <code>(edge_weight + cost_of_next_node)</code> over all its neighbors in the next stage.
  </p>
`;

export const generateSteps = (graph: GraphData, startNode: string = 'A', endNode: string = 'G'): Step[] => {
  const steps: Step[] = [];
  const costs: Record<string, number | '∞'> = {};
  graph.nodes.forEach(n => costs[n.id] = '∞');
  costs[endNode] = 0;

  const path: Record<string, string> = {};
  const sortedNodes = [...graph.nodes].reverse(); // Process backwards

  steps.push({
    description: `Initialize cost of destination ${endNode} to 0. All others are ∞.`,
    currentNode: endNode,
    distances: costs, // Using distances to display costs
    dataStructure: [`${endNode}:0`],
  });

  for (const u of sortedNodes) {
    if (u.id === endNode) continue;
    
    let minCost = Infinity;
    let nextNode: string | null = null;
    
    steps.push({
      description: `Calculating minimum cost for node ${u.id}.`,
      currentNode: u.id,
      distances: { ...costs },
    });

    for (const v of graph.adj[u.id] || []) {
      const edge = graph.edges!.find(e => e.from === u.id && e.to === v)!;
      const costV = costs[v] as number;
      const currentTotalCost = edge.weight + costV;

      steps.push({
        description: `Check path ${u.id}→${v}. Cost = ${edge.weight} + ${costV} = ${currentTotalCost}.`,
        currentNode: u.id,
        neighbor: v,
        distances: { ...costs },
        highlightedEdge: edge,
      });

      if (currentTotalCost < minCost) {
        minCost = currentTotalCost;
        nextNode = v;
      }
    }
    
    costs[u.id] = minCost;
    path[u.id] = nextNode!;
    steps.push({
        description: `Minimum cost for ${u.id} is ${minCost} via ${nextNode}.`,
        currentNode: u.id,
        distances: { ...costs },
        dataStructure: Object.entries(costs).filter(([,v])=>v!=='∞').map(([k,v]) => `${k}:${v}`),
    });
  }

  // Trace and highlight the final path
  const finalPath: string[] = [startNode];
  let curr = startNode;
  while(curr !== endNode) {
      curr = path[curr];
      finalPath.push(curr);
  }

  steps.push({
    description: `Final shortest path cost from ${startNode} is ${costs[startNode]}. Highlighting path.`,
    currentNode: null,
    distances: { ...costs },
    highlightedPath: finalPath,
    dataStructure: [`Cost: ${costs[startNode]}`],
  });

  return steps;
};
