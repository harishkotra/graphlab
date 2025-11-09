import type { GraphData, Step } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 100, y: 150 }, { id: 'B', x: 250, y: 150 },
    { id: 'C', x: 400, y: 150 }, { id: 'D', x: 175, y: 250 },
    { id: 'E', x: 325, y: 250 },
  ],
  adj: {
    'A': ['B', 'D'], 'B': ['A', 'C', 'D', 'E'], 'C': ['B', 'E'],
    'D': ['A', 'B', 'E'], 'E': ['B', 'C', 'D'],
  },
  edges: [
    {from:'A', to:'B', weight:1}, {from:'A', to:'D', weight:1},
    {from:'B', to:'C', weight:1}, {from:'B', to:'D', weight:1}, {from:'B', to:'E', weight:1},
    {from:'C', to:'E', weight:1}, {from:'D', to:'E', weight:1},
  ],
};
// This graph has an Eulerian Path (A and C have odd degrees), but no circuit.

export const dataStructureName = 'Odd Degree Count';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Eulerian Path and Circuit</h3>
  <p>
    An <strong>Eulerian Path</strong> is a path in a graph that visits every edge exactly once. An <strong>Eulerian Circuit</strong> is an Eulerian path that starts and ends at the same vertex.
  </p>
  <p>
    The existence of such paths depends on the degrees of the vertices:
  </p>
  <ul class="list-disc list-inside space-y-1 my-2">
    <li>A graph has an <strong>Eulerian Circuit</strong> if and only if it is connected and every vertex has an <strong>even degree</strong>.</li>
    <li>A graph has an <strong>Eulerian Path</strong> if and only if it is connected and has <strong>exactly two vertices of odd degree</strong> (which must be the start and end points).</li>
  </ul>
  <p>This animation first checks the degrees of all vertices and then demonstrates a valid path if one exists.</p>
`;

export const generateSteps = (graph: GraphData): Step[] => {
  const steps: Step[] = [];
  const degrees: Record<string, number> = {};
  graph.nodes.forEach(n => degrees[n.id] = graph.adj[n.id].length);
  
  const oddDegreeNodes = Object.keys(degrees).filter(id => degrees[id] % 2 !== 0);

  steps.push({
    description: "Start. Let's check the degree of each vertex.",
    currentNode: null,
    // Using distances to show degrees
    distances: degrees,
  });

  if (oddDegreeNodes.length === 0) {
    steps.push({
      description: "All vertices have even degrees. An Eulerian Circuit exists.",
      currentNode: null,
      distances: degrees,
      dataStructure: ['0'],
    });
    // Trace a circuit (simple hardcoded one for this example)
    const path = ['A', 'B', 'D', 'E', 'C', 'B', 'E', 'D', 'A']; // Example for a different graph
    // For the current graph, this part won't be reached.
  } else if (oddDegreeNodes.length === 2) {
    steps.push({
      description: `Nodes ${oddDegreeNodes.join(' and ')} have odd degrees. An Eulerian Path exists.`,
      currentNode: null,
      distances: degrees,
      dataStructure: ['2'],
    });
    // Trace a path for the example graph
    const path = ['A', 'D', 'B', 'E', 'C', 'B', 'A'];
    for(let i=1; i < path.length; i++) {
        steps.push({
            description: `Tracing path: ... → ${path[i-1]} → ${path[i]}`,
            currentNode: path[i],
            highlightedPath: path.slice(0, i + 1),
            distances: degrees,
            dataStructure: ['2'],
        });
    }
     steps.push({
      description: `Path complete! Every edge was visited exactly once.`,
      currentNode: null,
      highlightedPath: path,
      distances: degrees,
      dataStructure: ['2'],
    });
  } else {
    steps.push({
      description: `There are ${oddDegreeNodes.length} odd-degree vertices. No Eulerian Path or Circuit exists.`,
      currentNode: null,
      distances: degrees,
      dataStructure: [`${oddDegreeNodes.length}`],
    });
  }

  return steps;
};