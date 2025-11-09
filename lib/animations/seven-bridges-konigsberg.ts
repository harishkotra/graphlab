import type { GraphData, Step } from './types';

// This is a multigraph, but we represent it as a simple graph for visualization.
export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 200, y: 150 }, // North Bank
    { id: 'B', x: 450, y: 150 }, // South Bank
    { id: 'C', x: 325, y: 250 }, // Island 1
    { id: 'D', x: 325, y: 50 },  // Island 2 (conceptually)
  ],
  adj: {
    'A': ['C', 'C', 'D', 'D'],
    'B': ['C', 'C', 'D'],
  },
  edges: [
    // These edges are just for visuals, the logic relies on degrees
    { from: 'A', to: 'C', weight: 1 },
    { from: 'A', to: 'D', weight: 1 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 1 },
  ],
};

export const dataStructureName = 'Node Degrees';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">The Seven Bridges of Königsberg</h3>
  <p>
    This is the historical problem that famously gave birth to graph theory in the 18th century. The city of Königsberg, Prussia (now Kaliningrad, Russia) was set on a river and included two large islands connected to each other and the mainland by seven bridges.
  </p>
  <p>
    The puzzle was: Is it possible to walk through the city, crossing each of the seven bridges <strong>exactly once</strong>?
  </p>
  <p>
    Leonhard Euler solved this by abstracting the problem into a graph. Each land mass is a vertex, and each bridge is an edge. He proved that such a walk (an Eulerian Path) is only possible if there are at most two vertices with an odd number of edges (degree).
  </p>
`;

export const generateSteps = (): Step[] => {
  const steps: Step[] = [];
  
  // The actual degrees of the multigraph
  const degrees = { 'A': 5, 'B': 3, 'C': 3, 'D': 3 };

  steps.push({
    description: "The problem: Can we cross all 7 bridges exactly once?",
    currentNode: null,
  });

  steps.push({
    description: "Step 1: Abstract the problem. Land masses are vertices, bridges are edges.",
    currentNode: null,
  });
  
  steps.push({
    description: "Step 2: Count the degree of each vertex (number of bridges).",
    currentNode: null,
    distances: degrees, // Use distances to display degrees
    dataStructure: [],
  });
  
  const oddDegreeNodes = Object.keys(degrees).filter(k => degrees[k as keyof typeof degrees] % 2 !== 0);

  steps.push({
    description: `All four vertices have an odd degree.`,
    currentNode: null,
    distances: degrees,
    dataStructure: [`Odd count: ${oddDegreeNodes.length}`],
  });
  
  steps.push({
    description: "Conclusion: Since there are more than two odd-degree vertices, no such path exists. It's impossible!",
    currentNode: null,
    distances: degrees,
    dataStructure: [`Odd count: ${oddDegreeNodes.length}`],
  });

  return steps;
};