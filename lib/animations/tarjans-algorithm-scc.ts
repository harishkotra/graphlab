import type { GraphData, Step } from './types';

// Same graph as Kosaraju's for comparison
export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 100, y: 150 }, { id: 'B', x: 250, y: 100 },
    { id: 'C', x: 250, y: 200 }, { id: 'D', x: 400, y: 100 },
    { id: 'E', x: 400, y: 200 }, { id: 'F', x: 550, y: 150 },
    { id: 'G', x: 550, y: 250 },
  ],
  adj: {
    'A': ['B'], 
    // FIX: Merged duplicate 'B' properties.
    'B': ['C', 'D'], 
    'C': ['A'],
    'D': ['E'], 'E': ['F'], 'F': ['D', 'G'],
    'G': [],
  },
  edges: [
    { from:'A',to:'B',weight:1}, { from:'B',to:'C',weight:1}, { from:'C',to:'A',weight:1},
    { from:'B',to:'D',weight:1}, { from:'D',to:'E',weight:1}, { from:'E',to:'F',weight:1},
    { from:'F',to:'D',weight:1}, { from:'F',to:'G',weight:1},
  ],
  directed: true,
};

export const dataStructureName = 'Stack';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Tarjan's Algorithm for SCCs</h3>
  <p>
    Tarjan's algorithm is another method for finding Strongly Connected Components (SCCs) in a directed graph. It's often more efficient than Kosaraju's algorithm because it only requires a <strong>single Depth-First Search (DFS)</strong> traversal.
  </p>
  <p>
    It maintains a stack of visited vertices. For each vertex <code>u</code>, it computes a <strong>discovery time (disc)</strong> and a <strong>low-link value (low)</strong>. A vertex <code>u</code> is the root of an SCC if its <code>disc</code> and <code>low</code> values are equal. When a root is found, all vertices in its SCC are on top of the stack and can be popped off.
  </p>
`;

export const generateSteps = (graph: GraphData, startNode: string = 'A'): Step[] => {
  const steps: Step[] = [];
  const disc: Record<string, number> = {};
  const low: Record<string, number> = {};
  const onStack: Record<string, boolean> = {};
  const stack: string[] = [];
  const components: Record<string, string> = {};
  let time = 0;
  let componentId = 0;

  const createStep = (desc: string) => {
    steps.push({
      description: desc,
      currentNode: null,
      discoveryTime: { ...disc },
      lowLink: { ...low },
      dataStructure: [...stack],
      nodeSets: { ...components },
    });
  };

  const dfs = (u: string) => {
    disc[u] = low[u] = ++time;
    stack.push(u);
    onStack[u] = true;

    for (const v of graph.adj[u] || []) {
      if (!disc[v]) {
        dfs(v);
        low[u] = Math.min(low[u], low[v]);
      } else if (onStack[v]) {
        low[u] = Math.min(low[u], disc[v]);
      }
    }

    if (low[u] === disc[u]) {
      // Found an SCC root
      const component = [];
      let popped;
      do {
        popped = stack.pop()!;
        onStack[popped] = false;
        component.push(popped);
        components[popped] = String(componentId);
      } while (popped !== u);
      createStep(`Found SCC root ${u}. Component: {${component.join(', ')}}`);
      componentId++;
    }
  };

  createStep("Start Tarjan's Algorithm.");
  graph.nodes.forEach(node => {
    if (!disc[node.id]) {
      dfs(node.id);
    }
  });
  createStep("Algorithm complete. All SCCs found.");

  return steps;
};