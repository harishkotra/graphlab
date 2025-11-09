import type { GraphData, Step, ComparisonAnimationData, AnimationData } from './types';
import { generateSteps as generateBfsSteps } from './bfs';
import { generateSteps as generateDfsSteps } from './dfs';

const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 325, y: 50 },
    { id: 'B', x: 150, y: 150 },
    { id: 'C', x: 500, y: 150 },
    { id: 'D', x: 100, y: 250 },
    { id: 'E', x: 250, y: 250 },
    { id: 'F', x: 450, y: 350 },
    { id: 'G', x: 600, y: 250 },
  ],
  adj: {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F', 'G'],
    'D': [],
    'E': ['F'],
    'F': [],
    'G': [],
  },
  directed: true,
};

const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">BFS vs. DFS: A Visual Comparison</h3>
  <p>
    Breadth-First Search (BFS) and Depth-First Search (DFS) are two fundamental graph traversal algorithms, but they explore nodes in a very different order. This animation runs them side-by-side on the same graph to highlight their differences.
  </p>
  <ul class="list-disc list-inside space-y-2 my-3">
      <li>
        <strong>BFS (left)</strong> uses a <strong>Queue</strong> (First-In, First-Out). It explores all neighbors at the present depth before moving on to the nodes at the next depth level. Notice how it explores level by level, spreading out from the start node.
      </li>
      <li>
        <strong>DFS (right)</strong> uses a <strong>Stack</strong> (Last-In, First-Out). It explores as far as possible along each branch before backtracking. Notice how it goes deep down one path to its end before returning to explore another branch.
      </li>
  </ul>
  <p>Use the shared controls below to step through the animations together.</p>
`;

const bfsAnimationData: AnimationData = {
  description: '',
  graphData: graphData,
  steps: generateBfsSteps(graphData, 'A'),
  dataStructureName: 'Queue',
};

const dfsAnimationData: AnimationData = {
  description: '',
  graphData: graphData,
  steps: generateDfsSteps(graphData, 'A'),
  dataStructureName: 'Stack',
};


export const animationData: ComparisonAnimationData = {
    bfs: bfsAnimationData,
    dfs: dfsAnimationData,
    description: description,
};
