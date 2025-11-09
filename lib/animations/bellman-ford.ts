import type { GraphData, Step, Edge } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 100, y: 200 },
    { id: 'B', x: 250, y: 100 },
    { id: 'C', x: 250, y: 300 },
    { id: 'D', x: 450, y: 100 },
    { id: 'E', x: 450, y: 300 },
  ],
  adj: {
    'A': ['B', 'C'],
    'B': ['D'],
    'C': ['E'],
    'D': ['C', 'E'],
    'E': [],
  },
  edges: [
    { from: 'A', to: 'B', weight: 6 },
    { from: 'A', to: 'C', weight: 7 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'E', weight: -4 },
    { from: 'D', to: 'C', weight: -2 },
    { from: 'D', to: 'E', weight: 3 },
  ],
  directed: true,
};

export const dataStructureName = 'Distances';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">What is the Bellman-Ford Algorithm?</h3>
  <p>
    The Bellman-Ford algorithm finds the shortest path from a single source vertex to all other vertices in a weighted, directed graph. Unlike Dijkstra's, it can handle graphs with <strong>negative edge weights</strong>.
  </p>
  <p>
    The algorithm works by "relaxing" every edge in the graph repeatedly. It performs this relaxation process for a total of |V| - 1 iterations, where |V| is the number of vertices. After these iterations, it performs one final check to detect if there's a negative-weight cycle, which would mean no solution exists.
  </p>
`;

export const generateSteps = (graph: GraphData, startNode: string = 'A'): Step[] => {
  const steps: Step[] = [];
  const distances: Record<string, number | '∞'> = {};
  const V = graph.nodes.length;

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
    let updatedInIteration = false;
    steps.push({
      dataStructure: Object.entries(distances).map(([k,v]) => `${k}:${v}`),
      visited: new Set(),
      currentNode: null,
      neighbor: null,
      description: `--- Iteration ${i} ---`,
      distances: { ...distances },
    });
    for (const edge of graph.edges!) {
      const { from, to, weight } = edge;
      steps.push({
        dataStructure: Object.entries(distances).map(([k,v]) => `${k}:${v}`),
        visited: new Set(),
        currentNode: from,
        neighbor: to,
        description: `Relaxing edge ${from} -> ${to}.`,
        distances: { ...distances },
        highlightedEdge: edge,
      });
      const distFrom = distances[from];
      const distTo = distances[to];

      if (distFrom !== '∞' && distFrom + weight < (distTo === '∞' ? Infinity : distTo)) {
        distances[to] = distFrom + weight;
        updatedInIteration = true;
        steps.push({
          dataStructure: Object.entries(distances).map(([k,v]) => `${k}:${v}`),
          visited: new Set(),
          currentNode: from,
          neighbor: to,
          description: `Distance to ${to} updated to ${distances[to]}.`,
          distances: { ...distances },
          highlightedEdge: edge,
        });
      }
    }
     if (!updatedInIteration) {
        steps.push({
            dataStructure: Object.entries(distances).map(([k,v]) => `${k}:${v}`),
            visited: new Set(),
            currentNode: null,
            neighbor: null,
            description: `No distances updated in iteration ${i}. Early exit.`,
            distances: { ...distances },
        });
        break; // Early exit optimization
    }
  }

  // Check for negative-weight cycles
  let negativeCycle = false;
  steps.push({
      dataStructure: Object.entries(distances).map(([k,v]) => `${k}:${v}`),
      visited: new Set(),
      currentNode: null,
      neighbor: null,
      description: `Checking for negative-weight cycles...`,
      distances: { ...distances },
    });
  for (const edge of graph.edges!) {
    const { from, to, weight } = edge;
    const distFrom = distances[from];
    const distTo = distances[to];
    if (distFrom !== '∞' && distFrom + weight < (distTo === '∞' ? Infinity : distTo)) {
      negativeCycle = true;
       steps.push({
        dataStructure: Object.entries(distances).map(([k,v]) => `${k}:${v}`),
        visited: new Set(),
        currentNode: from,
        neighbor: to,
        description: `Negative cycle detected at edge ${from} -> ${to}!`,
        distances: { ...distances },
        highlightedEdge: edge,
      });
      break;
    }
  }
  
  if (!negativeCycle) {
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