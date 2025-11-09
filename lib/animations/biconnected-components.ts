import type { GraphData, Step, Edge } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 200, y: 100 }, { id: 'B', x: 350, y: 100 },
    { id: 'C', x: 100, y: 200 }, { id: 'D', x: 350, y: 200 },
    { id: 'E', x: 500, y: 200 }, { id: 'F', x: 350, y: 300 },
    { id: 'G', x: 500, y: 300 },
  ],
  adj: {
    'A': ['B', 'C'], 'B': ['A', 'D'], 'C': ['A', 'D'],
    'D': ['B', 'C', 'E', 'F'], 'E': ['D', 'G'], 'F': ['D'], 'G': ['E']
  },
  edges: [
    {from:'A',to:'B',weight:1}, {from:'A',to:'C',weight:1}, {from:'B',to:'D',weight:1},
    {from:'C',to:'D',weight:1}, {from:'D',to:'E',weight:1}, {from:'D',to:'F',weight:1},
    {from:'E',to:'G',weight:1},
  ],
};

export const dataStructureName = 'Edge Stack';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">What are Biconnected Components?</h3>
  <p>
    A <strong>biconnected component (BCC)</strong> is a maximal subgraph of a given graph such that it remains connected even if any single vertex is removed. They are closely related to articulation points; an articulation point is a vertex that belongs to multiple BCCs.
  </p>
  <p>
    This algorithm finds all BCCs using a single Depth-First Search (DFS). It uses an auxiliary <strong>stack</strong> to store edges visited during the traversal. When the algorithm identifies an articulation point (or finishes a DFS from a root), it pops edges from the stack until it finds the edge that triggered the discovery. All the popped edges, along with their vertices, form a biconnected component.
  </p>
`;

const getEdgeKey = (edge: {from: string, to: string}) => [edge.from, edge.to].sort().join('-');

export const generateSteps = (graph: GraphData, startNode: string = 'A'): Step[] => {
  const steps: Step[] = [];
  const disc: Record<string, number> = {};
  const low: Record<string, number> = {};
  const parent: Record<string, string | null> = {};
  const edgeStack: Edge[] = [];
  const components: Set<string>[] = [];
  let time = 0;

  const createStep = (desc: string) => {
    // Color edges based on which component they belong to
    const componentEdgeSets: Record<string, string> = {};
    components.forEach((comp, i) => {
        comp.forEach(edgeKey => {
            componentEdgeSets[edgeKey] = String(i);
        });
    });

    steps.push({
      description: desc,
      currentNode: null,
      visited: new Set(Object.keys(disc)),
      discoveryTime: { ...disc },
      lowLink: { ...low },
      dataStructure: edgeStack.map(e => `${e.from}-${e.to}`),
      // Use nodeSets to color components
      nodeSets: componentEdgeSets,
    });
  };

  const dfs = (u: string) => {
    disc[u] = low[u] = ++time;
    
    for (const v of graph.adj[u] || []) {
      if (v === parent[u]) continue;

      const edge = { from: u, to: v, weight: 1 };
      if (!disc[v]) {
        edgeStack.push(edge);
        parent[v] = u;
        dfs(v);
        low[u] = Math.min(low[u], low[v]);

        if (low[v] >= disc[u]) {
          // Found a BCC
          const newComponent = new Set<string>();
          let poppedEdge;
          do {
            poppedEdge = edgeStack.pop()!;
            newComponent.add(getEdgeKey(poppedEdge));
          } while (poppedEdge.from !== u || poppedEdge.to !== v);
          components.push(newComponent);
          createStep(`Found Biconnected Component around articulation point ${u}.`);
        }
      } else if (disc[v] < disc[u]) {
        low[u] = Math.min(low[u], disc[v]);
        edgeStack.push(edge);
      }
    }
  };

  createStep("Start. Each color will represent a different component.");
  dfs(startNode);
  
  // Pop any remaining edges for the last component
  const finalComponent = new Set<string>();
  while(edgeStack.length > 0) {
      finalComponent.add(getEdgeKey(edgeStack.pop()!));
  }
  if(finalComponent.size > 0) {
      components.push(finalComponent);
  }

  createStep("DFS complete. All Biconnected Components found.");
  return steps;
};