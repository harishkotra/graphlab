import type { GraphData, Step } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 50, y: 200 },
    { id: 'B', x: 200, y: 100 },
    { id: 'C', x: 200, y: 300 },
    { id: 'D', x: 350, y: 100 },
    { id: 'E', x: 350, y: 300 },
    { id: 'F', x: 500, y: 200 },
  ],
  adj: {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'E'],
    'D': ['B', 'F'],
    'E': ['C', 'F'],
    'F': ['D', 'E'],
  },
  edges: [
    { from: 'A', to: 'B', weight: 1 },
    { from: 'A', to: 'C', weight: 0 },
    { from: 'B', to: 'D', weight: 0 },
    { from: 'C', to: 'E', weight: 1 },
    { from: 'D', to: 'F', weight: 1 },
    { from: 'E', to: 'F', weight: 0 },
  ],
};

export const dataStructureName = 'Deque';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">What is 0-1 BFS?</h3>
  <p>
    0-1 BFS is a special, optimized version of Dijkstra's algorithm for finding the shortest path in a graph where edge weights are only <strong>0 or 1</strong>. Instead of a complex Priority Queue, it uses a simple <strong>Deque</strong> (a double-ended queue).
  </p>
  <p>
    When traversing the graph, if we cross an edge with weight 0, the new node is pushed to the <strong>front</strong> of the deque. If the edge has weight 1, it's pushed to the <strong>back</strong>. This ensures that we always explore paths with zero-cost edges first, maintaining the shortest path property efficiently.
  </p>
`;

export const generateSteps = (graph: GraphData, startNode: string = 'A'): Step[] => {
  const steps: Step[] = [];
  const distances: Record<string, number | '∞'> = {};
  const deque: string[] = [];

  graph.nodes.forEach(node => {
    distances[node.id] = '∞';
  });
  distances[startNode] = 0;
  deque.push(startNode);

  steps.push({
    dataStructure: [...deque],
    visited: new Set(),
    currentNode: null,
    neighbor: null,
    description: `Initialize distances. Start node is 0. Add to deque.`,
    distances: { ...distances },
  });

  while (deque.length > 0) {
    const currentNode = deque.shift()!;
    
    steps.push({
      dataStructure: [...deque],
      visited: new Set([currentNode]), // Using visited to show 'processing' color
      currentNode: currentNode,
      neighbor: null,
      description: `Process node ${currentNode} from the front of the deque.`,
      distances: { ...distances },
    });

    const neighbors = graph.adj[currentNode];
    for (const neighbor of neighbors) {
      const edge = graph.edges!.find(e => 
        (e.from === currentNode && e.to === neighbor) || (e.from === neighbor && e.to === currentNode)
      )!;
      const weight = edge.weight;
      const currentDist = distances[currentNode] as number;
      const neighborDist = distances[neighbor];

      if (neighborDist === '∞' || currentDist + weight < neighborDist) {
        distances[neighbor] = currentDist + weight;
        let descriptionText = '';

        if (weight === 0) {
          deque.unshift(neighbor);
          descriptionText = `Path to ${neighbor} costs 0. Add to FRONT of deque.`;
        } else {
          deque.push(neighbor);
          descriptionText = `Path to ${neighbor} costs 1. Add to BACK of deque.`;
        }

        steps.push({
          dataStructure: [...deque],
          visited: new Set([currentNode]),
          currentNode: currentNode,
          neighbor: neighbor,
          description: descriptionText,
          distances: { ...distances },
          highlightedEdge: edge,
        });
      }
    }
  }
  
  steps.push({
    dataStructure: [],
    visited: new Set(graph.nodes.map(n => n.id)), // Show all as visited
    currentNode: null,
    neighbor: null,
    description: `Deque is empty. Shortest paths found.`,
    distances: { ...distances },
  });

  return steps;
};