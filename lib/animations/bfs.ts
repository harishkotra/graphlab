import type { GraphData, Step } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 100, y: 200 },
    { id: 'B', x: 250, y: 100 },
    { id: 'C', x: 250, y: 300 },
    { id: 'D', x: 400, y: 100 },
    { id: 'E', x: 400, y: 300 },
    { id: 'F', x: 550, y: 200 },
  ],
  adj: {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'E'],
    'D': ['B', 'F'],
    'E': ['C', 'F'],
    'F': ['D', 'E'],
  },
};

export const dataStructureName = 'Queue';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">What is Breadth-First Search?</h3>
  <p>
    Breadth-First Search (BFS) is a graph traversal algorithm that explores neighbor nodes first, before moving to the next level of neighbors. Think of it like casting a net: it spreads out from the starting point evenly in all directions, one layer at a time. 
  </p>
  <p>
    This animation visualizes how BFS explores a graph, using a <strong>Queue</strong> to keep track of nodes to visit next. Watch how nodes are added to the queue and processed in order, ensuring the graph is explored level by level.
  </p>
`;

export const generateSteps = (graph: GraphData, startNode: string): Step[] => {
  const steps: Step[] = [];
  const queue = [startNode];
  const visited = new Set<string>();
  visited.add(startNode);

  steps.push({
    dataStructure: [...queue],
    visited: new Set(visited),
    currentNode: null,
    neighbor: null,
    description: `Start BFS from node ${startNode}. Add it to the queue and mark as visited.`,
  });

  while (queue.length > 0) {
    const currentNode = queue.shift()!;
    
    steps.push({
      dataStructure: [...queue],
      visited: new Set(visited),
      currentNode: currentNode,
      neighbor: null,
      description: `Dequeue ${currentNode} to process it.`,
    });

    const neighbors = graph.adj[currentNode];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        steps.push({
          dataStructure: [...queue],
          visited: new Set(visited),
          currentNode: currentNode,
          neighbor: neighbor,
          description: `Node ${currentNode} explores neighbor ${neighbor}. Add ${neighbor} to queue and mark as visited.`,
        });
      }
    }
  }

  steps.push({
    dataStructure: [],
    visited: new Set(visited),
    currentNode: null,
    neighbor: null,
    description: `Queue is empty. BFS traversal complete.`,
  });

  return steps;
};
