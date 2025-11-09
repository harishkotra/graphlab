import type { GraphData, Step, Edge } from './types';
import { DisjointSet } from './utils';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 100, y: 100 },
    { id: 'B', x: 350, y: 100 },
    { id: 'C', x: 100, y: 300 },
    { id: 'D', x: 350, y: 300 },
  ],
  adj: {
    'A': ['B', 'C', 'D'],
    'B': ['A', 'D'],
    'C': ['A', 'D'],
    'D': ['A', 'B', 'C'],
  },
  edges: [
    { from: 'A', to: 'B', weight: 10 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'A', to: 'D', weight: 8 },
    { from: 'B', to: 'D', weight: 3 },
    { from: 'C', to: 'D', weight: 4 },
  ],
};

export const dataStructureName = 'Sorted Edges (log(weight))';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Minimum Product Spanning Tree</h3>
  <p>
    The goal is to find a spanning tree where the <strong>product</strong> of all its edge weights is minimized, assuming all weights are positive. A standard MST algorithm minimizes the sum, not the product.
  </p>
  <p>
    The trick is to transform the problem. The property <code>log(a * b) = log(a) + log(b)</code> means that minimizing the sum of logarithms is the same as minimizing the product of the original numbers.
  </p>
  <p>
    The algorithm is:
  </p>
  <ol class="list-decimal list-inside space-y-1 my-2">
      <li>Take the natural logarithm (log) of every edge weight.</li>
      <li>Run a standard MST algorithm (like Kruskal's) on the graph with these new log-weights.</li>
      <li>The resulting tree is the Minimum Product Spanning Tree.</li>
  </ol>
`;

const getEdgeKey = (edge: Edge) => [edge.from, edge.to].sort().join('-');

export const generateSteps = (graph: GraphData): Step[] => {
  const steps: Step[] = [];
  
  // 1. Transform weights
  const logEdges = graph.edges!.map(edge => ({
    ...edge,
    logWeight: Math.log(edge.weight)
  }));

  steps.push({
    description: "Step 1: Transform all edge weights by taking their natural logarithm.",
    currentNode: null,
    dataStructure: graph.edges!.map(e => `log(${e.weight}) ≈ ${Math.log(e.weight).toFixed(2)}`),
  });

  // 2. Run Kruskal's on log-weights
  const sortedLogEdges = logEdges.sort((a, b) => a.logWeight - b.logWeight);
  const dsu = new DisjointSet(graph.nodes.map(n => n.id));
  const mstEdges = new Set<string>();

  steps.push({
    description: `Step 2: Run Kruskal's algorithm on the transformed (log) weights.`,
    currentNode: null,
    dataStructure: sortedLogEdges.map(e => `${e.from}-${e.to} (${e.logWeight.toFixed(2)})`),
    nodeSets: dsu.getSets(),
    mstEdges: new Set(mstEdges),
  });

  for (const edge of sortedLogEdges) {
    steps.push({
      description: `Considering edge ${edge.from}-${edge.to} with log-weight ${edge.logWeight.toFixed(2)}.`,
      currentNode: null,
      highlightedEdge: edge,
      dataStructure: sortedLogEdges.map(e => `${e.from}-${e.to} (${e.logWeight.toFixed(2)})`),
      nodeSets: dsu.getSets(),
      mstEdges: new Set(mstEdges),
    });

    if (dsu.find(edge.from) !== dsu.find(edge.to)) {
      dsu.union(edge.from, edge.to);
      mstEdges.add(getEdgeKey(edge));
      steps.push({
        description: `No cycle. Add ${edge.from}-${edge.to} to the MST.`,
        currentNode: null,
        highlightedEdge: edge,
        dataStructure: sortedLogEdges.map(e => `${e.from}-${e.to} (${e.logWeight.toFixed(2)})`),
        nodeSets: dsu.getSets(),
        mstEdges: new Set(mstEdges),
      });
    }
  }

  steps.push({
    description: "Finished. The highlighted tree is the Minimum Product Spanning Tree.",
    currentNode: null,
    nodeSets: dsu.getSets(),
    mstEdges: new Set(mstEdges),
  });

  return steps;
};
