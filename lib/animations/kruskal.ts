import type { GraphData, Step, Edge } from './types';
import { DisjointSet } from './utils';

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

export const dataStructureName = 'Sorted Edges';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">What is Kruskal's Algorithm?</h3>
  <p>
    Kruskal's algorithm finds a Minimum Spanning Tree (MST) for a weighted, undirected graph. An MST is a subset of the edges that connects all vertices together with the minimum possible total edge weight, without forming any cycles.
  </p>
  <p>
    The algorithm works by sorting all the edges by weight and adding them to the MST one by one, as long as they don't create a cycle. To detect cycles, it uses a <strong>Disjoint Set Union (DSU)</strong> data structure. In this animation, nodes belonging to the same set are shown in the same color.
  </p>
`;

const getEdgeKey = (edge: Edge) => [edge.from, edge.to].sort().join('-');

export const generateSteps = (graph: GraphData): Step[] => {
  const steps: Step[] = [];
  const sortedEdges = [...graph.edges!].sort((a, b) => a.weight - b.weight);
  const dsu = new DisjointSet(graph.nodes.map(n => n.id));
  const mstEdges = new Set<string>();

  steps.push({
    dataStructure: sortedEdges.map(e => `${e.from}-${e.to} (${e.weight})`),
    visited: new Set(),
    currentNode: null,
    neighbor: null,
    description: `Start with all nodes in their own set. Sort all edges by weight.`,
    nodeSets: dsu.getSets(),
    mstEdges: new Set(mstEdges),
  });

  for (const edge of sortedEdges) {
    steps.push({
      dataStructure: sortedEdges.map(e => `${e.from}-${e.to} (${e.weight})`),
      visited: new Set(),
      currentNode: null,
      neighbor: null,
      description: `Considering edge ${edge.from}-${edge.to} with weight ${edge.weight}.`,
      nodeSets: dsu.getSets(),
      highlightedEdge: edge,
      mstEdges: new Set(mstEdges),
    });

    if (dsu.find(edge.from) !== dsu.find(edge.to)) {
      dsu.union(edge.from, edge.to);
      mstEdges.add(getEdgeKey(edge));
      steps.push({
        dataStructure: sortedEdges.map(e => `${e.from}-${e.to} (${e.weight})`),
        visited: new Set(),
        currentNode: null,
        neighbor: null,
        description: `No cycle formed. Add ${edge.from}-${edge.to} to MST and union their sets.`,
        nodeSets: dsu.getSets(),
        highlightedEdge: edge,
        mstEdges: new Set(mstEdges),
      });
    } else {
       steps.push({
        dataStructure: sortedEdges.map(e => `${e.from}-${e.to} (${e.weight})`),
        visited: new Set(),
        currentNode: null,
        neighbor: null,
        description: `Edge ${edge.from}-${edge.to} would form a cycle. Discard it.`,
        nodeSets: dsu.getSets(),
        highlightedEdge: edge,
        mstEdges: new Set(mstEdges),
      });
    }
  }

  steps.push({
    dataStructure: sortedEdges.map(e => `${e.from}-${e.to} (${e.weight})`),
    visited: new Set(),
    currentNode: null,
    neighbor: null,
    description: `Finished. Minimum Spanning Tree is complete.`,
    nodeSets: dsu.getSets(),
    mstEdges: new Set(mstEdges),
  });

  return steps;
};
