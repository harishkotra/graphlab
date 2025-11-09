import type { GraphData, Step } from './types';
import { PriorityQueue } from './utils';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 100, y: 200 },
    { id: 'B', x: 250, y: 100 },
    { id: 'C', x: 250, y: 300 },
    { id: 'D', x: 450, y: 100 },
    { id: 'E', x: 450, y: 300 },
    { id: 'F', x: 600, y: 200 },
  ],
  adj: {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'C'],
    'C': ['A', 'B', 'E'],
    'D': ['B', 'F'],
    'E': ['C', 'F'],
    'F': ['D', 'E'],
  },
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'E', weight: 3 },
    { from: 'D', to: 'F', weight: 3 },
    { from: 'E', to: 'F', weight: 1 },
  ],
};

export const dataStructureName = 'Priority Queue';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">What is Dijkstra's Algorithm?</h3>
  <p>
    Dijkstra's algorithm finds the shortest path from a starting node to all other nodes in a weighted graph. It works by maintaining a set of visited nodes and continuously selecting the unvisited node with the smallest known distance to visit next.
  </p>
  <p>
    This animation uses a <strong>Priority Queue</strong> to efficiently select the next node to visit. Watch how the distances (shown below each node) are updated as the algorithm "relaxes" edges, finding shorter and shorter paths until the optimal solution is reached.
  </p>
`;

export const generateSteps = (graph: GraphData, startNode: string): Step[] => {
  const steps: Step[] = [];
  const distances: Record<string, number | '∞'> = {};
  const pq = new PriorityQueue<string>();
  const visited = new Set<string>();

  graph.nodes.forEach(node => {
    distances[node.id] = '∞';
  });
  distances[startNode] = 0;

  pq.enqueue(startNode, 0);

  steps.push({
    dataStructure: pq.toStringArray(),
    visited: new Set(visited),
    currentNode: null,
    neighbor: null,
    description: `Initialize distances. Start node distance is 0, others are infinity.`,
    distances: { ...distances },
  });

  while (!pq.isEmpty()) {
    const currentNode = pq.dequeue()!.element;
    
    if (visited.has(currentNode)) continue;
    visited.add(currentNode);

    steps.push({
      dataStructure: pq.toStringArray(),
      visited: new Set(visited),
      currentNode: currentNode,
      neighbor: null,
      description: `Extract node ${currentNode} with the smallest distance from the Priority Queue.`,
      distances: { ...distances },
    });

    const neighbors = graph.adj[currentNode];
    for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
            const edge = graph.edges!.find(e => 
                (e.from === currentNode && e.to === neighbor) || (e.from === neighbor && e.to === currentNode)
            )!;
            const currentDist = distances[currentNode] as number;
            const neighborDist = distances[neighbor];
            const newDist = currentDist + edge.weight;

            if (neighborDist === '∞' || newDist < neighborDist) {
                distances[neighbor] = newDist;
                pq.enqueue(neighbor, newDist);
                 steps.push({
                    dataStructure: pq.toStringArray(),
                    visited: new Set(visited),
                    currentNode: currentNode,
                    neighbor: neighbor,
                    description: `Shorter path to ${neighbor} found! Update distance to ${newDist}.`,
                    distances: { ...distances },
                    highlightedEdge: edge,
                });
            }
        }
    }
  }
  
  steps.push({
    dataStructure: [],
    visited: new Set(visited),
    currentNode: null,
    neighbor: null,
    description: `Priority Queue is empty. Shortest paths from ${startNode} found.`,
    distances: { ...distances },
  });

  return steps;
};
