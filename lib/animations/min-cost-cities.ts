import type { GraphData, Step, Edge } from './types';
import { DisjointSet } from './utils';

// Representing cities and connection costs
export const graphData: GraphData = {
  nodes: [
    { id: 'SF', x: 80, y: 180 },
    { id: 'LA', x: 120, y: 280 },
    { id: 'DEN', x: 250, y: 200 },
    { id: 'CHI', x: 400, y: 150 },
    { id: 'DAL', x: 350, y: 300 },
    { id: 'NYC', x: 550, y: 130 },
    { id: 'MIA', x: 520, y: 320 },
  ],
  adj: {
    'SF': ['LA', 'DEN'],
    'LA': ['SF', 'DEN', 'DAL'],
    'DEN': ['SF', 'LA', 'CHI', 'DAL'],
    'CHI': ['DEN', 'NYC', 'DAL'],
    'DAL': ['LA', 'DEN', 'CHI', 'MIA'],
    'NYC': ['CHI', 'MIA'],
    'MIA': ['DAL', 'NYC'],
  },
  edges: [
    { from: 'SF', to: 'LA', weight: 38 },
    { from: 'SF', to: 'DEN', weight: 126 },
    { from: 'LA', to: 'DEN', weight: 101 },
    { from: 'LA', to: 'DAL', weight: 143 },
    { from: 'DEN', to: 'CHI', weight: 100 },
    { from: 'DEN', to: 'DAL', weight: 78 },
    { from: 'CHI', to: 'DAL', weight: 92 },
    { from: 'CHI', to: 'NYC', weight: 79 },
    { from: 'DAL', to: 'MIA', weight: 133 },
    { from: 'NYC', to: 'MIA', weight: 130 },
  ],
};

export const dataStructureName = 'Sorted Connections (Cost)';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Minimum Cost to Connect All Cities</h3>
  <p>
    This is a classic application of the Minimum Spanning Tree (MST) problem. Imagine you need to build a fiber optic network to connect a set of cities. The cost to lay cable between any two cities is known. What is the cheapest way to connect all the cities so that there is a path between any two?
  </p>
  <p>
    This is exactly what an MST provides: a network that connects every city with the minimum possible total cost. This animation uses <strong>Kruskal's algorithm</strong> to solve the problem. It sorts all possible connections (edges) by cost and adds them one by one, skipping any that would form a redundant cycle.
  </p>
`;

const getEdgeKey = (edge: Edge) => [edge.from, edge.to].sort().join('-');

// Using Kruskal's algorithm implementation
export const generateSteps = (graph: GraphData): Step[] => {
  const steps: Step[] = [];
  const sortedEdges = [...graph.edges!].sort((a, b) => a.weight - b.weight);
  const dsu = new DisjointSet(graph.nodes.map(n => n.id));
  const mstEdges = new Set<string>();

  steps.push({
    dataStructure: sortedEdges.map(e => `${e.from}-${e.to} (${e.weight})`),
    description: `Goal: Connect all cities with minimum cost. Sort all possible connections.`,
    nodeSets: dsu.getSets(),
    mstEdges: new Set(mstEdges),
    currentNode: null,
  });

  for (const edge of sortedEdges) {
    steps.push({
      dataStructure: sortedEdges.map(e => `${e.from}-${e.to} (${e.weight})`),
      description: `Considering connection ${edge.from}-${edge.to} with cost ${edge.weight}.`,
      nodeSets: dsu.getSets(),
      highlightedEdge: edge,
      mstEdges: new Set(mstEdges),
      currentNode: null,
    });

    if (dsu.find(edge.from) !== dsu.find(edge.to)) {
      dsu.union(edge.from, edge.to);
      mstEdges.add(getEdgeKey(edge));
      steps.push({
        dataStructure: sortedEdges.map(e => `${e.from}-${e.to} (${e.weight})`),
        description: `Connect ${edge.from} and ${edge.to}. This links two separate networks.`,
        nodeSets: dsu.getSets(),
        highlightedEdge: edge,
        mstEdges: new Set(mstEdges),
        currentNode: null,
      });
    } else {
       steps.push({
        dataStructure: sortedEdges.map(e => `${e.from}-${e.to} (${e.weight})`),
        description: `Skipping ${edge.from}-${edge.to}; cities are already connected.`,
        nodeSets: dsu.getSets(),
        highlightedEdge: edge,
        mstEdges: new Set(mstEdges),
        currentNode: null,
      });
    }
  }

  steps.push({
    dataStructure: sortedEdges.map(e => `${e.from}-${e.to} (${e.weight})`),
    description: `Finished. All cities are connected with the minimum possible network cost.`,
    nodeSets: dsu.getSets(),
    mstEdges: new Set(mstEdges),
    currentNode: null,
  });

  return steps;
};
