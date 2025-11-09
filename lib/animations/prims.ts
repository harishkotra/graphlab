import type { GraphData, Step, Edge } from './types';
import { PriorityQueue } from './utils';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 100, y: 100 },
    { id: 'B', x: 300, y: 50 },
    { id: 'C', x: 250, y: 250 },
    { id: 'D', x: 500, y: 100 },
    { id: 'E', x: 450, y: 300 },
    { id: 'F', x: 600, y: 200 },
  ],
  adj: {
    'A': ['B', 'C'],
    'B': ['A', 'C', 'D'],
    'C': ['A', 'B', 'E'],
    'D': ['B', 'F'],
    'E': ['C', 'F'],
    'F': ['D', 'E'],
  },
  edges: [
    { from: 'A', to: 'B', weight: 3 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 6 },
    { from: 'C', to: 'E', weight: 8 },
    { from: 'D', to: 'F', weight: 4 },
    { from: 'E', to: 'F', weight: 5 },
  ],
};

export const dataStructureName = 'Priority Queue (Edges)';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">What is Prim's Algorithm?</h3>
  <p>
    Prim's algorithm finds a Minimum Spanning Tree (MST) for a weighted, undirected graph. It's a "greedy" algorithm that grows the MST from a single starting vertex.
  </p>
  <p>
    It works by building the tree one vertex at a time. At each step, it finds the cheapest possible edge that connects a vertex in the growing MST to a vertex outside the MST. This new edge and vertex are then added to the tree. This process is repeated until all vertices are included in the MST. This animation uses a <strong>Priority Queue</strong> to efficiently find the next cheapest edge.
  </p>
`;

const getEdgeKey = (edge: Edge) => [edge.from, edge.to].sort().join('-');

export const generateSteps = (graph: GraphData, startNode: string = 'A'): Step[] => {
  const steps: Step[] = [];
  const mstEdges = new Set<string>();
  const visited = new Set<string>();
  const pq = new PriorityQueue<Edge>();

  steps.push({
    description: `Start Prim's algorithm from node ${startNode}.`,
    currentNode: startNode,
    dataStructure: pq.toStringArray(),
    visited: new Set(visited),
    mstEdges: new Set(mstEdges),
  });

  const addEdges = (nodeId: string) => {
    visited.add(nodeId);
    (graph.adj[nodeId] || []).forEach(neighborId => {
      const edge = graph.edges!.find(e => 
        (e.from === nodeId && e.to === neighborId) || (e.from === neighborId && e.to === nodeId)
      );
      if (edge) {
        pq.enqueue(edge, edge.weight);
      }
    });
  };

  addEdges(startNode);
  steps.push({
    description: `Add all edges from ${startNode} to the priority queue.`,
    currentNode: startNode,
    dataStructure: pq.toStringArray(),
    visited: new Set(visited),
    mstEdges: new Set(mstEdges),
  });

  while (!pq.isEmpty() && visited.size < graph.nodes.length) {
    const edge = pq.dequeue()!.element;
    
    steps.push({
      description: `Extract edge ${edge.from}-${edge.to} (weight ${edge.weight}) from PQ.`,
      currentNode: null,
      highlightedEdge: edge,
      dataStructure: pq.toStringArray(),
      visited: new Set(visited),
      mstEdges: new Set(mstEdges),
    });

    const fromVisited = visited.has(edge.from);
    const toVisited = visited.has(edge.to);

    if (fromVisited && toVisited) {
      steps.push({
        description: `Both nodes are already in the MST. Discard edge.`,
        currentNode: null,
        highlightedEdge: edge,
        dataStructure: pq.toStringArray(),
        visited: new Set(visited),
        mstEdges: new Set(mstEdges),
      });
      continue;
    }

    mstEdges.add(getEdgeKey(edge));
    const newNode = fromVisited ? edge.to : edge.from;

    steps.push({
      description: `Add edge ${edge.from}-${edge.to} to the MST. Visit new node ${newNode}.`,
      currentNode: newNode,
      highlightedEdge: edge,
      dataStructure: pq.toStringArray(),
      visited: new Set(visited),
      mstEdges: new Set(mstEdges),
    });
    
    addEdges(newNode);
    steps.push({
      description: `Add all new edges from ${newNode} to the priority queue.`,
      currentNode: newNode,
      dataStructure: pq.toStringArray(),
      visited: new Set(visited),
      mstEdges: new Set(mstEdges),
    });
  }

  steps.push({
    description: `Algorithm complete. Minimum Spanning Tree found.`,
    currentNode: null,
    dataStructure: [],
    visited: new Set(visited),
    mstEdges: new Set(mstEdges),
  });

  return steps;
};
