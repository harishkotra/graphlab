import type { GraphData, MSTComparisonData, AnimationData } from './types';
import { generateSteps as generatePrimsSteps } from './prims';
import { generateSteps as generateKruskalsSteps } from './kruskal';

const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 100, y: 200 },
    { id: 'B', x: 250, y: 100 },
    { id: 'C', x: 250, y: 300 },
    { id: 'D', x: 450, y: 100 },
    { id: 'E', x: 450, y: 300 },
    { id: 'F', x: 600, y: 200 },
  ],
  adj: {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'C'],
    'C': ['A', 'B', 'E'],
    'D': ['B', 'F'],
    'E': ['C', 'F'],
    'F': ['D', 'E'],
  },
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'E', weight: 3 },
    { from: 'D', to: 'F', weight: 6 },
    { from: 'E', to: 'F', weight: 1 },
  ],
};

const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Prim's vs. Kruskal's: A Tale of Two MST Algorithms</h3>
  <p>
    Prim's and Kruskal's are two famous "greedy" algorithms for finding a Minimum Spanning Tree (MST), but they approach the problem from different perspectives.
  </p>
  <ul class="list-disc list-inside space-y-2 my-3">
      <li>
        <strong>Prim's (left)</strong> is <strong>vertex-based</strong>. It grows a single tree by always adding the cheapest edge that connects a vertex inside the tree to a vertex outside the tree. It doesn't care about edges that connect two vertices already in the tree or two vertices outside the tree.
      </li>
      <li>
        <strong>Kruskal's (right)</strong> is <strong>edge-based</strong>. It considers all edges in the graph from cheapest to most expensive. It adds an edge to the forest as long as doing so does not create a cycle. It builds up a "forest" of trees that gradually merge into a single MST.
      </li>
  </ul>
  <p>Use the shared controls below to see how their different strategies result in the same final MST.</p>
`;

const primsAnimationData: AnimationData = {
  description: '',
  graphData: graphData,
  steps: generatePrimsSteps(graphData, 'A'),
  dataStructureName: "Priority Queue (Edges)",
};

const kruskalsAnimationData: AnimationData = {
  description: '',
  graphData: graphData,
  steps: generateKruskalsSteps(graphData),
  dataStructureName: "Sorted Edges",
};

export const animationData: MSTComparisonData = {
    prims: primsAnimationData,
    kruskals: kruskalsAnimationData,
    description: description,
};
