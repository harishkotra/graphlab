import type { GraphData, Step } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 100, y: 100 },
    { id: 'B', x: 300, y: 100 },
    { id: 'C', x: 300, y: 300 },
    { id: 'D', x: 100, y: 300 },
    { id: 'E', x: 500, y: 200 },
  ],
  adj: {
    'A': ['B'],
    'B': ['C'],
    'C': ['D', 'E'],
    'D': ['B'],
    'E': [],
  },
  directed: true,
};

export const dataStructureName = 'DFS Path';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Cycle Detection using Colors (Directed Graph)</h3>
  <p>
    A powerful way to detect cycles in a directed graph is to use Depth-First Search (DFS) while tracking the state of each node with three colors:
  </p>
  <ul class="list-disc list-inside space-y-1 my-2">
      <li><strong>White:</strong> The node has not been visited yet.</li>
      <li><strong>Gray:</strong> The node is currently being visited (it's in the current recursion path).</li>
      <li><strong>Black:</strong> The node and all its descendants have been fully explored.</li>
  </ul>
  <p>
    A cycle is detected when DFS encounters a neighbor that is currently <strong>Gray</strong>. This means we've found a "back edge" to a node that is an ancestor in the current DFS path.
  </p>
`;

export const generateSteps = (graph: GraphData): Step[] => {
  const steps: Step[] = [];
  const colors: Record<string, 'white' | 'gray' | 'black'> = {};
  graph.nodes.forEach(node => colors[node.id] = 'white');
  let cycleFound = false;

  const createStep = (
    description: string,
    path: string[],
    currentNode: string | null = null,
    neighbor: string | null = null,
    cycle: string[] | null = null
  ): void => {
    steps.push({
      dataStructure: [...path],
      visited: new Set(), // Not used in this viz
      currentNode: currentNode,
      neighbor: neighbor,
      description,
      nodeColors: { ...colors },
      highlightedPath: [...path],
      highlightedCycle: cycle || undefined,
    });
  };
  
  createStep('Start. All nodes are white (unvisited).', []);

  const dfs = (u: string, path: string[]) => {
    if (cycleFound) return;

    colors[u] = 'gray';
    path.push(u);
    createStep(`Visiting ${u}. Color changes to Gray.`, path, u);

    for (const v of graph.adj[u]) {
      if (cycleFound) return;

      createStep(`Exploring neighbor ${v} of ${u}.`, path, u, v);
      
      if (colors[v] === 'gray') {
        cycleFound = true;
        const cycleStartIndex = path.indexOf(v);
        const cycle = path.slice(cycleStartIndex);
        createStep(`Cycle detected! Neighbor ${v} is already Gray.`, path, u, v, cycle);
        return;
      }

      if (colors[v] === 'white') {
        dfs(v, path);
        if (cycleFound) return;
      }
    }

    colors[u] = 'black';
    path.pop();
    createStep(`Finished exploring ${u}. Color changes to Black.`, path, u);
  };
  
  for (const node of graph.nodes) {
    if (colors[node.id] === 'white' && !cycleFound) {
      dfs(node.id, []);
    }
  }

  if (!cycleFound) {
      createStep('Traversal complete. No cycles found.', []);
  }

  return steps;
};