import type { GraphData, Step, Edge } from './types';
import { DisjointSet } from './utils';

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
    'SF': ['LA', 'DEN'], 'LA': ['SF', 'DEN', 'DAL'],
    'DEN': ['SF', 'LA', 'CHI', 'DAL'], 'CHI': ['DEN', 'NYC', 'DAL'],
    'DAL': ['LA', 'DEN', 'CHI', 'MIA'], 'NYC': ['CHI', 'MIA'],
    'MIA': ['DAL', 'NYC'],
  },
  edges: [
    { from: 'SF', to: 'LA', weight: 38 }, { from: 'SF', to: 'DEN', weight: 126 },
    { from: 'LA', to: 'DEN', weight: 101 }, { from: 'LA', to: 'DAL', weight: 143 },
    { from: 'DEN', to: 'CHI', weight: 100 }, { from: 'DEN', to: 'DAL', weight: 78 },
    { from: 'CHI', to: 'DAL', weight: 92 }, { from: 'CHI', to: 'NYC', weight: 79 },
    { from: 'DAL', to: 'MIA', weight: 133 }, { from: 'NYC', to: 'MIA', weight: 130 },
  ],
};

export const dataStructureName = 'Total Network Cost';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Applications of Minimum Spanning Tree</h3>
  <p>
    A Minimum Spanning Tree (MST) isn't just a theoretical concept; it's a powerful tool for solving real-world optimization problems. The core idea is to find the cheapest way to connect a set of points.
  </p>
  <p>
    Common applications include:
  </p>
  <ul class="list-disc list-inside space-y-1 my-2">
    <li><strong>Network Design:</strong> Laying electrical grids, telecommunication networks (like fiber optics), or pipelines to connect multiple locations with the minimum amount of cable or pipe.</li>
    <li><strong>Cluster Analysis:</strong> Identifying clusters in data by creating an MST and then removing the longest edges to separate the data into groups.</li>
    <li><strong>Circuit Design:</strong> Minimizing the length of wire needed to connect pins on a circuit board.</li>
  </ul>
  <p>This animation demonstrates the network design problem. Given potential connections between cities and their costs, an MST algorithm (like Kruskal's) finds the optimal network to build.</p>
`;

const getEdgeKey = (edge: Edge) => [edge.from, edge.to].sort().join('-');

export const generateSteps = (graph: GraphData): Step[] => {
  const steps: Step[] = [];
  const sortedEdges = [...graph.edges!].sort((a, b) => a.weight - b.weight);
  const dsu = new DisjointSet(graph.nodes.map(n => n.id));
  const mstEdges = new Set<string>();
  let totalCost = 0;

  steps.push({
    dataStructure: [`$${totalCost}`],
    description: `Problem: Connect all cities with the cheapest possible network.`,
    nodeSets: dsu.getSets(),
    mstEdges: new Set(), // Initially show no edges, just nodes
    currentNode: null,
  });

  steps.push({
    dataStructure: [`$${totalCost}`],
    description: `Solution: Use an MST algorithm. Consider potential connections from cheapest to most expensive.`,
    nodeSets: dsu.getSets(),
    mstEdges: new Set(graph.edges!.map(getEdgeKey)), // Show all potential edges
    currentNode: null,
  });


  for (const edge of sortedEdges) {
    if (dsu.find(edge.from) !== dsu.find(edge.to)) {
      dsu.union(edge.from, edge.to);
      mstEdges.add(getEdgeKey(edge));
      totalCost += edge.weight;
      steps.push({
        dataStructure: [`$${totalCost}`],
        description: `Adding connection ${edge.from}-${edge.to} (Cost: ${edge.weight}). It connects two separate networks.`,
        nodeSets: dsu.getSets(),
        highlightedEdge: edge,
        mstEdges: new Set(mstEdges),
        currentNode: null,
      });
    }
  }

  steps.push({
    description: `Finished. The highlighted network connects all cities with the minimum total cost of $${totalCost}.`,
    nodeSets: dsu.getSets(),
    mstEdges: new Set(mstEdges),
    currentNode: null,
     dataStructure: [`$${totalCost}`],
  });

  return steps;
};