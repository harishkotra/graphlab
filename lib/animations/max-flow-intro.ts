import type { GraphData, Step } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'S', x: 100, y: 200 },
    { id: 'A', x: 275, y: 100 },
    { id: 'B', x: 275, y: 300 },
    { id: 'T', x: 450, y: 200 },
  ],
  adj: {
    'S': ['A', 'B'],
    'A': ['B', 'T'],
    'B': ['T'],
    'T': [],
  },
  edges: [
    { from: 'S', to: 'A', weight: 10 },
    { from: 'S', to: 'B', weight: 5 },
    { from: 'A', to: 'B', weight: 3 },
    { from: 'A', to: 'T', weight: 5 },
    { from: 'B', to: 'T', weight: 8 },
  ],
  directed: true,
};

export const dataStructureName = 'Total Flow';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">What is the Max Flow Problem?</h3>
  <p>
    Imagine a network of pipes, where each pipe has a maximum capacity. The Max Flow problem aims to find the maximum amount of "stuff" (like water or data) that can be sent from a <strong>source (S)</strong> to a <strong>sink (T)</strong> without exceeding the capacity of any pipe.
  </p>
  <p>
    This animation introduces the core concepts:
  </p>
  <ul class="list-disc list-inside space-y-1 my-2">
    <li><strong>Flow Network:</strong> A directed graph with a source, a sink, and edge capacities.</li>
    <li><strong>Flow:</strong> The amount of stuff passing through an edge, which cannot exceed its capacity. Edge labels show <code>flow/capacity</code>.</li>
    <li><strong>Flow Conservation:</strong> For any node other than S or T, the total flow entering the node must equal the total flow leaving it.</li>
    <li><strong>Augmenting Path:</strong> A path from S to T in the "residual graph" with available capacity. We can push more flow along such paths.</li>
  </ul>
`;

const getDirectedEdgeKey = (from: string, to: string) => `${from}->${to}`;

export const generateSteps = (graph: GraphData, startNode: string = 'S'): Step[] => {
  const steps: Step[] = [];
  const flows: Record<string, number> = {};
  graph.edges!.forEach(e => flows[getDirectedEdgeKey(e.from, e.to)] = 0);
  let totalFlow = 0;

  steps.push({
    description: "Start with a flow network. All flows are initially 0.",
    currentNode: 'S',
    flows: { ...flows },
    dataStructure: [`${totalFlow}`]
  });

  const path1 = ['S', 'A', 'T'];
  steps.push({
    description: "Let's find a path from S to T: S-A-T. This is an 'augmenting path'.",
    currentNode: null,
    highlightedPath: path1,
    flows: { ...flows },
    dataStructure: [`${totalFlow}`]
  });

  const bottleneck1 = 5; // min(cap(S,A)=10, cap(A,T)=5)
  flows[getDirectedEdgeKey('S','A')] += bottleneck1;
  flows[getDirectedEdgeKey('A','T')] += bottleneck1;
  totalFlow += bottleneck1;
  steps.push({
    description: `The bottleneck capacity of this path is 5. We push 5 units of flow.`,
    currentNode: null,
    highlightedPath: path1,
    flows: { ...flows },
    dataStructure: [`${totalFlow}`]
  });

  const path2 = ['S', 'B', 'T'];
  steps.push({
    description: "Let's find another path: S-B-T.",
    currentNode: null,
    highlightedPath: path2,
    flows: { ...flows },
    dataStructure: [`${totalFlow}`]
  });

  const bottleneck2 = 5; // min(cap(S,B)=5, cap(B,T)=8)
  flows[getDirectedEdgeKey('S','B')] += bottleneck2;
  flows[getDirectedEdgeKey('B','T')] += bottleneck2;
  totalFlow += bottleneck2;
  steps.push({
    description: `The bottleneck is 5. We push another 5 units of flow.`,
    currentNode: null,
    highlightedPath: path2,
    flows: { ...flows },
    dataStructure: [`${totalFlow}`]
  });

  const path3 = ['S', 'A', 'B', 'T'];
  steps.push({
    description: "What about path S-A-B-T? We can still push more flow.",
    currentNode: null,
    highlightedPath: path3,
    flows: { ...flows },
    dataStructure: [`${totalFlow}`]
  });

  const bottleneck3 = 3; // min(res(S,A)=5, res(A,B)=3, res(B,T)=3)
  flows[getDirectedEdgeKey('S','A')] += bottleneck3;
  flows[getDirectedEdgeKey('A','B')] += bottleneck3;
  flows[getDirectedEdgeKey('B','T')] += bottleneck3;
  totalFlow += bottleneck3;
  steps.push({
    description: `The bottleneck is 3. Pushing 3 more units. Total flow is now 13.`,
    currentNode: null,
    highlightedPath: path3,
    flows: { ...flows },
    dataStructure: [`${totalFlow}`]
  });
  
  steps.push({
    description: "Now, no more paths with available capacity exist. The max flow is 13.",
    currentNode: null,
    flows: { ...flows },
    dataStructure: [`${totalFlow}`]
  });

  return steps;
};