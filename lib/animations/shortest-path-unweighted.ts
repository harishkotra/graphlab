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
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Shortest Path in an Unweighted Graph</h3>
  <p>
    Finding the shortest path in an unweighted graph means finding the path with the fewest number of edges between two nodes. Since every edge has an effective "weight" of 1, the best algorithm for this task is a standard <strong>Breadth-First Search (BFS)</strong>.
  </p>
  <p>
    BFS naturally explores the graph layer by layer from the starting node. This guarantees that when it first reaches any node, it has done so via the shortest possible path (in terms of edge count). This animation shows BFS tracking the distance from the start node.
  </p>
`;

export const generateSteps = (graph: GraphData, startNode: string = 'A'): Step[] => {
  const steps: Step[] = [];
  const queue: string[] = [startNode];
  const visited = new Set<string>([startNode]);
  const distances: Record<string, number | '∞'> = {};

  graph.nodes.forEach(node => {
    distances[node.id] = '∞';
  });
  distances[startNode] = 0;


  steps.push({
    dataStructure: [...queue],
    visited: new Set(visited),
    currentNode: null,
    neighbor: null,
    description: `Start BFS from node ${startNode}. Distance is 0.`,
    distances: { ...distances },
  });

  while (queue.length > 0) {
    const currentNode = queue.shift()!;
    
    steps.push({
      dataStructure: [...queue],
      visited: new Set(visited),
      currentNode: currentNode,
      neighbor: null,
      description: `Dequeue ${currentNode} to process it.`,
      distances: { ...distances },
    });

    const neighbors = graph.adj[currentNode];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        const currentDist = distances[currentNode] as number;
        distances[neighbor] = currentDist + 1;

        steps.push({
          dataStructure: [...queue],
          visited: new Set(visited),
          currentNode: currentNode,
          neighbor: neighbor,
          description: `Visit ${neighbor}. Distance = ${distances[neighbor]}. Add to queue.`,
          distances: { ...distances },
          highlightedEdge: { from: currentNode, to: neighbor, weight: 1},
        });
      }
    }
  }

  steps.push({
    dataStructure: [],
    visited: new Set(visited),
    currentNode: null,
    neighbor: null,
    description: `Queue is empty. Shortest paths from ${startNode} found.`,
    distances: { ...distances },
  });

  return steps;
};