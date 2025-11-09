import type { GraphData, Step } from './types';

const nodeIds = ['A', 'B', 'C'];
export const nodeIndexMap: Record<string, number> = Object.fromEntries(nodeIds.map((id, i) => [id, i]));

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 150, y: 200 },
    { id: 'B', x: 325, y: 100 },
    { id: 'C', x: 325, y: 300 },
  ],
  adj: { 'A': ['B', 'C'], 'B': ['C'], 'C': ['A'] },
  edges: [
    {from: 'A', to: 'B', weight: 1}, {from: 'A', to: 'C', weight: 1},
    {from: 'B', to: 'C', weight: 1}, {from: 'C', to: 'A', weight: 1},
  ],
  directed: true,
};

export const dataStructureName = 'Matrix Power';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Count Walks with k Edges</h3>
  <p>
    A walk in a graph is a sequence of vertices and edges. Unlike a path, a walk can repeat vertices and edges. This problem asks: how many different walks of exactly <code>k</code> edges exist between a source <code>i</code> and a destination <code>j</code>?
  </p>
  <p>
    This can be solved efficiently using <strong>matrix exponentiation</strong>. If <code>A</code> is the adjacency matrix of the graph (where <code>A[i][j] = 1</code> if an edge exists from <code>i</code> to <code>j</code>), then the entry <code>(i, j)</code> in the matrix <code>A^k</code> (<code>A</code> raised to the power of <code>k</code>) gives the number of different walks of length <code>k</code> from <code>i</code> to <code>j</code>.
  </p>
  <p>This animation computes the matrix powers up to <strong>k=4</strong>.</p>
`;

// Matrix multiplication helper
const multiplyMatrices = (m1: number[][], m2: number[][]): number[][] => {
  const result: number[][] = [];
  for (let i = 0; i < m1.length; i++) {
    result[i] = [];
    for (let j = 0; j < m2[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < m1[0].length; k++) {
        sum += m1[i][k] * m2[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
};

export const generateSteps = (graph: GraphData): Step[] => {
  const steps: Step[] = [];
  const V = graph.nodes.length;
  const K = 4;

  // Build adjacency matrix
  let adjMatrix: number[][] = Array(V).fill(0).map(() => Array(V).fill(0));
  graph.edges!.forEach(edge => {
    adjMatrix[nodeIndexMap[edge.from]][nodeIndexMap[edge.to]] = 1;
  });

  steps.push({
    description: "Start with the adjacency matrix A (A^1). A[i][j] = # of walks of length 1 from i to j.",
    currentNode: null,
    distanceMatrix: adjMatrix.map(row => [...row]),
    dataStructure: ["k=1"],
  });

  let currentMatrix = adjMatrix;
  for (let k = 2; k <= K; k++) {
    currentMatrix = multiplyMatrices(currentMatrix, adjMatrix);
    steps.push({
      description: `Matrix A^${k}. A[i][j] = # of walks of length ${k} from i to j.`,
      currentNode: null,
      distanceMatrix: currentMatrix.map(row => [...row]),
      dataStructure: [`k=${k}`],
    });
  }

  return steps;
};