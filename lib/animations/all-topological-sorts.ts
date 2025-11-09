import type { GraphData, Step } from './types';

// A small graph to keep the number of permutations manageable
export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 150, y: 150 },
    { id: 'B', x: 350, y: 150 },
    { id: 'C', x: 150, y: 300 },
    { id: 'D', x: 350, y: 300 },
  ],
  // FIX: Merged duplicate 'A' property and added other nodes for completeness.
  adj: { 'A': ['B', 'D'], 'B': [], 'C': ['D'], 'D': [] },
  edges: [
      {from: 'A', to: 'B', weight: 1},
      {from: 'C', to: 'D', weight: 1},
      {from: 'A', to: 'D', weight: 1},
  ],
  directed: true,
};

export const dataStructureName = 'Current Path | Found Sorts';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Finding All Topological Sorts</h3>
  <p>
    While a Directed Acyclic Graph (DAG) is guaranteed to have at least one topological sort, it can often have many. Finding all of them requires a more exhaustive search than standard algorithms like Kahn's or DFS-based sorting.
  </p>
  <p>
    This animation uses a <strong>recursive backtracking</strong> approach. The algorithm maintains the current path and the in-degrees of all nodes. At each step, it finds all available nodes (those with an in-degree of 0 not yet in the path), and recursively explores the path created by adding each one. When a path is complete, it's a valid topological sort.
  </p>
`;

export const generateSteps = (graph: GraphData): Step[] => {
  const steps: Step[] = [];
  const allSorts: string[][] = [];
  const inDegree: Record<string, number> = {};
  graph.nodes.forEach(n => inDegree[n.id] = 0);
  graph.edges!.forEach(e => inDegree[e.to]++);

  const createStep = (desc: string, path: string[]) => {
    steps.push({
      description: desc,
      currentNode: path.length > 0 ? path[path.length - 1] : null,
      visited: new Set(path),
      distances: { ...inDegree }, // Use distances to show in-degrees
      dataStructure: [
          `[${path.join(',')}]`,
          `${allSorts.length}`
      ],
    });
  };

  const backtrack = (path: string[]) => {
    if (path.length === graph.nodes.length) {
      allSorts.push([...path]);
      createStep(`Found a valid sort: [${path.join(', ')}]`, path);
      return;
    }

    const availableNodes = graph.nodes
      .map(n => n.id)
      .filter(id => inDegree[id] === 0 && !path.includes(id));
    
    if(availableNodes.length === 0) {
        createStep(`Dead end from path [${path.join(', ')}]. Backtracking.`, path);
    }

    for (const node of availableNodes) {
      // Choose
      path.push(node);
      (graph.adj[node] || []).forEach(neighbor => inDegree[neighbor]--);
      createStep(`Choose ${node}. Path is now [${path.join(', ')}]`, path);

      // Explore
      backtrack(path);

      // Unchoose (Backtrack)
      (graph.adj[node] || []).forEach(neighbor => inDegree[neighbor]++);
      path.pop();
      createStep(`Backtrack. Path is now [${path.join(', ')}]`, path);
    }
  };

  createStep("Start. In-degrees calculated.", []);
  backtrack([]);
  createStep(`Finished. Found ${allSorts.length} total topological sorts.`, []);

  return steps;
};
