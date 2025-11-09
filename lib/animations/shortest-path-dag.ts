import type { GraphData, Step } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 50, y: 200 },
    { id: 'B', x: 200, y: 100 },
    { id: 'C', x: 200, y: 300 },
    { id: 'D', x: 350, y: 100 },
    { id: 'E', x: 350, y: 300 },
    { id: 'F', x: 500, y: 200 },
  ],
  adj: {
    'A': ['B', 'C'],
    'B': ['D'],
    'C': ['D', 'E'],
    'D': ['F'],
    'E': ['F'],
    'F': [],
  },
  edges: [
    { from: 'A', to: 'B', weight: 2 },
    { from: 'A', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 3 },
    { from: 'C', to: 'D', weight: 6 },
    { from: 'C', to: 'E', weight: 2 },
    { from: 'D', to: 'F', weight: 5 },
    { from: 'E', to: 'F', weight: 1 },
  ],
  directed: true,
};

export const dataStructureName = 'Topologically Sorted Order';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Shortest Path in a Directed Acyclic Graph (DAG)</h3>
  <p>
    Finding the shortest path in a Directed Acyclic Graph (DAG) is simpler and more efficient than in general graphs. Because there are no cycles, we can process the vertices in a specific linear order.
  </p>
  <p>
    The algorithm involves two main steps:
  </p>
  <ol class="list-decimal list-inside space-y-1 my-2">
    <li><strong>Topological Sort:</strong> First, we find a topological ordering of the vertices. This is a linear ordering where for every directed edge from vertex <code>u</code> to vertex <code>v</code>, <code>u</code> comes before <code>v</code> in the ordering.</li>
    <li><strong>Edge Relaxation:</strong> We initialize all distances to infinity (except the source, which is 0). Then, we iterate through the vertices in the topologically sorted order and "relax" each outgoing edge, updating the distances of neighboring nodes if a shorter path is found.</li>
  </ol>
  <p>This single pass guarantees we find the shortest path, as by the time we process a vertex, we know we have already found the shortest path to it.</p>
`;

export const generateSteps = (graph: GraphData, startNode: string = 'A'): Step[] => {
  const steps: Step[] = [];
  const distances: Record<string, number | '∞'> = {};

  // 1. Topological Sort (using Kahn's algorithm)
  const inDegree: Record<string, number> = {};
  graph.nodes.forEach(n => inDegree[n.id] = 0);
  graph.edges!.forEach(e => inDegree[e.to]++);

  const queue = graph.nodes.filter(n => inDegree[n.id] === 0).map(n => n.id);
  const topoSorted: string[] = [];

  while (queue.length > 0) {
    const u = queue.shift()!;
    topoSorted.push(u);
    for (const v of graph.adj[u] || []) {
      inDegree[v]--;
      if (inDegree[v] === 0) {
        queue.push(v);
      }
    }
  }

  steps.push({
    description: `Phase 1: Calculated the topological sort of the graph.`,
    currentNode: null,
    dataStructure: topoSorted,
  });

  // 2. Relax edges
  graph.nodes.forEach(n => distances[n.id] = '∞');
  distances[startNode] = 0;

  steps.push({
    description: `Phase 2: Initialize distances. Source node is 0, others are infinity.`,
    currentNode: startNode,
    distances: { ...distances },
    dataStructure: topoSorted,
  });

  for (const u of topoSorted) {
    steps.push({
      description: `Processing node ${u} from the sorted list.`,
      currentNode: u,
      distances: { ...distances },
      dataStructure: topoSorted,
    });
    
    if (distances[u] === '∞') continue;

    for (const v of graph.adj[u] || []) {
      const edge = graph.edges!.find(e => e.from === u && e.to === v)!;
      const newDist = (distances[u] as number) + edge.weight;
      
      if (distances[v] === '∞' || newDist < (distances[v] as number)) {
        distances[v] = newDist;
        steps.push({
          description: `Relaxing edge ${u}→${v}. Updated distance to ${v} to ${newDist}.`,
          currentNode: u,
          neighbor: v,
          distances: { ...distances },
          highlightedEdge: edge,
          dataStructure: topoSorted,
        });
      }
    }
  }

  steps.push({
    description: `Algorithm complete. Shortest paths from ${startNode} found.`,
    currentNode: null,
    distances: { ...distances },
    dataStructure: topoSorted,
  });

  return steps;
};
