import type { GraphData, Step } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 150, y: 100 },
    { id: 'B', x: 450, y: 100 },
    { id: 'C', x: 150, y: 300 },
    { id: 'D', x: 450, y: 300 },
  ],
  adj: { 'A': ['B'], 'B': ['D'], 'C': ['A'], 'D': ['C'] },
  edges: [
    { from: 'A', to: 'B', weight: 1 },
    { from: 'B', to: 'D', weight: -2 },
    { from: 'C', to: 'A', weight: 4 },
    { from: 'D', to: 'C', weight: 3 },
  ],
  directed: true,
};

export const nodeIndexMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };

export const dataStructureName = 'Min Cycle Weight';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Minimum Weight Cycle</h3>
  <p>
    The goal is to find a cycle in a weighted, directed graph with the smallest possible sum of edge weights. This cycle can have positive or negative weights.
  </p>
  <p>
    A common approach involves using an <strong>all-pairs shortest path algorithm</strong>, like Floyd-Warshall. Once we have the shortest distance between every pair of vertices, we can find the minimum cycle. For every edge from <code>u</code> to <code>v</code> with weight <code>w(u,v)</code>, a potential cycle is formed by the edge itself plus the shortest path from <code>v</code> back to <code>u</code>. The total weight is <code>w(u,v) + dist(v,u)</code>. We find the minimum value over all edges.
  </p>
`;

export const generateSteps = (graph: GraphData): Step[] => {
  const steps: Step[] = [];
  const V = graph.nodes.length;
  const nodeIds = graph.nodes.map(n => n.id);
  const dist: (number | string)[][] = Array(V).fill(null).map(() => Array(V).fill('∞'));

  for (let i = 0; i < V; i++) dist[i][i] = 0;
  for (const edge of graph.edges!) {
    dist[nodeIndexMap[edge.from]][nodeIndexMap[edge.to]] = edge.weight;
  }
  
  const copyMatrix = (m: (number | string)[][]) => m.map(row => [...row]);
  steps.push({ description: 'Phase 1: Run Floyd-Warshall for all-pairs shortest paths.', distanceMatrix: copyMatrix(dist), currentNode: null });

  for (let k = 0; k < V; k++) {
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        if (dist[i][k] !== '∞' && dist[k][j] !== '∞') {
            const newDist = (dist[i][k] as number) + (dist[k][j] as number);
            if(dist[i][j] === '∞' || newDist < (dist[i][j] as number)) {
                dist[i][j] = newDist;
            }
        }
      }
    }
  }
  steps.push({ description: 'Floyd-Warshall complete. Matrix shows shortest paths.', distanceMatrix: copyMatrix(dist), currentNode: null });

  let minCycleWeight = Infinity;
  let cycleEdge: any = null;

  steps.push({ description: 'Phase 2: Check all edges (u,v) for min cycle w(u,v) + dist(v,u).', distanceMatrix: copyMatrix(dist), dataStructure: ['∞'], currentNode: null });

  for (const edge of graph.edges!) {
    const u = nodeIndexMap[edge.from];
    const v = nodeIndexMap[edge.to];
    const path_vu = dist[v][u];
    
    steps.push({ description: `Checking edge ${edge.from}→${edge.to}.`, highlightedEdge: edge, distanceMatrix: copyMatrix(dist), dataStructure: [minCycleWeight === Infinity ? '∞' : String(minCycleWeight)], currentNode: edge.from });

    if (path_vu !== '∞') {
      const cycleWeight = edge.weight + (path_vu as number);
      if (cycleWeight < minCycleWeight) {
        minCycleWeight = cycleWeight;
        cycleEdge = edge;
        steps.push({ description: `New min cycle found via ${edge.from}→${edge.to}. Weight: ${cycleWeight}`, highlightedEdge: edge, distanceMatrix: copyMatrix(dist), dataStructure: [String(minCycleWeight)], currentNode: edge.from });
      }
    }
  }

  if (minCycleWeight === Infinity) {
      steps.push({ description: 'Algorithm complete. No cycles found.', distanceMatrix: copyMatrix(dist), dataStructure: ['None'], currentNode: null });
  } else {
       steps.push({ description: `Minimum weight cycle found with weight ${minCycleWeight}.`, highlightedEdge: cycleEdge, distanceMatrix: copyMatrix(dist), dataStructure: [String(minCycleWeight)], currentNode: cycleEdge.from });
  }
  
  return steps;
};