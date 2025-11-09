import type { GraphData, Step } from './types';

const nodeIds = ['A', 'B', 'C', 'D'];
export const nodeIndexMap: Record<string, number> = Object.fromEntries(nodeIds.map((id, i) => [id, i]));

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 150, y: 100 },
    { id: 'B', x: 450, y: 100 },
    { id: 'C', x: 150, y: 300 },
    { id: 'D', x: 450, y: 300 },
  ],
  adj: {
    'A': ['B', 'C'],
    'B': ['C'],
    'C': [],
    'D': ['C'],
  },
  directed: true,
};

export const dataStructureName = 'Current DFS Path';

export const description = `
  <h3 class="text-xl font-bold text-gray-900 dark:text-white">What is Transitive Closure?</h3>
  <p>
    The transitive closure of a directed graph shows which vertices are reachable from other vertices. It can be represented as a matrix, often called the reachability matrix, where an entry (i, j) is 1 if there is a path from vertex i to vertex j, and 0 otherwise.
  </p>
  <p>
    A straightforward way to compute this is to run a <strong>Depth-First Search (DFS)</strong> or BFS starting from every single vertex in the graph. For each starting vertex <code>i</code>, every node <code>j</code> visited during the traversal is reachable from <code>i</code>. This animation shows a DFS running from each vertex sequentially and filling out the reachability matrix row by row.
  </p>
`;

export const generateSteps = (graph: GraphData): Step[] => {
  const steps: Step[] = [];
  const V = graph.nodes.length;
  const reach: (0 | 1)[][] = Array(V).fill(null).map(() => Array(V).fill(0));

  const copyMatrix = (m: (0 | 1)[][]) => m.map(row => [...row]);

  steps.push({
    description: 'Initialize an empty reachability matrix.',
    reachabilityMatrix: copyMatrix(reach),
    currentNode: null,
  });

  for (let i = 0; i < V; i++) {
    const startNodeId = nodeIds[i];
    const visited = new Set<string>();
    const stack: string[] = [startNodeId];
    const path: string[] = [];

    steps.push({
      description: `Starting DFS from node ${startNodeId} to find all reachable nodes.`,
      reachabilityMatrix: copyMatrix(reach),
      currentNode: startNodeId,
      highlightedPath: [],
    });

    const dfs = (u: string) => {
        visited.add(u);
        path.push(u);
        const u_idx = nodeIndexMap[u];
        reach[i][u_idx] = 1;

        steps.push({
            description: `Visiting ${u}. Marking reach[${startNodeId}][${u}] = 1.`,
            reachabilityMatrix: copyMatrix(reach),
            currentNode: u,
            visited: new Set(visited),
            highlightedPath: [...path],
        });

        for(const v of graph.adj[u] || []) {
            if(!visited.has(v)) {
                dfs(v);
            }
        }
        path.pop();
    }
    
    dfs(startNodeId);
     steps.push({
      description: `DFS from ${startNodeId} complete. Row ${i} of the matrix is finalized.`,
      reachabilityMatrix: copyMatrix(reach),
      currentNode: null,
      visited: new Set(visited),
    });
  }

  steps.push({
    description: 'Algorithm complete. The final reachability matrix is shown.',
    reachabilityMatrix: copyMatrix(reach),
    currentNode: null,
  });

  return steps;
};