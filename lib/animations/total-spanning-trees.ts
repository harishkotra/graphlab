import type { GraphData, Step, Edge } from './types';

// Complete graph K4
export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 200, y: 100 },
    { id: 'B', x: 450, y: 100 },
    { id: 'C', x: 450, y: 300 },
    { id: 'D', x: 200, y: 300 },
  ],
  adj: {
    'A': ['B', 'C', 'D'],
    'B': ['A', 'C', 'D'],
    'C': ['A', 'B', 'D'],
    'D': ['A', 'B', 'C'],
  },
  edges: [
    { from: 'A', to: 'B', weight: 1 }, { from: 'A', to: 'C', weight: 1 },
    { from: 'A', to: 'D', weight: 1 }, { from: 'B', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 1 }, { from: 'C', to: 'D', weight: 1 },
  ],
};

export const dataStructureName = 'Spanning Tree Count';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Total Number of Spanning Trees</h3>
  <p>
    A spanning tree of a graph is a subgraph that includes all the vertices and is a tree (i.e., it has no cycles). A single graph can have many different spanning trees. How many?
  </p>
  <p>
    For a complete graph with <code>n</code> vertices, a formula known as <strong>Cayley's formula</strong> states that there are <code>n^(n-2)</code> spanning trees. For the complete graph with 4 vertices (K4) shown here, there are 4^(4-2) = 4² = 16 spanning trees.
  </p>
  <p>
    For more general graphs, the number can be calculated using the <strong>Matrix Tree Theorem</strong>. This animation enumerates all 16 possible spanning trees for K4.
  </p>
`;

// All 16 spanning trees of K4, represented by the edges they contain.
const spanningTreesEdges = [
  // Star graphs (4)
  [{from: 'A', to: 'B'}, {from: 'A', to: 'C'}, {from: 'A', to: 'D'}],
  [{from: 'B', to: 'A'}, {from: 'B', to: 'C'}, {from: 'B', to: 'D'}],
  [{from: 'C', to: 'A'}, {from: 'C', to: 'B'}, {from: 'C', to: 'D'}],
  [{from: 'D', to: 'A'}, {from: 'D', to: 'B'}, {from: 'D', to: 'C'}],
  // Path graphs (12)
  [{from: 'A', to: 'B'}, {from: 'B', to: 'C'}, {from: 'C', to: 'D'}],
  [{from: 'A', to: 'B'}, {from: 'B', to: 'D'}, {from: 'D', to: 'C'}],
  [{from: 'A', to: 'C'}, {from: 'C', to: 'B'}, {from: 'B', to: 'D'}],
  [{from: 'A', to: 'C'}, {from: 'C', to: 'D'}, {from: 'D', to: 'B'}],
  [{from: 'A', to: 'D'}, {from: 'D', to: 'B'}, {from: 'B', to: 'C'}],
  [{from: 'A', to: 'D'}, {from: 'D', to: 'C'}, {from: 'C', to: 'B'}],
  [{from: 'B', to: 'A'}, {from: 'A', to: 'C'}, {from: 'C', to: 'D'}],
  [{from: 'B', to: 'A'}, {from: 'A', to: 'D'}, {from: 'D', to: 'C'}],
  [{from: 'B', to: 'C'}, {from: 'C', to: 'A'}, {from: 'A', to: 'D'}],
  [{from: 'B', to: 'D'}, {from: 'D', to: 'A'}, {from: 'A', to: 'C'}],
  [{from: 'C', to: 'A'}, {from: 'A', to: 'B'}, {from: 'B', to: 'D'}],
  [{from: 'C', to: 'B'}, {from: 'B', to: 'A'}, {from: 'A', to: 'D'}],
];

const getEdgeKey = (edge: {from: string, to: string}) => [edge.from, edge.to].sort().join('-');

export const generateSteps = (): Step[] => {
  const steps: Step[] = [];
  
  steps.push({
    description: "Start: A complete graph K4 with 4 vertices and 6 edges.",
    currentNode: null,
    mstEdges: new Set(),
    dataStructure: ["0 / 16"],
  });

  spanningTreesEdges.forEach((tree, index) => {
    const edgeSet = new Set(tree.map(getEdgeKey));
    steps.push({
      description: `Showing Spanning Tree #${index + 1}.`,
      currentNode: null,
      mstEdges: edgeSet,
      dataStructure: [`${index + 1} / 16`],
    });
  });

  return steps;
};
