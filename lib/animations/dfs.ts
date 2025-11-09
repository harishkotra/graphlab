import type { GraphData, Step } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 325, y: 50 },
    { id: 'B', x: 150, y: 150 },
    { id: 'C', x: 500, y: 150 },
    { id: 'D', x: 100, y: 250 },
    { id: 'E', x: 250, y: 250 },
    { id: 'F', x: 550, y: 250 },
  ],
  adj: {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F'],
    'D': [],
    'E': ['F'],
    'F': [],
  },
  directed: true,
};

export const dataStructureName = 'Stack';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">What is Depth-First Search?</h3>
  <p>
    Depth-First Search (DFS) is a graph traversal algorithm that explores as far as possible along each branch before backtracking. Imagine walking through a maze: you follow one path to its end. If it's a dead end, you backtrack to the last junction and try a different path.
  </p>
  <p>
    This animation visualizes how DFS explores a graph, using a <strong>Stack</strong> to keep track of nodes to visit. Watch how the algorithm goes deep down one path, then backtracks to explore other branches.
  </p>
`;

export const generateSteps = (graph: GraphData, startNode: string): Step[] => {
  const steps: Step[] = [];
  const stack = [startNode];
  const visited = new Set<string>();
  
  steps.push({
    dataStructure: [...stack].reverse(),
    visited: new Set(visited),
    currentNode: null,
    neighbor: null,
    description: `Start DFS from node ${startNode}. Add it to the stack.`,
  });

  while (stack.length > 0) {
    const currentNode = stack.pop()!;
    
    if (visited.has(currentNode)) {
        continue;
    }
    visited.add(currentNode);

    steps.push({
      dataStructure: [...stack].reverse(),
      visited: new Set(visited),
      currentNode: currentNode,
      neighbor: null,
      description: `Pop ${currentNode} from stack, mark as visited.`,
    });

    const neighbors = graph.adj[currentNode] || [];
    for (const neighbor of [...neighbors].reverse()) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
        steps.push({
          dataStructure: [...stack].reverse(),
          visited: new Set(visited),
          currentNode: currentNode,
          neighbor: neighbor,
          description: `Node ${currentNode} discovers unvisited neighbor ${neighbor}. Push to stack.`,
        });
      }
    }
  }

  steps.push({
    dataStructure: [],
    visited: new Set(visited),
    currentNode: null,
    neighbor: null,
    description: `Stack is empty. DFS traversal complete.`,
  });

  return steps;
};
