import type { GraphData, Step, Edge } from './types';
import { DisjointSet } from './utils';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 100, y: 150 }, { id: 'B', x: 250, y: 100 },
    { id: 'C', x: 250, y: 300 }, { id: 'D', x: 400, y: 150 },
    { id: 'E', x: 400, y: 300 }, { id: 'F', x: 550, y: 250 },
    { id: 'G', x: 150, y: 350 },
  ],
  adj: { /* adj is not used for this logic, edges are primary */ },
  edges: [
    { from: 'A', to: 'B', weight: 4 }, { from: 'A', to: 'C', weight: 3 },
    { from: 'A', to: 'G', weight: 5 }, { from: 'B', to: 'D', weight: 2 },
    { from: 'C', to: 'D', weight: 6 }, { from: 'C', to: 'E', weight: 8 },
    { from: 'C', to: 'G', weight: 7 }, { from: 'D', to: 'E', weight: 1 },
    { from: 'E', to: 'F', weight: 9 }, { from: 'F', to: 'G', weight: 10 },
  ],
};

export const dataStructureName = 'Components';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">What is Borůvka's Algorithm?</h3>
  <p>
    Borůvka's algorithm is one of the oldest algorithms for finding a Minimum Spanning Tree (MST). It works in phases, gradually building up the MST by merging components (sets of connected vertices).
  </p>
  <p>
    The algorithm proceeds as follows:
  </p>
  <ol class="list-decimal list-inside space-y-1 my-2">
    <li>Start with each vertex as its own component.</li>
    <li>While there is more than one component:</li>
    <li class="ml-4">For <strong>each</strong> existing component, find the cheapest edge that connects it to a <strong>different</strong> component.</li>
    <li class="ml-4">Add all these selected cheapest edges to the MST.</li>
    <li class="ml-4">Merge the components that are now connected by these new edges.</li>
  </ol>
  <p>The animation shows components with the same color. In each phase, the cheapest outgoing edge for each component is found, and then the components are merged.</p>
`;

const getEdgeKey = (edge: Edge) => [edge.from, edge.to].sort().join('-');

export const generateSteps = (graph: GraphData): Step[] => {
  const steps: Step[] = [];
  const nodeIds = graph.nodes.map(n => n.id);
  const dsu = new DisjointSet(nodeIds);
  let mstEdges = new Set<string>();
  let numComponents = nodeIds.length;

  steps.push({
    description: `Start. Each vertex is its own component.`,
    currentNode: null,
    nodeSets: dsu.getSets(),
    mstEdges: new Set(mstEdges),
    dataStructure: [`${numComponents}`],
  });

  let phase = 1;
  while (numComponents > 1) {
    const cheapest: Record<string, Edge | null> = {};
    const componentRoots = new Set(Object.values(dsu.getSets()));
    componentRoots.forEach(root => cheapest[root] = null);
    
    steps.push({
      description: `Phase ${phase}: Find the cheapest edge for each component.`,
      currentNode: null,
      nodeSets: dsu.getSets(),
      mstEdges: new Set(mstEdges),
      dataStructure: [`${numComponents}`],
    });

    for (const edge of graph.edges!) {
      const root1 = dsu.find(edge.from);
      const root2 = dsu.find(edge.to);
      if (root1 !== root2) {
        if (!cheapest[root1] || edge.weight < cheapest[root1]!.weight) {
          cheapest[root1] = edge;
        }
        if (!cheapest[root2] || edge.weight < cheapest[root2]!.weight) {
          cheapest[root2] = edge;
        }
      }
    }
    
    let addedAnEdge = false;
    for (const root in cheapest) {
      const edge = cheapest[root];
      if (edge && !mstEdges.has(getEdgeKey(edge))) {
        addedAnEdge = true;
        mstEdges.add(getEdgeKey(edge));
        steps.push({
          description: `Component ${root}'s cheapest edge is ${edge.from}-${edge.to}. Add to MST.`,
          currentNode: null,
          highlightedEdge: edge,
          nodeSets: dsu.getSets(),
          mstEdges: new Set(mstEdges),
          dataStructure: [`${numComponents}`],
        });
      }
    }

    if (!addedAnEdge) break; // Should not happen in connected graphs

    for (const root in cheapest) {
        const edge = cheapest[root];
        if (edge) {
            dsu.union(edge.from, edge.to);
        }
    }
    
    numComponents = new Set(Object.values(dsu.getSets())).size;
    steps.push({
      description: `Phase ${phase} complete. Merge components. New component count: ${numComponents}.`,
      currentNode: null,
      nodeSets: dsu.getSets(),
      mstEdges: new Set(mstEdges),
      dataStructure: [`${numComponents}`],
    });
    phase++;
  }

  steps.push({
    description: `Algorithm complete. Only one component remains.`,
    currentNode: null,
    nodeSets: dsu.getSets(),
    mstEdges: new Set(mstEdges),
    dataStructure: [`${numComponents}`],
  });

  return steps;
};
