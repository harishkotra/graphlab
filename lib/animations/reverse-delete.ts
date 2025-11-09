import type { GraphData, Step, Edge } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 100, y: 100 },
    { id: 'B', x: 300, y: 50 },
    { id: 'C', x: 250, y: 250 },
    { id: 'D', x: 500, y: 100 },
    { id: 'E', x: 450, y: 300 },
  ],
  adj: {
    'A': ['B', 'C'],
    'B': ['A', 'C', 'D'],
    'C': ['A', 'B', 'E'],
    'D': ['B', 'E'],
    'E': ['C', 'D'],
  },
  edges: [
    { from: 'A', to: 'B', weight: 6 }, { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'C', weight: 3 }, { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'E', weight: 4 }, { from: 'D', to: 'E', weight: 1 },
  ],
};

export const dataStructureName = 'Sorted Edges (Descending)';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Reverse Delete Algorithm for MST</h3>
  <p>
    The Reverse Delete algorithm is another method for finding a Minimum Spanning Tree (MST). It takes the opposite approach of Kruskal's algorithm.
  </p>
  <p>
    The algorithm works as follows:
  </p>
  <ol class="list-decimal list-inside space-y-1 my-2">
    <li>Start with the full graph (all edges).</li>
    <li>Sort all edges in <strong>descending</strong> order of weight.</li>
    <li>Iterate through the sorted edges. For each edge, temporarily remove it.</li>
    <li>Check if the graph is still connected after removal.</li>
    <li>If it's still connected, the removal is permanent. If it's disconnected, add the edge back because it's a crucial bridge.</li>
  </ol>
  <p>The edges that remain at the end form the MST.</p>
`;

// Helper to check for connectivity
const isConnected = (nodes: {id: string}[], edges: Edge[]): boolean => {
  if (nodes.length === 0) return true;
  const visited = new Set<string>();
  const adj: Record<string, string[]> = {};
  nodes.forEach(n => adj[n.id] = []);
  edges.forEach(e => {
    adj[e.from].push(e.to);
    adj[e.to].push(e.from);
  });

  const stack = [nodes[0].id];
  visited.add(nodes[0].id);
  while (stack.length > 0) {
    const u = stack.pop()!;
    for (const v of adj[u]) {
      if (!visited.has(v)) {
        visited.add(v);
        stack.push(v);
      }
    }
  }
  return visited.size === nodes.length;
};

const getEdgeKey = (edge: Edge) => [edge.from, edge.to].sort().join('-');

export const generateSteps = (graph: GraphData): Step[] => {
  const steps: Step[] = [];
  const sortedEdges = [...graph.edges!].sort((a, b) => b.weight - a.weight);
  const remainingEdges = new Set(graph.edges!.map(getEdgeKey));
  let currentEdges = [...graph.edges!];

  steps.push({
    description: "Start with the full graph. Sort edges by weight descending.",
    currentNode: null,
    dataStructure: sortedEdges.map(e => `${e.from}-${e.to} (${e.weight})`),
    mstEdges: new Set(remainingEdges),
  });

  for (const edgeToRemove of sortedEdges) {
    steps.push({
      description: `Testing edge ${edgeToRemove.from}-${edgeToRemove.to} (weight ${edgeToRemove.weight}) for removal.`,
      currentNode: null,
      highlightedEdge: edgeToRemove,
      dataStructure: sortedEdges.map(e => `${e.from}-${e.to} (${e.weight})`),
      mstEdges: new Set(remainingEdges),
    });

    const tempEdges = currentEdges.filter(e => e !== edgeToRemove);
    if (isConnected(graph.nodes, tempEdges)) {
      currentEdges = tempEdges;
      remainingEdges.delete(getEdgeKey(edgeToRemove));
      steps.push({
        description: `Graph remains connected. Permanently remove ${edgeToRemove.from}-${edgeToRemove.to}.`,
        currentNode: null,
        highlightedEdge: edgeToRemove,
        dataStructure: sortedEdges.map(e => `${e.from}-${e.to} (${e.weight})`),
        mstEdges: new Set(remainingEdges),
      });
    } else {
      steps.push({
        description: `Removing ${edgeToRemove.from}-${edgeToRemove.to} disconnects the graph. Keep it.`,
        currentNode: null,
        highlightedEdge: edgeToRemove,
        dataStructure: sortedEdges.map(e => `${e.from}-${e.to} (${e.weight})`),
        mstEdges: new Set(remainingEdges),
      });
    }
  }

  steps.push({
    description: `Algorithm complete. Remaining edges form the MST.`,
    currentNode: null,
    dataStructure: [],
    mstEdges: new Set(remainingEdges),
  });

  return steps;
};
