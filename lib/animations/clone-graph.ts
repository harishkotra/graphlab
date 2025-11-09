import type { GraphData, Step } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 200, y: 100 },
    { id: 'B', x: 400, y: 100 },
    { id: 'C', x: 400, y: 300 },
    { id: 'D', x: 200, y: 300 },
  ],
  adj: {
    'A': ['B', 'D'],
    'B': ['C'],
    'C': ['D'],
    'D': ['A'], // Creates a cycle
  },
  directed: true,
};

export const dataStructureName = 'Cloned Nodes Map';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Cloning a Graph (with cycles)</h3>
  <p>
    Cloning a graph involves creating a deep copy of all its nodes and edges. When the graph can contain cycles, a simple traversal can lead to an infinite loop. The key is to use a <strong>hash map</strong> to keep track of nodes that have already been cloned.
  </p>
  <p>
    This animation uses a Depth-First Search (DFS) approach. When we visit a node, we first check the map. If a clone for this node already exists, we return it immediately. Otherwise, we create a new clone, store it in the map, and then recursively clone all its neighbors. This ensures each node is cloned only once.
  </p>
`;

export const generateSteps = (graph: GraphData): Step[] => {
  const steps: Step[] = [];
  const cloneMap = new Map<string, string>(); // Original ID -> Clone ID
  const visited = new Set<string>();

  const createStep = (
    description: string,
    currentNode: string | null = null,
    neighbor: string | null = null,
  ): void => {
    steps.push({
      dataStructure: Array.from(cloneMap.entries()).map(([k,v]) => `${k} -> ${v}'`),
      visited: new Set(visited),
      currentNode: currentNode,
      neighbor: neighbor,
      description,
      cloneMap: Array.from(cloneMap.entries()),
    });
  };
  
  createStep('Start. No nodes cloned yet.');

  const clone = (originalNodeId: string): string => {
    if (cloneMap.has(originalNodeId)) {
      createStep(`Node ${originalNodeId} already in map. Returning its clone.`, originalNodeId);
      return cloneMap.get(originalNodeId)!;
    }

    const cloneId = `${originalNodeId}'`;
    cloneMap.set(originalNodeId, cloneId);
    visited.add(originalNodeId);
    createStep(`Cloning ${originalNodeId}. Created ${cloneId} and added to map.`, originalNodeId);

    for (const neighborId of graph.adj[originalNodeId]) {
      createStep(`From ${originalNodeId}, exploring neighbor ${neighborId}.`, originalNodeId, neighborId);
      const neighborCloneId = clone(neighborId);
      createStep(`Connecting clone ${cloneId} to ${neighborCloneId}.`, originalNodeId, neighborId);
    }
    
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