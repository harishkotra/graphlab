import type { GraphData, Step } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 100, y: 200 },
    { id: 'B', x: 250, y: 100 },
    { id: 'C', x: 250, y: 300 },
    { id: 'D', x: 400, y: 100 },
    { id: 'E', x: 400, y: 300 },
  ],
  adj: {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'E'],
    'D': ['B', 'E'],
    'E': ['C', 'D'],
  },
};

export const dataStructureName = 'DFS Path';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Cycle Detection in an Undirected Graph</h3>
  <p>
    Detecting a cycle in an undirected graph is different from in a directed one. A simple Depth-First Search (DFS) can be used. We keep track of the nodes we've already visited.
  </p>
  <p>
    For each visited node, we explore its neighbors. If we encounter a neighbor that is already visited but is <strong>not the direct parent</strong> from which we came, we have found a "back edge". This back edge indicates a cycle.
  </p>
  <p>
    This animation shows the DFS traversal. When a back edge is found, the cycle is highlighted.
  </p>
`;

export const generateSteps = (graph: GraphData): Step[] => {
  const steps: Step[] = [];
  const visited = new Set<string>();
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
      visited: new Set(visited),
      currentNode: currentNode,
      neighbor: neighbor,
      description,
      highlightedPath: [...path],
      highlightedCycle: cycle || undefined,
    });
  };
  
  createStep('Start. No nodes visited.', []);

  const dfs = (u: string, parent: string | null, path: string[]) => {
    if (cycleFound) return;
    
    visited.add(u);
    path.push(u);
    createStep(`Visiting ${u}.`, path, u);

    for (const v of graph.adj[u]) {
      if (cycleFound) return;
      
      // Don't go back to the parent immediately
      if (v === parent) continue;

      createStep(`Exploring neighbor ${v} from ${u}.`, path, u, v);

      if (visited.has(v)) {
        cycleFound = true;
        const cycleStartIndex = path.indexOf(v);
        const cycle = path.slice(cycleStartIndex);
        createStep(`Cycle detected! Visited neighbor ${v} is not the parent.`, path, u, v, cycle);
        return;
      }
      
      dfs(v, u, path);
      if (cycleFound) return;
    }
    path.pop();
    createStep(`Finished with ${u}, backtracking.`, path, u);
  };
  
  for (const node of graph.nodes) {
    if (!visited.has(node.id) && !cycleFound) {
      dfs(node.id, null, []);
    }
  }
  
  if (!cycleFound) {
      createStep('Traversal complete. No cycles found.', []);
  }

  return steps;
};