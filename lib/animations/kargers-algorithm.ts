import type { GraphData, Step, Node, Edge } from './types';

// An undirected graph for min-cut
export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 150, y: 100 },
    { id: 'B', x: 350, y: 100 },
    { id: 'C', x: 150, y: 300 },
    { id: 'D', x: 350, y: 300 },
    { id: 'E', x: 250, y: 200 },
  ],
  adj: {
    'A': ['B', 'C', 'E'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'D', 'E'],
    'D': ['B', 'C', 'E'],
    'E': ['A', 'B', 'C', 'D'],
  },
  edges: [
    { from: 'A', to: 'B', weight: 1 }, { from: 'A', to: 'C', weight: 3 },
    { from: 'A', to: 'E', weight: 2 }, { from: 'B', to: 'D', weight: 2 },
    { from: 'B', to: 'E', weight: 4 }, { from: 'C', to: 'D', weight: 1 },
    { from: 'C', to: 'E', weight: 5 }, { from: 'D', to: 'E', weight: 3 },
  ],
};

export const dataStructureName = 'Remaining Vertices';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Karger's Algorithm for Min Cut</h3>
  <p>
    Karger's algorithm is a <strong>randomized</strong> algorithm to find a minimum cut in an <strong>undirected</strong> graph. A min cut is a partition of the vertices into two sets with the minimum possible number of edges crossing between them.
  </p>
  <p>
    The algorithm is surprisingly simple:
  </p>
  <ol class="list-decimal list-inside space-y-1 my-2">
    <li>While there are more than 2 vertices:</li>
    <li class="ml-4">Pick a remaining edge at random.</li>
    <li class="ml-4"><strong>Contract</strong> the edge: merge its two endpoints into a single "supernode". All edges connected to the original two nodes now connect to the new supernode. Remove self-loops.</li>
    <li>The remaining edges between the final two supernodes form a cut.</li>
  </ol>
  <p>Because it's randomized, one run might not find the true min-cut. The algorithm's success probability increases by running it multiple times.</p>
`;

export const generateSteps = (): Step[] => {
  const steps: Step[] = [];
  
  // Deep copy to allow mutation
  let nodes = JSON.parse(JSON.stringify(graphData.nodes));
  let edges = JSON.parse(JSON.stringify(graphData.edges));
  let supernodes: Record<string, string[]> = {};
  nodes.forEach((n: Node) => supernodes[n.id] = [n.id]);

  const createStep = (desc: string, highlightedEdge: Edge | null = null) => {
    steps.push({
      description: desc,
      currentNode: null,
      highlightedEdge: highlightedEdge || undefined,
      graphData: {
          nodes: JSON.parse(JSON.stringify(nodes)),
          edges: JSON.parse(JSON.stringify(edges)),
          adj: {}, // Adj isn't needed for rendering as we iterate edges
      },
      supernodes: { ...supernodes },
      dataStructure: [String(nodes.length)],
    });
  };

  createStep("Start with the original undirected graph.");

  while (nodes.length > 2 && edges.length > 0) {
    const edgeIndex = Math.floor(Math.random() * edges.length);
    const edgeToContract = edges[edgeIndex];
    
    createStep(`Randomly select edge ${edgeToContract.from}-${edgeToContract.to} to contract.`, edgeToContract);

    const u = edgeToContract.from;
    const v = edgeToContract.to;
    
    // Merge v into u
    const uNode = nodes.find((n: Node) => n.id === u);
    const vNode = nodes.find((n: Node) => n.id === v);
    
    // Remove v from nodes list
    nodes = nodes.filter((n: Node) => n.id !== v);
    
    // Update supernodes
    supernodes[u].push(...supernodes[v]);
    delete supernodes[v];

    // Update edges: change any endpoint v to u
    edges.forEach((e: Edge) => {
        if (e.from === v) e.from = u;
        if (e.to === v) e.to = u;
    });

    // Remove self-loops
    edges = edges.filter((e: Edge) => e.from !== e.to);

    createStep(`Merge ${v} into ${u}. The new supernode is [${supernodes[u].join(', ')}].`, edgeToContract);
  }

  const cutValue = edges.reduce((sum: number, e: Edge) => sum + e.weight, 0);
  createStep(`Contraction complete. The cut has a value of ${cutValue}.`, edges[0] || null);
  
  return steps;
};
