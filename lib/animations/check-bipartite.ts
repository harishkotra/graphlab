import type { GraphData, Step } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 100, y: 200 },
    { id: 'B', x: 250, y: 100 },
    { id: 'C', x: 250, y: 300 },
    { id: 'D', x: 400, y: 100 },
    { id: 'E', x: 400, y: 300 },
    { id: 'F', x: 550, y: 200 },
  ],
  adj: {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'E'],
    'D': ['B', 'F'],
    'E': ['C', 'F'],
    'F': ['D', 'E', 'B'], // This edge makes it non-bipartite: B-F
  },
};

export const dataStructureName = 'Queue';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">What is a Bipartite Graph?</h3>
  <p>
    A bipartite graph is a graph whose vertices can be divided into two disjoint and independent sets, U and V, such that every edge connects a vertex in U to one in V. In simpler terms, you can color the graph with just two colors, where no two adjacent vertices have the same color.
  </p>
  <p>
    This animation uses Breadth-First Search (BFS) to check for bipartiteness. We start with a node and color it blue. All its neighbors are colored orange, their neighbors blue, and so on. If we ever find an edge that connects two nodes of the <strong>same color</strong>, the graph is not bipartite. This conflicting edge will be highlighted in red.
  </p>
`;

export const generateSteps = (graph: GraphData, startNode: string): Step[] => {
  const steps: Step[] = [];
  const colors: Record<string, 'color1' | 'color2' | 'uncolored'> = {};
  graph.nodes.forEach(n => colors[n.id] = 'uncolored');
  let isBipartite = true;
  
  const createStep = (desc: string, queue: string[], currentNode: string | null = null, neighbor: string | null = null, conflictEdge: { from: string, to: string } | null = null) => {
    steps.push({
      dataStructure: [...queue],
      currentNode: currentNode,
      neighbor: neighbor,
      description: desc,
      nodeColors: { ...colors },
      conflictingEdge: conflictEdge,
    });
  };

  createStep('Start. All nodes are uncolored.', []);

  for (const node of graph.nodes) {
    if (colors[node.id] === 'uncolored' && isBipartite) {
      const queue = [node.id];
      colors[node.id] = 'color1';
      createStep(`Start traversal from ${node.id}. Color it blue.`, queue);
      
      while (queue.length > 0) {
        const u = queue.shift()!;
        const parentColor = colors[u];
        const childColor = parentColor === 'color1' ? 'color2' : 'color1';

        for (const v of graph.adj[u]) {
           createStep(`From ${u}, exploring neighbor ${v}.`, queue, u, v);
          if (colors[v] === 'uncolored') {
            colors[v] = childColor;
            queue.push(v);
            createStep(`Coloring ${v} ${childColor === 'color1' ? 'blue' : 'orange'} and adding to queue.`, queue, u, v);
          } else if (colors[v] === parentColor) {
            isBipartite = false;
            createStep(`Conflict! Edge (${u}, ${v}) connects two nodes of the same color.`, queue, u, v, { from: u, to: v });
            break;
          }
        }
        if (!isBipartite) break;
      }
    }
    if (!isBipartite) break;
  }

  if (isBipartite) {
    createStep('Traversal complete. No conflicts found. The graph is bipartite.', []);
  } else {
    createStep('The graph is not bipartite.', []);
  }

  return steps;
};