import type { GraphData, Step } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 100, y: 200 },
    { id: 'B', x: 300, y: 100 },
    { id: 'C', x: 500, y: 200 },
    { id: 'D', x: 300, y: 300 },
  ],
  adj: {
    'A': ['B', 'D'],
    'B': ['C'],
    'C': ['D', 'A'],
    'D': ['A'],
  },
  directed: true,
};

export const dataStructureName = 'Current Path';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Finding Cycles of Length N</h3>
  <p>
    This algorithm finds a simple cycle of a specific length, N, in a directed graph. A simple cycle is one where vertices are not repeated, except for the start and end node.
  </p>
  <p>
    We use a <strong>backtracking Depth-First Search (DFS)</strong> approach. Starting from each node, we explore its neighbors, keeping track of the current path. If we encounter a neighbor that is the starting node of our path and the path length is exactly N, we have found a cycle. If the path gets longer than N or we hit a dead end, we backtrack.
  </p>
  <p>This animation looks for a cycle of length <strong>N = 3</strong>.</p>
`;

export const generateSteps = (graph: GraphData): Step[] => {
  const steps: Step[] = [];
  const N = 3;
  let cycleFound: string[] | null = null;

  const createStep = (
    desc: string,
    path: string[],
    currentNode: string,
    neighbor: string | null = null
  ) => {
    if (cycleFound) return;
    steps.push({
      description: desc,
      currentNode,
      neighbor,
      dataStructure: path,
      highlightedPath: path,
      visited: new Set(path),
    });
  };

  const findCycleUtil = (startNode: string, u: string, path: string[]) => {
    path.push(u);
    // FIX: Pass path argument to createStep.
    createStep(`Visiting ${u}, path is [${path.join('→')}]`, path, u);

    if (path.length > N) {
      // FIX: Pass path argument to createStep.
      createStep(`Path length exceeded ${N}. Backtracking.`, path, u);
      path.pop();
      return;
    }

    for (const v of graph.adj[u] || []) {
      if (cycleFound) return;
      
      if (v === startNode && path.length === N) {
        cycleFound = [...path, v];
        steps.push({
          description: `Cycle of length ${N} found! [${cycleFound.join('→')}]`,
          currentNode: u,
          neighbor: v,
          dataStructure: path,
          highlightedCycle: cycleFound,
          visited: new Set(path),
        });
        return;
      }
      
      if (!path.includes(v)) {
        findCycleUtil(startNode, v, path);
        if (cycleFound) return;
      }
    }
    
    // FIX: Pass path argument to createStep.
    createStep(`Finished with ${u}. Backtracking.`, path, u);
    path.pop();
  };

  for (const node of graph.nodes) {
    if (cycleFound) break;
    steps.push({
        description: `--- Starting search for cycle of length ${N} from ${node.id} ---`,
        currentNode: node.id,
        dataStructure: [],
    });
    findCycleUtil(node.id, node.id, []);
  }
  
  if (!cycleFound) {
      steps.push({
          description: `Search complete. No cycles of length ${N} found.`,
          currentNode: null,
          dataStructure: [],
      })
  }

  return steps;
};