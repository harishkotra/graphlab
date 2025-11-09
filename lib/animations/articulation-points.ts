import type { GraphData, Step } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 200, y: 100 }, { id: 'B', x: 350, y: 100 },
    { id: 'C', x: 100, y: 200 }, { id: 'D', x: 350, y: 200 },
    { id: 'E', x: 500, y: 200 }, { id: 'F', x: 350, y: 300 },
  ],
  adj: {
    'A': ['B', 'C'], 'B': ['A', 'D'], 'C': ['A', 'D'],
    'D': ['B', 'C', 'E', 'F'], 'E': ['D'], 'F': ['D'],
  },
  edges: [
    { from: 'A', to: 'B', weight: 1 }, { from: 'A', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 1 }, { from: 'C', to: 'D', weight: 1 },
    { from: 'D', to: 'E', weight: 1 }, { from: 'D', to: 'F', weight: 1 },
  ],
};

export const dataStructureName = 'disc / low';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">What are Articulation Points?</h3>
  <p>
    An <strong>articulation point</strong> (or <strong>cut vertex</strong>) is a vertex in an undirected graph whose removal increases the number of connected components. They represent critical single points of failure in a network.
  </p>
  <p>
    This algorithm finds all articulation points using a single Depth-First Search (DFS). For each vertex <code>u</code>, it keeps track of two values:
  </p>
  <ul class="list-disc list-inside space-y-1 my-2">
    <li><strong>Discovery Time (disc):</strong> The time (step) at which <code>u</code> was first visited.</li>
    <li><strong>Low-link Value (low):</strong> The lowest discovery time reachable from <code>u</code> (including itself) through its DFS tree descendants.</li>
  </ul>
  <p>An articulation point <code>u</code> is found if one of its children <code>v</code> in the DFS tree has <code>low[v] >= disc[u]</code>.</p>
`;

export const generateSteps = (graph: GraphData, startNode: string = 'A'): Step[] => {
  const steps: Step[] = [];
  const disc: Record<string, number> = {};
  const low: Record<string, number> = {};
  const parent: Record<string, string | null> = {};
  const ap = new Set<string>();
  let time = 0;

  const createStep = (desc: string, current: string, neighbor: string | null = null) => {
    steps.push({
      description: desc,
      currentNode: current,
      neighbor: neighbor,
      visited: new Set(Object.keys(disc)),
      discoveryTime: { ...disc },
      lowLink: { ...low },
      nodeSets: Object.fromEntries(Array.from(ap).map(nodeId => [nodeId, nodeId])),
    });
  };

  const dfs = (u: string) => {
    disc[u] = low[u] = ++time;
    let children = 0;
    
    createStep(`Visiting ${u}. Set disc[${u}]=low[${u}]=${time}.`, u);

    for (const v of graph.adj[u] || []) {
      if (!disc[v]) {
        children++;
        parent[v] = u;
        createStep(`Moving from ${u} to unvisited neighbor ${v}.`, u, v);
        dfs(v);
        
        low[u] = Math.min(low[u], low[v]);
        createStep(`Back at ${u} from ${v}. Update low[${u}]=min(low[${u}], low[${v}])=${low[u]}.`, u, v);

        if (parent[u] === null && children > 1) {
          ap.add(u);
          createStep(`Node ${u} is the root with >1 child. It's an articulation point.`, u);
        }
        if (parent[u] !== null && low[v] >= disc[u]) {
          ap.add(u);
          createStep(`low[${v}] (${low[v]}) >= disc[${u}] (${disc[u]}). ${u} is an articulation point.`, u, v);
        }
      } else if (v !== parent[u]) {
        low[u] = Math.min(low[u], disc[v]);
        createStep(`Found back edge ${u}-${v}. Update low[${u}]=min(low[${u}], disc[${v}])=${low[u]}.`, u, v);
      }
    }
  };

  dfs(startNode);
  
  steps.push({
    description: "DFS complete. All articulation points have been found.",
    currentNode: null,
    visited: new Set(Object.keys(disc)),
    discoveryTime: { ...disc },
    lowLink: { ...low },
    nodeSets: Object.fromEntries(Array.from(ap).map(nodeId => [nodeId, nodeId])),
  });

  return steps;
};