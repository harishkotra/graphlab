import type { GraphData, Step } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 100, y: 200 },
    { id: 'B', x: 250, y: 100 },
    { id: 'C', x: 250, y: 300 },
    { id: 'D', x: 400, y: 200 },
  ],
  adj: {
    'A': ['B', 'C'],
    'B': ['D'],
    'C': ['D'],
    'D': [],
  },
  directed: true,
};

export const dataStructureName = 'Cloned Nodes Map';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Cloning a Directed Acyclic Graph</h3>
  <p>
    Cloning a graph involves creating an exact copy of all its nodes and edges. A common approach is to traverse the original graph (e.g., with DFS) and build the new one as you go.
  </p>
  <p>
    A crucial part of this process is a <strong>hash map</strong> that maps each original node to its clone. When we visit a node, we first check the map. If a clone already exists, we reuse it. If not, we create a new node, store it in the map, and then recursively clone all its neighbors.
  </p>
  <p>
    This animation uses colors to show the cloning status: <strong>White</strong> (not cloned), <strong>Gray</strong> (cloning in progress), and <strong>Black</strong> (fully cloned).
  </p>
`;

export const generateSteps = (graph: GraphData): Step[] => {
  const steps: Step[] = [];
  const colors: Record<string, 'white' | 'gray' | 'black'> = {};
  graph.nodes.forEach(node => colors[node.id] = 'white');
  const cloneMap = new Map<string, string>(); // Original ID -> Clone ID (e.g., 'A' -> 'A_clone')

  const createStep = (
    description: string,
    currentNode: string | null = null,
    neighbor: string | null = null,
  ): void => {
    steps.push({
      dataStructure: Array.from(cloneMap.entries()).map(([k,v]) => `${k} -> ${v}`),
      visited: new Set(), // Not used
      currentNode: currentNode,
      neighbor: neighbor,
      description,
      nodeColors: { ...colors },
    });
  };
  
  createStep('Start. No nodes cloned yet.');

  const clone = (originalNodeId: string): string => {
    if (cloneMap.has(originalNodeId)) {
      createStep(`Node ${originalNodeId} already cloned. Reusing its clone.`, originalNodeId);
      return cloneMap.get(originalNodeId)!;
    }

    const cloneId = `${originalNodeId}'`;
    cloneMap.set(originalNodeId, cloneId);
    colors[originalNodeId] = 'gray';
    createStep(`Cloning ${originalNodeId}. Created ${cloneId} and added to map.`, originalNodeId);
    
    // In a real implementation, you'd create a new node object.
    // Here we just simulate it.

    for (const neighborId of graph.adj[originalNodeId]) {
      createStep(`Exploring neighbor ${neighborId} of ${originalNodeId}.`, originalNodeId, neighborId);
      const neighborCloneId = clone(neighborId);
      createStep(`Connecting clone ${cloneId} to ${neighborCloneId}.`, originalNodeId, neighborId);
    }
    
    colors[originalNodeId] = 'black';
    createStep(`Finished cloning ${originalNodeId} and its neighbors.`, originalNodeId);
    return cloneId;
  };

  for (const node of graph.nodes) {
    if (!cloneMap.has(node.id)) {
      clone(node.id);
    }
  }

  createStep('Cloning process complete.');

  return steps;
};