import type { GraphData, Step } from './types';

// Using the same graph as Kahn's algorithm for comparison
export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 100, y: 100 }, { id: 'B', x: 250, y: 200 },
    { id: 'C', x: 100, y: 300 }, { id: 'D', x: 400, y: 100 },
    { id: 'E', x: 400, y: 300 }, { id: 'F', x: 550, y: 200 },
  ],
  adj: {
    'A': ['B', 'D'], 'C': ['B', 'E'], 'B': ['F'], 'D': ['F'], 'E': ['F'], 'F': [],
  },
  edges: [
    {from:'A', to:'B', weight:1}, {from:'A', to:'D', weight:1},
    {from:'C', to:'B', weight:1}, {from:'C', to:'E', weight:1},
    {from:'B', to:'F', weight:1}, {from:'D', to:'F', weight:1}, {from:'E', to:'F', weight:1},
  ],
  directed: true,
};

export const dataStructureName = 'Finished Order (Reversed)';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Topological Sort using Departure Time (DFS)</h3>
  <p>
    An alternative to Kahn's algorithm for topological sorting is a method based on <strong>Depth-First Search (DFS)</strong>. This approach relies on the "departure" or "finishing" time of each vertex during the search.
  </p>
  <p>
    The algorithm works as follows:
  </p>
  <ol class="list-decimal list-inside space-y-1 my-2">
    <li>Perform a DFS traversal of the graph.</li>
    <li>Keep track of the state of each node: unvisited (white), visiting (gray), and finished (black).</li>
    <li>Once a node and all its descendants have been visited (i.e., it's about to be marked black), add it to the front of a list.</li>
  </ol>
  <p>The resulting list is a valid topological sort. This is because a node is only "finished" after all of its dependencies have been finished.</p>
`;

export const generateSteps = (graph: GraphData): Step[] => {
  const steps: Step[] = [];
  const colors: Record<string, 'white' | 'gray' | 'black'> = {};
  graph.nodes.forEach(node => colors[node.id] = 'white');
  const finishedOrder: string[] = [];

  const createStep = (desc: string, current: string | null = null) => {
    steps.push({
      description: desc,
      currentNode: current,
      nodeColors: { ...colors },
      dataStructure: [finishedOrder.join(', ')],
    });
  };

  const dfs = (u: string) => {
    colors[u] = 'gray';
    createStep(`Visiting ${u}. Color is now gray.`, u);

    for (const v of graph.adj[u] || []) {
      if (colors[v] === 'white') {
        dfs(v);
      }
    }

    colors[u] = 'black';
    finishedOrder.unshift(u); // Add to the front of the list
    createStep(`Finished with ${u}. Color is black. Add to front of sorted list.`, u);
  };
  
  createStep("Start DFS-based topological sort. All nodes are white.", null);
  
  for (const node of graph.nodes) {
    if (colors[node.id] === 'white') {
      dfs(node.id);
    }
  }

  createStep("Traversal complete. The final list is a valid topological sort.", null);

  return steps;
};