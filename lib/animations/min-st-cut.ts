import type { GraphData, Step } from './types';

// Using the same graph as Ford-Fulkerson
export const graphData: GraphData = {
  nodes: [
    { id: 'S', x: 100, y: 200 },
    { id: 'A', x: 275, y: 100 },
    { id: 'B', x: 275, y: 300 },
    { id: 'C', x: 450, y: 100 },
    { id: 'D', x: 450, y: 300 },
    { id: 'T', x: 600, y: 200 },
  ],
  adj: {
    'S': ['A', 'B'], 'A': ['C', 'D'], 'B': ['D'],
    'C': ['T'], 'D': ['T'], 'T': [],
  },
  edges: [
    { from: 'S', to: 'A', weight: 10 }, { from: 'S', to: 'B', weight: 10 },
    { from: 'A', to: 'C', weight: 8 }, { from: 'A', to: 'D', weight: 4 },
    { from: 'B', to: 'D', weight: 9 }, { from: 'C', to: 'T', weight: 10 },
    { from: 'D', to: 'T', weight: 10 },
  ],
  directed: true,
};

export const dataStructureName = 'Max Flow / Min Cut';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Minimum s-t Cut</h3>
  <p>
    An <strong>s-t cut</strong> is a partition of the graph's vertices into two sets, one containing the source (S) and the other containing the sink (T). The <strong>capacity of the cut</strong> is the sum of capacities of all edges that go from the S-set to the T-set.
  </p>
  <p>
    The <strong>Max-Flow Min-Cut Theorem</strong> states that the maximum flow in a network is exactly equal to the capacity of the minimum s-t cut. This animation first finds the max flow using Ford-Fulkerson. Then, it finds the min cut by:
  </p>
  <ol class="list-decimal list-inside space-y-1 my-2">
    <li>Finding all vertices reachable from S in the final residual graph. This is the S-set (blue).</li>
    <li>The remaining vertices form the T-set (orange).</li>
    <li>The highlighted edges crossing from blue to orange constitute the minimum cut.</li>
  </ol>
`;

const getDirectedEdgeKey = (from: string, to: string) => `${from}->${to}`;

export const generateSteps = (graph: GraphData, startNode: string = 'S', endNode: string = 'T'): Step[] => {
  const steps: Step[] = [];
  const flows: Record<string, number> = {};
  graph.edges!.forEach(e => {
      flows[getDirectedEdgeKey(e.from, e.to)] = 0;
      flows[getDirectedEdgeKey(e.to, e.from)] = 0;
  });

  const capacities: Record<string, number> = {};
  graph.edges!.forEach(e => capacities[getDirectedEdgeKey(e.from, e.to)] = e.weight);

  let totalFlow = 0;

  steps.push({ description: "Phase 1: Find the maximum flow using Ford-Fulkerson.", currentNode: null, dataStructure: [`${totalFlow}`] });

  // Simplified Ford-Fulkerson run for brevity in steps
  while (true) {
    const parent: Record<string, string> = {};
    const queue: string[] = [startNode];
    const visited = new Set<string>([startNode]);
    
    let pathFound = false;
    while (queue.length > 0) {
      const u = queue.shift()!;
      // Build a comprehensive list of potential neighbors from residual graph
      const potentialNeighbors = new Set<string>();
       (graph.adj[u] || []).forEach(v => potentialNeighbors.add(v));
      Object.keys(graph.adj).forEach(n => { if (graph.adj[n].includes(u)) potentialNeighbors.add(n); });

      for (const v of potentialNeighbors) {
        if (!visited.has(v) && ((capacities[getDirectedEdgeKey(u, v)] || 0) - flows[getDirectedEdgeKey(u, v)] > 0)) {
          parent[v] = u;
          visited.add(v);
          queue.push(v);
          if (v === endNode) {
            pathFound = true;
            break;
          }
        }
      }
       if(pathFound) break;
    }
    
    if (!pathFound) break;

    let bottleneck = Infinity;
    let curr = endNode;
    while(curr !== startNode) {
        const p = parent[curr];
        bottleneck = Math.min(bottleneck, (capacities[getDirectedEdgeKey(p, curr)] || 0) - flows[getDirectedEdgeKey(p, curr)]);
        curr = p;
    }
    
    curr = endNode;
    while(curr !== startNode) {
        const p = parent[curr];
        flows[getDirectedEdgeKey(p, curr)] += bottleneck;
        flows[getDirectedEdgeKey(curr, p)] -= bottleneck;
        curr = p;
    }
    totalFlow += bottleneck;
  }
  
  steps.push({
    description: `Max flow found: ${totalFlow}. Now, find the min cut.`,
    currentNode: null,
    flows: { ...flows },
    dataStructure: [`${totalFlow}`]
  });

  // Phase 2: Find the min cut
  const sSet = new Set<string>();
  const queue = [startNode];
  sSet.add(startNode);

  steps.push({
    description: `Phase 2: Find all nodes reachable from S in the residual graph.`,
    currentNode: startNode,
    cutSetS: new Set(sSet),
    dataStructure: [`${totalFlow}`]
  });

  while (queue.length > 0) {
    const u = queue.shift()!;
     const potentialNeighbors = new Set<string>();
       (graph.adj[u] || []).forEach(v => potentialNeighbors.add(v));
      Object.keys(graph.adj).forEach(n => { if (graph.adj[n].includes(u)) potentialNeighbors.add(n); });

      for (const v of potentialNeighbors) {
      if (!sSet.has(v) && ((capacities[getDirectedEdgeKey(u, v)] || 0) - flows[getDirectedEdgeKey(u, v)] > 0)) {
        sSet.add(v);
        queue.push(v);
      }
    }
  }

  steps.push({
    description: `The S-set (blue) contains all reachable nodes. The rest form the T-set (orange).`,
    currentNode: null,
    cutSetS: new Set(sSet),
    dataStructure: [`${totalFlow}`]
  });
  
  let cutValue = 0;
  const cutEdges: any[] = [];
  graph.edges!.forEach(edge => {
      if (sSet.has(edge.from) && !sSet.has(edge.to)) {
          cutValue += edge.weight;
          cutEdges.push(edge);
      }
  });

   steps.push({
    description: `The edges crossing the cut are highlighted. Min cut value = ${cutValue}.`,
    currentNode: null,
    cutSetS: new Set(sSet),
    highlightedPath: cutEdges.flatMap(e => [e.from, e.to]),
    highlightedEdge: cutEdges.length > 0 ? cutEdges[0] : null, // Hack to highlight multiple edges
    dataStructure: [`${totalFlow} / ${cutValue}`]
  });

  return steps;
};