import type { GraphData, Step } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 100, y: 200 }, { id: 'B', x: 250, y: 150 },
    { id: 'C', x: 250, y: 250 }, { id: 'D', x: 400, y: 150 },
    { id: 'E', x: 400, y: 250 }, { id: 'F', x: 550, y: 200 },
  ],
  adj: {
    'A': ['B', 'C'], 'B': ['A', 'D'], 'C': ['A', 'E'],
    'D': ['B'], 'E': ['C', 'F'], 'F': ['E'],
  },
  edges: [
    {from:'A',to:'B',weight:1}, {from:'A',to:'C',weight:1}, {from:'B',to:'D',weight:1},
    {from:'C',to:'E',weight:1}, {from:'E',to:'F',weight:1},
  ],
};

export const dataStructureName = 'disc / low';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">What are Bridges?</h3>
  <p>
    A <strong>bridge</strong> (or <strong>cut-edge</strong>) is an edge in an undirected graph whose removal increases the number of connected components. Bridges represent critical connections in a network that are not part of any cycle.
  </p>
  <p>
    This algorithm finds all bridges using a single Depth-First Search (DFS). Similar to finding articulation points, it keeps track of two values for each vertex <code>u</code>:
  </p>
  <ul class="list-disc list-inside space-y-1 my-2">
    <li><strong>Discovery Time (disc):</strong> The time (step) at which <code>u</code> was first visited.</li>
    <li><strong>Low-link Value (low):</strong> The lowest discovery time reachable from <code>u</code>.</li>
  </ul>
  <p>An edge from a parent <code>u</code> to a child <code>v</code> in the DFS tree is a bridge if <code>low[v] > disc[u]</code>. This condition means there is no "back edge" from <code>v</code> or any of its descendants to <code>u</code> or any of its ancestors.</p>
`;

const getEdgeKey = (from: string, to: string) => [from, to].sort().join('-');

export const generateSteps = (graph: GraphData, startNode: string = 'A'): Step[] => {
  const steps: Step[] = [];
  const disc: Record<string, number> = {};
  const low: Record<string, number> = {};
  const parent: Record<string, string | null> = {};
  const bridges = new Set<string>();
  let time = 0;

  const createStep = (desc: string, current: string, neighbor: string | null = null) => {
    steps.push({
      description: desc,
      currentNode: current,
      neighbor: neighbor,
      visited: new Set(Object.keys(disc)),
      discoveryTime: { ...disc },
      lowLink: { ...low },
      mstEdges: new Set(bridges),
    });
  };

  const dfs = (u: string) => {
    disc[u] = low[u] = ++time;
    createStep(`Visiting ${u}. Set disc[${u}]=low[${u}]=${time}.`, u);

    for (const v of graph.adj[u] || []) {
      if (v === parent[u]) continue;

      if (!disc[v]) {
        parent[v] = u;
        createStep(`Moving from ${u} to unvisited neighbor ${v}.`, u, v);
        dfs(v);
        
        low[u] = Math.min(low[u], low[v]);
        createStep(`Back at ${u} from ${v}. Update low[${u}]=min(low[${u}], low[${v}])=${low[u]}.`, u, v);

        if (low[v] > disc[u]) {
          bridges.add(getEdgeKey(u, v));
          createStep(`low[${v}] (${low[v]}) > disc[${u}] (${disc[u]}). Edge ${u}-${v} is a bridge.`, u, v);
        }
      } else {
        low[u] = Math.min(low[u], disc[v]);
        createStep(`Found back edge ${u}-${v}. Update low[${u}]=min(low[${u}], disc[${v}])=${low[u]}.`, u, v);
      }
    }
  };

  dfs(startNode);

  steps.push({
    description: "DFS complete. All bridges have been found and highlighted.",
    currentNode: null,
    visited: new Set(Object.keys(disc)),
    discoveryTime: { ...disc },
    lowLink: { ...low },
    mstEdges: new Set(bridges),
  });

  return steps;
};