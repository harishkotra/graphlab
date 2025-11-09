import type { GraphData, Step } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 150, y: 150 },
    { id: 'B', x: 400, y: 100 },
    { id: 'C', x: 400, y: 300 },
    { id: 'D', x: 150, y: 250 },
  ],
  adj: { 'A': ['B'], 'B': ['C'], 'C': ['D'], 'D': ['A'] },
  edges: [
    { from: 'A', to: 'B', weight: 3 },
    { from: 'B', to: 'C', weight: 2 },
    { from: 'C', to: 'D', weight: -4 },
    { from: 'D', to: 'A', weight: 1 },
  ],
  directed: true,
};
export const nodeIndexMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };

export const dataStructureName = 'DP Table (k, v)';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Minimum Mean Weight Cycle</h3>
  <p>
    The minimum mean weight cycle problem is to find a cycle in a weighted, directed graph with the lowest possible average edge weight. The average is the total weight of the cycle divided by the number of edges (its length).
  </p>
  <p>
    This animation uses <strong>Karp's Algorithm</strong>, a dynamic programming approach. It calculates <code>D[k][v]</code>, the shortest path from a source ('A' here) to vertex <code>v</code> using exactly <code>k</code> edges. The minimum mean weight is then found by calculating <code>max( (D[n][v] - D[k][v]) / (n-k) )</code> over all <code>v</code> and <code>k < n</code>, and taking the minimum of these maximums.
  </p>
  <p><em>Note: This is a highly advanced algorithm. The visualization shows the DP table being built and the final calculation.</em></p>
`;

export const generateSteps = (graph: GraphData, startNode: string = 'A'): Step[] => {
    const steps: Step[] = [];
    const V = graph.nodes.length;
    const nodeIds = graph.nodes.map(n => n.id);
    const startIndex = nodeIndexMap[startNode];
    
    // DP table: D[k][v] = shortest path from start to v with k edges
    const D: number[][] = Array(V + 1).fill(0).map(() => Array(V).fill(Infinity));
    D[0][startIndex] = 0;

    const createStep = (desc: string, k: number, highlightNode: string | null = null) => {
        steps.push({
            description: desc,
            currentNode: highlightNode,
            dataStructure: [`k=${k}`],
            // A bit of a hack to show the DP table
            distanceMatrix: D.map(row => row.map(val => val === Infinity ? '∞' : val)),
        });
    };

    createStep('Initialize DP table. D[0][start] = 0, others are ∞.', 0);

    for (let k = 1; k <= V; k++) {
        createStep(`Calculating paths of length k = ${k}.`, k);
        for (let v_idx = 0; v_idx < V; v_idx++) {
            D[k][v_idx] = D[k - 1][v_idx]; // Path of length k-1 is a candidate
        }
        for (const edge of graph.edges!) {
            const u_idx = nodeIndexMap[edge.from];
            const v_idx = nodeIndexMap[edge.to];
            if (D[k - 1][u_idx] !== Infinity) {
                D[k][v_idx] = Math.min(D[k][v_idx], D[k-1][u_idx] + edge.weight);
            }
        }
    }
    
    createStep('DP table calculation complete.', V);
    
    let minMeanWeight = Infinity;
    
    for (let v_idx = 0; v_idx < V; v_idx++) {
        let maxMean = -Infinity;
        for (let k = 0; k < V; k++) {
            if (D[V][v_idx] === Infinity || D[k][v_idx] === Infinity) continue;
            const mean = (D[V][v_idx] - D[k][v_idx]) / (V - k);
            maxMean = Math.max(maxMean, mean);
        }
        if (maxMean !== -Infinity) {
             minMeanWeight = Math.min(minMeanWeight, maxMean);
        }
        createStep(`Calculating mean for node ${nodeIds[v_idx]}. Current min mean ≈ ${minMeanWeight.toFixed(2)}`, V, nodeIds[v_idx]);
    }

    steps.push({
        description: `Algorithm complete. Minimum mean weight is ≈ ${minMeanWeight.toFixed(2)}.`,
        currentNode: null,
        dataStructure: [`Result: ${minMeanWeight.toFixed(2)}`],
        distanceMatrix: D.map(row => row.map(val => val === Infinity ? '∞' : val)),
    });

    return steps;
};
