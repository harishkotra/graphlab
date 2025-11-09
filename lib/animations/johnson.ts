import type { GraphData, Step } from './types';
import { PriorityQueue } from './utils';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 200, y: 100 },
    { id: 'B', x: 450, y: 100 },
    { id: 'C', x: 450, y: 300 },
    { id: 'D', x: 200, y: 300 },
  ],
  adj: { 'A': ['B'], 'B': ['C', 'D'], 'C': [], 'D': ['A', 'C'] },
  edges: [
    { from: 'A', to: 'B', weight: -2 },
    { from: 'B', to: 'C', weight: -1 },
    { from: 'B', to: 'D', weight: 2 },
    { from: 'D', to: 'A', weight: 3 },
    { from: 'D', to: 'C', weight: 4 },
  ],
  directed: true,
};

export const nodeIndexMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };

export const dataStructureName = 'Phase';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">What is Johnson's Algorithm?</h3>
  <p>
    Johnson's algorithm finds the shortest paths between <strong>all pairs</strong> of vertices in a weighted, directed graph. It's particularly useful because it can handle graphs with <strong>negative edge weights</strong>, unlike running Dijkstra from every node, but it cannot handle negative cycles.
  </p>
  <p>
    The algorithm is a multi-stage process:
  </p>
  <ol class="list-decimal list-inside space-y-1 my-2">
    <li><strong>Bellman-Ford Re-weighting:</strong> A new node 'S' is added with 0-weight edges to all other nodes. Bellman-Ford is run from 'S' to find a "potential" value h(v) for each vertex. This step also detects negative cycles.</li>
    <li><strong>Edge Re-weighting:</strong> Every edge weight is updated using the formula: <code>w'(u,v) = w(u,v) + h(u) - h(v)</code>. This transformation makes all edge weights non-negative.</li>
    <li><strong>Dijkstra from Each Node:</strong> Dijkstra's algorithm is now run from every single node on the re-weighted graph to find all-pairs shortest paths.</li>
    <li><strong>Final Distances:</strong> The calculated distances are converted back to the original weights.</li>
  </ol>
`;

export const generateSteps = (originalGraph: GraphData): Step[] => {
  const steps: Step[] = [];
  const V = originalGraph.nodes.length;
  const originalNodes = originalGraph.nodes.map(n => n.id);
  
  // --- STAGE 1: Bellman-Ford ---
  const h: Record<string, number | '∞'> = {};
  originalNodes.forEach(id => h[id] = '∞');
  h['S'] = 0;

  steps.push({
    description: "Phase 1: Add a new source 'S' and run Bellman-Ford to find potentials h(v).",
    currentNode: 'S',
    distances: h,
    dataStructure: ["1. Bellman-Ford"],
  });

  for (let i = 0; i < V; i++) {
    originalNodes.forEach(u => {
        if(h[u] !== '∞') {
            (originalGraph.adj[u] || []).forEach(v => {
                const edge = originalGraph.edges!.find(e => e.from === u && e.to === v)!;
                if (h[v] === '∞' || (h[u] as number) + edge.weight < (h[v] as number)) {
                    h[v] = (h[u] as number) + edge.weight;
                }
            });
        }
    });
  }
  // Check for negative cycles from original graph (not S)
  for (const edge of originalGraph.edges!) {
      if(h[edge.from] !== '∞' && (h[edge.from] as number) + edge.weight < (h[edge.to] as number)) {
          steps.push({ description: "Negative cycle detected by Bellman-Ford. Johnson's cannot proceed.", currentNode: null, highlightedCycle: [edge.from, edge.to] });
          return steps;
      }
  }

  steps.push({
    description: "Bellman-Ford complete. Potentials h(v) found.",
    currentNode: null,
    distances: h,
    dataStructure: ["1. Bellman-Ford"],
  });

  // --- STAGE 2: Re-weighting ---
  const newEdges = originalGraph.edges!.map(edge => ({
      ...edge,
      weight: edge.weight + (h[edge.from] as number) - (h[edge.to] as number),
  }));
  const reweightedGraph = { ...originalGraph, edges: newEdges };
  
  steps.push({
    description: "Phase 2: Re-weight all edges using potentials. All weights are now non-negative.",
    currentNode: null,
    dataStructure: ["2. Re-weight"],
    // We could show the new weights, but it might clutter the UI. The description suffices.
  });

  // --- STAGE 3: Dijkstra from each node ---
  const allDistances: (number | string)[][] = Array(V).fill(0).map(() => Array(V).fill('∞'));
  
  for (let i = 0; i < V; i++) {
      const startNode = originalNodes[i];
      const distances: Record<string, number | '∞'> = {};
      originalNodes.forEach(id => distances[id] = '∞');
      distances[startNode] = 0;
      
      const pq = new PriorityQueue<string>();
      pq.enqueue(startNode, 0);

      steps.push({
        description: `Phase 3: Running Dijkstra from source node ${startNode}.`,
        currentNode: startNode,
        distances,
        dataStructure: ["3. Dijkstra", `From: ${startNode}`],
      });

      while(!pq.isEmpty()) {
          const u = pq.dequeue()!.element;
          (reweightedGraph.adj[u] || []).forEach(v => {
              const edge = reweightedGraph.edges!.find(e => e.from === u && e.to === v)!;
              if (distances[v] === '∞' || (distances[u] as number) + edge.weight < (distances[v] as number)) {
                  distances[v] = (distances[u] as number) + edge.weight;
                  pq.enqueue(v, distances[v] as number);
              }
          });
      }

      // --- STAGE 4: Convert distances back ---
      for (let j = 0; j < V; j++) {
          const endNode = originalNodes[j];
          if (distances[endNode] !== '∞') {
              allDistances[i][j] = (distances[endNode] as number) - (h[startNode] as number) + (h[endNode] as number);
          }
      }
      steps.push({
        description: `Dijkstra from ${startNode} complete. Final distances calculated.`,
        currentNode: null,
        distanceMatrix: allDistances.map(row => [...row]),
        matrixHighlights: { i: i, k: -1, j: -1 }, // Highlight row
        dataStructure: ["4. Finalize Distances"],
      });
  }

  steps.push({
    description: "Johnson's Algorithm complete. All-pairs shortest paths found.",
    currentNode: null,
    distanceMatrix: allDistances,
    dataStructure: ["Complete"],
  });

  return steps;
};
