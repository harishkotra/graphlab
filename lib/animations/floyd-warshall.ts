import type { GraphData, Step } from './types';

const nodeIds = ['A', 'B', 'C', 'D'];
export const nodeIndexMap: Record<string, number> = Object.fromEntries(nodeIds.map((id, i) => [id, i]));

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 150, y: 100 },
    { id: 'B', x: 450, y: 100 },
    { id: 'C', x: 150, y: 300 },
    { id: 'D', x: 450, y: 300 },
  ],
  adj: {
    'A': ['B', 'D'],
    'B': ['C'],
    'C': ['A'],
    'D': ['C', 'B'],
  },
  edges: [
    { from: 'A', to: 'B', weight: 3 },
    { from: 'A', to: 'D', weight: 7 },
    { from: 'B', to: 'C', weight: 2 },
    { from: 'C', to: 'A', weight: 8 },
    { from: 'D', to: 'C', weight: 1 },
    { from: 'D', to: 'B', weight: 4 },
  ],
  directed: true,
};

export const dataStructureName = 'k, i, j';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">What is the Floyd-Warshall Algorithm?</h3>
  <p>
    The Floyd-Warshall algorithm is a dynamic programming algorithm used to find the shortest paths between <strong>all pairs</strong> of vertices in a weighted, directed graph. It can handle both positive and negative edge weights but will fail if there are negative cycles.
  </p>
  <p>
    It works by building up a solution iteratively. It considers each vertex <code>k</code> one by one as an intermediate vertex in paths. For every pair of vertices <code>(i, j)</code>, it checks if the path from <code>i</code> to <code>j</code> via <code>k</code> is shorter than the currently known path. This animation shows the <strong>distance matrix</strong> updating as <code>k</code> iterates from A to D.
  </p>
`;

export const generateSteps = (graph: GraphData): Step[] => {
  const steps: Step[] = [];
  const V = graph.nodes.length;
  const dist: (number | string)[][] = Array(V).fill(null).map(() => Array(V).fill('∞'));

  for (let i = 0; i < V; i++) {
    dist[i][i] = 0;
  }

  for (const edge of graph.edges!) {
    const u = nodeIndexMap[edge.from];
    const v = nodeIndexMap[edge.to];
    dist[u][v] = edge.weight;
  }
  
  const copyMatrix = (m: (number | string)[][]) => m.map(row => [...row]);

  steps.push({
    dataStructure: ['-', '-', '-'],
    visited: new Set(),
    currentNode: null,
    neighbor: null,
    description: `Initialize distance matrix from edge weights.`,
    distanceMatrix: copyMatrix(dist),
    matrixHighlights: null,
  });

  for (let k = 0; k < V; k++) {
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        const path_ik = dist[i][k];
        const path_kj = dist[k][j];
        const path_ij = dist[i][j];

        steps.push({
          dataStructure: [nodeIds[k], nodeIds[i], nodeIds[j]],
          visited: new Set(),
          currentNode: null,
          neighbor: null,
          description: `Checking path ${nodeIds[i]} -> ${nodeIds[k]} -> ${nodeIds[j]}.`,
          distanceMatrix: copyMatrix(dist),
          matrixHighlights: { k, i, j },
        });

        if (path_ik !== '∞' && path_kj !== '∞') {
            const newDist = (path_ik as number) + (path_kj as number);
            if(path_ij === '∞' || newDist < (path_ij as number)) {
                dist[i][j] = newDist;
                steps.push({
                    dataStructure: [nodeIds[k], nodeIds[i], nodeIds[j]],
                    visited: new Set(),
                    currentNode: null,
                    neighbor: null,
                    description: `Found shorter path for ${nodeIds[i]} -> ${nodeIds[j]}. Updated to ${newDist}.`,
                    distanceMatrix: copyMatrix(dist),
                    matrixHighlights: { k, i, j },
                });
            }
        }
      }
    }
  }

  steps.push({
    dataStructure: ['-', '-', '-'],
    visited: new Set(),
    currentNode: null,
    neighbor: null,
    description: `Algorithm complete. Final all-pairs shortest paths found.`,
    distanceMatrix: copyMatrix(dist),
    matrixHighlights: null,
  });


  return steps;
};