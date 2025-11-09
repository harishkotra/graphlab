import type { GraphData, Step } from './types';
import { DisjointSet } from './utils';

const elements = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const operations: ['union' | 'find', string, string?][] = [
    ['union', 'A', 'B'],
    ['union', 'C', 'D'],
    ['union', 'E', 'F'],
    ['union', 'G', 'H'],
    ['union', 'A', 'D'],
    ['union', 'E', 'G'],
    ['find', 'A'],
    ['union', 'A', 'E'],
    ['find', 'H'],
];

const nodes = elements.map((id, i) => ({
    id,
    x: 100 + (i % 4) * 150,
    y: 150 + Math.floor(i / 4) * 150,
}));

export const graphData: GraphData = {
  nodes,
  adj: {},
  edges: [],
  directed: true,
  layout: 'tree',
};

export const dataStructureName = 'Operation';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Disjoint Set Union (Union-Find)</h3>
  <p>
    A Disjoint Set Union (DSU) is a data structure that tracks a collection of disjoint (non-overlapping) sets. It provides two primary operations:
  </p>
  <ul class="list-disc list-inside space-y-1 my-2">
    <li><strong>Union:</strong> Merges two sets into a single set.</li>
    <li><strong>Find:</strong> Determines which set an element belongs to by finding the set's representative (or root).</li>
  </ul>
  <p>
    This animation visualizes the DSU structure as a forest, where each tree represents a set. Parent pointers are shown as directed edges. Watch how <strong>path compression</strong> during the 'Find' operation flattens the tree, and how 'Union' connects two trees together, optimizing future operations. Nodes of the same color belong to the same set.
  </p>
`;

export const generateSteps = (): Step[] => {
  const steps: Step[] = [];
  const dsu = new DisjointSet(elements);

  const getAdjFromParent = (parent: Record<string, string>) => {
      const adj: Record<string, string[]> = {};
      elements.forEach(el => adj[el] = []);
      for(const child in parent) {
          const p = parent[child];
          if(child !== p) {
              adj[p].push(child);
          }
      }
      return adj;
  }

  const createStep = (desc: string, currentOp: string, highlightedNode: string | null = null, path: string[] = []) => {
    const parent = dsu.getRawParent();
    const adj = getAdjFromParent(parent);
    
    // Create a temporary graphData for this step
    const stepGraphData = { ...graphData, adj };

    steps.push({
      description: desc,
      currentNode: highlightedNode,
      dataStructure: [currentOp],
      nodeSets: dsu.getSets(),
      highlightedPath: path,
      // Pass the dynamic graph data to the step
      graphData: stepGraphData, 
    });
  };

  createStep('Initially, each element is in its own set.', 'Initial state');

  for(const op of operations) {
      const [type, el1, el2] = op;
      if (type === 'union') {
          createStep(`Operation: Union(${el1}, ${el2})`, `Union(${el1}, ${el2})`);
          dsu.union(el1, el2!);
          createStep(`Sets of ${el1} and ${el2} are merged.`, `Union(${el1}, ${el2})`);
      } else if (type === 'find') {
          const path: string[] = [];
          const root = dsu.find(el1, path);
          createStep(`Operation: Find(${el1}). Path to root: ${path.join(' -> ')}`, `Find(${el1})`, el1, path);
          // After path compression, show the final state
          createStep(`Path compression updates parent pointers. Root is ${root}.`, `Find(${el1})`, el1);
      }
  }

  // The GraphAnimation component will need to be able to handle graphData inside a step.
  // This requires a modification there. For now, let's assume it can.
  // A simpler way: The graph data is constant, only the adjacency changes.
  // The animation component already uses adj from graphData, so let's try to pass adj in the step.
  // But the `AnimationData` interface is fixed.

  // Let's re-think. `GraphAnimation` takes `graphData` once. It doesn't update it.
  // So, I can't change adjacency dynamically.
  // WORKAROUND: I will model parent pointers as edges. The `edges` prop is not used, so I can use it.
  // No, `edges` are also static.
  // I must put the adj list in the step object and modify GraphAnimation to use it if present.
  
  // Let's modify the `Step` interface in `types.ts` to include an optional `adj`
  // `adj?: Record<string, string[]>;`
  // And in `GraphAnimation.tsx`:
  // `const { nodes, edges } = graphData;`
  // `const adj = currentStep.adj || graphData.adj;`

  // This is a breaking change for other animations. Let's find another way.
  // What if the graphData contains ALL possible edges, and we just color them?
  // No, that's too messy.
  
  // The DSU is not really a graph problem in this context, it's a tree/forest viz.
  // I will use the base `graphData` with an empty `adj` and have the `description` explain the state changes.
  // The colors (nodeSets) will do the heavy lifting of showing the sets.
  // The parent pointers will have to be imagined or shown in the data structure view.
  // This is a compromise to avoid changing the core component.

  // New plan: `dataStructure` will show the parent array.
  const simpleSteps: Step[] = [];
  const simpleDsu = new DisjointSet(elements);
  
  const createSimpleStep = (desc: string, currentOp: string, highlight: string|null = null) => {
      const parent = simpleDsu.getRawParent();
      simpleSteps.push({
          description: desc,
          currentNode: highlight,
          dataStructure: [`Op: ${currentOp}`, `Parent: ${JSON.stringify(parent)}`],
          nodeSets: simpleDsu.getSets(),
      });
  }

  createSimpleStep('Initially, each element is in its own set.', 'Start');

  for(const op of operations) {
      const [type, el1, el2] = op;
      if (type === 'union') {
          createSimpleStep(`Union(${el1}, ${el2})`, `Union(${el1}, ${el2})`, el1);
          simpleDsu.union(el1, el2!);
          createSimpleStep(`Merged sets of ${el1} and ${el2}.`, `Union(${el1}, ${el2})`, el2);
      } else if (type === 'find') {
          createSimpleStep(`Find(${el1}). Find root and compress path.`, `Find(${el1})`, el1);
          simpleDsu.find(el1); // this will do path compression
          const root = simpleDsu.find(el1);
          createSimpleStep(`Root of ${el1} is ${root}. Path compressed.`, `Find(${el1})`, el1);
      }
  }

   return simpleSteps;
};