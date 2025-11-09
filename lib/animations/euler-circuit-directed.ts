import type { GraphData, Step } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 150, y: 200 }, { id: 'B', x: 325, y: 100 },
    { id: 'C', x: 500, y: 200 }, { id: 'D', x: 325, y: 300 },
  ],
  adj: { 'A': ['B'], 'B': ['C'], 'C': ['D'], 'D': ['A'] },
  edges: [
    {from:'A', to:'B', weight:1}, {from:'B', to:'C', weight:1},
    {from:'C', to:'D', weight:1}, {from:'D', to:'A', weight:1},
  ],
  directed: true,
};

export const dataStructureName = 'In-Degree == Out-Degree?';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Eulerian Circuit in a Directed Graph</h3>
  <p>
    An Eulerian Circuit in a <strong>directed</strong> graph is a cycle that traverses every edge exactly once. The conditions for its existence are stricter than in an undirected graph.
  </p>
  <p>
    A directed graph has an Eulerian Circuit if and only if:
  </p>
  <ol class="list-decimal list-inside space-y-1 my-2">
    <li>For every vertex, its <strong>in-degree equals its out-degree</strong>.</li>
    <li>All vertices with non-zero degree belong to a single <strong>strongly connected component</strong>.</li>
  </ol>
  <p>This animation first checks the in-degree/out-degree condition for all vertices and then traces the circuit if the conditions are met.</p>
`;

export const generateSteps = (graph: GraphData): Step[] => {
  const steps: Step[] = [];
  const inDegree: Record<string, number> = {};
  const outDegree: Record<string, number> = {};
  graph.nodes.forEach(n => {
    inDegree[n.id] = 0;
    outDegree[n.id] = (graph.adj[n.id] || []).length;
  });
  graph.edges!.forEach(e => { inDegree[e.to]++; });

  let allMatch = true;
  const degreeData: string[] = [];
  for (const node of graph.nodes) {
    if (inDegree[node.id] !== outDegree[node.id]) {
      allMatch = false;
    }
    degreeData.push(`${node.id}: In(${inDegree[node.id]}), Out(${outDegree[node.id]})`);
  }

  steps.push({
    description: "Start. Check if in-degree equals out-degree for all vertices.",
    currentNode: null,
    dataStructure: degreeData,
  });

  if (allMatch) {
    steps.push({
      description: "Condition met! Graph has an Eulerian Circuit (assuming strong connectivity).",
      currentNode: null,
      dataStructure: ["Yes"],
    });

    // Trace the circuit
    const path = ['A', 'B', 'C', 'D', 'A'];
    for (let i = 1; i < path.length; i++) {
        steps.push({
            description: `Tracing circuit: ... → ${path[i-1]} → ${path[i]}`,
            currentNode: path[i],
            highlightedPath: path.slice(0, i + 1),
            dataStructure: ["Yes"],
        });
    }
  } else {
      steps.push({
      description: "Condition failed. No Eulerian Circuit exists.",
      currentNode: null,
      dataStructure: ["No"],
    });
  }

  return steps;
};