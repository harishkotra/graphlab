import type { GraphData, Step } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 150, y: 200 },
    { id: 'B', x: 325, y: 100 },
    { id: 'C', x: 325, y: 300 },
    { id: 'D', x: 500, y: 200 },
  ],
  adj: {
    'A': ['B'],
    'B': ['C'],
    'C': ['D'],
    'D': ['B'],
  },
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'B', to: 'C', weight: -3 },
    { from: 'C', to: 'D', weight: 2 },
    { from: 'D', to: 'B', weight: -2 },
  ],
  directed: true,
};

export const dataStructureName = 'Distances';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Detecting a Negative Cycle with Bellman-Ford</h3>
  <p>
    A key feature of the Bellman-Ford algorithm is its ability to detect <strong>negative-weight cycles</strong>. A negative cycle is a path in a graph that starts and ends at the same vertex, where the sum of the edge weights is negative. Such cycles create a problem, as traversing them infinitely would lead to an infinitely small path cost.
  </p>
  <p>
    After the main |V|-1 iterations, Bellman-Ford performs one final iteration. If it can still "relax" any edge (i.e., find a shorter path), it means a negative cycle exists and is reachable from the source. This animation demonstrates this final check.
  </p>
`;

export const generateSteps = (graph: GraphData, startNode: string = 'A'): Step[] => {
  const steps: Step[] = [];
  const distances: Record<string, number | '∞'> = {};
  const V = graph.nodes.length;
  const predecessors: Record<string, string | null> = {};
  graph.nodes.forEach(node => {
    predecessors[node.id] = null;
  });

  graph.nodes.forEach(node => {
    distances[node.id] = '∞';
  });
  distances[startNode] = 0;

  steps.push({
    dataStructure: Object.entries(distances).map(([k,v]) => `${k}:${v}`),
    visited: new Set(),
    currentNode: null,
    neighbor: null,
    description: `Initialize distances. Start node is 0, others are ∞.`,
    distances: { ...distances },
  });

  // Relax edges |V| - 1 times
  for (let i = 1; i < V; i++) {
    for (const edge of graph.edges!) {
      const { from, to, weight } = edge;
      const distFrom = distances[from];
      const distTo = distances[to];

      if (distFrom !== '∞' && distFrom + weight < (distTo === '∞' ? Infinity : distTo)) {
        distances[to] = distFrom + weight;
        predecessors[to] = from;
        steps.push({
          dataStructure: Object.entries(distances).map(([k,v]) => `${k}:${v}`),
          visited: new Set(),
          currentNode: from,
          neighbor: to,
          description: `Iteration ${i}: Distance to ${to} updated to ${distances[to]}.`,
          distances: { ...distances },
          highlightedEdge: edge,
        });
      }
    }
  }

  // Check for negative-weight cycles
  let cycleNode: string | null = null;
  steps.push({
      dataStructure: Object.entries(distances).map(([k,v]) => `${k}:${v}`),
      visited: new Set(),
      currentNode: null,
      neighbor: null,
      description: `Final check for negative-weight cycles...`,
      distances: { ...distances },
    });

  for (const edge of graph.edges!) {
    const { from, to, weight } = edge;
    const distFrom = distances[from];
    const distTo = distances[to];
    if (distFrom !== '∞' && distFrom + weight < (distTo === '∞' ? Infinity : distTo)) {
      cycleNode = to; // A node in or reachable from the cycle
       steps.push({
        dataStructure: Object.entries(distances).map(([k,v]) => `${k}:${v}`),
        visited: new Set(),
        currentNode: from,
        neighbor: to,
        description: `Negative cycle detected! Edge ${from} -> ${to} can still be relaxed.`,
        distances: { ...distances },
        highlightedEdge: edge,
      });
      break;
    }
  }
  
  if (cycleNode) {
     // Trace back to find the cycle
    const cycle = new Set<string>();
    let curr = cycleNode;
    for (let i = 0; i < V; i++) {
      curr = predecessors[curr]!;
    }
    
    let cycleStartNode = curr;
    const cyclePath = [];
    while (!cycle.has(curr)) {
      cycle.add(curr);
      cyclePath.unshift(curr);
      curr = predecessors[curr]!;
    }
    cyclePath.unshift(curr);

    steps.push({
      dataStructure: Object.entries(distances).map(([k,v]) => `${k}:${v}`),
      visited: new Set(),
      currentNode: null,
      neighbor: null,
      description: `The detected negative cycle is highlighted.`,
      distances: { ...distances },
      highlightedCycle: cyclePath,
    });
  } else {
    steps.push({
        dataStructure: Object.entries(distances).map(([k,v]) => `${k}:${v}`),
        visited: new Set(),
        currentNode: null,
        neighbor: null,
        description: `No negative cycles found. Algorithm complete.`,
        distances: { ...distances },
    });
  }

  return steps;
};