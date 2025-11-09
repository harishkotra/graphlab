import type { GraphData, Step } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 100, y: 150 }, { id: 'B', x: 250, y: 100 },
    { id: 'C', x: 250, y: 200 }, { id: 'D', x: 400, y: 100 },
    { id: 'E', x: 400, y: 200 }, { id: 'F', x: 550, y: 150 },
    { id: 'G', x: 550, y: 250 },
  ],
  adj: {
    'A': ['B'], 
    // FIX: Merged duplicate 'B' properties.
    'B': ['C', 'D'], 
    'C': ['A'],
    'D': ['E'], 'E': ['F'], 'F': ['D', 'G'],
    'G': [],
  },
  edges: [
    { from:'A',to:'B',weight:1}, { from:'B',to:'C',weight:1}, { from:'C',to:'A',weight:1},
    { from:'B',to:'D',weight:1}, { from:'D',to:'E',weight:1}, { from:'E',to:'F',weight:1},
    { from:'F',to:'D',weight:1}, { from:'F',to:'G',weight:1},
  ],
  directed: true,
};

export const dataStructureName = 'Finish Order Stack';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Strongly Connected Components (SCCs)</h3>
  <p>
    In a directed graph, a <strong>Strongly Connected Component (SCC)</strong> is a subgraph where for any two vertices <code>u</code> and <code>v</code> within the component, there is a path from <code>u</code> to <code>v</code> AND a path from <code>v</code> to <code>u</code>.
  </p>
  <p>
    This animation uses <strong>Kosaraju's Algorithm</strong>, which finds all SCCs in two passes:
  </p>
  <ol class="list-decimal list-inside space-y-1 my-2">
    <li><strong>Pass 1:</strong> Run a DFS on the original graph to determine the "finishing times" of vertices. The vertices are pushed onto a stack in the order they are finished.</li>
    <li><strong>Pass 2:</strong> Compute the transpose (reverse all edges) of the graph.</li>
    <li><strong>Pass 3:</strong> Run DFS on the transposed graph, processing vertices in the order popped from the stack. Each tree in the resulting DFS forest is a distinct SCC.</li>
  </ol>
`;

export const generateSteps = (graph: GraphData): Step[] => {
  const steps: Step[] = [];
  const visited = new Set<string>();
  const finishStack: string[] = [];

  // Pass 1: DFS on original graph to get finish order
  const dfs1 = (u: string) => {
    visited.add(u);
    for (const v of graph.adj[u] || []) {
      if (!visited.has(v)) dfs1(v);
    }
    finishStack.push(u);
  };
  
  graph.nodes.forEach(n => { if (!visited.has(n.id)) dfs1(n.id); });

  steps.push({
    description: "Pass 1 (DFS) complete. Vertices are ordered by finishing time.",
    currentNode: null,
    dataStructure: [...finishStack].reverse(),
  });

  // Pass 2: Transpose graph
  const transposedAdj: Record<string, string[]> = {};
  graph.nodes.forEach(n => transposedAdj[n.id] = []);
  graph.edges!.forEach(e => {
      transposedAdj[e.to].push(e.from);
  });

  steps.push({
    description: "Pass 2: Graph edges are reversed (transposed).",
    currentNode: null,
    dataStructure: [...finishStack].reverse(),
    // We can't easily show the transposed graph, so the description must suffice.
    // A better implementation would update GraphAnimation to take a graph per step.
  });

  // Pass 3: DFS on transposed graph
  visited.clear();
  const components: Record<string, string> = {};
  let componentId = 0;
  while (finishStack.length > 0) {
    const u = finishStack.pop()!;
    if (!visited.has(u)) {
      const component: string[] = [];
      const dfs2 = (v: string) => {
        visited.add(v);
        component.push(v);
        components[v] = String(componentId);
        for (const neighbor of transposedAdj[v] || []) {
          if (!visited.has(neighbor)) dfs2(neighbor);
        }
      };
      dfs2(u);
      steps.push({
        description: `Found SCC {${component.join(', ')}}.`,
        currentNode: null,
        nodeSets: { ...components },
        dataStructure: [...finishStack].reverse(),
      });
      componentId++;
    }
  }
  
  steps.push({
    description: "Algorithm complete. All SCCs found and colored.",
    currentNode: null,
    nodeSets: { ...components },
    dataStructure: [],
  });
  
  return steps;
};