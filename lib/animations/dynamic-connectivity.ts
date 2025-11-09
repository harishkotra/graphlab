import type { GraphData, Step, Edge } from './types';
import { DisjointSet } from './utils';

const elements = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const addOperations: [string, string][] = [
    ['A', 'B'], ['C', 'D'], ['E', 'F'], ['G', 'H'],
    ['A', 'D'], ['E', 'G'], ['B', 'F']
];

export const graphData: GraphData = {
  nodes: elements.map((id, i) => ({
    id,
    x: 150 + (i % 4) * 120,
    y: 150 + Math.floor(i / 4) * 150,
  })),
  adj: {},
  edges: [],
};

export const dataStructureName = 'Operation';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Dynamic Connectivity (Incremental)</h3>
  <p>
    Dynamic connectivity problems involve maintaining information about the connected components of a graph as edges are added or deleted. This animation demonstrates the simpler <strong>incremental</strong> version, where edges are only added.
  </p>
  <p>
    This problem can be solved very efficiently using a <strong>Disjoint Set Union (DSU)</strong> data structure. Each set in the DSU represents a connected component.
  </p>
  <ul class="list-disc list-inside space-y-1 my-2">
    <li><strong>Add Edge (u, v):</strong> This corresponds to a <code>union(u, v)</code> operation in the DSU, merging the components containing u and v.</li>
    <li><strong>Query (u, v):</strong> To check if u and v are connected, we simply check if <code>find(u) == find(v)</code>.</li>
  </ul>
  <p>The animation shows edges being added one by one, with the components (represented by colors) merging accordingly.</p>
`;

const getEdgeKey = (from: string, to: string) => [from, to].sort().join('-');

export const generateSteps = (): Step[] => {
  const steps: Step[] = [];
  const dsu = new DisjointSet(elements);
  const currentEdges = new Set<string>();

  const createStep = (desc: string, op: string, highlightedEdge: { from: string, to: string, weight: number } | null = null) => {
    steps.push({
      description: desc,
      currentNode: null,
      highlightedEdge: highlightedEdge || undefined,
      nodeSets: dsu.getSets(),
      mstEdges: new Set(currentEdges), // Using mstEdges to render the current graph
      dataStructure: [op],
    });
  };

  createStep('Start with 8 disconnected components.', 'Initial state');
  
  // Interleave add and query operations
  createStep('Query: Are A and C connected?', 'Query(A,C)');
  const rootA_pre = dsu.find('A');
  const rootC_pre = dsu.find('C');
  createStep(`find(A) is ${rootA_pre}, find(C) is ${rootC_pre}. They are different. Result: No.`, 'Query(A,C)');

  for (const [u, v] of addOperations) {
    createStep(`Operation: Add edge ${u}-${v}`, `Add(${u},${v})`, { from: u, to: v, weight: 1 });
    dsu.union(u, v);
    currentEdges.add(getEdgeKey(u, v));
    createStep(`Union(${u},${v}). The components have merged.`, `Add(${u},${v})`, { from: u, to: v, weight: 1 });
  }

  createStep('Query: Are A and G connected?', 'Query(A,G)');
  const rootA_post = dsu.find('A');
  const rootG_post = dsu.find('G');
  createStep(`find(A) is ${rootA_post}, find(G) is ${rootG_post}. They are the same. Result: Yes.`, 'Query(A,G)');
  
  return steps;
};