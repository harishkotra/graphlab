import type { GraphData, Step } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 100, y: 100 }, // e.g., Compile Core
    { id: 'B', x: 250, y: 200 }, // e.g., Link Libraries
    { id: 'C', x: 100, y: 300 }, // e.g., Get Dependencies
    { id: 'D', x: 400, y: 100 }, // e.g., Build UI
    { id: 'E', x: 400, y: 300 }, // e.g., Run Tests
    { id: 'F', x: 550, y: 200 }, // e.g., Deploy
  ],
  adj: {
    'A': ['B', 'D'],
    'C': ['B', 'E'],
    'B': ['F'],
    'D': ['F'],
    'E': ['F'],
    'F': [],
  },
  edges: [
    {from:'A', to:'B', weight:1}, {from:'A', to:'D', weight:1},
    {from:'C', to:'B', weight:1}, {from:'C', to:'E', weight:1},
    {from:'B', to:'F', weight:1}, {from:'D', to:'F', weight:1}, {from:'E', to:'F', weight:1},
  ],
  directed: true,
};

export const dataStructureName = 'Queue | Sorted Order';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">What is Topological Sorting?</h3>
  <p>
    A topological sort of a Directed Acyclic Graph (DAG) is a linear ordering of its vertices such that for every directed edge from vertex <code>u</code> to vertex <code>v</code>, <code>u</code> comes before <code>v</code> in the ordering. It's often used for scheduling tasks with dependencies, like a build process.
  </p>
  <p>
    This animation uses <strong>Kahn's algorithm</strong>, a popular method for topological sorting. It works by:
  </p>
  <ol class="list-decimal list-inside space-y-1 my-2">
    <li>Calculating the "in-degree" (number of incoming edges) for every vertex.</li>
    <li>Adding all vertices with an in-degree of 0 to a queue.</li>
    <li>While the queue is not empty, dequeue a vertex, add it to the sorted list, and decrement the in-degree of all its neighbors.</li>
    <li>If a neighbor's in-degree becomes 0, add it to the queue.</li>
  </ol>
`;

export const generateSteps = (graph: GraphData): Step[] => {
  const steps: Step[] = [];
  const inDegree: Record<string, number> = {};
  graph.nodes.forEach(n => inDegree[n.id] = 0);
  graph.edges!.forEach(e => inDegree[e.to]++);

  const queue = graph.nodes.filter(n => inDegree[n.id] === 0).map(n => n.id);
  const sortedOrder: string[] = [];
  const initialInDegrees = { ...inDegree };

  steps.push({
    description: "Start. Calculate the in-degree for every node.",
    currentNode: null,
    // Use distances to show in-degrees
    distances: initialInDegrees,
    dataStructure: [queue.join(','), ''],
  });
  
  steps.push({
    description: "Add all nodes with an in-degree of 0 to the queue.",
    currentNode: null,
    distances: initialInDegrees,
    dataStructure: [queue.join(','), ''],
  });

  while (queue.length > 0) {
    const u = queue.shift()!;
    sortedOrder.push(u);

    steps.push({
      description: `Dequeue ${u} and add it to the sorted order.`,
      currentNode: u,
      visited: new Set(sortedOrder),
      distances: { ...inDegree },
      dataStructure: [queue.join(','), sortedOrder.join(', ')],
    });

    for (const v of graph.adj[u] || []) {
      inDegree[v]--;
      steps.push({
        description: `Decrement in-degree of neighbor ${v} to ${inDegree[v]}.`,
        currentNode: u,
        neighbor: v,
        visited: new Set(sortedOrder),
        distances: { ...inDegree },
        highlightedEdge: { from: u, to: v, weight: 1 },
        dataStructure: [queue.join(','), sortedOrder.join(', ')],
      });

      if (inDegree[v] === 0) {
        queue.push(v);
        steps.push({
          description: `In-degree of ${v} is now 0. Add it to the queue.`,
          currentNode: u,
          neighbor: v,
          visited: new Set(sortedOrder),
          distances: { ...inDegree },
          dataStructure: [queue.join(','), sortedOrder.join(', ')],
        });
      }
    }
  }

  if (sortedOrder.length !== graph.nodes.length) {
     steps.push({
      description: "Error: Graph has a cycle! Topological sort is not possible.",
      currentNode: null,
      dataStructure: ['', sortedOrder.join(', ')],
    });
  } else {
    steps.push({
      description: "Queue is empty. The final topological sort is complete.",
      currentNode: null,
      visited: new Set(sortedOrder),
      distances: { ...inDegree },
      dataStructure: ['', sortedOrder.join(', ')],
    });
  }

  return steps;
};